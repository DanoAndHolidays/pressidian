import { clamp, hash } from './color'
import type { AsciiOptions } from './types'

const CHARSETS: Record<string, string> = {
  standard: ' .:-=+*#%@', detailed: ' .,:;i1tfLCG08@', binary: ' 01', blocks: ' ░▒▓█', minimal: ' .:+#',
}
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5]

function polygon(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, sides: number, inner = 1) {
  ctx.beginPath()
  const count = inner === 1 ? sides : sides * 2
  for (let i = 0; i < count; i++) {
    const a = i / count * Math.PI * 2 - Math.PI / 2
    const radius = r * (i % 2 ? inner : 1)
    const px = x + Math.cos(a) * radius, py = y + Math.sin(a) * radius
    if (!i) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.closePath()
  ctx.fill()
}

/** Each primitive receives an already sampled and color-adjusted cell. */
export function drawCell(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, luma: number, index: number, time: number, o: AsciiOptions) {
  const cx = x + size / 2, cy = y + size / 2
  const value = clamp((o.invert ? 1 - luma : luma) + o.density / 100)
  const r = Math.max(.4, size * (.12 + .38 * value))
  const mode = o.renderMode === 'mixed' ? (['dots', 'cross', 'characters', 'pixel'] as const)[Math.floor(hash(index) * 4)] : o.renderMode
  ctx.lineWidth = Math.max(.7, size / 12)
  ctx.strokeStyle = ctx.fillStyle
  switch (mode) {
    case 'mosaic': ctx.fillRect(x, y, size + .4, size + .4); break
    case 'pixel': ctx.fillRect(x + 1, y + 1, size - 2, size - 2); break
    case 'dither': {
      const sub = size / 4
      for (let j = 0; j < 16; j++) if (value > BAYER[j] / 16) ctx.fillRect(x + (j % 4) * sub, y + Math.floor(j / 4) * sub, sub, sub)
      break
    }
    case 'characters': case 'hexdump': case 'matrix': case 'braille': {
      const chars = o.customChars || CHARSETS[o.charSet] || CHARSETS.standard
      let glyph = chars[Math.min(chars.length - 1, Math.floor(value * chars.length))]
      if (mode === 'hexdump') glyph = Math.round(value * 255).toString(16).padStart(2, '0').toUpperCase()
      if (mode === 'braille') glyph = String.fromCharCode(0x2800 + Math.round(value * 255))
      if (mode === 'matrix') {
        glyph = String.fromCharCode(0x30a0 + Math.floor(hash(index + Math.floor(time * 8)) * 96))
        const rain = (y / size + time * 8 + hash(Math.round(x)) * 40) % 28
        ctx.fillStyle = rain < 2 ? '#d2ffd0' : `rgba(75,235,120,${.15 + (1 - rain / 28) * .8})`
      }
      ctx.font = `${Math.round(size * (mode === 'hexdump' ? .55 : .95))}px monospace`
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText(glyph, cx, cy)
      break
    }
    case 'dots': case 'bubbles': case 'rings': case 'disco': {
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2)
      if (mode === 'rings' || mode === 'bubbles') ctx.stroke()
      else ctx.fill()
      if (mode === 'bubbles') { ctx.globalAlpha *= .4; ctx.beginPath(); ctx.arc(cx - r / 3, cy - r / 3, r / 4, 0, Math.PI * 2); ctx.fill() }
      if (mode === 'disco') { ctx.fillStyle = 'rgba(255,255,255,.3)'; ctx.fillRect(cx - 2, cy - r, 2, r) }
      break
    }
    case 'cross': case 'lines': case 'diagonal': case 'hatch': {
      ctx.beginPath()
      if (mode === 'cross') { ctx.moveTo(cx - r, cy); ctx.lineTo(cx + r, cy); ctx.moveTo(cx, cy - r); ctx.lineTo(cx, cy + r) }
      if (mode === 'lines') { ctx.moveTo(x, cy); ctx.lineTo(x + size, cy) }
      if (mode === 'diagonal' || mode === 'hatch') { ctx.moveTo(x, y + size); ctx.lineTo(x + size, y) }
      if (mode === 'hatch' && value > .35) { ctx.moveTo(x, y); ctx.lineTo(x + size, y + size) }
      if (mode === 'hatch' && value > .7) { ctx.moveTo(cx, y); ctx.lineTo(cx, y + size) }
      ctx.stroke(); break
    }
    case 'diamond': polygon(ctx, cx, cy, r, 4); break
    case 'stars': polygon(ctx, cx, cy, r, 5, .45); break
    case 'hexagons': polygon(ctx, cx + (Math.floor(y / size) % 2 ? size / 2 : 0), cy, size * .56, 6); break
    case 'triangles': polygon(ctx, cx, cy, size * .6, 3); break
    case 'hearts': {
      ctx.beginPath(); ctx.moveTo(cx, cy + r)
      ctx.bezierCurveTo(cx - r * 2, cy - r / 4, cx - r, cy - r * 1.5, cx, cy - r / 3)
      ctx.bezierCurveTo(cx + r, cy - r * 1.5, cx + r * 2, cy - r / 4, cx, cy + r)
      ctx.fill(); break
    }
    case 'voxel': case 'lego': {
      ctx.fillRect(x + .5, y + .5, size - 1, size - 1)
      ctx.fillStyle = 'rgba(255,255,255,.22)'; ctx.fillRect(x + 1, y + 1, size - 2, 2)
      ctx.fillStyle = 'rgba(0,0,0,.28)'; ctx.fillRect(x + size - 3, y + 3, 2, size - 3)
      if (mode === 'lego') { ctx.beginPath(); ctx.arc(cx, cy, size * .24, 0, Math.PI * 2); ctx.fill(); ctx.stroke() }
      break
    }
    // Halfblocks and contours require adjacent/half-cell samples and are drawn by the renderer.
    case 'halfblocks': case 'contour': break
  }
}
