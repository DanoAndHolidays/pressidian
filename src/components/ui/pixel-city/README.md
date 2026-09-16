# Pixel city

`PixelCity.vue` renders the owner's transparent `public/brand/megacity-cutout.png` as a Canvas2D mosaic, preserving its original aspect ratio and alpha silhouette. The default cell size is 3 CSS pixels (configurable through `cellSize`). RGB is averaged with alpha weighting so transparent edge pixels do not introduce dark halos.

Sampling is cached until the image, size, or cell size changes. A subtle opacity wave runs at up to 30 fps, pauses when offscreen or the page is hidden, and becomes static for reduced motion. There are no estimated subject masks or synthetic buildings.
