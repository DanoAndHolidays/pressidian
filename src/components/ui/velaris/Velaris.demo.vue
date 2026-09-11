<script setup lang="ts">
/**
 * Velaris usage reference.
 *
 * Not routed anywhere — it documents the props next to the component. The real
 * usages swap `colors` per page: the homepage hero, the About hero and the lab
 * teaser each pass a different palette into the same shader.
 */
import Velaris from './Velaris.vue'

const HERO_COLORS = ['#f0642f', '#b84924', '#7a2f16', '#1b1d17']
</script>

<template>
  <Velaris :colors="HERO_COLORS" bg="#15170f" :speed="1.25" :grain="0.34" height="500px" class="rounded-2xl">
    <div class="flex h-full w-full flex-col items-center justify-center gap-4 px-6 text-center">
      <span
        class="rounded-full border border-white/20 bg-white/10 px-4 py-1 font-mono text-xs tracking-[0.14em] text-white/80 uppercase backdrop-blur"
      >
        Powered by WebGL
      </span>
      <h1 class="max-w-2xl font-serif text-4xl font-medium tracking-tight text-white sm:text-6xl">
        会呼吸的橙色星云
      </h1>
      <p class="max-w-md text-sm text-white/70 sm:text-base">
        三层 Simplex 噪声叠加出色块，再压上暗角与胶片颗粒。离屏或切到后台时渲染循环会自动暂停。
      </p>
    </div>
  </Velaris>
</template>
