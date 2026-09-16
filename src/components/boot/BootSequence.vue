<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { readIntroMode, useBootSequence, useScriptedTimeline } from '@/composables/useBootSequence'

const boot = useBootSequence()
const { at, cancel } = useScriptedTimeline()
const mode = readIntroMode()
const leaving = ref(false)
const pace = mode === 'slow' ? 5 : 1

function finish() {
  if (leaving.value) return
  cancel()
  leaving.value = true
  boot.beginCurtain()
  at(550, boot.finish)
}
function onKey(event: KeyboardEvent) {
  if (['Escape', 'Enter', ' '].includes(event.key)) {
    event.preventDefault()
    finish()
  }
}
onMounted(() => {
  window.addEventListener('keydown', onKey)
  if (mode === 'skip') boot.finish()
  else if (mode !== 'hold') at(1250 * pace, finish)
})
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <div class="pboot" :class="{ 'is-ready': leaving }" :style="{ '--boot-pace': pace }">
    <div class="pboot__identity" role="status" aria-live="polite">
      <div class="pboot__emblem" aria-hidden="true"><span /><span /><i /></div>
      <p class="pboot__wordmark">Pressidian<span>®</span></p>
      <p class="pboot__subtitle">INITIALIZING PERSONAL SPACE</p>
      <div class="pboot__track" aria-hidden="true"><span /></div>
      <p class="pboot__message">正在连接知识与灵感</p>
    </div>
    <span class="pboot__edition">DANO / DIGITAL UNIVERSE</span>
    <button type="button" class="pboot__skip" @click="finish">进入空间 <span aria-hidden="true">↗</span></button>
  </div>
</template>
