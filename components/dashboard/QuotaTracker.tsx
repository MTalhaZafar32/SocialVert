'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView, animate } from 'framer-motion'
import { Check, Clock, Circle } from 'lucide-react'
import StatCard from './StatCard'

interface QuotaTrackerProps {
  quota: number
  completed: number
  inProgress: number
  remaining: number
}

const SIZE = 200
const STROKE = 20
const R = (SIZE - STROKE) / 2
const CIRC = 2 * Math.PI * R
const GAP = 4

function arc(start: number, end: number): { dasharray: string; dashoffset: number } {
  const arcLen = Math.max(0, (end - start) * CIRC - GAP)
  const offset = CIRC - start * CIRC
  return { dasharray: `${arcLen} ${CIRC - arcLen}`, dashoffset: offset }
}

export default function QuotaTracker({ quota, completed, inProgress, remaining }: QuotaTrackerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })
  const [progress, setProgress] = useState(0)

  const total = Math.max(quota, 1)
  const completedFrac = completed / total
  const inProgressFrac = inProgress / total
  const usedFrac = completedFrac + inProgressFrac

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, 1, {
      duration: 1.2,
      ease: 'easeOut',
      onUpdate: setProgress,
    })
    return controls.stop
  }, [inView])

  const p = progress
  const completedEnd = completedFrac * p
  const inProgressEnd = usedFrac * p
  const a1 = arc(0, completedEnd)
  const a2 = arc(completedEnd, inProgressEnd)
  const a3 = arc(inProgressEnd, 1)

  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 16,
        padding: '24px 32px',
        display: 'flex',
        gap: 40,
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      {/* Donut ring */}
      <div ref={ref} style={{ position: 'relative', width: SIZE, height: SIZE, flexShrink: 0 }}>
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} style={{ transform: 'rotate(-90deg)' }}>
          {/* Remaining track */}
          <circle
            cx={SIZE / 2} cy={SIZE / 2} r={R}
            fill="none"
            stroke="#E2E8F0"
            strokeWidth={STROKE}
            strokeDasharray={`${CIRC}`}
            strokeLinecap="round"
          />
          {/* In Progress arc */}
          {inProgress > 0 && (
            <circle
              cx={SIZE / 2} cy={SIZE / 2} r={R}
              fill="none"
              stroke="#3B82F6"
              strokeWidth={STROKE}
              strokeDasharray={a2.dasharray}
              strokeDashoffset={-a2.dashoffset}
              strokeLinecap="round"
            />
          )}
          {/* Completed arc */}
          {completed > 0 && (
            <circle
              cx={SIZE / 2} cy={SIZE / 2} r={R}
              fill="none"
              stroke="#10B981"
              strokeWidth={STROKE}
              strokeDasharray={a1.dasharray}
              strokeDashoffset={-a1.dashoffset}
              strokeLinecap="round"
            />
          )}
        </svg>
        {/* Center text */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>
            {completed}/{quota}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, textAlign: 'center' }}>
            videos this<br />month
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'flex', gap: 16, flex: 1, flexWrap: 'wrap', minWidth: 0 }}>
        <StatCard label="Completed"   value={completed}  color="#10B981" icon={Check}  delay={0}    />
        <StatCard label="In Progress" value={inProgress} color="#4FB3F6" icon={Clock}  delay={0.15} />
        <StatCard label="Remaining"   value={remaining}  color="#6B7280" icon={Circle} delay={0.30} />
      </div>
    </div>
  )
}
