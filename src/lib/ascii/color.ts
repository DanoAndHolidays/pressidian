import type { AsciiOptions } from './types'

export const clamp = (n: number, low = 0, high = 1) => Math.min(high, Math.max(low, n))
export const luminance = (r: number, g: number, b: number) => .2126 * r + .7152 * g + .0722 * b
export const hash = (n: number) => { const v = Math.sin(n * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v) }

export function tone(value: number, points: AsciiOptions['toneCurve']) {
  if (points.length < 2) return value
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1], b = points[i]
    if (value <= b.x) return a.y + (b.y - a.y) * clamp((value - a.x) / Math.max(.0001, b.x - a.x))
  }
  return points[points.length - 1].y
}

/** RGB stays normalized until the final quantization. Order follows the supplied recipe. */
export function adjustColor(rgb: number[], o: AsciiOptions): [number, number, number] {
  let color = rgb.map(v => clamp(((v / 255 + o.brightness / 100) - .5) * o.contrast / 100 + .5))
  const luma = luminance(color[0], color[1], color[2])
  color = color.map(v => clamp(luma + (v - luma) * o.saturation / 100))
  const gray = luminance(color[0], color[1], color[2])
  color = color.map(v => v + (gray - v) * clamp(o.grayscale / 100))
  const tint = o.tint.replace('#', '')
  const channels = [0, 2, 4].map(i => parseInt(tint.slice(i, i + 2), 16) / 255)
  color = color.map((v, i) => {
    const t = Number.isFinite(channels[i]) ? channels[i] : 0
    const blend = o.overlayBlend === 'multiply' ? v * t
      : o.overlayBlend === 'screen' ? 1 - (1 - v) * (1 - t)
      : o.overlayBlend === 'overlay' ? (v < .5 ? 2 * v * t : 1 - 2 * (1 - v) * (1 - t))
      : o.overlayBlend === 'difference' ? Math.abs(v - t) : t
    return Math.round(clamp(v + (blend - v) * clamp(o.tintOpacity / 100)) * 255)
  })
  return color as [number, number, number]
}
