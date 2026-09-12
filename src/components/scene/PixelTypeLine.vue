<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

/**
 * Character-by-character reveal, in the pixel voice.
 *
 * The old hero used `DecryptText`, which scrambles glyphs before settling on
 * the real ones. That is a *decryption* metaphor and it reads as noise. The
 * boot sequence this site now opens with establishes a different one — text
 * arriving from a terminal — so the headline types instead.
 *
 * Every glyph is in the DOM from the first frame and only its opacity changes.
 * That is deliberate twice over: the paragraph never reflows mid-animation, and
 * assistive tech reads the finished sentence immediately rather than hearing it
 * spelled out.
 */
const props = withDefaults(
  defineProps<{
    text: string
    /** Milliseconds between glyphs. */
    speed?: number
    /** Milliseconds before the first glyph appears. */
    delay?: number
    /** Show the blinking block caret once typing finishes. */
    caret?: boolean
  }>(),
  { speed: 68, delay: 160, caret: true },
)

const emit = defineEmits<{ (e: 'done'): void }>()

const shown = ref(0)
const finished = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

const glyphs = computed(() => Array.from(props.text))

function clear() {
  if (timer) clearTimeout(timer)
  timer = undefined
}

function start() {
  clear()
  shown.value = 0
  finished.value = false

  const tick = () => {
    if (shown.value >= glyphs.value.length) {
      finished.value = true
      emit('done')
      return
    }
    shown.value += 1
    timer = setTimeout(tick, props.speed)
  }

  timer = setTimeout(tick, props.delay)
}

const reduced = () =>
  typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches

onMounted(() => {
  if (reduced()) {
    shown.value = glyphs.value.length
    finished.value = true
    emit('done')
    return
  }
  start()
})

onBeforeUnmount(clear)

watch(
  () => props.text,
  () => {
    if (reduced()) {
      shown.value = glyphs.value.length
      return
    }
    start()
  },
)
</script>

<template>
  <p class="ptype" :aria-label="text">
    <span
      v-for="(glyph, index) in glyphs"
      :key="index"
      class="ptype__glyph"
      :class="{ 'is-shown': index < shown }"
      aria-hidden="true"
      >{{ glyph }}</span
    ><span v-if="caret && finished" class="ptype__caret" aria-hidden="true">&#9608;</span>
  </p>
</template>

<style scoped>
.ptype {
  margin: 0;
  /* The glyphs are inline-blocks for the reveal, so trailing whitespace needs
     to survive; `pre-wrap` keeps the line breaks the caller wrote. */
  white-space: pre-wrap;
}

.ptype__glyph {
  display: inline-block;
  opacity: 0;
  /* No transition: a stepped on/off is what a terminal does. */
}

.ptype__glyph.is-shown {
  opacity: 1;
}

/* A space still needs to occupy width while hidden. */
.ptype__glyph.is-shown:empty {
  opacity: 1;
}

.ptype__caret {
  display: inline-block;
  margin-left: 0.15em;
  color: var(--px-accent, #ff9d3d);
  animation: px-blink 1.05s steps(1, end) infinite;
}
</style>
