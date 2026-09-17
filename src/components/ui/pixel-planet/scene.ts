import {
  BoxGeometry, BufferGeometry, Color, DoubleSide, Group, LinearFilter,
  LinearSRGBColorSpace, Material, Mesh, MeshBasicMaterial, NoBlending, NoColorSpace,
  NoToneMapping, Object3D, OrthographicCamera, PlaneGeometry, Raycaster, RingGeometry,
  Scene, ShaderMaterial, SphereGeometry, SRGBColorSpace, Vector2, Vector3,
  WebGLRenderer, WebGLRenderTarget,
} from 'three'
import {
  glitchFragment, moonFragment, planetFragment, postFragment, postVertex, ringFragment,
  surfaceVertex,
} from './shaders'
import { ASCII_CHARACTERS, createGlyphAtlas } from '@/components/ui/ascii-art/glyph-atlas'

/**
 * Share of 8 Hz slots that tear, so the planet faults intermittently rather
 * than sitting in a permanent offset. `0` disables the glitch pass outright.
 */
export const PLANET_GLITCH = 0.21

type DragKind = 'planet' | 'orbiter'
type InteractiveRoot = Object3D & {
  userData: {
    dragKind: DragKind
    label: string
    /** Orbiters only: in-plane angle added to the authored phase, in radians. */
    orbitPhase?: number
    /** Orbiters only: radius of the circle the body rides, in model units. */
    orbitRadius?: number
    /** Orbiters only: the angle the body was last placed at, in radians. */
    orbitAngle?: number
  }
}

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

/**
 * Tag a body so a raycast that lands on any of its parts resolves to the whole
 * body, and so a drag can tell the planet from something on an orbit.
 */
function markInteractive(root: Group | Mesh, label: string, dragKind: DragKind) {
  root.userData.dragKind = dragKind
  root.userData.label = label
  root.traverse((child) => {
    child.userData.interactionRoot = root
  })
  return root as unknown as InteractiveRoot
}

/*
 * Two authored moon identities, kept at module scope so `makeMoon` reads as the
 * assembly it is and so the numbers can be compared side by side. Each is a
 * three-uniform statement: `albedo` is the body, `fissure` its markings, `tint`
 * its overall cast. Values are display-space, like `planetFragment`'s palette.
 *
 * Both are the planet's own orange-red, and the pair is separated on *hue within
 * that family*, not on value: `PALE_MOON` is an amber at ~25 degrees, `DARK_MOON`
 * a vermilion at ~15. That is a correction, not a preference. A genuinely darker
 * companion was tried first and it disappeared — measured on the rendered hero,
 * its disc peaked at scene luma 96 against the backdrop's 27 while the amber one
 * peaked at 195, and the user's report was exactly that: one moon clear, one
 * invisible. A moon is only a few cells across and spends most of its orbit over
 * the dark backdrop, so luminance is the one axis it cannot spend.
 *
 * Hue, by contrast, is free, and it survives the ASCII pass intact because a
 * body's cell keeps its own colour. So the two moons are told apart by being
 * amber and vermilion at the same brightness, which also keeps them clearly
 * distinct from the planet (whose ramp sits at 28-34) and from the station's
 * cyan. The vermilion moon keeps its own identity in its markings as well:
 * `feature: 1` swaps the amber moon's crack lines for ringed impact scars.
 */
const PALE_MOON = {
  albedo: [1.12, 0.63, 0.37],
  fissure: [0.52, 0.19, 0.09],
  tint: [1.04, 1.00, 0.97],
  feature: 0,
} as const
const DARK_MOON = {
  albedo: [1.20, 0.66, 0.36],
  fissure: [0.72, 0.26, 0.13],
  tint: [1.03, 1.00, 0.99],
  feature: 1,
} as const

function makeMoon(
  light: Vector3, label = '木卫二 · 欧罗巴', radius = 0.094,
  look: { albedo: readonly number[]; fissure: readonly number[]; tint: readonly number[]; feature: number } = PALE_MOON,
) {
  const root = new Group()
  const moon = new Mesh(
    new SphereGeometry(radius, 40, 24),
    new ShaderMaterial({
      vertexShader: surfaceVertex, fragmentShader: moonFragment,
      uniforms: {
        uLight: { value: light },
        uAlbedo: { value: new Vector3().fromArray(look.albedo, 0) },
        uFissure: { value: new Vector3().fromArray(look.fissure, 0) },
        uTint: { value: new Vector3().fromArray(look.tint, 0) },
        uFeature: { value: look.feature },
      },
    }),
  )
  root.add(moon)
  return markInteractive(root, label, 'orbiter')
}

/*
 * The station is authored **on** the character grid rather than modelled and
 * then sampled by it, because that is the only way a small object stays legible
 * here. Geometry smaller than a cell is averaged away by `postFragment`, so a
 * wheel a few cells across — the previous design resolved to about four on the
 * hero's 616 px column — can only ever be a cluster of glyphs, however good the
 * model is. Every part below is therefore a rectangle whose edges fall on design
 * cell boundaries, where one cell is one character of the 7.5 x 10.5 CSS px grid
 * at that column (a design row is 1.4 columns tall), and every part carries an
 * **ink level**: a display luma chosen so the luminance ramp selects the
 * character that suits it.
 *
 * The ramp is `ASCII_CHARACTERS`, and `postFragment` selects with
 * `floor(clamp(1.15 * level + 0.017, 0, 1) * 10)`, which makes the level the
 * whole authoring surface:
 *
 *   0.116 '.'   an unlit lamp housing
 *   0.377 '='   solar blankets, so a two-cell field of them reads as a striped
 *               panel rather than as the sparse scatter ':' produced
 *   0.464 '+'   the truss, and the docked vehicle hung under the core
 *   0.550 '*'   the blankets' glint peak, and the core's shoulders
 *   0.637 '#'   the core stack
 *   0.724 '%'   the antenna dish
 *   0.810 '@'   navigation strobes
 *
 * The levels are one glyph band apart on purpose. The first version of this
 * assembly used ':' for the blankets and '=' for the truss, and measured on the
 * rendered hero those cells carried so little ink that the arrays read as stray
 * dots — at a 7.5 x 10.5 px cell a glyph is a shape first and a density second,
 * so a structure made of thin glyphs is a structure you cannot see.
 *
 * Levels sit in the middle of a glyph's band. The theme's ink multiplier is
 * applied *after* the glyph is chosen, so the silhouette is identical in both
 * themes and only the ink cools or warms.
 *
 * The shape is the standard orbital-station read, sized so each of its parts is
 * at least a cell: a fifteen-cell truss with four two-cell blankets hung on it,
 * a five-cell core crossing the middle with a module either side, an antenna
 * above and a docked vehicle below. Camera-facing and unlit — `orbitLayer` is a
 * sibling of the tilted planet group, so the station stays square to the screen
 * instead of foreshortening, and unlit materials mean structure is carried by
 * the ink levels rather than by a light that would black out one whole side.
 *
 * Authoring note: `postFragment` reads the scene target as display-referred
 * colour, so these levels are written as raw display values, exactly the way
 * `planetFragment` and `moonFragment` author theirs. `LinearSRGBColorSpace` here
 * means "these numbers are already final", not "these are linear light" — it
 * suppresses the sRGB-to-linear conversion `Color` would otherwise apply.
 */
const STATION_CELL = 4.7 / 82
const STATION_ROW = STATION_CELL * 1.4
const STATION_INK = {
  lamp: 0.116, blanket: 0.377, truss: 0.464, glint: 0.550,
  shoulder: 0.550, hull: 0.637, dish: 0.724, vehicle: 0.464, strobe: 0.810,
} as const
/** Hue directions; each is scaled to the level it is used at, so it stays cool. */
const STATION_HUE = {
  solar: [0.30, 0.52, 1.00],
  steel: [0.55, 0.72, 1.00],
  cyan: [0.16, 0.94, 1.00],
} as const

/** Display colour of a given luma, walked along `hue`. */
function stationInk(level: number, hue: readonly number[]) {
  const scale = level / (hue[0] * 0.2126 + hue[1] * 0.7152 + hue[2] * 0.0722)
  return new Color().setRGB(hue[0] * scale, hue[1] * scale, hue[2] * scale, LinearSRGBColorSpace)
}

/** An unlit part, at one of the levels above. */
function stationMaterial(level: number, hue: readonly number[] = STATION_HUE.steel) {
  return new MeshBasicMaterial({ color: stationInk(level, hue) })
}

/**
 * Seconds per navigation-strobe cycle. A short flash and a long dark gap, which
 * is what a strobe looks like; the lamp itself stays faintly lit when it is off,
 * because a cell whose glyph falls back to a space is *discarded* by the ASCII
 * pass and would punch a hole in whatever the station is crossing.
 */
const STATION_STROBE = 1.9

/**
 * The station is parked, not deleted.
 *
 * The assembly it gates is complete and stays wired into everything it needs —
 * orbit maths, the ASCII inks, raycasting, disposal — but it is still not
 * reading as a station at the hero's cell size the way it should, so the hero
 * ships without it for now. Flipping this to `true` puts it back on its orbit
 * unchanged; nothing else has to change with it, because every consumer of the
 * station already asks this flag rather than assuming it (see `pick`, which
 * drops anything that is not drawn, and `render`, which skips its clock).
 *
 * The one exception is the canvas `aria-label` in `PixelPlanet.vue`: it names
 * the bodies a visitor can drag, and it stays generic while the flag is false.
 */
const STATION_VISIBLE: boolean = false

function makeStation() {
  const root = new Group()
  const solarDim = stationInk(STATION_INK.blanket, STATION_HUE.solar)
  const solarLit = stationInk(STATION_INK.glint, STATION_HUE.solar)
  const lampOff = stationInk(STATION_INK.lamp, STATION_HUE.steel)
  const lampOn = stationInk(STATION_INK.strobe, STATION_HUE.cyan)

  /** One rectangle of the assembly, measured in design cells from its centre. */
  function slab(
    material: Material, left: number, right: number, bottom: number, top: number,
    depth: number, z: number,
  ) {
    const part = new Mesh(
      new BoxGeometry((right - left) * STATION_CELL, (top - bottom) * STATION_ROW, depth * STATION_CELL),
      material,
    )
    part.position.set(
      (left + right) / 2 * STATION_CELL,
      (bottom + top) / 2 * STATION_ROW,
      z * STATION_CELL,
    )
    root.add(part)
  }

  /*
   * Four blankets, two cells wide and five tall, hung either side of the core
   * with a one-cell gap between each pair — the gap is what keeps them reading
   * as four panels rather than one slab, and it is where a real array's mast
   * would sit. Each blanket is cut into one-cell strips so a highlight can walk
   * across it: the phase advances with both the array's position along the truss
   * and the strip's height, so the wave crosses the wings diagonally the way a
   * reflection off the cells would. `solarDim` to `solarLit` is two glyph bands,
   * '=' to '*': as much as a reflection should have without competing with the
   * core for the brightest thing on the assembly.
   */
  const glints: Array<{ material: MeshBasicMaterial; phase: number }> = []
  for (const [array, left] of [-7.5, -4.5, 2.5, 5.5].entries()) {
    for (let strip = 0; strip < 5; strip += 1) {
      const material = new MeshBasicMaterial({ color: solarDim.clone() })
      slab(material, left, left + 2, strip - 2.5, strip - 1.5, 0.12, -0.25)
      glints.push({ material, phase: array * 1.15 + strip * 0.42 })
    }
  }

  /* The truss: the spine every other part is hung off, and the one element that
   * has to read as a drawn line, which is why it is '+' and one cell tall. */
  slab(stationMaterial(STATION_INK.truss), -7.5, 7.5, -0.5, 0.5, 0.30, 0)

  /* The core: a five-cell stack with a module either side of it, set forward so
   * it covers the truss where they cross. The stack is one band brighter than
   * its shoulders, which is what gives a flat-shaded assembly a near and a far
   * side. */
  slab(stationMaterial(STATION_INK.hull), -0.5, 0.5, -2.5, 2.5, 0.55, 0.30)
  slab(stationMaterial(STATION_INK.shoulder), -1.5, -0.5, -1.5, 1.5, 0.55, 0.30)
  slab(stationMaterial(STATION_INK.shoulder), 0.5, 1.5, -1.5, 1.5, 0.55, 0.30)

  /* Antenna above the core, docked vehicle below it: two one-cell details that
   * give the assembly a top and a bottom, so it reads as a station rather than
   * as a bracket. */
  slab(stationMaterial(STATION_INK.truss), -0.5, 0.5, 2.5, 3.5, 0.12, 0.35)
  slab(stationMaterial(STATION_INK.dish), -0.5, 0.5, 3.5, 4.5, 0.25, 0.40)
  slab(stationMaterial(STATION_INK.vehicle), -0.5, 0.5, -3.5, -2.5, 0.30, 0.30)

  /* Navigation strobes on one-cell booms off each end of the truss, out of phase
   * with each other. They are the only parts that leave the truss line, so the
   * flashing reads against empty sky. */
  const strobes = [-8.5, 7.5].map((left, index) => {
    const material = new MeshBasicMaterial({ color: lampOff.clone() })
    slab(material, left, left + 1, -0.5, 0.5, 0.20, 0.40)
    return { material, phase: index * 0.5 }
  })

  return {
    root: markInteractive(root, '伽利略深空站', 'orbiter'),
    /** Glint and strobes: the two things that keep a rigid assembly alive. */
    animate(seconds: number) {
      for (const glint of glints) {
        const amount = 0.5 + 0.5 * Math.sin(seconds * 0.5 - glint.phase)
        glint.material.color.copy(solarDim).lerp(solarLit, amount)
      }
      for (const strobe of strobes) {
        const cycle = (seconds / STATION_STROBE + strobe.phase) % 1
        strobe.material.color.copy(cycle < 0.14 ? lampOn : lampOff)
      }
    },
  }
}

/** Walk up from a raycast hit until the body it belongs to is found. */
function findInteractive(object: Object3D | null) {
  let current = object
  while (current) {
    const root = current.userData.interactionRoot as InteractiveRoot | undefined
    if (root) return root
    if (current.userData.dragKind) return current as InteractiveRoot
    current = current.parent
  }
  return null
}

/**
 * Half-width of the authored camera frame, in model units. The camera is
 * orthographic and centred on the planet, so this is the one number that
 * converts between model units and CSS pixels in both directions: the frame is
 * this wide either side of the planet whatever the canvas aspect is, and
 * `resize` derives the vertical half-height from it.
 */
const FRAME_HALF_WIDTH = 2.35

export function createPlanetScene(canvas: HTMLCanvasElement, dark = false, scale = 1) {
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: false, premultipliedAlpha: true, powerPreference: 'low-power' })
  renderer.setClearColor(0x000000, 0)
  renderer.toneMapping = NoToneMapping
  renderer.outputColorSpace = SRGBColorSpace
  renderer.autoClear = false
  const scene = new Scene()
  const camera = new OrthographicCamera(-FRAME_HALF_WIDTH, FRAME_HALF_WIDTH, 1.8, -1.8, 0.1, 20)
  camera.position.set(0, 0, 7)
  camera.lookAt(0, 0, 0)
  // Working scale, applied on top of the authored pose. The preset camera spans
  // ±2.35, and the outermost orbit — not the outer ring — sets the ceiling: the
  // hero runs at 0.70 so the station's whole path stays inside the canvas. The
  // planet is therefore smaller in the hero than a framing that crops the rings
  // would allow; that is the cost of keeping every orbit outside them.
  const system = new Group()
  system.scale.setScalar(scale)
  scene.add(system)
  // Kepler's own pose, kept apart from the working scale: the orbiters are
  // siblings of this group rather than children, so the group's tilt cannot
  // foreshorten the station's assembly into an edge-on smear.
  const jupiter = new Group()
  jupiter.rotation.set(0.43, 0, -0.38)
  system.add(jupiter)
  system.updateMatrixWorld(true)
  const light = new Vector3(-3, 5, 5).normalize()
  const ringNormal = new Vector3(0, 1, 0).applyQuaternion(jupiter.quaternion)
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
  jupiter.add(planet)
  markInteractive(planet, '木星', 'planet')
  const ringMaterial = new ShaderMaterial({
    vertexShader: surfaceVertex, fragmentShader: ringFragment,
    uniforms: { uLight: { value: light } }, transparent: true,
    side: DoubleSide, depthWrite: false,
  })
  const ringGeometry = new RingGeometry(1.32, 2.08, 256, 8)
  const rings = new Mesh(ringGeometry, ringMaterial)
  rings.name = 'Equatorial rings with Cassini gap'
  rings.rotation.x = -Math.PI / 2
  jupiter.add(rings)

  /*
   * Jupiter's local +Y is the spin axis, so its local XZ plane is the ring
   * plane. Both in-plane basis vectors are fixed for the lifetime of the scene
   * (only the planet mesh spins inside the group), which lets every orbiter be
   * positioned on a circle in that plane. Orbiters stay in `orbitLayer` instead
   * of becoming children of `jupiter` so their own orientation keeps facing the
   * camera — the station has to read square to the viewer, not foreshortened.
   */
  const orbitLayer = new Group()
  system.add(orbitLayer)
  const ringPlaneX = new Vector3(1, 0, 0).applyQuaternion(jupiter.quaternion)
  const ringPlaneZ = new Vector3(0, 0, 1).applyQuaternion(jupiter.quaternion)

  /**
   * Place a body on its circular orbit around the spin axis, in the ring plane,
   * and record the angle it was placed at. The angle is the authored phase plus
   * the clock plus whatever a drag has added, so this call is the only thing that
   * knows where along its path a body currently is — which is exactly what a drag
   * needs to take the tangent of that path.
   */
  function placeOnRingOrbit(body: Object3D, radius: number, angle: number) {
    body.userData.orbitAngle = angle
    body.position
      .copy(ringPlaneX).multiplyScalar(radius * Math.cos(angle))
      .addScaledVector(ringPlaneZ, radius * Math.sin(angle))
  }

  /**
   * Screen-space direction a body travels in as its in-plane angle grows, for a
   * unit-radius orbit — the derivative of `placeOnRingOrbit` with respect to the
   * angle. The camera looks straight down -z without perspective, so projecting
   * a world offset onto the screen is just dropping its z.
   */
  function orbitTangent(angle: number) {
    return new Vector2(
      -ringPlaneX.x * Math.sin(angle) + ringPlaneZ.x * Math.cos(angle),
      -ringPlaneX.y * Math.sin(angle) + ringPlaneZ.y * Math.cos(angle),
    )
  }

  const europa = makeMoon(light)
  const station = makeStation()
  // Companion moon; still not a claim about a real Jovian moon's orbit. Its
  // radius tracks Europa's within a few percent on purpose: at a 7.5 x 10.5 px
  // cell a body smaller *and* dimmer than its neighbour loses a third of its ink
  // and reads as a stray glyph cluster rather than as a world, which is exactly
  // how it was reported. The two are told apart by hue and by markings instead.
  const ringMoon = makeMoon(light, '木星内卫星', 0.086, DARK_MOON)
  // `visible` is what keeps a parked station out of the picture; the flags below
  // keep it out of the pointer and off the clock as well.
  station.root.visible = STATION_VISIBLE
  const orbiters = [europa, station.root, ringMoon]
  orbitLayer.add(europa, station.root, ringMoon)

  /*
   * The two moons orbit outside the ring system; the station threads the band
   * itself. That split is deliberate, and it is what buys the hero its planet
   * size: the camera locks the planet's silhouette to the outermost orbit —
   * projecting a circle in the ring plane scales it by `r`, so the ratio is
   * 1 / (0.9287 r) and no value of `scale` changes it — and the outermost orbit
   * here is Europa at 2.31. Moving the station out there as well would push the
   * outermost orbit to 2.53 and cost another 11% of the planet for nothing.
   * Each moon clears the outer ring edge (2.08) by its own radius, and radii are
   * spaced by more than the sum of the two bodies they separate, so no two paths
   * can ever touch. `phase` is the in-plane angle at t = 0, and for the moons it
   * is a framing decision rather than a physical one: the opening frame has
   * Europa left of the planet and a little above its middle, and the vermilion
   * moon level with that middle on the right. The second of those sits on the far
   * half of its orbit — mid-height on the right is where the projected ellipse
   * crosses it, at `-atan(ringPlaneX.y / ringPlaneZ.y)` ≈ -0.68 — but it projects
   * 1.55 model units from the planet's centre against a limb at 1.0, so nothing
   * occludes it and the opening frame still shows both moons.
   *
   * `STATION_ORBIT` is kept in the same set while the station is parked, because
   * its radius is not a free number: the assembly is 17 cells across including
   * its strobe booms, and the in-plane reach of that rectangle is 0.47 (a
   * screen-space corner projects into the ring plane at up to 0.93 of its x and
   * 0.54 of its y). At 1.61 the station clears the inner moon's own body
   * (2.17 - 0.47 - 0.086) and keeps its inner tip 0.14 — about two and a half
   * cells — clear of the planet's limb, which is what lets it cross the disc
   * rather than clip it. The moons would have to move outward to make room for
   * anything larger, and that would cost the planet its size in the hero.
   */
  const RING_MOON_ORBIT = { radius: 2.17, speed: 0.09, phase: -0.68 }
  const EUROPA_ORBIT = { radius: 2.38, speed: 0.035, phase: 2.7 }
  const STATION_ORBIT = { radius: 1.61, speed: 0.025, phase: 2.3 }

  /*
   * A drag turns pointer movement into a change of the angle a body rides at, and
   * the same movement means a smaller turn the further out the body is, so the
   * body needs to know its own radius. Recorded here, beside the orbits
   * themselves, because this is the only other place that knows which body is on
   * which path.
   */
  europa.userData.orbitRadius = EUROPA_ORBIT.radius
  ringMoon.userData.orbitRadius = RING_MOON_ORBIT.radius
  station.root.userData.orbitRadius = STATION_ORBIT.radius

  const target = new WebGLRenderTarget(1024, 768, { minFilter: LinearFilter, magFilter: LinearFilter })
  // This intermediate holds already-authored display colours, premultiplied
  // before filtering. Do not tag it sRGB and accidentally decode/encode it twice.
  const characters = new WebGLRenderTarget(1, 1, {
    minFilter: LinearFilter, magFilter: LinearFilter, depthBuffer: false,
  })
  target.texture.colorSpace = NoColorSpace
  characters.texture.colorSpace = NoColorSpace
  /*
   * `postFragment` resolves the whole scene through one luminance ramp, and the
   * rings are transparent, so they are blended over whatever lies behind them. A
   * body orbiting inside the band therefore takes the band's wash and loses its
   * own colour outright — measured on the station at radius 1.61, not one cool
   * pixel survived. So the orbiters get a second pass with no rings in it, at
   * drawing-buffer resolution: the ASCII pass takes its colour from there
   * wherever a body covers the cell, and from the scene everywhere else. The
   * planet and the rings stay on the ramp.
   */
  const orbiterPass = new WebGLRenderTarget(1, 1, {
    minFilter: LinearFilter, magFilter: LinearFilter,
  })
  orbiterPass.texture.colorSpace = NoColorSpace
  const postScene = new Scene()
  const postCamera = new OrthographicCamera(-1, 1, 1, -1, 0, 1)
  const glyphAtlas = createGlyphAtlas()
  const postMaterial = new ShaderMaterial({
    vertexShader: postVertex, fragmentShader: postFragment,
    depthTest: false, depthWrite: false, blending: NoBlending,
    uniforms: {
      uScene: { value: target.texture }, uGrid: { value: new Vector2(128, 96) },
      uGlyphs: { value: glyphAtlas }, uGlyphCount: { value: ASCII_CHARACTERS.length },
      uOrbiters: { value: orbiterPass.texture },
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

  const raycaster = new Raycaster()
  const pointer = new Vector2()
  const initialPointer = new Vector2()
  const drawingSize = new Vector2()
  let selected: InteractiveRoot | null = null
  let planetYaw = 0
  let lastWidth = 0, lastHeight = 0, lastDpr = 0

  function setPointer(clientX: number, clientY: number) {
    const rect = canvas.getBoundingClientRect()
    pointer.set(
      (clientX - rect.left) / Math.max(1, rect.width) * 2 - 1,
      -((clientY - rect.top) / Math.max(1, rect.height)) * 2 + 1,
    )
    raycaster.setFromCamera(pointer, camera)
  }

  function pick(clientX: number, clientY: number) {
    setPointer(clientX, clientY)
    // `Raycaster` does not consult `visible`, so a parked body has to be dropped
    // here or it would keep taking the pointer while drawing nothing.
    const hits = raycaster.intersectObjects([planet, ...orbiters].filter((body) => body.visible), true)
    return findInteractive(hits[0]?.object ?? null)
  }

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
      orbiterPass.setSize(drawingSize.x, drawingSize.y)
      glitchMaterial.uniforms.uCssSize.value.set(width, height)
      // Readable CSS-pixel glyphs on phones and desktop, independent of DPR.
      postMaterial.uniforms.uGrid.value.set(
        Math.max(1, Math.round(width / PLANET_PRESET.cellWidth)),
        Math.max(1, Math.round(height / PLANET_PRESET.cellHeight)),
      )
      const targetWidth = Math.min(1024, Math.max(512, Math.round(width * 1.5)))
      target.setSize(targetWidth, Math.round(targetWidth / ratio))
      camera.top = FRAME_HALF_WIDTH / ratio
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
    pointerDown(clientX: number, clientY: number) {
      selected = pick(clientX, clientY)
      if (!selected) return null
      initialPointer.set(clientX, clientY)
      return selected.userData.label
    },
    pointerMove(clientX: number, clientY: number) {
      if (!selected) return pick(clientX, clientY)?.userData.label ?? null
      const body = selected.userData
      const width = Math.max(1, canvas.getBoundingClientRect().width)
      const dx = (clientX - initialPointer.x) / width
      const dy = (clientY - initialPointer.y) / width
      if (body.dragKind === 'planet') {
        // Project the gesture onto the screen-space equator; never tilt the axis.
        planetYaw += (dx * Math.cos(-0.38) - dy * Math.sin(-0.38)) * 5
      } else if (body.orbitRadius !== undefined) {
        /*
         * Drag the body *along its own path*. The pointer movement is converted
         * from canvas widths into model units — the frame is `2 *
         * FRAME_HALF_WIDTH` wide however many pixels that is — and then projected
         * onto the orbit's screen-space tangent where the body currently is. The
         * angle advances by that share of the tangent's own length, which makes
         * the body track the pointer one to one on screen, a body on a wider
         * orbit turning less for the same pull. A drag straight across the path
         * leaves it where it is, the way a rail would.
         *
         * The tangent must be taken at the body's whole angle, not at the drag
         * offset alone: the offset starts at zero for every body, and at angle
         * zero the path runs vertically, so a projection taken there swallows a
         * horizontal drag entirely. `placeOnRingOrbit` records that whole angle.
         *
         * This replaces an unprojected `orbitPhase += dx`, which read as inverted
         * over half of every orbit: the orbit projects to a flat ellipse, and on
         * its lower arc screen x runs against the angle there, so dragging right
         * walked the body left — reported on the hero, where both moons then
         * started on that arc. A projection has no such half, so the body follows
         * whichever way the pointer pulls it from wherever it happens to be.
         */
        const angle = body.orbitAngle ?? 0
        const tangent = orbitTangent(angle)
        const pull = 2 * FRAME_HALF_WIDTH * (dx * tangent.x - dy * tangent.y)
        // Re-placed here rather than waiting for the next frame, so the body
        // keeps up with a pointer that moves faster than the render clock.
        const turn = pull / (tangent.lengthSq() * scale * body.orbitRadius)
        body.orbitPhase = (body.orbitPhase ?? 0) + turn
        placeOnRingOrbit(selected, body.orbitRadius, angle + turn)
      }
      initialPointer.set(clientX, clientY)
      return body.label
    },
    pointerUp() {
      const label = selected?.userData.label ?? null
      selected = null
      return label
    },
    pointerLeave() {
      if (!selected) return null
      const label = selected.userData.label
      selected = null
      return label
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
      planet.rotation.y = seconds * 0.07 + planetYaw
      planetMaterial.uniforms.uTime.value = seconds * PLANET_PRESET.animSpeed / 100
      glitchMaterial.uniforms.uTime.value = seconds
      glitchMaterial.uniforms.uMotion.value = motion ? 1 : 0

      // Each body keeps its own radius, so the three paths stay separated while
      // all of them circle the spin axis inside the ring plane. The station is
      // skipped outright while it is parked: it draws nothing, so advancing its
      // clock and its orbit would be work nobody can see.
      const europaAngle = EUROPA_ORBIT.phase + seconds * EUROPA_ORBIT.speed + (europa.userData.orbitPhase ?? 0)
      const ringMoonAngle = RING_MOON_ORBIT.phase + seconds * RING_MOON_ORBIT.speed + (ringMoon.userData.orbitPhase ?? 0)
      placeOnRingOrbit(europa, EUROPA_ORBIT.radius, europaAngle)
      placeOnRingOrbit(ringMoon, RING_MOON_ORBIT.radius, ringMoonAngle)
      if (STATION_VISIBLE) {
        const stationAngle = STATION_ORBIT.phase + seconds * STATION_ORBIT.speed + (station.root.userData.orbitPhase ?? 0)
        placeOnRingOrbit(station.root, STATION_ORBIT.radius, stationAngle)
        // The station keeps its authored attitude — no roll, no yaw — because its
        // assembly is drawn in whole characters: a bank of even three degrees
        // smears a one-cell truss across two rows of glyphs. What moves is the
        // glint and the strobes, which is where the life in it comes from.
        station.animate(seconds)
      }

      // Orbiter pass: the planet draws depth but no colour. Without it, a body
      // that has passed behind the planet still painted its own colour into this
      // pass — nothing was there to reject it — and the ASCII pass then laid
      // that colour over the disc, so bodies showed through the planet. Depth
      // only is the whole trick: it occludes them without adding planet colour
      // to a pass whose job is the bodies' unblended ink.
      // The rings stay out on purpose: they are transparent, and this pass exists
      // so a body inside the band keeps its own colour instead of the wash.
      rings.visible = false
      planetMaterial.colorWrite = false
      renderer.setRenderTarget(orbiterPass)
      renderer.clear()
      renderer.render(scene, camera)
      planetMaterial.colorWrite = true
      rings.visible = true

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
      // The station is assembled from many small meshes and the moons share one
      // material each, so collect the orbiters' resources in sets before
      // disposing them rather than assuming a one-to-one mapping.
      const orbiterGeometries = new Set<BufferGeometry>()
      const orbiterMaterials = new Set<Material>()
      orbitLayer.traverse((object) => {
        if (!(object instanceof Mesh)) return
        orbiterGeometries.add(object.geometry)
        const materials = Array.isArray(object.material) ? object.material : [object.material]
        materials.forEach((material) => orbiterMaterials.add(material))
      })
      orbiterGeometries.forEach((geometry) => geometry.dispose())
      orbiterMaterials.forEach((material) => material.dispose())
      glyphAtlas.dispose()
      target.dispose()
      characters.dispose()
      orbiterPass.dispose()
      renderer.dispose()
    },
  }
}
