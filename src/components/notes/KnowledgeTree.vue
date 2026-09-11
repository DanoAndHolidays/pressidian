<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ChevronRight, FolderOpen, FolderClosed } from 'lucide-vue-next'
import { useRoute } from 'vue-router'
import { useNotesStore, type TreeNode } from '@/stores/notes'
import { cn } from '@/lib/utils'

/**
 * The vault folder tree. Branches auto-open along the active note's path so
 * the reader always sees where they are without hunting for it.
 */
const props = withDefaults(defineProps<{ node?: TreeNode; depth?: number }>(), {
  node: undefined,
  depth: 0,
})

// Recursive self-reference: the template renders `<KnowledgeTree>` for folders.
defineOptions({ name: 'KnowledgeTree' })

const notes = useNotesStore()
const route = useRoute()

const current = computed(() => decodeURIComponent(route.path).replace(/\/$/, ''))
const open = ref(props.depth < 1)

const activeTrail = computed(() => {
  const segments = current.value
    .replace(/^\/notes\//, '')
    .split('/')
    .filter(Boolean)
  return segments.slice(0, -1)
})

watch(
  activeTrail,
  (trail) => {
    if (props.node?.type !== 'folder' || props.depth === 0) return
    if (trail.includes(props.node.label)) open.value = true
  },
  { immediate: true },
)

const isActive = (path: string) => current.value === path
</script>

<template>
  <ul v-if="node" :class="cn('grid', depth === 0 ? 'gap-0.5' : 'gap-0.5')" role="tree">
    <li v-for="child in node.children" :key="child.key" role="treeitem" :aria-expanded="child.type === 'folder' ? open : undefined">
      <!-- folder -->
      <template v-if="child.type === 'folder'">
        <button
          type="button"
          class="group flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors duration-300 hover:bg-paper-2"
          :class="cn(depth > 0 && 'ml-2')"
          @click="open = !open"
        >
          <ChevronRight
            :size="12"
            class="shrink-0 text-faint transition-transform duration-300"
            :class="open && 'rotate-90'"
          />
          <FolderOpen v-if="open" :size="13" class="shrink-0 text-ember/80" />
          <FolderClosed v-else :size="13" class="shrink-0 text-faint" />
          <span class="min-w-0 flex-1 truncate text-[0.8rem] text-ink-soft group-hover:text-ink">
            {{ child.label }}
          </span>
          <span class="shrink-0 font-mono text-[0.72rem] text-faint">{{ child.count }}</span>
        </button>

        <Transition
          enter-active-class="transition-[grid-template-rows,opacity] duration-300 ease-out"
          leave-active-class="transition-[grid-template-rows,opacity] duration-200 ease-in"
          enter-from-class="grid-rows-[0fr] opacity-0"
          leave-to-class="grid-rows-[0fr] opacity-0"
        >
          <div v-if="open" class="grid grid-rows-[1fr]">
            <div class="overflow-hidden">
              <KnowledgeTree :node="child" :depth="depth + 1" />
            </div>
          </div>
        </Transition>
      </template>

      <!-- note -->
      <RouterLink
        v-else
        :to="child.key"
        :class="
          cn(
            'group flex items-center gap-2 rounded-lg py-1.5 pr-2 pl-6 text-[0.8rem] transition-colors duration-300',
            depth > 0 && 'ml-2',
            isActive(child.key)
              ? 'bg-ember/12 text-ember'
              : 'text-muted hover:bg-paper-2 hover:text-ink',
          )
        "
      >
        <span
          class="size-1 shrink-0 rounded-full transition-colors"
          :class="isActive(child.key) ? 'bg-ember' : 'bg-line-strong group-hover:bg-ember/60'"
          aria-hidden="true"
        />
        <span class="min-w-0 flex-1 truncate">{{ child.label }}</span>
      </RouterLink>
    </li>
  </ul>

  <ul v-else class="grid gap-0.5" role="tree" aria-label="笔记目录">
    <li>
      <div
        class="mb-2 flex items-center justify-between gap-2 border-b border-line px-2 pb-2"
      >
        <span class="eyebrow">Knowledge paths</span>
        <span class="font-mono text-[0.7rem] text-faint">{{ notes.stats.total }} 篇</span>
      </div>
    </li>
    <KnowledgeTree :node="notes.tree" :depth="0" />
  </ul>
</template>
