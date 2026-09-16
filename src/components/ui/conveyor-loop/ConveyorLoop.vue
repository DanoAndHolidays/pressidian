<script setup lang="ts">
/**
 * ConveyorLoop — a block-glyph loader that scrolls through a dotted track.
 *
 * Ported to Vue from the supplied React original. Three glyphs (█ ▓ ▒, heaviest
 * first) each travel `1ch → width + 1ch` on the same linear timing, staggered by
 * `delay`, so the lightest trail rides ahead of the heaviest head and the group
 * reads as a short conveyor rather than three separate dots.
 *
 * Each glyph carries a background matching `mask-color`. That block hides the
 * track beneath it, which is what makes a glyph appear to *fill* a track cell
 * instead of being drawn over it, and what erases the trail left behind.
 * `mask-color` must therefore match the surface the loader is sitting on.
 */
import { computed } from 'vue'
import { cn } from '@/lib/utils'

const CONVEYOR_LOOP_BLOCKS = ['█', '▓', '▒'] as const

const props = withDefaults(
  defineProps<{
    /** Glyphs to cycle, heaviest first. Extra entries beyond the defaults are ignored. */
    blocks?: readonly string[]
    /** Character the empty track is drawn from. */
    track?: string
    /** Track width in characters. */
    trackLength?: number
    /** Accessible label for the status element. */
    label?: string
    /** Per-glyph stagger in seconds. */
    delay?: number
    /** Full traverse time in seconds. */
    duration?: number
    class?: string
  }>(),
  {
    // Inlined rather than referencing CONVEYOR_LOOP_BLOCKS: defineProps defaults
    // are hoisted out of setup(), so they cannot close over a local binding.
    blocks: () => ['█', '▓', '▒'],
    track: '░',
    trackLength: 10,
    label: 'Loading',
    delay: 0.05,
    duration: 1.8,
    class: undefined,
  },
)

const columns = computed(() => Math.max(2, Math.floor(props.trackLength)))
const glyphs = computed(() =>
  CONVEYOR_LOOP_BLOCKS.map((fallback, index) => props.blocks[index] ?? fallback),
)
const track = computed(() => props.track.repeat(columns.value))

const style = computed(() => ({
  '--loader-columns': `${columns.value}`,
  '--loader-width': `${columns.value}ch`,
  '--loader-duration': `${props.duration}s`,
  '--loader-delay': `${props.delay}s`,
}))
</script>

<template>
  <span
    role="status"
    :aria-label="label"
    :class="cn('conveyor-loop', props.class)"
    :style="style"
  >
    <span aria-hidden="true" class="conveyor-loop__track">{{ track }}</span>
    <span
      v-for="(glyph, index) in glyphs"
      :key="`${glyph}-${index}`"
      aria-hidden="true"
      class="conveyor-loop__block"
      :style="{ zIndex: 30 - index * 10, animationDelay: `calc(var(--loader-delay) * ${index})` }"
      >{{ glyph }}</span
    >
  </span>
</template>

<style scoped>
.conveyor-loop {
  position: relative;
  display: inline-flex;
  width: var(--loader-width);
  height: 1em;
  align-items: center;
  overflow: hidden;
  font-family: var(--font-mono, ui-monospace, monospace);
  line-height: 1;
  user-select: none;
}
.conveyor-loop__track {
  position: absolute;
  inset: 0;
  overflow: hidden;
  white-space: nowrap;
  pointer-events: none;
}
.conveyor-loop__block {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  width: 1ch;
  height: 100%;
  align-items: center;
  justify-content: center;
  text-align: center;
  pointer-events: none;
  /* Must match the surface behind the loader, so the block masks the track. */
  background: var(--loader-surface);
  animation: conveyor-loop-travel var(--loader-duration) linear infinite;
}
@keyframes conveyor-loop-travel {
  0% {
    transform: translateX(-1ch);
  }
  100% {
    transform: translateX(calc(var(--loader-columns) * 1ch + 1ch));
  }
}
@media (prefers-reduced-motion: reduce) {
  /*
   * Without travel the blocks would pile up on the first cell, so drop them and
   * leave the static track, which still reads as a loader.
   */
  .conveyor-loop__block { display: none; }
}
</style>
