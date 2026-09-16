# Dano brand assets

`dano-logo.png` is the original transparent logo from the owner's GitHub profile
repository, downloaded unchanged on 2026-09-12 at the owner's request.

- Source: https://github.com/DanoAndHolidays/DanoAndHolidays/blob/main/logo.png
- Raw: https://raw.githubusercontent.com/DanoAndHolidays/DanoAndHolidays/main/logo.png
- Size: 450 × 200, PNG with alpha

Keep this local asset so the website and startup screen do not depend on GitHub
being reachable. The fox identity uses the native 🦊 emoji and the blocky
four-square mark drawn in `AppHeader.vue`.

## `loading.css` is not part of the app bundle

It is linked directly from `index.html` so it applies on the very first paint,
before Tailwind or the Vue bundle have been requested. It styles the
pre-JavaScript boot screen, which reproduces the opening frame of
`src/components/boot/BootSequence.vue` — the two must stay in step, and the
component is the authority.

## The old signature animation is gone

`dano-loading.svg` (a cursive Dano signature drawn stroke by stroke) and
`scripts/generate-loading-signature.mjs` were removed when the startup screen
became a pixel terminal. Do not restore them: the hand-drawn signature was the
previous visual identity, and two competing intro languages is exactly what the
2026-09 visual overhaul set out to remove.

## Scene paintings live elsewhere

The three megastructure paintings used as page backdrops are masters in
`design-source/scenes/`, turned into `public/scenes/*.{avif,webp}` by
`scripts/generate-scenes.mjs`. See `src/data/scenes.ts`.
