'use client'

import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import type { Schedule, Video } from '@/lib/types'
import PlatformPill from '@/components/ui/PlatformPill'
import Badge from '@/components/ui/Badge'
import { getScheduleStatusColors } from '@/lib/utils/pipeline'
import { parseGHLDate } from '@/lib/utils/date'

const STATUS_DOTS: Record<string, string> = {
  Posted:    '#10B981',
  Scheduled: '#4FB3F6',
  Pending:   '#6B7280',
  Rescheduled: '#F59E0B',
  Cancelled: '#FC8181',
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

interface ScheduleCalendarProps {
  schedules: Schedule[]
  videoMap: Record<string, Video>
}

export default function ScheduleCalendar({ schedules, videoMap }: ScheduleCalendarProps) {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [popover, setPopover] = useState<string | null>(null)

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDay = new Date(year, month, 1).getDay()
  const startOffset = firstDay === 0 ? 6 : firstDay - 1

  const monthName = new Date(year, month, 1).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })

  const schedulesByDay = useMemo(() => {
    const map: Record<number, Schedule[]> = {}
    for (const s of schedules) {
      const d = parseGHLDate(s.postingDate)
      if (!d) continue
      if (d.getFullYear() === year && d.getMonth() === month) {
        const day = d.getDate()
        if (!map[day]) map[day] = []
        map[day].push(s)
      }
    }
    return map
  }, [schedules, year, month])

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  const totalCells = startOffset + daysInMonth
  const rows = Math.ceil(totalCells / 7)

  return (
    <div>
      {/* Month nav */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
        <button onClick={prevMonth} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: '6px 10px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
          <ChevronLeft size={16} />
        </button>
        <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', minWidth: 140, textAlign: 'center' }}>
          {monthName}
        </span>
        <button onClick={nextMonth} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: '6px 10px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Day headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 2 }}>
        {DAYS.map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '6px 0' }}>
            {d}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
        {Array.from({ length: rows * 7 }).map((_, idx) => {
          const day = idx - startOffset + 1
          if (day < 1 || day > daysInMonth) {
            return <div key={idx} style={{ minHeight: 80, background: 'var(--bg-card)', borderRadius: 6, opacity: 0.3 }} />
          }

          const daySchedules = schedulesByDay[day] ?? []
          const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day
          const visible = daySchedules.slice(0, 3)
          const extra = daySchedules.length - visible.length

          return (
            <div
              key={idx}
              style={{
                minHeight: 80,
                background: 'var(--bg-card)',
                border: isToday ? '2px solid var(--blue-400)' : '1px solid var(--border-subtle)',
                borderRadius: 6,
                padding: '6px 6px 4px',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <div style={{ fontSize: 11, color: isToday ? 'var(--blue-400)' : 'var(--text-muted)', fontWeight: isToday ? 700 : 400, marginBottom: 4 }}>
                {day}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {visible.map(s => {
                  const video = videoMap[s.videoId]
                  const dotColor = STATUS_DOTS[s.status] ?? '#6B7280'
                  return (
                    <button
                      key={s.id}
                      onClick={() => setPopover(popover === s.id ? null : s.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        background: 'var(--bg-elevated)',
                        border: 'none',
                        borderRadius: 4,
                        padding: '2px 4px',
                        cursor: 'pointer',
                        width: '100%',
                        textAlign: 'left',
                      }}
                    >
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: dotColor, flexShrink: 0 }} />
                      <span style={{ fontSize: 10, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {video?.title ?? '—'}
                      </span>

                      {/* Popover */}
                      {popover === s.id && (
                        <div
                          onClick={e => e.stopPropagation()}
                          style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            zIndex: 20,
                            background: 'var(--bg-elevated)',
                            border: '1px solid var(--border-default)',
                            borderRadius: 10,
                            padding: 12,
                            minWidth: 200,
                            boxShadow: 'var(--shadow-elevated)',
                          }}
                        >
                          <p style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.4 }}>
                            {video?.title}
                          </p>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <PlatformPill platform={s.platform} />
                            {s.postingTime && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.postingTime}</span>}
                            <Badge label={s.status} bg={getScheduleStatusColors(s.status).bg} text={getScheduleStatusColors(s.status).text} size="sm" />
                            {s.postUrl && (
                              <a href={s.postUrl} target="_blank" rel="noopener noreferrer"
                                style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--blue-400)', textDecoration: 'none' }}>
                                <ExternalLink size={12} /> View Post
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </button>
                  )
                })}
                {extra > 0 && (
                  <span style={{ fontSize: 10, color: 'var(--text-muted)', padding: '1px 4px' }}>+{extra} more</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
