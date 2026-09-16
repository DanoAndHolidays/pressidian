<script setup lang="ts">
import AppHeader from '@/components/shell/AppHeader.vue'
import AppFooter from '@/components/shell/AppFooter.vue'
import CommandPalette from '@/components/shell/CommandPalette.vue'
</script>

<template>
  <AppHeader />

  <main class="relative min-h-screen pt-[76px]">
    <RouterView v-slot="{ Component, route }">
      <Transition name="page" mode="out-in">
        <component :is="Component" :key="route.path" />
      </Transition>
    </RouterView>
  </main>

  <AppFooter />
  <CommandPalette />
</template>
