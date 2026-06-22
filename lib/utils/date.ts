export function parseGHLDate(raw: string): Date | null {
  if (!raw) return null
  // Parse YYYY-MM-DD as LOCAL date to avoid UTC midnight → wrong day in non-UTC zones
  const isoDateOnly = /^\d{4}-\d{2}-\d{2}$/.exec(raw)
  if (isoDateOnly) {
    const [y, m, d] = raw.split('-').map(Number)
    return new Date(y, m - 1, d)
  }
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
