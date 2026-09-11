/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
  export default component
}

declare module 'virtual:notes-meta' {
  import type { NoteMeta } from '@/lib/notes/types'
  export const notes: NoteMeta[]
  export const generatedAt: string
}

interface ImportMetaEnv {
  readonly BASE_URL: string
  readonly MODE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
  readonly glob: (
    pattern: string,
    options?: { eager?: boolean; query?: string; import?: string; as?: string },
  ) => Record<string, unknown>
}
