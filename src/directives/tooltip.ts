import type { App, Directive } from 'vue'

/**
 * `v-tooltip` — a shared, teleported tooltip for text the layout had to
 * truncate.
 *
 * Every annotated element is served by one set of document listeners, so a
 * tree with hundreds of rows does not pay for hundreds of listener pairs. The
 * bubble only appears when the element is actually clipped, which keeps short
 * labels from repeating themselves on hover.
 */

const ATTR = 'data-tip'
const ALWAYS_ATTR = 'data-tip-always'
const OFFSET = 8
const EDGE = 10

let bubble: HTMLDivElement | null = null
let active: HTMLElement | null = null
let installed = false

function surface(): HTMLDivElement {
  if (bubble) return bubble
  bubble = document.createElement('div')
  bubble.className = 'pd-tooltip'
  bubble.setAttribute('role', 'tooltip')
  bubble.dataset.open = 'false'
  document.body.appendChild(bubble)
  return bubble
}

function place(target: HTMLElement) {
  const node = surface()
  const rect = target.getBoundingClientRect()
  // `offsetWidth`/`offsetHeight` ignore the entrance `scale`, so measuring the
  // bubble while it is still shrunk does not skew the anchor maths.
  const width = node.offsetWidth
  const height = node.offsetHeight
  const maxLeft = Math.max(EDGE, window.innerWidth - width - EDGE)
  const left = Math.min(Math.max(EDGE, rect.left + rect.width / 2 - width / 2), maxLeft)

  let top = rect.top - height - OFFSET
  let placement = 'top'
  if (top < EDGE) {
    top = rect.bottom + OFFSET
    placement = 'bottom'
  }

  node.dataset.placement = placement
  node.style.left = `${Math.round(left)}px`
  node.style.top = `${Math.round(top)}px`
}

function reposition() {
  if (active) place(active)
}

function show(target: HTMLElement, text: string) {
  const node = surface()
  node.textContent = text
  node.dataset.open = 'true'
  active = target
  place(target)
  window.addEventListener('scroll', reposition, true)
  window.addEventListener('resize', reposition)
}

function hide() {
  active = null
  if (bubble) bubble.dataset.open = 'false'
  window.removeEventListener('scroll', reposition, true)
  window.removeEventListener('resize', reposition)
}

function isClipped(el: HTMLElement): boolean {
  return el.scrollWidth - el.clientWidth > 1
}

/** Truncated text is the default trigger; `.always` opts out of that check. */
function shouldShow(target: HTMLElement): boolean {
  return target.hasAttribute(ALWAYS_ATTR) || isClipped(target)
}

function tipTarget(node: EventTarget | null): HTMLElement | null {
  return node instanceof Element ? node.closest<HTMLElement>(`[${ATTR}]`) : null
}

function textOf(target: HTMLElement): string {
  return target.getAttribute(ATTR)?.trim() ?? ''
}

function onPointerOver(event: PointerEvent) {
  const target = tipTarget(event.target)
  if (!target || target === active) return
  const text = textOf(target)
  if (!text || !shouldShow(target)) return
  show(target, text)
}

function onPointerOut(event: PointerEvent) {
  if (!active || tipTarget(event.target) !== active) return
  const related = event.relatedTarget instanceof Node ? event.relatedTarget : null
  if (related && active.contains(related)) return
  hide()
}

function onFocusIn(event: FocusEvent) {
  const target = tipTarget(event.target)
  if (!target || target === active) return
  const text = textOf(target)
  if (!text || !shouldShow(target)) return
  show(target, text)
}

function onFocusOut(event: FocusEvent) {
  if (!active) return
  const related = event.relatedTarget instanceof Node ? event.relatedTarget : null
  if (related && active.contains(related)) return
  hide()
}

function install() {
  if (installed) return
  installed = true
  document.addEventListener('pointerover', onPointerOver)
  document.addEventListener('pointerout', onPointerOut)
  document.addEventListener('focusin', onFocusIn)
  document.addEventListener('focusout', onFocusOut)
}

function sync(el: HTMLElement, value: string | undefined, always: boolean) {
  const text = typeof value === 'string' ? value.trim() : ''
  if (text) {
    el.setAttribute(ATTR, text)
    if (always) el.setAttribute(ALWAYS_ATTR, 'true')
    else el.removeAttribute(ALWAYS_ATTR)
  } else {
    el.removeAttribute(ATTR)
    el.removeAttribute(ALWAYS_ATTR)
  }
}

export const vTooltip: Directive<HTMLElement, string | undefined> = {
  mounted(el, binding) {
    install()
    sync(el, binding.value, Boolean(binding.modifiers.always))
  },
  updated(el, binding) {
    sync(el, binding.value, Boolean(binding.modifiers.always))
  },
  unmounted(el) {
    if (active === el) hide()
    el.removeAttribute(ATTR)
    el.removeAttribute(ALWAYS_ATTR)
  },
}

/** Registers the shared tooltip directive. */
export function registerTooltip(app: App) {
  app.directive('tooltip', vTooltip)
}
