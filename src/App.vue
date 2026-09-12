<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '@/components/shell/AppHeader.vue'
import AppFooter from '@/components/shell/AppFooter.vue'
import CommandPalette from '@/components/shell/CommandPalette.vue'
import CursorGlow from '@/components/shell/CursorGlow.vue'
import SceneStage from '@/components/scene/SceneStage.vue'
import GlitchLayer from '@/components/scene/GlitchLayer.vue'
import BootSequence from '@/components/boot/BootSequence.vue'
import { useBootSequence } from '@/composables/useBootSequence'
import { useGlitch } from '@/composables/useGlitch'

/**
 * Shell.
 *
 * Layout note: the scene stage and the glitch layer are siblings *of* the app
 * div, not children of a page, because the stage has to outlive the route — the
 * intro curtain opens onto the same continuous painting that the homepage then
 * keeps cycling. Both are `position: fixed`, so they cost nothing in flow.
 *
 * The chrome (header, footer, palette, cursor) is hidden with `inert` rather
 * than unmounted during the intro. Unmounting would make the header re-mount
 * and re-run its scroll listeners at the exact moment of the reveal, which
 * shows up as a flicker on the first frame the reader is actually looking at.
 */
const route = useRoute()
const boot = useBootSequence()

const introDone = ref(boot.phase.value === 'done')

/**
 * The stage runs during the intro as well as on the homepage. During the
 * intro it is the painting *behind* the curtain: the boot overlay paints the
 * same scene split in two, and handing over to this stage is what makes the
 * opening halves look like they slid off one continuous image rather than
 * revealing a second, separate one.
 */
const sceneActive = computed(
  () => !introDone.value || route.name === 'home',
)

/**
 * Glitch bursts run page-wide, but never during the intro — a fault in the
 * middle of a deliberate cinematic reads as the site breaking, not as styling.
 */
const glitch = useGlitch({
  enabled: () => introDone.value,
  minGap: 2400,
  maxGap: 7600,
})

/** True while the intro overlay owns the viewport. */
const immersive = computed(() => boot.phase.value !== 'done')

// A repeat visit inside the same tab never mounts the overlay, so the phase is
// already `done`; this keeps the flag in sync if it settles later.
watch(
  () => boot.phase.value,
  (phase) => {
    if (phase === 'done') introDone.value = true
  },
)
</script>

<template>
  <!-- The painting. Fixed, behind everything, cycling day -> night -> day. -->
  <SceneStage :active="sceneActive" />

  <!-- Signal corruption. Above content, below the intro. -->
  <GlitchLayer :active="glitch.active.value" :intensity="glitch.intensity.value" />

  <div class="px-app" :inert="immersive || undefined">
    <!--
      Opaque field for every route that is not the homepage. The homepage wants
      the painting to read straight through the layout, so it gets no layer at
      all; the notes reader and the rest are paper UIs that would be unreadable
      over a night sky.
    -->
    <div v-if="route.name !== 'home'" class="px-app__canvas" aria-hidden="true" />

    <CursorGlow />
    <AppHeader />

    <main class="px-app__main" :class="{ 'is-home': route.name === 'home' }">
      <RouterView v-slot="{ Component, route: current }">
        <Transition name="page" mode="out-in">
          <component :is="Component" :key="current.path" />
        </Transition>
      </RouterView>
    </main>

    <AppFooter />
    <CommandPalette />
  </div>

  <!--
    The curtain. Mounted only while the intro is running, so a repeat visit
    inside the same tab pays nothing for it.
  -->
  <BootSequence v-if="immersive" @finished="introDone = true" />
</template>

<style scoped>
.px-app {
  position: relative;
  z-index: 10;
  min-height: 100svh;
}

/* Fixed so it covers the viewport regardless of how tall the page gets. It sits
   *inside* `.px-app` (z-index 10), so it lands above the stage and below all
   content. */
.px-app__canvas {
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background-color: var(--canvas);
  background-image: radial-gradient(
    120% 80% at 50% -20%,
    color-mix(in oklab, var(--ember) 7%, transparent),
    transparent 60%
  );
}

.px-app__main {
  position: relative;
  min-height: 100svh;
  padding-top: 68px;
}

/* The homepage hero runs full-bleed under the header, so it does not want the
   header's height reserved above it. */
.px-app__main.is-home {
  padding-top: 0;
}
</style>
