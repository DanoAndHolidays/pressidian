<script setup lang="ts">
import { computed } from 'vue'
import AppHeader from '@/components/shell/AppHeader.vue'
import AppFooter from '@/components/shell/AppFooter.vue'
import CommandPalette from '@/components/shell/CommandPalette.vue'
import BootSequence from '@/components/boot/BootSequence.vue'
import { useScrollLock } from '@/composables/useInteractions'
import { useBootSequence } from '@/composables/useBootSequence'

const boot = useBootSequence()
const immersive = computed(() => boot.phase.value !== 'done')
useScrollLock(immersive)
function focusMain() {
  document.getElementById('main-content')?.focus()
}
</script>

<template>
  <div class="garden-app" :inert="immersive || undefined">
    <a href="#main-content" class="skip-link" @click.prevent="focusMain">跳到主要内容</a>
    <AppHeader />
    <main id="main-content" class="garden-main" tabindex="-1">
      <RouterView v-slot="{ Component, route }">
        <Transition name="page" mode="out-in">
          <component :is="Component" :key="route.path" />
        </Transition>
      </RouterView>
    </main>
    <AppFooter />
    <CommandPalette />
  </div>
  <BootSequence v-if="immersive" />
</template>

<style scoped>
.garden-app { min-height: 100svh; background: var(--canvas); }
.garden-main { min-height: 80svh; padding-top: 88px; }
.skip-link { position: fixed; top: 12px; left: 20px; z-index: 110; padding: 10px 20px; background: var(--paper); border: 1px solid var(--line); border-radius: 8px; transform: translateY(-160%); }
.skip-link:focus { transform: none; }
@media (max-width: 640px) { .garden-main { padding-top: 72px; } }
</style>
