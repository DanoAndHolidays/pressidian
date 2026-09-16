<script setup lang="ts">
import BendCard from './BendCard.vue'
import { BEND_CARD_ARTWORK } from './artwork'
import { STATUS_META } from '@/data/site'

/**
 * Three fold cards on the lab page, using the same plates the homepage maturity
 * row uses. The mechanic is the exhibit, so the copy stays out of the way.
 */
const demo = (Object.keys(STATUS_META) as Array<keyof typeof STATUS_META>).map((key) => ({
  key,
  ...STATUS_META[key],
  image: BEND_CARD_ARTWORK[key],
}))
</script>

<template>
  <div v-reveal>
    <div class="grid justify-items-center gap-5 sm:grid-cols-3">
      <BendCard
        v-for="item in demo"
        :key="item.key"
        :image="item.image"
        :title="item.label"
        :small="item.hint"
        :tone="item.tone"
        class="w-full"
        :style="{ '--bc-w': '18.5rem', '--bc-h': '18.5rem', '--bc-h-open': '24rem' }"
      >
        <span class="block font-mono text-[0.7rem] tracking-[0.12em] uppercase" :style="{ color: `var(--${item.tone})` }">
          {{ item.key }}
        </span>
        <span class="mt-2 block">悬停时只有卡片高度在动</span>
        <span class="block">照片与文字都留在原位</span>
        <span class="block">展开是「露出」而不是「推开」</span>
      </BendCard>
    </div>

    <p class="mt-6 text-center font-mono text-[0.7rem] tracking-[0.12em] text-faint uppercase">
      hover a tile to unfold it
    </p>
  </div>
</template>
