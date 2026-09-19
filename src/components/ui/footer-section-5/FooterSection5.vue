<script setup lang="ts">
/**
 * FooterSection5 — full-bleed footer.
 *
 * Vue port of the supplied `footer-section-5` React component. The composition
 * is kept as designed: an oversized outline wordmark sits in the page, its
 * baseline clipped by the panel's top edge, and the panel carries the brand
 * block on the left with link columns on the right.
 *
 * What changed in the port, beyond React → Vue:
 *
 * - `next/link` became `RouterLink`, and the copy stopped being hard-coded in
 *   the component. Brand, headline, columns and the two slots are props, so the
 *   shell feeds it this site's own navigation instead of placeholder links.
 * - The supplied blue panel and its shader backdrop were dropped. This site's
 *   surface is warm paper, so the panel is `--paper` against the page's
 *   `--canvas` with a hairline between them — the same surface language as the
 *   rest of the site, and the clip line stays readable without a texture.
 */
import { computed } from 'vue'
import type { FooterColumn } from './types'

const props = withDefaults(
  defineProps<{
    /** Oversized outline wordmark and the name in the copyright line. */
    brand: string
    /** Serif line under the mark. */
    headline: string
    /** Small paragraph under the headline. */
    caption?: string
    columns: FooterColumn[]
    /** Defaults to the current year. */
    year?: number
    /** Accessible name for the footer's link columns. */
    navLabel?: string
  }>(),
  {
    caption: undefined,
    year: undefined,
    navLabel: '页脚导航',
  },
)

defineSlots<{
  /** Brand mark that sits above the headline. */
  logo?: () => unknown
  /** Action row: icon links and buttons. Children are styled by this component. */
  social?: () => unknown
}>()

/**
 * `new Date()` is read here rather than in `withDefaults` so the default stays a
 * real per-render value instead of a shared object literal.
 */
const year = computed(() => props.year ?? new Date().getFullYear())
</script>

<template>
  <footer class="footer-section-5">
    <!--
      Decorative: the brand is a shape here, and it is already named by the logo
      slot and the copyright line below. The `-0.12em` of trailing margin pulls
      the panel up over the glyph bottoms, which is the point of the
      composition.
    -->
    <div class="footer-section-5__top">
      <span class="footer-section-5__word" aria-hidden="true">{{ brand }}</span>
    </div>

    <div class="footer-section-5__panel">
      <div class="shell-wide footer-section-5__inner">
        <div class="footer-section-5__brand">
          <div class="footer-section-5__brand-top">
            <slot name="logo" />
            <p class="footer-section-5__headline">{{ headline }}</p>
            <p v-if="caption" class="footer-section-5__caption">{{ caption }}</p>
          </div>

          <div class="footer-section-5__brand-bottom">
            <div class="footer-section-5__actions">
              <slot name="social" />
            </div>
            <p class="footer-section-5__legal">© {{ year }} {{ brand }}</p>
          </div>
        </div>

        <nav class="footer-section-5__columns" :aria-label="navLabel">
          <div v-for="column in columns" :key="column.title" class="footer-section-5__column">
            <h3 class="footer-section-5__column-title">{{ column.title }}</h3>
            <ul class="footer-section-5__list">
              <li v-for="link in column.links" :key="link.name">
                <RouterLink v-if="link.to" :to="link.to" class="footer-section-5__link">
                  <span>{{ link.name }}</span>
                  <span v-if="link.note" class="footer-section-5__note">{{ link.note }}</span>
                </RouterLink>
                <a
                  v-else
                  :href="link.href"
                  target="_blank"
                  rel="noreferrer"
                  class="footer-section-5__link"
                >
                  <span>{{ link.name }}</span>
                  <span v-if="link.note" class="footer-section-5__note">{{ link.note }}</span>
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer-section-5 {
  position: relative;
  overflow: hidden;
  background-color: var(--canvas);

  /*
   * Theme tokens for the panel. They live on the root because the outline
   * wordmark sits *outside* the panel and still reads `--footer-word`.
   */
  --footer-bg: var(--paper);
  --footer-fg: var(--ink);
  --footer-muted: var(--muted);
  --footer-link: var(--ink-soft);
  --footer-note: var(--faint);
  --footer-line: var(--line);
  /*
   * Solid, but mixed well down towards the surface: at full strength a word
   * this size would out-shout everything above it, and the footer's job is to
   * carry links, not to be the page's headline.
   */
  --footer-word: color-mix(in oklab, var(--ink) 20%, transparent);
}

/* --------------------------------------------------------------------------
   Outline wordmark
   -------------------------------------------------------------------------- */

.footer-section-5__top {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-top: clamp(2.5rem, 6vw, 5.5rem);
}

.footer-section-5__word {
  display: block;
  /*
   * The cut is a fraction of the word's own size so it holds at every width.
   * Sans caps sit higher in the line box than the serif's did, so this is a
   * smaller fraction than the reference used — at -0.12em the panel swallowed
   * a fifth of each letter.
   */
  margin-bottom: -0.09em;
  /*
   * Sans, not the site's serif heading stack: at this size the serif's thick/
   * thin contrast fights the 1px outline, and the strokes that carry the
   * letterform read as hairlines once only their edges are drawn.
   */
  font-family: var(--font-sans);
  font-weight: 600;
  /*
   * The word has to look deliberate at both ends: large enough to fill most of
   * a phone's width, and not so large on a desktop that it runs into the edges.
   * One `clamp()` cannot hold both, so the middle term is set for ~88% width and
   * the rem ceiling caps it on very wide screens.
   */
  font-size: clamp(3.5rem, 16.5vw, 18rem);
  line-height: 0.76;
  letter-spacing: -0.025em;
  text-transform: uppercase;
  white-space: nowrap;
  user-select: none;
  color: var(--footer-word);
}

/* --------------------------------------------------------------------------
   Panel
   -------------------------------------------------------------------------- */

.footer-section-5__panel {
  position: relative;
  z-index: 1;
  background-color: var(--footer-bg);
  border-top: 1px solid var(--footer-line);
  color: var(--footer-fg);
}

.footer-section-5__inner {
  display: grid;
  gap: clamp(2.5rem, 5vw, 3.5rem);
  padding-block: clamp(2.75rem, 5vw, 4.25rem);
}

@media (min-width: 1024px) {
  .footer-section-5__inner {
    grid-template-columns: minmax(0, 21rem) minmax(0, 1fr);
    gap: 4rem;
  }
}

/* --------------------------------------------------------------------------
   Brand block
   -------------------------------------------------------------------------- */

.footer-section-5__brand {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 2.5rem;
}

.footer-section-5__brand-top {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.footer-section-5__headline {
  margin-top: 1.25rem;
  font-size: clamp(1.15rem, 1.6vw, 1.4rem);
  line-height: 1.3;
  color: var(--footer-fg);
}

.footer-section-5__caption {
  margin-top: 0.85rem;
  max-width: 24rem;
  font-size: 0.84rem;
  line-height: 1.7;
  color: var(--footer-muted);
}

.footer-section-5__brand-bottom {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.footer-section-5__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

/*
 * The slot supplies icons and labels only — the shape of a footer action is the
 * component's business, so a call site never has to restate the surface tokens
 * to get a button that sits on the footer.
 */
.footer-section-5__actions :deep(:is(a, button)) {
  display: grid;
  place-items: center;
  width: 2.25rem;
  height: 2.25rem;
  border: 1px solid var(--footer-line);
  border-radius: 999px;
  background: transparent;
  color: var(--footer-link);
  cursor: pointer;
  transition:
    color 0.25s ease,
    border-color 0.25s ease;
}

.footer-section-5__actions :deep(:is(a, button):hover) {
  color: var(--ember);
  border-color: color-mix(in oklab, var(--ember) 50%, transparent);
}

.footer-section-5__legal {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--footer-note);
}

/* --------------------------------------------------------------------------
   Link columns
   -------------------------------------------------------------------------- */

.footer-section-5__columns {
  display: flex;
  flex-wrap: wrap;
  gap: clamp(2.25rem, 5vw, 4rem);
}

@media (min-width: 1024px) {
  .footer-section-5__columns {
    justify-content: flex-end;
  }
}

.footer-section-5__column {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 8.5rem;
}

.footer-section-5__column-title {
  font-family: var(--font-sans);
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--footer-fg);
}

.footer-section-5__list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.footer-section-5__link {
  display: inline-flex;
  align-items: baseline;
  gap: 0.55rem;
  font-size: 0.86rem;
  color: var(--footer-link);
  transition: color 0.25s ease;
}

.footer-section-5__link:hover {
  color: var(--ember);
}

/* The underline grows from the left instead of popping in on hover. */
.footer-section-5__link > span:first-child {
  background-image: linear-gradient(currentColor, currentColor);
  background-repeat: no-repeat;
  background-position: 0 100%;
  background-size: 0 1px;
  transition: background-size 0.3s var(--ease-out-quint);
}

.footer-section-5__link:hover > span:first-child {
  background-size: 100% 1px;
}

.footer-section-5__note {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.04em;
  color: var(--footer-note);
}
</style>
