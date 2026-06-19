'use client'

import { motion } from 'framer-motion'

interface ProgressBarProps {
  value: number  // 0-1
  color: string
  height?: number
}

export default function ProgressBar({ value, color, height = 4 }: ProgressBarProps) {
  return (
    <div
      style={{
        width: '100%',
        height,
        background: 'var(--bg-elevated)',
        borderRadius: height,
        overflow: 'hidden',
      }}
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, value * 100)}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{
          height: '100%',
          background: color,
          borderRadius: height,
        }}
      />
    </div>
  )
}
