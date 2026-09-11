/**
 * Syncs the remote Obsidian vault into `content/notes/obsidian`.
 *
 * Since the site moved off VuePress, the sync layer no longer needs to rewrite
 * `[[wiki links]]`, `![[embeds]]` or escape raw HTML: the markdown pipeline in
 * `vite/markdown.ts` resolves all of that against the live note graph, which
 * means the synced copy stays a faithful mirror of the vault. This script only
 * copies files and remembers what it wrote so deleted notes disappear.
 */
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { assetPublicName } from '../vite/vault.ts'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const argIndex = process.argv.indexOf('--source')
const sourceArg = argIndex >= 0 ? process.argv[argIndex + 1] : null
const sourceDir = path.resolve(sourceArg || process.env.OBSIDIAN_SOURCE_DIR || '')
const outputDir = path.join(root, 'content', 'notes', 'obsidian')
const publicDir = path.join(root, 'public', 'vault')
const manifestFile = path.join(outputDir, '.sync-manifest.json')

if (!sourceArg && !process.env.OBSIDIAN_SOURCE_DIR) {
  console.log('[sync:obsidian] no source configured; keeping existing synced notes')
  process.exit(0)
}

const sourceStat = await fs.stat(sourceDir).catch(() => null)
if (!sourceStat?.isDirectory()) throw new Error(`Obsidian source does not exist: ${sourceDir}`)

const ignoredDirectories = new Set([
  '.git',
  '.obsidian',
  '.trash',
  '.claude',
  '.agents',
  '.github',
  'node_modules',
  'templates',
  '__MACOSX',
])

const mediaExtensions = new Set([
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.webp',
  '.svg',
  '.avif',
  '.bmp',
  '.pdf',
])

/** Skips OS/VCS debris and Obsidian's own bookkeeping files. */
const shouldSkip = (name) =>
  ignoredDirectories.has(name) ||
  name.startsWith('._') ||
  name === '.DS_Store' ||
  name === 'Thumbs.db'

const walk = async (dir) => {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    if (shouldSkip(entry.name)) continue
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) files.push(...(await walk(fullPath)))
    else if (entry.isFile()) files.push(fullPath)
  }
  return files
}

const files = await walk(sourceDir)
const markdownFiles = files.filter((file) => {
  const extension = path.extname(file).toLowerCase()
  if (extension !== '.md' && extension !== '.markdown') return false
  return path.basename(file).toLowerCase() !== 'readme.md'
})
const mediaFiles = files.filter((file) => mediaExtensions.has(path.extname(file).toLowerCase()))

const written = new Set()

const copyInto = async (source, targetRelative) => {
  const target = path.join(outputDir, targetRelative)
  await fs.mkdir(path.dirname(target), { recursive: true })
  await fs.copyFile(source, target)
  written.add(targetRelative.replaceAll('\\', '/'))
}

/**
 * Media is published under a content-hashed name so a re-sync cannot be served
 * from a stale cache. The rule is shared with the markdown pipeline through
 * `assetPublicName()`, which is what rewrites `![[x.png]]` into a URL — one
 * definition keeps the two sides in agreement.
 */
const publicNameFor = (relative) => assetPublicName(relative, relative)

for (const file of markdownFiles) {
  await copyInto(file, path.relative(sourceDir, file))
}

// Media keeps its vault-relative path so `![[img.png]]` and `![](./img.png)`
// resolve by name *and* by path in the markdown pipeline.
const publishedAssets = new Set()
await fs.rm(publicDir, { recursive: true, force: true })
for (const file of mediaFiles) {
  const relative = path.relative(sourceDir, file).replaceAll('\\', '/')
  await copyInto(file, relative)
  const target = path.join(publicDir, publicNameFor(relative))
  await fs.mkdir(path.dirname(target), { recursive: true })
  await fs.copyFile(file, target)
  publishedAssets.add(path.basename(target))
}

const oldManifest = JSON.parse(await fs.readFile(manifestFile, 'utf8').catch(() => '[]'))
for (const relative of oldManifest) {
  if (written.has(relative)) continue
  const target = path.resolve(outputDir, relative)
  if (!target.startsWith(`${path.resolve(outputDir)}${path.sep}`)) continue
  await fs.rm(target, { force: true })
}

await fs.writeFile(manifestFile, `${JSON.stringify([...written].sort(), null, 2)}\n`, 'utf8')
console.log(
  `[sync:obsidian] synced ${markdownFiles.length} notes, ${mediaFiles.length} attachments ` +
    `(${publishedAssets.size} published to public/vault)`,
)
