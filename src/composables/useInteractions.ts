import { onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue'

/**
 * Writes `--mx` / `--my` custom properties on the element under the cursor so
 * the `spotlight` utility can draw a radial highlight. Pointer-coarse devices
 * are skipped entirely — a touch has no hover to track.
 */
export function useSpotlight<T extends HTMLElement>(): {
  target: Ref<T | null>
  onPointerMove: (event: PointerEvent) => void
} {
  const target = ref(null) as Ref<T | null>
  let enabled = true

  onMounted(() => {
    enabled = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  })

  const onPointerMove = (event: PointerEvent) => {
    if (!enabled) return
    const el = event.currentTarget as HTMLElement | null
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${event.clientX - rect.left}px`)
    el.style.setProperty('--my', `${event.clientY - rect.top}px`)
  }

  return { target, onPointerMove }
}

/** Page scroll progress in `0…1`, throttled to one write per frame. */
export function useScrollProgress(): Ref<number> {
  const progress = ref(0)
  let ticking = false

  const measure = () => {
    ticking = false
    const doc = document.documentElement
    const max = doc.scrollHeight - doc.clientHeight
    progress.value = max > 0 ? Math.min(1, Math.max(0, doc.scrollTop / max)) : 0
  }

  const onScroll = () => {
    if (ticking) return
    ticking = true
    requestAnimationFrame(measure)
  }

  onMounted(() => {
    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
  })

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onScroll)
  })

  return progress
}

/**
 * Tracks which heading is currently in the reading position. `rootMargin`
 * fakes a reading line near the top of the viewport rather than the very top,
 * which matches where the eye actually is.
 */
export function useActiveHeading(headings: Ref<Array<{ id: string }>>): Ref<string> {
  const active = ref('')
  let observer: IntersectionObserver | null = null
  let visible = new Map<string, number>()

  const connect = () => {
    observer?.disconnect()
    visible = new Map()
    if (!headings.value.length) return

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).id
          if (entry.isIntersecting) visible.set(id, entry.boundingClientRect.top)
          else visible.delete(id)
        }
        if (visible.size) {
          const [first] = [...visible.entries()].sort((a, b) => a[1] - b[1])
          active.value = first?.[0] ?? ''
          return
        }
        // Nothing is inside the reading band — fall back to the last heading
        // that has already scrolled past.
        const passed = headings.value.filter((heading) => {
          const el = document.getElementById(heading.id)
          return el ? el.getBoundingClientRect().top < 120 : false
        })
        active.value = passed.at(-1)?.id ?? ''
      },
      { rootMargin: '-96px 0px -70% 0px', threshold: [0, 1] },
    )

    for (const heading of headings.value) {
      const el = document.getElementById(heading.id)
      if (el) observer.observe(el)
    }
  }

  onMounted(() => {
    requestAnimationFrame(connect)
  })

  onBeforeUnmount(() => observer?.disconnect())

  return active
}

/** Fires `handler` on a global key chord such as `mod+k`. */
export function useHotkey(chord: string, handler: (event: KeyboardEvent) => void) {
  const [modifier, key] = chord.split('+')

  const onKeydown = (event: KeyboardEvent) => {
    const needsMod = modifier === 'mod'
    const modPressed = event.metaKey || event.ctrlKey
    if (needsMod && !modPressed) return
    if (event.key.toLowerCase() !== key) return
    event.preventDefault()
    handler(event)
  }

  onMounted(() => window.addEventListener('keydown', onKeydown))
  onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
}

/** Locks body scroll while a modal or drawer is open. */
export function useScrollLock(isLocked: Ref<boolean>) {
  let previous = ''

  const apply = (locked: boolean) => {
    if (locked) {
      previous = document.body.style.overflow
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = previous
    }
  }

  watch(isLocked, (locked) => apply(locked))
  onMounted(() => {
    if (isLocked.value) apply(true)
  })
  onBeforeUnmount(() => apply(false))
}

/** Copies text and reports success for ~1.6s. */
export function useClipboard() {
  const copied = ref(false)
  let timer: ReturnType<typeof setTimeout> | null = null

  const copy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value)
      copied.value = true
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => (copied.value = false), 1600)
    } catch {
      copied.value = false
    }
  }

  onBeforeUnmount(() => {
    if (timer) clearTimeout(timer)
  })

  return { copied, copy }
}
