'use client'

import { motion } from 'framer-motion'
import type { GHLClient } from '@/lib/types'
import ClientCard from './ClientCard'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const } },
}

export default function ClientGrid({ clients }: { clients: GHLClient[] }) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 20,
      }}
    >
      {clients.map(client => (
        <motion.div key={client.id} variants={item}>
          <ClientCard client={client} />
        </motion.div>
      ))}
    </motion.div>
  )
}
