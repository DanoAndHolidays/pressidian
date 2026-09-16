import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'

const THEME_KEY = 'pressidian-theme'

export type ThemeMode = 'light' | 'dark'

/**
 * Theme. The document already carries the resolved class (see the inline script
 * in `index.html`), so this store only adopts what is there.
 *
 * The default is dark and deliberately does NOT follow the OS preference: the
 * site ships a dark identity, and only a visitor who has actually used the
 * toggle gets light. `index.html` applies the same rule before first paint.
 */
export const useUiStore = defineStore('ui', () => {
  const initial: ThemeMode =
    (document.documentElement.classList.contains('dark') ? 'dark' : 'light') as ThemeMode

  const theme = ref<ThemeMode>(initial)
  const paletteOpen = ref(false)
  const navOpen = ref(false)
  const treeOpen = ref(false)
  const tocOpen = ref(false)

  const isDark = computed(() => theme.value === 'dark')

  watch(
    theme,
    (value) => {
      document.documentElement.classList.toggle('dark', value === 'dark')
      document.documentElement.dataset.theme = value
      try {
        localStorage.setItem(THEME_KEY, value)
      } catch {
        /* storage unavailable — the choice just does not persist */
      }
    },
    { immediate: true },
  )

  const toggleTheme = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  const openPalette = () => {
    paletteOpen.value = true
    navOpen.value = false
  }

  const closePalette = () => {
    paletteOpen.value = false
  }

  return {
    theme,
    isDark,
    toggleTheme,
    paletteOpen,
    openPalette,
    closePalette,
    navOpen,
    treeOpen,
    tocOpen,
  }
})
