import type { Platform } from '@/lib/types'

const styles: Record<Platform, { background: string; color: string; border?: string }> = {
  'Instagram':          { background: 'linear-gradient(135deg,#E1306C,#C13584)', color: 'white' },
  'TikTok':             { background: '#010101', color: 'white', border: '1px solid #333' },
  'YouTube Shorts':     { background: '#FF0000', color: 'white' },
  'Google My Business': { background: '#4285F4', color: 'white' },
}

export default function PlatformPill({ platform }: { platform: Platform }) {
  const s = styles[platform]
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        background: s.background,
        color: s.color,
        border: s.border,
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 500,
        padding: '2px 7px',
        whiteSpace: 'nowrap',
      }}
    >
      {platform}
    </span>
  )
}
