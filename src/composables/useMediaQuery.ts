import { onBeforeUnmount, onMounted, readonly, ref, type Ref } from 'vue'

/** Reactive `matchMedia`. */
export function useMediaQuery(query: string): Readonly<Ref<boolean>> {
  const matches = ref(false)
  let media: MediaQueryList | null = null
  const update = (event: MediaQueryListEvent | MediaQueryList) => {
    matches.value = event.matches
  }

  onMounted(() => {
    media = window.matchMedia(query)
    update(media)
    media.addEventListener('change', update)
  })

  onBeforeUnmount(() => media?.removeEventListener('change', update))

  return readonly(matches)
}

/** True when the visitor asked the OS to reduce motion. */
export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)')
