<script setup lang="ts">
/** Native emoji keeps the fox consistent with Dano's own visual identity. */
withDefaults(
  defineProps<{
    size?: number
    variant?: 'mark' | 'portrait'
    animated?: boolean
    class?: string
  }>(),
  { size: 32, variant: 'mark', animated: false, class: undefined },
)
</script>

<template>
  <span
    role="img"
    :aria-label="variant === 'portrait' ? 'Dano 的狐狸向导' : '狐狸'"
    :class="['fox-emoji', animated && 'fox-emoji--animated', $props.class]"
    :style="{ width: `${size}px`, height: `${size}px`, fontSize: `${size * 0.9}px` }"
  >🦊</span>
</template>

<style scoped>
.fox-emoji {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif;
  font-weight: normal;
  line-height: 1;
  vertical-align: middle;
  user-select: none;
}
.fox-emoji--animated { animation: fox-bob 2.4s ease-in-out infinite; }
@keyframes fox-bob {
  0%, 100% { transform: translateY(0) rotate(-4deg); }
  50% { transform: translateY(-5px) rotate(4deg); }
}
@media (prefers-reduced-motion: reduce) {
  .fox-emoji--animated { animation: none; }
}
</style>
