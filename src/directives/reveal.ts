import type { App } from 'vue'
import type { Directive } from 'vue'

/**
 * `v-reveal` — fades and lifts an element the first time it scrolls into view.
 *
 * A single shared IntersectionObserver handles every element on the page, and
 * the observer stops watching as soon as an element has been revealed, so long
 * note pages do not accumulate observers.
 */
const VISIBLE = 'is-visible'

let observer: IntersectionObserver | null = null

function getObserver(): IntersectionObserver | null {
  if (typeof IntersectionObserver === 'undefined') return null
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add(VISIBLE)
        observer?.unobserve(entry.target)
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  )
  return observer
}

export const vReveal: Directive<HTMLElement, number | undefined> = {
  mounted(el, binding) {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      el.classList.add(VISIBLE)
      return
    }

    el.classList.add('reveal')
    if (typeof binding.value === 'number') {
      el.style.setProperty('--reveal-delay', `${binding.value}ms`)
    }

    const instance = getObserver()
    if (!instance) {
      el.classList.add(VISIBLE)
      return
    }
    instance.observe(el)
  },
  unmounted(el) {
    observer?.unobserve(el)
  },
}

/** Registers the app's global directives. */
export function registerDirectives(app: App) {
  app.directive('reveal', vReveal)
}
