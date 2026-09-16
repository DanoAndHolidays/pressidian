<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, useTemplateRef, watch } from 'vue'
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

const treeRef = useTemplateRef<HTMLElement>('treeRoot')

/*
 * Reveal the trail to the active note. Only ancestor folders are opened, and
 * only the route drives this — a manual toggle is never undone by it, because
 * nothing here ever closes a folder.
 *
 * The *root* instance owns this, and that is the fix for a cold deep link: a
 * nested instance only exists once its own folder is open, so driving the
 * reveal from each folder could never open the first level. Arriving on a note
 * URL left every folder shut and the note nowhere in the tree — with nothing
 * for the scroll reveal below to scroll to. One call from the root opens the
 * whole trail in a single store update instead of one level per flush.
 */
watch(
  () => route.path,
  (path) => {
    // The root wrapper is the instance without a node of its own.
    if (props.depth !== 0 || props.node) return
    if (path.startsWith('/notes/')) notes.revealPath(path)
  },
  { immediate: true },
)

/** Breathing room kept above and below the row, in px. */
const EDGE = 28
/** Frames the reveal keeps re-checking, ~0.75s, to outlast the folder cascade. */
const REVEAL_FRAMES = 45
/** Consecutive visible checks before the reveal stops touching the scroll. */
const REVEAL_SETTLED = 2

/**
 * The page owns the scrolling, not the tree: on a note the tree sits inside a
 * `sticky … overflow-y-auto` column, and on the index page inside another. The
 * nearest such ancestor is the one to move — scrolling the window instead would
 * drag the article the reader is in the middle of.
 */
function scrollContainerOf(element: HTMLElement): HTMLElement | null {
  for (let node = element.parentElement; node; node = node.parentElement) {
    const { overflowY } = getComputedStyle(node)
    if (overflowY === 'auto' || overflowY === 'scroll') return node
  }
  return null
}

/** Returns true once the active row is inside the container's visible band. */
function bringActiveRowIntoView(): boolean {
  const active = treeRef.value?.querySelector<HTMLElement>('[data-active="true"]')
  if (!active) return false

  const container = scrollContainerOf(active)
  if (!container) {
    // No scrollable ancestor — the inline tree inside the mobile “目录” panel.
    // There the page itself scrolls, and the reader has just asked to see
    // where they are, so centring it is the point rather than an intrusion.
    active.scrollIntoView({ block: 'center' })
    return true
  }

  const row = active.getBoundingClientRect()
  const box = container.getBoundingClientRect()
  if (row.top >= box.top + EDGE && row.bottom <= box.bottom - EDGE) return true

  container.scrollTop += row.top - box.top - (box.height - row.height) / 2
  return true
}

/*
 * The row does not exist the instant the route changes: the trail is opened by
 * this instance's store write and rendered on the following flush, and the
 * column it lands in may already be scrolled somewhere else entirely. So the
 * reveal re-checks across a few frames and stops as soon as the row has held
 * still for a couple of them, which also covers a late layout shift (a lazy
 * image above the tree, a sticky column resizing).
 */
let revealToken = 0

function scheduleReveal() {
  // Only the root wrapper — the instance that owns the ref — drives this. The
  // tree it renders is a second `depth: 0` instance (with a `node` of its own),
  // and the nested levels all return here.
  if (props.depth !== 0 || props.node) return
  if (!current.value.startsWith('/notes/')) return

  const token = ++revealToken
  let frames = 0
  let settled = 0

  const step = () => {
    if (token !== revealToken) return
    settled = bringActiveRowIntoView() ? settled + 1 : 0
    frames += 1
    if (settled > REVEAL_SETTLED || frames > REVEAL_FRAMES) return
    requestAnimationFrame(step)
  }

  void nextTick(step)
}

watch(() => route.path, scheduleReveal)
onMounted(scheduleReveal)
onBeforeUnmount(() => {
  revealToken += 1
})
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
        :data-active="isActive(child.key) ? 'true' : undefined"
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

  <!--
    Only the root instance carries the ref: it wraps the whole tree, so the
    reveal can find the active row with one lookup, and the nested instances
    (which have a `node`) keep the `v-if` branch with no ref at all.
  -->
  <ul v-else ref="treeRoot" class="grid gap-0.5" role="tree" aria-label="笔记目录">
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
