export function parseGHLDate(raw: string): Date | null {
  if (!raw) return null
  const d = new Date(raw)
  return isNaN(d.getTime()) ? null : d
}

export function formatDate(raw: string): string {
  const d = parseGHLDate(raw)
  if (!d) return raw
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}

export function formatShortDate(raw: string): string {
  const d = parseGHLDate(raw)
  if (!d) return raw
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export function getMonthYear(month: string, year: number): string {
  return `${month} ${year}`
}
