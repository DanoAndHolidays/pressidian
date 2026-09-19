# Footer section 5

`FooterSection5.vue` is the full-bleed footer: an oversized outline wordmark sitting in the page above a panel whose top edge clips the word's baseline, with a brand block on the left and link columns on the right. Ported from the supplied `footer-section-5` React component.

## What the port changed

**`next/link` → `RouterLink`.** An internal `to` renders a router link; an `href` renders a plain anchor opened in a new tab. A link may carry a `note`, which is rendered as a right-aligned aside — that is where this site puts a note count or a mail address.

**The copy left the component.** Brand, headline, caption and columns are props, and the logo and action row are slots, so `AppFooter.vue` feeds in the site's own navigation instead of the reference's placeholder `#` links. Nothing in the footer is invented: the columns are the header's routes, the three maturity deep links the homepage cards already use, and the `CONTACTS` rows.

**The blue panel and its shader backdrop are gone.** The original paints the panel `#1C76F8` and refracts it through `FlutedGlass` (@paper-design/shaders-react). Neither belongs here:

- there is no Vue build of `@paper-design/shaders-react`;
- a saturated blue slab contradicts a site whose whole surface is warm paper;
- the effect is a *static* repeating-reed pattern, and every CSS approximation of it on a panel this size reads as corrugated wood rather than glass — which is worse than not having it.

So the panel is `--paper` against the page's `--canvas`, separated by a hairline. The clip line still reads as a deliberate cut, and the footer stays in the same surface language as the rest of the site. If a tinted slab is ever wanted back, it is a background change on `.footer-section-5__panel` plus the `--footer-*` tokens on the root — nothing about the layout depends on the colour.

## Tokens

The panel's colour, text, link, note and hairline colours are declared once on `.footer-section-5` as `--footer-bg`, `--footer-fg`, `--footer-muted`, `--footer-link`, `--footer-note`, `--footer-line` and `--footer-word`. They sit on the root rather than on the panel because the outline wordmark is a *sibling* of the panel and still reads `--footer-word`. All of them resolve from the theme, so both themes work without a `.dark` override block.

The action row is styled through `:deep()`: a call site supplies icons and `aria-label`s only, and gets buttons whose ring, colour and hover already sit correctly on the footer surface.

## The wordmark

Filled, not outlined, and set in `--font-sans` rather than the site's serif heading stack. At this size the serif's thick/thin contrast turns the word into a calligraphic flourish, which is the voice the site reserves for its headings; an even-stroke sans at 600 reads as a mark instead — the same choice the React original made with `font-semibold`.

The fill is `color-mix(in oklab, var(--ink) 20%, transparent)` — solid letterforms mixed well down towards the surface. At full ink strength a word this size would out-shout everything above it, and the footer's job is to carry links, not to be the page's headline. Raise the percentage in `--footer-word` to make it louder; the composition does not depend on the value.

`font-size: clamp(3.5rem, 16.5vw, 18rem)`. The middle term holds about 88% of the viewport width — large enough to fill most of a phone's width, not so large that it runs into the edges on a desktop — and the rem ceiling stops the word growing without limit on very wide screens. The vw term is larger than the serif version needed because a sans uppercase is that much narrower at the same size; the two were matched by measuring the rendered width, not by eye.

`margin-bottom: -0.09em` is what pulls the panel up over the glyph bottoms. It is a fraction of the word's own size so the cut holds at every width, and it is smaller than the reference's `-0.12em` because sans caps sit higher in the line box than the serif's did — at the reference's value the panel swallowed a fifth of each letter.

The word is `aria-hidden`: it is a shape, and the brand is already named by the logo slot and the copyright line.

## Slots

| Slot | Content |
| --- | --- |
| `logo` | The mark above the headline. `AppFooter` passes `DanoWordmark`. |
| `social` | Action row. Styled by the component, filled by the call site. |
