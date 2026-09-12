<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { AsciiRenderer } from '@/lib/ascii/renderer'
import { vignetteBloom, type RenderMode } from '@/lib/ascii/types'
import { useReducedMotion } from '@/composables/useMediaQuery'

const props = withDefaults(defineProps<{ src: string; mode?: RenderMode; paused?: boolean; glitch?: boolean; cellSize?: number }>(), {
  mode: 'mosaic', paused: false, glitch: true, cellSize: 16,
})
const host = ref<HTMLDivElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
const ready = ref(false)
const reduced = useReducedMotion()
let renderer: AsciiRenderer | null = null
let observer: IntersectionObserver | undefined
let resizeObserver: ResizeObserver | undefined
let frame = 0
let previous = 0
let clock = 0
let visible = true
let disposed = false
let generation = 0
let resizeFrame = 0
const options = computed(() => {
  const recipe = vignetteBloom()
  recipe.renderMode = props.mode; recipe.cellSize = props.cellSize
  recipe.pfx.glitch.enabled = props.glitch
  return recipe
})
const moving = computed(() => !props.paused && !reduced.value)
function stop() { cancelAnimationFrame(frame); frame = 0; previous = 0 }
function paint(now: number) {
  frame = 0
  if (!renderer || !visible || document.hidden || !moving.value) return
  if (!previous || now - previous >= 1000 / 30) {
    clock += previous ? Math.min((now - previous) / 1000, .1) : 0
    previous = now
    renderer.render(clock, true)
  }
  frame = requestAnimationFrame(paint)
}
function sync() {
  stop()
  if (!renderer) return
  renderer.setOptions(options.value)
  if (visible && !document.hidden && moving.value) frame = requestAnimationFrame(paint)
  else renderer.render(clock, false)
}
function resize() {
  if (!host.value || !renderer) return
  const rect = host.value.getBoundingClientRect()
  renderer.resize(rect.width, rect.height)
  renderer.render(clock, moving.value)
}
async function load() {
  const current = ++generation
  const photo = new Image()
  photo.decoding = 'async'
  photo.src = props.src
  try {
    await photo.decode()
    if (disposed || current !== generation || !canvas.value) return
    stop(); renderer?.destroy()
    renderer = new AsciiRenderer(canvas.value, photo, options.value)
    resize(); ready.value = true; sync()
  } catch {
    if (disposed || current !== generation) return
    stop(); renderer?.destroy(); renderer = null; ready.value = false
  }
}
watch(() => props.src, load)
watch([options, moving], sync)
onMounted(() => {
  void load()
  observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync() }, { threshold: 0 })
  if (host.value) observer.observe(host.value)
  resizeObserver = new ResizeObserver(() => {
    cancelAnimationFrame(resizeFrame)
    resizeFrame = requestAnimationFrame(resize)
  })
  if (host.value) resizeObserver.observe(host.value)
  document.addEventListener('visibilitychange', sync)
})
onBeforeUnmount(() => {
  disposed = true; generation++; stop(); cancelAnimationFrame(resizeFrame)
  observer?.disconnect(); resizeObserver?.disconnect()
  document.removeEventListener('visibilitychange', sync)
  renderer?.destroy(); renderer = null
})
</script>

<template>
  <div ref="host" class="ascii-scene" :data-ready="ready" :data-motion="moving ? 'running' : 'paused'" aria-hidden="true">
    <img :src="src" alt="" class="ascii-fallback" :class="{ 'is-hidden': ready }" fetchpriority="high" />
    <canvas ref="canvas" :class="{ 'is-ready': ready }" />
  </div>
</template>

<style scoped>
.ascii-scene { position: absolute; inset: 0; overflow: hidden; background: #080b0d; pointer-events: none; }
.ascii-scene canvas, .ascii-fallback { position: absolute; inset: 0; display: block; width: 100%; height: 100%; }
.ascii-fallback { object-fit: cover; image-rendering: pixelated; }
.ascii-scene canvas { opacity: 0; transition: opacity .5s; }
.ascii-scene canvas.is-ready { opacity: 1; }
.ascii-fallback.is-hidden { opacity: 0; }
@media (prefers-reduced-motion: reduce) { .ascii-scene canvas { transition: none; } }
</style>
