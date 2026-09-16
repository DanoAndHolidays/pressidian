<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowUpRight, Menu, Moon, Search, Sun, X } from 'lucide-vue-next'
import { NAV_ITEMS } from '@/data/site'
import { useUiStore } from '@/stores/ui'
import { useNotesStore } from '@/stores/notes'
import { useScrollLock, useScrollProgress } from '@/composables/useInteractions'

const ui = useUiStore()
const notes = useNotesStore()
const route = useRoute()
const progress = useScrollProgress()
const scrolled = ref(false)
const isMac = ref(false)
const navigationDialog = ref<HTMLDialogElement | null>(null)
const menuButton = ref<HTMLButtonElement | null>(null)
useScrollLock(computed(() => ui.navOpen))
const active = (key: string) => route.name === key || (key === 'notes' && route.name === 'note')
const onScroll = () => { scrolled.value = window.scrollY > 12 }
const onNavigationKeydown = (event: KeyboardEvent) => {
  if (event.key !== 'Tab') return
  const controls = navigationDialog.value?.querySelectorAll<HTMLElement>('button:not(:disabled), a[href]')
  const first = controls?.[0]
  const last = controls?.[controls.length - 1]
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
}
watch(() => ui.navOpen, (open) => {
  if (open) navigationDialog.value?.showModal()
  else { navigationDialog.value?.close(); menuButton.value?.focus() }
}, { flush: 'post' })
watch(() => route.fullPath, () => { ui.navOpen = false })
onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  isMac.value = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <header class="site-header" :class="{ 'is-scrolled': scrolled, 'over-scene': route.name === 'home' }">
    <div class="site-header__inner">
      <RouterLink to="/" class="wordmark" aria-label="Pressidian 首页">
        <span class="garden-symbol" aria-hidden="true"><i /><i /></span>
        <span>PRESSIDIAN<span class="wordmark__reg">/</span></span>
      </RouterLink>
      <nav class="desktop-nav" aria-label="主导航">
        <RouterLink v-for="item in NAV_ITEMS" :key="item.key" :to="item.to" :class="{ 'is-active': active(item.key) }" :aria-current="active(item.key) ? 'page' : undefined">{{ item.label }}</RouterLink>
      </nav>
      <div class="header-actions">
        <button type="button" class="header-search" aria-label="搜索笔记、项目" @click="ui.openPalette()">
          <Search :size="16" /><span>搜索</span><kbd>{{ isMac ? '⌘ K' : 'Ctrl K' }}</kbd>
        </button>
        <button type="button" class="icon-button" :aria-label="ui.isDark ? '切换到亮色模式' : '切换到深色模式'" @click="ui.toggleTheme()">
          <Sun v-if="ui.isDark" :size="17" /><Moon v-else :size="17" />
        </button>
        <button ref="menuButton" type="button" class="icon-button menu-toggle" aria-label="打开导航" aria-controls="site-navigation" :aria-expanded="ui.navOpen" @click="ui.navOpen = true"><Menu :size="20" /></button>
      </div>
    </div>
    <div class="reading-progress" aria-hidden="true"><i :style="{ transform: 'scaleX(' + progress + ')' }" /></div>
  </header>

  <Teleport to="body">
    <dialog id="site-navigation" ref="navigationDialog" class="navigation-dialog" aria-labelledby="navigation-title" @keydown="onNavigationKeydown" @cancel.prevent="ui.navOpen = false" @close="ui.navOpen = false">
      <div class="navigation-top"><span class="wordmark">Pressidian®</span><button class="icon-button" aria-label="关闭导航" autofocus @click="ui.navOpen = false"><X :size="22" /></button></div>
      <div class="navigation-content">
        <p class="eyebrow">Explore the garden</p><h2 id="navigation-title">去花园里走走。</h2>
        <nav aria-label="全部页面">
          <RouterLink v-for="(item, index) in NAV_ITEMS" :key="item.key" :to="item.to" :aria-current="active(item.key) ? 'page' : undefined" @click="ui.navOpen = false"><span class="navigation-index">0{{ index + 1 }}</span><span>{{ item.label }}<small>{{ item.hint }}</small></span><ArrowUpRight :size="24" /></RouterLink>
        </nav>
        <p class="navigation-footer">{{ notes.stats.total }} 篇笔记 · {{ notes.stats.links }} 条关联<span>保持好奇，慢慢探索</span></p>
      </div>
    </dialog>
  </Teleport>
</template>

<style scoped>
.site-header { position: fixed; inset: 0 0 auto; z-index: 50; background: color-mix(in oklab, var(--canvas) 90%, transparent); backdrop-filter: blur(20px); transition: box-shadow .3s, background .3s; }
.site-header.over-scene { --canvas: #080c10; --paper: #131e25; --paper-3: #1a2831; --ink: #e4ecee; --ink-soft: #b6c8d0; --muted: #8fa2af; --line: #a6c9d221; --garden: #cdfa81; background: #080c1099; }
.site-header.is-scrolled { background: color-mix(in oklab, var(--canvas) 96%, transparent); box-shadow: 0 4px 24px rgb(20 40 30 / .035); }
.site-header__inner { width: min(100% - 6rem, 82rem); margin: auto; height: 86px; display: flex; align-items: center; gap: 36px; }
.wordmark { display: inline-flex; align-items: center; gap: 11px; font: 600 18px/1 var(--font-mono); letter-spacing: -.065em; color: var(--ink); text-decoration: none; flex-shrink: 0; }
.wordmark__reg { font: 10px sans-serif; vertical-align: top; margin-left: 3px; }
.garden-symbol { position: relative; width: 25px; height: 25px; }
.garden-symbol i { position: absolute; width: 8px; height: 8px; left: 2px; top: 2px; background: var(--garden); box-shadow: 11px 11px 0 var(--garden); }
.garden-symbol i + i { left: 13px; top: 2px; opacity: .35; box-shadow: -11px 11px 0 var(--garden); }
.desktop-nav { display: flex; align-items: center; justify-content: center; gap: 28px; margin-left: auto; }
.desktop-nav a { position: relative; padding: 12px 0; font-size: 12px; color: var(--muted); transition: color .2s; white-space: nowrap; }
.desktop-nav a:hover, .desktop-nav a.is-active { color: var(--ink); }
.desktop-nav a.is-active::after { content: ''; position: absolute; left: calc(50% - 2px); bottom: 3px; width: 4px; height: 4px; background: var(--ember); border-radius: 50%; }
.header-actions { display: flex; align-items: center; gap: 9px; margin-left: auto; }
.header-search { display: flex; align-items: center; gap: 8px; height: 36px; padding: 0 10px; border: 1px solid var(--line); border-radius: 3px; color: var(--muted); background: var(--paper); font-size: 12px; cursor: pointer; }
.header-search kbd { margin-left: 8px; font: 10px var(--font-mono); opacity: .7; }
.icon-button { display: grid; place-items: center; width: 38px; height: 38px; border: 1px solid transparent; border-radius: 3px; color: var(--ink-soft); cursor: pointer; transition: background .2s; background: transparent; }
.icon-button:hover { background: var(--paper-3); }
.menu-toggle { display: none; }
.reading-progress { height: 1px; background: var(--line); }
.reading-progress i { display: block; height: 100%; background: var(--ember); transform-origin: left; transition: transform .15s; }
.navigation-dialog { position: fixed; inset: 0; width: 100%; max-width: none; height: 100dvh; max-height: none; margin: 0; padding: 0; border: 0; background: var(--canvas); color: var(--ink); overflow: auto; overscroll-behavior: contain; }
.navigation-dialog::backdrop { background: var(--canvas); }
.navigation-dialog[open] { animation: fade-in .25s ease both; }
.navigation-top { width: min(100% - 3rem, 82rem); min-height: 80px; margin: auto; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--line); }
.navigation-content { width: min(100% - 3rem, 56rem); margin: 40px auto; }
.navigation-content h2 { margin: 14px 0 28px; font-size: clamp(28px, 5vw, 48px); }
.navigation-content nav a { display: flex; align-items: center; gap: 22px; padding: 22px 0; border-bottom: 1px solid var(--line); font-size: clamp(21px, 3vw, 32px); transition: color .2s; }
.navigation-content nav a:hover { color: var(--ember); }
.navigation-content nav a > svg { margin-left: auto; }
.navigation-index { font: 11px var(--font-mono); color: var(--muted); }
.navigation-content small { display: block; font: 12px var(--font-sans); color: var(--muted); margin-top: 6px; }
.navigation-footer { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 12px; font-size: 11px; color: var(--muted); margin-top: 28px; }
@media (max-width: 1100px) { .site-header__inner { width: calc(100% - 3rem); gap: 20px; } .desktop-nav { gap: 18px; } .header-search kbd { display: none; } }
@media (max-width: 900px) { .desktop-nav { display: none; } .menu-toggle { display: grid; } }
@media (max-width: 640px) { .site-header__inner { height: 70px; width: calc(100% - 2.5rem); } .wordmark { font-size: 17px; } .header-search { width: 36px; padding: 0; justify-content: center; border: 0; background: transparent; } .header-search span { display: none; } .header-actions { gap: 2px; } }
</style>
