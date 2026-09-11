<script setup lang="ts">
/**
 * DecryptText — copy that arrives decoded rather than typed.
 *
 * Ported to Vue from the Motiq React original (MIT). Every glyph is already
 * boiling at t=0; character *i* locks at `startDelay + i·stagger ± jitter`, so
 * the line resolves in a ragged left-to-right sweep instead of a metronome.
 * Lock-in snaps the real glyph in behind a 420ms accent flash with a decaying
 * glow.
 *
 * The rendered markup always contains the REAL string, so the page is readable
 * before hydration and to assistive tech; the animated glyph layer is
 * `aria-hidden`. One rAF loop per instance writes `textContent` plus a state
 * attribute only — zero layout writes.
 */
import { computed, onBeforeUnmount, onMounted, ref, useId, useTemplateRef, watch } from 'vue'
import { cn } from '@/lib/utils'

/** Binds a character span into the flat, index-addressed animation array. */
const bindChar = (index: number) => (el: Element | { $el: Element } | null) => {
  const node = el instanceof Element ? el : (el?.$el ?? null)
  charRefs.value[index] = (node as HTMLSpanElement | null) ?? null
}

/** What starts the first decrypt run. Hover re-triggering is separate. */
export type DecryptTextTrigger = 'mount' | 'inview' | 'hover'
/** `display` = headline scale; `terminal` = mono CLI card with prompt + caret. */
export type DecryptTextVariant = 'display' | 'terminal'

const props = withDefaults(
  defineProps<{
    /** The real string. */
    text: string
    /** Scramble pool each unresolved character cycles through. */
    glyphs?: string
    /** Glyph cycle floor in ms (each char jitters between `speed` and `speed + 35`). */
    speed?: number
    /** Per-character lock-in stagger in ms. */
    stagger?: number
    /** Delay before the first character can lock, in ms. */
    startDelay?: number
    /** Random spread applied to every character's lock time, in ms (± this value). */
    jitter?: number
    /** What starts the first run. */
    trigger?: DecryptTextTrigger
    /** Visual treatment. */
    variant?: DecryptTextVariant
    /** Re-run automatically this many ms after settling; `false` runs once. */
    loop?: number | false
    /** Re-scramble on pointer enter (1.5s cooldown). */
    retriggerOnHover?: boolean
    /** Deterministic seed for the per-character jitter. */
    seed?: number
    /** Element tag for the rendered text. */
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div'
    /** Force the static, resolved variant regardless of system preference. */
    reducedMotion?: boolean
    /** Prefix shown before the text in the `terminal` variant. */
    prompt?: string
    class?: string
  }>(),
  {
    glyphs: undefined,
    speed: 45,
    stagger: 55,
    startDelay: 350,
    jitter: 120,
    trigger: 'inview',
    variant: 'display',
    loop: 7000,
    retriggerOnHover: true,
    seed: 1,
    as: 'p',
    reducedMotion: undefined,
    prompt: '$',
    class: undefined,
  },
)

const emit = defineEmits<{ decrypted: [] }>()

const POOL_DISPLAY = '#%&@$?!*+=/{}[]<>~^'
const POOL_TERMINAL = 'abcdef0123456789$#%&*+=/|_~'
/** Cooldown before a hover can restart a run (ms). */
const HOVER_COOLDOWN = 1500
/** Extra ms added to `speed` for the per-char cycle jitter ceiling. */
const CYCLE_SPREAD = 35

/** mulberry32 — no Math.random at render or module scope (SSR-stable). */
function makeRng(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
/** Instance-scoped hook for per-instance CSS, exposed as `data-dt`. */
const scope = `pd-dt-${uid}`

const rootRef = useTemplateRef<HTMLElement>('root')
const charRefs = ref<Array<HTMLSpanElement | null>>([])

let rafId: number | null = null
let timerId: ReturnType<typeof setTimeout> | null = null
let lastStart = -Infinity
let played = false
let runIndex = 0
let onScreen = true
let tabVisible = true
let frames = 0
let fpsAt = 0

const mounted = ref(false)
const systemReduced = ref(false)
const rafTick = ref(0)

onMounted(() => {
  mounted.value = true
  const media = window.matchMedia('(prefers-reduced-motion: reduce)')
  systemReduced.value = media.matches
  media.addEventListener('change', handleReducedChange)
  document.addEventListener('visibilitychange', handleVisibility)
  window.addEventListener('resize', handleResize)
  setupObserver()
  rafTick.value += 1
})

onBeforeUnmount(() => {
  stop()
  window.matchMedia('(prefers-reduced-motion: reduce)').removeEventListener(
    'change',
    handleReducedChange,
  )
  document.removeEventListener('visibilitychange', handleVisibility)
  window.removeEventListener('resize', handleResize)
  observer?.disconnect()
})

const handleReducedChange = (event: MediaQueryListEvent) => {
  systemReduced.value = event.matches
  rafTick.value += 1
}

const handleVisibility = () => {
  tabVisible = document.visibilityState !== 'hidden'
  if (!tabVisible) stop()
  else rafTick.value += 1
}

const handleResize = () => {
  if (rafId != null) return
  rafTick.value += 1
}

let observer: IntersectionObserver | null = null

const setupObserver = () => {
  const el = rootRef.value
  if (!el || typeof IntersectionObserver === 'undefined') return
  observer = new IntersectionObserver(
    (entries) => {
      const next = entries.some((entry) => entry.isIntersecting)
      if (next === onScreen) return
      onScreen = next
      if (!onScreen) stop()
      else rafTick.value += 1
    },
    { threshold: 0.12 },
  )
  observer.observe(el)
}

const reduceNow = computed(() => props.reducedMotion ?? systemReduced.value)
const visible = computed(() => onScreen && tabVisible)

const pool = computed(() =>
  props.glyphs && props.glyphs.length > 0
    ? props.glyphs
    : props.variant === 'terminal'
      ? POOL_TERMINAL
      : POOL_DISPLAY,
)

/** Words keep their glyphs together so the line wraps on word boundaries. */
const words = computed(() => {
  const out: Array<Array<{ i: number; ch: string }>> = []
  let index = 0
  for (const word of props.text.split(' ')) {
    const item: Array<{ i: number; ch: string }> = []
    for (const ch of Array.from(word)) {
      item.push({ i: index, ch })
      index += 1
    }
    out.push(item)
  }
  return out
})

const total = computed(() => words.value.reduce((sum, word) => sum + word.length, 0))

const resolved = computed(
  () => props.reducedMotion ?? (mounted.value ? systemReduced.value : false),
)

function stop() {
  if (rafId != null) cancelAnimationFrame(rafId)
  rafId = null
  if (timerId) clearTimeout(timerId)
  timerId = null
}

function resolveAll() {
  for (const el of charRefs.value) {
    if (!el) continue
    el.textContent = el.dataset.char ?? el.textContent
    el.dataset.state = 'plain'
  }
}

function play() {
  const rng = makeRng(props.seed + runIndex * 7919)
  runIndex += 1
  stop()

  const cells = charRefs.value.filter((el): el is HTMLSpanElement => el !== null)
  if (cells.length === 0) return

  lastStart = performance.now()
  played = true

  const lockAt = new Float64Array(cells.length)
  const nextAt = new Float64Array(cells.length)
  const locked = new Uint8Array(cells.length)
  const glyphPool = pool.value

  cells.forEach((el, index) => {
    lockAt[index] = props.startDelay + index * props.stagger + (rng() * 2 - 1) * props.jitter
    nextAt[index] = 0
    el.dataset.state = 'scramble'
    el.textContent = glyphPool.charAt((rng() * glyphPool.length) | 0)
  })

  let remaining = cells.length
  const t0 = performance.now()

  const frame = () => {
    const now = performance.now() - t0

    // Watchdog: a frame budget of 1000ms means the glyph churn is competing
    // with the WebGL backdrop or a background tab, so settle immediately
    // instead of burning cycles the visitor cannot see.
    const delta = now - frames
    frames = now
    if (now > fpsAt + 400 && delta > 1000) {
      fpsAt = now
      for (let index = 0; index < cells.length; index += 1) {
        if (locked[index]) continue
        const el = cells[index]
        el.textContent = el.dataset.char ?? ''
        el.dataset.state = 'plain'
        locked[index] = 1
      }
      remaining = 0
    }

    for (let index = 0; index < cells.length; index += 1) {
      if (locked[index]) continue
      const el = cells[index]
      if (now >= (lockAt[index] ?? 0)) {
        el.textContent = el.dataset.char ?? ''
        el.dataset.state = 'lock'
        locked[index] = 1
        remaining -= 1
      } else if (now >= (nextAt[index] ?? 0)) {
        el.textContent = glyphPool.charAt((rng() * glyphPool.length) | 0)
        nextAt[index] = now + props.speed + rng() * CYCLE_SPREAD
      }
    }

    if (remaining <= 0) {
      rafId = null
      emit('decrypted')
      if (props.loop !== false && props.loop > 0) {
        timerId = setTimeout(() => {
          timerId = null
          play()
        }, props.loop)
      }
      return
    }
    rafId = requestAnimationFrame(frame)
  }

  rafId = requestAnimationFrame(frame)
}

// Orchestration: reduced motion resolves and parks; otherwise the first run is
// gated on the trigger and every run is parked while offscreen.
watch(
  [resolved, visible, () => props.trigger, () => props.loop, rafTick],
  () => {
    if (resolved.value) {
      stop()
      resolveAll()
      return
    }
    if (!visible.value) {
      stop()
      return
    }
    if (props.trigger === 'hover') {
      if (!played) resolveAll()
      return
    }
    if (!played) {
      play()
      return
    }
    // Coming back on screen after a completed run: re-arm the loop, don't restart.
    if (props.loop !== false && props.loop > 0 && rafId == null && timerId == null) {
      timerId = setTimeout(() => {
        timerId = null
        play()
      }, Math.min(props.loop, 3000))
    }
  },
  { immediate: true, flush: 'post' },
)

const onPointerEnter = () => {
  if (reduceNow.value || !props.retriggerOnHover) return
  if (rafId != null) return
  if (performance.now() - lastStart < HOVER_COOLDOWN) return
  play()
}
</script>

<template>
  <component
    :is="as"
    ref="root"
    :data-dt="scope"
    :data-motion="resolved ? 'static' : 'animated'"
    :data-variant="variant"
    :data-chars="total"
    :class="
      cn(
        'pd-decrypt block w-full',
        variant === 'terminal'
          ? 'font-mono text-[clamp(0.76rem,2.3vw,0.95rem)] leading-relaxed'
          : 'text-balance font-serif text-[clamp(2.6rem,6.4vw,5.2rem)] leading-[1.02] font-medium tracking-[-0.045em]',
        props.class,
      )
    "
    @pointerenter="onPointerEnter"
  >
    <span class="sr-only">{{ text }}</span>

    <span
      v-if="variant === 'terminal'"
      class="inline-flex max-w-full flex-wrap items-baseline gap-x-1.5 rounded-xl border border-line bg-forest/95 px-4 py-3 align-middle shadow-[var(--shadow-md)]"
    >
      <span aria-hidden="true" class="text-jade select-none">{{ prompt }}</span>
      <span aria-hidden="true" class="select-none">
        <template v-for="(word, w) in words" :key="w">
          <!--
            `whitespace-pre` used to sit here, which turned each space-delimited
            run into one unbreakable box. That is fine for Latin words but wrong
            for CJK: a Chinese headline has no spaces, so the entire line became
            a single atom and overflowed the viewport by 107px on a 390px screen.
            Leaving the wrapper breakable lets CJK wrap per character while
            Latin still wraps at the explicit spaces between runs.
          -->
          <span class="inline-block">
            <span
              v-for="item in word"
              :key="item.i"
              :ref="bindChar(item.i)"
              :data-char="item.ch"
              data-state="plain"
              >{{ item.ch }}</span
            >
          </span>
          <template v-if="w < words.length - 1"> </template>
        </template>
      </span>
      <span
        aria-hidden="true"
        data-caret
        class="inline-block h-[1.05em] w-[0.5em] translate-y-[0.1em] bg-jade"
      />
    </span>

    <span v-else class="block" aria-hidden="true">
      <span class="select-none">
        <template v-for="(word, w) in words" :key="w">
          <span class="inline-block">
            <span
              v-for="item in word"
              :key="item.i"
              :ref="bindChar(item.i)"
              :data-char="item.ch"
              data-state="plain"
              >{{ item.ch }}</span
            >
          </span>
          <template v-if="w < words.length - 1"> </template>
        </template>
      </span>
    </span>
  </component>
</template>

<style scoped>
/*
 * Scramble / lock-in treatment. Character state is written straight to the DOM
 * by the animation loop, so these rules key off `data-state` instead of classes.
 */
.pd-decrypt :deep([data-char]) {
  color: var(--ink);
  transition: color 0.12s linear;
}

.pd-decrypt :deep([data-char][data-state='scramble']) {
  color: color-mix(in oklab, var(--muted) 78%, var(--ember));
}

.pd-decrypt :deep([data-char][data-state='lock']) {
  color: var(--ink);
  animation: pd-dt-flash 420ms cubic-bezier(0.2, 0, 0, 1);
}

@keyframes pd-dt-flash {
  0% {
    color: var(--ember);
    text-shadow: 0 0 26px color-mix(in oklab, var(--ember) 70%, transparent);
  }
  100% {
    color: inherit;
    text-shadow: 0 0 0 transparent;
  }
}

.pd-decrypt :deep([data-caret]) {
  animation: pd-dt-caret 1.1s steps(1) infinite;
}

@keyframes pd-dt-caret {
  50% {
    opacity: 0;
  }
}

/* Headline variant sits on the dark hero, so the palette inverts. */
.pd-decrypt[data-variant='display'] :deep([data-char]) {
  color: inherit;
}

.pd-decrypt[data-variant='display'] :deep([data-char][data-state='scramble']) {
  color: color-mix(in oklab, var(--ember) 55%, rgba(255, 255, 255, 0.55));
}

.pd-decrypt[data-variant='display'] :deep([data-char][data-state='lock']) {
  color: inherit;
}

@media (prefers-reduced-motion: reduce) {
  .pd-decrypt :deep([data-char][data-state='lock']),
  .pd-decrypt :deep([data-caret]) {
    animation: none;
  }
}
</style>
