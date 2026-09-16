# Bend card

A 1:1 tile that unfolds taller on hover. Only the card's **height** animates: the
photo keeps its size and the text block keeps its offset, so the card *uncovers*
its lower half instead of pushing it down. The photo is blurred at rest and
resolves on hover, and the copy below the fold goes from `opacity: 0.1` and
`blur(6px)` to fully resolved.

Vendored from [dano-ui](https://github.com/DanoAndHolidays/dano-ui)
(`src/components/BendCard.vue`, a single-component package by DanoAndHolidays).
The unfold mechanic is the author's; the changes are below.

```vue
<BendCard
  to="/notes?status=evergreen"
  :image="plate"
  title="常青笔记"
  small="3 篇"
  tone="jade"
>
  槽位内容在悬停展开时浮现
</BendCard>
```

| Prop | Default | Notes |
| --- | --- | --- |
| `image` | `''` | Any CSS background value, including a gradient. Empty means the tone alone paints the tile. |
| `title` | `Vue 卡片组件` | Card face. Ellipsised on one line. |
| `small` | `5 hours ago` | Secondary line under the title. |
| `tone` | `ember` | `ember` / `jade` / `amber`. Sets the fold line and the hover title colour. |
| `to` | — | Renders the card as a `RouterLink`. Otherwise it is a `div`. |

Size comes from custom properties, so a caller can resize the tile without a
variant: `--bend-w`, `--bend-h`, `--bend-h-open`, `--bend-photo-h`, `--bend-radius`.

## What changed from the original

**The fold is one SVG path, not a shadow.** The original stacked a rounded square
above the sheet and cast the sheet's colour down onto the photo with
`filter: drop-shadow(70px 75px 0 <sheet>)`. With a 40px radius and a 75px rise
that renders a ~75px dark disc over the photo — it reads as a hole punched in the
image rather than as a page turning over, and the shadow's edge does not meet the
sheet, so a seam shows. `bend-card__sheet` is now a single path holding the
sheet, the rising corner and the arc between them; it cannot seam, and there is
no filter to interact with the photo's own blur.

**The photo runs past the fold.** The arc bites `--bend-rise` (12px) into the
photo instead of into the sheet's own top edge. Without the overrun the arc eats
into the sheet and leaves a strip of photo above the fold line.

**The plate is the artwork.** The original defaults to a pixabay photo. The
homepage and the lab point at `artwork.ts`, which imports three local SVG plates
so the most prominent section of the site does not depend on a third-party CDN.
Each plate is tinted at render time — `multiply` over a warm haze in the light
theme, `screen` in the dark — so one asset serves both themes instead of the
original's hard-coded `#fff` sheet.

**The theme supplies the ink.** `--bend-surface`, `--bend-ink`, `--bend-line`
and the shadow come from the site tokens. The original hard-codes `#fff`, which
in the dark theme painted a white sheet under white text.

**Reduced motion opens the card.** Height, blur and the delayed fade are all
motion; with `prefers-reduced-motion: reduce` the card renders open and readable
rather than staying collapsed and dim. Touch devices get the same treatment via
`@media (hover: none)`.

## Where it is used

- `HomePage.vue` — the three note-maturity tiles, one per `STATUS_META` entry.
  Each links to `/notes?status=<key>`, which `NotesIndexPage.vue` reads as a
  filter.
- `BendCard.demo.vue` — the "折页卡片" showcase on the lab page.
