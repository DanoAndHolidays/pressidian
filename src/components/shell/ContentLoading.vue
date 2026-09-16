<script setup lang="ts">
import ConveyorLoop from '@/components/ui/conveyor-loop/ConveyorLoop.vue'
import signatureSrc from '@/assets/brand/dano-loading.svg?url'

withDefaults(defineProps<{ label?: string }>(), { label: '正在打开这篇笔记…' })
</script>

<template>
  <div class="garden-loading garden-loading--inline" role="status" aria-live="polite">
    <img :src="signatureSrc" class="garden-loading__signature" width="330" height="172" alt="" aria-hidden="true" />
    <p class="garden-loading__label">{{ label }}</p>
    <ConveyorLoop class="garden-loading__conveyor" label="正在载入笔记内容" />
  </div>
</template>

<style scoped>
/*
 * Matches the boot screen's loader scale. `--loader-surface` is declared here
 * because the component's travelling blocks paint that colour behind themselves
 * to mask the track, and this loader sits outside the `.garden-loading` element
 * that defines the default.
 */
.garden-loading__conveyor {
  color: var(--ember);
  font-size: 15px;
  --loader-surface: var(--canvas);
}
</style>
