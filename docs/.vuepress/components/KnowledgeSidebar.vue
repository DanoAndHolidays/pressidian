<script setup>
import { computed, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import notes from '../data/content-index.json'
import KnowledgeTreeItem from './KnowledgeTreeItem.vue'

const route = useRoute()
const query = ref('')

const normalizeRoute = (value) => {
  try {
    return decodeURIComponent(value).replace(/\/$/, '')
  } catch {
    return value.replace(/\/$/, '')
  }
}

const currentPath = computed(() => normalizeRoute(route.path))
const noteByPath = new Map(notes.map((note) => [normalizeRoute(note.path), note]))
const currentNote = computed(() => noteByPath.get(currentPath.value))

const getDisplaySegments = (note) => {
  const relative = normalizeRoute(note.path)
    .replace(/^\/notes\//, '')
    .replace(/\.html$/, '')
  const segments = relative.split('/').filter(Boolean)
  if (segments[0]?.toLowerCase() === 'obsidian') segments.shift()
  return segments
}

const sortNodes = (items) => items
  .sort((first, second) => {
    if (first.type !== second.type) return first.type === 'folder' ? -1 : 1
    return first.label.localeCompare(second.label, 'zh-CN', { numeric: true })
  })
  .map((item) => {
    if (item.type === 'folder') item.children = sortNodes(item.children)
    return item
  })

const createTree = () => {
  const root = { type: 'folder', label: '笔记库', children: [], paths: [] }

  for (const note of notes) {
    const notePath = normalizeRoute(note.path)
    const segments = getDisplaySegments(note)
    const folders = segments.slice(0, -1)
    let parent = root
    parent.paths.push(notePath)

    for (const folder of folders) {
      let node = parent.children.find((child) => child.type === 'folder' && child.label === folder)
      if (!node) {
        node = { type: 'folder', label: folder, children: [], paths: [] }
        parent.children.push(node)
      }
      node.paths.push(notePath)
      parent = node
    }

    parent.children.push({ type: 'note', label: note.title, path: notePath })
  }

  root.children = sortNodes(root.children)
  return root
}

const tree = createTree()
const searchResults = computed(() => {
  const keyword = query.value.trim().toLowerCase()
  if (!keyword) return []
  return notes
    .filter((note) => `${note.title} ${(note.tags || []).join(' ')} ${note.path}`.toLowerCase().includes(keyword))
    .slice(0, 24)
})

const breadcrumbs = computed(() => getDisplaySegments(currentNote.value || { path: route.path }).slice(0, -1))
const relatedNotes = computed(() => (currentNote.value?.related || [])
  .map((relation) => ({ ...noteByPath.get(normalizeRoute(relation.path)), relation: relation.relation }))
  .filter((note) => note.path))
</script>

<template>
  <div class="knowledge-sidebar">
    <header class="knowledge-heading">
      <div>
        <p>KNOWLEDGE PATHS</p>
        <strong>笔记库</strong>
      </div>
      <RouterLink to="/notes/" title="返回全部笔记" aria-label="返回全部笔记">
        <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 5.5h5l1.5 1.7H17V15H3V5.5Z" /></svg>
      </RouterLink>
    </header>

    <div v-if="currentNote" class="current-context">
      <span class="current-label">当前位置</span>
      <div class="crumbs"><span>笔记库</span><template v-for="part in breadcrumbs" :key="part"><b>/</b><span>{{ part }}</span></template></div>
      <p>{{ currentNote.title }}</p>
      <small>{{ currentNote.readingTime || 5 }} 分钟阅读 · {{ currentNote.tags?.[0] || 'NOTE' }}</small>
    </div>

    <label class="sidebar-search">
      <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="8.5" cy="8.5" r="4.5"/><path d="m12 12 4 4"/></svg>
      <input v-model="query" type="search" placeholder="在笔记中查找…" aria-label="搜索笔记" />
      <button v-if="query" type="button" aria-label="清空搜索" @click="query = ''">×</button>
    </label>

    <nav class="knowledge-tree" aria-label="笔记目录">
      <template v-if="query">
        <p class="section-label">找到 {{ searchResults.length }} 篇</p>
        <RouterLink v-for="note in searchResults" :key="note.path" class="search-result" :to="note.path">
          <span>{{ note.title }}</span>
          <small>{{ note.tags?.slice(0, 2).join(' · ') || 'NOTE' }}</small>
        </RouterLink>
        <p v-if="!searchResults.length" class="sidebar-empty">没有匹配的笔记</p>
      </template>
      <template v-else>
        <p class="section-label">目录树 <span>{{ notes.length }} 篇</span></p>
        <ul>
          <KnowledgeTreeItem
            :node="tree"
            :current-path="currentPath"
          />
        </ul>
      </template>
    </nav>

    <section v-if="relatedNotes.length" class="related-notes">
      <p class="section-label">关联笔记 <span>{{ relatedNotes.length }}</span></p>
      <RouterLink v-for="note in relatedNotes" :key="note.path" :to="note.path">
        <i aria-hidden="true">↗</i>
        <span><b>{{ note.title }}</b><small>{{ note.relation }}</small></span>
      </RouterLink>
    </section>
  </div>
</template>

<style scoped>
.knowledge-sidebar{padding:20px 14px 30px}.knowledge-heading{display:flex;align-items:center;justify-content:space-between;padding:0 6px 16px}.knowledge-heading p,.section-label{margin:0;color:var(--c-accent);font-size:9px;line-height:1.3;letter-spacing:.14em;font-weight:750}.knowledge-heading strong{display:block;margin-top:3px;color:var(--c-text);font:500 21px/1.2 Georgia,"Songti SC",serif}.knowledge-heading>a{width:32px;height:32px;display:grid;place-items:center;border:1px solid var(--c-border);border-radius:50%;color:var(--c-text-mute)}.knowledge-heading>a:hover{color:var(--c-accent);border-color:var(--c-accent)}.knowledge-heading svg{width:16px;fill:none;stroke:currentColor;stroke-width:1.35}.current-context{margin-bottom:13px;padding:11px 13px 12px;background:var(--c-accent-bg);border-radius:10px;border-left:2px solid var(--c-accent)}.current-label{display:block;margin-bottom:5px;color:var(--c-accent);font-size:8px;font-weight:700;letter-spacing:.12em}.crumbs{display:flex;gap:4px;overflow:hidden;color:var(--c-text-mute);font-size:8px;white-space:nowrap}.crumbs b{font-weight:400}.current-context>p{margin:7px 0 4px;color:var(--c-text);font:500 13px/1.4 Georgia,"Songti SC",serif}.current-context>small{color:var(--c-text-mute);font-size:9px}.sidebar-search{height:38px;margin:0 4px 18px;display:flex;align-items:center;gap:7px;padding:0 10px;border:1px solid var(--c-border);border-radius:9px;background:var(--c-bg)}.sidebar-search:focus-within{border-color:var(--c-accent);box-shadow:0 0 0 2px color-mix(in srgb,var(--c-accent) 10%,transparent)}.sidebar-search svg{width:14px;flex:none;fill:none;stroke:var(--c-text-mute);stroke-width:1.5}.sidebar-search input{min-width:0;flex:1;border:0;outline:0;background:transparent;color:var(--c-text);font:11px inherit}.sidebar-search button{border:0;background:transparent;color:var(--c-text-mute);cursor:pointer;font-size:16px}.section-label{padding:0 9px 8px}.section-label span{float:right;color:var(--c-text-mute);letter-spacing:0;font-weight:500}.knowledge-tree>ul{list-style:none;margin:0;padding:0}.search-result{display:flex;flex-direction:column;gap:2px;margin:1px 2px;padding:8px 10px;border-radius:7px;color:var(--c-text);font-size:12px;text-decoration:none}.search-result:hover,.search-result.router-link-active{background:var(--c-accent-bg);color:var(--c-accent)}.search-result small{color:var(--c-text-mute);font-size:9px}.sidebar-empty{padding:20px 8px;color:var(--c-text-mute);font-size:11px;text-align:center}.related-notes{margin:20px 4px 0;padding-top:17px;border-top:1px solid var(--c-border)}.related-notes>a{display:flex;gap:8px;padding:8px 9px;border-radius:8px;color:var(--c-text);text-decoration:none}.related-notes>a:hover{background:var(--c-bg-light)}.related-notes>a>i{color:var(--c-accent);font-style:normal;font-size:10px}.related-notes>a>span{min-width:0;display:flex;flex-direction:column;gap:2px}.related-notes b{overflow:hidden;text-overflow:ellipsis;color:inherit;font:500 11px/1.35 inherit;white-space:nowrap}.related-notes small{color:var(--c-text-mute);font-size:8px}
</style>
