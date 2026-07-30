import { promises as fs } from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const argIndex = process.argv.indexOf('--source')
const sourceArg = argIndex >= 0 ? process.argv[argIndex + 1] : null
const sourceDir = path.resolve(sourceArg || process.env.OBSIDIAN_SOURCE_DIR || '')
const outputDir = path.join(root, 'docs', 'notes', 'obsidian')
const assetDir = path.join(outputDir, '_assets')
const manifestFile = path.join(outputDir, '.sync-manifest.json')

if (!sourceArg && !process.env.OBSIDIAN_SOURCE_DIR) {
  console.log('[sync:obsidian] no source configured; keeping existing synced notes')
  process.exit(0)
}

const sourceStat = await fs.stat(sourceDir).catch(() => null)
if (!sourceStat?.isDirectory()) throw new Error(`Obsidian source does not exist: ${sourceDir}`)

const ignored = new Set(['.git', '.obsidian', 'node_modules', 'templates', '.trash'])
const mediaExtensions = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.avif'])

const walk = async (dir) => {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    if (entry.name.startsWith('.') || ignored.has(entry.name)) continue
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) files.push(...await walk(fullPath))
    else if (entry.isFile()) files.push(fullPath)
  }
  return files
}

const files = await walk(sourceDir)
const markdownFiles = files.filter((file) =>
  path.extname(file).toLowerCase() === '.md'
  && path.basename(file).toLowerCase() !== 'readme.md')
const mediaFiles = files.filter((file) => mediaExtensions.has(path.extname(file).toLowerCase()))
const noteMap = new Map(markdownFiles.map((file) => [path.basename(file, '.md').toLowerCase(), file]))
const mediaMap = new Map(mediaFiles.map((file) => [path.basename(file).toLowerCase(), file]))
const written = new Set()

const escapeRawHtmlOutsideCode = (content) => content
  .split(/(```[\s\S]*?```|~~~[\s\S]*?~~~)/g)
  .map((segment, index) => index % 2
    ? segment
    : segment.replaceAll('<', '&lt;').replaceAll('>', '&gt;'))
  .join('')

await fs.mkdir(assetDir, { recursive: true })

const copyAsset = async (name) => {
  const source = mediaMap.get(path.basename(name).toLowerCase())
  if (!source) return null
  const hash = createHash('sha1').update(path.relative(sourceDir, source)).digest('hex').slice(0, 7)
  const outputName = `${hash}-${path.basename(source)}`
  const target = path.join(assetDir, outputName)
  await fs.copyFile(source, target)
  written.add(path.relative(outputDir, target).replaceAll('\\', '/'))
  return outputName
}

for (const source of markdownFiles) {
  const relative = path.relative(sourceDir, source)
  const target = path.join(outputDir, relative)
  const targetDir = path.dirname(target)
  let content = await fs.readFile(source, 'utf8')

  const embeds = [...content.matchAll(/!\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g)]
  for (const match of embeds) {
    const assetName = await copyAsset(match[1].trim())
    if (!assetName) continue
    const relativeAsset = path.relative(targetDir, path.join(assetDir, assetName)).replaceAll('\\', '/')
    content = content.replace(match[0], `![${path.parse(match[1]).name}](${relativeAsset})`)
  }

  content = content.replace(/\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|([^\]]+))?\]\]/g, (full, rawName, alias) => {
    const name = rawName.trim()
    const linked = noteMap.get(name.toLowerCase())
    if (!linked) return alias || name
    const linkedTarget = path.join(outputDir, path.relative(sourceDir, linked))
    const href = path.relative(targetDir, linkedTarget).replaceAll('\\', '/')
    return `[${alias || name}](${href.startsWith('.') ? href : `./${href}`})`
  })

  // VuePress pages are compiled as Vue SFCs. Unbalanced HTML from free-form
  // Obsidian notes can otherwise break the whole site build, so render it as
  // readable text while leaving fenced code examples untouched.
  content = escapeRawHtmlOutsideCode(content)

  await fs.mkdir(targetDir, { recursive: true })
  await fs.writeFile(target, content, 'utf8')
  written.add(path.relative(outputDir, target).replaceAll('\\', '/'))
}

const oldManifest = JSON.parse(await fs.readFile(manifestFile, 'utf8').catch(() => '[]'))
for (const relative of oldManifest) {
  if (written.has(relative)) continue
  const target = path.resolve(outputDir, relative)
  if (!target.startsWith(`${path.resolve(outputDir)}${path.sep}`)) continue
  await fs.rm(target, { force: true })
}

await fs.writeFile(manifestFile, `${JSON.stringify([...written].sort(), null, 2)}\n`, 'utf8')
console.log(`[sync:obsidian] synced ${markdownFiles.length} notes and ${[...written].filter((item) => item.startsWith('_assets/')).length} assets`)
