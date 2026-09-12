import { readonly, ref, onScopeDispose } from 'vue'

/**
 * Inspection mode.
 *
 * `?intro=<mode>` turns the cinematic into a reviewable artefact, because its
 * most interesting frames last under a second and cannot be caught by hand:
 *
 * - `hold`  — stop at the moment the curtain is half-open and stay there
 * - `slow`  — run the whole sequence at a tenth speed
 * - `skip`  — jump straight to the reveal
 *
 * It is a query parameter rather than a build flag on purpose: this needs to be
 * inspectable on the deployed Pages build, from a phone, without a rebuild.
 */
export type IntroMode = 'normal' | 'hold' | 'slow' | 'skip'

export function readIntroMode(search = typeof location !== 'undefined' ? location.search : ''): IntroMode {
  const raw = new URLSearchParams(search).get('intro')
  return raw === 'hold' || raw === 'slow' || raw === 'skip' ? raw : 'normal'
}

/**
 * The startup cinematic.
 *
 * This is a *simulated* sign-in, not a gate. The site is a static GitHub Pages
 * bundle, so there is no server to authenticate against and no secret to keep —
 * any check here would be theatre that a `view-source` defeats. The owner asked
 * for the ritual, not the security, so the credentials are typed out by the
 * machine and the reader only presses the key that lets it continue.
 *
 * That decision is load-bearing for the rest of the design: because nothing is
 * protected, the overlay is free to be skippable, free to replay, and free to
 * be bypassed entirely by `prefers-reduced-motion`. If a real gate is ever
 * wanted, this component must not be the thing that provides it.
 */
export type BootPhase = 'boot' | 'auth' | 'curtain' | 'done'

/** Persisted so a reload inside the same tab does not replay the cinematic. */
const STORAGE_KEY = 'pressidian-booted'

const phase = ref<BootPhase>('boot')

function hasBooted() {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    // Private mode / storage disabled: replay rather than skip. Showing the
    // intro again is a far smaller failure than a blank screen.
    return false
  }
}

function markBooted() {
  try {
    sessionStorage.setItem(STORAGE_KEY, '1')
  } catch {
    /* non-fatal */
  }
}

/**
 * Module-level `phase` is shared by every caller, which is what makes this work
 * across the overlay and the shell without prop drilling.
 */
export function useBootSequence() {
  const reducedMotion =
    typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches

  // Reduced motion skips the cinematic outright: an auto-playing sequence the
  // reader cannot pause is exactly what the preference is asking us to avoid.
  const mode = readIntroMode()
  if (phase.value === 'boot' && (reducedMotion || mode === 'skip' || (mode === 'normal' && hasBooted()))) {
    phase.value = 'done'
  }

  const advance = (next: BootPhase) => {
    phase.value = next
    if (next === 'done') markBooted()
  }

  return {
    phase: readonly(phase),
    /** True while the overlay still owns the viewport. */
    isImmersive: () => phase.value === 'boot' || phase.value === 'auth' || phase.value === 'curtain',
    hasBooted,
    beginAuth: () => advance('auth'),
    beginCurtain: () => advance('curtain'),
    finish: () => advance('done'),
    replay: () => {
      try {
        sessionStorage.removeItem(STORAGE_KEY)
      } catch {
        /* non-fatal */
      }
      phase.value = 'boot'
    },
  }
}

/**
 * Schedule a chain of steps, cancellable as one unit.
 *
 * The cinematic is a strictly ordered timeline — type, pause, authenticate,
 * pause, split — and every step has to be torn down if the reader navigates or
 * the component unmounts mid-sequence. Returning a single cancel handle keeps
 * that from becoming a pile of individual timer ids.
 */
export function useScriptedTimeline() {
  const timers = new Set<ReturnType<typeof setTimeout>>()

  const at = (delay: number, fn: () => void) => {
    const id = setTimeout(() => {
      timers.delete(id)
      fn()
    }, delay)
    timers.add(id)
    return id
  }

  const cancel = () => {
    for (const id of timers) clearTimeout(id)
    timers.clear()
  }

  onScopeDispose(cancel)

  return { at, cancel }
}
