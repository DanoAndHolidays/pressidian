<script setup lang="ts">
/**
 * A soft ember light that follows the pointer across the paper. It is the one
 * piece of "ambient" motion applied globally; it is skipped entirely on touch
 * devices and for reduced-motion visitors.
 */
import { onBeforeUnmount, onMounted, ref } from 'vue'

const enabled = ref(false)
const x = ref(0)
const y = ref(0)
let raf: number | null = null
let targetX = 0
let targetY = 0

/** Runs while the glow is still catching up, then parks itself. */
function tick() {
  x.value += (targetX - x.value) * 0.14
  y.value += (targetY - y.value) * 0.14
  const settled = Math.abs(targetX - x.value) < 0.6 && Math.abs(targetY - y.value) < 0.6
  if (settled) {
    raf = null
    return
  }
  raf = requestAnimationFrame(tick)
}

const onPointerMove = (event: PointerEvent) => {
  targetX = event.clientX
  targetY = event.clientY
  raf ??= requestAnimationFrame(tick)
}

onMounted(() => {
  const fine =
    window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!fine) return
  enabled.value = true
  x.value = window.innerWidth * 0.5
  y.value = window.innerHeight * 0.25
  targetX = x.value
  targetY = y.value
  window.addEventListener('pointermove', onPointerMove, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', onPointerMove)
  if (raf != null) cancelAnimationFrame(raf)
})
</script>

<template>
  <div
    v-if="enabled"
    class="pointer-events-none fixed z-0 hidden size-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.55] blur-3xl lg:block"
    :style="{
      left: `${x}px`,
      top: `${y}px`,
      background:
        'radial-gradient(circle, color-mix(in oklab, var(--ember) 16%, transparent) 0%, transparent 62%)',
    }"
    aria-hidden="true"
  />
</template>
