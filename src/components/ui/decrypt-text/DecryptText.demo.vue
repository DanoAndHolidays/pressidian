<script setup lang="ts">
/**
 * DecryptText usage reference.
 *
 * Not routed anywhere — it documents the two published variants next to the
 * component, the way a shadcn `demo` file does. `display` is the headline
 * treatment used on the homepage hero; `terminal` is the mono CLI card.
 */
import DecryptText from './DecryptText.vue'
</script>

<template>
  <div class="grid w-full gap-10 p-12">
    <DecryptText
      as="h1"
      text="让动效看起来是设计过的"
      variant="display"
      trigger="mount"
      :stagger="38"
      retrigger-on-hover
      class="max-w-2xl text-center"
    />

    <DecryptText
      text="npx shadcn@latest add https://motiq.dev/r/decrypt-text"
      variant="terminal"
      trigger="mount"
      :start-delay="600"
      :loop="5200"
      class="mx-auto w-full max-w-xl"
    />
  </div>
</template>
