/**
 * Static server that mirrors how GitHub Pages serves the site.
 *
 * `vite preview` cannot reproduce the deployed layout: it serves `dist/` as the
 * web root, while the live site is reached through `/pressidian/`. That blind
 * spot once let a build with broken asset paths reach production, so
 * verification uses this instead.
 *
 * It behaves like the host in the two ways that matter: files are served as-is
 * from the given root, and unmatched paths return 404 (no SPA fallback — which
 * is exactly why the router uses hash history).
 *
 *   npm run build
 *   copy dist to <root>/pressidian
 *   node scripts/serve-pages.mjs <root> 4182
 *   # http://127.0.0.1:4182/pressidian/
 */
import { createServer } from 'node:http'
import { promises as fs } from 'node:fs'
import path from 'node:path'

const [, , rootArg, portArg] = process.argv
const root = path.resolve(rootArg ?? 'dist')
const port = Number(portArg ?? 4182)

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.bmp': 'image/bmp',
  '.pdf': 'application/pdf',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
}

/** Rejects traversal outside the served root. */
const resolveSafe = (pathname) => {
  const candidate = path.resolve(root, `.${decodeURIComponent(pathname)}`)
  return candidate === root || candidate.startsWith(root + path.sep) ? candidate : null
}

const readFileOrNull = (file) => fs.readFile(file).catch(() => null)

const isDirectory = (file) =>
  fs
    .stat(file)
    .then((info) => info.isDirectory())
    .catch(() => false)

createServer(async (req, res) => {
  const pathname = (req.url ?? '/').split('?')[0] ?? '/'
  let file = resolveSafe(pathname)

  if (!file) {
    res.writeHead(403).end('Forbidden')
    return
  }

  if (await isDirectory(file)) file = path.join(file, 'index.html')
  let body = await readFileOrNull(file)

  if (!body) {
    // GitHub Pages returns its own 404 page with a 404 status. Browsers refuse
    // to run ES modules served under 404, so an SPA cannot boot from here.
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
    res.end('404 — no file at this path')
    return
  }

  res.writeHead(200, {
    'Content-Type': TYPES[path.extname(file).toLowerCase()] ?? 'application/octet-stream',
    'Cache-Control': 'no-cache',
  })
  res.end(body)
}).listen(port, () => {
  console.log(`[serve-pages] ${root} → http://127.0.0.1:${port}/`)
})
