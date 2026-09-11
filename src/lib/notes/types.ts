/**
 * Shared content model for the Pressidian knowledge garden.
 *
 * A note is produced twice:
 *  - `NoteMeta` is cheap metadata bundled eagerly so lists, search and the
 *    knowledge tree render instantly;
 *  - `NoteDocument` carries the compiled HTML and is loaded per route.
 */

export type NoteStatus = 'evergreen' | 'growing' | 'seedling'

export interface NoteRelation {
  /** Route of the related note. */
  path: string
  /** Why the two notes sit next to each other. */
  relation: string
}

export interface NoteHeading {
  /** Heading depth, 2-4. */
  depth: number
  /** Anchor id assigned by the markdown pipeline. */
  id: string
  /** Visible heading text. */
  text: string
}

export interface NoteMeta {
  title: string
  description: string
  /** Route path, e.g. `/notes/vue-components`. */
  path: string
  /** `YYYY-MM-DD`. */
  date: string
  /**
   * `declared` when the note states its own date; `inferred` when it was read
   * out of the title/body or fell back to the file timestamp. The UI marks
   * inferred dates so a vault without date frontmatter stays honest.
   */
  dateSource: 'declared' | 'inferred'
  tags: string[]
  status: NoteStatus
  /** Estimated reading time in minutes. */
  readingTime: number
  /** Number of words/characters, used for the "weight" readout. */
  weight: number
  /** Folder segments below the vault root, used by the knowledge tree. */
  segments: string[]
  /** Link-graph degree: how many notes point here plus how many it points to. */
  degree: number
  related: NoteRelation[]
}

export interface NoteDocument {
  /** Route path — mirrors `NoteMeta.path`. */
  path: string
  /** Compiled, sanitised HTML. */
  html: string
  headings: NoteHeading[]
  /** Inline SVG markup for fenced code blocks, keyed by block index. */
  highlighted: Record<string, string>
}
