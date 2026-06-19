'use client'

import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import type { Video } from '@/lib/types'
import PlatformPill from '@/components/ui/PlatformPill'
import Badge from '@/components/ui/Badge'
import { getStageColor } from '@/lib/utils/pipeline'

export default function VideoLibraryCard({ video }: { video: Video }) {
  const stageColor = getStageColor(video.pipelineStage)

  return (
    <motion.div
      whileHover={{ scale: 1.005 }}
      transition={{ duration: 0.15 }}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 12,
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        transition: 'border-color 150ms ease',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-default)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-subtle)' }}
    >
      <p
        style={{
          margin: 0,
          fontSize: 16,
          fontWeight: 500,
          color: 'var(--text-primary)',
          lineHeight: 1.4,
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }}
      >
        {video.title}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {video.platforms.map(p => <PlatformPill key={p} platform={p} />)}
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '2px 7px',
            borderRadius: 999,
            fontSize: 11,
            fontWeight: 500,
            background: video.videoType === 'Educational' ? 'rgba(30,150,245,0.12)' : 'rgba(124,92,232,0.12)',
            color: video.videoType === 'Educational' ? '#4FB3F6' : '#7C5CE8',
          }}
        >
          {video.videoType}
        </span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
        <Badge label={video.pipelineStage} bg={`${stageColor}18`} text={stageColor} />
        {video.videoFileLink && (
          <a
            href={video.videoFileLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 12,
              color: 'var(--blue-400)',
              border: '1px solid var(--blue-400)',
              borderRadius: 6,
              padding: '4px 10px',
              textDecoration: 'none',
              fontWeight: 500,
              transition: 'background 150ms ease',
            }}
          >
            <ExternalLink size={12} />
            View Video
          </a>
        )}
      </div>
    </motion.div>
  )
}
