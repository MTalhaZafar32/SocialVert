'use client'

import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import type { Video, PipelineStage } from '@/lib/types'
import { getStageColor } from '@/lib/utils/pipeline'
import ProgressBar from '@/components/ui/ProgressBar'

const STAGES: PipelineStage[] = ['Ideation', 'Scripting', 'Video Production', 'Captions', 'Scheduling', 'Posted']

export default function PipelineOverview({ videos }: { videos: Video[] }) {
  const params = useParams()
  const router = useRouter()
  const token = params.token as string

  const total = Math.max(videos.length, 1)

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16, marginTop: 0 }}>
        Pipeline Overview
      </h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: 12,
          overflowX: 'auto',
          paddingBottom: 4,
        }}
        className="pipeline-overview-grid"
      >
        {STAGES.map((stage, i) => {
          const count = videos.filter(v => v.pipelineStage === stage).length
          const color = getStageColor(stage)
          return (
            <motion.div
              key={stage}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              onClick={() => router.push(`/client/${token}/pipeline`)}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 12,
                padding: '16px',
                cursor: 'pointer',
                minWidth: 120,
                transition: 'border-color 150ms ease, background 150ms ease',
              }}
              whileHover={{ scale: 1.02 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: color,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: 'var(--text-secondary)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {stage}
                </span>
              </div>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: count > 0 ? color : 'var(--text-muted)',
                  marginBottom: 12,
                  lineHeight: 1,
                }}
              >
                {count}
              </div>
              <ProgressBar value={count / total} color={color} height={3} />
            </motion.div>
          )
        })}
      </div>
      <style>{`
        @media (max-width: 768px) {
          .pipeline-overview-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 480px) {
          .pipeline-overview-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </div>
  )
}
