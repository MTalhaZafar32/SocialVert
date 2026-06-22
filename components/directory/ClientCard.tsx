'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import type { GHLClient } from '@/lib/types'
import PlatformPill from '@/components/ui/PlatformPill'

function getInitials(firstName: string, lastName: string, companyName: string): string {
  if (firstName && lastName) return `${firstName[0]}${lastName[0]}`.toUpperCase()
  if (companyName) return companyName.slice(0, 2).toUpperCase()
  return '??'
}

const AVATAR_COLORS: readonly (readonly [string, string])[] = [
  ['#DBEAFE', '#2563EB'],
  ['#EDE9FE', '#7C3AED'],
  ['#D1FAE5', '#059669'],
  ['#FEF3C7', '#D97706'],
  ['#FCE7F3', '#DB2777'],
  ['#CFFAFE', '#0891B2'],
]

function getAvatarColor(name: string): readonly [string, string] {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) | 0
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

export default function ClientCard({ client }: { client: GHLClient }) {
  const initials = getInitials(client.firstName, client.lastName, client.companyName)
  const [avatarBg, avatarText] = getAvatarColor(client.companyName)
  const token = client.customFields.clientToken
  const niche = client.customFields.industryNiche
  const platforms = client.customFields.activePlatforms

  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.15 }}>
      <Link
        href={`/client/${token}`}
        style={{ textDecoration: 'none', display: 'block' }}
      >
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 16,
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            transition: 'border-color 150ms ease, box-shadow 150ms ease',
            cursor: 'pointer',
          }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLElement
            el.style.borderColor = 'var(--blue-400)'
            el.style.boxShadow = 'var(--shadow-card-hover)'
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLElement
            el.style.borderColor = 'var(--border-subtle)'
            el.style.boxShadow = 'none'
          }}
        >
          {/* Avatar + name row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: avatarBg,
                color: avatarText,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {initials}
            </div>
            <div style={{ minWidth: 0 }}>
              <p
                style={{
                  margin: 0,
                  fontSize: 15,
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {client.companyName || `${client.firstName} ${client.lastName}`}
              </p>
              <p
                style={{
                  margin: '2px 0 0',
                  fontSize: 12,
                  color: 'var(--text-muted)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {client.firstName} {client.lastName}
              </p>
            </div>
          </div>

          {/* Niche pill */}
          {niche && (
            <span
              style={{
                display: 'inline-flex',
                alignSelf: 'flex-start',
                background: 'var(--bg-elevated)',
                color: 'var(--text-secondary)',
                borderRadius: 6,
                fontSize: 11,
                fontWeight: 500,
                padding: '3px 10px',
                letterSpacing: '0.02em',
              }}
            >
              {niche}
            </span>
          )}

          {/* Platform pills */}
          {platforms.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {platforms.map(p => <PlatformPill key={p} platform={p} />)}
            </div>
          )}

          {/* Quota chip */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: 12,
              borderTop: '1px solid var(--border-subtle)',
            }}
          >
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Monthly quota</span>
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--blue-500)',
                background: 'var(--blue-50)',
                padding: '2px 10px',
                borderRadius: 999,
              }}
            >
              {client.customFields.monthlyQuota} videos
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
