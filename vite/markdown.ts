import MarkdownIt from 'markdown-it'
import anchor from 'markdown-it-anchor'
import taskLists from 'markdown-it-task-lists'
import { codeToHtml, type BundledLanguage } from 'shiki'
import { normalizeVaultPath } from './vault'

export interface RenderHeading {
  depth: number
  id: string
  text: string
}

export interface RenderResult {
  html: string
  headings: RenderHeading[]
}

export interface RenderContext {
  /**
   * Maps a vault-relative markdown path (`前端/Vue/响应式.md`) to a site route.
   * Returns `null` for notes that are not published.
   */
  resolveNote: (relativePath: string) => string | null
  /**
   * Obsidian resolves bare `[[note]]` links by file name anywhere in the vault,
   * so name lookups get their own resolver instead of a magic path prefix.
   */
  resolveNoteByName: (name: string) => string | null
  /** Absolute vault-relative path of the note being rendered. */
  from: string
  /** Rewrites a vault-relative asset path into a public asset URL. */
  resolveAsset: (vaultRelativeAsset: string) => string | null
}

const HEADING_DEPTHS = new Set([2, 3, 4])

/**
 * Fenced blocks are replaced with a placeholder token first, then swapped for
 * the highlighted HTML once Shiki has run.
 *
 * Two details matter here and both were found the hard way:
 *
 *  1. The token must be something a note can never contain. A readable marker
 *     like `@@pressidian-code:0@@` collides with real content — the vault has
 *     notes *about* `String.replace`, whose snippets contain the replacement
 *     pattern `$&`, and a naive `String.replace(placeholder, html)` then
 *     expands `$&` and splices the highlighted block into itself.
 *  2. Substitution goes through a replacer *function*. `String.replace` reads
 *     `$&`, `$'`, `` $` `` and `$1` in a string replacement, so any highlighted
 *     code containing `$` would corrupt the output.
 */
const codeToken = (index: number) => `\u0000pd-code-${index}\u0000`
const CODE_TOKEN_PATTERN = /\u0000pd-code-(\d+)\u0000/g

let highlighterPromise: Promise<{
  codeToHtml: typeof codeToHtml
  languages: Set<string>
}> | null = null

async function getHighlighter() {
  highlighterPromise ??= (async () => {
    // `shiki` ships a lazily-created singleton; importing here keeps the module
    // out of the initial client bundle until a note is actually opened.
    const { bundledLanguages } = await import('shiki')
    return {
      codeToHtml,
      languages: new Set(Object.keys(bundledLanguages)),
    }
  })()
  return highlighterPromise
}

export function createMarkdown() {
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    breaks: false,
    typographer: false,
  })

  const pending = new Map<number, { code: string; lang: string }>()
  let codeIndex = 0

  md.use(anchor, {
    level: [2, 3, 4],
    permalink: false,
    slugify: slugify,
  })

  md.use(taskLists, { enabled: true, label: true, labelAfter: true })

  // Fenced code: stash the raw source and emit a token we swap later.
  md.renderer.rules.fence = (tokens, idx) => {
    const token = tokens[idx]
    const info = token.info.trim().split(/\s+/)[0] ?? ''
    const tokenId = codeIndex++
    pending.set(tokenId, { code: token.content, lang: info })
    return codeToken(tokenId)
  }

  md.renderer.rules.image = (tokens, idx) => {
    const token = tokens[idx]
    const src = token.attrGet('src') ?? ''
    const alt = token.content || ''
    return `<img src="${escapeAttribute(src)}" alt="${escapeAttribute(alt)}" loading="lazy" decoding="async" />`
  }

  return { md, pending, resetPending: () => pending.clear() }
}

const escapeAttribute = (value: string) =>
  value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;')

/** GitHub/Obsidian-compatible heading slugs, readable when they end up in a URL. */
export function slugify(value: string): string {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[\s\u3000]+/g, '-')
    .replace(/[^\w\u4e00-\u9fff-]+/g, '')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')
  return slug || 'section'
}

/**
 * Rewrites anything that points outside the note before markdown-it sees it:
 * Obsidian wiki links, attachment embeds and vault-relative markdown links.
 * Working on the source keeps every path decision in one place instead of
 * spreading it across renderer rules.
 */
export function rewriteObsidianSyntax(source: string, context: RenderContext): string {
  const { from, resolveNote, resolveNoteByName, resolveAsset } = context
  const noteDirectory = from.includes('/') ? from.slice(0, from.lastIndexOf('/')) : ''

  const resolveRelative = (target: string) => {
    const decoded = safeDecode(target).split('#')[0]?.split('?')[0] ?? ''
    if (!decoded || /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(decoded)) return decoded
    const joined = decoded.startsWith('/')
      ? decoded.slice(1)
      : [noteDirectory, decoded].filter(Boolean).join('/')
    return normalizeVaultPath(joined)
  }

  let output = source

  // ![[image.png]] and ![[image.png|300]]
  output = output.replace(
    /!\[\[([^\]|]+)(?:\|[^\]]*)?\]\]/g,
    (_match, rawTarget: string) => {
      const target = rawTarget.trim()
      const resolved = resolveRelative(target)
      const asset = resolveAsset(resolved)
      if (asset) {
        const name = target.split('/').pop()?.replace(/\.[^.]+$/, '') ?? 'attachment'
        return `![${name}](${asset})`
      }
      const route = resolveNote(ensureMarkdown(resolved))
      if (route) return `[${target}](${route})`
      return `\`${target}\``
    },
  )

  // [[note]], [[note|alias]], [[note#heading]]
  output = output.replace(
    /\[\[([^\]|#]+)(?:#([^\]|]+))?(?:\|([^\]]+))?\]\]/g,
    (_match, rawTarget: string, heading: string | undefined, alias: string | undefined) => {
      const target = rawTarget.trim()
      const label = (alias ?? target).trim()
      const resolved = resolveRelative(target)

      const withHeading = (route: string) =>
        heading ? `${route}#${slugify(heading)}` : route

      const direct = resolveNote(ensureMarkdown(resolved))
      if (direct) return `[${label}](${withHeading(direct)})`

      const byName = resolveNoteByName(target)
      if (byName) return `[${label}](${withHeading(byName)})`

      return label
    },
  )

  // Standard markdown links that point at vault files.
  output = output.replace(
    /(!?)\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g,
    (match, bang: string, label: string, rawHref: string) => {
      if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(rawHref)) return match

      const [pathPart, hashPart] = rawHref.split('#')
      const resolved = resolveRelative(pathPart ?? '')

      if (bang === '!') {
        const asset = resolveAsset(resolved)
        return asset ? `![${label}](${asset})` : `\`${label || resolved}\``
      }

      if (/\.md$/i.test(resolved)) {
        const route = resolveNote(resolved)
        if (route) return `[${label}](${hashPart ? `${route}#${hashPart}` : route})`
        return label || resolved
      }

      const asset = resolveAsset(resolved)
      if (asset) return `[${label}](${asset})`

      return match
    },
  )

  return output
}

const ensureMarkdown = (value: string) => (/\.md$/i.test(value) ? value : `${value}.md`)

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

/** Parses and renders one note, then highlights its fenced blocks. */
export async function renderNote(
  markdownSource: string,
  context: RenderContext,
): Promise<RenderResult> {
  const { md, pending, resetPending } = createMarkdown()
  resetPending()

  const rewritten = rewriteObsidianSyntax(markdownSource, context)
  const rawHtml = md.render(rewritten)

  const headings: RenderHeading[] = []
  const tokens = md.parse(rewritten, {})
  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index]
    if (!token || token.type !== 'heading_open') continue
    const depth = Number(token.tag.slice(1))
    if (!HEADING_DEPTHS.has(depth)) continue
    const inline = tokens[index + 1]
    const text = (inline?.children ?? [])
      .filter((child) => child.type === 'text' || child.type === 'code_inline')
      .map((child) => child.content)
      .join('')
      .trim()
    if (!text) continue
    headings.push({ depth, id: token.attrGet('id') ?? slugify(text), text })
  }

  const { codeToHtml: highlight, languages } = await getHighlighter()

  const blocks = new Map<number, string>()
  await Promise.all(
    [...pending].map(async ([tokenId, block]) => {
      blocks.set(tokenId, await highlightBlock(block, highlight, languages))
    }),
  )

  const html = rawHtml.replace(CODE_TOKEN_PATTERN, (match, tokenId: string) => {
    const replacement = blocks.get(Number(tokenId))
    return replacement ?? match
  })

  return { html, headings }
}

async function highlightBlock(
  block: { code: string; lang: string },
  highlight: typeof codeToHtml,
  languages: Set<string>,
): Promise<string> {
  const language = normalizeLanguage(block.lang, languages)
  const code = block.code.replace(/\n$/, '')

  try {
    const rendered = await highlight(code, {
      lang: language as BundledLanguage,
      themes: { light: 'github-light', dark: 'github-dark-dimmed' },
      defaultColor: false,
    })
    return rendered.replace(
      '<pre class="shiki',
      `<pre data-lang="${escapeAttribute(block.lang || language)}" class="shiki`,
    )
  } catch {
    return `<pre data-lang="${escapeAttribute(block.lang)}" class="shiki-fallback"><code>${escapeHtml(
      code,
    )}</code></pre>`
  }
}

const LANGUAGE_ALIASES: Record<string, string> = {
  vue: 'vue',
  vuejs: 'vue',
  sh: 'bash',
  shell: 'bash',
  zsh: 'bash',
  console: 'bash',
  js: 'javascript',
  ts: 'typescript',
  tsx: 'tsx',
  jsx: 'jsx',
  yml: 'yaml',
  md: 'markdown',
  py: 'python',
  rb: 'ruby',
  rs: 'rust',
  golang: 'go',
  text: 'text',
  txt: 'text',
  plaintext: 'text',
  '': 'text',
}

function normalizeLanguage(lang: string, available: Set<string>): string {
  const key = lang.toLowerCase().trim()
  const aliased = LANGUAGE_ALIASES[key] ?? key
  if (available.has(aliased)) return aliased
  if (available.has(key)) return key
  return 'text'
}

export function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}
