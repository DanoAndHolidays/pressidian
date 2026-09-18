<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Check, ChevronDown } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

export interface FilterOption {
  value: string
  label: string
  hint?: string | number
}

const props = withDefaults(
  defineProps<{
    modelValue: string
    options: FilterOption[]
    label: string
    /** Highlights the trigger when the current value is not the default one. */
    active?: boolean
    align?: 'left' | 'right'
  }>(),
  { active: false, align: 'left' },
)

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const open = ref(false)
const trigger = ref<HTMLButtonElement | null>(null)
const panel = ref<HTMLElement | null>(null)

/** Fallback width for the popover; never narrower than the trigger itself. */
const PANEL_WIDTH = 232
const GAP = 8
const EDGE = 12

const position = ref({ top: 0, left: 0, width: PANEL_WIDTH })

const selected = computed(() => props.options.find((option) => option.value === props.modelValue))

/**
 * The popover is teleported and pinned to the trigger with viewport
 * coordinates. An absolutely positioned panel would be clipped twice over: the
 * toolbar scrolls horizontally on narrow screens, and the sticky wrapper
 * would swallow anything painted outside its own box.
 */
function place() {
  const element = trigger.value
  if (!element) return
  const rect = element.getBoundingClientRect()
  const width = Math.max(PANEL_WIDTH, rect.width)
  const preferred = props.align === 'right' ? rect.right - width : rect.left
  const maxLeft = Math.max(EDGE, window.innerWidth - width - EDGE)
  position.value = {
    top: rect.bottom + GAP,
    left: Math.min(Math.max(EDGE, preferred), maxLeft),
    width,
  }
}

function toggle() {
  if (!open.value) place()
  open.value = !open.value
}

function close(restoreFocus = false) {
  if (!open.value) return
  open.value = false
  if (restoreFocus) trigger.value?.focus({ preventScroll: true })
}

function select(value: string) {
  emit('update:modelValue', value)
  close(true)
}

function onPointerDown(event: PointerEvent) {
  const target = event.target as Node | null
  if (!target) return
  if (trigger.value?.contains(target) || panel.value?.contains(target)) return
  close()
}

function onKeydown(event: KeyboardEvent) {
  if (event.key !== 'Escape' || !open.value) return
  event.preventDefault()
  close(true)
}

watch(open, async (value) => {
  if (!value) {
    window.removeEventListener('scroll', place, true)
    window.removeEventListener('resize', place)
    return
  }
  await nextTick()
  place()
  panel.value
    ?.querySelector<HTMLElement>('[data-active="true"]')
    ?.focus({ preventScroll: true })
  window.addEventListener('scroll', place, true)
  window.addEventListener('resize', place)
})

onMounted(() => {
  document.addEventListener('pointerdown', onPointerDown)
  document.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onPointerDown)
  document.removeEventListener('keydown', onKeydown)
  window.removeEventListener('scroll', place, true)
  window.removeEventListener('resize', place)
})
</script>

<template>
  <div class="shrink-0">
    <button
      ref="trigger"
      type="button"
      :class="
        cn(
          'group flex h-9 cursor-pointer items-center gap-1.5 rounded-full border px-3 text-[0.76rem] whitespace-nowrap transition-colors duration-300',
          open || active
            ? 'border-ember/55 bg-ember/10 text-ember'
            : 'border-line bg-paper text-ink-soft hover:border-ember/40 hover:text-ink',
        )
      "
      aria-haspopup="listbox"
      :aria-expanded="open"
      :aria-label="label"
      @click="toggle"
    >
      <span class="min-w-0 max-w-[8.5rem] truncate">{{ selected?.label ?? label }}</span>
      <ChevronDown
        :size="13"
        class="shrink-0 text-faint transition-transform duration-300"
        :class="open && 'rotate-180 text-ember'"
      />
    </button>

    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200 ease-out"
        leave-active-class="transition duration-150 ease-in"
        enter-from-class="opacity-0 -translate-y-1"
        leave-to-class="opacity-0 -translate-y-1"
      >
        <div
          v-if="open"
          ref="panel"
          role="listbox"
          :aria-label="label"
          class="fixed z-[70] max-h-72 overflow-y-auto rounded-2xl border border-line bg-paper p-1.5 shadow-[var(--shadow-lg)]"
          :style="{ top: `${position.top}px`, left: `${position.left}px`, width: `${position.width}px` }"
        >
          <button
            v-for="option in options"
            :key="option.value"
            type="button"
            role="option"
            :data-active="option.value === modelValue ? 'true' : undefined"
            :aria-selected="option.value === modelValue"
            :class="
              cn(
                'flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left text-[0.8rem] transition-colors duration-200',
                option.value === modelValue
                  ? 'bg-ember/12 text-ember'
                  : 'text-ink-soft hover:bg-paper-2 hover:text-ink',
              )
            "
            @click="select(option.value)"
          >
            <Check
              :size="13"
              class="shrink-0"
              :class="option.value === modelValue ? 'text-ember' : 'opacity-0'"
            />
            <span class="min-w-0 flex-1 truncate">{{ option.label }}</span>
            <span v-if="option.hint !== undefined" class="shrink-0 font-mono text-[0.7rem] text-faint">
              {{ option.hint }}
            </span>
          </button>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
