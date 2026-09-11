import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { notes as rawNotes, generatedAt } from 'virtual:notes-meta'
import type { NoteMeta, NoteStatus } from '@/lib/notes/types'

export interface TreeNode {
  type: 'folder' | 'note'
  label: string
  /** Route for notes, path key for folders. */
  key: string
  count: number
  children: TreeNode[]
  note?: NoteMeta
}

const STATUS_ORDER: Record<NoteStatus, number> = { evergreen: 0, growing: 1, seedling: 2 }

const STORAGE_KEY = 'pressidian:notes-prefs'

function loadPrefs(): { activeTag: string; status: NoteStatus | 'all'; sort: SortKey } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { activeTag: '全部', status: 'all', sort: 'date' }
    return { activeTag: '全部', status: 'all', sort: 'date', ...JSON.parse(raw) }
  } catch {
    return { activeTag: '全部', status: 'all', sort: 'date' }
  }
}

export type SortKey = 'date' | 'title' | 'weight' | 'degree'

export const useNotesStore = defineStore('notes', () => {
  const notes = ref<NoteMeta[]>(rawNotes)
  const syncedAt = ref<string>(generatedAt)

  const byPath = computed(() => new Map(notes.value.map((note) => [note.path, note])))

  /** Tag frequency, most used first — drives the tag cloud. */
  const tagCounts = computed(() => {
    const counts = new Map<string, number>()
    for (const note of notes.value) {
      for (const tag of note.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1)
    }
    return [...counts.entries()]
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, 'zh-CN'))
  })

  const topTags = computed(() => tagCounts.value.slice(0, 18))

  const stats = computed(() => {
    const total = notes.value.length
    const minutes = notes.value.reduce((sum, note) => sum + note.readingTime, 0)
    const weight = notes.value.reduce((sum, note) => sum + note.weight, 0)
    const links = notes.value.reduce((sum, note) => sum + note.degree, 0) / 2
    const statusCount = { evergreen: 0, growing: 0, seedling: 0 } as Record<NoteStatus, number>
    for (const note of notes.value) statusCount[note.status] += 1
    return {
      total,
      minutes,
      weight,
      links: Math.round(links),
      folders: new Set(notes.value.map((note) => note.segments.join('/'))).size,
      statusCount,
      latest: notes.value[0]?.date ?? '',
    }
  })

  /**
   * Folder tree built from `segments`. Folders sort before notes so the shape
   * of the vault stays legible even with hundreds of notes.
   */
  const tree = computed<TreeNode>(() => {
    const root: TreeNode = { type: 'folder', label: '笔记库', key: '__root__', count: 0, children: [] }
    const folders = new Map<string, TreeNode>([['', root]])

    for (const note of notes.value) {
      let parentKey = ''
      let parent = root
      parent.count += 1

      note.segments.forEach((segment, depth) => {
        const key = note.segments.slice(0, depth + 1).join('/')
        let folder = folders.get(key)
        if (!folder) {
          folder = { type: 'folder', label: segment, key, count: 0, children: [] }
          folders.set(key, folder)
          parent.children.push(folder)
        }
        folder.count += 1
        parentKey = key
        parent = folder
      })
      void parentKey
      parent.children.push({
        type: 'note',
        label: note.title,
        key: note.path,
        count: 0,
        children: [],
        note,
      })
    }

    const sort = (node: TreeNode): TreeNode => {
      node.children.sort((a, b) => {
        if (a.type !== b.type) return a.type === 'folder' ? -1 : 1
        if (a.type === 'note' && b.type === 'note') {
          return (
            (b.note?.date ?? '').localeCompare(a.note?.date ?? '') ||
            a.label.localeCompare(b.label, 'zh-CN', { numeric: true })
          )
        }
        return a.label.localeCompare(b.label, 'zh-CN', { numeric: true })
      })
      node.children.forEach(sort)
      return node
    }

    return sort(root)
  })

  const recent = computed(() => notes.value.slice(0, 6))

  /**
   * The span of note dates plus when the vault was last synced. Sorting is by
   * note date, which for a vault without date frontmatter is inferred from the
   * content — the two facts are shown together so the reader can tell them
   * apart instead of trusting a single ambiguous timestamp.
   */
  const dateRange = computed(() => {
    const dates = notes.value.map((note) => note.date).filter(Boolean).sort()
    const first = dates[0] ?? ''
    const last = dates.at(-1) ?? ''
    const synced = syncedAt.value ? new Date(syncedAt.value) : null
    return {
      earliest: first,
      latest: last,
      span: first && last ? `${first.slice(0, 7)} → ${last.slice(0, 7)}` : '—',
      declared: notes.value.filter((note) => note.dateSource === 'declared').length,
      syncedLabel: synced
        ? `${synced.getFullYear()}.${`${synced.getMonth() + 1}`.padStart(2, '0')}`
        : '未同步',
    }
  })

  const prefs = loadPrefs()
  const activeTag = ref(prefs.activeTag)
  const statusFilter = ref<NoteStatus | 'all'>(prefs.status)
  const sortKey = ref<SortKey>(prefs.sort)

  watch([activeTag, statusFilter, sortKey], () => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          activeTag: activeTag.value,
          status: statusFilter.value,
          sort: sortKey.value,
        }),
      )
    } catch {
      /* storage unavailable — filters simply do not persist */
    }
  })

  const bySegments = computed(() => {
    const map = new Map<string, NoteMeta[]>()
    for (const note of notes.value) {
      const key = note.segments.join('/')
      map.set(key, [...(map.get(key) ?? []), note])
    }
    return map
  })

  const relatedOf = (path: string): Array<{ note: NoteMeta; relation: string }> => {
    const note = byPath.value.get(path)
    if (!note) return []
    return note.related
      .map((relation) => ({ note: byPath.value.get(relation.path), relation: relation.relation }))
      .filter((entry): entry is { note: NoteMeta; relation: string } => Boolean(entry.note))
  }

  const neighboursOf = (path: string): { previous?: NoteMeta; next?: NoteMeta } => {
    const index = notes.value.findIndex((note) => note.path === path)
    if (index < 0) return {}
    return { previous: notes.value[index + 1], next: notes.value[index - 1] }
  }

  const folderLabel = (note: NoteMeta, depth = 2) =>
    note.segments.slice(0, depth).join(' / ') || '未分类'

  const sortNotes = (list: NoteMeta[], key: SortKey = sortKey.value): NoteMeta[] => {
    const copy = [...list]
    switch (key) {
      case 'title':
        return copy.sort((a, b) => a.title.localeCompare(b.title, 'zh-CN', { numeric: true }))
      case 'weight':
        return copy.sort((a, b) => b.weight - a.weight)
      case 'degree':
        return copy.sort((a, b) => b.degree - a.degree)
      default:
        return copy.sort((a, b) => b.date.localeCompare(a.date))
    }
  }

  /** Lightweight relevance score used by both the palette and the notes page. */
  const search = (query: string, limit = 60): NoteMeta[] => {
    const keyword = query.trim().toLowerCase()
    if (!keyword) return []
    const scored: Array<{ note: NoteMeta; score: number }> = []

    for (const note of notes.value) {
      const title = note.title.toLowerCase()
      const tags = note.tags.join(' ').toLowerCase()
      const description = note.description.toLowerCase()
      const path = note.path.toLowerCase()
      let score = 0

      if (title === keyword) score += 200
      if (title.startsWith(keyword)) score += 90
      if (title.includes(keyword)) score += 60
      if (tags.includes(keyword)) score += 34
      if (path.includes(keyword)) score += 18
      if (description.includes(keyword)) score += 14

      if (score > 0) {
        score += Math.min(note.degree, 12) + STATUS_ORDER[note.status] * -1 + 3
        scored.push({ note, score })
      }
    }

    return scored
      .sort((a, b) => b.score - a.score || b.note.date.localeCompare(a.note.date))
      .slice(0, limit)
      .map((entry) => entry.note)
  }

  return {
    notes,
    syncedAt,
    byPath,
    bySegments,
    tagCounts,
    topTags,
    stats,
    tree,
    recent,
    dateRange,
    activeTag,
    statusFilter,
    sortKey,
    relatedOf,
    neighboursOf,
    folderLabel,
    sortNotes,
    search,
  }
})
