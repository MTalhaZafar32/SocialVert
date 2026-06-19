export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-base)',
        padding: '24px',
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: 480 }}>
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            background: 'linear-gradient(135deg, #4FB3F6, #7C5CE8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: 8,
            letterSpacing: -2,
          }}
        >
          SocialVert
        </div>
        <div
          style={{
            fontSize: 32,
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: 16,
          }}
        >
          404 — Dashboard Not Found
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: 16, lineHeight: 1.6, marginBottom: 8 }}>
          This dashboard link is invalid or has expired.
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
          Please contact your SocialVert account manager.
        </p>
      </div>
    </div>
  )
}
