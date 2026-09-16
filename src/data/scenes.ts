import manifest from '../../public/scenes/manifest.json'

/**
 * The three paintings the site is built on.
 *
 * They arrived as three takes on one scene — a serene daylight megastructure, a
 * corrupted daylight version of it, and a corrupted night version. That is not
 * a set of alternatives to choose between: it is a state machine. Day and night
 * are the two backgrounds the homepage alternates between, and the corrupted
 * daylight frame is the transition texture played across the swap.
 *
 * Every path below is derived from what `scripts/generate-scenes.mjs` actually
 * wrote, so a missing derivative is a build error rather than a 404.
 */
export type SceneKey = 'day' | 'dayGlitch' | 'night'

type SceneMaster = { key: string; width: number; height: number; files: string[] }

const masters = new Map<string, SceneMaster>(
  (manifest.scenes as SceneMaster[]).map((scene) => [scene.key, scene]),
)

/** Only the widths the generator is configured to emit. */
type SceneWidth = 'wide' | 'half'
/** AVIF first; WebP is the fallback for browsers without AVIF. */
const FORMATS = ['avif', 'webp'] as const

function derive(key: string) {
  const master = masters.get(key)
  if (!master) {
    throw new Error(
      `[scenes] "${key}" is missing from public/scenes/manifest.json — run \`node scripts/generate-scenes.mjs\``,
    )
  }

  const base = `${import.meta.env.BASE_URL}scenes/`
  const source = (width: SceneWidth, format: (typeof FORMATS)[number]) => {
    const name = `${key}-${width}.${format}`
    if (!master.files.includes(name)) {
      throw new Error(`[scenes] "${name}" was never generated — re-run the scene generator`)
    }
    return `${base}${name}`
  }
  /** `srcset` in the order the generator emits widths, widest last. */
  const srcset = (format: (typeof FORMATS)[number]) =>
    (['half', 'wide'] as const).map((w) => `${source(w, format)} ${w === 'wide' ? 1920 : 1100}w`).join(', ')

  return {
    /** Natural size of the master, used to reserve the box before decode. */
    ratio: `${master.width} / ${master.height}`,
    avif: srcset('avif'),
    webp: srcset('webp'),
    /** Lowest-weight variant, for the pre-JavaScript poster. */
    poster: source('half', 'webp'),
    /** What a preload hint should fetch. */
    preload: source('wide', 'avif'),
  }
}

export const SCENES = {
  day: derive('day'),
  dayGlitch: derive('day-glitch'),
  night: derive('night'),
} as const satisfies Record<SceneKey, ReturnType<typeof derive>>

export type Scene = (typeof SCENES)[SceneKey]

/** Which scene each half of the day/night cycle paints. */
export const CYCLE: readonly ['day', 'night'] = ['day', 'night']
