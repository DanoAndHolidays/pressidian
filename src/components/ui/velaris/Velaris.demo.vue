<script setup lang="ts">
/**
 * Velaris usage reference.
 *
 * Not routed anywhere — it documents the props next to the component. Pass
 * `bg` and `colors` as `[light, dark]` pairs and the backdrop follows the
 * active theme; pass single values (or set `:themed="false"`) when the surface
 * behind the canvas is deliberately dark.
 */
import Velaris from './Velaris.vue'

const HERO_BG: [string, string] = ['#fdf6ec', '#15170f']
const HERO_COLORS: [string[], string[]] = [
  ['#ffc59b', '#f79a63', '#e07a45', '#fdf6ec'],
  ['#f0642f', '#b84924', '#7a2f16', '#1b1d17'],
]
</script>

<template>
  <Velaris
    :colors="HERO_COLORS"
    :bg="HERO_BG"
    :speed="1.25"
    :grain="0.34"
    height="500px"
    class="rounded-2xl"
  >
    <div class="flex h-full w-full flex-col items-center justify-center gap-4 px-6 text-center">
      <span
        class="rounded-full border border-hero-line bg-hero-surface px-4 py-1 font-mono text-xs tracking-[0.14em] text-hero-muted uppercase backdrop-blur"
      >
        Powered by WebGL
      </span>
      <h1 class="max-w-2xl font-serif text-4xl font-medium tracking-tight text-hero-fg sm:text-6xl">
        会呼吸的橙色星云
      </h1>
      <p class="max-w-md text-sm text-hero-muted sm:text-base">
        三层 Simplex 噪声叠加出色块，再压上暗角与胶片颗粒。切换主题时只换 uniform，渲染循环不重启。
      </p>
    </div>
  </Velaris>
</template>
