# Conveyor loop

A block-glyph loader: three blocks travel left to right across a dotted track, and each block carries a background patch matching the surface behind it. That patch is what hides the track underneath, so a block reads as *filling* a track cell rather than being drawn on top of it — and it is what erases the trail as the group moves on.

The three glyphs are `█ ▓ ▒`, heaviest first. All three share one linear timing and differ only by `animation-delay`, so the lightest rides ahead of the heaviest and the group reads as a short conveyor instead of three separate dots. `zIndex` descends with the index so the heavy head stays on top.

Ported from the supplied React original. The React version injected its `@keyframes` through a `<style>` element inside the component; that is unnecessary here, so the animation lives in the scoped stylesheet.

## `--loader-surface` is not optional

The masking background is intentionally *not* hard-coded. Set `--loader-surface` on or above the loader to the colour of whatever surface it sits on (usually `var(--canvas)`). Leave it unset and the block will mask the track with the wrong colour, showing a visible patch around each glyph. `loading.css` declares it for the boot screen; `ContentLoading.vue` declares it for the in-app loader because that one sits outside `.garden-loading`.

Ink comes from `currentColor`, so the parent's `color` decides it. The site passes `var(--ember)`, which already flips to a lifted orange in the dark theme, so one value serves both themes. The track is mixed down from the same ink rather than being a neutral grey, so it stays inside the accent ramp.

## The boot screen has a second copy

`index.html` draws the same loader as plain markup, because the startup overlay has to render before any component code has been parsed — a Vue component cannot be used there. Its styles live in `src/styles/loading.css` under the `garden-loading__*` names. The travel distance, 1.8s duration and 0.05s stagger are duplicated between the two; change them together or the two loaders will drift apart.

With `prefers-reduced-motion: reduce` the blocks are dropped and the static track is left behind, since without travel they would all pile up on the first cell.
