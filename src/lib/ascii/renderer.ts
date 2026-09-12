import { adjustColor, clamp, hash, luminance, tone } from './color'
import { drawCell } from './primitives'
import type { AsciiOptions } from './types'

function surface(readback = false) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d', { willReadFrequently: readback })
  if (!ctx) throw new Error('Canvas2D is unavailable')
  return { canvas, ctx }
}
type Surface = ReturnType<typeof surface>
type Cell = { x: number; y: number; rgb: number[]; top: number[]; bottom: number[]; luma: number; color: string; topColor: string; bottomColor: string }

/** A local Canvas2D renderer; no dependency on the reference site's internal code. */
export class AsciiRenderer {
  private source = surface(true)
  private effect = surface()
  private scratch = surface()
  private glow = surface()
  private cells: Cell[] = []
  private ctx: CanvasRenderingContext2D
  private width = 1
  private height = 1
  private cols = 1
  private mask: HTMLImageElement | null = null
  private maskUrl: string | null = null
  private disposed = false

  constructor(private canvas: HTMLCanvasElement, private photo: HTMLImageElement, private options: AsciiOptions) {
    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) throw new Error('Canvas2D is unavailable')
    this.ctx = ctx
  }

  resize(width: number, height: number) {
    // Mosaic is deliberately rendered at CSS-pixel resolution, independent of retina DPR.
    this.width = Math.max(1, Math.round(width)); this.height = Math.max(1, Math.round(height))
    for (const c of [this.canvas, this.source.canvas, this.effect.canvas, this.scratch.canvas]) {
      c.width = this.width; c.height = this.height
    }
    this.glow.canvas.width = Math.max(1, Math.round(this.width / 4))
    this.glow.canvas.height = Math.max(1, Math.round(this.height / 4))
    const scale = Math.max(this.width / this.photo.naturalWidth, this.height / this.photo.naturalHeight)
    const w = this.photo.naturalWidth * scale, h = this.photo.naturalHeight * scale
    this.source.ctx.drawImage(this.photo, (this.width - w) * .12, (this.height - h) / 2, w, h)
    this.sample()
    this.loadMask()
  }

  setOptions(options: AsciiOptions) {
    const resample = options.cellSize !== this.options.cellSize
    this.options = options
    if (resample) this.sample()
    else this.prepareColors()
    this.loadMask()
  }

  private loadMask() {
    const url = this.options.mask.enabled ? this.options.mask.dataUrl : null
    if (url === this.maskUrl) return
    this.maskUrl = url; this.mask = null
    if (!url || !url.startsWith('data:image/')) return
    const image = new Image()
    image.onload = () => {
      if (!this.disposed && this.maskUrl === url) { this.mask = image; this.render(0, false) }
    }
    image.src = url
  }

  private sample() {
    const { width: w, height: h } = this
    const size = Math.max(4, Math.round(this.options.cellSize))
    this.cols = Math.ceil(w / size)
    const pixels = this.source.ctx.getImageData(0, 0, w, h).data
    this.cells = []
    // Exact box averages, once per source/size change; no readback in the animation loop.
    for (let y = 0; y < h; y += size) for (let x = 0; x < w; x += size) {
      const top = [0, 0, 0], bottom = [0, 0, 0], count = [0, 0]
      for (let py = y; py < Math.min(y + size, h); py++) for (let px = x; px < Math.min(x + size, w); px++) {
        const half = py < y + size / 2 ? 0 : 1
        const sum = half ? bottom : top, i = (py * w + px) * 4
        sum[0] += pixels[i]; sum[1] += pixels[i + 1]; sum[2] += pixels[i + 2]; count[half]++
      }
      const rgb = top.map((v, i) => (v + bottom[i]) / Math.max(1, count[0] + count[1]))
      this.cells.push({ x, y, rgb, top: top.map(v => v / Math.max(1, count[0])), bottom: count[1] ? bottom.map(v => v / count[1]) : rgb, luma: luminance(...rgb as [number, number, number]) / 255, color: '', topColor: '', bottomColor: '' })
    }
    this.prepareColors()
  }

  private prepareColors() {
    const color = (rgb: number[]) => {
      const adjusted = adjustColor(rgb, this.options)
      return 'rgb(' + adjusted.map(v => this.options.invert ? 255 - v : v).join(',') + ')'
    }
    for (const cell of this.cells) {
      cell.color = color(cell.rgb); cell.topColor = color(cell.top); cell.bottomColor = color(cell.bottom)
    }
  }

  private copy(from: HTMLCanvasElement, to: Surface, filter = 'none') {
    to.ctx.clearRect(0, 0, to.canvas.width, to.canvas.height)
    to.ctx.filter = filter
    to.ctx.drawImage(from, 0, 0, to.canvas.width, to.canvas.height)
    to.ctx.filter = 'none'
  }

  private blur() {
    const o = this.options
    if (o.blurType === 'off' || !o.blurAmount) return
    const amount = o.blurAmount / 4
    if (['directional', 'motion'].includes(o.blurType)) {
      this.copy(this.effect.canvas, this.scratch)
      const ctx = this.effect.ctx, angle = o.blurAngle * Math.PI / 180
      ctx.clearRect(0, 0, this.width, this.height); ctx.globalAlpha = 1 / 9
      for (let i = 0; i < 9; i++) {
        const offset = (i - (o.directionalBothSides ? 4 : 0)) / 8 * amount * 2
        ctx.drawImage(this.scratch.canvas, Math.cos(angle) * offset, Math.sin(angle) * offset)
      }
      ctx.globalAlpha = 1
      return
    }
    this.copy(this.effect.canvas, this.scratch, `blur(${amount}px)`)
    const ctx = this.scratch.ctx
    if (['tilt', 'tilt-shift', 'lens', 'progressive'].includes(o.blurType)) {
      let gradient: CanvasGradient
      if (o.blurType === 'lens') {
        const x = this.width * o.blurCenterX / 100, y = this.height * o.blurCenterY / 100
        gradient = ctx.createRadialGradient(x, y, 0, x, y, Math.max(this.width, this.height) / 2)
        gradient.addColorStop(0, 'transparent'); gradient.addColorStop(clamp(o.lensFocus / 100, 0, .99), 'transparent'); gradient.addColorStop(1, '#000')
      } else {
        gradient = ctx.createLinearGradient(0, 0, 0, this.height)
        if (o.blurType === 'progressive') {
          gradient.addColorStop(0, o.progressiveReverse ? '#000' : 'transparent')
          gradient.addColorStop(clamp(o.progressivePosition / 100, .01, .99), 'transparent')
          gradient.addColorStop(1, o.progressiveReverse ? 'transparent' : '#000')
        } else {
          const center = o.tiltPosition / 100, focus = o.tiltFocus / 200, feather = o.tiltFeather / 100
          gradient.addColorStop(0, '#000'); gradient.addColorStop(clamp(center - focus - feather), '#000')
          gradient.addColorStop(clamp(center - focus), 'transparent'); gradient.addColorStop(clamp(center + focus), 'transparent')
          gradient.addColorStop(clamp(center + focus + feather), '#000'); gradient.addColorStop(1, '#000')
        }
      }
      ctx.globalCompositeOperation = 'destination-in'; ctx.fillStyle = gradient; ctx.fillRect(0, 0, this.width, this.height); ctx.globalCompositeOperation = 'source-over'
    } else this.effect.ctx.clearRect(0, 0, this.width, this.height)
    this.effect.ctx.drawImage(this.scratch.canvas, 0, 0)
  }

  render(seconds: number, moving = true) {
    const o = this.options, { width: w, height: h, ctx } = this
    const size = Math.max(4, Math.round(o.cellSize))
    const time = moving ? seconds * (o.animSpeed.enabled ? o.animSpeed.intensity / 100 : 1) : 0
    const amplitude = moving && o.animated ? (o.animIntensity.enabled ? o.animIntensity.intensity / 100 : 0) : 0
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1; ctx.filter = 'none'
    ctx.fillStyle = '#080b0d'; ctx.fillRect(0, 0, w, h)
    if (o.bgMode !== 'none') {
      ctx.globalAlpha = o.bgOpacity / 100
      if (o.bgMode === 'solid') { ctx.fillStyle = '#080b0d'; ctx.fillRect(0, 0, w, h) }
      else { ctx.filter = o.bgMode === 'blur' || o.bgMode === 'blurred' ? `blur(${o.bgBlur}px)` : 'none'; ctx.drawImage(this.source.canvas, 0, 0); ctx.filter = 'none' }
      ctx.globalAlpha = 1
    }
    const fx = this.effect.ctx
    fx.clearRect(0, 0, w, h)
    for (let i = 0; i < this.cells.length; i++) {
      const cell = this.cells[i]
      if (hash(i) * 100 >= o.coverage) continue
      const wave = o.animStyle === 'pulse' ? Math.sin(time * 2)
        : o.animStyle === 'ripple' ? Math.sin(Math.hypot(cell.x - w / 2, cell.y - h / 2) / 65 - time * 2)
        : o.animStyle === 'shimmer' ? Math.sin(cell.x / 37 + cell.y / 51 + time * 3)
        : o.animStyle === 'flicker' ? (hash(i + Math.floor(time * 7)) - .5) * 2
        : Math.sin(cell.x / 100 + cell.y / 140 - time * 1.7)
      let value = tone(cell.luma, o.toneCurve)
      const adjacent = this.cells[i + 1]?.luma ?? cell.luma
      const below = this.cells[i + this.cols]?.luma ?? cell.luma
      value = clamp(value + (Math.abs(adjacent - cell.luma) + Math.abs(below - cell.luma)) * o.edgeEmphasis / 100)
      fx.fillStyle = cell.color
      fx.globalAlpha = clamp(.9 + wave * amplitude * .16, .55, 1)
      const dy = o.animStyle === 'wave' ? Math.sin(cell.x / 130 + time) * amplitude * 2 : 0
      if (o.renderMode === 'halfblocks') {
        for (const [j, color] of [cell.topColor, cell.bottomColor].entries()) {
          fx.fillStyle = color
          fx.fillRect(cell.x, cell.y + j * size / 2, size, size / 2)
        }
      } else if (o.renderMode === 'contour') {
        fx.strokeStyle = fx.fillStyle; fx.lineWidth = 1
        for (let level = .1; level < 1; level += .1) {
          fx.beginPath()
          if ((value < level) !== (adjacent < level)) { fx.moveTo(cell.x + size / 2, cell.y); fx.lineTo(cell.x + size / 2, cell.y + size) }
          if ((value < level) !== (below < level)) { fx.moveTo(cell.x, cell.y + size / 2); fx.lineTo(cell.x + size, cell.y + size / 2) }
          fx.stroke()
        }
      } else drawCell(fx, cell.x, cell.y + dy, size, value, i, moving ? time : 0, o)
    }
    fx.globalAlpha = 1
    this.blur()
    ctx.globalCompositeOperation = o.styleBlend; ctx.drawImage(this.effect.canvas, 0, 0); ctx.globalCompositeOperation = 'source-over'
    const p = o.pfx
    if (p.bloom.enabled) {
      this.copy(this.effect.canvas, this.glow, 'brightness(1.15) blur(5px)')
      ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = p.bloom.intensity / 100
      ctx.drawImage(this.glow.canvas, 0, 0, w, h); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'
    }
    if (p.chromatic.enabled) {
      this.copy(this.effect.canvas, this.scratch)
      this.scratch.ctx.globalCompositeOperation = 'source-atop'; this.scratch.ctx.fillStyle = '#44d9ff'; this.scratch.ctx.fillRect(0, 0, w, h); this.scratch.ctx.globalCompositeOperation = 'source-over'
      ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = p.chromatic.intensity / 300
      ctx.drawImage(this.scratch.canvas, p.chromatic.intensity / 5, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'
    }
    if (p.pixelate.enabled) {
      this.copy(this.canvas, this.glow)
      ctx.globalAlpha = p.pixelate.intensity / 100; ctx.imageSmoothingEnabled = false; ctx.drawImage(this.glow.canvas, 0, 0, w, h); ctx.imageSmoothingEnabled = true; ctx.globalAlpha = 1
    }
    if (p.scanLines.enabled) {
      ctx.fillStyle = `rgba(0,0,0,${p.scanLines.intensity / 180})`
      for (let y = 0; y < h; y += 4) ctx.fillRect(0, y, w, 1)
    }
    if (p.halftone.enabled) {
      ctx.fillStyle = `rgba(0,0,0,${p.halftone.intensity / 100})`
      for (let y = 0; y < h; y += 8) for (let x = 0; x < w; x += 8) { ctx.beginPath(); ctx.arc(x, y, 1.2, 0, Math.PI * 2); ctx.fill() }
    }
    for (const key of ['filmGrain', 'filmDust'] as const) if (p[key].enabled) {
      const count = key === 'filmGrain' ? 1200 : 45
      ctx.fillStyle = `rgba(230,243,240,${p[key].intensity / 200})`
      for (let i = 0; i < count; i++) {
        const seed = i + (moving ? Math.floor(time * 12) * count : 0)
        ctx.fillRect(hash(seed) * w, hash(seed + 87) * h, key === 'filmGrain' ? 1 : 2, key === 'filmGrain' ? 1 : 4)
      }
    }
    // Two narrow displaced bands, <=180ms every 7.4s; no full-screen luminance flash.
    if (moving && p.glitch.enabled && seconds % 7.4 > 6.9 && seconds % 7.4 < 7.08) {
      this.copy(this.canvas, this.scratch)
      const seed = Math.floor(seconds * 16), force = p.glitch.intensity / 100
      for (let i = 0; i < 2; i++) {
        const y = Math.floor(hash(seed + i * 17) * .8 * h), band = Math.max(3, size * (1 + i))
        const offset = (i ? 1 : -1) * (12 + force * 60)
        ctx.drawImage(this.scratch.canvas, 0, y, w, band, offset, y, w, band)
        ctx.fillStyle = `rgba(98,225,239,${force * .35})`; ctx.fillRect(0, y, w, 1)
      }
    }
    if (p.vignette.enabled) {
      const gradient = ctx.createRadialGradient(w * .55, h * .45, h * .1, w * .55, h * .45, Math.max(w, h) * .65)
      gradient.addColorStop(0, 'transparent'); gradient.addColorStop(1, `rgba(0,0,0,${p.vignette.intensity / 100})`)
      ctx.fillStyle = gradient; ctx.fillRect(0, 0, w, h)
    }
    if (o.lights.enabled) for (const light of o.lights.points) {
      const x = light.x * w, y = light.y * h, radius = Math.max(1, light.radius * Math.min(w, h))
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
      gradient.addColorStop(0, light.color || '#d3edff'); gradient.addColorStop(1, 'transparent')
      ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = clamp(light.intensity > 1 ? light.intensity / 100 : light.intensity)
      ctx.fillStyle = gradient; ctx.fillRect(0, 0, w, h); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'
    }
    if (o.mask.enabled && this.mask) {
      this.copy(this.source.canvas, this.scratch)
      this.scratch.ctx.globalCompositeOperation = o.mask.invert ? 'destination-out' : 'destination-in'
      this.scratch.ctx.drawImage(this.mask, 0, 0, w, h); this.scratch.ctx.globalCompositeOperation = 'source-over'
      ctx.drawImage(this.scratch.canvas, 0, 0)
    }
  }

  destroy() {
    this.disposed = true; this.mask = null; this.cells = []
    for (const s of [this.source, this.effect, this.scratch, this.glow]) { s.canvas.width = 1; s.canvas.height = 1 }
  }
}
