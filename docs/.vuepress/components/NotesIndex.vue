<script setup>
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import notes from '../data/content-index.json'

const query = ref('')
const activeTag = ref('全部')

const tags = computed(() => ['全部', ...new Set(notes.flatMap((note) => note.tags || []))])
const filteredNotes = computed(() => {
  const keyword = query.value.trim().toLowerCase()
  return notes.filter((note) => {
    const tagMatched = activeTag.value === '全部' || note.tags?.includes(activeTag.value)
    const haystack = `${note.title} ${note.description} ${(note.tags || []).join(' ')}`.toLowerCase()
    return tagMatched && (!keyword || haystack.includes(keyword))
  })
})

const statusLabel = { evergreen: '常青', growing: '生长中', seedling: '幼苗' }
</script>

<template>
  <div class="notes-index">
    <header>
      <p>THE KNOWLEDGE GARDEN</p>
      <h1>笔记不是归档，<br />而是正在生长的路径。</h1>
      <span>狐狸整理了 {{ notes.length }} 篇公开笔记。可以按主题筛选，也可以直接搜索。</span>
    </header>
    <div class="note-tools">
      <label><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="6"/><path d="m16 16 4 4"/></svg><input v-model="query" type="search" placeholder="搜索标题、摘要或标签…" /></label>
      <div class="tags"><button v-for="tag in tags" :key="tag" :class="{ active: activeTag === tag }" @click="activeTag = tag">{{ tag }}</button></div>
    </div>
    <div v-if="filteredNotes.length" class="note-list">
      <RouterLink v-for="note in filteredNotes" :key="note.path" :to="note.path" class="note-row">
        <div class="date"><b>{{ note.date?.slice(5) || 'NOW' }}</b><span>{{ note.date?.slice(0,4) }}</span></div>
        <div><div class="meta"><span>🌿 {{ statusLabel[note.status] || '幼苗' }}</span><span>{{ note.tags?.join(' / ') }}</span></div><h2>{{ note.title }}</h2><p>{{ note.description }}</p></div>
        <div class="read">{{ note.readingTime || 5 }} MIN <b>↗</b></div>
      </RouterLink>
    </div>
    <div v-else class="empty">🦊 狐狸翻遍了花园，没有找到匹配的笔记。</div>
  </div>
</template>

<style scoped>
.notes-index{padding:2rem 0 4rem}.notes-index header{padding:3rem 0 3.5rem;border-bottom:1px solid var(--c-border)}header>p{color:var(--c-accent);font-size:.7rem;letter-spacing:.16em;font-weight:700}h1{font:500 clamp(2.8rem,7vw,5.4rem)/1.02 Georgia,"Songti SC",serif!important;letter-spacing:-.055em!important;margin:1.3rem 0!important}header>span{color:var(--c-text-mute);line-height:1.8}.note-tools{padding:1.5rem 0;border-bottom:1px solid var(--c-border);display:grid;gap:1rem}.note-tools label{height:46px;border:1px solid var(--c-border);border-radius:99px;display:flex;align-items:center;padding:0 1rem;background:var(--c-bg-light)}label svg{width:17px;color:var(--c-accent);margin-right:.7rem}label input{flex:1;border:0;outline:0;background:transparent;color:var(--c-text);font:inherit}.tags{display:flex;gap:.5rem;flex-wrap:wrap}.tags button{border:1px solid var(--c-border);background:transparent;color:var(--c-text-mute);padding:.45rem .75rem;border-radius:99px;cursor:pointer;font-size:.72rem}.tags button.active{color:white;background:var(--c-accent);border-color:var(--c-accent)}.note-row{display:grid;grid-template-columns:80px 1fr auto;gap:1.6rem;padding:2rem 0;border-bottom:1px solid var(--c-border);color:var(--c-text);text-decoration:none}.date b{display:block;color:var(--c-accent);font-size:1rem}.date span{color:var(--c-text-mute);font-size:.7rem}.meta{display:flex;gap:1rem;color:var(--c-text-mute);font-size:.65rem;letter-spacing:.08em;text-transform:uppercase}.note-row h2{font:500 1.45rem/1.3 Georgia,"Songti SC",serif!important;margin:.65rem 0!important}.note-row p{color:var(--c-text-mute);font-size:.82rem;margin:0;line-height:1.7}.read{font-size:.65rem;color:var(--c-text-mute);white-space:nowrap}.read b{color:var(--c-accent);font-size:1rem;margin-left:.5rem}.note-row:hover h2{color:var(--c-accent)}.empty{padding:4rem 1rem;text-align:center;color:var(--c-text-mute)}@media(max-width:650px){.note-row{grid-template-columns:48px 1fr}.read{display:none}h1{font-size:2.9rem!important}.notes-index header{padding-top:1.5rem}}
</style>
