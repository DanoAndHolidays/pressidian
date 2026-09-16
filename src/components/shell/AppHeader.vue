<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Menu, Moon, Search, Sun, X } from 'lucide-vue-next'
import FoxMark from './FoxMark.vue'
import InteractiveHoverLinks from '@/components/ui/interactive-hover-links/InteractiveHoverLinks.vue'
import { NAV_HOVER_LINKS } from '@/data/site'
import { useUiStore } from '@/stores/ui'
import { useNotesStore } from '@/stores/notes'
import { useScrollLock, useScrollProgress } from '@/composables/useInteractions'
import { cn } from '@/lib/utils'

const ui = useUiStore()
const notes = useNotesStore()
const route = useRoute()

const progress = useScrollProgress()
const scrolled = ref(false)
const isMac = ref(false)
const navigationDialog = ref<HTMLDialogElement | null>(null)
useScrollLock(computed(() => ui.navOpen))

const onNavigationKeydown = (event: KeyboardEvent) => {
  if (event.key !== 'Tab') return
  const controls = navigationDialog.value?.querySelectorAll<HTMLElement>('button:not(:disabled), a[href]')
  const first = controls?.[0]
  const last = controls?.[controls.length - 1]
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last?.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first?.focus()
  }
}

watch(
  () => ui.navOpen,
  (open) => {
    if (open) navigationDialog.value?.showModal()
    else navigationDialog.value?.close()
  },
  { flush: 'post' },
)

const onScroll = () => {
  scrolled.value = window.scrollY > 12
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  isMac.value = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)
})

onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))

watch(
  () => route.fullPath,
  () => {
    ui.navOpen = false
  },
)

const shortcutLabel = computed(() => (isMac.value ? '⌘K' : 'Ctrl K'))
</script>

<template>
  <header
    :class="
      cn(
        'fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500',
        scrolled
          ? 'border-b border-line/80 bg-[var(--glass)] backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent',
      )
    "
  >
    <div class="shell-wide flex h-[68px] items-center gap-4">
      <RouterLink
        to="/"
        class="group flex shrink-0 items-center gap-2.5 focus-ring rounded-sm"
        aria-label="Pressidian 首页"
      >
        <FoxMark :size="30" class="transition-transform duration-500 group-hover:-rotate-6" />
        <span class="flex flex-col leading-none">
          <span class="font-serif text-[1.24rem] tracking-[-0.04em]">Pressidian</span>
          <span class="font-mono text-[0.72rem] tracking-[0.24em] text-faint uppercase">
            digital garden
          </span>
        </span>
      </RouterLink>

      <div class="ml-auto flex items-center gap-2">
        <button
          type="button"
          class="group hidden h-9 items-center gap-2.5 rounded-full border border-line bg-paper/70 pr-2 pl-3 text-[0.76rem] text-muted transition-colors duration-300 hover:border-ember/50 hover:text-ink sm:flex focus-ring"
          @click="ui.openPalette()"
        >
          <Search :size="14" class="text-ember" />
          <span class="hidden md:inline">搜索笔记、项目…</span>
          <span class="md:hidden">搜索</span>
          <kbd
            class="ml-1 rounded border border-line bg-canvas px-1.5 py-0.5 font-mono text-[0.7rem] text-faint"
          >
            {{ shortcutLabel }}
          </kbd>
        </button>

        <button
          type="button"
          class="grid size-9 place-items-center rounded-full border border-line bg-paper/70 text-ink-soft transition-colors duration-300 hover:border-ember/50 hover:text-ember sm:hidden focus-ring"
          aria-label="搜索"
          @click="ui.openPalette()"
        >
          <Search :size="15" />
        </button>

        <button
          type="button"
          class="grid size-9 place-items-center rounded-full border border-line bg-paper/70 text-ink-soft transition-all duration-500 hover:border-ember/50 hover:text-ember focus-ring"
          :aria-label="ui.isDark ? '切换到亮色模式' : '切换到深色模式'"
          @click="ui.toggleTheme()"
        >
          <Transition name="swap" mode="out-in">
            <Sun v-if="ui.isDark" :size="15" key="sun" />
            <Moon v-else :size="15" key="moon" />
          </Transition>
        </button>

        <button
          type="button"
          class="flex h-9 items-center gap-2 rounded-full border border-line bg-paper/70 px-3 text-ink-soft transition-colors duration-300 hover:border-ember/50 hover:text-ember focus-ring"
          :aria-expanded="ui.navOpen"
          aria-controls="site-navigation"
          aria-haspopup="dialog"
          aria-label="打开导航"
          @click="ui.navOpen = !ui.navOpen"
        >
          <span class="hidden text-[0.8rem] sm:inline">导航</span>
          <Menu :size="16" />
        </button>
      </div>
    </div>

    <!-- Reading progress for the whole document. -->
    <div class="relative h-px w-full overflow-hidden">
      <div
        class="h-px origin-left bg-gradient-to-r from-ember to-amber transition-transform duration-150 ease-out"
        :style="{ transform: `scaleX(${progress})` }"
      />
    </div>

  </header>

  <Teleport to="body">
    <dialog
      id="site-navigation"
      ref="navigationDialog"
      class="navigation-dialog"
      aria-labelledby="navigation-title"
      @keydown="onNavigationKeydown"
      @cancel.prevent="ui.navOpen = false"
      @close="ui.navOpen = false"
    >
      <div class="shell-wide flex min-h-[68px] items-center justify-between gap-4 border-b border-line">
        <span class="flex items-center gap-2.5">
          <FoxMark :size="30" />
          <span class="font-serif text-[1.24rem] tracking-[-0.04em]">Pressidian</span>
        </span>
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="grid size-9 place-items-center rounded-full border border-line text-ink-soft hover:text-ember focus-ring"
            :aria-label="ui.isDark ? '切换到亮色模式' : '切换到深色模式'"
            @click="ui.toggleTheme()"
          >
            <Sun v-if="ui.isDark" :size="15" />
            <Moon v-else :size="15" />
          </button>
          <button
            type="button"
            class="flex h-9 items-center gap-2 rounded-full border border-line px-3 text-[0.8rem] text-ink-soft hover:border-ember/50 hover:text-ember focus-ring"
            aria-label="关闭导航"
            autofocus
            @click="ui.navOpen = false"
          >
            <span>关闭</span>
            <X :size="16" />
          </button>
        </div>
      </div>
      <div v-if="ui.navOpen" class="navigation-content">
        <div class="mb-4 flex items-end justify-between gap-4 md:mb-6">
          <div>
            <p class="eyebrow mb-2">Explore the garden</p>
            <h2 id="navigation-title" class="text-lg text-ink-soft">去花园里走走。</h2>
          </div>
          <span class="hidden font-mono text-[0.7rem] tracking-[0.12em] text-muted sm:block">
            01 — {{ String(NAV_HOVER_LINKS.length).padStart(2, '0') }}
          </span>
        </div>
        <InteractiveHoverLinks :links="NAV_HOVER_LINKS" @navigate="ui.navOpen = false" />
        <div class="mt-6 flex flex-wrap items-center justify-between gap-3 text-[0.7rem] text-muted">
          <p class="font-mono tracking-[0.06em]">
            {{ notes.stats.total }} 篇笔记 · {{ notes.stats.links }} 条关联
          </p>
          <span class="hidden sm:inline">按 Esc 返回 · 保持好奇，慢慢探索</span>
        </div>
      </div>
    </dialog>
  </Teleport>
</template>

<style scoped>
.swap-enter-active,
.swap-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.35s var(--ease-spring);
}
.swap-enter-from {
  opacity: 0;
  transform: rotate(-70deg) scale(0.6);
}
.swap-leave-to {
  opacity: 0;
  transform: rotate(70deg) scale(0.6);
}

.navigation-dialog {
  position: fixed;
  inset: 0;
  width: 100%;
  max-width: none;
  height: 100dvh;
  max-height: none;
  margin: 0;
  padding: 0;
  border: 0;
  background: var(--canvas);
  color: var(--ink);
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
}
.navigation-dialog::backdrop { background: var(--canvas); }
.navigation-dialog[open] { animation: fade-in 0.25s ease both; }
.navigation-content {
  width: min(100% - 3rem, 64rem);
  margin-inline: auto;
  padding-block: clamp(1.5rem, 4vh, 3rem);
}
@media (max-width: 640px) {
  .navigation-content { padding-block: 1.5rem; }
}
</style>
