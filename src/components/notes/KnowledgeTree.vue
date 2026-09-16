<script setup lang="ts">
import { computed, watch } from 'vue'
import { ChevronRight, FolderOpen, FolderClosed } from 'lucide-vue-next'
import { useRoute } from 'vue-router'
import { useNotesStore, type TreeNode } from '@/stores/notes'
import { cn } from '@/lib/utils'

/**
 * The vault folder tree. Branches auto-open along the active note's path so the
 * reader always sees where they are without hunting for it.
 *
 * Expansion state is *not* local to this component. It used to be, which meant
 * each recursive instance owned one flag that the active-path watcher drove from
 * its parent's trail — so a folder whose label happened to appear in that trail
 * opened the entire sibling group it rendered. The store now keys expansion by
 * folder path, so a toggle affects exactly one folder.
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
const isOpen = (key: string) => notes.isFolderOpen(key)

const isActive = (path: string) => current.value === path

/*
 * Reveal the trail to the active note. Only ancestor folders are opened, and
 * only the route drives this — a manual toggle is never undone by it, because
 * nothing here ever closes a folder.
 */
watch(
  () => route.path,
  (path) => {
    if (props.depth === 0 || props.node?.type !== 'folder') return
    if (path.startsWith('/notes/')) notes.revealPath(path)
  },
  { immediate: true },
)
</script>

<template>
  <ul v-if="node" class="grid gap-0.5" role="tree">
    <li v-for="child in node.children" :key="child.key" role="treeitem">
      <!-- folder -->
      <template v-if="child.type === 'folder'">
        <button
          type="button"
          class="group flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors duration-300 hover:bg-paper-2"
          :class="cn(depth > 0 && 'ml-2')"
          :aria-expanded="isOpen(child.key)"
          @click="notes.toggleFolder(child.key)"
        >
          <ChevronRight
            :size="12"
            class="shrink-0 text-faint transition-transform duration-300"
            :class="isOpen(child.key) && 'rotate-90'"
          />
          <FolderOpen v-if="isOpen(child.key)" :size="13" class="shrink-0 text-ember/80" />
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
          <div v-if="isOpen(child.key)" class="grid grid-rows-[1fr]">
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
