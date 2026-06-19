'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Video as VideoIcon } from 'lucide-react'
import type { Video, Platform, PipelineStage } from '@/lib/types'
import VideoLibraryCard from './VideoLibraryCard'
import EmptyState from '@/components/ui/EmptyState'

const PLATFORMS: Platform[] = ['Instagram', 'TikTok', 'YouTube Shorts', 'Google My Business']
const STAGES: PipelineStage[] = ['Ideation', 'Scripting', 'Video Production', 'Captions', 'Scheduling', 'Posted']

export default function VideoLibraryClient({ videos }: { videos: Video[] }) {
  const [platform, setPlatform] = useState<Platform | 'All'>('All')
  const [stage, setStage] = useState<PipelineStage | 'All'>('All')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return videos.filter(v => {
      if (platform !== 'All' && !v.platforms.includes(platform)) return false
      if (stage !== 'All' && v.pipelineStage !== stage) return false
      if (search && !v.title.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [videos, platform, stage, search])

  // Group by month
  const groups = useMemo(() => {
    const map: Record<string, Video[]> = {}
    for (const v of filtered) {
      const key = `${v.contentMonth} ${v.contentYear}`
      if (!map[key]) map[key] = []
      map[key].push(v)
    }
    return map
  }, [filtered])

  const selectStyle = {
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border-subtle)',
    color: 'var(--text-secondary)',
    borderRadius: 8,
    padding: '8px 12px',
    fontSize: 13,
    cursor: 'pointer',
    outline: 'none',
  }

  const inputStyle = {
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border-subtle)',
    color: 'var(--text-primary)',
    borderRadius: 8,
    padding: '8px 12px',
    fontSize: 13,
    outline: 'none',
    minWidth: 200,
  }

  return (
    <div>
      {/* Filter bar */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 32 }}>
        <input
          type="text"
          placeholder="Search videos..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={inputStyle}
        />
        <select value={platform} onChange={e => setPlatform(e.target.value as Platform | 'All')} style={selectStyle}>
          <option value="All">All Platforms</option>
          {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <select value={stage} onChange={e => setStage(e.target.value as PipelineStage | 'All')} style={selectStyle}>
          <option value="All">All Stages</option>
          {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={VideoIcon} title="No videos found" subtitle="Try adjusting your filters" />
      ) : (
        Object.entries(groups).map(([month, groupVideos]) => (
          <div key={month} style={{ marginBottom: 40 }}>
            <h3
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: 16,
                marginTop: 0,
              }}
            >
              {month}
            </h3>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 16,
              }}
            >
              {groupVideos.map(video => (
                <motion.div
                  key={video.id}
                  variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0, transition: { duration: 0.25 } } }}
                >
                  <VideoLibraryCard video={video} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        ))
      )}
    </div>
  )
}
