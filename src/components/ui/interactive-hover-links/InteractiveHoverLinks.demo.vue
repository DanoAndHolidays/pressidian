<script setup lang="ts">
import InteractiveHoverLinks from './InteractiveHoverLinks.vue'
import { NAV_HOVER_LINKS } from '@/data/site'
</script>

<template>
  <section class="bg-canvas px-6 py-12 md:px-8 md:py-16">
    <InteractiveHoverLinks :links="NAV_HOVER_LINKS" />
  </section>
</template>
