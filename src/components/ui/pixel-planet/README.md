# ASCII planet

The hero renders a procedural 3D gas giant with Three.js: a 128 × 64 sphere and a 256-segment equatorial ring mesh. Both have procedural shader materials, directional lighting, and analytical ring/sphere shadows. The sphere rotates around its polar axis. No city image or external texture is used.

The second GPU pass adapts the `characters` mode from the preserved `visual/pixel-glitch-reboot` branch: `src/lib/ascii/primitives.ts` supplies the standard ` .:-=+*#%@` ramp and luminance-to-character selection. The live planet is sampled into cells, then a locally generated glyph atlas masks each cell. The original scene alpha clips the characters to the planet and rings, keeping the rest transparent. No video or remote asset is loaded.

`PLANET_PRESET` in `scene.ts` keeps the Vignette Bloom brightness 12, contrast 115, vignette 38, bloom 25 and wave settings. Cells measure 7.5 × 10.5 CSS pixels at every viewport size, independently of DPR. Glyphs are generated once in `../ascii-art/glyph-atlas.ts`; subsequent frames require no Canvas2D drawing or GPU readback. Bloom is restricted to glyph ink so the character shapes remain crisp.

The `scale` prop sizes the model on top of the authored camera framing. The preset camera is wide, so `1` leaves the planet at roughly 61% of the canvas width; the hero passes a larger value so the planet fills its column instead of floating in empty space. Glyph ink responds to the site theme, and the light-theme stops are deliberately deep — a brighter highlight sat too close to the warm paper and the characters washed out.

The scene runs at up to 30 fps, pauses when hidden/offscreen, renders statically for reduced motion, and releases GPU resources including the glyph atlas on unmount. A static ASCII planet is shown if WebGL cannot initialize or loses its context; restoration recreates the scene with the current theme.

References: [Three.js render targets](https://threejs.org/manual/en/rendertargets.html), [RingGeometry](https://threejs.org/docs/pages/RingGeometry.html). The supplied preset is reimplemented locally, without depending on 21st.dev internals.
