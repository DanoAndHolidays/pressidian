import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

/**
 * The day/night cycle of the megastructure.
 *
 * This lives in a store rather than in `SceneStage.vue` because two things need
 * to agree about it: the stage, which paints the painting, and the homepage's
 * readout, which reports which painting is up. Splitting that state would let
 * the label claim "DAY" over a night sky.
 *
 * Day and night are two takes on one scene, so the swap is not a crossfade —
 * dissolving two photographs of the same place looks like a mistake. The
 * corrupted daylight take is thrown across the stage as signal noise, the
 * painting underneath is replaced while the noise covers it, and the noise
 * clears. That is the only reason the third image exists.
 */

/** How long each painting stays up. */
export const SCENE_CYCLE_MS = 14000
/** Total duration of the corruption that covers the swap. */
export const SCENE_BURST_MS = 900

export type SceneName = 'day' | 'night'

export const useSceneStore = defineStore('scene', () => {
  const current = ref<SceneName>('day')
  const bursting = ref(false)
  /**
   * Bumped on every swap. Used as a reactive key so the incoming `<img>` can be
   * re-created, which guarantees a fresh decode instead of a cached paint.
   */
  const generation = ref(0)

  const label = computed(() => (current.value === 'day' ? 'DAY' : 'NIGHT'))
  /** 24h clock the readout shows; purely diegetic. */
  const clock = computed(() => (current.value === 'day' ? '06:00' : '21:00'))

  let swapTimer: ReturnType<typeof setTimeout> | undefined
  let cycleTimer: ReturnType<typeof setInterval> | undefined
  /** Set while the stage is running, so visibility handling can resume it. */
  let running = false

  function clearSwap() {
    if (swapTimer) clearTimeout(swapTimer)
    swapTimer = undefined
  }

  /**
   * Order matters: raise the noise, swap the painting underneath it, then let
   * the noise clear. Reversing this shows the change on an uncovered frame.
   */
  function swap() {
    if (!running) return
    bursting.value = true
    clearSwap()
    swapTimer = setTimeout(() => {
      current.value = current.value === 'day' ? 'night' : 'day'
      generation.value += 1
      // A second beat of noise *after* the swap reads as the signal recovering
      // rather than as a clean cut, which is what the reference frames show.
      swapTimer = setTimeout(() => {
        bursting.value = false
        swapTimer = undefined
      }, SCENE_BURST_MS / 2)
    }, SCENE_BURST_MS / 2)
  }

  /** Idempotent — safe to call on every activation and on visibility changes. */
  function start() {
    running = true
    if (cycleTimer) return
    cycleTimer = setInterval(swap, SCENE_CYCLE_MS)
  }

  function stop() {
    running = false
    if (cycleTimer) clearInterval(cycleTimer)
    cycleTimer = undefined
    clearSwap()
    bursting.value = false
  }

  return { current, bursting, generation, label, clock, swap, start, stop }
})
