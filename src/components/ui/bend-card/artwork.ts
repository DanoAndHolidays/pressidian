import evergreen from './evergreen.svg'
import growing from './growing.svg'
import seedling from './seedling.svg'
import type { NoteStatus } from '@/lib/notes/types'

/**
 * Fold artwork for the vendored bend card, one plate per note maturity.
 *
 * These are plain SVG imports rather than remote URLs: `BendCard` defaults to a
 * pixabay photo, and pointing the homepage at a third-party CDN would make the
 * most prominent section of the site depend on someone else's uptime. Vite
 * fingerprints whatever this module imports, so the plates are cached and
 * cache-busted with the rest of the bundle.
 */
export const BEND_CARD_ARTWORK: Record<NoteStatus, string> = {
  evergreen,
  growing,
  seedling,
}
