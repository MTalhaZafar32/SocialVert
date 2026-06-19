'use client'

import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import type { Video } from '@/lib/types'
import PlatformPill from '@/components/ui/PlatformPill'
import Badge from '@/components/ui/Badge'
import { getStageStatusColors } from '@/lib/utils/pipeline'

export default function VideoCard({ video }: { video: Video }) {
  const statusColors = getStageStatusColors(video.stageStatus)
  const showFileLink = video.videoFileLink && (
    video.pipelineStage === 'Video Production' ||
    video.pipelineStage === 'Captions' ||
    video.pipelineStage === 'Scheduling' ||
    video.pipelineStage === 'Posted'
  )

  const recordingStatusColors: Record<string, { bg: string; text: string }> = {
    'Not Started':       { bg: '#1F2937', text: '#6B7280' },
    'Awaiting Recording':{ bg: 'rgba(245,158,11,0.12)', text: '#F59E0B' },
    'In Editing':        { bg: 'rgba(124,92,232,0.12)', text: '#7C5CE8' },
    'Ready':             { bg: 'rgba(16,185,129,0.12)', text: '#10B981' },
  }

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.15 }}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 10,
        padding: 14,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        cursor: 'default',
        transition: 'border-color 150ms ease, box-shadow 150ms ease',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget
        el.style.borderColor = 'var(--border-default)'
        el.style.boxShadow = '0 0 0 1px rgba(79,179,246,0.1), 0 4px 16px rgba(0,0,0,0.2)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget
        el.style.borderColor = 'var(--border-subtle)'
        el.style.boxShadow = 'none'
      }}
    >
      {/* Title */}
      <p
        style={{
          fontSize: 14,
          fontWeight: 500,
          color: 'var(--text-primary)',
          margin: 0,
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          lineHeight: 1.4,
        }}
      >
        {video.title}
      </p>

      {/* Platforms */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {video.platforms.map(p => <PlatformPill key={p} platform={p} />)}
      </div>

      {/* Bottom row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
        <Badge label={video.stageStatus} bg={statusColors.bg} text={statusColors.text} size="sm" />

        {video.pipelineStage === 'Video Production' && video.recordingStatus && (
          <Badge
            label={video.recordingStatus}
            bg={recordingStatusColors[video.recordingStatus]?.bg ?? '#1F2937'}
            text={recordingStatusColors[video.recordingStatus]?.text ?? '#6B7280'}
            size="sm"
          />
        )}

        {showFileLink && (
          <a
            href={video.videoFileLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 11,
              color: 'var(--blue-400)',
              textDecoration: 'none',
              marginLeft: 'auto',
            }}
          >
            <ExternalLink size={11} />
            View
          </a>
        )}
      </div>
    </motion.div>
  )
}
