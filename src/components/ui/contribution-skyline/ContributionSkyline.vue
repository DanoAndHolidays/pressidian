<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Box, ExternalLink, Grid3X3, RotateCcw } from 'lucide-vue-next'
import {
  ELEV_3D,
  ELEV_RANGE,
  YAW_3D,
  YAW_RANGE,
  barHeight,
  buildContributionModel,
  camera,
  dayMs,
  depthOf,
  easeInOutCubic,
  generateSampleContributions,
  projectPoint,
  riseAt,
  type ContributionDay,
} from './model'

type ViewMode = '2d' | '3d'
type DataState = 'loading' | 'live' | 'sample'
type Point = [number, number]
type HitShape = { cellIndex: number; polygons: Point[][]; depth: number }

const props = withDefaults(defineProps<{
  username: string
  endpoint?: string
  locale?: string
  initialView?: ViewMode
  heightScale?: number
}>(), {
  endpoint: 'https://github-contributions-api.jogruber.de/v4',
  locale: 'zh-CN',
  initialView: '3d',
  heightScale: 1,
})

const root = ref<HTMLElement | null>(null)
const stage = ref<HTMLElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
const view = ref<ViewMode>(props.initialView)
const source = ref<ContributionDay[]>([])
const dataState = ref<DataState>('loading')
const activeIndex = ref(-1)
const pinnedIndex = ref(-1)
const legendLevel = ref(-1)
const stageHeight = ref(390)
const tooltipPosition = ref({ x: 0, y: 0 })
const reduceMotion = ref(false)
const entered = ref(false)

const today = dayMs(new Date())
const model = computed(() => {
  const days = source.value.length ? source.value : generateSampleContributions(today)
  const latest = days.reduce((last, day) => Math.max(last, dayMs(day.date)), today)
  return buildContributionModel(days, latest, props.locale)
})
const activeCell = computed(() => model.value.cells[activeIndex.value] ?? null)
const githubUrl = computed(() => `https://github.com/${props.username}`)
const numberFormat = computed(() => new Intl.NumberFormat(props.locale))
const dateFormat = computed(() => new Intl.DateTimeFormat(props.locale, {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  weekday: 'short',
  timeZone: 'UTC',
}))
const shortDateFormat = computed(() => new Intl.DateTimeFormat(props.locale, {
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
}))
const statusLabel = computed(() => {
  if (dataState.value === 'loading') return '正在连接 GitHub contribution graph…'
  if (dataState.value === 'live') return `GitHub · 最近一年实时公开数据`
  return '网络不可用 · 当前展示本地活动样本'
})
const tooltipLabel = computed(() => {
  const cell = activeCell.value
  if (!cell) return ''
  const count = cell.count ? `${numberFormat.value.format(cell.count)} 次贡献` : '没有贡献'
  return `${count} · ${dateFormat.value.format(dayMs(cell.date))}`
})
const currentHint = computed(() => view.value === '3d'
  ? '拖拽旋转城市，双击回到默认视角。'
  : '移动到格子上，查看每天的公开贡献。')

const swatches = ref(['#e5e0d4', '#f7e3d3', '#efa16d', '#b65320', '#93401b'])
const ink = ref('#35312c')
const paper = ref('#faf8f3')
const line = ref('#e0d9cf')

let abortController: AbortController | null = null
let resizeObserver: ResizeObserver | null = null
let intersectionObserver: IntersectionObserver | null = null
let themeObserver: MutationObserver | null = null
let mediaQuery: MediaQueryList | null = null
const onMotionChange = (event: MediaQueryListEvent) => {
  reduceMotion.value = event.matches
}
let frame = 0
let lastFrame = 0
let morph = 0
let morphTarget = 0
let yaw = 0
let yawTarget = 0
let elevation = 0
let elevationTarget = 0
let width = 0
let height = 0
let hitShapes: HitShape[] = []
let hoveredIndex = -1
let pointerDrag: {
  id: number
  x: number
  y: number
  yaw: number
  elevation: number
  moved: boolean
  canOrbit: boolean
} | null = null

const readTheme = () => {
  if (!root.value) return
  const styles = getComputedStyle(root.value)
  const read = (name: string, fallback: string) => styles.getPropertyValue(name).trim() || fallback
  swatches.value = [
    read('--paper-3', '#e5e0d4'),
    read('--ember-tint', '#f7e3d3'),
    read('--ember-soft', '#efa16d'),
    read('--ember', '#b65320'),
    read('--ember-deep', '#93401b'),
  ]
  ink.value = read('--ink', '#35312c')
  paper.value = read('--paper', '#faf8f3')
  line.value = read('--line', '#e0d9cf')
  requestDraw()
}

const loadContributions = async () => {
  abortController?.abort()
  abortController = new AbortController()
  dataState.value = 'loading'
  const timeout = window.setTimeout(() => abortController?.abort(), 8_000)

  try {
    const response = await fetch(`${props.endpoint}/${encodeURIComponent(props.username)}?y=last`, {
      signal: abortController.signal,
      headers: { Accept: 'application/json' },
    })
    if (!response.ok) throw new Error(`Contribution API returned ${response.status}`)
    const payload = await response.json() as { contributions?: ContributionDay[] }
    if (!Array.isArray(payload.contributions) || payload.contributions.length < 300) {
      throw new Error('Contribution API returned an incomplete year')
    }
    source.value = payload.contributions.map((day) => ({
      date: day.date,
      count: Math.max(0, Number(day.count) || 0),
      level: day.level,
    }))
    dataState.value = 'live'
  } catch {
    source.value = generateSampleContributions(today)
    dataState.value = 'sample'
  } finally {
    window.clearTimeout(timeout)
    await nextTick()
    requestDraw()
  }
}

const pointInPolygon = (point: Point, polygon: Point[]) => {
  let inside = false
  for (let index = 0, previous = polygon.length - 1; index < polygon.length; previous = index, index += 1) {
    const [x, y] = polygon[index]
    const [px, py] = polygon[previous]
    const intersects = ((y > point[1]) !== (py > point[1]))
      && point[0] < ((px - x) * (point[1] - y)) / (py - y || 1e-9) + x
    if (intersects) inside = !inside
  }
  return inside
}

const roundedQuad = (context: CanvasRenderingContext2D, polygon: Point[], radius: number) => {
  context.beginPath()
  if (radius < 0.25) {
    context.moveTo(...polygon[0])
    for (let index = 1; index < polygon.length; index += 1) context.lineTo(...polygon[index])
    context.closePath()
    return
  }
  const last = polygon.at(-1)!
  context.moveTo((last[0] + polygon[0][0]) / 2, (last[1] + polygon[0][1]) / 2)
  for (let index = 0; index < polygon.length; index += 1) {
    const current = polygon[index]
    const next = polygon[(index + 1) % polygon.length]
    context.arcTo(current[0], current[1], next[0], next[1], radius)
  }
  context.closePath()
}

const colorWithAlpha = (color: string, alpha: number) => {
  if (alpha >= 0.995) return color
  return `color-mix(in srgb, ${color} ${Math.round(alpha * 100)}%, transparent)`
}

const shade = (context: CanvasRenderingContext2D, color: string, amount: number) => {
  context.save()
  context.fillStyle = color
  context.globalCompositeOperation = amount < 0 ? 'multiply' : 'screen'
  context.globalAlpha = Math.abs(amount)
  context.fillStyle = amount < 0 ? '#000' : '#fff'
  context.fill()
  context.restore()
}

const drawPolygon = (
  context: CanvasRenderingContext2D,
  polygon: Point[],
  color: string,
  radius = 0,
  darkness = 0,
  alpha = 1,
) => {
  roundedQuad(context, polygon, radius)
  context.globalAlpha = alpha
  context.fillStyle = color
  context.fill()
  if (darkness) {
    roundedQuad(context, polygon, radius)
    shade(context, color, -darkness)
  }
  context.globalAlpha = 1
}

const draw = () => {
  const element = canvas.value
  const container = stage.value
  if (!element || !container || !width) return
  const context = element.getContext('2d')
  if (!context) return

  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const targetHeight2d = Math.max(190, Math.min(250, width * 0.29))
  const targetHeight3d = Math.max(340, Math.min(500, width * 0.47))
  height = targetHeight2d + (targetHeight3d - targetHeight2d) * easeInOutCubic(morph)
  stageHeight.value = Math.round(height)
  const pixelWidth = Math.max(1, Math.round(width * dpr))
  const pixelHeight = Math.max(1, Math.round(height * dpr))
  if (element.width !== pixelWidth || element.height !== pixelHeight) {
    element.width = pixelWidth
    element.height = pixelHeight
  }
  element.style.width = `${width}px`
  element.style.height = `${height}px`
  context.setTransform(dpr, 0, 0, dpr, 0, 0)
  context.clearRect(0, 0, width, height)

  const eased = easeInOutCubic(morph)
  const cam = camera(eased, yaw, elevation)
  const cells = model.value.cells
  const weeks = model.value.weeks
  const maxBar = 8 * props.heightScale
  const corners = [
    projectPoint(cam, 0, 0, 0),
    projectPoint(cam, weeks, 0, 0),
    projectPoint(cam, 0, 7, 0),
    projectPoint(cam, weeks, 7, 0),
    projectPoint(cam, 0, 0, maxBar),
    projectPoint(cam, weeks, 0, maxBar),
    projectPoint(cam, 0, 7, maxBar),
    projectPoint(cam, weeks, 7, maxBar),
  ]
  const minX = Math.min(...corners.map((point) => point[0]))
  const maxX = Math.max(...corners.map((point) => point[0]))
  const minY = Math.min(...corners.map((point) => point[1]))
  const maxY = Math.max(...corners.map((point) => point[1]))
  const leftPad = width < 600 ? 16 : 34
  const rightPad = width < 600 ? 14 : 26
  const topPad = eased < 0.4 ? 29 : 26
  const bottomPad = eased < 0.4 ? 17 : 34
  const scale = Math.min(
    (width - leftPad - rightPad) / Math.max(1, maxX - minX),
    (height - topPad - bottomPad) / Math.max(1, maxY - minY),
  )
  const offsetX = leftPad - minX * scale + (width - leftPad - rightPad - (maxX - minX) * scale) / 2
  const offsetY = topPad - minY * scale + (height - topPad - bottomPad - (maxY - minY) * scale) / 2
  const project = (x: number, y: number, z: number): Point => {
    const point = projectPoint(cam, x, y, z)
    return [offsetX + point[0] * scale, offsetY + point[1] * scale]
  }

  const gap = eased < 0.06 ? 0.16 : 0.12
  const cellSize = 1 - gap
  const ordered = cells
    .map((cell, index) => ({ cell, index, depth: depthOf(cam, cell.week + 0.5, cell.day + 0.5) }))
    .sort((a, b) => a.depth - b.depth)
  hitShapes = []

  for (const item of ordered) {
    const { cell, index, depth } = item
    const x0 = cell.week + gap / 2
    const x1 = x0 + cellSize
    const y0 = cell.day + gap / 2
    const y1 = y0 + cellSize
    const rise = riseAt(morph, cell.week, weeks, cell.day)
    const z = barHeight(cell.count, model.value.max, props.heightScale) * rise
    const top = [project(x0, y0, z), project(x1, y0, z), project(x1, y1, z), project(x0, y1, z)]
    const sideX = [top[1], project(x1, y0, 0), project(x1, y1, 0), top[2]]
    const sideY = [top[2], project(x1, y1, 0), project(x0, y1, 0), top[3]]
    const level = cell.level
    const isDimmed = legendLevel.value >= 0 && level !== legendLevel.value
    const isActive = index === activeIndex.value
    const alpha = isDimmed ? 0.16 : 1
    const color = swatches.value[level] ?? swatches.value[0]
    const visibleSide = z * cam.ce * scale > 0.55

    if (visibleSide) {
      drawPolygon(context, sideX, color, 0, 0.2, alpha)
      drawPolygon(context, sideY, color, 0, 0.34, alpha)
    }
    drawPolygon(context, top, colorWithAlpha(color, alpha), eased < 0.18 ? Math.max(0.8, scale * 0.08) : Math.max(0.35, scale * 0.025))

    if (isActive) {
      roundedQuad(context, top, Math.max(0.5, scale * 0.025))
      context.strokeStyle = ink.value
      context.globalAlpha = 0.92
      context.lineWidth = 1.5
      context.stroke()
      context.globalAlpha = 1
    } else if (eased < 0.12) {
      roundedQuad(context, top, Math.max(0.8, scale * 0.08))
      context.strokeStyle = line.value
      context.globalAlpha = 0.35
      context.lineWidth = 0.5
      context.stroke()
      context.globalAlpha = 1
    }

    hitShapes.push({
      cellIndex: index,
      depth,
      polygons: visibleSide ? [top, sideX, sideY] : [top],
    })
  }

  const muted = getComputedStyle(root.value!).getPropertyValue('--muted').trim() || '#787063'
  context.fillStyle = muted
  context.font = `${width < 540 ? 9 : 10}px var(--font-mono, monospace)`
  context.globalAlpha = 0.78
  if (eased < 0.52) {
    context.textAlign = 'left'
    context.textBaseline = 'bottom'
    let edge = -Infinity
    for (const month of model.value.months) {
      const [x, y] = project(month.week, -0.25, 0)
      const measured = context.measureText(month.label).width
      if (x < edge || x + measured > width - 4) continue
      context.fillText(month.label, x, y - 3)
      edge = x + measured + 8
    }
    if (width > 480) {
      context.textAlign = 'right'
      context.textBaseline = 'middle'
      for (const day of [1, 3, 5]) {
        const [, y] = project(0, day + 0.5, 0)
        context.fillText(['', '一', '', '三', '', '五'][day] ?? '', leftPad - 7, y)
      }
    }
  } else {
    context.textAlign = 'left'
    context.textBaseline = 'top'
    let edge = -Infinity
    for (const month of model.value.months) {
      const [x, y] = project(month.week + 0.4, 7.25, 0)
      const measured = context.measureText(month.label).width
      if (x < edge || x + measured > width - 5) continue
      context.fillText(month.label, x, y + 3)
      edge = x + measured + 9
    }
  }
  context.globalAlpha = 1

  const active = activeCell.value
  if (active && activeIndex.value >= 0) {
    const shape = hitShapes.find((item) => item.cellIndex === activeIndex.value)
    const top = shape?.polygons[0]
    if (top) {
      const centerX = top.reduce((sum, point) => sum + point[0], 0) / top.length
      const topY = Math.min(...top.map((point) => point[1]))
      tooltipPosition.value = {
        x: Math.max(86, Math.min(width - 86, centerX)),
        y: Math.max(8, topY - 10),
      }
    }
  }
}

const tick = (time: number) => {
  frame = 0
  const delta = Math.min(50, Math.max(0, time - lastFrame))
  lastFrame = time
  let moving = false
  const morphStep = reduceMotion.value ? 1 : delta / 1_250
  if (morph !== morphTarget) {
    morph = morphTarget > morph ? Math.min(morphTarget, morph + morphStep) : Math.max(morphTarget, morph - morphStep)
    moving = true
  }

  const orbitEase = reduceMotion.value ? 1 : 1 - Math.exp(-(delta / 1000) * 13)
  yaw += (yawTarget - yaw) * orbitEase
  elevation += (elevationTarget - elevation) * orbitEase
  if (Math.abs(yawTarget - yaw) > 0.0001 || Math.abs(elevationTarget - elevation) > 0.0001) moving = true
  draw()
  if (moving) requestDraw()
}

const requestDraw = () => {
  if (frame) return
  lastFrame ||= performance.now()
  frame = requestAnimationFrame(tick)
}

const setView = (next: ViewMode) => {
  view.value = next
  morphTarget = next === '3d' && entered.value ? 1 : 0
  requestDraw()
}

const resetOrbit = () => {
  yawTarget = 0
  elevationTarget = 0
  requestDraw()
}

const hitTest = (x: number, y: number) => {
  const ordered = [...hitShapes].sort((a, b) => b.depth - a.depth)
  for (const shape of ordered) {
    if (shape.polygons.some((polygon) => pointInPolygon([x, y], polygon))) return shape.cellIndex
  }
  return -1
}

const updateActive = () => {
  activeIndex.value = hoveredIndex >= 0 ? hoveredIndex : pinnedIndex.value
  requestDraw()
}

const localPoint = (event: PointerEvent) => {
  const bounds = canvas.value!.getBoundingClientRect()
  return [event.clientX - bounds.left, event.clientY - bounds.top] as Point
}

const onPointerDown = (event: PointerEvent) => {
  if (event.button !== 0) return
  pointerDrag = {
    id: event.pointerId,
    x: event.clientX,
    y: event.clientY,
    yaw: yawTarget,
    elevation: elevationTarget,
    moved: false,
    canOrbit: view.value === '3d',
  }
  if (pointerDrag.canOrbit) canvas.value?.setPointerCapture(event.pointerId)
}

const onPointerMove = (event: PointerEvent) => {
  if (pointerDrag?.canOrbit && event.pointerId === pointerDrag.id) {
    const dx = event.clientX - pointerDrag.x
    const dy = event.clientY - pointerDrag.y
    if (pointerDrag.moved || Math.hypot(dx, dy) > 4) {
      pointerDrag.moved = true
      yawTarget = Math.min(YAW_RANGE[1] - YAW_3D, Math.max(YAW_RANGE[0] - YAW_3D, pointerDrag.yaw + dx * 0.006))
      elevationTarget = Math.min(ELEV_RANGE[1] - ELEV_3D, Math.max(ELEV_RANGE[0] - ELEV_3D, pointerDrag.elevation + dy * 0.004))
      hoveredIndex = -1
      updateActive()
      if (canvas.value) canvas.value.style.cursor = 'grabbing'
      return
    }
  }
  if (event.pointerType !== 'mouse') return
  const point = localPoint(event)
  const next = hitTest(...point)
  if (next !== hoveredIndex) {
    hoveredIndex = next
    updateActive()
  }
  if (canvas.value) canvas.value.style.cursor = view.value === '3d' ? 'grab' : next >= 0 ? 'pointer' : 'default'
}

const onPointerUp = (event: PointerEvent) => {
  if (!pointerDrag || pointerDrag.id !== event.pointerId) return
  const moved = pointerDrag.moved
  pointerDrag = null
  if (canvas.value?.hasPointerCapture(event.pointerId)) canvas.value.releasePointerCapture(event.pointerId)
  if (canvas.value) canvas.value.style.cursor = view.value === '3d' ? 'grab' : 'default'
  if (moved) return

  const index = hitTest(...localPoint(event))
  pinnedIndex.value = pinnedIndex.value === index ? -1 : index
  if (event.pointerType !== 'mouse') hoveredIndex = -1
  updateActive()
}

const onPointerLeave = () => {
  if (pointerDrag) return
  hoveredIndex = -1
  updateActive()
}

const onKeydown = (event: KeyboardEvent) => {
  const keys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'Escape', 'Enter', ' ']
  if (!keys.includes(event.key) || !model.value.cells.length) return
  event.preventDefault()
  if (event.key === 'Escape') {
    pinnedIndex.value = -1
    hoveredIndex = -1
    updateActive()
    return
  }

  let index = pinnedIndex.value >= 0 ? pinnedIndex.value : activeIndex.value >= 0 ? activeIndex.value : model.value.cells.length - 1
  if (event.key === 'ArrowLeft') index -= 7
  if (event.key === 'ArrowRight') index += 7
  if (event.key === 'ArrowUp') index -= 1
  if (event.key === 'ArrowDown') index += 1
  if (event.key === 'Home') index = 0
  if (event.key === 'End') index = model.value.cells.length - 1
  if (event.key === 'Enter' || event.key === ' ') {
    pinnedIndex.value = pinnedIndex.value === index ? -1 : index
    updateActive()
    return
  }
  pinnedIndex.value = Math.max(0, Math.min(model.value.cells.length - 1, index))
  updateActive()
}

const describeDateRange = (start: string | null, end: string | null) => {
  if (!start || !end) return '尚未形成'
  return `${shortDateFormat.value.format(dayMs(start))} — ${shortDateFormat.value.format(dayMs(end))}`
}

watch(model, () => {
  activeIndex.value = -1
  pinnedIndex.value = -1
  hoveredIndex = -1
  requestDraw()
})
watch(legendLevel, requestDraw)

onMounted(() => {
  mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  reduceMotion.value = mediaQuery.matches

  mediaQuery.addEventListener('change', onMotionChange)

  resizeObserver = new ResizeObserver((entries) => {
    width = Math.max(280, entries[0]?.contentRect.width ?? stage.value?.clientWidth ?? 0)
    requestDraw()
  })
  if (stage.value) resizeObserver.observe(stage.value)

  intersectionObserver = new IntersectionObserver(([entry]) => {
    if (!entry?.isIntersecting || entered.value) return
    entered.value = true
    morphTarget = view.value === '3d' ? 1 : 0
    requestDraw()
    intersectionObserver?.disconnect()
  }, { threshold: 0.22 })
  if (root.value) intersectionObserver.observe(root.value)

  themeObserver = new MutationObserver(readTheme)
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style'] })
  readTheme()
  loadContributions()

})

onBeforeUnmount(() => {
  abortController?.abort()
  resizeObserver?.disconnect()
  intersectionObserver?.disconnect()
  themeObserver?.disconnect()
  mediaQuery?.removeEventListener('change', onMotionChange)
  if (frame) cancelAnimationFrame(frame)
})
</script>

<template>
  <section ref="root" class="skyline-card" aria-labelledby="contribution-skyline-title">
    <header class="skyline-header">
      <div class="skyline-heading">
        <div class="skyline-status-row">
          <span class="skyline-live-dot" :data-state="dataState" aria-hidden="true" />
          <span>{{ statusLabel }}</span>
        </div>
        <h3 id="contribution-skyline-title">
          <strong>{{ numberFormat.format(model.stats.total) }}</strong>
          次公开贡献，正在形成一座城
        </h3>
      </div>

      <div class="skyline-toolbar" aria-label="贡献图显示方式">
        <button
          type="button"
          :class="{ active: view === '2d' }"
          :aria-pressed="view === '2d'"
          title="二维贡献热力图"
          @click="setView('2d')"
        >
          <Grid3X3 :size="15" />
          <span>平面</span>
        </button>
        <button
          type="button"
          :class="{ active: view === '3d' }"
          :aria-pressed="view === '3d'"
          title="三维贡献城市"
          @click="setView('3d')"
        >
          <Box :size="15" />
          <span>城市</span>
        </button>
        <button
          v-if="view === '3d'"
          type="button"
          class="reset-button"
          title="重置城市视角"
          @click="resetOrbit"
        >
          <RotateCcw :size="14" />
          <span class="sr-only">重置视角</span>
        </button>
      </div>
    </header>

    <div class="skyline-viewport">
      <div
        ref="stage"
        class="skyline-stage"
        :style="{ height: `${stageHeight}px` }"
      >
        <canvas
          ref="canvas"
          tabindex="0"
          role="img"
          :aria-label="`${props.username} 最近一年的 GitHub 贡献图。可使用方向键浏览日期。`"
          @pointerdown="onPointerDown"
          @pointermove="onPointerMove"
          @pointerup="onPointerUp"
          @pointercancel="pointerDrag = null"
          @pointerleave="onPointerLeave"
          @dblclick="resetOrbit"
          @keydown="onKeydown"
        />
        <div
          class="skyline-tooltip"
          role="tooltip"
          :aria-hidden="activeIndex < 0"
          :style="{
            opacity: activeIndex >= 0 ? 1 : 0,
            transform: `translate(${tooltipPosition.x}px, ${tooltipPosition.y}px) translate(-50%, -100%)`,
          }"
        >
          {{ tooltipLabel || ' ' }}
          <i aria-hidden="true" />
        </div>
      </div>

      <div class="skyline-stats" aria-label="最近一年贡献统计">
        <div>
          <span>ACTIVE DAYS</span>
          <strong>{{ numberFormat.format(model.stats.activeDays) }}</strong>
          <small>有贡献的日子</small>
        </div>
        <div>
          <span>BUSIEST DAY</span>
          <strong>{{ numberFormat.format(model.stats.busiest.count) }}</strong>
          <small>{{ model.stats.busiest.date ? shortDateFormat.format(dayMs(model.stats.busiest.date)) : '暂无记录' }}</small>
        </div>
        <div>
          <span>LONGEST STREAK</span>
          <strong>{{ model.stats.longest.days }}</strong>
          <small>{{ describeDateRange(model.stats.longest.start, model.stats.longest.end) }}</small>
        </div>
        <div>
          <span>CURRENT STREAK</span>
          <strong>{{ model.stats.current.days }}</strong>
          <small>{{ describeDateRange(model.stats.current.start, model.stats.current.end) }}</small>
        </div>
      </div>

      <footer class="skyline-footer">
        <span>{{ currentHint }}</span>
        <div class="skyline-legend" @mouseleave="legendLevel = -1">
          <span>少</span>
          <button
            v-for="(color, index) in swatches"
            :key="color"
            type="button"
            :aria-label="`只突出贡献等级 ${index}`"
            :aria-pressed="legendLevel === index"
            :style="{ background: color }"
            @mouseenter="legendLevel = index"
            @focus="legendLevel = index"
            @blur="legendLevel = -1"
            @click="legendLevel = legendLevel === index ? -1 : index"
          />
          <span>多</span>
        </div>
        <a :href="githubUrl" target="_blank" rel="noreferrer">
          @{{ props.username }}
          <ExternalLink :size="12" />
        </a>
      </footer>
    </div>
    <p class="sr-only" aria-live="polite">{{ activeCell ? tooltipLabel : '' }}</p>
  </section>
</template>

<style scoped>
.skyline-card {
  --skyline-ease: cubic-bezier(.22, 1, .36, 1);
  position: relative;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 10px;
  background:
    radial-gradient(circle at 78% 0%, color-mix(in oklab, var(--ember-tint) 52%, transparent), transparent 34%),
    var(--paper);
  box-shadow: 0 20px 60px -48px color-mix(in srgb, var(--ink) 36%, transparent);
}
.skyline-card::before {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: linear-gradient(to right, color-mix(in srgb, var(--line) 22%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, var(--line) 18%, transparent) 1px, transparent 1px);
  background-size: 32px 32px;
  mask-image: linear-gradient(to bottom, #000, transparent 64%);
  content: '';
  opacity: .48;
}
.skyline-header,
.skyline-viewport { position: relative; z-index: 1; }
.skyline-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  padding: 22px 24px 18px;
  border-bottom: 1px solid color-mix(in srgb, var(--line) 86%, transparent);
}
.skyline-status-row {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--faint);
  font-family: var(--font-mono);
  font-size: .67rem;
  letter-spacing: .07em;
  text-transform: uppercase;
}
.skyline-live-dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: var(--amber);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--amber) 12%, transparent);
}
.skyline-live-dot[data-state='live'] {
  background: var(--jade);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--jade) 13%, transparent);
}
.skyline-heading h3 {
  margin: 8px 0 0;
  font-family: var(--font-sans);
  font-size: clamp(1rem, 2vw, 1.2rem);
  font-weight: 450;
  letter-spacing: -.02em;
}
.skyline-heading h3 strong {
  color: var(--ember);
  font-family: var(--font-mono);
  font-size: 1.08em;
  font-weight: 600;
}
.skyline-toolbar {
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 3px;
  border: 1px solid var(--line);
  border-radius: 7px;
  background: color-mix(in srgb, var(--paper-2) 76%, transparent);
}
.skyline-toolbar button {
  display: inline-flex;
  min-height: 34px;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 6px 10px;
  border: 0;
  border-radius: 5px;
  background: transparent;
  color: var(--muted);
  cursor: pointer;
  font-size: .73rem;
  transition: background .25s, color .25s, box-shadow .25s;
}
.skyline-toolbar button:hover { color: var(--ink); }
.skyline-toolbar button.active {
  background: var(--paper);
  color: var(--ember);
  box-shadow: var(--shadow-xs);
}
.skyline-toolbar .reset-button { width: 32px; padding-inline: 0; }
.skyline-stage {
  position: relative;
  width: 100%;
  min-height: 190px;
  transition: height 80ms linear;
}
.skyline-stage canvas {
  position: absolute;
  inset: 0;
  display: block;
  max-width: none;
  outline: none;
  touch-action: none;
  user-select: none;
}
.skyline-stage canvas:focus-visible {
  outline: 2px solid var(--ember);
  outline-offset: -4px;
  border-radius: 5px;
}
.skyline-tooltip {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 3;
  max-width: calc(100% - 20px);
  padding: 7px 9px;
  border-radius: 5px;
  background: var(--ink);
  color: var(--paper);
  font-family: var(--font-mono);
  font-size: .67rem;
  line-height: 1.25;
  pointer-events: none;
  white-space: nowrap;
  box-shadow: var(--shadow-md);
  transition: opacity .15s ease;
}
.skyline-tooltip i {
  position: absolute;
  top: 100%;
  left: calc(50% - 5px);
  width: 0;
  height: 0;
  border-top: 5px solid var(--ink);
  border-right: 5px solid transparent;
  border-left: 5px solid transparent;
}
.skyline-stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
}
.skyline-stats > div {
  min-width: 0;
  padding: 17px 20px 16px;
}
.skyline-stats > div + div { border-left: 1px solid var(--line); }
.skyline-stats span,
.skyline-stats small {
  display: block;
  overflow: hidden;
  color: var(--faint);
  font-family: var(--font-mono);
  font-size: .64rem;
  letter-spacing: .08em;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.skyline-stats strong {
  display: block;
  margin-block: 5px 3px;
  color: var(--ember);
  font-family: var(--font-mono);
  font-size: clamp(1.45rem, 3vw, 2rem);
  font-weight: 500;
  letter-spacing: -.05em;
  line-height: 1;
}
.skyline-stats small { letter-spacing: 0; text-transform: none; }
.skyline-footer {
  display: flex;
  min-height: 52px;
  align-items: center;
  gap: 18px;
  padding: 12px 20px;
  color: var(--faint);
  font-size: .7rem;
}
.skyline-footer > span { flex: 1; }
.skyline-footer a {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  gap: 5px;
  color: var(--ember);
}
.skyline-legend {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 5px;
}
.skyline-legend button {
  width: 12px;
  height: 12px;
  padding: 0;
  border: 1px solid color-mix(in srgb, var(--ink) 8%, transparent);
  border-radius: 2px;
  cursor: pointer;
  transition: transform .18s ease;
}
.skyline-legend button:hover,
.skyline-legend button[aria-pressed='true'] { transform: translateY(-2px) scale(1.16); }
@media (max-width: 720px) {
  .skyline-header { align-items: stretch; padding: 18px; }
  .skyline-toolbar button span { display: none; }
  .skyline-toolbar button { width: 34px; padding-inline: 0; }
  .skyline-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .skyline-stats > div:nth-child(3) { border-left: 0; border-top: 1px solid var(--line); }
  .skyline-stats > div:nth-child(4) { border-top: 1px solid var(--line); }
  .skyline-footer { flex-wrap: wrap; gap: 10px 14px; padding: 12px 16px; }
  .skyline-footer > span { flex-basis: 100%; }
  .skyline-footer a { margin-left: auto; }
}
@media (max-width: 440px) {
  .skyline-header { gap: 12px; padding: 16px; }
  .skyline-status-row { font-size: .58rem; letter-spacing: .03em; }
  .skyline-heading h3 { font-size: .92rem; }
  .skyline-toolbar { align-self: flex-start; }
  .skyline-stats > div { padding: 14px 15px; }
  .skyline-stats strong { font-size: 1.35rem; }
  .skyline-footer > span { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .skyline-toolbar button,
  .skyline-stage,
  .skyline-tooltip,
  .skyline-legend button { transition: none; }
}
</style>
