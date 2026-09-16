<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

/**
 * Bend card — a 1:1 tile that unfolds taller on hover.
 *
 * Vendored from [dano-ui](https://github.com/DanoAndHolidays/dano-ui)
 * (`src/components/BendCard.vue`, a single-component package by
 * DanoAndHolidays). The unfold is the author's mechanic and is kept: only the
 * card's height animates, the photo keeps its size and the sheet keeps its
 * offset, so the card *uncovers* its lower half rather than pushing it down.
 * Everything that changed is listed in `README.md`.
 *
 * The fold is drawn as one SVG shape rather than a sheet with a decorative
 * corner. The author's version stacked a rounded square above the sheet and cast
 * its shadow down onto the photo with `filter: drop-shadow()`; at 40px radius
 * and a 75px rise that renders a ~75px dark disc over the photo, which reads as
 * a hole rather than a curve. One path with the arc built into it has no
 * stacking or filter behaviour to go wrong, and it cannot seam.
 */
defineOptions({ name: 'BendCard' })

/**
 * `Tone | (string & {})` autocompletes the three site accents but still accepts
 * the loose `string` that `STATUS_META.tone` is typed as elsewhere. A value with
 * no matching rule falls through to the base ember tone rather than breaking.
 */
type Tone = 'ember' | 'jade' | 'amber' | (string & {})

const props = withDefaults(
  defineProps<{
    /** Photo behind the fold. Any CSS background value, including a gradient. */
    image?: string
    title?: string
    /** Small line under the title — a timestamp, a count, a category. */
    small?: string
    /** Accent used for the fold line and the hover title. */
    tone?: Tone
    /** Turns the whole card into a `RouterLink`. */
    to?: string
  }>(),
  {
    image: '',
    title: 'Vue 卡片组件',
    small: '5 hours ago',
    tone: 'ember',
    to: undefined,
  },
)

const tag = computed(() => (props.to ? RouterLink : 'div'))

/** Without a photo the tone paints the whole tile, so the card still reads. */
const surface = computed(() => (props.image ? `url("${props.image}")` : 'none'))
</script>

<template>
  <component
    :is="tag"
    :to="to"
    class="bend-card"
    :class="[`is-${tone}`, { 'is-link': Boolean(to) }]"
    :style="image ? { '--bend-image': surface } : undefined"
  >
    <div class="bend-card__photo" aria-hidden="true" />

    <!-- The fold: sheet, rising corner and the arc between them, as one path. -->
    <svg
      class="bend-card__sheet"
      viewBox="0 0 300 81"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M0 12 A 64 12 0 0 0 64 0 L 260 0 A 40 40 0 0 1 300 40 L 300 81 L 0 81 Z"
        fill="var(--bend-surface)"
      />
      <path
        d="M0 12 A 64 12 0 0 0 64 0"
        fill="none"
        stroke="var(--bend-tone)"
        stroke-width="1.5"
        stroke-opacity="0.85"
        vector-effect="non-scaling-stroke"
      />
    </svg>

    <div class="bend-card__head">
      <div class="bend-card__title">{{ title }}</div>
      <div class="bend-card__small">{{ small }}</div>
    </div>

    <div class="bend-card__content">
      <slot />
    </div>
  </component>
</template>

<style scoped>
/* ---------------------------------------------------------------------------
   Geometry. `--bend-rise` is the one number the fold is built around: the sheet
   starts at the photo's bottom edge and rises by this much over the arc's
   width. Change it and the path's first arc is the only thing that has to
   follow, because the SVG is stretched to the gap it is given.
   --------------------------------------------------------------------------- */
.bend-card {
  --bend-w: 300px;
  --bend-h: 300px;
  --bend-h-open: 420px;
  --bend-photo-h: 255px;
  --bend-rise: 12px;
  --bend-radius: 40px;
  --bend-pad-x: 29px;
  --bend-head-top: 225px;
  --bend-content-top: 300px;
  /* The arc is shallow on purpose: the tile is only 300px wide, so a deep curve
     reads as a bite taken out of the photo instead of a page turning over. */
  --bend-sheet-top: calc(var(--bend-photo-h) - var(--bend-rise));
  --bend-sheet-h: 81px;

  --bend-tone: var(--ember);
  --bend-surface: var(--paper);
  --bend-ink: var(--ink);
  --bend-small: var(--faint);
  --bend-detail: var(--muted);
  --bend-line: var(--line);
  --bend-shadow: 0 20px 10px rgb(24 22 16 / 0.1);

  /* Tint mixed over the plate so one asset serves both themes: a warm haze in
     the light theme, a deep one in the dark. */
  --bend-tint: #f3e4d2;
  --bend-glow: #fff4e8;
  --bend-tint-blend: multiply;
  --bend-glow-alpha: 0.24;

  position: relative;
  display: block;
  width: 100%;
  max-width: var(--bend-w);
  height: var(--bend-h);
  margin-inline: auto;
  overflow: hidden;
  border: 1px solid var(--bend-line);
  border-radius: var(--bend-radius);
  background-color: var(--bend-surface);
  box-shadow: var(--bend-shadow);
  transition:
    height 0.5s ease,
    border-color 0.5s ease,
    box-shadow 0.5s ease;
}

.bend-card.is-ember {
  --bend-tone: var(--ember);
  --bend-tint: #f3e4d2;
  --bend-glow: #fff4e8;
}
.bend-card.is-jade {
  --bend-tone: var(--jade);
  --bend-tint: #dfe9df;
  --bend-glow: #f2f8ef;
}
.bend-card.is-amber {
  --bend-tone: var(--amber);
  --bend-tint: #f4e6cf;
  --bend-glow: #fff6e4;
}

/* Dark theme: the plate is a glow in the dark, not a washed-out light photo. */
.dark .bend-card {
  --bend-tint-blend: screen;
  --bend-glow-alpha: 0.1;
  --bend-shadow: 0 20px 10px rgb(0 0 0 / 0.34);
}
.dark .bend-card.is-ember {
  --bend-tint: #401e0c;
  --bend-glow: #7c4020;
}
.dark .bend-card.is-jade {
  --bend-tint: #0e2419;
  --bend-glow: #276043;
}
.dark .bend-card.is-amber {
  --bend-tint: #382306;
  --bend-glow: #7d571a;
}

.bend-card__photo {
  position: absolute;
  inset: 0 0 auto;
  /* Runs `--bend-rise` past the fold, so the arc bites into photo rather than
     into the sheet's own edge and no bright strip is left above the fold. */
  height: calc(var(--bend-photo-h) + var(--bend-rise));
  background-image: var(--bend-image, none);
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  transition: filter 0.5s ease;
}

/* Warm haze plus a faint grain, so a flat plate reads as a photograph. */
.bend-card__photo::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    repeating-conic-gradient(
      from 12deg at 34% 26%,
      rgb(255 255 255 / 0.05) 0deg 6deg,
      transparent 6deg 17deg
    ),
    radial-gradient(
      70% 85% at 28% 22%,
      color-mix(in oklab, var(--bend-glow) calc(var(--bend-glow-alpha) * 100%), transparent),
      transparent 64%
    ),
    linear-gradient(158deg, var(--bend-glow), var(--bend-tint));
  mix-blend-mode: var(--bend-tint-blend);
}

.bend-card__sheet {
  position: absolute;
  top: var(--bend-sheet-top);
  left: 0;
  display: block;
  width: 100%;
  height: var(--bend-sheet-h);
}

/* ---------------------------------------------------------------------------
   Text. Fixed offsets from the top, matching the fold, so the reveal does not
   move them either.
   --------------------------------------------------------------------------- */
.bend-card__head {
  position: absolute;
  top: var(--bend-head-top);
  right: 0;
  left: 0;
  height: 60px;
  padding: 15px var(--bend-pad-x) 0;
  cursor: default;
  pointer-events: none;
}

.bend-card__title {
  overflow: hidden;
  color: var(--bend-ink);
  font-weight: 600;
  font-size: 1.3rem;
  line-height: 1.2;
  white-space: nowrap;
  text-overflow: ellipsis;
  transition: color 0.4s ease;
}

.bend-card__small {
  margin-top: 4px;
  overflow: hidden;
  color: var(--bend-small);
  font-size: 0.78rem;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.bend-card__content {
  position: absolute;
  top: var(--bend-content-top);
  right: 0;
  left: 0;
  /* Fills whatever the card has left below the head, so raising `--bend-h-open`
     gives the copy more room instead of leaving a band of empty sheet. */
  max-height: calc(var(--bend-h-open) - var(--bend-content-top) - 20px);
  padding: 0 var(--bend-pad-x);
  overflow: hidden;
  color: var(--bend-detail);
  font-size: 0.9rem;
  line-height: 1.5;
  opacity: 0.1;
  transition:
    opacity 0.4s 0.1s ease,
    filter 0.4s ease;
  /* Blurred with the photo at rest, so the lower half resolves together. */
  filter: blur(6px);
}

/* ---------------------------------------------------------------------------
   Open state
   --------------------------------------------------------------------------- */
.bend-card:hover,
.bend-card:focus-visible {
  height: var(--bend-h-open);
  border-color: color-mix(in oklab, var(--bend-tone) 42%, var(--bend-line));
  box-shadow: var(--bend-shadow), 0 12px 32px -12px rgb(24 22 16 / 0.2);
}

.bend-card:hover .bend-card__photo,
.bend-card:focus-visible .bend-card__photo {
  filter: blur(0) saturate(1.04);
}

.bend-card:hover .bend-card__content,
.bend-card:focus-visible .bend-card__content {
  opacity: 1;
  filter: blur(0);
}

.bend-card:hover .bend-card__title,
.bend-card:focus-visible .bend-card__title {
  color: var(--bend-tone);
}

.bend-card.is-link {
  cursor: pointer;
}

.bend-card.is-link:focus-visible {
  outline: 2px solid var(--bend-tone);
  outline-offset: 3px;
}

/* Touch devices never fire `:hover`, so the fold is presented open. */
@media (hover: none) {
  .bend-card {
    height: var(--bend-h-open);
  }

  .bend-card__photo {
    filter: blur(0);
  }

  .bend-card__content {
    opacity: 1;
    filter: blur(0);
  }
}

/* Height, blur and the delayed fade are all motion; the tile stays readable. */
@media (prefers-reduced-motion: reduce) {
  .bend-card {
    height: var(--bend-h-open);
    transition: none;
  }

  .bend-card__photo,
  .bend-card__content {
    filter: blur(0);
    opacity: 1;
    transition: none;
  }
}
</style>
