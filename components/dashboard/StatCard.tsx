'use client'

import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: number
  color: string
  icon: LucideIcon
  delay?: number
}

export default function StatCard({ label, value, color, icon: Icon, delay = 0 }: StatCardProps) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, v => Math.round(v))
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (hasAnimated.current) return
    hasAnimated.current = true
    const controls = animate(count, value, {
      duration: 0.8,
      delay,
      ease: 'easeOut',
    })
    return controls.stop
  }, [count, value, delay])

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 12,
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        flex: 1,
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: `${color}18`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon size={20} color={color} />
      </div>
      <motion.div
        style={{
          fontSize: 32,
          fontWeight: 700,
          color,
          lineHeight: 1,
        }}
      >
        {rounded}
      </motion.div>
      <div
        style={{
          fontSize: 12,
          fontWeight: 500,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}
      >
        {label}
      </div>
    </motion.div>
  )
}
