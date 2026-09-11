<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight, CornerDownLeft, FileText, Folder, Layers, Moon, Sun } from 'lucide-vue-next'
import { useNotesStore } from '@/stores/notes'
import { useUiStore } from '@/stores/ui'
import { NAV_ITEMS, PROJECTS } from '@/data/site'
import { useHotkey, useScrollLock } from '@/composables/useInteractions'
import { formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'
import NoteStatusBadge from '@/components/notes/NoteStatusBadge.vue'
import type { NoteStatus } from '@/lib/notes/types'

interface Command {
  id: string
  label: string
  hint: string
  group: '页面' | '项目' | '笔记' | '操作'
  to?: string
  run?: () => void
  status?: NoteStatus
  external?: string
}

const ui = useUiStore()
const notes = useNotesStore()
const router = useRouter()

const query = ref('')
const cursor = ref(0)
const inputRef = ref<HTMLInputElement | null>(null)
const listRef = ref<HTMLElement | null>(null)

useHotkey('mod+k', () => (ui.paletteOpen ? ui.closePalette() : ui.openPalette()))
useScrollLock(computed(() => ui.paletteOpen))

const staticCommands = computed<Command[]>(() => [
  ...NAV_ITEMS.map<Command>((item) => ({
    id: `page-${item.key}`,
    label: item.label,
    hint: item.hint,
    group: '页面',
    to: item.to,
  })),
  ...PROJECTS.map<Command>((project) => ({
    id: `project-${project.id}`,
    label: project.title,
    hint: project.focus,
    group: '项目',
    external: project.demo,
  })),
  {
    id: 'action-theme',
    label: ui.isDark ? '切换到亮色模式' : '切换到深色模式',
    hint: '外观',
    group: '操作',
    run: () => ui.toggleTheme(),
  },
])

const noteCommands = computed<Command[]>(() => {
  const keyword = query.value.trim()
  const source = keyword ? notes.search(keyword, 40) : notes.recent
  return source.map((note) => ({
    id: `note-${note.path}`,
    label: note.title,
    hint: `${formatDate(note.date)} · ${note.readingTime} 分钟 · ${note.tags.slice(0, 2).join(' / ')}`,
    group: '笔记' as const,
    to: note.path,
    status: note.status,
  }))
})

const results = computed<Command[]>(() => {
  const keyword = query.value.trim().toLowerCase()
  if (!keyword) return [...noteCommands.value, ...staticCommands.value]

  const matchedStatic = staticCommands.value.filter((command) =>
    `${command.label} ${command.hint}`.toLowerCase().includes(keyword),
  )
  return [...noteCommands.value, ...matchedStatic]
})

const grouped = computed(() => {
  const order: Command['group'][] = ['笔记', '页面', '项目', '操作']
  const map = new Map<Command['group'], Command[]>()
  for (const command of results.value) {
    map.set(command.group, [...(map.get(command.group) ?? []), command])
  }
  return order
    .filter((key) => map.get(key)?.length)
    .map((key) => ({ key, items: (map.get(key) ?? []).slice(0, key === '笔记' ? 12 : 8) }))
})

const flat = computed(() => grouped.value.flatMap((section) => section.items))

watch(results, () => {
  cursor.value = 0
})

watch(
  () => ui.paletteOpen,
  async (open) => {
    if (!open) {
      query.value = ''
      return
    }
    await nextTick()
    inputRef.value?.focus()
  },
)

const close = () => ui.closePalette()

const run = async (command: Command | undefined) => {
  if (!command) return
  if (command.run) {
    command.run()
    if (command.group === '操作') return
  }
  if (command.external) {
    window.open(command.external, '_blank', 'noreferrer')
    close()
    return
  }
  if (command.to) {
    close()
    await router.push(command.to)
  }
}

const move = (delta: number) => {
  const total = flat.value.length
  if (!total) return
  cursor.value = (cursor.value + delta + total) % total
  nextTick(() => {
    listRef.value
      ?.querySelector<HTMLElement>(`[data-index="${cursor.value}"]`)
      ?.scrollIntoView({ block: 'nearest' })
  })
}

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    move(1)
    return
  }
  if (event.key === 'ArrowUp') {
    event.preventDefault()
    move(-1)
    return
  }
  if (event.key === 'Enter') {
    event.preventDefault()
    void run(flat.value[cursor.value])
    return
  }
  if (event.key === 'Escape') {
    event.preventDefault()
    close()
  }
}

const onGlobalKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && ui.paletteOpen) close()
}

onMounted(() => window.addEventListener('keydown', onGlobalKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onGlobalKeydown))

const groupIcon = (group: Command['group']) => {
  if (group === '笔记') return FileText
  if (group === '项目') return Layers
  if (group === '页面') return Folder
  return ui.isDark ? Sun : Moon
}
</script>

<template>
  <Teleport to="body">
    <Transition name="palette">
      <div
        v-if="ui.paletteOpen"
        class="fixed inset-0 z-[80] flex items-start justify-center px-4 pt-[12vh]"
        role="dialog"
        aria-modal="true"
        aria-label="全局搜索"
      >
        <div
          class="absolute inset-0 bg-forest/45 backdrop-blur-md"
          @click="close"
          aria-hidden="true"
        />

        <div
          class="relative flex max-h-[70vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-line bg-paper shadow-[var(--shadow-lg)]"
        >
          <div class="flex items-center gap-3 border-b border-line px-4 py-3.5">
            <span class="font-mono text-xs text-ember select-none">⌘</span>
            <input
              ref="inputRef"
              v-model="query"
              type="text"
              class="min-w-0 flex-1 bg-transparent text-[0.95rem] outline-none placeholder:text-faint"
              placeholder="搜索笔记标题、标签、路径，或跳转到某一页…"
              autocomplete="off"
              spellcheck="false"
              @keydown="onKeydown"
            />
            <button
              type="button"
              class="rounded border border-line px-1.5 py-0.5 font-mono text-[0.6rem] text-faint transition-colors hover:border-ember/40 hover:text-ember"
              @click="close"
            >
              ESC
            </button>
          </div>

          <div ref="listRef" class="hide-scrollbar min-h-0 flex-1 overflow-y-auto py-2">
            <template v-if="flat.length">
              <div v-for="section in grouped" :key="section.key" class="px-2 pb-1">
                <p
                  class="flex items-center gap-2 px-2.5 py-2 font-mono text-[0.58rem] tracking-[0.18em] text-faint uppercase"
                >
                  <component :is="groupIcon(section.key)" :size="11" />
                  {{ section.key }}
                  <span class="ml-auto">{{ section.items.length }}</span>
                </p>

                <button
                  v-for="item in section.items"
                  :key="item.id"
                  type="button"
                  :data-index="flat.findIndex((entry) => entry.id === item.id)"
                  :class="
                    cn(
                      'group flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left transition-colors duration-150',
                      flat[cursor]?.id === item.id
                        ? 'bg-ember/12 text-ink'
                        : 'text-ink-soft hover:bg-paper-2',
                    )
                  "
                  @mouseenter="cursor = flat.findIndex((entry) => entry.id === item.id)"
                  @click="run(item)"
                >
                  <span class="min-w-0 flex-1">
                    <span class="block truncate text-[0.88rem]">{{ item.label }}</span>
                    <span class="block truncate font-mono text-[0.62rem] text-faint">
                      {{ item.hint }}
                    </span>
                  </span>
                  <NoteStatusBadge
                    v-if="item.status"
                    :status="item.status"
                    variant="dot"
                    class="shrink-0"
                  />
                  <ArrowRight
                    :size="13"
                    class="shrink-0 text-faint opacity-0 transition-opacity group-hover:opacity-100"
                    :class="flat[cursor]?.id === item.id && 'opacity-100 text-ember'"
                  />
                </button>
              </div>
            </template>

            <div v-else class="px-5 py-10 text-center">
              <p class="font-serif text-lg">🦊 狐狸翻遍了花园，没有找到匹配的内容。</p>
              <p class="mt-1 text-[0.78rem] text-muted">
                试试更短的关键词，或者直接按标签浏览笔记库。
              </p>
            </div>
          </div>

          <footer
            class="flex items-center justify-between border-t border-line px-4 py-2.5 font-mono text-[0.6rem] text-faint"
          >
            <span class="flex items-center gap-3">
              <span class="flex items-center gap-1"><CornerDownLeft :size="11" /> 打开</span>
              <span>↑ ↓ 移动</span>
            </span>
            <span>{{ notes.stats.total }} 篇笔记已索引</span>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.palette-enter-active,
.palette-leave-active {
  transition: opacity 0.24s ease;
}
.palette-enter-active > div:last-child,
.palette-leave-active > div:last-child {
  transition:
    transform 0.34s var(--ease-out-quint),
    opacity 0.3s ease;
}
.palette-enter-from,
.palette-leave-to {
  opacity: 0;
}
.palette-enter-from > div:last-child,
.palette-leave-to > div:last-child {
  opacity: 0;
  transform: translateY(-14px) scale(0.98);
}
</style>
