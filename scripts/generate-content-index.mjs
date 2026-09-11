/**
 * Regenerates `content/.index.json` without producing a full build.
 *
 * It boots Vite in middleware mode and asks for the `virtual:notes` module,
 * which runs the very same note-graph code the production build uses. That
 * keeps the inspectable index honest instead of maintaining a parallel
 * implementation that can drift.
 */
import { createServer } from 'vite'

process.env.PRESSIDIAN_INDEX_ONLY = '1'

const server = await createServer({
  logLevel: 'warn',
  server: { middlewareMode: true },
  optimizeDeps: { noDiscovery: true },
})

try {
  await server.transformRequest('virtual:notes')
  console.log('[content:index] wrote content/.index.json')
} finally {
  await server.close()
}
