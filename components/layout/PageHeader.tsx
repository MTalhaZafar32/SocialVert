interface PageHeaderProps {
  title: string
  subtitle?: string
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', margin: 0, marginBottom: 6 }}>
        {title}
      </h1>
      {subtitle && (
        <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0 }}>{subtitle}</p>
      )}
    </div>
  )
}
