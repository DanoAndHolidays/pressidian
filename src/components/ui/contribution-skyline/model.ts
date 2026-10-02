export type ContributionDay = {
  date: string
  count: number
  level?: number
}

export type ContributionCell = {
  date: string
  count: number
  level: number
  week: number
  day: number
}

export type ContributionStreak = {
  days: number
  start: string | null
  end: string | null
}

export type ContributionStats = {
  total: number
  activeDays: number
  busiest: { date: string | null; count: number }
  longest: ContributionStreak
  current: ContributionStreak
}

export type ContributionModel = {
  cells: ContributionCell[]
  weeks: number
  max: number
  stats: ContributionStats
  months: Array<{ week: number; label: string }>
}

export type Camera = {
  cs: number
  sn: number
  se: number
  ce: number
}

export const DAY_MS = 86_400_000
export const YAW_3D = Math.PI / 4
export const ELEV_3D = (34 * Math.PI) / 180
export const YAW_RANGE: [number, number] = [(10 * Math.PI) / 180, (80 * Math.PI) / 180]
export const ELEV_RANGE: [number, number] = [(20 * Math.PI) / 180, (58 * Math.PI) / 180]

export const clamp01 = (value: number) => Math.min(1, Math.max(0, value))
export const lerp = (from: number, to: number, amount: number) => from + (to - from) * amount

export const easeInOutCubic = (value: number) => {
  const t = clamp01(value)
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

export const easeOutCubic = (value: number) => 1 - Math.pow(1 - clamp01(value), 3)

export const dayMs = (value: string | number | Date): number => {
  if (typeof value === 'number') return Math.floor(value / DAY_MS) * DAY_MS
  if (typeof value === 'string') {
    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value)
    if (match) return Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
    const date = new Date(value)
    return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  }
  return Date.UTC(value.getFullYear(), value.getMonth(), value.getDate())
}

export const toDateKey = (milliseconds: number) => new Date(milliseconds).toISOString().slice(0, 10)

const rng = (seed: number) => {
  let value = seed >>> 0
  return () => {
    value = (value + 0x6d2b79f5) >>> 0
    let t = value
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296
  }
}

/** A deterministic fallback. It is deliberately labelled as a sample by the UI. */
export const generateSampleContributions = (end: number, seed = 2026, days = 371): ContributionDay[] => {
  const random = rng(seed)
  const bursts = Array.from({ length: 5 }, () => ({
    at: random(),
    width: 0.035 + random() * 0.08,
    gain: 0.5 + random() * 1.25,
  }))
  const result: ContributionDay[] = []
  let momentum = 0.5

  for (let index = 0; index < days; index += 1) {
    const timestamp = end - (days - 1 - index) * DAY_MS
    const progress = index / Math.max(1, days - 1)
    const weekday = new Date(timestamp).getUTCDay()
    const weekend = weekday === 0 || weekday === 6
    momentum = momentum * 0.86 + random() * 0.14

    let energy = 0.14
    for (const burst of bursts) {
      energy += burst.gain * Math.exp(-((progress - burst.at) ** 2) / (2 * burst.width ** 2))
    }
    energy *= 0.58 + momentum * 0.82

    let count = 0
    if (random() < Math.min(0.92, (weekend ? 0.2 : 0.48) + energy * 0.35)) {
      count = 1 + Math.floor(-Math.log(1 - random()) * (1.1 + energy * 6.5) * (weekend ? 0.55 : 1))
    }
    if (random() < 0.012) count += 14 + Math.floor(random() * 20)
    result.push({ date: toDateKey(timestamp), count })
  }

  return result
}

export const levelOf = (count: number, busy: number) =>
  count <= 0 ? 0 : busy <= 0 ? 4 : 1 + Math.min(3, Math.floor((count / busy) * 4))

export const buildContributionModel = (
  source: ContributionDay[],
  end: number,
  locale = 'zh-CN',
  weekStart: 0 | 1 = 0,
): ContributionModel => {
  const counts = new Map<string, number>()
  for (const entry of source) {
    const count = Number(entry?.count)
    if (!entry?.date || !Number.isFinite(count) || count <= 0) continue
    const key = toDateKey(dayMs(entry.date))
    counts.set(key, (counts.get(key) ?? 0) + count)
  }

  let start = end - 364 * DAY_MS
  start -= ((new Date(start).getUTCDay() - weekStart + 7) % 7) * DAY_MS

  const cells: ContributionCell[] = []
  for (let timestamp = start, index = 0; timestamp <= end; timestamp += DAY_MS, index += 1) {
    const date = toDateKey(timestamp)
    cells.push({
      date,
      count: counts.get(date) ?? 0,
      level: 0,
      week: Math.floor(index / 7),
      day: index % 7,
    })
  }

  const nonZero = cells
    .map((cell) => cell.count)
    .filter((count) => count > 0)
    .sort((a, b) => a - b)
  const busy = nonZero.length ? nonZero[Math.floor(0.95 * (nonZero.length - 1))] : 0
  for (const cell of cells) cell.level = levelOf(cell.count, busy)

  const weeks = cells.length ? cells.at(-1)!.week + 1 : 0
  const monthFormat = new Intl.DateTimeFormat(locale, { month: 'short', timeZone: 'UTC' })
  const months: Array<{ week: number; label: string }> = []
  let previousMonth = -1
  for (let week = 0; week < weeks; week += 1) {
    const cell = cells[week * 7]
    if (!cell) break
    const month = Number(cell.date.slice(5, 7))
    if (month !== previousMonth) months.push({ week, label: monthFormat.format(dayMs(cell.date)) })
    previousMonth = month
  }
  if (months.length > 1 && months[1].week - months[0].week < 3) months.shift()

  return {
    cells,
    weeks,
    max: nonZero.at(-1) ?? 0,
    stats: computeStats(cells),
    months,
  }
}

const computeStats = (cells: ContributionCell[]): ContributionStats => {
  let total = 0
  let activeDays = 0
  let busiest = { date: null as string | null, count: 0 }
  let running = 0
  let runStart: string | null = null
  let longest: ContributionStreak = { days: 0, start: null, end: null }

  for (const cell of cells) {
    total += cell.count
    if (cell.count > 0) {
      activeDays += 1
      if (running === 0) runStart = cell.date
      running += 1
      if (running > longest.days) longest = { days: running, start: runStart, end: cell.date }
      if (cell.count > busiest.count) busiest = { date: cell.date, count: cell.count }
    } else {
      running = 0
      runStart = null
    }
  }

  let cursor = cells.length - 1
  if (cursor >= 0 && cells[cursor].count === 0) cursor -= 1
  const currentEnd = cursor
  while (cursor >= 0 && cells[cursor].count > 0) cursor -= 1
  const currentDays = currentEnd - cursor
  const current = currentDays > 0
    ? { days: currentDays, start: cells[cursor + 1].date, end: cells[currentEnd].date }
    : { days: 0, start: null, end: null }

  return { total, activeDays, busiest, longest, current }
}

export const barHeight = (count: number, max: number, scale = 1) =>
  count > 0 && max > 0 ? 0.32 + Math.pow(count / max, 0.82) * 7.4 * scale : 0.16

export const riseAt = (progress: number, week: number, weeks: number, day: number) => {
  const delay = (weeks > 1 ? week / (weeks - 1) : 0) * 0.34 + (day / 6) * 0.07
  return easeOutCubic((progress - delay) / 0.58)
}

export const camera = (progress: number, yawOffset = 0, elevationOffset = 0): Camera => {
  const yaw = Math.min(YAW_RANGE[1], Math.max(0, lerp(0, YAW_3D + yawOffset, progress)))
  const elevation = lerp(
    Math.PI / 2,
    Math.min(ELEV_RANGE[1], Math.max(ELEV_RANGE[0], ELEV_3D + elevationOffset)),
    progress,
  )
  return {
    cs: Math.cos(yaw),
    sn: Math.sin(yaw),
    se: Math.sin(elevation),
    ce: Math.cos(elevation),
  }
}

export const projectPoint = (cam: Camera, x: number, y: number, z: number): [number, number] => [
  x * cam.cs - y * cam.sn,
  (x * cam.sn + y * cam.cs) * cam.se - z * cam.ce,
]

export const depthOf = (cam: Camera, x: number, y: number) => x * cam.sn + y * cam.cs
