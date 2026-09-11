<script setup lang="ts">
/**
 * The garden's fox. Drawn as inline SVG so it inherits `currentColor` and can
 * animate — the eyes blink and the tail sways while the mark is on screen.
 */
withDefaults(
  defineProps<{
    /** Rendered size in pixels. */
    size?: number
    /** `mark` is the compact logo, `portrait` the full illustrated head. */
    variant?: 'mark' | 'portrait'
    /** Animate the blink / sway. Automatically disabled for reduced motion. */
    animated?: boolean
    class?: string
  }>(),
  { size: 32, variant: 'mark', animated: true, class: undefined },
)
</script>

<template>
  <svg
    v-if="variant === 'mark'"
    :width="size"
    :height="size"
    viewBox="0 0 48 48"
    role="img"
    aria-label="Pressidian 狐狸标记"
    :class="['shrink-0', animated && 'fox-blink', $props.class]"
  >
    <path
      d="m8 11 10 7h12l10-7-3 19-13 10L11 30 8 11Z"
      fill="var(--ember)"
      stroke="var(--ember-deep)"
      stroke-width="1.1"
      stroke-linejoin="round"
    />
    <path d="m16 25 8 4 8-4-3 9-5 4-5-4-3-9Z" fill="var(--paper)" />
    <g fill="var(--ink)" class="fox-eyes">
      <rect x="16" y="23.5" width="4.4" height="3.2" rx="1" />
      <rect x="27.6" y="23.5" width="4.4" height="3.2" rx="1" />
    </g>
    <rect x="22" y="31" width="4" height="3" rx="1.2" fill="var(--ink)" />
  </svg>

  <svg
    v-else
    :width="size"
    :height="size"
    viewBox="0 0 130 130"
    role="img"
    aria-label="Dano 的狐狸向导"
    :class="['shrink-0', animated && 'fox-sway', $props.class]"
  >
    <path
      d="m17 23 29 20h38l29-20-8 64-40 30-40-30-8-64Z"
      fill="var(--ember)"
      stroke="var(--ember-deep)"
      stroke-width="1.4"
      stroke-linejoin="round"
    />
    <path d="m34 66 31 17 31-17-11 33-20 15-20-15-11-33Z" fill="var(--paper)" />
    <g fill="var(--ink)" class="fox-eyes">
      <rect x="39" y="60" width="13" height="8" rx="3" />
      <rect x="78" y="60" width="13" height="8" rx="3" />
    </g>
    <rect x="59" y="86" width="12" height="8" rx="3.4" fill="var(--ink)" />
  </svg>
</template>

<style scoped>
.fox-eyes {
  transform-origin: center;
  animation: fox-blink 6.4s steps(1, end) infinite;
}

@keyframes fox-blink {
  0%,
  92%,
  100% {
    transform: scaleY(1);
  }
  94%,
  96% {
    transform: scaleY(0.12);
  }
}

.fox-sway {
  animation: fox-sway 7s ease-in-out infinite;
}

@keyframes fox-sway {
  0%,
  100% {
    transform: rotate(-1.6deg) translateY(0);
  }
  50% {
    transform: rotate(1.6deg) translateY(-3px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .fox-eyes,
  .fox-sway {
    animation: none;
  }
}
</style>
