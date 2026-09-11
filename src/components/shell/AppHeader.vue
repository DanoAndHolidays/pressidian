<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Menu, Moon, Search, Sun, X } from 'lucide-vue-next'
import FoxMark from './FoxMark.vue'
import { NAV_ITEMS } from '@/data/site'
import { useUiStore } from '@/stores/ui'
import { useNotesStore } from '@/stores/notes'
import { useScrollProgress } from '@/composables/useInteractions'
import { cn } from '@/lib/utils'

const ui = useUiStore()
const notes = useNotesStore()
const route = useRoute()

const progress = useScrollProgress()
const scrolled = ref(false)
const isMac = ref(false)

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

const isActive = (to: string) => {
  if (to === '/') return route.path === '/'
  return route.path === to || route.path.startsWith(`${to}/`)
}

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
          <span class="font-mono text-[0.52rem] tracking-[0.24em] text-faint uppercase">
            digital garden
          </span>
        </span>
      </RouterLink>

      <nav class="ml-6 hidden items-center gap-1 lg:flex" aria-label="主导航">
        <RouterLink
          v-for="item in NAV_ITEMS"
          :key="item.key"
          :to="item.to"
          :class="
            cn(
              'relative rounded-full px-3.5 py-2 text-[0.82rem] transition-colors duration-300',
              isActive(item.to) ? 'text-ember' : 'text-ink-soft hover:text-ink',
            )
          "
        >
          {{ item.label }}
          <span
            v-if="isActive(item.to)"
            class="absolute inset-x-3 -bottom-0.5 h-px bg-ember"
            aria-hidden="true"
          />
        </RouterLink>
      </nav>

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
            class="ml-1 rounded border border-line bg-canvas px-1.5 py-0.5 font-mono text-[0.62rem] text-faint"
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
          class="grid size-9 place-items-center rounded-full border border-line bg-paper/70 text-ink-soft transition-colors duration-300 hover:border-ember/50 hover:text-ember lg:hidden focus-ring"
          :aria-expanded="ui.navOpen"
          aria-label="切换导航"
          @click="ui.navOpen = !ui.navOpen"
        >
          <Menu v-if="!ui.navOpen" :size="16" />
          <X v-else :size="16" />
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

    <!-- Mobile navigation sheet -->
    <Transition name="sheet">
      <div
        v-if="ui.navOpen"
        class="border-b border-line bg-[var(--glass)] backdrop-blur-xl lg:hidden"
      >
        <nav class="shell-wide grid gap-1 py-4" aria-label="移动端导航">
          <RouterLink
            v-for="item in NAV_ITEMS"
            :key="item.key"
            :to="item.to"
            :class="
              cn(
                'flex items-baseline justify-between rounded-xl px-3 py-3 transition-colors',
                isActive(item.to)
                  ? 'bg-ember/10 text-ember'
                  : 'text-ink-soft hover:bg-paper-2 hover:text-ink',
              )
            "
          >
            <span class="font-serif text-lg">{{ item.label }}</span>
            <span class="font-mono text-[0.6rem] tracking-[0.14em] text-faint uppercase">
              {{ item.hint }}
            </span>
          </RouterLink>
          <p class="mt-2 px-3 font-mono text-[0.6rem] tracking-[0.16em] text-faint uppercase">
            {{ notes.stats.total }} 篇笔记 · {{ notes.stats.links }} 条关联
          </p>
        </nav>
      </div>
    </Transition>
  </header>
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

.sheet-enter-active,
.sheet-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.38s var(--ease-out-quint);
}
.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
