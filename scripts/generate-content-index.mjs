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

const normalizePath = (value) => path.resolve(value).toLowerCase()

const extractLinkedFiles = (body, sourceFile, filesByPath, filesByName) => {
  const linked = new Set()
  const addLink = (rawTarget) => {
    const target = rawTarget.trim().replace(/^<|>$/g, '').split('#')[0].split('?')[0]
    if (!target || /^(?:[a-z]+:|\/\/|#)/i.test(target)) return

    let decodedTarget = target
    try {
      decodedTarget = decodeURIComponent(target)
    } catch {
      // Keep malformed URLs readable instead of making indexing fail.
    }

    if (/\.md$/i.test(decodedTarget)) {
      const resolved = normalizePath(path.resolve(path.dirname(sourceFile), decodedTarget))
      if (filesByPath.has(resolved)) linked.add(resolved)
      return
    }

    const byName = filesByName.get(path.basename(decodedTarget).toLowerCase())
    if (byName?.length === 1) linked.add(byName[0])
  }

  for (const match of body.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) addLink(match[1])
  for (const match of body.matchAll(/\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|[^\]]+)?\]\]/g)) addLink(match[1])
  return linked
}

const sharedDirectoryDepth = (firstFile, secondFile) => {
  const meaningfulSegments = (file) => path.relative(notesDir, path.dirname(file))
    .split(path.sep)
    .filter((segment) => segment && segment.toLowerCase() !== 'obsidian')
  const first = meaningfulSegments(firstFile)
  const second = meaningfulSegments(secondFile)
  let depth = 0
  while (first[depth] && first[depth] === second[depth]) depth += 1
  return depth
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
    _file: file,
    _body: body,
  })
}

const filesByPath = new Map(notes.map((note) => [normalizePath(note._file), note]))
const filesByName = new Map()
for (const note of notes) {
  const key = path.basename(note._file, '.md').toLowerCase()
  filesByName.set(key, [...(filesByName.get(key) || []), normalizePath(note._file)])
}

const outgoing = new Map()
const incoming = new Map(notes.map((note) => [normalizePath(note._file), new Set()]))
for (const note of notes) {
  const sourceKey = normalizePath(note._file)
  const targets = extractLinkedFiles(note._body, note._file, filesByPath, filesByName)
  targets.delete(sourceKey)
  outgoing.set(sourceKey, targets)
  for (const target of targets) incoming.get(target)?.add(sourceKey)
}

for (const note of notes) {
  const sourceKey = normalizePath(note._file)
  const scores = new Map()
  const addCandidate = (candidateKey, score, relation) => {
    if (candidateKey === sourceKey || !filesByPath.has(candidateKey)) return
    const previous = scores.get(candidateKey)
    if (!previous || score > previous.score) scores.set(candidateKey, { score, relation })
  }

  for (const target of outgoing.get(sourceKey) || []) addCandidate(target, 100, '正文关联')
  for (const target of incoming.get(sourceKey) || []) addCandidate(target, 90, '反向链接')

  for (const candidate of notes) {
    const candidateKey = normalizePath(candidate._file)
    if (candidateKey === sourceKey || scores.has(candidateKey)) continue
    const sharedTags = note.tags.filter((tag) => candidate.tags.includes(tag)).length
    const sameDirectory = path.dirname(note._file) === path.dirname(candidate._file)
    const directoryDepth = sharedDirectoryDepth(note._file, candidate._file)
    const score = sharedTags * 4 + (sameDirectory ? 8 : 0) + directoryDepth
    if (score > 0) addCandidate(candidateKey, score, sameDirectory ? '同一路径' : '共同主题')
  }

  note.related = [...scores.entries()]
    .sort((a, b) => b[1].score - a[1].score
      || filesByPath.get(b[0]).date.localeCompare(filesByPath.get(a[0]).date)
      || filesByPath.get(a[0]).title.localeCompare(filesByPath.get(b[0]).title, 'zh-CN'))
    .slice(0, 6)
    .map(([candidateKey, meta]) => ({ path: filesByPath.get(candidateKey).path, relation: meta.relation }))

  delete note._file
  delete note._body
}

notes.sort((a, b) => b.date.localeCompare(a.date))
await fs.mkdir(path.dirname(outputFile), { recursive: true })
await fs.writeFile(outputFile, `${JSON.stringify(notes, null, 2)}\n`, 'utf8')
console.log(`[content:index] indexed ${notes.length} notes`)
