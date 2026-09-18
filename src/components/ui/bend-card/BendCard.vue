<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

/**
 * Bend card — 折页卡片。
 *
 * This is the library's own component
 * (`VueComponent/dano-ui/src/components/BendCard.vue`, published as `dano-ui`)
 * ported into the site, not a re-reading of it. The mechanic it ships is the
 * whole point, so all of its numbers are kept:
 *
 * - Only the card's `height` animates (300 → 420). The photo keeps its 255px
 *   height and the sheet keeps its offset, so the card *uncovers* its lower half
 *   instead of pushing it down. The library's 420px stage is what stops the page
 *   from jumping while that happens.
 * - The fold is the sheet's `::after`: an 80×80 transparent square whose
 *   `box-shadow: 70px 75px 0 40px <sheet>` paints the sheet colour 45px up and
 *   to the right, where it merges with the sheet's own 40px radius into a single
 *   curved edge.
 * - The photo rests at `blur(20px)` and the sheet at `blur(15px)`; hover
 *   resolves both and fades the copy up from `opacity: .1`.
 *
 * The site adds only what it needs on top: the card can render as a `RouterLink`
 * (`to`), and the sheet and ink come from the theme tokens, because the
 * library's hard-coded `#fff` paints a white sheet under white text in the dark
 * theme. Geometry, blur values and easing are the library's.
 */
defineOptions({ name: 'BendCard' })

/**
 * `Tone | (string & {})` autocompletes the three site accents but still accepts
 * the loose `string` that `STATUS_META.tone` is typed as elsewhere. It only
 * drives the focus ring; the card face stays neutral, as in the library.
 */
type Tone = 'ember' | 'jade' | 'amber' | (string & {})

const props = withDefaults(
  defineProps<{
    /** Photo behind the fold. The site's name for the library's `img`. */
    image?: string
    /** The library's own prop name, so dano-ui snippets drop in unchanged. */
    img?: string
    title?: string
    /** Small line under the title — a timestamp, a count, a category. */
    small?: string
    /** Accent for the focus ring. */
    tone?: Tone
    /** Renders the card as a `RouterLink` instead of a `div`. */
    to?: string
  }>(),
  {
    image: '',
    img: '',
    title: 'Vue 卡片组件',
    small: '5 hours ago',
    tone: 'ember',
    to: undefined,
  },
)

const photo = computed(() => props.image || props.img)
const tag = computed(() => (props.to ? RouterLink : 'div'))
const photoStyle = computed(() =>
  photo.value ? { backgroundImage: `url("${photo.value}")` } : undefined,
)
</script>

<template>
  <!-- The library's 420px stage: the card grows into it, so opening a tile never
       pushes the rest of the page around. -->
  <div class="bend-shell" :class="`is-${tone}`">
    <component
      :is="tag"
      :to="to"
      class="bend-card"
      :class="{ 'is-link': Boolean(to) }"
    >
      <div class="bend-card__img" :style="photoStyle" aria-hidden="true" />

      <!-- Paper over the photo. Its `::after` is the fold itself. -->
      <div class="bend-card__sheet" aria-hidden="true" />

      <div class="bend-card__font">
        <div class="bend-card__title">{{ title }}</div>
        <div class="bend-card__small">{{ small }}</div>
        <div class="bend-card__content">
          <slot />
        </div>
      </div>
    </component>
  </div>
</template>

<style scoped>
/* ---------------------------------------------------------------------------
   Geometry — the library's numbers, named so a caller can resize the card
   without touching the fold. Defaults are dano-ui's: a 300 × 300 tile that
   opens to 420 inside a 420px stage, under a 255px photo, with the sheet
   overlapping the photo by 36px.
   --------------------------------------------------------------------------- */
.bend-shell {
  --bc-w: 300px;
  --bc-h: 300px;
  --bc-h-open: 420px;
  --bc-photo-h: 255px;
  --bc-radius: 40px;
  --bc-sheet-top: calc(var(--bc-photo-h) - 36px);

  --bc-surface: var(--paper);
  --bc-ink: var(--ink);
  --bc-small: var(--faint);
  --bc-detail: var(--muted);
  --bc-tone: var(--ember);
  --bc-shadow: 0 20px 10px rgb(0 0 0 / 0.1);

  display: flex;
  width: 100%;
  max-width: var(--bc-w);
  height: var(--bc-h-open);
  align-items: center;
  justify-content: center;
  margin-inline: auto;
}

.bend-shell.is-ember {
  --bc-tone: var(--ember);
}

.bend-shell.is-jade {
  --bc-tone: var(--jade);
}

.bend-shell.is-amber {
  --bc-tone: var(--amber);
}

/* A 10% black shadow carries the tile on the light theme and disappears on a
   dark panel, where it needs its own weight. */
.dark .bend-shell {
  --bc-shadow: 0 20px 12px rgb(0 0 0 / 0.45);
}

.bend-card {
  position: relative;
  display: block;
  width: 100%;
  max-width: var(--bc-w);
  height: var(--bc-h);
  overflow: hidden;
  border: 0.5px solid rgb(160 160 160 / 0.255);
  border-radius: var(--bc-radius);
  background-color: var(--bc-surface);
  box-shadow: var(--bc-shadow);
  color: inherit;
  text-decoration: none;
  /* The library rests a hair soft and resolves on hover; that 0.2px is the
     difference between a photo and a screenshot of one. */
  filter: blur(0.2px);
  transition:
    height 0.5s ease,
    filter 0.5s ease;
}

/* ---------------------------------------------------------------------------
   The photo and the sheet it folds into.
   --------------------------------------------------------------------------- */
.bend-card__img {
  width: 100%;
  height: var(--bc-photo-h);
  background-color: color-mix(in oklab, var(--bc-tone) 14%, var(--bc-surface));
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  filter: blur(20px);
  transition: filter 0.5s ease;
}

.bend-card__sheet {
  position: absolute;
  top: var(--bc-sheet-top);
  width: 100%;
  height: 200px;
  padding: 0 30px;
  border-radius: var(--bc-radius);
  background-color: var(--bc-surface);
  filter: blur(15px);
  transition: filter 0.5s ease;
}

/* The fold. A transparent square whose shadow is the sheet colour: 75px down
   and 40px of spread put its top edge 45px above the sheet, 70px right pulls it
   ~50px into the card, and the sheet's own radius meets it in between — one
   curved edge, no seam and nothing stacked over the photo. */
.bend-card__sheet::after {
  content: '';
  position: absolute;
  top: -80px;
  right: 0;
  height: 80px;
  aspect-ratio: 1;
  border-radius: 50%;
  box-shadow: 70px 75px 0 40px var(--bc-surface);
}

/* ---------------------------------------------------------------------------
   Text. Absolute offsets from the top, matching the fold, so the reveal moves
   nothing but the card's edge.
   --------------------------------------------------------------------------- */
.bend-card__font {
  cursor: default;
}

.bend-card.is-link {
  cursor: pointer;
}

.bend-card.is-link .bend-card__font {
  cursor: pointer;
}

.bend-card__title {
  position: absolute;
  top: calc(var(--bc-sheet-top) + 6px);
  width: 100%;
  height: 50px;
  padding: 15px 27px 0;
  overflow: hidden;
  color: var(--bc-ink);
  font-weight: bold;
  font-size: 1.3rem;
  line-height: 1.2;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.bend-card__small {
  position: absolute;
  top: calc(var(--bc-sheet-top) + 49px);
  width: 100%;
  height: 20px;
  padding: 0 29px;
  overflow: hidden;
  color: var(--bc-small);
  font-size: small;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.bend-card__content {
  position: absolute;
  top: calc(var(--bc-sheet-top) + 81px);
  width: 100%;
  max-height: 105px;
  padding: 0 29px;
  overflow: hidden;
  color: var(--bc-detail);
  font-size: 0.9rem;
  line-height: 1.5;
  opacity: 0.1;
  transition: opacity 0.4s 0.1s ease;
}

/* ---------------------------------------------------------------------------
   Open state
   --------------------------------------------------------------------------- */
.bend-card:hover,
.bend-card:focus-visible {
  height: var(--bc-h-open);
  filter: blur(0);
}

.bend-card:hover .bend-card__img,
.bend-card:focus-visible .bend-card__img,
.bend-card:hover .bend-card__sheet,
.bend-card:focus-visible .bend-card__sheet {
  filter: blur(0);
}

.bend-card:hover .bend-card__content,
.bend-card:focus-visible .bend-card__content {
  opacity: 1;
}

.bend-card.is-link:focus-visible {
  outline: 2px solid var(--bc-tone);
  outline-offset: 3px;
}

/* Touch devices never fire `:hover`, so the fold is presented open. */
@media (hover: none) {
  .bend-card {
    height: var(--bc-h-open);
  }

  .bend-card__img,
  .bend-card__sheet {
    filter: blur(0);
  }

  .bend-card__content {
    opacity: 1;
  }
}

/* Height, blur and the delayed fade are all motion; the tile stays readable. */
@media (prefers-reduced-motion: reduce) {
  .bend-card {
    height: var(--bc-h-open);
    transition: none;
  }

  .bend-card__img,
  .bend-card__sheet {
    filter: blur(0);
    transition: none;
  }

  .bend-card__content {
    opacity: 1;
    transition: none;
  }
}
</style>
