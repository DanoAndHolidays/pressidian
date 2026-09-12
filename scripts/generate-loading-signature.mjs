import { readFile, writeFile } from 'node:fs/promises'

// Keep the original logo pixels; embedding them makes the SVG image self-contained.
const brandDirectory = new URL('../public/brand/', import.meta.url)
const logo = await readFile(new URL('dano-logo.png', brandDirectory))
const strokes = [
  { delay: 100, duration: 340, path: 'M145 49 C130 73 111 111 97 144' },
  { delay: 380, duration: 550, path: 'M80 75 C108 47 150 39 175 61 C205 90 151 151 103 148 C88 147 89 135 103 125' },
  { delay: 880, duration: 370, path: 'M223 105 C214 90 194 98 183 114 C168 134 179 147 193 139 C207 131 218 108 222 100 C214 115 207 133 215 138 C222 143 233 130 240 120' },
  { delay: 1200, duration: 330, path: 'M240 120 L249 100 C240 119 232 138 236 139 C247 119 258 99 270 101 C283 103 267 125 268 135 C270 146 286 132 297 120' },
  { delay: 1490, duration: 350, path: 'M326 103 C316 94 299 103 292 118 C281 139 297 149 312 136 C325 125 333 107 326 103 C318 99 313 109 318 114 C327 122 342 119 353 106' },
]

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 200" role="img" aria-labelledby="title">
  <title id="title">手写 Dano，然后弹出 Dano 标志</title>
  <style>
    .handwriting { animation: ink-away 240ms ease 1960ms both; transform-origin: 225px 100px; }
    .stroke { fill: none; stroke: #f87821; stroke-width: 7; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 1; stroke-dashoffset: 1; animation: write-in var(--duration) cubic-bezier(.4,0,.2,1) var(--delay) both; }
    .logo { opacity: 0; transform-box: fill-box; transform-origin: center; animation: logo-pop 640ms cubic-bezier(.22,1,.36,1) 2040ms both; }
    @keyframes write-in { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
    @keyframes ink-away { from { opacity: 1; transform: scale(1); } to { opacity: 0; transform: scale(.92); } }
    @keyframes logo-pop {
      0% { opacity: 0; transform: translateY(8px) scale(.7) rotate(-5deg); }
      62% { opacity: 1; transform: translateY(-2px) scale(1.055) rotate(1.5deg); }
      100% { opacity: 1; transform: translateY(0) scale(1) rotate(0); }
    }
    @media (prefers-reduced-motion: reduce) {
      .handwriting { display: none; }
      .logo { animation: none; opacity: 1; transform: none; }
    }
  </style>
  <g class="handwriting">
${strokes.map(({ path, delay, duration }) => `    <path class="stroke" pathLength="1" d="${path}" style="--delay:${delay}ms;--duration:${duration}ms" />`).join('\n')}
  </g>
  <image class="logo" href="data:image/png;base64,${logo.toString('base64')}" x="0" y="0" width="450" height="200" />
</svg>
`

await writeFile(new URL('dano-loading.svg', brandDirectory), svg)
console.log('Generated public/brand/dano-loading.svg (animation completes at 2680ms).')
