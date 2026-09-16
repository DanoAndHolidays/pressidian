<script setup lang="ts">
import { computed, ref, watch } from 'vue'

/**
 * Page-wide signal corruption.
 *
 * The discrete, non-repeating bursts come from `useGlitch`; this component is
 * the *vocabulary* of shapes they are drawn from. Each burst composes a fresh
 * set of artefacts at random positions, so no two look alike:
 *
 * - **tear bands** — a few full-width strips that slide sideways and invert
 *   whatever is beneath them, the way a mis-tracked VHS line does;
 * - **block dropout** — small solid-colour rectangles sitting over the layout
 *   like corrupted macroblocks;
 * - **tracking sweep** — a single bright bar travelling down the page once.
 *
 * Everything is `pointer-events: none` and drawn on its own compositor layer,
 * so a burst can never intercept a click or force a reflow of the content.
 */
const props = defineProps<{ active: boolean; intensity: number }>()

type Band = {
  id: number
  top: number
  height: number
  shift: number
  hue: 'cyan' | 'magenta' | 'plain'
}

const BAND_COUNT = 5

const bands = ref<Band[]>([])
let seed = 0

/**
 * Rebuild the artefact set on every rising edge. Keyed by an incrementing id so
 * Vue replaces the nodes rather than animating between two random layouts —
 * interpolating between arbitrary band positions looks like a smooth slide,
 * which is the opposite of what a dropped signal does.
 */
function reroll() {
  seed += 1
  const next: Band[] = []
  for (let i = 0; i < BAND_COUNT; i += 1) {
    const roll = Math.random()
    next.push({
      id: seed * 100 + i,
      top: Math.random() * 100,
      height: 0.6 + Math.random() * 5,
      shift: (Math.random() < 0.5 ? -1 : 1) * (10 + Math.random() * 90),
      hue: roll < 0.28 ? 'cyan' : roll < 0.5 ? 'magenta' : 'plain',
    })
  }
  bands.value = next
}

watch(
  () => props.active,
  (on) => {
    if (on) reroll()
  },
)

const style = computed(() => ({
  // Bands slide further when the burst is a hard one.
  '--px-scale': props.intensity.toFixed(2),
}))
</script>

<template>
  <div class="px-glitch" :class="{ 'is-on': active }" :style="style" aria-hidden="true">
    <!-- 1. Horizontal tear bands. -->
    <span
      v-for="band in bands"
      :key="band.id"
      class="px-glitch__band"
      :class="`is-${band.hue}`"
      :style="{
        top: `${band.top}%`,
        height: `${band.height}%`,
        '--px-band-shift': `${band.shift}px`,
      }"
    />

    <!-- 2. Block dropout: two solid rectangles, placed on a coarse grid so they
         read as corrupt tiles rather than as stray divs. -->
    <span
      v-if="active"
      class="px-glitch__block px-glitch__block--a"
      :style="{ '--px-block-shift': `${-40 * intensity}px` }"
    />
    <span
      v-if="active"
      class="px-glitch__block px-glitch__block--b"
      :style="{ '--px-block-shift': `${55 * intensity}px` }"
    />

    <!-- 3. Tracking sweep. -->
    <span v-if="active" class="px-glitch__sweep" />
  </div>
</template>

<style scoped>
.px-glitch {
  position: fixed;
  inset: 0;
  /* Above the content (which sits in normal flow) but below the CRT overlay and
     the intro cinematic. */
  z-index: 80;
  pointer-events: none;
  opacity: 0;
  /* A hard on/off, never a fade: fading a glitch in makes it read as a
     transition rather than as a fault. */
  transition: opacity 0.06s steps(1, end);
}

.px-glitch.is-on {
  opacity: 1;
}

.px-glitch__band {
  position: absolute;
  left: 0;
  right: 0;
  animation: px-band-slip 0.32s steps(4, end) both;
  will-change: transform;
}

/* `difference` inverts whatever it crosses, so a band stays visible over both
   the pale daylight painting and the dark night one — a solid colour would
   vanish against one of the two. */
.px-glitch__band.is-plain {
  background: rgb(255 255 255 / 0.9);
  mix-blend-mode: difference;
}

.px-glitch__band.is-cyan {
  background: rgb(53 224 216 / 0.55);
  mix-blend-mode: screen;
}

.px-glitch__band.is-magenta {
  background: rgb(255 61 129 / 0.5);
  mix-blend-mode: screen;
}

@keyframes px-band-slip {
  0% {
    transform: translate3d(calc(var(--px-band-shift) * 0.2), 0, 0);
  }
  50% {
    transform: translate3d(var(--px-band-shift), 0, 0);
  }
  100% {
    transform: translate3d(calc(var(--px-band-shift) * -0.3), 0, 0);
    opacity: 0;
  }
}

.px-glitch__block {
  position: absolute;
  width: clamp(60px, 12vw, 210px);
  height: clamp(8px, 2.2vw, 30px);
  mix-blend-mode: difference;
  background: rgb(255 255 255 / 0.82);
  animation: px-block-jump 0.3s steps(3, end) both;
}

.px-glitch__block--a {
  top: 22%;
  left: 6%;
}

.px-glitch__block--b {
  top: 71%;
  right: 11%;
  background: rgb(53 224 216 / 0.75);
}

@keyframes px-block-jump {
  0% {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
  40% {
    transform: translate3d(var(--px-block-shift), 5px, 0);
  }
  100% {
    transform: translate3d(calc(var(--px-block-shift) * 1.4), -4px, 0);
    opacity: 0;
  }
}

/* Travels the full height once per burst. */
.px-glitch__sweep {
  position: absolute;
  left: 0;
  right: 0;
  height: 14vh;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgb(255 255 255 / 0.06) 35%,
    rgb(255 255 255 / 0.22) 50%,
    rgb(255 255 255 / 0.06) 65%,
    transparent 100%
  );
  mix-blend-mode: screen;
  animation: px-sweep 0.52s steps(7, end) both;
}

@keyframes px-sweep {
  from {
    top: -16vh;
  }
  to {
    top: 100vh;
  }
}

@media (prefers-reduced-motion: reduce) {
  .px-glitch {
    display: none;
  }
}
</style>
