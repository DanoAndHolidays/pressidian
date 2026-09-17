import {
  DoubleSide, Group, LinearFilter, Mesh, NoBlending, NoColorSpace, NoToneMapping,
  OrthographicCamera, PlaneGeometry, RingGeometry, Scene, ShaderMaterial,
  SphereGeometry, SRGBColorSpace, Vector2, Vector3, WebGLRenderer, WebGLRenderTarget,
} from 'three'
import { glitchFragment, planetFragment, postFragment, postVertex, ringFragment, surfaceVertex } from './shaders'
import { ASCII_CHARACTERS, createGlyphAtlas } from '@/components/ui/ascii-art/glyph-atlas'

/**
 * Share of 8 Hz slots that tear, so the planet faults intermittently rather
 * than sitting in a permanent offset. `0` disables the glitch pass outright.
 */
export const PLANET_GLITCH = 0.21

/** Resolve the same CSS/OKLab colours as DecryptText into display-sRGB bytes. */
function readScramblePalette() {
  const styles = getComputedStyle(document.documentElement)
  const swatch = document.createElement('canvas')
  swatch.width = swatch.height = 1
  const ctx = swatch.getContext('2d', { willReadFrequently: true })
  if (!ctx) throw new Error('Scramble palette is unavailable')
  return ['--scramble-accent', '--scramble-red', '--scramble-mix'].map((token) => {
    ctx.clearRect(0, 0, 1, 1)
    ctx.fillStyle = styles.getPropertyValue(token).trim()
    ctx.fillRect(0, 0, 1, 1)
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
    return new Vector3(r / 255, g / 255, b / 255)
  })
}

// Vignette Bloom's brightness/contrast/wave settings, using the preserved
// branch's character ramp instead of mosaic rectangles.
export const PLANET_PRESET = {
  renderMode: 'characters', cellWidth: 7.5, cellHeight: 10.5,
  brightness: 12, contrast: 115, saturation: 100, grayscale: 0,
  coverage: 100, tintOpacity: 0, blurType: 'off',
  vignette: 38, bloom: 25, animSpeed: 100, animIntensity: 60,
  glitch: PLANET_GLITCH,
} as const

export function createPlanetScene(canvas: HTMLCanvasElement, dark = false, scale = 1) {
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: false, premultipliedAlpha: true, powerPreference: 'low-power' })
  renderer.setClearColor(0x000000, 0)
  renderer.toneMapping = NoToneMapping
  renderer.outputColorSpace = SRGBColorSpace
  renderer.autoClear = false
  const scene = new Scene()
  const camera = new OrthographicCamera(-2.35, 2.35, 1.8, -1.8, 0.1, 20)
  camera.position.set(0, 0, 7)
  camera.lookAt(0, 0, 0)
  const group = new Group()
  group.rotation.set(0.43, 0, -0.38)
  // Working scale, applied on top of the authored pose. The preset camera is
  // wide enough that the default 1.0 leaves the planet occupying only ~61% of
  // the canvas width, so the model is scaled up to fill it deliberately.
  group.scale.setScalar(scale)
  scene.add(group)
  group.updateMatrixWorld(true)
  const light = new Vector3(-3, 5, 5).normalize()
  const ringNormal = new Vector3(0, 1, 0).applyQuaternion(group.quaternion)
  const planetMaterial = new ShaderMaterial({
    vertexShader: surfaceVertex, fragmentShader: planetFragment,
    uniforms: {
      uLight: { value: light }, uRingNormal: { value: ringNormal }, uTime: { value: 0 },
      uWaveAmplitude: { value: 0.02 * PLANET_PRESET.animIntensity / 100 },
    },
  })
  const sphereGeometry = new SphereGeometry(1, 128, 64)
  const planet = new Mesh(sphereGeometry, planetMaterial)
  planet.name = 'Banded gas giant'
  group.add(planet)
  const ringMaterial = new ShaderMaterial({
    vertexShader: surfaceVertex, fragmentShader: ringFragment,
    uniforms: { uLight: { value: light } }, transparent: true,
    side: DoubleSide, depthWrite: false,
  })
  const ringGeometry = new RingGeometry(1.32, 2.08, 256, 8)
  const rings = new Mesh(ringGeometry, ringMaterial)
  rings.name = 'Equatorial rings with Cassini gap'
  rings.rotation.x = -Math.PI / 2
  group.add(rings)

  const target = new WebGLRenderTarget(1024, 768, { minFilter: LinearFilter, magFilter: LinearFilter })
  // This intermediate holds already-authored display colours, premultiplied
  // before filtering. Do not tag it sRGB and accidentally decode/encode it twice.
  const characters = new WebGLRenderTarget(1, 1, {
    minFilter: LinearFilter, magFilter: LinearFilter, depthBuffer: false,
  })
  target.texture.colorSpace = NoColorSpace
  characters.texture.colorSpace = NoColorSpace
  const postScene = new Scene()
  const postCamera = new OrthographicCamera(-1, 1, 1, -1, 0, 1)
  const glyphAtlas = createGlyphAtlas()
  const postMaterial = new ShaderMaterial({
    vertexShader: postVertex, fragmentShader: postFragment,
    depthTest: false, depthWrite: false, blending: NoBlending,
    uniforms: {
      uScene: { value: target.texture }, uGrid: { value: new Vector2(128, 96) },
      uGlyphs: { value: glyphAtlas }, uGlyphCount: { value: ASCII_CHARACTERS.length },
      uDark: { value: dark ? 1 : 0 },
      uBrightness: { value: PLANET_PRESET.brightness / 100 },
      uContrast: { value: PLANET_PRESET.contrast / 100 },
      uVignette: { value: PLANET_PRESET.vignette / 100 },
      uBloom: { value: PLANET_PRESET.bloom / 100 },
    },
  })
  const glitchScene = new Scene()
  const palette = readScramblePalette()
  const glitchMaterial = new ShaderMaterial({
    vertexShader: postVertex, fragmentShader: glitchFragment,
    depthTest: false, depthWrite: false, blending: NoBlending, toneMapped: false,
    uniforms: {
      uCharacters: { value: characters.texture },
      uGrid: postMaterial.uniforms.uGrid,
      uCssSize: { value: new Vector2(1, 1) },
      uTime: { value: 0 }, uGlitch: { value: PLANET_GLITCH }, uMotion: { value: 1 },
      uSeed: { value: crypto.getRandomValues(new Uint32Array(1))[0] % 65536 },
      uAccent: { value: palette[0] }, uRed: { value: palette[1] }, uMixed: { value: palette[2] },
    },
  })
  const quadGeometry = new PlaneGeometry(2, 2)
  postScene.add(new Mesh(quadGeometry, postMaterial))
  glitchScene.add(new Mesh(quadGeometry, glitchMaterial))
  const drawingSize = new Vector2()
  let lastWidth = 0, lastHeight = 0, lastDpr = 0

  return {
    resize(width: number, height: number) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      if (width === lastWidth && height === lastHeight && dpr === lastDpr) return
      lastWidth = width
      lastHeight = height
      lastDpr = dpr
      const ratio = width / Math.max(1, height)
      renderer.setPixelRatio(dpr)
      renderer.setSize(width, height, false)
      renderer.getDrawingBufferSize(drawingSize)
      characters.setSize(drawingSize.x, drawingSize.y)
      glitchMaterial.uniforms.uCssSize.value.set(width, height)
      // Readable CSS-pixel glyphs on phones and desktop, independent of DPR.
      postMaterial.uniforms.uGrid.value.set(
        Math.max(1, Math.round(width / PLANET_PRESET.cellWidth)),
        Math.max(1, Math.round(height / PLANET_PRESET.cellHeight)),
      )
      const targetWidth = Math.min(1024, Math.max(512, Math.round(width * 1.5)))
      target.setSize(targetWidth, Math.round(targetWidth / ratio))
      camera.top = 2.35 / ratio
      camera.bottom = -camera.top
      camera.updateProjectionMatrix()
    },
    setTheme(dark: boolean) {
      postMaterial.uniforms.uDark.value = dark ? 1 : 0
      const palette = readScramblePalette()
      glitchMaterial.uniforms.uAccent.value.copy(palette[0])
      glitchMaterial.uniforms.uRed.value.copy(palette[1])
      glitchMaterial.uniforms.uMixed.value.copy(palette[2])
    },
    /**
     * Dev-only handles for inspecting the planet. The glitch is intermittent by
     * design (it only tears a minority of frames), which makes it impractical to
     * eyeball in a screenshot; these let a probe hold or force a torn frame.
     */
    uniforms: {
      glitch: glitchMaterial.uniforms.uGlitch,
      time: glitchMaterial.uniforms.uTime,
      seed: glitchMaterial.uniforms.uSeed,
    },
    render(seconds: number, motion = true) {
      planet.rotation.y = seconds * 0.07
      planetMaterial.uniforms.uTime.value = seconds * PLANET_PRESET.animSpeed / 100
      glitchMaterial.uniforms.uTime.value = seconds
      glitchMaterial.uniforms.uMotion.value = motion ? 1 : 0
      renderer.setRenderTarget(target)
      renderer.clear()
      renderer.render(scene, camera)
      renderer.setRenderTarget(characters)
      renderer.clear()
      renderer.render(postScene, postCamera)
      renderer.setRenderTarget(null)
      renderer.clear()
      renderer.render(glitchScene, postCamera)
    },
    dispose() {
      sphereGeometry.dispose()
      ringGeometry.dispose()
      quadGeometry.dispose()
      planetMaterial.dispose()
      ringMaterial.dispose()
      postMaterial.dispose()
      glitchMaterial.dispose()
      glyphAtlas.dispose()
      target.dispose()
      characters.dispose()
      renderer.dispose()
    },
  }
}
