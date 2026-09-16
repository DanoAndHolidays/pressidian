import { CanvasTexture, LinearFilter } from 'three'

// Ported from visual/pixel-glitch-reboot:src/lib/ascii/primitives.ts.
// The ramp is ordered by ink density; luminance selects a character per cell.
export const ASCII_CHARACTERS = ' .:-=+*#%@'

/** Rasterize the font once. Live frames select glyphs entirely on the GPU. */
export function createGlyphAtlas() {
  const canvas = document.createElement('canvas')
  const cellWidth = 32, cellHeight = 44
  canvas.width = cellWidth * ASCII_CHARACTERS.length
  canvas.height = cellHeight
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('ASCII glyph atlas is unavailable')
  ctx.fillStyle = '#fff'
  ctx.font = '600 32px monospace'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  Array.from(ASCII_CHARACTERS).forEach((glyph, i) => {
    ctx.fillText(glyph, (i + .5) * cellWidth, cellHeight / 2)
  })
  const texture = new CanvasTexture(canvas)
  texture.minFilter = LinearFilter
  texture.magFilter = LinearFilter
  texture.generateMipmaps = false
  return texture
}
