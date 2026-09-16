import { ASCII_CHARACTERS } from './glyph-atlas'

/** A static character silhouette for devices without a usable WebGL context. */
export function fallbackPlanet(columns = 61, rows = 31) {
  return Array.from({ length: rows }, (_, row) =>
    Array.from({ length: columns }, (_, col) => {
      const x = (col / (columns - 1) - .5) * 2.6
      const y = (row / (rows - 1) - .5) * 1.9
      const rx = x * .92 + y * .39, ry = -x * .39 + y * .92
      const sphere = x * x + y * y < .54 ** 2
      const ringRadius = Math.hypot(rx, ry / .3)
      const ring = ringRadius > .72 && ringRadius < 1.14 && Math.abs(ringRadius - .96) > .025
      if (!sphere && !ring) return ' '
      const light = sphere
        ? .48 + .24 * Math.sqrt(1 - (x * x + y * y) / .54 ** 2) - .15 * x - .15 * y + Math.sin(ry * 40) * .13
        : .4 + Math.sin(ringRadius * 90) * .18
      return ASCII_CHARACTERS[Math.min(ASCII_CHARACTERS.length - 1, Math.max(1, Math.floor(light * ASCII_CHARACTERS.length)))]
    }).join(''),
  ).join('\n')
}
