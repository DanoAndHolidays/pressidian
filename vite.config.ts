import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { notesPlugin } from './vite/notes-plugin'

const base = process.env.BASE_PATH || '/'
/**
 * `npm run content:index` boots a throwaway dev server with this flag so the
 * index is written by the exact code path the real build uses — no second,
 * drifting implementation of the note graph.
 */
const indexOnly = process.env.PRESSIDIAN_INDEX_ONLY === '1'

export default defineConfig(({ command }) => ({
  base,
  plugins: [
    vue(),
    tailwindcss(),
    // The index snapshot and the compiled note bodies are build artifacts;
    // producing them during `vite dev` would write into watched paths on every
    // start and fight the reload loop.
    notesPlugin({
      assets: !indexOnly,
      writeIndex: command === 'build',
      publishDocuments: command === 'build' && !indexOnly,
      documentsMirrorDir:
        command === 'build' ? fileURLToPath(new URL('./dist/notes', import.meta.url)) : undefined,
    }),
  ],
  server: {
    watch: {
      // `public/vault` is populated from the Obsidian vault on startup; if the
      // watcher follows it, the copy itself registers as a change and the
      // server reloads in a loop until it dies.
      ignored: ['**/public/vault/**', '**/content/**', '**/.playwright-mcp/**'],
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'es2022',
    cssCodeSplit: true,
    // Note bodies are published as static JSON, not bundled; this only has to
    // cover the app shell plus the Shiki-powered markdown runtime.
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('shiki')) return 'shiki'
          if (id.includes('markdown-it')) return 'markdown'
          return undefined
        },
      },
    },
  },
}))
