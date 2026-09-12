<script setup lang="ts">
withDefaults(defineProps<{ label?: string }>(), { label: '正在读取笔记正文' })
</script>

<template>
  <div class="content-loading" role="status" aria-live="polite" aria-busy="true">
    <div class="content-loading__heading"><span class="content-loading__orbit" aria-hidden="true" />{{ label }}</div>
    <div class="content-loading__skeleton" aria-hidden="true"><i /><i /><i /><i /></div>
    <span class="content-loading__caption">让想法，慢慢展开。</span>
  </div>
</template>

<style scoped>
.content-loading { width: min(100% - 2.5rem, 36rem); margin: 3rem auto; padding: 2rem; border: 1px solid var(--line); border-radius: 16px; background: var(--paper); }
.content-loading__heading { display: flex; align-items: center; gap: 12px; color: var(--ink-soft); font-size: 14px; }
.content-loading__orbit { width: 18px; height: 18px; border: 1px solid var(--line); border-top-color: var(--ember); border-radius: 50%; animation: orbit 1.2s linear infinite; }
.content-loading__skeleton { display: grid; gap: 13px; margin: 28px 0 24px; }
.content-loading__skeleton i { height: 8px; border-radius: 4px; background: linear-gradient(100deg, var(--paper-3) 30%, var(--paper) 50%, var(--paper-3) 70%); background-size: 250% 100%; animation: shimmer 2s ease-in-out infinite; }
.content-loading__skeleton i:first-child { width: 55%; height: 12px; margin-bottom: 8px; }
.content-loading__skeleton i:last-child { width: 72%; }
.content-loading__caption { font-size: 12px; color: var(--muted); letter-spacing: .08em; }
@keyframes orbit { to { transform: rotate(360deg); } }
@keyframes shimmer { from { background-position: 100% 0; } to { background-position: -100% 0; } }
@media (prefers-reduced-motion: reduce) { .content-loading__orbit, .content-loading__skeleton i { animation: none; } }
</style>
