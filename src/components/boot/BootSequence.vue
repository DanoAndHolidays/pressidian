<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { SCENES } from '@/data/scenes'
import {
  readIntroMode,
  useBootSequence,
  useScriptedTimeline,
  type BootPhase,
} from '@/composables/useBootSequence'

/**
 * The startup cinematic.
 *
 * Replaces the previous handwriting-stroke SVG signature. The brief was a
 * *pixel* login ritual: a terminal wakes, types the operator's name and a
 * password by itself, verifies them, and then the screen tears down the middle
 * so the background painting can be pulled apart like a curtain to reveal the
 * garden.
 *
 * Three deliberate constraints shape the code below:
 *
 * 1. **Nothing here authenticates anything.** See `useBootSequence` — this is a
 *    static bundle with no server, so the credentials are scripted and the only
 *    real input is the key that skips ahead. The owner asked for the ritual.
 * 2. **It is always escapable.** A click, any key, or the SKIP button jumps to
 *    the end. An intro that cannot be skipped is a hostage situation.
 * 3. **It never blocks the app.** `App.vue` keeps rendering underneath, so the
 *    homepage is mounted, laid out and decoded before the curtain opens; the
 *    reveal exposes a live page rather than triggering one.
 */
const emit = defineEmits<{ (e: 'finished'): void }>()

const boot = useBootSequence()
const { at, cancel } = useScriptedTimeline()

/**
 * `?intro=hold|slow|skip`. The curtain's most interesting frame lasts well
 * under a second, so it needs to be holdable to be reviewed at all.
 */
const mode = readIntroMode()
const held = ref(false)
/** Multiplier applied to every scripted pause. */
const pace = mode === 'slow' ? 10 : 1

/** Which beat of the sequence is showing; drives the console's own styling. */
const phase = ref<BootPhase>('boot')

const NAME = 'Dano'
const PASSWORD = 'dano-admin-2026'

/** Revealed one character at a time. */
const typedName = ref('')
const passwordCells = ref(0)

const log = ref<{ text: string; tone?: 'ok' | 'warn' | 'accent' }[]>([])
const progress = ref(0)
const verified = ref(false)
const linesEl = ref<HTMLElement | null>(null)

/**
 * `useScriptedTimeline` only owns timers it created itself. The typing loops
 * below schedule their own, so they register their finaliser here and every
 * teardown path clears both collections together.
 */
const extraTimers = new Set<() => void>()
let cancelled = false

function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    const id = setTimeout(resolve, ms * pace)
    extraTimers.add(() => clearTimeout(id))
  })
}

/** Types `text` into a setter, one character at a time, cancellably. */
function typeInto(text: string, push: (s: string) => void, perChar: number) {
  return new Promise<void>((resolve) => {
    let i = 0
    const tick = () => {
      if (cancelled || i >= text.length) return resolve()
      i += 1
      push(text.slice(0, i))
      const id = setTimeout(tick, perChar * pace)
      extraTimers.add(() => clearTimeout(id))
    }
    const first = setTimeout(tick, perChar * pace)
    extraTimers.add(() => clearTimeout(first))
  })
}

function addLog(text: string, tone?: 'ok' | 'warn' | 'accent') {
  log.value.push({ text, tone })
  void nextTick(() => {
    if (linesEl.value) linesEl.value.scrollTop = linesEl.value.scrollHeight
  })
}

function clearEverything() {
  cancel()
  for (const clear of extraTimers) clear()
  extraTimers.clear()
}

async function run() {
  addLog('PRESSIDIAN BIOS v2.0 — (c) DANO LABS', 'accent')
  await sleep(280)
  addLog('scene renderer ......................... OK')
  await sleep(200)
  addLog('vault index ............................ OK')
  await sleep(180)

  phase.value = 'auth'
  addLog('authentication required.', 'warn')
  await sleep(340)

  // The operator name types itself; the reader is a witness, not a user.
  await typeInto(NAME, (v) => (typedName.value = v), 96)
  await sleep(320)
  addLog('password ............................... ', 'warn')

  for (let i = 0; i < PASSWORD.length; i += 1) {
    await sleep(48)
    if (cancelled) return
    passwordCells.value = i + 1
  }

  await sleep(280)
  addLog('verifying credentials ...', 'warn')
  verified.value = true

  // Driven by hand rather than by a CSS transition so the readout, the bar and
  // the scripted pauses can never disagree about how far along we are.
  for (let i = 0; i <= 100; i += 4) {
    await sleep(18)
    if (cancelled) return
    progress.value = i
  }

  addLog('access granted — welcome back, Dano.', 'ok')
  boot.beginAuth()
  await sleep(640)

  boot.beginCurtain()
  phase.value = 'curtain'

  // `?intro=hold` parks here with the halves frozen a third of the way apart so
  // the split can be inspected; the page underneath is fully live.
  if (mode === 'hold') {
    held.value = true
    return
  }

  await sleep(1500)
  boot.finish()
  emit('finished')
}

/** Jump straight to the reveal. Safe to call repeatedly. */
function skip() {
  if (phase.value === 'curtain') return
  // Inspection mode: the whole point is to stay put.
  if (held.value) return
  clearEverything()
  phase.value = 'curtain'
  verified.value = true
  progress.value = 100
  typedName.value = NAME
  passwordCells.value = PASSWORD.length
  addLog('skip requested — opening now.', 'accent')
  boot.beginCurtain()
  at(1400, () => {
    boot.finish()
    emit('finished')
  })
}

const onKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape' || event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    skip()
  }
}

onMounted(() => {
  void run()
  window.addEventListener('keydown', onKey)
})

onBeforeUnmount(() => {
  cancelled = true
  clearEverything()
  window.removeEventListener('keydown', onKey)
})

const progressLabel = computed(() => `${String(progress.value).padStart(3, '0')}%`)
</script>

<template>
  <div
    class="px-boot"
    :class="[`is-${phase}`, { 'is-verified': verified, 'is-held': held }]"
    role="status"
    aria-live="polite"
    aria-label="Pressidian 启动序列：正在自动登录"
    @click="skip"
  >
    <!-- The curtain: one painting cut down the middle, the halves carried apart
         by their own panels so the scene appears to split rather than fade. -->
    <div class="px-boot__curtain" aria-hidden="true">
      <div class="px-boot__half px-boot__half--l">
        <img
          :src="SCENES.day.poster"
          :srcset="SCENES.day.webp"
          sizes="100vw"
          alt=""
          class="px-boot__art"
        />
      </div>
      <div class="px-boot__half px-boot__half--r">
        <img
          :src="SCENES.day.poster"
          :srcset="SCENES.day.webp"
          sizes="100vw"
          alt=""
          class="px-boot__art"
        />
      </div>
    </div>

    <div class="px-boot__scan" aria-hidden="true" />
    <div class="px-boot__noise" aria-hidden="true" />

    <div class="px-boot__console">
      <div class="px-boot__frame px-box px-box--notched">
        <div class="px-boot__bar">
          <span class="px-boot__dots" aria-hidden="true"><i /><i /><i /></span>
          <span class="px-label">pressidian — secure boot</span>
          <span class="px-label px-boot__clock">{{ progressLabel }}</span>
        </div>

        <div ref="linesEl" class="px-boot__lines px-term">
          <p
            v-for="(line, i) in log"
            :key="i"
            :class="{ 'is-ok': line.tone === 'ok', 'is-warn': line.tone === 'warn', 'is-accent': line.tone === 'accent' }"
          >
            <span class="px-boot__prompt">&gt;</span> {{ line.text }}
          </p>

          <div class="px-boot__field">
            <span class="px-boot__key px-term">user</span>
            <span class="px-boot__val px-term">
              {{ typedName }}<i v-if="phase !== 'curtain'" class="px-caret" />
            </span>
          </div>

          <div class="px-boot__field">
            <span class="px-boot__key px-term">pass</span>
            <span class="px-boot__val px-boot__val--masked px-term" aria-label="密码已自动填充">
              <b v-for="n in passwordCells" :key="n" class="px-boot__cell">&#9608;</b>
            </span>
          </div>

          <p v-if="verified" class="is-ok px-boot__granted">
            <span class="px-boot__prompt">&gt;</span> ACCESS GRANTED
          </p>
        </div>

        <div class="px-boot__meter">
          <div class="px-boot__track">
            <span class="px-boot__fill" :style="{ width: `${progress}%` }" />
          </div>
          <span class="px-label">decrypting garden · {{ progressLabel }}</span>
        </div>
      </div>

      <div class="px-boot__actions">
        <span class="px-label px-boot__hint">自动登录中 · 按任意键跳过</span>
        <button type="button" class="px-btn px-btn--ghost" @click.stop="skip">skip &gt;&gt;</button>
      </div>
    </div>

    <!-- The tear that snaps across the screen at the moment of the split. It is
         the corrupted daylight frame the owner supplied, not a flat gradient:
         the point of the third painting is that it is what the signal looks
         like while it is failing. -->
    <div class="px-boot__tear" aria-hidden="true">
      <img :src="SCENES.dayGlitch.poster" :srcset="SCENES.dayGlitch.webp" sizes="100vw" alt="" class="px-boot__tear-art" />
      <span class="px-boot__tear-rings" />
    </div>
  </div>
</template>

<style scoped>
.px-boot {
  position: fixed;
  inset: 0;
  z-index: var(--px-z-boot);
  background: var(--px-void);
  overflow: hidden;
  cursor: pointer;
}

/* ---- curtain ----------------------------------------------------------- */
.px-boot__curtain {
  position: absolute;
  inset: 0;
}

.px-boot__half {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 50.2%; /* slight overlap so no seam shows while closed */
  overflow: hidden;
  transition: transform 1.35s cubic-bezier(0.72, 0, 0.24, 1);
  will-change: transform;
}

.px-boot__half--l {
  left: 0;
}

.px-boot__half--r {
  right: 0;
}

/* Each half carries a full-viewport copy of the painting, anchored to its own
   outer edge, so the two copies line up into one seamless image while closed. */
.px-boot__art {
  position: absolute;
  top: 0;
  width: 100vw;
  height: 100%;
  max-width: none;
  object-fit: cover;
  object-position: 50% 42%;
  filter: contrast(1.2) saturate(1.3) brightness(0.72);
}

.px-boot__half--l .px-boot__art {
  left: 0;
}

.px-boot__half--r .px-boot__art {
  right: 0;
}

/* Hard steps, not an ease: a curtain yanked by a machine. */
.px-boot.is-curtain .px-boot__half {
  transition: transform 1.25s steps(9, end);
}

.px-boot.is-curtain .px-boot__half--l {
  transform: translate3d(-101%, 0, 0);
}

.px-boot.is-curtain .px-boot__half--r {
  transform: translate3d(101%, 0, 0);
}

.px-boot.is-curtain .px-boot__console {
  opacity: 0;
  transform: scale(1.06);
  transition:
    opacity 0.3s steps(3, end),
    transform 0.4s steps(4, end);
}

/* ---- console ----------------------------------------------------------- */
.px-boot__console {
  position: absolute;
  inset: 0;
  display: grid;
  place-content: center;
  /* Both children are `min(680px, 92vw)` wide; without this the grid stretches
     them to the column and the frame stops matching the SKIP row. */
  justify-items: center;
  gap: 1rem;
  padding: 1.5rem;
}

.px-boot__frame {
  width: min(680px, 92vw);
  padding: 0;
  overflow: hidden;
  background: rgb(3 6 7 / 0.94);
  border-color: var(--px-accent);
  box-shadow:
    var(--px-shadow-lg),
    0 0 0 2px rgb(0 0 0 / 0.8),
    0 0 90px rgb(255 157 61 / 0.14);
}

.px-boot__bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.7rem 0.9rem;
  border-bottom: 2px solid var(--px-line);
  background: rgb(255 157 61 / 0.1);
}

.px-boot__dots {
  display: flex;
  gap: 4px;
}

.px-boot__dots i {
  width: 8px;
  height: 8px;
  background: var(--px-line);
}

.px-boot__dots i:first-child {
  background: var(--px-accent);
}

.px-boot__clock {
  margin-left: auto;
  color: var(--px-accent);
}

.px-boot__lines {
  height: 268px;
  overflow: hidden;
  padding: 0.85rem 1rem;
  color: var(--px-green);
  font-size: 1.05rem;
  text-shadow: 0 0 6px rgb(110 240 138 / 0.35);
}

.px-boot__lines p {
  margin: 0 0 0.15rem;
  white-space: pre-wrap;
  word-break: break-word;
}

.px-boot__lines p.is-ok {
  color: var(--px-green);
}

.px-boot__lines p.is-warn {
  color: var(--px-accent);
}

.px-boot__lines p.is-accent {
  color: var(--px-cyan);
}

.px-boot__prompt {
  color: var(--px-accent);
}

.px-boot__field {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.px-boot__key {
  flex: 0 0 auto;
  min-width: 4.5ch;
  color: var(--px-cyan);
}

.px-boot__val {
  color: #eafff2;
}

.px-boot__cell {
  color: var(--px-accent);
  font-weight: 400;
  /* Each cell pops in; the stepped timing is what makes it read as keystrokes
     rather than as a fade. */
  animation: px-cell-in 0.12s steps(1, end) both;
  text-shadow: 0 0 8px rgb(255 157 61 / 0.5);
}

@keyframes px-cell-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.px-boot__granted {
  margin-top: 0.6rem !important;
  color: var(--px-green) !important;
  letter-spacing: 0.16em;
  animation: px-glitch-shift 0.3s steps(3, end) 2;
}

.px-boot__meter {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.6rem 1rem 0.8rem;
  border-top: 2px solid var(--px-line);
}

.px-boot__track {
  /* `flex: 1` alone leaves the bar as a flex item with an automatic minimum
     width, so a growing child can push it out of its own box. `min-width: 0`
     plus the clip keeps the fill inside the track. */
  flex: 1 1 auto;
  min-width: 0;
  height: 14px;
  padding: 1px;
  border: 2px solid var(--px-line);
  background: rgb(0 0 0 / 0.6);
  overflow: hidden;
}

.px-boot__fill {
  display: block;
  height: 100%;
  width: 0;
  background: repeating-linear-gradient(
    90deg,
    var(--px-accent) 0 6px,
    var(--px-accent-deep) 6px 8px
  );
  transition: width 0.1s linear;
}

/* The pre-JavaScript screen's hinted bar, and the meter label, are the only
   places in the boot UI that are not numerals — they carry Chinese, which the
   pixel face has no glyphs for. Keeping them in the terminal face at a size
   that renders CJK legibly beats a fallback lottery. */
.px-boot__meter .px-label,
.px-boot__actions .px-label {
  font-family: var(--font-sans);
  font-size: 0.78rem;
  letter-spacing: 0.08em;
}

.px-boot__actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  /* Matches the frame exactly, so the SKIP key lines up with its right edge
     instead of floating in from the viewport edge on wide screens. */
  width: min(680px, 92vw);
}

.px-boot__hint {
  animation: px-blink 1.4s steps(1, end) infinite;
}

/* ---- environment ------------------------------------------------------- */
.px-boot__scan {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(180deg, rgb(0 0 0 / 0.3) 0 1px, transparent 1px 3px);
  opacity: 0.6;
  pointer-events: none;
}

.px-boot__noise {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.07;
  background-image: repeating-linear-gradient(
    180deg,
    rgb(255 255 255 / 0.5) 0 1px,
    transparent 1px 4px
  );
  animation: px-flicker 3.4s steps(1, end) infinite;
}

/* The tear: the corrupted frame, revealed through an expanding slit. */
.px-boot__tear {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0;
  /* `screen` over an already-lit painting would wash the frame out; `normal`
     keeps the corruption legible as corruption. */
  overflow: hidden;
  clip-path: polygon(48% 0, 52% 0, 52% 100%, 48% 100%);
}

.px-boot__tear-art {
  width: 100%;
  height: 100%;
  max-width: none;
  object-fit: cover;
  object-position: 50% 42%;
  filter: contrast(1.4) saturate(1.6) brightness(1.08);
}

/* A hard chromatic edge down the middle of the slit, so the opening reads as a
   cut rather than a fade. Kept narrow and off-centre-cleared: the corruption
   frame underneath is the subject, and a wide gradient over it just paints a
   white bar across the best part of the shot. */
.px-boot__tear-rings {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent 47.4%,
    rgb(53 224 216 / 0.55) 49%,
    transparent 49.6%,
    transparent 50.4%,
    rgb(255 61 129 / 0.55) 51%,
    transparent 52.6%
  );
  mix-blend-mode: screen;
}

/* On a phone the slit is a much larger share of the width, so the same
   percentage-based edges become a fat washed-out bar sitting on top of the
   corruption frame. Narrowing them proportionally keeps the "cut" reading
   without hiding what is being cut open. */
@media (max-width: 700px) {
  .px-boot__tear-rings {
    background: linear-gradient(
      90deg,
      transparent 48.6%,
      rgb(53 224 216 / 0.5) 49.5%,
      transparent 49.9%,
      transparent 50.1%,
      rgb(255 61 129 / 0.5) 50.5%,
      transparent 51.4%
    );
  }
}

.px-boot.is-curtain .px-boot__tear {
  animation: px-tear-snap 0.85s steps(6, end) both;
}

@keyframes px-tear-snap {
  0% {
    opacity: 0;
    clip-path: polygon(49.8% 0, 50.2% 0, 50.2% 100%, 49.8% 100%);
  }
  18% {
    opacity: 1;
    clip-path: polygon(49% 0, 51% 0, 51% 100%, 49% 100%);
  }
  60% {
    opacity: 0.9;
    clip-path: polygon(44% 0, 56% 0, 56% 100%, 44% 100%);
  }
  100% {
    opacity: 0;
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
  }
}

.px-boot.is-verified .px-boot__frame {
  border-color: var(--px-green);
  box-shadow:
    var(--px-shadow-lg),
    0 0 90px rgb(110 240 138 / 0.2);
}

/* --------------------------------------------------------------------------
   Inspection mode (`?intro=hold`)
   Parks the curtain a third of the way open, frozen, so the split can actually
   be looked at. `!important` is load-bearing here: it has to beat the
   `.is-curtain` transition that is applied in the same frame.
   -------------------------------------------------------------------------- */
.px-boot.is-held .px-boot__half {
  transition: none !important;
}

.px-boot.is-held .px-boot__half--l {
  transform: translate3d(-36%, 0, 0) !important;
}

.px-boot.is-held .px-boot__half--r {
  transform: translate3d(36%, 0, 0) !important;
}

.px-boot.is-held .px-boot__tear {
  animation: none !important;
  opacity: 1 !important;
  clip-path: polygon(38% 0, 62% 0, 62% 100%, 38% 100%) !important;
}

/* The console stays exactly as the real sequence leaves it — dimming it here
   would make the inspection frame lie about what the animation looks like. */
.px-boot.is-held .px-boot__console {
  opacity: 0;
}

@media (max-width: 640px) {
  .px-boot__lines {
    height: 44vh;
    font-size: 0.95rem;
  }
  .px-boot__console {
    padding: 1rem;
  }
  .px-boot__actions {
    flex-direction: column-reverse;
    align-items: stretch;
    text-align: center;
  }
}
</style>
