# ASCII planet

The hero uses three GPU passes: a procedural gas giant and equatorial rings, an ASCII character image, then horizontal tears and edge dispersion. All assets are generated locally; there are no model or texture downloads.

## Rendering and colour

`scene.ts` owns the renderer, meshes, glyph atlas and two render targets. The scene target stores the shaded sphere/rings. The ASCII target is sized to the drawing buffer (DPR capped at 2), with cells measured in CSS pixels (7.5 × 10.5). The final pass samples the finished strokes, so horizontal displacement moves their shapes and alpha together.

The palette in `postFragment` is authored in display sRGB to preserve the original artwork. Both intermediate textures explicitly use `NoColorSpace`: the first contains scene data; the second contains already-authored display values that must not be decoded or gamma-encoded again. The final canvas explicitly uses `SRGBColorSpace` and `NoToneMapping`. Do not append `colorspace_fragment` to these display-colour passes without first converting the authored palette to linear values.

The ASCII image and final output store **premultiplied alpha** (`rgb * alpha`), matching the renderer's `premultipliedAlpha: true` context. Linear filtering therefore does not leak bright RGB from transparent pixels into ring/glyph edges. No additional material blending is used for the fullscreen passes. `preserveDrawingBuffer` stays off.

## Glitch

`PLANET_GLITCH` is the share of 8 Hz slots that tear (default 0.21, half the previous 0.42 probability). Each burst still lasts 125 ms. Integer hashing keeps the schedule independent of GPU implementations of `sin()`, while a fresh per-scene seed changes the pattern on each visit. Each burst selects 1–3 regions across 14–82% of the canvas height, with variable horizontal position and length. Regions are 1–3 character rows high and shift left or right by 1–3 cells. Band bounds and cell indices use the same units.

The third pass adds stronger, sharp offset copies 2.4–3.8 CSS pixels to either side of the shifted strokes. The warm accent, vermilion and mixed ink come from the same `--scramble-*` CSS tokens as `DecryptText`, including its OKLab mixtures and theme changes. Torn glyphs also use the title's three ink buckets; undisturbed glyphs keep their original shading. Canvas2D resolves the CSS colours to display-sRGB bytes only at initialization/theme changes, never per frame. Displaced copies retain their full coverage and are composed behind the base stroke with premultiplied alpha, so edges remain visible without bright transparent-pixel leakage.

## Lifecycle

Resize, theme and visibility events only request a frame. Canvas resizing, clearing and all three render passes run together inside `requestAnimationFrame`. Hidden/offscreen scenes pause without rendering; resuming resets the time baseline so background time does not jump the animation. Identical sizes/DPR do not reallocate or clear buffers. Reduced motion draws one static, glitch-free frame after each invalidation and then stops.

A lost WebGL context displays the static ASCII fallback and releases GPU resources. Restoration recreates the scene using the current theme. Unmount disposes both render targets, materials, geometries, atlas and renderer.

## Verification

In development, `window.__planet.force(glitch, time, seed?)` freezes the clock and requests a frame, `release()` resumes and `reset()` restores the preset. These controls are stripped from production. With a fixed time and seed, compare glitch 0 and 1: changes should occupy only a few regions, with visible warm/orange-red edges extending beyond the original strokes. Vary time/seed to inspect position and length diversity. Reduced motion must show the same pixels as glitch 0.

Check light/dark themes, desktop/mobile widths, DPR 1/2, visibility resume and context loss/restoration. Compare the production build under `/pressidian/` using `scripts/serve-pages.mjs`, not just the Vite development server. A browser-profile-specific brightness difference also requires checking that profile's extensions and GPU settings; the component cannot override third-party page modifications.
