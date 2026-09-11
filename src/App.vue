<script setup lang="ts">
import AppHeader from '@/components/shell/AppHeader.vue'
import AppFooter from '@/components/shell/AppFooter.vue'
import CommandPalette from '@/components/shell/CommandPalette.vue'
import CursorGlow from '@/components/shell/CursorGlow.vue'
</script>

<template>
  <CursorGlow />
  <AppHeader />

  <main class="relative min-h-screen pt-[68px]">
    <RouterView v-slot="{ Component, route }">
      <Transition name="page" mode="out-in">
        <component :is="Component" :key="route.path" />
      </Transition>
    </RouterView>
  </main>

  <AppFooter />
  <CommandPalette />
</template>
