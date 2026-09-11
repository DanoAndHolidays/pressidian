<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ArrowUpRight, LayoutGrid, List, Search, SlidersHorizontal, X } from 'lucide-vue-next'
import NoteStatusBadge from '@/components/notes/NoteStatusBadge.vue'
import KnowledgeTree from '@/components/notes/KnowledgeTree.vue'
import { useNotesStore, type SortKey } from '@/stores/notes'
import { STATUS_META } from '@/data/site'
import { compactNumber, relativeTime } from '@/lib/format'
import { useSpotlight } from '@/composables/useInteractions'
import { cn } from '@/lib/utils'
import type { NoteStatus } from '@/lib/notes/types'

const notes = useNotesStore()
const { onPointerMove } = useSpotlight()

const query = ref('')
const view = ref<'grid' | 'list'>(localStorage.getItem('pressidian:notes-view') === 'list' ? 'list' : 'grid')
const showTree = ref(false)

watch(view, (value) => {
  try {
    localStorage.setItem('pressidian:notes-view', value)
  } catch {
    /* storage unavailable */
  }
})

const SORTS: Array<{ key: SortKey; label: string }> = [
  { key: 'date', label: '最近更新' },
  { key: 'title', label: '标题' },
  { key: 'weight', label: '篇幅' },
  { key: 'degree', label: '关联度' },
]

const STATUSES: Array<{ key: NoteStatus | 'all'; label: string }> = [
  { key: 'all', label: '全部' },
  { key: 'evergreen', label: STATUS_META.evergreen.label },
  { key: 'growing', label: STATUS_META.growing.label },
  { key: 'seedling', label: STATUS_META.seedling.label },
]

const filtered = computed(() => {
  const keyword = query.value.trim()
  let list = keyword ? notes.search(keyword, 400) : notes.notes

  if (notes.activeTag !== '全部') {
    list = list.filter((note) => note.tags.includes(notes.activeTag))
  }
  if (notes.statusFilter !== 'all') {
    list = list.filter((note) => note.status === notes.statusFilter)
  }
  return keyword ? list : notes.sortNotes(list)
})

const hasFilters = computed(
  () => Boolean(query.value.trim()) || notes.activeTag !== '全部' || notes.statusFilter !== 'all',
)

const clearFilters = () => {
  query.value = ''
  notes.activeTag = '全部'
  notes.statusFilter = 'all'
}
</script>

<template>
  <div class="shell-wide pt-14 pb-4">
    <!-- ============ HEADER ============ -->
    <header class="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-end">
      <div>
        <p class="eyebrow">The knowledge garden</p>
        <h1 class="mt-4 font-serif text-[clamp(2.3rem,5.4vw,4.2rem)] leading-[1.04] tracking-[-0.05em]">
          笔记不是归档，<br />
          而是<span class="text-gradient-ember italic">正在生长</span>的路径。
        </h1>
        <p class="mt-5 max-w-xl text-[0.9rem] leading-relaxed text-muted">
          {{ notes.stats.total }} 篇公开笔记，共 {{ compactNumber(notes.stats.weight) }} 字、
          {{ notes.stats.links }} 条双向关联。可以按主题筛选，也可以直接搜索标题或路径。
        </p>
      </div>

      <div class="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line">
        <div
          v-for="stat in [
            { label: '笔记', value: notes.stats.total },
            { label: '分钟阅读', value: notes.stats.minutes },
            { label: '关联', value: notes.stats.links },
            { label: '路径', value: notes.stats.folders },
          ]"
          :key="stat.label"
          class="bg-paper px-4 py-3.5"
        >
          <p class="font-mono text-[0.56rem] tracking-[0.16em] text-faint uppercase">
            {{ stat.label }}
          </p>
          <p class="mt-1.5 font-serif text-xl tracking-[-0.02em]">{{ stat.value }}</p>
        </div>
      </div>
    </header>

    <!-- ============ TOOLBAR ============ -->
    <div class="sticky top-[68px] z-30 -mx-1 mt-9 border-y border-line bg-[var(--glass)] px-1 py-3 backdrop-blur-xl">
      <div class="flex flex-wrap items-center gap-3">
        <label
          class="flex h-10 min-w-[15rem] flex-1 items-center gap-2.5 rounded-full border border-line bg-paper px-4 transition-colors focus-within:border-ember/60"
        >
          <Search :size="15" class="shrink-0 text-ember" />
          <input
            v-model="query"
            type="search"
            placeholder="搜索标题、摘要、标签或路径…"
            class="min-w-0 flex-1 bg-transparent text-[0.86rem] outline-none placeholder:text-faint"
            aria-label="搜索笔记"
          />
          <button
            v-if="query"
            type="button"
            class="text-faint transition-colors hover:text-ember"
            aria-label="清空搜索"
            @click="query = ''"
          >
            <X :size="14" />
          </button>
        </label>

        <button
          type="button"
          :class="
            cn(
              'flex h-10 items-center gap-2 rounded-full border px-3.5 text-[0.78rem] transition-colors lg:hidden',
              showTree ? 'border-ember/50 text-ember' : 'border-line text-ink-soft',
            )
          "
          @click="showTree = !showTree"
        >
          <SlidersHorizontal :size="14" />
          目录
        </button>

        <div class="hide-scrollbar flex items-center gap-1 overflow-x-auto">
          <button
            v-for="sort in SORTS"
            :key="sort.key"
            type="button"
            :class="
              cn(
                'shrink-0 rounded-full px-3 py-1.5 text-[0.74rem] transition-colors duration-300',
                notes.sortKey === sort.key
                  ? 'bg-ink text-canvas'
                  : 'text-muted hover:text-ink',
              )
            "
            @click="notes.sortKey = sort.key"
          >
            {{ sort.label }}
          </button>
        </div>

        <div class="ml-auto flex items-center gap-1 rounded-full border border-line bg-paper p-1">
          <button
            type="button"
            :class="cn('grid size-7 place-items-center rounded-full transition-colors', view === 'grid' ? 'bg-ember text-[#1b1206]' : 'text-muted hover:text-ink')"
            aria-label="网格视图"
            @click="view = 'grid'"
          >
            <LayoutGrid :size="14" />
          </button>
          <button
            type="button"
            :class="cn('grid size-7 place-items-center rounded-full transition-colors', view === 'list' ? 'bg-ember text-[#1b1206]' : 'text-muted hover:text-ink')"
            aria-label="列表视图"
            @click="view = 'list'"
          >
            <List :size="14" />
          </button>
        </div>
      </div>

      <!-- tag + status filters -->
      <div class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        <div class="hide-scrollbar flex items-center gap-1.5 overflow-x-auto">
          <button
            type="button"
            :class="
              cn(
                'shrink-0 rounded-full border px-2.5 py-1 font-mono text-[0.64rem] transition-colors duration-300',
                notes.activeTag === '全部'
                  ? 'border-ember bg-ember/12 text-ember'
                  : 'border-line text-muted hover:border-ember/40 hover:text-ink',
              )
            "
            @click="notes.activeTag = '全部'"
          >
            全部主题
          </button>
          <button
            v-for="tag in notes.topTags"
            :key="tag.tag"
            type="button"
            :class="
              cn(
                'shrink-0 rounded-full border px-2.5 py-1 font-mono text-[0.64rem] transition-colors duration-300',
                notes.activeTag === tag.tag
                  ? 'border-ember bg-ember/12 text-ember'
                  : 'border-line text-muted hover:border-ember/40 hover:text-ink',
              )
            "
            @click="notes.activeTag = tag.tag"
          >
            {{ tag.tag }}
            <span class="ml-1 text-faint">{{ tag.count }}</span>
          </button>
        </div>

        <div class="flex items-center gap-1.5">
          <button
            v-for="status in STATUSES"
            :key="status.key"
            type="button"
            :class="
              cn(
                'rounded-full px-2.5 py-1 text-[0.7rem] transition-colors duration-300',
                notes.statusFilter === status.key
                  ? 'bg-paper-3 text-ink'
                  : 'text-faint hover:text-ink',
              )
            "
            @click="notes.statusFilter = status.key"
          >
            {{ status.label }}
          </button>
        </div>

        <button
          v-if="hasFilters"
          type="button"
          class="ml-auto flex items-center gap-1.5 font-mono text-[0.64rem] text-ember transition-opacity hover:opacity-70"
          @click="clearFilters"
        >
          <X :size="12" />
          清除筛选
        </button>
      </div>
    </div>

    <!-- ============ BODY ============ -->
    <div class="mt-8 grid gap-10 lg:grid-cols-[17rem_1fr] xl:grid-cols-[19rem_1fr]">
      <aside :class="cn('lg:block', showTree ? 'block' : 'hidden')">
        <div class="sticky top-[13.5rem] max-h-[calc(100svh-15rem)] overflow-y-auto pr-1">
          <KnowledgeTree />
        </div>
      </aside>

      <div>
        <div class="mb-4 flex items-baseline justify-between gap-4">
          <p class="font-mono text-[0.68rem] tracking-[0.12em] text-faint uppercase">
            {{ filtered.length }} 篇 · {{ notes.activeTag }}
          </p>
          <p
            class="hidden font-mono text-[0.62rem] text-faint sm:block"
            title="笔记日期取自正文或文件名；同步月份是内容最后一次从 Obsidian 仓库拉取的时间"
          >
            内容跨度 {{ notes.dateRange.span }} · 同步于 {{ notes.dateRange.syncedLabel }}
          </p>
        </div>

        <!-- grid view -->
        <div v-if="filtered.length && view === 'grid'" class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <RouterLink
            v-for="(note, index) in filtered"
            :key="note.path"
            v-reveal="Math.min(index, 12) * 45"
            :to="note.path"
            class="spotlight group relative flex min-h-[14rem] flex-col overflow-hidden rounded-2xl border border-line bg-paper p-5 transition-[border-color,box-shadow] duration-500 hover:border-ember/45 hover:shadow-[var(--shadow-md)]"
            @pointermove="onPointerMove"
          >
            <span
              class="absolute inset-x-0 top-0 h-px scale-x-0 bg-gradient-to-r from-transparent via-ember to-transparent transition-transform duration-700 group-hover:scale-x-100"
              aria-hidden="true"
            />
            <div class="flex items-center justify-between gap-3">
              <NoteStatusBadge :status="note.status" />
              <span class="font-mono text-[0.58rem] text-faint">{{ relativeTime(note.date) }}</span>
            </div>
            <h2
              class="mt-4 font-serif text-[1.24rem] leading-snug tracking-[-0.02em] transition-colors group-hover:text-ember"
            >
              {{ note.title }}
            </h2>
            <p class="mt-2 line-clamp-2 text-[0.8rem] leading-relaxed text-muted">
              {{ note.description }}
            </p>
            <div class="mt-auto flex items-center justify-between pt-4 font-mono text-[0.58rem] text-faint">
              <span class="truncate">{{ note.segments.slice(-2).join(' / ') || '笔记库' }}</span>
              <span class="flex shrink-0 items-center gap-2">
                {{ note.readingTime }} MIN
                <ArrowUpRight :size="12" class="text-ember" />
              </span>
            </div>
          </RouterLink>
        </div>

        <!-- list view -->
        <div v-else-if="filtered.length" class="divide-y divide-line border-y border-line">
          <RouterLink
            v-for="(note, index) in filtered"
            :key="note.path"
            v-reveal="Math.min(index, 14) * 35"
            :to="note.path"
            class="group grid grid-cols-[3.2rem_1fr_auto] items-start gap-4 py-5 transition-colors sm:grid-cols-[4.5rem_1fr_auto] sm:gap-6"
          >
            <div class="pt-1 text-center">
              <p class="font-serif text-lg leading-none text-ember">
                {{ note.date.slice(8, 10) }}
              </p>
              <p class="mt-1 font-mono text-[0.56rem] text-faint">{{ note.date.slice(0, 7) }}</p>
            </div>
            <div class="min-w-0">
              <div class="flex flex-wrap items-center gap-3">
                <NoteStatusBadge :status="note.status" />
                <span class="font-mono text-[0.58rem] text-faint">
                  {{ note.tags.slice(0, 3).join(' / ') }}
                </span>
              </div>
              <h2
                class="mt-2 font-serif text-[1.15rem] leading-snug tracking-[-0.02em] transition-colors group-hover:text-ember"
              >
                {{ note.title }}
              </h2>
              <p class="mt-1.5 line-clamp-2 text-[0.8rem] leading-relaxed text-muted">
                {{ note.description }}
              </p>
            </div>
            <div class="shrink-0 pt-1 text-right font-mono text-[0.58rem] text-faint">
              <p>{{ note.readingTime }} MIN</p>
              <p class="mt-1 flex items-center justify-end gap-1.5">
                {{ note.degree }} 关联
                <ArrowUpRight
                  :size="12"
                  class="text-ember transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </p>
            </div>
          </RouterLink>
        </div>

        <!-- empty -->
        <div v-else class="rounded-2xl border border-dashed border-line-strong/70 px-6 py-20 text-center">
          <p class="font-serif text-xl">🦊 狐狸翻遍了花园，没有找到匹配的笔记。</p>
          <p class="mt-2 text-[0.84rem] text-muted">
            {{ notes.stats.total === 0 ? '笔记库还是空的，先运行一次同步吧。' : '试着换个关键词，或清除筛选条件。' }}
          </p>
          <button
            v-if="hasFilters"
            type="button"
            class="mt-5 rounded-full border border-line px-4 py-2 text-[0.78rem] transition-colors hover:border-ember/50 hover:text-ember"
            @click="clearFilters"
          >
            清除筛选
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
