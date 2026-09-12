<script setup lang="ts">
import { useRoute } from 'vue-router'
import InteractiveHoverLink from './InteractiveHoverLink.vue'
import type { InteractiveHoverLink as LinkItem } from './types'

defineProps<{ links: readonly LinkItem[] }>()
const emit = defineEmits<{ navigate: [] }>()
const route = useRoute()

const isActive = (href: string) =>
  route.path === href || (href !== '/' && route.path.startsWith(`${href}/`))
</script>

<template>
  <nav class="interactive-hover-links" aria-label="主导航">
    <InteractiveHoverLink
      v-for="(link, index) in links"
      :key="link.href"
      :link="link"
      :index="index"
      :active="isActive(link.href)"
      @navigate="emit('navigate')"
    />
  </nav>
</template>

<style scoped>
.interactive-hover-links {
  width: 100%;
  max-width: 64rem;
  margin-inline: auto;
}
</style>
