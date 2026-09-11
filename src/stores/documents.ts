import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { notes as rawNotes, generatedAt } from 'virtual:notes-meta'
import type { NoteMeta } from '@/lib/notes/types'
import { loadNoteDocument } from '@/lib/notes/loader'

interface CachedDocument {
  html: string
  headings: Array<{ depth: number; id: string; text: string }>
}

/**
 * Metadata is bundled eagerly so the tree, tag cloud and search work instantly;
 * the rendered HTML for a note is fetched the first time that note is opened
 * and then kept in memory for the rest of the session.
 */
export const useDocumentStore = defineStore('documents', () => {
  const cache = ref(new Map<string, CachedDocument>())
  const pending = ref(new Set<string>())
  const failures = ref(new Map<string, string>())

  const isCached = (path: string) => cache.value.has(path)
  const isPending = (path: string) => pending.value.has(path)
  const errorOf = (path: string) => failures.value.get(path) ?? ''

  const load = async (path: string): Promise<CachedDocument | null> => {
    const hit = cache.value.get(path)
    if (hit) return hit
    if (pending.value.has(path)) {
      // A second request for the same note waits for the in-flight one.
      while (pending.value.has(path)) await new Promise((resolve) => setTimeout(resolve, 40))
      return cache.value.get(path) ?? null
    }

    pending.value = new Set(pending.value).add(path)
    try {
      const document_ = await loadNoteDocument(path)
      cache.value = new Map(cache.value).set(path, {
        html: document_.html,
        headings: document_.headings,
      })
      failures.value = new Map([...failures.value].filter(([key]) => key !== path))
      return cache.value.get(path) ?? null
    } catch (error) {
      failures.value = new Map(failures.value).set(path, (error as Error).message)
      return null
    } finally {
      const next = new Set(pending.value)
      next.delete(path)
      pending.value = next
    }
  }

  return {
    noteCount: computed(() => rawNotes.length),
    syncedAt: computed(() => generatedAt),
    cache,
    pending,
    failures,
    isCached,
    isPending,
    errorOf,
    load,
  }
})

export type { NoteMeta }
