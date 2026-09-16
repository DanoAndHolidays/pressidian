<script setup lang="ts">
import signatureSrc from '@/assets/brand/dano-loading.svg?url'

withDefaults(defineProps<{ label?: string }>(), { label: '正在打开这篇笔记…' })
</script>

<template>
  <div class="garden-loading garden-loading--inline" role="status" aria-live="polite">
    <img :src="signatureSrc" class="garden-loading__signature" width="330" height="172" alt="" aria-hidden="true" />
    <p class="garden-loading__label">{{ label }}</p>
    <div class="garden-loading__line" aria-hidden="true" />
  </div>
</template>
