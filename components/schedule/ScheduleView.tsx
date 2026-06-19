'use client'

import { useState } from 'react'
import type { Schedule, Video } from '@/lib/types'
import ScheduleCalendar from './ScheduleCalendar'
import ScheduleList from './ScheduleList'

interface ScheduleViewProps {
  schedules: Schedule[]
  videoMap: Record<string, Video>
}

export default function ScheduleView({ schedules, videoMap }: ScheduleViewProps) {
  const [view, setView] = useState<'calendar' | 'list'>('calendar')

  const btnStyle = (active: boolean) => ({
    padding: '7px 16px',
    borderRadius: 8,
    border: '1px solid var(--border-subtle)',
    background: active ? 'var(--bg-elevated)' : 'transparent',
    color: active ? 'var(--text-primary)' : 'var(--text-muted)',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 500,
  })

  return (
    <div>
      {/* Toggle */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24 }}>
        <button style={btnStyle(view === 'calendar')} onClick={() => setView('calendar')}>Calendar</button>
        <button style={btnStyle(view === 'list')} onClick={() => setView('list')}>List</button>
      </div>

      {view === 'calendar' ? (
        <ScheduleCalendar schedules={schedules} videoMap={videoMap} />
      ) : (
        <ScheduleList schedules={schedules} videoMap={videoMap} />
      )}
    </div>
  )
}
