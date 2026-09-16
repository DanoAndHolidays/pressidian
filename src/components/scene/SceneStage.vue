<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { SCENES } from '@/data/scenes'
import { useSceneStore } from '@/stores/scene'

/**
 * The painting layer.
 *
 * Fixed behind the whole app rather than scoped to the homepage, because the
 * intro cinematic and the homepage must share one continuous backdrop: if the
 * stage lived inside `HomePage.vue`, the curtain would reveal a repaint instead
 * of a continuation.
 *
 * `active` is what keeps it honest. Only the homepage and the intro turn it on;
 * everywhere else the stage parks, so the notes reader never pays for a
 * repainting background or a running cycle timer.
 */
const props = withDefaults(defineProps<{ active?: boolean }>(), { active: false })

const scene = useSceneStore()

/** Parallax: pointer position as a -1..1 pair, damped to a few pixels of drift. */
const pointer = ref({ x: 0, y: 0 })
let frame = 0

function onPointerMove(event: PointerEvent) {
  if (frame) return
  frame = requestAnimationFrame(() => {
    frame = 0
    pointer.value = {
      x: (event.clientX / window.innerWidth) * 2 - 1,
      y: (event.clientY / window.innerHeight) * 2 - 1,
    }
  })
}

// Touch devices have no hover to track, and the listener is cheap to skip.
const canHover = typeof matchMedia === 'function' ? matchMedia('(hover: hover)').matches : false

function bindPointer(on: boolean) {
  if (!canHover) return
  if (on) window.addEventListener('pointermove', onPointerMove, { passive: true })
  else window.removeEventListener('pointermove', onPointerMove)
}

/**
 * The cycle belongs to the homepage, so it starts and stops with `active`. The
 * stage itself stays mounted for the app's whole life.
 */
watch(
  () => props.active,
  (on) => {
    if (on) scene.start()
    else scene.stop()
    bindPointer(on)
  },
  { immediate: true },
)

/**
 * A background animation that keeps running in a hidden tab burns battery for
 * nobody's benefit, and `setInterval` throttling in background tabs makes the
 * swap fire at unpredictable moments on return.
 */
function onVisibility() {
  if (!props.active) return
  if (document.hidden) scene.stop()
  else scene.start()
}

onMounted(() => document.addEventListener('visibilitychange', onVisibility))

onBeforeUnmount(() => {
  if (frame) cancelAnimationFrame(frame)
  document.removeEventListener('visibilitychange', onVisibility)
  bindPointer(false)
})

/**
 * Two stacked paintings, only one visible. Layering rather than swapping a
 * single `<img src>` means the incoming frame is already decoded and painted
 * when the corruption covers the change.
 */
const layers = computed(() => [
  { key: 'day' as const, scene: SCENES.day, on: scene.current === 'day' },
  { key: 'night' as const, scene: SCENES.night, on: scene.current === 'night' },
])

const driftStyle = computed(() => ({
  '--px-px': pointer.value.x.toFixed(3),
  '--px-py': pointer.value.y.toFixed(3),
}))

/**
 * The environment palette is a set of custom properties keyed off
 * `:root[data-scene]`, so the attribute has to sit on `<html>` — setting it on
 * this element would scope the variables to the stage and leave every panel
 * outside it on the default palette.
 *
 * It is cleared on unmount, so the notes and prose routes fall back to the
 * neutral defaults rather than inheriting a scene that is no longer painted.
 */
watch(
  () => scene.current,
  (name) => document.documentElement.setAttribute('data-scene', name),
  { immediate: true },
)

/**
 * Clearing the attribute on unmount drops the chrome back to the neutral `:root`
 * palette, so the notes routes do not inherit a scene that is no longer
 * painted. `--canvas` comes back with it; `body` no longer carries a background
 * of its own (see `pixel.css`), so nothing here needs to restore one.
 */
onBeforeUnmount(() => document.documentElement.removeAttribute('data-scene'))
</script>

<template>
  <div
    class="px-stage"
    :class="{ 'is-bursting': scene.bursting }"
    :style="driftStyle"
    aria-hidden="true"
  >
    <div class="px-stage__drift">
      <div
        v-for="layer in layers"
        :key="layer.key"
        class="px-scene"
        :class="{ 'is-on': layer.on }"
        :data-layer="layer.key"
      >
        <picture>
          <source :srcset="layer.scene.avif" sizes="100vw" type="image/avif" />
          <source :srcset="layer.scene.webp" sizes="100vw" type="image/webp" />
          <img
            :key="`${layer.key}-${scene.generation}`"
            :src="layer.scene.poster"
            :srcset="layer.scene.webp"
            sizes="100vw"
            alt=""
            decoding="async"
            :loading="layer.on ? 'eager' : 'lazy'"
            :fetchpriority="layer.on ? 'high' : 'low'"
            class="px-scene__img"
          />
        </picture>
        <!-- Two torn slices of the same painting. When a burst lands they slide
             in opposite directions, which is what a dropped scanline looks
             like. Always present so nothing has to mount mid-animation. -->
        <div
          class="px-scene__tear px-scene__tear--a"
          :style="{ backgroundImage: `url(${layer.scene.poster})` }"
        />
        <div
          class="px-scene__tear px-scene__tear--b"
          :style="{ backgroundImage: `url(${layer.scene.poster})` }"
        />
      </div>
    </div>

    <!-- Corruption texture thrown over the swap. -->
    <div class="px-burst">
      <img :src="SCENES.dayGlitch.poster" alt="" decoding="async" loading="lazy" class="px-burst__img" />
      <span class="px-burst__bands" />
    </div>

    <div class="px-scrim" />
    <div class="px-stage__scan" />
    <div class="px-stage__vignette" />
  </div>
</template>

<style scoped>
.px-stage {
  position: fixed;
  inset: 0;
  z-index: var(--px-z-stage);
  overflow: hidden;
  background: var(--px-bg);
  pointer-events: none;
}

/* Oversized so the parallax drift never exposes an edge. */
.px-stage__drift {
  position: absolute;
  inset: -2.5%;
  transform: translate3d(calc(var(--px-px, 0) * 10px), calc(var(--px-py, 0) * 8px), 0);
  transition: transform 1.1s var(--ease-out-quint);
  will-change: transform;
}

.px-scene {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.7s steps(6, end);
}

.px-scene.is-on {
  opacity: 1;
}

.px-scene__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 50% 42%;
  /* The paintings are soft; pushing contrast makes the banding in the haze read
     as deliberate rather than as a bad photo. */
  filter: contrast(1.16) saturate(1.24) brightness(0.98);
}

.px-scene__tear {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: 50% 42%;
  opacity: 0;
  filter: contrast(1.16) saturate(1.3) brightness(1.04);
  transition: opacity 0.1s linear;
  will-change: transform;
}

.is-bursting .px-scene__tear {
  opacity: 0.92;
}

/* A band roughly a third down, and a wider one across the lower half. The
   asymmetric placement is what stops it reading as a symmetric wipe. */
.px-scene__tear--a {
  clip-path: polygon(0 26%, 100% 24%, 100% 37%, 0 39%);
}

.px-scene__tear--b {
  clip-path: polygon(0 58%, 100% 56%, 100% 74%, 0 76%);
}

.is-bursting .px-scene__tear--a {
  transform: translate3d(calc(var(--px-glitch-intensity, 1) * -16px), 0, 0);
}

.is-bursting .px-scene__tear--b {
  transform: translate3d(calc(var(--px-glitch-intensity, 1) * 22px), 0, 0);
}

/* ---- corruption overlay ------------------------------------------------ */
.px-burst {
  position: absolute;
  inset: 0;
  opacity: 0;
  mix-blend-mode: screen;
  transition: opacity 0.12s steps(2, end);
}

.px-burst__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 50% 42%;
  filter: contrast(1.35) saturate(1.5) hue-rotate(-8deg);
}

/* Horizontal noise bands: a hard-stop gradient tile, not an image. */
.px-burst__bands {
  position: absolute;
  inset: 0;
  background-image: repeating-linear-gradient(
    180deg,
    rgb(255 255 255 / 0.14) 0 2px,
    transparent 2px 7px,
    rgb(53 224 216 / 0.16) 7px 9px,
    transparent 9px 23px,
    rgb(255 61 129 / 0.14) 23px 25px,
    transparent 25px 41px
  );
  mix-blend-mode: overlay;
}

.px-stage.is-bursting .px-burst {
  opacity: 0.8;
  animation: px-glitch-shift 0.26s steps(3, end) 3;
}

/* ---- environment ------------------------------------------------------- */
.px-stage__scan {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(180deg, rgb(0 0 0 / 0.22) 0 1px, transparent 1px 3px);
  opacity: 0.5;
}

.px-stage__vignette {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(120% 90% at 50% 45%, transparent 42%, rgb(0 0 0 / 0.55) 100%),
    linear-gradient(180deg, rgb(0 0 0 / 0.42) 0%, transparent 22%);
}

@media (prefers-reduced-motion: reduce) {
  .px-stage__drift {
    transform: none;
  }
  .px-scene {
    transition: none;
  }
  .is-bursting .px-scene__tear {
    opacity: 0;
  }
  .px-stage.is-bursting .px-burst {
    animation: none;
    opacity: 0;
  }
}
</style>
