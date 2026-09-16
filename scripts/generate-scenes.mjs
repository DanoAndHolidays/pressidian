/**
 * Turn the master scene paintings into the responsive, compressed set the site
 * actually ships.
 *
 * The masters are 1900x820 PNGs around 2.5-3.3 MB each — three of them is
 * ~9 MB of backdrop, which is not something a first paint should ever wait on.
 * The site only ever paints them full-bleed behind content, so they are
 * re-encoded to AVIF (primary) and WebP (fallback) at two widths.
 *
 * Masters live in `design-source/scenes/` and are deliberately not served:
 * only the generated derivatives under `public/scenes/` are.
 *
 *   node scripts/generate-scenes.mjs
 */
import { mkdir, readdir, rm, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, extname, join } from 'node:path'
import sharp from 'sharp'

const root = fileURLToPath(new URL('..', import.meta.url))
const sourceDir = join(root, 'design-source', 'scenes')
const outDir = join(root, 'public', 'scenes')

/**
 * `wide` covers a 1920 CSS-pixel viewport at DPR 1; `half` covers phones and
 * any DPR-2 display up to ~960 CSS pixels, which is where the painting's own
 * detail stops being resolvable anyway.
 */
const WIDTHS = [
  { suffix: 'wide', width: 1920 },
  { suffix: 'half', width: 1100 },
]

const FORMATS = [
  // AVIF is roughly half the bytes of WebP at this quality on a soft, hazy
  // painting. Quality 52 is safe here because the image is never the subject —
  // text always sits on top of it, and the CSS treats it as atmosphere.
  { ext: 'avif', options: { quality: 52, effort: 6, chromaSubsampling: '4:2:0' } },
  { ext: 'webp', options: { quality: 76, effort: 5 } },
]

const kb = (bytes) => `${(bytes / 1024).toFixed(0)} KB`

async function main() {
  if (!existsSync(sourceDir)) {
    console.error(`[scenes] no master directory at ${sourceDir}`)
    process.exitCode = 1
    return
  }

  const masters = (await readdir(sourceDir)).filter((name) =>
    ['.png', '.jpg', '.jpeg', '.webp', '.avif'].includes(extname(name).toLowerCase()),
  )

  if (masters.length === 0) {
    console.error(`[scenes] ${sourceDir} holds no master images`)
    process.exitCode = 1
    return
  }

  await mkdir(outDir, { recursive: true })

  const manifest = []

  for (const master of masters.sort()) {
    const key = master.slice(0, -extname(master).length)
    const source = join(sourceDir, master)
    const meta = await sharp(source).metadata()
    const built = []

    for (const { suffix, width } of WIDTHS) {
      // Never upscale: a master narrower than the target keeps its own width.
      const targetWidth = Math.min(width, meta.width ?? width)
      for (const format of FORMATS) {
        const name = `${key}-${suffix}.${format.ext}`
        const file = join(outDir, name)
        const info = await sharp(source)
          .resize({ width: targetWidth, withoutEnlargement: true })
          .toFormat(format.ext, format.options)
          .toFile(file)
        built.push(name)
        console.log(
          `[scenes] ${name.padEnd(28)} ${String(info.width).padStart(4)}x${String(info.height).padEnd(4)} ${kb(info.size)}`,
        )
      }
    }

    manifest.push({
      key,
      master,
      width: meta.width,
      height: meta.height,
      files: built,
    })
  }

  // Consumed by `src/data/scenes.ts` so neither the <picture> sources nor the
  // preload hints can drift from what was actually generated.
  await writeFile(
    join(outDir, 'manifest.json'),
    `${JSON.stringify({ generatedAt: new Date().toISOString(), scenes: manifest }, null, 2)}\n`,
    'utf8',
  )
  console.log(`[scenes] wrote ${manifest.length} scene(s) + manifest.json`)
}

await main()
