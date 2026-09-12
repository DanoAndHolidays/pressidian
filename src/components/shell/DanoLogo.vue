<script setup lang="ts">
withDefaults(defineProps<{ decorative?: boolean; eager?: boolean }>(), {
  decorative: false,
  eager: false,
})
const logoSrc = `${import.meta.env.BASE_URL}brand/dano-logo.png`
</script>

<template>
  <img
    :src="logoSrc"
    :alt="decorative ? '' : 'Dano 手写标志'"
    :aria-hidden="decorative || undefined"
    width="450"
    height="200"
    :loading="eager ? 'eager' : 'lazy'"
    decoding="async"
    class="dano-logo"
  />
</template>

<style scoped>
.dano-logo { display: block; height: auto; object-fit: contain; }
</style>
