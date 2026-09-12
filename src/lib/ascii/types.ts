import preset from '@/data/vignette-bloom.json'

export const RENDER_MODES = ['characters', 'dither', 'mosaic', 'pixel', 'dots', 'cross', 'diamond', 'voxel', 'lego', 'mixed', 'lines', 'diagonal', 'braille', 'disco', 'hexdump', 'matrix', 'rings', 'hearts', 'stars', 'hexagons', 'triangles', 'bubbles', 'hatch', 'contour', 'halfblocks'] as const
export type RenderMode = (typeof RENDER_MODES)[number]
export interface LightPoint { x: number; y: number; radius: number; intensity: number; color?: string }
export type AsciiOptions = Omit<typeof preset, 'renderMode' | 'styleBlend' | 'overlayBlend' | 'lights' | 'mask'> & {
  renderMode: RenderMode
  styleBlend: GlobalCompositeOperation
  overlayBlend: GlobalCompositeOperation
  lights: { enabled: boolean; points: LightPoint[] }
  mask: Omit<typeof preset.mask, 'dataUrl'> & { dataUrl: string | null }
}

/** Original recipe stays intact. The site's glitch toggle is an explicit override. */
export function vignetteBloom(): AsciiOptions {
  return structuredClone(preset) as AsciiOptions
}
