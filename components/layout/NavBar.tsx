'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Columns2,
  FileText,
  Video,
  MessageSquare,
  Calendar,
  Menu,
  X,
} from 'lucide-react'
import { useClient } from '@/contexts/ClientContext'

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '' },
  { label: 'Pipeline',  icon: Columns2,        href: '/pipeline' },
  { label: 'Scripts',   icon: FileText,         href: '/scripts' },
  { label: 'Videos',    icon: Video,            href: '/videos' },
  { label: 'Captions',  icon: MessageSquare,    href: '/captions' },
  { label: 'Schedule',  icon: Calendar,         href: '/schedule' },
]

export default function NavBar() {
  const { companyName } = useClient()
  const pathname = usePathname()
  const params = useParams()
  const token = params.token as string
  const [drawerOpen, setDrawerOpen] = useState(false)

  const base = `/client/${token}`

  const isActive = (href: string) => {
    const full = base + href
    if (href === '') return pathname === base
    return pathname.startsWith(full)
  }

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 64,
          zIndex: 50,
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--glass-border)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
          gap: 16,
        }}
      >
        {/* Wordmark */}
        <div
          style={{
            fontSize: 18,
            fontWeight: 700,
            background: 'linear-gradient(90deg, #4FB3F6, #7C5CE8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            flexShrink: 0,
          }}
        >
          SocialVert
        </div>

        {/* Company name — center */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <span
            style={{
              color: 'var(--text-secondary)',
              fontSize: 13,
              maxWidth: 200,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {companyName}
          </span>
        </div>

        {/* Desktop nav */}
        <nav style={{ gap: 4, alignItems: 'center' }} className="hidden md:flex">
          {navItems.map(({ label, icon: Icon, href }) => {
            const active = isActive(href)
            return (
              <Link
                key={label}
                href={base + href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 12px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 500,
                  color: active ? 'var(--blue-400)' : 'var(--text-muted)',
                  textDecoration: 'none',
                  borderBottom: active ? '2px solid var(--blue-400)' : '2px solid transparent',
                  transition: 'color 150ms ease',
                }}
              >
                <Icon size={15} />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setDrawerOpen(true)}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: 44,
            height: 44,
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            flexShrink: 0,
          }}
          className="flex md:hidden"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setDrawerOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.5)',
                zIndex: 60,
              }}
            />

            {/* Drawer */}
            <motion.div
              key="drawer"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                bottom: 0,
                width: 280,
                background: 'var(--bg-elevated)',
                zIndex: 70,
                padding: '24px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <span
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    background: 'linear-gradient(90deg, #4FB3F6, #7C5CE8)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  SocialVert
                </span>
                <button
                  onClick={() => setDrawerOpen(false)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: 8,
                  }}
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </div>

              {navItems.map(({ label, icon: Icon, href }) => {
                const active = isActive(href)
                return (
                  <Link
                    key={label}
                    href={base + href}
                    onClick={() => setDrawerOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '12px 16px',
                      borderRadius: 10,
                      fontSize: 15,
                      fontWeight: 500,
                      color: active ? 'var(--blue-400)' : 'var(--text-secondary)',
                      textDecoration: 'none',
                      background: active ? 'var(--blue-glow)' : 'transparent',
                      minHeight: 44,
                    }}
                  >
                    <Icon size={18} />
                    {label}
                  </Link>
                )
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
