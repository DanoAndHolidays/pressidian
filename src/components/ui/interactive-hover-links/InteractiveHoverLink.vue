<script setup lang="ts">
import { ref } from 'vue'
import { ArrowRight } from 'lucide-vue-next'
import { useMediaQuery, useReducedMotion } from '@/composables/useMediaQuery'
import type { InteractiveHoverLink } from './types'

defineProps<{ link: InteractiveHoverLink; index: number; active?: boolean }>()
const emit = defineEmits<{ navigate: [] }>()
const canHover = useMediaQuery('(hover: hover) and (pointer: fine)')
const reducedMotion = useReducedMotion()
const imageFailed = ref(false)

const onPointerMove = (event: PointerEvent) => {
  if (!canHover.value || reducedMotion.value || event.pointerType === 'touch') return
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  if (!rect.width || !rect.height) return
  // Match the reference's 40–60% travel, with vertical movement inverted.
  target.style.setProperty('--preview-left', `${40 + ((event.clientX - rect.left) / rect.width) * 20}%`)
  target.style.setProperty('--preview-top', `${60 - ((event.clientY - rect.top) / rect.height) * 20}%`)
}

const resetPointer = (event: PointerEvent) => {
  const target = event.currentTarget as HTMLElement
  target.style.removeProperty('--preview-left')
  target.style.removeProperty('--preview-top')
}

const onClick = (event: MouseEvent) => {
  // Preserve standard modified-click / new-tab navigation.
  if (!event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey && event.button === 0) {
    emit('navigate')
  }
}
</script>

<template>
  <RouterLink
    :to="link.href"
    class="hover-link focus-ring"
    :class="{ 'is-active': active }"
    :aria-current="active ? 'page' : undefined"
    @pointermove="onPointerMove"
    @pointerleave="resetPointer"
    @click="onClick"
  >
    <span class="link-number" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
    <span class="link-copy">
      <span class="link-heading">
        <span class="sr-only">{{ link.heading }}</span>
        <span
          v-for="(letter, letterIndex) in Array.from(link.heading)"
          :key="letterIndex"
          class="link-letter"
          :style="{ '--letter-delay': `${letterIndex * 55}ms` }"
          aria-hidden="true"
        >{{ letter === ' ' ? '\u00a0' : letter }}</span>
      </span>
      <span class="link-subheading">{{ link.subheading }}</span>
    </span>

    <span v-if="!imageFailed" class="link-preview" aria-hidden="true">
      <img :src="link.imgSrc" alt="" width="512" height="384" decoding="async" @error="imageFailed = true" />
    </span>

    <span class="link-arrow-window" aria-hidden="true">
      <ArrowRight class="link-arrow" :stroke-width="1.5" />
    </span>
  </RouterLink>
</template>

<style scoped>
.hover-link {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  min-height: 8.25rem;
  padding-block: 1.5rem;
  border-bottom: 2px solid var(--line);
  color: var(--muted);
  text-decoration: none;
  isolation: isolate;
  transition: border-color 0.5s ease, color 0.5s ease;
}
.hover-link:focus-visible {
  z-index: 2;
  border-color: var(--ink);
  color: var(--ink);
}
.link-number {
  position: relative;
  z-index: 2;
  align-self: flex-start;
  margin-top: 0.55rem;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--muted);
}
.is-active .link-number { color: var(--ember); }
.is-active .link-number::before {
  content: '';
  display: block;
  position: absolute;
  left: -0.7rem;
  top: 0.45rem;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: currentColor;
}
.link-copy { position: relative; z-index: 2; }
.link-heading {
  display: block;
  font-size: clamp(2rem, 4.4vw, 3.75rem);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.055em;
  transition: transform 0.65s var(--ease-spring);
}
.link-letter {
  display: inline-block;
  white-space: pre;
  transition: transform 0.65s var(--ease-spring);
  transition-delay: 0ms;
}
.link-subheading {
  display: block;
  margin-top: 0.6rem;
  font-size: 0.875rem;
  letter-spacing: 0.025em;
}
.link-preview {
  position: absolute;
  z-index: 1;
  top: var(--preview-top, 50%);
  left: var(--preview-left, 50%);
  width: clamp(10rem, 22vw, 16rem);
  aspect-ratio: 4 / 3;
  pointer-events: none;
  opacity: 0;
  transform: translate(-10%, -50%) scale(0) rotate(-12.5deg);
  transition: transform 0.65s var(--ease-spring), opacity 0.25s ease,
    top 0.45s var(--ease-out-quint), left 0.45s var(--ease-out-quint);
}
.link-preview img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.65rem;
  box-shadow: 0 16px 40px -12px rgb(0 0 0 / 0.35);
}
.link-arrow-window {
  position: relative;
  z-index: 2;
  margin-left: auto;
  flex-shrink: 0;
  overflow: hidden;
  padding: 0.5rem;
}
.link-arrow {
  width: 3rem;
  height: 3rem;
  opacity: 0;
  transform: translateX(120%);
  transition: transform 0.55s var(--ease-spring), opacity 0.3s ease;
}
.hover-link:focus-visible .link-arrow { opacity: 1; transform: translateX(0); }

@media (hover: hover) and (pointer: fine) {
  .hover-link:hover { z-index: 3; color: var(--ink); border-color: var(--ink); }
  .hover-link:hover .link-heading { transform: translateX(-16px); }
  .hover-link:hover .link-letter {
    transform: translateX(16px);
    transition-delay: calc(0.15s + var(--letter-delay));
  }
  .hover-link:hover .link-preview {
    opacity: 1;
    transform: translate(-10%, -50%) scale(1) rotate(12.5deg);
  }
  .hover-link:hover .link-arrow { opacity: 1; transform: translateX(0); }
}
@media (max-width: 640px) {
  .hover-link { gap: 1rem; min-height: 6.75rem; padding-block: 1.25rem; }
  .link-heading { font-size: clamp(1.65rem, 7vw, 2.5rem); }
  .link-subheading { font-size: 0.75rem; }
  .link-number { margin-top: 0.25rem; }
  .link-arrow { width: 1.75rem; height: 1.75rem; opacity: 1; transform: none; }
  .link-preview { display: none; }
}
@media (hover: none), (pointer: coarse) {
  .link-preview { display: none; }
  .link-arrow { opacity: 1; transform: none; }
}
@media (prefers-reduced-motion: reduce) {
  .link-preview { display: none; }
  .hover-link:hover .link-heading, .hover-link:hover .link-letter { transform: none; }
}
</style>
