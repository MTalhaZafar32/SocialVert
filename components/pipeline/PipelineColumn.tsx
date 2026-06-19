'use client'

import { motion } from 'framer-motion'
import type { Video, PipelineStage } from '@/lib/types'
import { getStageColor } from '@/lib/utils/pipeline'
import VideoCard from './VideoCard'
import { Video as VideoIcon } from 'lucide-react'

interface PipelineColumnProps {
  stage: PipelineStage
  videos: Video[]
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
}

export default function PipelineColumn({ stage, videos }: PipelineColumnProps) {
  const color = getStageColor(stage)

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minWidth: 260,
        flex: '0 0 260px',
        background: 'var(--bg-card)',
        borderRadius: 12,
        border: '1px solid var(--border-subtle)',
        overflow: 'hidden',
      }}
    >
      {/* Column header */}
      <div
        style={{
          padding: '14px 16px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          flexShrink: 0,
        }}
      >
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: color, flexShrink: 0 }} />
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', flex: 1 }}>{stage}</span>
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            color,
            background: `${color}18`,
            padding: '2px 8px',
            borderRadius: 999,
          }}
        >
          {videos.length}
        </span>
      </div>

      {/* Cards */}
      <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'auto', flex: 1 }}>
        {videos.length === 0 ? (
          <div style={{ padding: '24px 0', textAlign: 'center' }}>
            <VideoIcon size={24} color="var(--text-muted)" style={{ margin: '0 auto 8px' }} />
            <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>No videos here yet</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
          >
            {videos.map(video => (
              <motion.div key={video.id} variants={itemVariants}>
                <VideoCard video={video} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
