import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  subtitle?: string
}

export default function EmptyState({ icon: Icon, title, subtitle }: EmptyStateProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        textAlign: 'center',
        gap: 12,
      }}
    >
      <Icon size={48} color="var(--text-muted)" strokeWidth={1.5} />
      <p style={{ fontSize: 16, color: 'var(--text-primary)', fontWeight: 500, margin: 0 }}>{title}</p>
      {subtitle && (
        <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0, maxWidth: 320 }}>{subtitle}</p>
      )}
    </div>
  )
}
