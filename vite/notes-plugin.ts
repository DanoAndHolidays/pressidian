import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Connect, Plugin, ResolvedConfig } from 'vite'

import type { NoteDocument, NoteMeta, NoteStatus } from '../src/lib/notes/types'
import { publishDocuments } from './documents'
import { renderNote } from './markdown'
import {
  assetPublicName,
  escapeStrayMarkup,
  formatDate,
  normalizeRoute,
  normalizeVaultPath,
  readList,
  scanVault,
  type NoteSource,
  type VaultAsset,
} from './vault'

/**
 * `virtual:notes-meta` is tiny and always loaded; `virtual:notes` carries every
 * rendered document and is only fetched when a note is actually opened. The
 * split keeps the homepage cheap on a vault with hundreds of notes.
 */
const META_MODULE_ID = 'virtual:notes-meta'
const RESOLVED_META_MODULE_ID = '\0' + META_MODULE_ID

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
export const VAULT_DIR = path.join(root, 'content', 'notes', 'obsidian')
/** Vault assets are published here, mirroring the upstream folder layout. */
const ASSET_PUBLIC_DIR = path.join(root, 'public', 'vault')
/** Inspectable snapshot of the graph, useful for diffing content changes. */
const INDEX_FILE = path.join(root, 'content', '.index.json')
/**
 * Compiled note bodies, published as static JSON.
 *
 * A virtual module cannot carry this payload reliably: output-format interop
 * rewrites the namespace, so a dynamic `import()` of it arrives with minified
 * export aliases instead of the names it was generated with. Static JSON
 * sidesteps the bundler entirely and stays cacheable.
 */
const DOCUMENTS_DIR = path.join(root, 'public', 'notes')

export interface ContentIndex {
  notes: NoteMeta[]
  /** Eagerly rendered documents; empty when rendering is deferred. */
  documents: Record<string, NoteDocument>
  /** Deferred renderers, one per note route. */
  renderers: Record<string, () => Promise<NoteDocument>>
  /** Normalized route → canonical route, so URL variants resolve. */
  routeIndex: Record<string, string>
  assets: VaultAsset[]
  scannedAt: string
  /** Non-fatal problems worth surfacing in the console. */
  warnings: string[]
}

const STATUS_ALIASES: Record<string, NoteStatus> = {
  evergreen: 'evergreen',
  evergreens: 'evergreen',
  常青: 'evergreen',
  常青笔记: 'evergreen',
  growing: 'growing',
  生长: 'growing',
  生长中: 'growing',
  seedling: 'seedling',
  幼苗: 'seedling',
  萌芽: 'seedling',
}

function readStatus(value: string | string[] | undefined): NoteStatus | null {
  if (!value || Array.isArray(value)) return null
  return STATUS_ALIASES[value.trim().toLowerCase()] ?? STATUS_ALIASES[value.trim()] ?? null
}

/**
 * The vault carries no `status:` frontmatter, so maturity is inferred from the
 * shape of the note in the graph: heavily referenced notes have been revisited
 * and linked from elsewhere (evergreen), notes that both link out and are long
 * enough are actively maintained (growing), the rest are fresh seedlings.
 * An explicit frontmatter value always wins.
 */
function deriveStatus(input: {
  degree: number
  inbound: number
  outbound: number
  weight: number
}): NoteStatus {
  const { degree, inbound, outbound, weight } = input
  if (degree >= 5 && inbound >= 2 && weight >= 1200) return 'evergreen'
  if (degree >= 2 && weight >= 500 && (inbound >= 1 || outbound >= 2)) return 'growing'
  return 'seedling'
}

function estimateReadingTime(body: string): { minutes: number; weight: number } {
  const prose = body
    .replace(/```[\s\S]*?```/g, '')
    .replace(/~~~[\s\S]*?~~~/g, '')
    .replace(/<[^>]+>/g, '')
  const han = (prose.match(/[\u3400-\u9fff]/g) ?? []).length
  const latin = (prose.match(/[A-Za-z0-9_]+/g) ?? []).length
  return {
    minutes: Math.max(1, Math.ceil(han / 350 + latin / 220)),
    weight: han + latin,
  }
}

const firstHeading = (body: string) => body.match(/^#\s+(.+)$/m)?.[1]?.trim()

/**
 * Repository plumbing that ships alongside the vault but is not a note. The
 * sync script already drops `README.md`; these are the remaining fixtures.
 */
const NON_NOTE_FILES = new Set(['claude.md', 'agents.md'])

const isPublishable = (note: NoteSource) => {
  if (NON_NOTE_FILES.has(path.basename(note.relative).toLowerCase())) return false
  // A note with no heading, no frontmatter title and almost no body is a stub.
  if (firstHeading(note.body) || typeof note.data.title === 'string') return true
  return note.body.replace(/\s+/g, '').length > 80
}

/**
 * Date shapes, in order of trustworthiness. Each requires a boundary on the
 * left so a date embedded in a longer token is not mistaken for one.
 */
const LEADING_ISO_DATE = /^(20\d{2})[-.](\d{1,2})[-.](\d{1,2})(?=[-_.\s]|$)/
const ISO_DATE = /(?:^|[\s(（[【:：])(20\d{2})[-/.](\d{1,2})[-/.](\d{1,2})\b/
const CJK_DATE = /(?:^|[\s(（[【:：])(20\d{2})\s*年\s*(\d{1,2})\s*月\s*(\d{1,2})\s*日?/
/**
 * `8/11/2026` is ambiguous — August 11th to an American export, the 8th of
 * November to everyone else. Only the shapes that cannot mean two things are
 * accepted: a first component above 12 must be a day, and a second component
 * above 12 must also be a day. Everything else is left to the fallback rather
 * than guessing a date the note never stated.
 */
const US_DATE = /(?:^|[\s(（[【:：])(\d{1,2})\/(\d{1,2})\/(20\d{2})\b/

/**
 * Exported bookkeeping lines that read as noise inside a note card. Shared by
 * the description builder and the date reader, so it is declared before both.
 */
const STAT_PATTERN =
  /^(last\s*(format|modified|updated)\s*time|最后(修改|编辑|更新)时间|created|updated|date|aliases?|作者|来源)\s*[:：]/i
const BARE_URL = /^(?:https?:\/\/|www\.)\S+$/i

const pad = (value: string) => value.padStart(2, '0')
const buildDate = (year: string, month: string, day: string) =>
  `${year}-${pad(month)}-${pad(day)}`

/** Parses a US-ordered match, or `null` when both readings are plausible. */
function fromUsDate(match: RegExpMatchArray): string | null {
  const first = Number(match[1])
  const second = Number(match[2])
  const year = match[3] ?? ''
  if (first > 12 && second <= 12) return buildDate(year, match[2] ?? '1', match[1] ?? '1')
  if (second > 12 && first <= 12) return buildDate(year, match[1] ?? '1', match[2] ?? '1')
  return null
}

/** Every date the vault is willing to admit to, used to pick a sane fallback. */
function collectKnownDates(notes: NoteSource[]): Map<string, number> {
  const tally = new Map<string, number>()
  const bump = (iso: string) => tally.set(iso, (tally.get(iso) ?? 0) + 1)

  for (const note of notes) {
    const stem = path.basename(note.relative, '.md')
    const match =
      stem.match(LEADING_ISO_DATE) ??
      stem.match(ISO_DATE) ??
      stem.match(CJK_DATE) ??
      note.body.slice(0, 600).match(ISO_DATE) ??
      note.body.slice(0, 600).match(CJK_DATE)
    if (match) bump(buildDate(match[1] ?? '2026', match[2] ?? '1', match[3] ?? '1'))
  }

  return tally
}

/**
 * A `git clone` stamps every file with the checkout time, so `mtime` alone
 * would make 500 notes look like they were all written the same afternoon. The
 * vault carries no `date:` frontmatter either, but note titles often do
 * (`2026-07-30-仓库导入异常`). Preferred order: frontmatter → filename → the
 * opening of the body → the vault's prevailing date. The filename is checked
 * *before* the body because a leading date prefix is far more reliable than a
 * date that merely appears somewhere in the prose, and `mtime` is never used —
 * a checkout timestamp presented as a note's date is worse than no date.
 */
function inferDate(
  note: NoteSource,
  fallbackDate: string,
): { date: string; source: 'declared' | 'inferred' } {
  for (const key of ['updated', 'date', 'created', 'modified'] as const) {
    const raw = note.data[key]
    if (typeof raw !== 'string') continue
    const iso = raw.match(ISO_DATE) ?? raw.match(CJK_DATE)
    if (iso) return { date: buildDate(iso[1] ?? '2026', iso[2] ?? '1', iso[3] ?? '1'), source: 'declared' }
    const us = raw.match(US_DATE)
    const parsed = us ? fromUsDate(us) : null
    if (parsed) return { date: parsed, source: 'declared' }
  }

  const stem = path.basename(note.relative, '.md')
  const fromName = stem.match(LEADING_ISO_DATE) ?? stem.match(ISO_DATE) ?? stem.match(CJK_DATE)
  if (fromName) {
    return {
      date: buildDate(fromName[1] ?? '2026', fromName[2] ?? '1', fromName[3] ?? '1'),
      source: 'inferred',
    }
  }

  // Body dates are matched on a line that does not look like export metadata,
  // so `Last Format Time: 8/11/2026` cannot masquerade as the note's date.
  for (const line of note.body.split(/\r?\n/).slice(0, 40)) {
    if (STAT_PATTERN.test(line.trim())) continue
    const iso = line.match(ISO_DATE) ?? line.match(CJK_DATE)
    if (iso) {
      return {
        date: buildDate(iso[1] ?? '2026', iso[2] ?? '1', iso[3] ?? '1'),
        source: 'inferred',
      }
    }
    const us = line.match(US_DATE)
    const parsed = us ? fromUsDate(us) : null
    if (parsed) return { date: parsed, source: 'inferred' }
  }

  return { date: fallbackDate, source: 'inferred' }
}

function buildDescription(body: string, fallback: string): string {
  const stripped = body
    .replace(/```[\s\S]*?```/g, '')
    .replace(/~~~[\s\S]*?~~~/g, '')
    .replace(/^\s*\|.*$/gm, '')
    // Imported notes carry a `---` frontmatter fence and horizontal rules as
    // standalone blocks; both would otherwise become the note's "summary".
    .replace(/^\s*-{3,}\s*$/gm, '')

  for (const block of stripped.split(/\r?\n{2,}/)) {
    const text = block
      .replace(/^#{1,6}\s+.*$/gm, '')
      .replace(/^\s*>\s?/gm, '')
      .replace(/^\s*[-*+]\s+/gm, '')
      .replace(/^\s*\d+\.\s+/gm, '')
      .replace(/!\[\[[^\]]*\]\]/g, '')
      .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
      .replace(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      .replace(/[*_`~]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/^[-–—\s|]+/, '')
      .replace(/[-–—\s|]+$/, '')

    if (text.length < 12 || text.startsWith('<')) continue
    if (STAT_PATTERN.test(text) || BARE_URL.test(text)) continue
    return text.length > 118 ? `${text.slice(0, 118).trimEnd()}…` : text
  }

  return fallback
}

const decode = (value: string) => {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

const EMPTY_INDEX: Omit<ContentIndex, 'scannedAt'> = {
  notes: [],
  documents: {},
  renderers: {},
  routeIndex: {},
  assets: [],
  warnings: ['content/notes/obsidian 还没有内容，请先运行 npm run sync:obsidian'],
}

/** Builds the full note graph: metadata, link relations and rendered documents. */
export async function buildContentIndex(assetBase = '/vault/'): Promise<ContentIndex> {
  const warnings: string[] = []
  const scannedAt = new Date().toISOString()

  const vaultExists = await fs
    .stat(VAULT_DIR)
    .then((stat) => stat.isDirectory())
    .catch(() => false)
  if (!vaultExists) return { ...EMPTY_INDEX, scannedAt }

  const scanned = await scanVault(VAULT_DIR)
  const notes = scanned.notes.filter(isPublishable)
  const assets = scanned.assets
  if (!notes.length) return { ...EMPTY_INDEX, scannedAt }

  const byRelativePath = new Map<string, NoteSource>()
  const byRoute = new Map<string, NoteSource>()
  const byFileName = new Map<string, NoteSource[]>()
  for (const note of notes) {
    byRelativePath.set(note.relative.toLowerCase(), note)
    byRoute.set(normalizeRoute(note.route), note)
    const key = path.basename(note.relative, '.md').toLowerCase()
    byFileName.set(key, [...(byFileName.get(key) ?? []), note])
  }

  const noteDirectoryOf = (note: NoteSource) =>
    note.relative.includes('/') ? note.relative.slice(0, note.relative.lastIndexOf('/')) : ''

  const resolveVaultPath = (note: NoteSource, target: string): string =>
    normalizeVaultPath(
      target.startsWith('/')
        ? target.slice(1)
        : [noteDirectoryOf(note), target].filter(Boolean).join('/'),
    )

  const findNote = (relativePath: string) => byRelativePath.get(relativePath.toLowerCase())
  const findNoteByName = (name: string) => {
    const matches = byFileName.get(path.basename(name, '.md').toLowerCase())
    return matches?.length === 1 ? matches[0] : undefined
  }

  // --- asset lookup -------------------------------------------------------
  const assetByName = new Map<string, VaultAsset[]>()
  for (const asset of assets) {
    const key = path.basename(asset.relative).toLowerCase()
    assetByName.set(key, [...(assetByName.get(key) ?? []), asset])
  }
  const assetAlias = new Map<string, string>()
  for (const asset of assets) {
    assetAlias.set(asset.relative.toLowerCase(), assetPublicName(asset.relative, asset.relative))
  }

  // --- outgoing / incoming link graph ------------------------------------
  const outgoing = new Map<string, Set<string>>()
  const incoming = new Map<string, Set<string>>()

  for (const note of notes) {
    const found = new Set<string>()
    const register = (target: string) => {
      if (!target) return
      const hit = findNote(resolveVaultPath(note, target)) ?? findNoteByName(target)
      if (hit && hit.relative !== note.relative) found.add(hit.relative)
    }

    for (const match of note.body.matchAll(/!?\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|[^\]]+)?\]\]/g)) {
      // Embeds point at media far more often than at notes; only follow notes.
      const target = match[1].trim()
      if (match[0].startsWith('!') && /\.[a-z0-9]{2,5}$/i.test(target) && !/\.md$/i.test(target)) {
        continue
      }
      register(target)
    }

    for (const match of note.body.matchAll(/\[[^\]]*\]\(([^)\s]+)\)/g)) {
      const target = decode(match[1]).split('#')[0]?.split('?')[0] ?? ''
      if (!target || /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(target)) continue
      if (!/\.md$/i.test(target)) continue
      register(target)
    }

    outgoing.set(note.relative, found)
    for (const target of found) {
      const backlinks = incoming.get(target) ?? new Set<string>()
      backlinks.add(note.relative)
      incoming.set(target, backlinks)
    }
  }

  // --- metadata -----------------------------------------------------------
  const tagCache = new Map<string, string[]>()
  const tagsOf = (note: NoteSource) => {
    let tags = tagCache.get(note.relative)
    if (tags) return tags
    const explicit = readList(note.data.tags)
    const derived = note.segments.filter((segment) => segment.toLowerCase() !== 'obsidian')
    tags = explicit.length ? explicit.slice(0, 6) : derived.slice(-2).length ? derived.slice(-2) : ['笔记']
    tagCache.set(note.relative, tags)
    return tags
  }

  // Dates the vault actually states, so notes that state none can adopt the
  // prevailing one instead of pretending they were all edited at checkout time.
  const dateTally = collectKnownDates(notes)
  const prevailingDate =
    [...dateTally.entries()].sort((a, b) => b[1] - a[1] || b[0].localeCompare(a[0]))[0]?.[0] ??
    formatDate(new Date())

  const metas: NoteMeta[] = notes.map((note) => {
    const { minutes, weight } = estimateReadingTime(note.body)
    const inbound = incoming.get(note.relative)?.size ?? 0
    const outbound = outgoing.get(note.relative)?.size ?? 0
    const degree = inbound + outbound
    const { date, source } = inferDate(note, prevailingDate)

    return {
      title:
        (typeof note.data.title === 'string' && note.data.title) ||
        firstHeading(note.body) ||
        path.basename(note.relative, '.md'),
      description:
        (typeof note.data.description === 'string' && note.data.description) ||
        buildDescription(note.body, '一篇仍在生长的笔记。'),
      path: note.route,
      date,
      dateSource: source,
      tags: tagsOf(note),
      status:
        readStatus(note.data.status) ?? deriveStatus({ degree, inbound, outbound, weight }),
      readingTime: minutes,
      weight,
      segments: note.segments,
      degree,
      related: [],
    }
  })

  const metaByRelative = new Map(notes.map((note, index) => [note.relative, metas[index]]))
  const meaningfulDepth = (note: NoteSource) =>
    note.segments.filter((segment) => segment.toLowerCase() !== 'obsidian')

  // --- related notes: links first, then tags, then shared folder depth -----
  notes.forEach((note, index) => {
    const meta = metas[index]
    const scores = new Map<string, { score: number; relation: string }>()
    const consider = (relative: string, score: number, relation: string) => {
      if (relative === note.relative) return
      const previous = scores.get(relative)
      if (previous && previous.score >= score) return
      scores.set(relative, { score, relation })
    }

    for (const target of outgoing.get(note.relative) ?? []) consider(target, 100, '正文关联')
    for (const source of incoming.get(note.relative) ?? []) consider(source, 92, '反向链接')

    const directory = noteDirectoryOf(note)
    const first = meaningfulDepth(note)

    for (const candidate of notes) {
      if (candidate.relative === note.relative || scores.has(candidate.relative)) continue
      const second = meaningfulDepth(candidate)
      let depth = 0
      while (first[depth] && first[depth] === second[depth]) depth += 1

      const candidateTags = tagsOf(candidate)
      const sharedTags = meta.tags.filter((tag) => candidateTags.includes(tag)).length
      const sameDirectory = directory === noteDirectoryOf(candidate)
      const score = sharedTags * 4 + (sameDirectory ? 8 : 0) + depth
      if (score <= 0) continue
      consider(candidate.relative, score, sameDirectory ? '同一路径' : '共同主题')
    }

    meta.related = [...scores.entries()]
      .sort((a, b) => {
        if (b[1].score !== a[1].score) return b[1].score - a[1].score
        const metaA = metaByRelative.get(a[0])
        const metaB = metaByRelative.get(b[0])
        return (
          (metaB?.date ?? '').localeCompare(metaA?.date ?? '') ||
          (metaA?.title ?? '').localeCompare(metaB?.title ?? '', 'zh-CN')
        )
      })
      .slice(0, 6)
      .map(([relative, info]) => ({
        path: metaByRelative.get(relative)?.path ?? '',
        relation: info.relation,
      }))
      .filter((relation) => relation.path)
  })

  // --- per-note rendering, deferred --------------------------------------
  //
  // Rendering all 500+ notes through Shiki up front costs seconds of blocking
  // work on every cold start. Instead each note gets a thunk, and the virtual
  // module only materialises it when that note is actually opened. The link
  // graph above still sees every note, so relations and cross-links keep
  // working without paying for the whole vault.
  const resolveAsset = (vaultRelative: string): string | null => {
    const published = assetAlias.get(vaultRelative.toLowerCase())
    if (published) return published
    const byName = assetByName.get(path.basename(vaultRelative).toLowerCase())
    if (byName?.length === 1) return assetAlias.get(byName[0].relative.toLowerCase()) ?? null
    return null
  }

  const renderers: Record<string, () => Promise<NoteDocument>> = {}
  const routeIndex: Record<string, string> = {}

  for (const note of notes) {
    // The client only ever knows the URL it is on, so lookups go through the
    // decoded/whitespace-collapsed form of the route.
    routeIndex[normalizeRoute(note.route)] = note.route
    renderers[note.route] = async () => {
      try {
        const rendered = await renderNote(escapeStrayMarkup(note.body), {
          from: note.relative,
          resolveNote: (relativePath) => findNote(relativePath)?.route ?? null,
          resolveNoteByName: (name) => findNoteByName(name)?.route ?? null,
          resolveAsset: (vaultRelative) => {
            const published = resolveAsset(vaultRelative)
            return published ? `${assetBase}${published}` : null
          },
        })
        return {
          path: note.route,
          html: rendered.html,
          headings: rendered.headings,
          highlighted: {},
        }
      } catch (error) {
        warnings.push(`渲染失败：${note.relative} — ${(error as Error).message}`)
        return {
          path: note.route,
          html: `<p>这篇笔记暂时无法渲染。</p>`,
          headings: [],
          highlighted: {},
        }
      }
    }
  }

  metas.sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title, 'zh-CN'))

  return { notes: metas, documents: {}, renderers, routeIndex, assets, scannedAt, warnings }
}

/** Copies vault media into `public/vault` so the build serves it verbatim. */
async function syncAssets(assets: VaultAsset[]): Promise<void> {
  const existing = await fs
    .readdir(ASSET_PUBLIC_DIR)
    .then((entries) => new Set(entries))
    .catch(() => new Set<string>())

  const wanted = new Set<string>()
  for (const asset of assets) {
    const name = assetPublicName(asset.relative, asset.relative)
    wanted.add(name)
    if (existing.has(name)) continue
    const target = path.join(ASSET_PUBLIC_DIR, name)
    await fs.mkdir(path.dirname(target), { recursive: true })
    await fs.copyFile(asset.file, target)
  }

  for (const name of existing) {
    if (!wanted.has(name)) await fs.rm(path.join(ASSET_PUBLIC_DIR, name), { force: true })
  }
}

export interface NotesPluginOptions {
  /** Skip asset copying and index writing — used by metadata-only consumers. */
  assets?: boolean
  /** Write `content/.index.json` so the graph can be reviewed outside a build. */
  writeIndex?: boolean
  /** Render and publish the note bodies to `public/notes`. Build only. */
  publishDocuments?: boolean
  /** Output directory that receives a copy of the published JSON. */
  documentsMirrorDir?: string
}

export function notesPlugin(options: NotesPluginOptions = {}): Plugin {
  let config: ResolvedConfig
  let index: ContentIndex | null = null

  const assetBase = () => `${config?.base ?? '/'}vault/`

  const ensureIndex = async (): Promise<ContentIndex> => {
    index ??= await buildContentIndex(assetBase())
    return index
  }

  return {
    name: 'pressidian:notes',

    configResolved(resolved) {
      config = resolved
    },

    async buildStart() {
      const built = await ensureIndex()
      if (options.assets !== false) await syncAssets(built.assets)

      if (options.writeIndex !== false) {
        await fs.mkdir(path.dirname(INDEX_FILE), { recursive: true })
        await fs.writeFile(INDEX_FILE, `${JSON.stringify(built, null, 2)}\n`, 'utf8')
      }

      for (const warning of built.warnings) this.warn(warning)
      this.info(
        `[pressidian] ${built.notes.length} 篇笔记 · ${built.assets.length} 个附件${
          built.notes.length ? '' : '（content/notes/obsidian 为空）'
        }`,
      )
    },

    /**
     * Compiles every note and publishes the JSON the reader fetches.
     *
     * This runs at `buildEnd` rather than `closeBundle`, because Vite resolves
     * the `public/` file list before the bundle is written — a file created
     * later would never be copied into the output. The mirror directory covers
     * a custom `outDir`, which Vite seeds eagerly in the same way.
     */
    async buildEnd() {
      if (!options.publishDocuments) return
      const manifest = await publishDocuments({
        outputDir: DOCUMENTS_DIR,
        mirrorDir: options.documentsMirrorDir,
        onProgress: (done, total) => {
          if (done % 150 === 0) this.info(`[pressidian] 渲染笔记 ${done}/${total}`)
        },
      })
      this.info(
        `[pressidian] public/notes · ${manifest.count} 篇 · ${Object.keys(manifest.groups).length} 个分组`,
      )
    },

    resolveId(id) {
      return id === META_MODULE_ID ? RESOLVED_META_MODULE_ID : null
    },

    async load(id) {
      if (id !== RESOLVED_META_MODULE_ID) return null
      const built = await ensureIndex()
      return [
        `export const notes = ${JSON.stringify(built.notes)};`,
        `export const generatedAt = ${JSON.stringify(built.scannedAt)};`,
      ].join('\n')
    },

    configureServer(server) {
      if (options.assets === false) return

      // Vite serves `public/` automatically, but media re-synced after a vault
      // change needs to be on disk before the request lands.
      server.middlewares.use((async (
        req: Connect.IncomingMessage,
        _res: unknown,
        next: Connect.NextFunction,
      ) => {
        if (req.url?.includes('/vault/')) {
          await syncAssets((await ensureIndex()).assets)
        }
        next()
      }) as Connect.NextHandleFunction)

      // In development the compiled documents are produced on demand. Requests
      // ask for exactly one group (or the manifest), so an edited note
      // re-renders without the server rendering the whole vault per request.
      server.middlewares.use((async (
        req: Connect.IncomingMessage,
        res: unknown,
        next: Connect.NextFunction,
      ) => {
        const pathname = (req.url ?? '').split('?')[0] ?? ''
        if (!pathname.startsWith('/notes/') || !pathname.endsWith('.json')) return next()

        const built = await ensureIndex()
        const params = new URLSearchParams((req.url ?? '').split('?')[1] ?? '')
        const requestedGroup = params.get('group')
        const sourceRoute = params.get('route')

        const groups = new Map<string, string[]>()
        for (const route of Object.keys(built.renderers)) {
          const name = route.replace(/^\/notes\/?/, '').split('/').filter(Boolean)[0] ?? 'root'
          groups.set(name, [...(groups.get(name) ?? []), route])
        }
        const groupOf = (route: string) =>
          route.replace(/^\/notes\/?/, '').split('/').filter(Boolean)[0] ?? 'root'

        const documents: Record<string, NoteDocument> = {}
        const routeGroup: Record<string, string> = {}

        if (requestedGroup) {
          for (const route of groups.get(requestedGroup) ?? []) {
            const render = built.renderers[route]
            if (!render) continue
            documents[route] = await render()
            routeGroup[route] = requestedGroup
          }
        } else if (sourceRoute) {
          const canonical = built.routeIndex[normalizeRoute(sourceRoute)] ?? sourceRoute
          const render = built.renderers[canonical]
          if (render) {
            documents[canonical] = await render()
            routeGroup[canonical] = groupOf(canonical)
          }
        }

        const payload = JSON.stringify({
          generatedAt: built.scannedAt,
          count: Object.keys(built.renderers).length,
          groups: { [requestedGroup ?? 'single']: 'dev' },
          routeIndex: built.routeIndex,
          routeGroup,
          documents,
        })

        const response = res as {
          setHeader: (name: string, value: string) => void
          end: (body: string) => void
        }
        response.setHeader('Content-Type', 'application/json; charset=utf-8')
        response.setHeader('Cache-Control', 'no-store')
        response.end(payload)
      }) as Connect.NextHandleFunction)

      const invalidate = (file: string) => {
        // Only markdown changes affect the graph; media can churn without
        // invalidating anything the client has to re-fetch.
        if (!file.startsWith(VAULT_DIR) || !/\.(md|markdown)$/i.test(file)) return
        index = null
        const module = server.moduleGraph.getModuleById(RESOLVED_META_MODULE_ID)
        if (module) server.moduleGraph.invalidateModule(module)
        server.ws.send({ type: 'full-reload' })
      }

      server.watcher.on('add', invalidate)
      server.watcher.on('change', invalidate)
      server.watcher.on('unlink', invalidate)
    },

    handleHotUpdate({ file }) {
      if (!file.startsWith(VAULT_DIR) || !/\.(md|markdown)$/i.test(file)) return undefined
      index = null
      return []
    },
  }
}
