import { computed, onScopeDispose, readonly, ref } from 'vue'

/**
 * Random, self-scheduling signal corruption.
 *
 * A CSS-only `animation: infinite` glitch reads as a loop within about ten
 * seconds — the eye locks onto the period and it stops feeling like a fault.
 * So bursts are scheduled by hand at jittered intervals instead, and each burst
 * picks a different shape (which bands tear, how far, how hard the chroma
 * splits) so no two are identical.
 *
 * `active` is a boolean rather than a class string so components can bind it
 * wherever they like; `intensity` drives the custom properties the CSS reads.
 */
export function useGlitch(options: {
  /** Lower bound of the gap between bursts. */
  minGap?: number
  /** Upper bound of the gap between bursts. */
  maxGap?: number
  /** How long a single burst lasts. */
  duration?: number
  /** Skip scheduling entirely — used while the intro cinematic owns the screen. */
  enabled?: () => boolean
} = {}) {
  const { minGap = 2600, maxGap = 8200, duration = 420, enabled } = options

  const active = ref(false)
  const intensity = ref(1)

  let nextTimer: ReturnType<typeof setTimeout> | undefined
  let endTimer: ReturnType<typeof setTimeout> | undefined
  let stopped = false

  const clear = () => {
    if (nextTimer) clearTimeout(nextTimer)
    if (endTimer) clearTimeout(endTimer)
    nextTimer = undefined
    endTimer = undefined
  }

  const schedule = () => {
    if (stopped) return
    const gap = minGap + Math.random() * (maxGap - minGap)
    nextTimer = setTimeout(() => {
      if (stopped) return
      if (enabled && !enabled()) {
        schedule()
        return
      }
      burst()
    }, gap)
  }

  /** Fire one burst immediately, then keep the schedule running. */
  const burst = () => {
    if (stopped) return
    if (endTimer) clearTimeout(endTimer)
    // Weighted low so most bursts are a flicker and only occasionally a hard
    // tear; uniform intensity makes the page feel broken rather than alive.
    intensity.value = Math.random() < 0.72 ? 0.45 + Math.random() * 0.5 : 1.4 + Math.random() * 0.8
    active.value = true
    const span = duration * (0.55 + Math.random() * 0.9)
    endTimer = setTimeout(() => {
      active.value = false
      endTimer = undefined
      schedule()
    }, span)
  }

  schedule()

  onScopeDispose(() => {
    stopped = true
    clear()
  })

  return {
    active: readonly(active),
    intensity: readonly(intensity),
    burst,
    /** Custom properties the glitch CSS consumes. */
    style: computed(() => ({
      '--px-shift': `${(1.5 * intensity.value).toFixed(2)}px`,
      '--px-glitch-intensity': intensity.value.toFixed(2),
    })),
  }
}
