'use client'

import { useState, useMemo } from 'react'
import type { Video, PipelineStage, StageStatus, Platform } from '@/lib/types'
import PipelineColumn from './PipelineColumn'

const STAGES: PipelineStage[] = ['Ideation', 'Scripting', 'Video Production', 'Captions', 'Scheduling', 'Posted']
const STATUSES: StageStatus[] = ['Not Started', 'In Progress', 'Complete']
const PLATFORMS: Platform[] = ['Instagram', 'TikTok', 'YouTube Shorts', 'Google My Business']

interface PipelineBoardProps {
  videos: Video[]
}

export default function PipelineBoard({ videos }: PipelineBoardProps) {
  const [stageFilter, setStageFilter] = useState<PipelineStage | 'All'>('All')
  const [statusFilter, setStatusFilter] = useState<StageStatus | 'All'>('All')
  const [platformFilter, setPlatformFilter] = useState<Platform | 'All'>('All')

  const filtered = useMemo(() => {
    return videos.filter(v => {
      if (stageFilter !== 'All' && v.pipelineStage !== stageFilter) return false
      if (statusFilter !== 'All' && v.stageStatus !== statusFilter) return false
      if (platformFilter !== 'All' && !v.platforms.includes(platformFilter)) return false
      return true
    })
  }, [videos, stageFilter, statusFilter, platformFilter])

  const selectStyle = {
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border-subtle)',
    color: 'var(--text-secondary)',
    borderRadius: 8,
    padding: '6px 12px',
    fontSize: 13,
    cursor: 'pointer',
    outline: 'none',
  }

  return (
    <div>
      {/* Filter bar */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', marginBottom: 24 }}>
        <select value={stageFilter} onChange={e => setStageFilter(e.target.value as PipelineStage | 'All')} style={selectStyle}>
          <option value="All">All Stages</option>
          {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as StageStatus | 'All')} style={selectStyle}>
          <option value="All">All Statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <select value={platformFilter} onChange={e => setPlatformFilter(e.target.value as Platform | 'All')} style={selectStyle}>
          <option value="All">All Platforms</option>
          {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
        </select>

        <span style={{ fontSize: 13, color: 'var(--text-muted)', marginLeft: 'auto' }}>
          {filtered.length} video{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Board */}
      <div
        style={{
          display: 'flex',
          gap: 12,
          overflowX: 'auto',
          paddingBottom: 16,
          alignItems: 'flex-start',
        }}
      >
        {STAGES.filter(s => stageFilter === 'All' || s === stageFilter).map(stage => (
          <PipelineColumn
            key={stage}
            stage={stage}
            videos={filtered.filter(v => v.pipelineStage === stage)}
          />
        ))}
      </div>
    </div>
  )
}
