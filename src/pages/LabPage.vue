<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, useTemplateRef } from 'vue'
import { Github, MousePointer2, Move3d, Sparkles, Waves } from 'lucide-vue-next'
import FoxMark from '@/components/shell/FoxMark.vue'
import Velaris from '@/components/ui/velaris/Velaris.vue'
import { useReducedMotion } from '@/composables/useMediaQuery'

/**
 * The lab carries over the interactive dot-grid from the old homepage, rebuilt
 * on canvas 2D: a lattice that remembers where the cursor has been and springs
 * back. The renderer only runs while the canvas is on screen.
 */
const canvasRef = useTemplateRef<HTMLCanvasElement>('canvas')
const wrapRef = useTemplateRef<HTMLDivElement>('wrap')
const reduced = useReducedMotion()

let frame: number | null = null
let observer: IntersectionObserver | null = null
let resizeObserver: ResizeObserver | null = null
const mouse = { x: -9999, y: -9999, active: false }
let width = 0
let height = 0
let dpr = 1

const GAP = 26
const DOT = 2
const RADIUS = 130

function syncSize() {
  const canvas = canvasRef.value
  const wrap = wrapRef.value
  if (!canvas || !wrap) return
  const rect = wrap.getBoundingClientRect()
  dpr = Math.min(window.devicePixelRatio || 1, 2)
  width = rect.width
  height = rect.height
  canvas.width = Math.round(width * dpr)
  canvas.height = Math.round(height * dpr)
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`
  const ctx = canvas.getContext('2d')
  ctx?.setTransform(dpr, 0, 0, dpr, 0, 0)
}

function draw() {
  const canvas = canvasRef.value
  const ctx = canvas?.getContext('2d')
  if (!canvas || !ctx) return

  ctx.clearRect(0, 0, width, height)

  const ember = getComputedStyle(document.documentElement).getPropertyValue('--ember').trim() || '#f0642f'
  const idle = 'rgba(150, 148, 138, 0.3)'

  for (let x = GAP / 2; x < width; x += GAP) {
    for (let y = GAP / 2; y < height; y += GAP) {
      const dx = mouse.x - x
      const dy = mouse.y - y
      const distance = Math.hypot(dx, dy)
      const force = Math.max(0, 1 - distance / RADIUS)
      const offsetX = force * dx * 0.16
      const offsetY = force * dy * 0.16
      const size = DOT + force * 5.5

      if (force > 0.01) {
        ctx.fillStyle = ember
        ctx.globalAlpha = 0.28 + force * 0.72
      } else {
        ctx.fillStyle = idle
        ctx.globalAlpha = 1
      }

      ctx.beginPath()
      ctx.roundRect(
        Math.round(x + offsetX),
        Math.round(y + offsetY),
        Math.round(size),
        Math.round(size),
        1.4,
      )
      ctx.fill()
    }
  }
  ctx.globalAlpha = 1

  if (reduced.value) {
    frame = null
    return
  }
  frame = requestAnimationFrame(draw)
}

function start() {
  if (frame != null) return
  frame = requestAnimationFrame(draw)
}

function stop() {
  if (frame != null) cancelAnimationFrame(frame)
  frame = null
}

const onPointerMove = (event: PointerEvent) => {
  const wrap = wrapRef.value
  if (!wrap) return
  const rect = wrap.getBoundingClientRect()
  mouse.x = event.clientX - rect.left
  mouse.y = event.clientY - rect.top
  mouse.active = true
}

const onPointerLeave = () => {
  mouse.x = -9999
  mouse.y = -9999
  mouse.active = false
}

onMounted(() => {
  const wrap = wrapRef.value
  if (!wrap) return

  syncSize()
  draw()

  observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) start()
      else stop()
    },
    { threshold: 0.05 },
  )
  observer.observe(wrap)

  resizeObserver = new ResizeObserver(() => {
    syncSize()
    if (reduced.value) draw()
  })
  resizeObserver.observe(wrap)

  wrap.addEventListener('pointermove', onPointerMove, { passive: true })
  wrap.addEventListener('pointerleave', onPointerLeave)
})

onBeforeUnmount(() => {
  stop()
  observer?.disconnect()
  resizeObserver?.disconnect()
  const wrap = wrapRef.value
  wrap?.removeEventListener('pointermove', onPointerMove)
  wrap?.removeEventListener('pointerleave', onPointerLeave)
})

const experiments = computed(() => [
  {
    id: '01',
    title: '交互点阵',
    caption: '让网格记住鼠标经过的风',
    detail: '源自旧个人主页的 PlayGround 实验，用 Canvas 2D 重写并交给狐狸接管。',
    icon: MousePointer2,
    live: true,
  },
  {
    id: '02',
    title: 'WebGL 噪声场',
    caption: '正在首页上呼吸的橙色星云',
    detail: 'Simplex 噪声在 GPU 上叠加出缓慢流动的色块，首屏已经在跑。',
    icon: Waves,
    live: true,
  },
  {
    id: '03',
    title: '文字解密',
    caption: '让标题一个字一个字地锁定',
    detail: '逐字符的乱码收敛动画，用 rAF 直接写 DOM，不触发布局。',
    icon: Sparkles,
    live: true,
  },
  {
    id: '04',
    title: '下一项实验正在发芽',
    caption: '视差、声音可视化、着色器玩具…',
    detail: '保持好奇。有新想法就会先丢进这个页面。',
    icon: Move3d,
    live: false,
  },
])

const LAB_BG: [string, string] = ['#f0e3d1', '#101109']
const LAB_COLORS: [string[], string[]] = [
  ['#e79a63', '#cd7448', '#a95a35', '#f0e3d1'],
  ['#f0642f', '#a8401f', '#33180c', '#101109'],
]
const LAB_GLOW: [number, number] = [0.12, 0.3]
const LAB_VIGNETTE: [number, number] = [0.32, 0.8]
</script>

<template>
  <div class="shell-wide pt-14">
    <header class="border-b border-line pb-9">
      <p class="eyebrow">Fox playground / 001</p>
      <h1 class="mt-4 font-serif text-[clamp(2.3rem,6vw,4.6rem)] leading-[1] tracking-[-0.055em]">
        狐狸实验室
      </h1>
      <p class="mt-4 max-w-xl text-[0.9rem] leading-relaxed text-muted">
        这里存放交互实验、视觉草图和那些还不能被称为项目的有趣尝试。首页上的背景、标题动画和这一页的点阵，都是从这里长出来的。
      </p>
    </header>

    <!-- ============ LIVE DOT GRID ============ -->
    <section ref="wrap" class="relative mt-8 h-[30rem] overflow-hidden rounded-[1.75rem] border border-line bg-forest sm:h-[34rem]">
      <canvas ref="canvas" class="absolute inset-0" aria-hidden="true" />

      <div class="pointer-events-none absolute inset-0 flex flex-col justify-between p-7 sm:p-9">
        <div class="flex items-start justify-between gap-4">
          <span class="font-mono text-[0.6rem] tracking-[0.16em] text-white/55 uppercase">
            Interactive grid · move your cursor
          </span>
          <FoxMark :size="60" />
        </div>

        <div>
          <h2 class="max-w-2xl font-serif text-[clamp(1.7rem,4.4vw,3rem)] leading-[1.1] tracking-[-0.04em] text-white">
            让网格记住鼠标经过的风。
          </h2>
          <p class="mt-3 max-w-md text-[0.86rem] leading-relaxed text-white/62">
            每个点都会朝光标偏一点、亮一点，然后慢慢弹回去。滚动离开这一屏，渲染循环会自动停下。
          </p>
        </div>
      </div>
    </section>

    <!-- ============ EXPERIMENT INDEX ============ -->
    <section class="pt-16">
      <header class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p class="eyebrow">Experiment log</p>
          <h2 class="mt-3 font-serif text-[clamp(1.8rem,3.8vw,2.6rem)] tracking-[-0.04em]">
            实验记录
          </h2>
        </div>
        <span class="font-mono text-[0.62rem] text-faint">
          {{ experiments.filter((item) => item.live).length }} 项在线
        </span>
      </header>

      <div class="mt-8 grid gap-4 sm:grid-cols-2">
        <article
          v-for="(item, index) in experiments"
          :key="item.id"
          v-reveal="index * 80"
          class="group relative overflow-hidden rounded-2xl border border-line bg-paper p-5 transition-all duration-500"
          :class="item.live ? 'hover:-translate-y-1 hover:border-ember/45 hover:shadow-[var(--shadow-sm)]' : 'border-dashed'"
        >
          <div class="flex items-start justify-between gap-3">
            <span class="font-mono text-[0.6rem] tracking-[0.16em] text-ember">{{ item.id }}</span>
            <component
              :is="item.icon"
              :size="16"
              :class="item.live ? 'text-ember' : 'text-faint'"
            />
          </div>

          <h3 class="mt-6 font-serif text-[1.28rem] tracking-[-0.03em]">{{ item.title }}</h3>
          <p class="mt-1 text-[0.78rem] text-ember/80">{{ item.caption }}</p>
          <p class="mt-3 text-[0.84rem] leading-relaxed text-muted">{{ item.detail }}</p>

          <span
            class="mt-5 inline-flex items-center gap-2 rounded-full border px-2.5 py-1 font-mono text-[0.58rem] tracking-[0.12em] uppercase"
            :class="item.live ? 'border-jade/40 text-jade' : 'border-line text-faint'"
          >
            <i
              class="size-1.5 rounded-full"
              :class="item.live ? 'bg-jade [animation:pulse-dot_2.4s_ease-out_infinite]' : 'bg-faint'"
              aria-hidden="true"
            />
            {{ item.live ? 'live' : 'germinating' }}
          </span>
        </article>
      </div>
    </section>

    <!-- ============ SHADER TEASER ============ -->
    <section v-reveal class="pt-16">
      <Velaris
        :colors="LAB_COLORS"
        :bg="LAB_BG"
        :glow="LAB_GLOW"
        :vignette="LAB_VIGNETTE"
        :speed="1.6"
        :grain="0.4"
        height="auto"
        class="min-h-[20rem] rounded-[1.75rem] border border-hero-line"
      >
        <div class="flex min-h-[20rem] flex-col justify-between p-7 sm:p-9">
          <span class="font-mono text-[0.6rem] tracking-[0.18em] text-hero-muted uppercase">
            GPU · fragment shader · no dependencies
          </span>
          <div class="max-w-2xl">
            <h2 class="font-serif text-[clamp(1.6rem,3.8vw,2.6rem)] leading-[1.1] tracking-[-0.04em] text-hero-fg">
              橙色星云是同一段着色器在跑。
            </h2>
            <p class="mt-3 text-[0.86rem] leading-relaxed text-hero-muted">
              三层 Simplex 噪声互相扰动，再叠上暗角与胶片颗粒。首屏、关于页和这里用的是同一个组件，只是换了调色板。
            </p>
            <a
              href="https://github.com/DanoAndHolidays/Pressidian"
              target="_blank"
              rel="noreferrer"
              class="mt-6 inline-flex items-center gap-2 rounded-full border border-hero-line px-4 py-2.5 text-[0.8rem] text-hero-fg transition-colors hover:border-ember hover:text-ember"
            >
              <Github :size="14" />
              在 GitHub 上看源码
            </a>
          </div>
        </div>
      </Velaris>
    </section>
  </div>
</template>
