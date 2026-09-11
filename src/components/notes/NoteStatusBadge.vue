<script setup lang="ts">
import { computed } from 'vue'
import type { NoteStatus } from '@/lib/notes/types'
import { STATUS_META } from '@/data/site'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<{
    /** Falls back to the seedling stage when the index has no value yet. */
    status?: NoteStatus | null
    /** `dot` is the inline marker, `chip` the boxed label. */
    variant?: 'dot' | 'chip' | 'text'
    class?: string
  }>(),
  { status: null, variant: 'dot', class: undefined },
)

const meta = computed(() => STATUS_META[props.status ?? 'seedling'] ?? STATUS_META.seedling)
</script>

<template>
  <span
    v-if="variant === 'dot'"
    :class="cn('inline-flex items-center gap-2 font-mono text-[0.7rem] tracking-[0.1em] uppercase', $props.class)"
    :title="meta.hint"
  >
    <i
      class="size-1.5 rounded-full"
      :style="{ background: `var(--${meta.tone})` }"
      aria-hidden="true"
    />
    {{ meta.label }}
  </span>

  <span
    v-else-if="variant === 'chip'"
    :class="
      cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.72rem] font-medium',
        $props.class,
      )
    "
    :style="{
      borderColor: `color-mix(in oklab, var(--${meta.tone}) 38%, var(--line))`,
      color: `var(--${meta.tone})`,
      background: `color-mix(in oklab, var(--${meta.tone}) 9%, transparent)`,
    }"
  >
    <span aria-hidden="true">{{ meta.icon }}</span>
    {{ meta.label }}
  </span>

  <span v-else :class="cn('text-[0.72rem] text-muted', $props.class)">
    {{ meta.icon }} {{ meta.label }}
  </span>
</template>
