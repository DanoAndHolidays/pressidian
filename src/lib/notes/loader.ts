import { generatedAt } from 'virtual:notes-meta'
import type { NoteDocument } from '@/lib/notes/types'

interface DocumentsManifest {
  generatedAt: string
  count: number
  /** Group name → file name. */
  groups: Record<string, string>
  /** Normalized route key → canonical route. */
  routeIndex: Record<string, string>
  /** Canonical route → group name. */
  routeGroup: Record<string, string>
}

interface DocumentsChunk {
  group: string
  documents: Record<string, NoteDocument>
}

/**
 * Note HTML is compiled at build time into `public/notes/*.json` and fetched
 * the first time a note is opened.
 *
 * A static asset is deliberate: the payload is produced by the same build-time
 * markdown pipeline that resolves wiki links, attachments and syntax
 * highlighting, and delivering it as JSON keeps it entirely outside the
 * bundler, where output-format interop cannot rename or drop anything.
 *
 * The vault is split by top-level folder. Opening one note costs the small
 * manifest plus that note's folder, and both stay in memory and in the HTTP
 * cache for the rest of the session.
 */
let manifestPromise: Promise<DocumentsManifest> | null = null
const chunkPromises = new Map<string, Promise<DocumentsChunk>>()
const documentsByRoute = new Map<string, NoteDocument>()

/**
 * Cache key for the manifest.
 *
 * Chunk files carry a content hash in their name, but the manifest that points
 * at them cannot — its name is fixed so the reader can find it. Without a key,
 * a returning visitor would keep the previous manifest and therefore keep
 * loading the previous chunks even though fresh ones were published. The build
 * timestamp is bundled with the metadata, so a new deploy invalidates it while
 * a normal reload still hits the cache.
 */
const cacheKey = encodeURIComponent(generatedAt || 'dev')

const BASE = `${import.meta.env.BASE_URL}notes/`

/** Manifest URL carries the build key; chunk URLs do not need one. */
const manifestUrl = () => `${BASE}manifest.json?v=${cacheKey}`

const chunkUrl = (file: string, params: Record<string, string> = {}) => {
  const query = new URLSearchParams(params).toString()
  return `${BASE}${file}${query ? `?${query}` : ''}`
}

/** Index of URL-shaped route keys, so `引入-Crate` finds `引入 Crate`. */
function toKey(value: string): string {
  let decoded = value
  try {
    decoded = decodeURIComponent(value)
  } catch {
    /* keep the raw value when the escape sequence is malformed */
  }
  return decoded
    .replace(/\/+$/, '')
    .replace(/[-\u2010-\u2015]+/g, ' ')
    .replace(/\s+/g, ' ')
    .toLowerCase()
}

const routeKeys = new Map<string, string>()

async function getManifest(): Promise<DocumentsManifest> {
  manifestPromise ??= fetch(manifestUrl())
    .then((response) => {
      if (!response.ok) throw new Error(`笔记索引加载失败（HTTP ${response.status}）`)
      return response.json() as Promise<DocumentsManifest>
    })
    .then((manifest) => {
      for (const route of Object.keys(manifest.routeIndex)) routeKeys.set(toKey(route), route)
      return manifest
    })
    .catch((error: unknown) => {
      // Let a later attempt retry instead of caching the failure forever.
      manifestPromise = null
      throw error
    })
  return manifestPromise
}

function getChunk(file: string, params: Record<string, string>): Promise<DocumentsChunk> {
  const key = `${file}?${new URLSearchParams(params)}`
  let pending = chunkPromises.get(key)
  if (pending) return pending

  pending = fetch(chunkUrl(file, params))
    .then((response) => {
      if (!response.ok) throw new Error(`笔记内容加载失败（HTTP ${response.status}）`)
      return response.json() as Promise<DocumentsChunk>
    })
    .then((chunk) => {
      for (const [route, document_] of Object.entries(chunk.documents)) {
        documentsByRoute.set(route, document_)
      }
      return chunk
    })
    .catch((error: unknown) => {
      chunkPromises.delete(key)
      throw error
    })

  chunkPromises.set(key, pending)
  return pending
}

export async function loadNoteDocument(sourcePath: string): Promise<NoteDocument> {
  const canonical = await resolveRoute(sourcePath)

  const cached = documentsByRoute.get(canonical)
  if (cached) return cached

  const manifest = await getManifest()
  const group = manifest.routeGroup[canonical]
  const file = group ? manifest.groups[group] : undefined

  // Build output knows which file holds the note; the dev server resolves it
  // from the route instead, since it has no precomputed grouping.
  await getChunk(file ?? 'dev.json', file ? {} : { route: canonical })

  const document_ = documentsByRoute.get(canonical)
  if (!document_) throw new Error(`没有找到这篇笔记的渲染结果：${sourcePath}`)
  return document_
}

/**
 * Maps whatever the URL says onto the canonical route the build recorded.
 *
 * `routeIndex` is keyed by the normalized route and its *values* are the
 * canonical routes; `routeGroup` and `groups` are keyed by those canonical
 * routes. Looking a normalized key up in `routeGroup` directly would always
 * miss, so resolution always goes through `routeIndex` first.
 */
async function resolveRoute(sourcePath: string): Promise<string> {
  const manifest = await getManifest()
  return manifest.routeIndex[toKey(sourcePath)] ?? routeKeys.get(toKey(sourcePath)) ?? sourcePath
}

/** Warms a note's chunk without waiting for it — used on link hover. */
export function prefetchNoteGroup(sourcePath: string): void {
  void resolveRoute(sourcePath)
    .then(async (canonical) => {
      if (documentsByRoute.has(canonical)) return
      const manifest = await getManifest()
      const group = manifest.routeGroup[canonical]
      const file = group ? manifest.groups[group] : undefined
      if (!file) return
      await getChunk(file, {})
    })
    .catch(() => {
      /* prefetch is best-effort */
    })
}
