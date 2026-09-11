import { promises as fs } from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'

/** Media extensions that travel with the vault and get copied into the build. */
export const MEDIA_EXTENSIONS = new Set([
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.webp',
  '.svg',
  '.avif',
  '.bmp',
])

/** Directories inside the vault that never take part in the published site. */
export const IGNORED_DIRECTORIES = new Set([
  '.git',
  '.obsidian',
  '.trash',
  '.claude',
  '.agents',
  '.github',
  'node_modules',
  'templates',
])

export interface NoteSource {
  /** Absolute path on disk. */
  file: string
  /** POSIX path relative to the vault root, e.g. `前端/Vue/响应式.md`. */
  relative: string
  /** Route path, e.g. `/notes/前端/Vue/响应式`. */
  route: string
  /** Folder segments below the vault root. */
  segments: string[]
  /** Frontmatter, parsed leniently. */
  data: Record<string, string | string[]>
  /** Body with the frontmatter block stripped. */
  body: string
  /** Last write time, used when the note carries no date. */
  mtime: Date
}

export interface VaultAsset {
  /** Absolute path on disk. */
  file: string
  /** POSIX path relative to the vault root. */
  relative: string
}

export interface VaultScan {
  notes: NoteSource[]
  assets: VaultAsset[]
}

export const toPosix = (value: string) => value.split(path.sep).join('/')

/** Turns one path segment into a readable, URL-safe slug (`COD 80` → `COD-80`). */
export const slugSegment = (value: string) => value.replace(/\s+/g, '-').trim()

/** Builds the site route for a vault-relative markdown path. */
export function routeFor(relative: string): string {
  const withoutExtension = relative.replace(/\.(md|markdown)$/i, '')
  const slugged = withoutExtension.split('/').map(slugSegment).join('/')
  return `/notes/${slugged}`
}

/** Decodes a URL pathname, tolerating malformed percent-escapes. */
export function safeDecodeURI(value: string): string {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

/**
 * Canonical form used for every route comparison. A note's stored path is
 * decoded and its hyphenated segments are collapsed back to spaces, so
 * `引入-Crate` (what the browser sends) matches `引入 Crate` (what the vault
 * says) without either side having to know about the other's escaping.
 */
export function normalizeRoute(value: string): string {
  return safeDecodeURI(value)
    .replace(/\/+$/, '')
    .replace(/[-\u2010-\u2015]+/g, ' ')
    .replace(/\s+/g, ' ')
    .toLowerCase()
}

/** Collapses `..` / `.` segments in a vault-relative POSIX path. */
export function normalizeVaultPath(value: string): string {
  const parts: string[] = []
  for (const segment of value.split('/')) {
    if (!segment || segment === '.') continue
    if (segment === '..') {
      parts.pop()
      continue
    }
    parts.push(segment)
  }
  return parts.join('/')
}

/**
 * Parses a YAML-ish frontmatter block without pulling in a YAML engine. The
 * vault only ever uses flat scalars, inline arrays and dash lists, so a
 * forgiving line reader is both smaller and more predictable than a full
 * parser that would throw on a stray colon.
 */
export function parseFrontmatter(source: string): {
  data: Record<string, string | string[]>
  body: string
} {
  const normalized = source.replace(/^\uFEFF/, '')
  if (!normalized.startsWith('---')) return { data: {}, body: normalized }

  // A note that merely *opens* with a horizontal rule has no frontmatter, and
  // treating it as an unterminated block would swallow the whole document —
  // one note in the vault is exactly `---\n# 类型收缩`, and it rendered blank
  // until this guard existed.
  const end = normalized.indexOf('\n---', 3)
  if (end < 0) return { data: {}, body: normalized }

  const data: Record<string, string | string[]> = {}
  let listKey: string | null = null

  for (const line of normalized.slice(4, end).split(/\r?\n/)) {
    const listItem = line.match(/^\s+-\s+(.+)$/)
    if (listItem && listKey && Array.isArray(data[listKey])) {
      ;(data[listKey] as string[]).push(unquote(listItem[1]))
      continue
    }

    const pair = line.match(/^([\w\u4e00-\u9fff-]+):\s*(.*)$/)
    if (!pair) continue

    const [, key, rawValue] = pair
    const value = rawValue.trim()

    if (!value) {
      data[key] = []
      listKey = key
      continue
    }

    const inlineList = value.match(/^\[(.*)\]$/)
    if (inlineList) {
      data[key] = inlineList[1]
        .split(',')
        .map((item) => unquote(item))
        .filter(Boolean)
      listKey = null
      continue
    }

    data[key] = unquote(value)
    listKey = null
  }

  return { data, body: normalized.slice(end + 4) }
}

const unquote = (value: string) =>
  value.trim().replace(/^['"]/, '').replace(/['"]$/, '').trim()

/** Normalises frontmatter that may be a string list or a comma separated string. */
export function readList(value: string | string[] | undefined): string[] {
  if (!value) return []
  if (Array.isArray(value)) return value.map((item) => item.trim()).filter(Boolean)
  return value
    .split(/[,，]/)
    .map((item) => item.trim())
    .filter(Boolean)
}

/** Walks the vault once, collecting markdown notes and media attachments. */
export async function scanVault(vaultDir: string): Promise<VaultScan> {
  const notes: NoteSource[] = []
  const assets: VaultAsset[] = []

  const walk = async (dir: string): Promise<void> => {
    const entries = await fs.readdir(dir, { withFileTypes: true })

    for (const entry of entries) {
      if (entry.name.startsWith('.') && entry.isDirectory()) continue
      if (IGNORED_DIRECTORIES.has(entry.name)) continue

      const full = path.join(dir, entry.name)

      if (entry.isDirectory()) {
        await walk(full)
        continue
      }

      if (!entry.isFile()) continue

      const extension = path.extname(entry.name).toLowerCase()
      const relative = toPosix(path.relative(vaultDir, full))

      if (extension === '.md') {
        if (entry.name.toLowerCase() === 'readme.md') continue
        const segments = relative.split('/').slice(0, -1).map(slugSegment)
        notes.push({
          file: full,
          relative,
          route: routeFor(relative),
          segments,
          data: {},
          body: '',
          mtime: (await fs.stat(full)).mtime,
        })
        continue
      }

      if (MEDIA_EXTENSIONS.has(extension)) assets.push({ file: full, relative })
    }
  }

  await walk(vaultDir)

  for (const note of notes) {
    const source = await fs.readFile(note.file, 'utf8')
    const { data, body } = parseFrontmatter(source)
    note.data = data
    note.body = body
  }

  return { notes, assets }
}

/** Stable, collision-free public name for a vault asset. */
export function assetPublicName(relative: string, seed: string): string {
  const hash = createHash('sha1').update(seed).digest('hex').slice(0, 7)
  const base = path.basename(relative).replace(/[^\w.\u4e00-\u9fff-]+/g, '-')
  return `${hash}-${base}`
}

/** `2026-07-30` for a Date, using local time so the vault's dates stay put. */
export function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

const HTML_BLOCK = /^\s*<[a-zA-Z!/]/m

/**
 * Obsidian notes are free-form, and this vault writes markup as *content*: it
 * has 1000+ inline code spans like `` `<script>` `` and `<div>` as literal text.
 * If markdown-it is allowed to parse HTML, every one of those becomes a real
 * element — the page grows a stray `<script>` document or an unclosed `<div>`
 * that swallows the rest of the note.
 *
 * The house style here is Markdown, not HTML, so raw markup is rendered as
 * readable text. The exception is a small set of inline formatting tags that
 * authors reach for because Markdown has no equivalent (`<br>`, `<sup>`,
 * `<kbd>`); those are cheap and cannot restructure the document.
 */
export function escapeStrayMarkup(source: string): string {
  if (!HTML_BLOCK.test(source)) return source

  const segments = source.split(/(```[\s\S]*?```|~~~[\s\S]*?~~~)/g)
  return segments
    .map((segment, index) => {
      if (index % 2 === 1) return segment
      // Inline code is already literal; touching it would double-escape.
      return segment
        .split(/(`[^`\n]*`)/g)
        .map((part, partIndex) => (partIndex % 2 === 1 ? part : escapeBareHtml(part)))
        .join('')
    })
    .join('')
}

/** Inline-only tags that are safe to keep and that Markdown cannot express. */
const ALLOWED_TAGS = new Set(['br', 'sup', 'sub', 'kbd', 'mark', 'small', 'u', 'ins'])

/** Escapes every angle bracket except the inline tags above. */
function escapeBareHtml(segment: string): string {
  return segment.replace(
    /<\/?([a-zA-Z][\w:-]*)((?:[^<>"']|"[^"]*"|'[^']*')*)\/?>/g,
    (match, tag: string) =>
      ALLOWED_TAGS.has(tag.toLowerCase())
        ? match
        : match.replaceAll('<', '&lt;').replaceAll('>', '&gt;'),
  )
}
