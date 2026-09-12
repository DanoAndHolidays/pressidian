<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Menu, Moon, Search, Sun, X } from 'lucide-vue-next'
import InteractiveHoverLinks from '@/components/ui/interactive-hover-links/InteractiveHoverLinks.vue'
import { NAV_HOVER_LINKS } from '@/data/site'
import { useUiStore } from '@/stores/ui'
import { useNotesStore } from '@/stores/notes'
import { useScrollLock, useScrollProgress } from '@/composables/useInteractions'
import { cn } from '@/lib/utils'

/**
 * Header.
 *
 * The homepage puts the reader on top of a dark painting, and the notes routes
 * put them on warm paper. One header has to be legible over both, so the two
 * states below are spelled out rather than blended:
 *
 * - over the scene and unscrolled  -> light type, no backdrop, the painting
 *   reads straight through it;
 * - over the scene and scrolled    -> the pixel panel drops in behind it;
 * - everywhere else                -> the original paper treatment, untouched.
 *
 * The pixel panel is used for the scrolled state on *every* route rather than
 * only the homepage. It is opaque enough to be a legible bar on paper too, and
 * keeping one scrolled treatment means the header does not visibly change
 * character as the reader moves from the hero into the rest of the page.
 */
const ui = useUiStore()
const notes = useNotesStore()
const route = useRoute()

const progress = useScrollProgress()
const scrolled = ref(false)
const isMac = ref(false)
const navigationDialog = ref<HTMLDialogElement | null>(null)
useScrollLock(computed(() => ui.navOpen))

const overScene = computed(() => route.name === 'home')

/** Light-on-dark only until the reader scrolls away from the hero. */
const onArt = computed(() => overScene.value && !scrolled.value)

const onNavigationKeydown = (event: KeyboardEvent) => {
  if (event.key !== 'Tab') return
  const controls = navigationDialog.value?.querySelectorAll<HTMLElement>(
    'button:not(:disabled), a[href]',
  )
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
          ? 'border-b-2 border-[var(--px-line)] bg-[color-mix(in_oklab,var(--px-panel-solid)_88%,transparent)] backdrop-blur-md'
          : 'border-b-2 border-transparent bg-transparent',
      )
    "
  >
    <div class="shell-wide flex h-[68px] items-center gap-4">
      <RouterLink
        to="/"
        :class="
          cn(
            'focus-ring group flex shrink-0 items-center gap-2.5 rounded-sm',
            onArt ? 'text-[var(--px-fg)]' : 'text-ink',
          )
        "
        aria-label="Pressidian 首页"
      >
        <span class="px-mark" aria-hidden="true">
          <i /><i /><i /><i />
        </span>
        <span class="flex flex-col leading-none">
          <span class="px-font">PRESSIDIAN</span>
          <span
            :class="
              cn(
                'mt-1 font-mono text-[0.66rem] tracking-[0.24em] uppercase',
                onArt ? 'text-[var(--px-fg-dim)]' : 'text-faint',
              )
            "
          >
            digital garden
          </span>
        </span>
      </RouterLink>

      <div class="ml-auto flex items-center gap-2">
        <button
          type="button"
          :class="
            cn(
              'focus-ring group hidden h-9 items-center gap-2.5 border-2 pr-2 pl-3 text-[0.76rem] transition-colors duration-300 sm:flex',
              onArt
                ? 'border-[var(--px-line)] bg-[color-mix(in_oklab,var(--px-panel-solid)_72%,transparent)] text-[var(--px-fg-dim)] hover:border-[var(--px-accent)] hover:text-[var(--px-accent)]'
                : 'border-line bg-paper/70 text-muted hover:border-ember/50 hover:text-ink',
            )
          "
          @click="ui.openPalette()"
        >
          <Search :size="14" :class="onArt ? 'text-[var(--px-accent)]' : 'text-ember'" />
          <span class="hidden md:inline">搜索笔记、项目…</span>
          <span class="md:hidden">搜索</span>
          <kbd
            :class="
              cn(
                'ml-1 border px-1.5 py-0.5 font-mono text-[0.7rem]',
                onArt
                  ? 'border-[var(--px-line)] bg-black/40 text-[var(--px-fg-faint)]'
                  : 'border-line bg-canvas text-faint',
              )
            "
          >
            {{ shortcutLabel }}
          </kbd>
        </button>

        <button
          type="button"
          :class="
            cn(
              'focus-ring grid size-9 place-items-center border-2 transition-colors duration-300 sm:hidden',
              onArt
                ? 'border-[var(--px-line)] bg-black/40 text-[var(--px-fg-dim)]'
                : 'border-line bg-paper/70 text-ink-soft',
            )
          "
          aria-label="搜索"
          @click="ui.openPalette()"
        >
          <Search :size="15" />
        </button>

        <button
          type="button"
          :class="
            cn(
              'focus-ring grid size-9 place-items-center border-2 transition-colors duration-300 hover:border-[var(--px-accent)] hover:text-[var(--px-accent)]',
              onArt
                ? 'border-[var(--px-line)] bg-black/40 text-[var(--px-fg-dim)]'
                : 'border-line bg-paper/70 text-ink-soft hover:border-ember/50 hover:text-ember',
            )
          "
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
          :class="
            cn(
              'focus-ring flex h-9 items-center gap-2 border-2 px-3 transition-colors duration-300',
              onArt
                ? 'border-[var(--px-line)] bg-black/40 text-[var(--px-fg-dim)] hover:border-[var(--px-accent)] hover:text-[var(--px-accent)]'
                : 'border-line bg-paper/70 text-ink-soft hover:border-ember/50 hover:text-ember',
            )
          "
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

    <!-- Reading progress. A 2px bar, not a hairline — on the pixel layer a 1px
         rule reads as a rendering artefact. -->
    <div class="relative h-[2px] w-full overflow-hidden">
      <div
        class="h-[2px] origin-left bg-gradient-to-r from-[var(--px-accent)] to-[var(--px-cyan)] transition-transform duration-150 ease-out"
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
      <div
        class="shell-wide flex min-h-[68px] items-center justify-between gap-4 border-b-2 border-[var(--px-line)]"
      >
        <span class="flex items-center gap-2.5 text-[var(--px-fg)]">
          <span class="px-mark" aria-hidden="true"><i /><i /><i /><i /></span>
          <span class="px-font">PRESSIDIAN</span>
        </span>
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="focus-ring grid size-9 place-items-center border-2 border-[var(--px-line)] text-[var(--px-fg-dim)] hover:border-[var(--px-accent)] hover:text-[var(--px-accent)]"
            :aria-label="ui.isDark ? '切换到亮色模式' : '切换到深色模式'"
            @click="ui.toggleTheme()"
          >
            <Sun v-if="ui.isDark" :size="15" />
            <Moon v-else :size="15" />
          </button>
          <button
            type="button"
            class="focus-ring flex h-9 items-center gap-2 border-2 border-[var(--px-line)] px-3 text-[0.8rem] text-[var(--px-fg-dim)] hover:border-[var(--px-accent)] hover:text-[var(--px-accent)]"
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
            <p class="px-label mb-2">Explore the garden</p>
            <h2 id="navigation-title" class="px-font text-[var(--px-fg)]">
              去花园里走走。
            </h2>
          </div>
          <span class="hidden font-mono text-[0.7rem] tracking-[0.12em] text-[var(--px-fg-faint)] sm:block">
            01 — {{ String(NAV_HOVER_LINKS.length).padStart(2, '0') }}
          </span>
        </div>
        <InteractiveHoverLinks :links="NAV_HOVER_LINKS" @navigate="ui.navOpen = false" />
        <div class="mt-6 flex flex-wrap items-center justify-between gap-3 text-[0.7rem] text-[var(--px-fg-faint)]">
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

/* Four blocks that cycle — a loading cursor standing in for the old fox mark,
   sized so it occupies the same 30px box the mark did. */
.px-mark {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2px;
  width: 26px;
  height: 26px;
  flex: 0 0 auto;
}

.px-mark i {
  display: block;
  background: var(--px-accent, #ff9d3d);
}

.px-mark i:nth-child(1) {
  animation: px-mark-a 2.6s steps(1, end) infinite;
}
.px-mark i:nth-child(2) {
  animation: px-mark-b 2.6s steps(1, end) infinite;
}
.px-mark i:nth-child(3) {
  animation: px-mark-c 2.6s steps(1, end) infinite;
}
.px-mark i:nth-child(4) {
  animation: px-mark-d 2.6s steps(1, end) infinite;
}

@keyframes px-mark-a {
  0%,
  74% {
    opacity: 1;
  }
  75%,
  100% {
    opacity: 0.25;
  }
}
@keyframes px-mark-b {
  0%,
  24% {
    opacity: 1;
  }
  25%,
  100% {
    opacity: 0.25;
  }
}
@keyframes px-mark-c {
  0%,
  49% {
    opacity: 1;
  }
  50%,
  100% {
    opacity: 0.25;
  }
}
@keyframes px-mark-d {
  0%,
  99% {
    opacity: 1;
  }
  100% {
    opacity: 0.25;
  }
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
  /* The overlay is part of the pixel layer now, so it is dark in both site
     themes and rides the current scene's palette tokens. */
  background: var(--px-bg, #07090a);
  color: var(--px-fg, #d8f5e6);
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
}
.navigation-dialog::backdrop {
  background: var(--px-bg, #07090a);
}
.navigation-dialog[open] {
  animation: fade-in 0.25s steps(4, end) both;
}
.navigation-content {
  width: min(100% - 3rem, 64rem);
  margin-inline: auto;
  padding-block: clamp(1.5rem, 4vh, 3rem);
}
@media (max-width: 640px) {
  .navigation-content {
    padding-block: 1.5rem;
  }
}
</style>
