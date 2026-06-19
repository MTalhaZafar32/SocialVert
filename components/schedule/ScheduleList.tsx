'use client'

import { useMemo } from 'react'
import { ExternalLink, Calendar } from 'lucide-react'
import type { Schedule, Video } from '@/lib/types'
import PlatformPill from '@/components/ui/PlatformPill'
import Badge from '@/components/ui/Badge'
import { getScheduleStatusColors } from '@/lib/utils/pipeline'
import { parseGHLDate } from '@/lib/utils/date'
import EmptyState from '@/components/ui/EmptyState'

interface ScheduleListProps {
  schedules: Schedule[]
  videoMap: Record<string, Video>
}

function getWeekLabel(date: Date): string {
  const monday = new Date(date)
  const day = monday.getDay()
  const diff = day === 0 ? -6 : 1 - day
  monday.setDate(monday.getDate() + diff)
  return `Week of ${monday.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`
}

export default function ScheduleList({ schedules, videoMap }: ScheduleListProps) {
  const now = new Date()

  const grouped = useMemo(() => {
    const map: Record<string, Schedule[]> = {}
    for (const s of schedules) {
      const d = parseGHLDate(s.postingDate)
      if (!d) continue
      const key = getWeekLabel(d)
      if (!map[key]) map[key] = []
      map[key].push(s)
    }
    return map
  }, [schedules])

  if (schedules.length === 0) {
    return <EmptyState icon={Calendar} title="No posts scheduled yet" subtitle="Scheduled posts will appear here once they're set up" />
  }

  return (
    <div>
      {Object.entries(grouped).map(([week, items]) => (
        <div key={week} style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12, marginTop: 0 }}>
            {week}
          </h3>
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 12,
              overflow: 'hidden',
            }}
          >
            {items.map((schedule, i) => {
              const d = parseGHLDate(schedule.postingDate)
              const isPast = d ? d < now : false
              const statusColors = getScheduleStatusColors(schedule.status)
              const video = videoMap[schedule.videoId]

              return (
                <div
                  key={schedule.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '120px 1fr auto auto auto',
                    gap: 16,
                    alignItems: 'center',
                    padding: '14px 20px',
                    borderTop: i > 0 ? '1px solid var(--border-subtle)' : 'none',
                    borderLeft: !isPast ? '2px solid var(--blue-400)' : '2px solid transparent',
                    opacity: isPast ? 0.7 : 1,
                    flexWrap: 'wrap',
                  }}
                >
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>
                    {d ? d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }) : schedule.postingDate}
                  </span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                    <PlatformPill platform={schedule.platform} />
                    <span style={{ fontSize: 13, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {video?.title ?? 'Unknown video'}
                    </span>
                  </div>

                  <span style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    {schedule.postingTime ?? '—'}
                  </span>

                  <Badge label={schedule.status} bg={statusColors.bg} text={statusColors.text} size="sm" />

                  {schedule.postUrl ? (
                    <a
                      href={schedule.postUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--blue-400)', textDecoration: 'none' }}
                    >
                      <ExternalLink size={12} />
                      Post
                    </a>
                  ) : (
                    <span style={{ width: 40 }} />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
