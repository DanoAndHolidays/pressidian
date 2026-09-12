<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

/**
 * Inline loader for lazily-loaded note bodies.
 *
 * Deliberately *not* branded with the Dano logo any more — the site's loading
 * language is now the terminal, so this is a small readout in the same voice as
 * the boot sequence rather than a second, softer identity.
 */
withDefaults(defineProps<{ label?: string }>(), { label: '正在读取笔记正文' })

const dots = ref(0)
let timer: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  timer = setInterval(() => {
    dots.value = (dots.value + 1) % 4
  }, 360)
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})

const readout = computed(() => `${'.'.repeat(dots.value)}${'\u00a0'.repeat(3 - dots.value)}`)
</script>

<template>
  <div class="cload px-box px-box--notched" role="status" aria-live="polite">
    <p class="cload__line px-term">
      <span class="cload__prompt">&gt;</span> {{ label }}<span class="cload__dots">{{ readout }}</span>
    </p>
    <div class="cload__track" aria-hidden="true"><span class="cload__fill" /></div>
  </div>
</template>

<style scoped>
.cload {
  display: grid;
  gap: 0.7rem;
  margin: 2.5rem auto;
  width: min(100% - 2.5rem, 34rem);
  padding: 1rem 1.1rem;
}

.cload__line {
  margin: 0;
  color: var(--px-green, #6ef08a);
  font-size: 1.05rem;
}

.cload__prompt {
  color: var(--px-accent, #ff9d3d);
}

.cload__dots {
  color: var(--px-accent, #ff9d3d);
  white-space: pre;
}

.cload__track {
  height: 8px;
  padding: 1px;
  border: 2px solid var(--px-line, #2b3a3f);
  background: rgb(0 0 0 / 0.5);
}

.cload__fill {
  display: block;
  width: 38%;
  height: 100%;
  background: repeating-linear-gradient(
    90deg,
    var(--px-accent, #ff9d3d) 0 5px,
    var(--px-accent-deep, #c25f14) 5px 7px
  );
  animation: cload-run 1.3s steps(9, end) infinite;
}

@keyframes cload-run {
  0% {
    width: 4%;
  }
  100% {
    width: 96%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .cload__fill {
    animation: none;
    width: 60%;
  }
}
</style>
