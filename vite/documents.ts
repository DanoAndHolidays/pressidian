/**
 * Compiles every note and publishes the result as static JSON.
 *
 * The vault is far too large to ship as one payload (a single file runs to tens
 * of megabytes), so documents are packed into size-bounded chunks by walking
 * the folder hierarchy. Opening a note costs one request for the small route
 * manifest plus one for that note's chunk, and both are then kept in memory and
 * in the HTTP cache.
 *
 * Chunk sizes are measured from the rendered HTML rather than guessed, so a
 * 500-note folder is split while a 3-note folder stays whole.
 */
import { createHash } from 'node:crypto'
import { promises as fs } from 'node:fs'
import path from 'node:path'

import type { NoteDocument } from '../src/lib/notes/types'
import { buildContentIndex } from './notes-plugin'

export interface DocumentsManifest {
  generatedAt: string
  /** Number of published notes. */
  count: number
  /** Chunk name → file name. */
  groups: Record<string, string>
  /** Normalized route key → canonical route. */
  routeIndex: Record<string, string>
  /** Canonical route → chunk name. */
  routeGroup: Record<string, string>
}

export interface PublishOptions {
  /** Directory the JSON files are written to (usually `<root>/public/notes`). */
  outputDir: string
  /**
   * Vite `base`. Attachment URLs are baked into the published HTML, so this has
   * to be the real build base — a hard-coded `/vault/` produces image paths
   * that 404 on GitHub Pages, where the site lives under `/pressidian/`.
   */
  base?: string
  /** Also mirror the output here, for build pipelines that copy `public/` early. */
  mirrorDir?: string
  /** Target chunk size in bytes. Chunks are allowed to overshoot for one note. */
  chunkBudget?: number
  /** Called after each note is rendered, for progress reporting. */
  onProgress?: (done: number, total: number) => void
}

const DEFAULT_BUDGET = 3 * 1024 * 1024

const safeName = (value: string) => value.replace(/[^\w\u4e00-\u9fff-]+/g, '-')

/**
 * Content hash for a published file name.
 *
 * The chunk contents change on every sync, and GitHub Pages serves static files
 * with caching headers, so a stable file name means a returning visitor keeps
 * reading yesterday's note bodies. Hashing the payload makes a rebuild produce
 * new URLs, exactly like Vite's own asset hashing.
 */
const contentHash = (body: string) => createHash('sha1').update(body).digest('hex').slice(0, 8)

/** Folder segments below `/notes/`, used to label and group a chunk. */
function segmentsOf(route: string): string[] {
  return route.replace(/^\/notes\/?/, '').split('/').filter(Boolean).slice(0, -1)
}

/**
 * Packs routes into chunks no larger than `budget`, keeping siblings together.
 *
 * Routes are sorted by folder depth then name, so a chunk's contents stay
 * thematically related. A route joins the first chunk whose label it shares and
 * which still has room; otherwise it opens the next chunk under that label. The
 * result is that a 500-note folder becomes several bounded files while a
 * three-note folder stays a single one.
 */
function packChunks(
  routes: string[],
  sizeOf: (route: string) => number,
  budget: number,
): Map<string, string[]> {
  const sorted = [...routes].sort((a, b) => {
    const depth = segmentsOf(a).length - segmentsOf(b).length
    return depth !== 0 ? depth : a.localeCompare(b, 'zh-CN')
  })

  const chunks = new Map<string, string[]>()
  const used = new Map<string, number>()

  for (const route of sorted) {
    const size = sizeOf(route)
    const segments = segmentsOf(route)
    // Prefer a two-segment label; fall back to one, then to the root.
    const labels = [segments.slice(0, 2).join('-'), segments[0] ?? '', 'root'].filter(Boolean)
    let placed = false

    for (const base of labels) {
      let index = 0
      for (;;) {
        const label = index === 0 ? base : `${base}·${index}`
        const existing = chunks.get(label)
        if (!existing) {
          chunks.set(label, [route])
          used.set(label, size)
          placed = true
          break
        }
        if ((used.get(label) ?? 0) + size <= budget) {
          existing.push(route)
          used.set(label, (used.get(label) ?? 0) + size)
          placed = true
          break
        }
        index += 1
      }
      if (placed) break
    }
  }

  return chunks
}

export async function publishDocuments(options: PublishOptions): Promise<DocumentsManifest> {
  const budget = options.chunkBudget ?? DEFAULT_BUDGET
  const base = options.base?.endsWith('/') ? options.base : `${options.base ?? '/'}/`
  const index = await buildContentIndex(`${base}vault/`)
  const routes = Object.keys(index.renderers)

  // Render once, keeping the payload in memory: chunk packing needs real sizes,
  // and rendering twice would double the slowest part of the build.
  const rendered: Record<string, NoteDocument> = {}
  let done = 0
  for (const route of routes) {
    const render = index.renderers[route]
    if (!render) continue
    rendered[route] = await render()
    done += 1
    options.onProgress?.(done, routes.length)
  }

  const sizeOf = (route: string) => JSON.stringify(rendered[route] ?? '').length
  const chunks = packChunks(routes, sizeOf, budget)

  const groups: Record<string, string> = {}
  const routeGroup: Record<string, string> = {}
  const files: Array<{ file: string; body: string }> = []

  let position = 0
  for (const [name, chunkRoutes] of [...chunks.entries()].sort((a, b) =>
    a[0].localeCompare(b[0], 'zh-CN'),
  )) {
    const documents: Record<string, NoteDocument> = {}
    for (const route of chunkRoutes) {
      const document_ = rendered[route]
      if (!document_) continue
      documents[route] = document_
      routeGroup[route] = name
    }

    const body = JSON.stringify({ group: name, documents })
    const file = `g${position}-${safeName(name)}.${contentHash(body)}.json`
    position += 1
    groups[name] = file
    files.push({ file, body })
  }

  const manifest: DocumentsManifest = {
    generatedAt: index.scannedAt,
    count: Object.keys(routeGroup).length,
    groups,
    routeIndex: index.routeIndex,
    routeGroup,
  }
  files.push({ file: 'manifest.json', body: JSON.stringify(manifest) })

  for (const target of [options.outputDir, options.mirrorDir]) {
    if (!target) continue
    await fs.rm(target, { recursive: true, force: true })
    await fs.mkdir(target, { recursive: true })
    for (const entry of files) {
      await fs.writeFile(path.join(target, entry.file), entry.body, 'utf8')
    }
  }

  return manifest
}
