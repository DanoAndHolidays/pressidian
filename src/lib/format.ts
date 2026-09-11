/** `2026-07-30` → `2026.07.30` */
export function formatDate(value: string): string {
  return value ? value.replaceAll('-', '.') : '未标注'
}

/**
 * Human relative time in Chinese, falling back to the absolute date.
 *
 * Notes whose dates were inferred (see AGENTS.md) are usually older than they
 * look, so callers pass those through `formatDate` instead.
 */
export function relativeTime(value: string, now = new Date()): string {
  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return value
  const days = Math.round((now.getTime() - date.getTime()) / 86_400_000)
  if (days <= 0) return '今天'
  if (days === 1) return '昨天'
  if (days < 7) return `${days} 天前`
  if (days < 30) return `${Math.floor(days / 7)} 周前`
  if (days < 365) return `${Math.floor(days / 30)} 个月前`
  return `${Math.floor(days / 365)} 年前`
}

/** Compacts large counts: 1234 → 1.2k */
export function compactNumber(value: number): string {
  if (value < 1000) return `${value}`
  if (value < 10_000) return `${(value / 1000).toFixed(1)}k`
  return `${Math.round(value / 1000)}k`
}
