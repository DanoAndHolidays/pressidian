# ASCII planet

The hero renders a procedural 3D gas giant with Three.js: a 128 × 64 sphere and a 256-segment equatorial ring mesh. Both have procedural shader materials, directional lighting, and analytical ring/sphere shadows. The sphere rotates around its polar axis. No city image or external texture is used.

The second GPU pass adapts the `characters` mode from the preserved `visual/pixel-glitch-reboot` branch: `src/lib/ascii/primitives.ts` supplies the standard ` .:-=+*#%@` ramp and luminance-to-character selection. The live planet is sampled into cells, then a locally generated glyph atlas masks each cell. The original scene alpha clips the characters to the planet and rings, keeping the rest transparent. No video or remote asset is loaded.

`PLANET_PRESET` in `scene.ts` keeps the Vignette Bloom brightness 12, contrast 115, vignette 38, bloom 25 and wave settings. Cells measure 7.5 × 10.5 CSS pixels at every viewport size, independently of DPR. Glyphs are generated once in `../ascii-art/glyph-atlas.ts`; subsequent frames require no Canvas2D drawing or GPU readback. Bloom is restricted to glyph ink so the character shapes remain crisp.

The `scale` prop sizes the model on top of the authored camera framing. The preset camera is wide, so `1` leaves the planet at roughly 61% of the canvas width; the hero passes a larger value so the planet fills its column instead of floating in empty space. Glyph ink responds to the site theme, and the light-theme stops are deliberately deep — a brighter highlight sat too close to the warm paper and the characters washed out.

## Glitch

`uTime` is quantised into ~13 Hz slots and each slot draws a fresh seed, so the effect is a discrete flicker rather than a smooth wobble. A hash gate means only a minority of slots tear, which is what keeps it reading as a fault instead of a permanent offset; `uGlitch` (`PLANET_PRESET.glitch`, default 0.42) is that slot probability, so `0` disables the pass outright. Within a tearing slot, two narrow horizontal bands are displaced sideways, snapped to the cell grid so the band edges land between glyph rows.

Edge dispersion is deliberately *not* an RGB split. The glyph palette is warm — sand and cream ink with blue at roughly a third of red — so re-sampling the blue channel moves it by almost nothing and the fringes come out one-sided. Instead the two laterally-offset samples are split into opposing tints (`disperseWarm` / `disperseCool`), which makes one edge of a torn band fringe red and the other cyan whatever the ink colour is. The offset is in UV and must clear about one cell (`cellWidth / canvasWidth`, ~0.011 at 680px) before it does anything, because `cellAt` snaps its sample to a cell centre and a sub-cell offset rounds away.

Both the displacement and the dispersion are weighted by each displaced sample's own alpha. Sampling off the silhouette returns alpha 0, so an unweighted blend drags edge pixels toward black and punches holes in the glyphs.

The scene runs at up to 30 fps, pauses when hidden/offscreen, renders statically for reduced motion, and releases GPU resources including the glyph atlas on unmount. A static ASCII planet is shown if WebGL cannot initialize or loses its context; restoration recreates the scene with the current theme.

In dev, `window.__planet.force(glitch, time)` pins the glitch and the clock so a torn frame can be inspected, `release()` resumes, and `reset()` restores the preset. It is stripped from production builds.

References: [Three.js render targets](https://threejs.org/manual/en/rendertargets.html), [RingGeometry](https://threejs.org/docs/pages/RingGeometry.html). The supplied preset is reimplemented locally, without depending on 21st.dev internals.
