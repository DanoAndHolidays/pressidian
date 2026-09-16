<script setup lang="ts">
withDefaults(defineProps<{ label?: string }>(), { label: '正在打开这篇笔记…' })
const signatureSrc = `${import.meta.env.BASE_URL}brand/dano-loading.svg`
</script>

<template>
  <div class="garden-loading garden-loading--inline" role="status" aria-live="polite">
    <img :src="signatureSrc" class="garden-loading__signature" width="450" height="200" alt="" aria-hidden="true" />
    <p class="garden-loading__label">{{ label }}</p>
    <div class="garden-loading__line" aria-hidden="true" />
  </div>
</template>
