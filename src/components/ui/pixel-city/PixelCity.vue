<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useReducedMotion } from '@/composables/useMediaQuery'

const props = withDefaults(defineProps<{ src?: string; cellSize?: number }>(), {
  src: `${import.meta.env.BASE_URL}brand/megacity-cutout.png`,
  cellSize: 3,
})

type Cell = { x: number; y: number; width: number; height: number; alpha: number; color: string }

const host = ref<HTMLDivElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
const aspectRatio = ref(1672 / 941)
const reducedMotion = useReducedMotion()
let source: HTMLImageElement | null = null
let resizeObserver: ResizeObserver | null = null
let visibilityObserver: IntersectionObserver | null = null
let cells: Cell[] = []
let width = 0
let height = 0
let frame = 0
let lastPaint = -Infinity
let visible = true
let disposed = false

const colorChannel = (channel: number) => Math.round(Math.min(255, Math.max(0, (channel - 128) * 1.1 + 131)))

// Sample only on image/size changes. Weight RGB by alpha so transparent
// pixels cannot contribute black to colors along the cutout's edges.
function sample() {
  if (!source?.naturalWidth || !host.value || !canvas.value) return
  width = Math.max(1, Math.round(host.value.clientWidth))
  height = Math.max(1, Math.round(width / aspectRatio.value))
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  canvas.value.width = Math.round(width * dpr)
  canvas.value.height = Math.round(height * dpr)
  canvas.value.getContext('2d')?.setTransform(dpr, 0, 0, dpr, 0, 0)

  const samplingCanvas = document.createElement('canvas')
  samplingCanvas.width = width
  samplingCanvas.height = height
  const ctx = samplingCanvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return
  ctx.drawImage(source, 0, 0, width, height)
  const pixels = ctx.getImageData(0, 0, width, height).data
  const size = Math.max(2, Math.round(props.cellSize))
  const nextCells: Cell[] = []

  for (let y = 0; y < height; y += size) {
    for (let x = 0; x < width; x += size) {
      const cellWidth = Math.min(size, width - x)
      const cellHeight = Math.min(size, height - y)
      let red = 0, green = 0, blue = 0, alphaSum = 0
      for (let sy = y; sy < y + cellHeight; sy++) {
        for (let sx = x; sx < x + cellWidth; sx++) {
          const index = (sy * width + sx) * 4
          const alpha = pixels[index + 3] / 255
          red += pixels[index] * alpha
          green += pixels[index + 1] * alpha
          blue += pixels[index + 2] * alpha
          alphaSum += alpha
        }
      }
      const alpha = alphaSum / (cellWidth * cellHeight)
      if (alpha < 0.025) continue
      nextCells.push({
        x, y, width: cellWidth, height: cellHeight, alpha,
        color: `rgb(${colorChannel(red / alphaSum)}, ${colorChannel(green / alphaSum)}, ${colorChannel(blue / alphaSum)})`,
      })
    }
  }
  cells = nextCells
  restart()
}

function paint(time: number) {
  const ctx = canvas.value?.getContext('2d')
  if (!ctx) return
  ctx.clearRect(0, 0, width, height)
  for (const cell of cells) {
    const wave = reducedMotion.value ? 1 : 0.97 + Math.sin(cell.x / 45 + cell.y / 70 - time * 0.0012) * 0.03
    ctx.globalAlpha = cell.alpha * wave
    ctx.fillStyle = cell.color
    ctx.fillRect(cell.x, cell.y, cell.width, cell.height)
  }
  ctx.globalAlpha = 1
}

function tick(time: number) {
  frame = 0
  if (disposed || !visible || document.hidden || reducedMotion.value) return
  if (time - lastPaint >= 1000 / 30) {
    paint(time)
    lastPaint = time
  }
  frame = requestAnimationFrame(tick)
}

function restart() {
  cancelAnimationFrame(frame)
  frame = 0
  if (disposed || !cells.length) return
  paint(performance.now())
  lastPaint = -Infinity
  if (visible && !document.hidden && !reducedMotion.value) frame = requestAnimationFrame(tick)
}

function load() {
  if (disposed) return
  cancelAnimationFrame(frame)
  cells = []
  canvas.value?.getContext('2d')?.clearRect(0, 0, width, height)
  const nextImage = new Image()
  source = nextImage
  nextImage.decoding = 'async'
  nextImage.onload = () => {
    if (disposed || source !== nextImage) return
    aspectRatio.value = nextImage.naturalWidth / nextImage.naturalHeight
    sample()
  }
  nextImage.src = props.src
}

onMounted(() => {
  resizeObserver = new ResizeObserver(sample)
  visibilityObserver = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
    restart()
  })
  if (host.value) {
    resizeObserver.observe(host.value)
    visibilityObserver.observe(host.value)
  }
  document.addEventListener('visibilitychange', restart)
  load()
})

watch(() => props.src, load)
watch(() => props.cellSize, sample)
watch(reducedMotion, restart)

onBeforeUnmount(() => {
  disposed = true
  cancelAnimationFrame(frame)
  resizeObserver?.disconnect()
  visibilityObserver?.disconnect()
  document.removeEventListener('visibilitychange', restart)
  if (source) source.onload = null
  source = null
})
</script>

<template>
  <div ref="host" class="pixel-city" :style="{ aspectRatio }">
    <canvas ref="canvas" class="pixel-city-canvas" role="img" aria-label="像素化的巨型高楼与环状行星" />
  </div>
</template>

<style scoped>
.pixel-city { position: relative; width: 100%; }
.pixel-city-canvas { position: absolute; inset: 0; display: block; width: 100%; height: 100%; }
</style>
