<script setup lang="ts">
import FoxMark from '@/components/shell/FoxMark.vue'
import { NAV_ITEMS } from '@/data/site'
</script>

<template>
  <div class="shell flex min-h-[70svh] flex-col items-center justify-center py-24 text-center">
    <FoxMark :size="76" variant="portrait" />

    <p class="eyebrow mt-8">Error 404</p>
    <h1 class="mt-4 font-serif text-[clamp(2.2rem,6vw,4rem)] leading-[1.05] tracking-[-0.05em]">
      狐狸在这条路径上<br />没闻到任何气味。
    </h1>
    <p class="mt-5 max-w-md text-[0.9rem] leading-relaxed text-muted">
      这个地址可能对应的笔记还没同步过来，或者已经被移走了。顺着下面的入口回到有内容的地方。
    </p>

    <div class="mt-9 flex flex-wrap justify-center gap-2.5">
      <RouterLink
        v-for="item in NAV_ITEMS"
        :key="item.key"
        :to="item.to"
        class="rounded-full border border-line bg-paper px-4 py-2.5 text-[0.8rem] transition-all duration-500 hover:-translate-y-0.5 hover:border-ember/50 hover:text-ember"
      >
        {{ item.label }}
      </RouterLink>
    </div>
  </div>
</template>
