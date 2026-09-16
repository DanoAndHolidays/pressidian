import {
  DoubleSide, Group, LinearFilter, Mesh, NoBlending, NoToneMapping,
  OrthographicCamera, PlaneGeometry, RingGeometry, Scene, ShaderMaterial,
  SphereGeometry, Vector2, Vector3, WebGLRenderer, WebGLRenderTarget,
} from 'three'
import { planetFragment, postFragment, postVertex, ringFragment, surfaceVertex } from './shaders'
import { ASCII_CHARACTERS, createGlyphAtlas } from '@/components/ui/ascii-art/glyph-atlas'

// Vignette Bloom's brightness/contrast/wave settings, using the preserved
// branch's character ramp instead of mosaic rectangles.
export const PLANET_PRESET = {
  renderMode: 'characters', cellWidth: 7.5, cellHeight: 10.5,
  brightness: 12, contrast: 115, saturation: 100, grayscale: 0,
  coverage: 100, tintOpacity: 0, blurType: 'off',
  vignette: 38, bloom: 25, animSpeed: 100, animIntensity: 60,
} as const

export function createPlanetScene(canvas: HTMLCanvasElement, dark = false) {
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: false, premultipliedAlpha: false, powerPreference: 'low-power' })
  renderer.setClearColor(0x000000, 0)
  renderer.toneMapping = NoToneMapping
  const scene = new Scene()
  const camera = new OrthographicCamera(-2.35, 2.35, 1.8, -1.8, 0.1, 20)
  camera.position.set(0, 0, 7)
  camera.lookAt(0, 0, 0)
  const group = new Group()
  group.rotation.set(0.43, 0, -0.38)
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
  const quadGeometry = new PlaneGeometry(2, 2)
  postScene.add(new Mesh(quadGeometry, postMaterial))

  return {
    resize(width: number, height: number) {
      const ratio = width / Math.max(1, height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
      renderer.setSize(width, height, false)
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
    },
    render(seconds: number) {
      planet.rotation.y = seconds * 0.07
      planetMaterial.uniforms.uTime.value = seconds * PLANET_PRESET.animSpeed / 100
      renderer.setRenderTarget(target)
      renderer.clear()
      renderer.render(scene, camera)
      renderer.setRenderTarget(null)
      renderer.clear()
      renderer.render(postScene, postCamera)
    },
    dispose() {
      sphereGeometry.dispose()
      ringGeometry.dispose()
      quadGeometry.dispose()
      planetMaterial.dispose()
      ringMaterial.dispose()
      postMaterial.dispose()
      glyphAtlas.dispose()
      target.dispose()
      renderer.dispose()
    },
  }
}
