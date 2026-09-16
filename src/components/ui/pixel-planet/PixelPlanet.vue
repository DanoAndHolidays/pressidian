<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useReducedMotion } from '@/composables/useMediaQuery'
import { useUiStore } from '@/stores/ui'
import { createPlanetScene, PLANET_GLITCH } from './scene'
import { fallbackPlanet } from '@/components/ui/ascii-art/fallback-planet'

const props = withDefaults(
  defineProps<{
    /**
     * Model scale on top of the authored camera framing. `1` leaves the planet
     * at roughly 61% of the canvas width, which floats in empty space; the hero
     * uses a larger value so the planet fills its column deliberately. 1.18
     * lands the ring at ~90% of the canvas width, leaving a clear margin so the
     * outermost glyphs are never pressed against the edge.
     */
    scale?: number
  }>(),
  { scale: 1.18 },
)

const host = ref<HTMLDivElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
const failed = ref(false)
const reducedMotion = useReducedMotion()
const ui = useUiStore()
const fallback = fallbackPlanet()
let engine: ReturnType<typeof createPlanetScene> | null = null
let resizeObserver: ResizeObserver | null = null
let intersectionObserver: IntersectionObserver | null = null
let frame = 0
let elapsed = 0
let lastFrame = 0
let lastPaint = -Infinity
let visible = true
let disposed = false
/** Dev probe only: freeze the clock so a forced glitch state can be inspected. */
let clockHeld = false

function tick(now: number) {
  frame = 0
  if (disposed || failed.value || !engine || !visible || document.hidden || reducedMotion.value) return
  if (!clockHeld) {
    elapsed += Math.min((now - lastFrame) / 1000, 0.1)
    lastFrame = now
  }
  if (now - lastPaint >= 1000 / 30) {
    engine.render(elapsed)
    lastPaint = now
  }
  frame = requestAnimationFrame(tick)
}

function restart() {
  cancelAnimationFrame(frame)
  frame = 0
  if (disposed || failed.value || !engine) return
  engine.render(elapsed)
  lastFrame = performance.now()
  lastPaint = -Infinity
  if (visible && !document.hidden && !reducedMotion.value) frame = requestAnimationFrame(tick)
}

function resize() {
  if (!host.value || !engine) return
  engine.resize(Math.max(1, host.value.clientWidth), Math.max(1, host.value.clientHeight))
  restart()
}

function lost(event: Event) {
  event.preventDefault()
  cancelAnimationFrame(frame)
  failed.value = true
  // Release the old renderer while its context is lost, before restoration
  // creates a new generation of GPU resources.
  engine?.dispose()
  engine = null
}

function restored() {
  initialize()
}

function initialize() {
  if (!canvas.value || disposed) return
  try {
    engine = createPlanetScene(canvas.value, ui.isDark, props.scale)
    failed.value = false
    resize()
  } catch {
    failed.value = true
    engine?.dispose()
    engine = null
  }
}

onMounted(() => {
  initialize()
  resizeObserver = new ResizeObserver(resize)
  intersectionObserver = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
    restart()
  })
  if (host.value) {
    resizeObserver.observe(host.value)
    intersectionObserver.observe(host.value)
  }
  canvas.value?.addEventListener('webglcontextlost', lost)
  canvas.value?.addEventListener('webglcontextrestored', restored)
  document.addEventListener('visibilitychange', restart)
})

watch(reducedMotion, restart)
watch(() => ui.isDark, (dark) => {
  engine?.setTheme(dark)
  restart()
})

/*
 * Dev-only probe. The glitch tears a minority of frames by design, so a probe
 * needs a way to hold the effect on and inspect it. Stripped from production
 * because `import.meta.env.DEV` is statically replaced.
 */
if (import.meta.env.DEV) {
  ;(window as unknown as { __planet?: unknown }).__planet = {
    /**
     * Pin the glitch to one state so it can be inspected.
     *
     * The clock is frozen rather than the loop: `tick` keeps running and keeps
     * painting, so the state stays put but the frame is still produced inside
     * requestAnimationFrame. Rendering directly from here instead leaves the
     * canvas out of the compositor's frame and a screenshot shows a stale
     * image.
     */
    force(glitch: number, time?: number) {
      if (!engine) return false
      clockHeld = true
      engine.uniforms.glitch.value = glitch
      if (time !== undefined) {
        engine.uniforms.time.value = time
        elapsed = time
      }
      lastPaint = -Infinity
      return true
    },
    release() {
      clockHeld = false
      lastFrame = performance.now()
      restart()
    },
    reset() {
      clockHeld = false
      if (!engine) return
      engine.uniforms.glitch.value = PLANET_GLITCH
      lastFrame = performance.now()
      restart()
    },
  }
}

onBeforeUnmount(() => {
  disposed = true
  cancelAnimationFrame(frame)
  resizeObserver?.disconnect()
  intersectionObserver?.disconnect()
  canvas.value?.removeEventListener('webglcontextlost', lost)
  canvas.value?.removeEventListener('webglcontextrestored', restored)
  document.removeEventListener('visibilitychange', restart)
  engine?.dispose()
  engine = null
})
</script>

<template>
  <div ref="host" class="pixel-planet">
    <canvas ref="canvas" :class="{ unavailable: failed }" role="img" aria-label="由橙色 ASCII 字符组成、缓慢自转的行星与星环" />
    <div v-if="failed" class="planet-fallback" role="img" aria-label="由橙色字符组成的静态行星与星环"><pre aria-hidden="true">{{ fallback }}</pre></div>
  </div>
</template>

<style scoped>
.pixel-planet { position: relative; width: 100%; aspect-ratio: 4 / 3; container-type: inline-size; }
canvas { position: absolute; inset: 0; display: block; width: 100%; height: 100%; }
.unavailable { visibility: hidden; }
.planet-fallback { position: absolute; inset: 0; display: grid; place-items: center; color: var(--ember); }
.planet-fallback pre { margin: 0; font: 2.5cqw/1.25 monospace; white-space: pre; }
</style>
