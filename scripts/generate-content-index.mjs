import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const notesDir = path.join(root, 'docs', 'notes')
const outputFile = path.join(root, 'docs', '.vuepress', 'data', 'content-index.json')

const walk = async (dir) => {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const files = await Promise.all(entries.map(async (entry) => {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) return walk(fullPath)
    return entry.isFile() && entry.name.endsWith('.md') ? [fullPath] : []
  }))
  return files.flat()
}

const parseFrontmatter = (source) => {
  if (!source.startsWith('---')) return { data: {}, body: source }
  const end = source.indexOf('\n---', 3)
  if (end < 0) return { data: {}, body: source }
  const raw = source.slice(4, end).split(/\r?\n/)
  const data = {}
  let listKey = null

  for (const line of raw) {
    const listItem = line.match(/^\s+-\s+(.+)$/)
    if (listItem && listKey) {
      data[listKey].push(listItem[1].trim().replace(/^['"]|['"]$/g, ''))
      continue
    }
    const pair = line.match(/^([\w-]+):\s*(.*)$/)
    if (!pair) continue
    const [, key, rawValue] = pair
    const value = rawValue.trim().replace(/^['"]|['"]$/g, '')
    if (!value) {
      data[key] = []
      listKey = key
    } else {
      data[key] = value
      listKey = null
    }
  }
  return { data, body: source.slice(end + 4) }
}

const readingTime = (body) => {
  const codeFree = body.replace(/```[\s\S]*?```/g, '').replace(/<[^>]+>/g, '')
  const chinese = (codeFree.match(/[\u3400-\u9fff]/g) || []).length
  const latin = (codeFree.match(/[A-Za-z0-9_]+/g) || []).length
  return Math.max(1, Math.ceil(chinese / 350 + latin / 220))
}

const toRoute = (file) => {
  const relative = path.relative(path.join(root, 'docs'), file).replaceAll('\\', '/')
  return `/${relative.replace(/README\.md$/i, '').replace(/\.md$/i, '.html')}`
}

const files = (await walk(notesDir)).filter((file) => path.basename(file).toLowerCase() !== 'readme.md')
const notes = []

for (const file of files) {
  const source = await fs.readFile(file, 'utf8')
  const { data, body } = parseFrontmatter(source)
  const heading = body.match(/^#\s+(.+)$/m)?.[1]?.trim()
  const firstParagraph = body
    .replace(/```[\s\S]*?```/g, '')
    .split(/\r?\n\r?\n/)
    .map((block) => block.replace(/^#+\s+.*$/gm, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').trim())
    .find((block) => block && !block.startsWith('<'))

  const stat = await fs.stat(file)
  notes.push({
    title: data.title || heading || path.basename(file, '.md'),
    description: data.description || firstParagraph?.slice(0, 110) || '一篇仍在生长的笔记。',
    path: toRoute(file),
    date: String(data.updated || data.date || stat.mtime.toISOString().slice(0, 10)),
    tags: Array.isArray(data.tags) ? data.tags : data.tags ? String(data.tags).split(',').map((tag) => tag.trim()) : ['Note'],
    status: data.status || 'seedling',
    readingTime: Number(data.readingTime) || readingTime(body),
  })
}

notes.sort((a, b) => b.date.localeCompare(a.date))
await fs.mkdir(path.dirname(outputFile), { recursive: true })
await fs.writeFile(outputFile, `${JSON.stringify(notes, null, 2)}\n`, 'utf8')
console.log(`[content:index] indexed ${notes.length} notes`)
