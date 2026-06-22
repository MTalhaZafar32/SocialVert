import { Users } from 'lucide-react'
import { getAllActiveClients } from '@/lib/ghl/contacts'
import ClientGrid from '@/components/directory/ClientGrid'

export const revalidate = 60

export default async function DirectoryPage() {
  const clients = await getAllActiveClients()

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-base)',
        padding: '48px 24px 80px',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 48, textAlign: 'center' }}>
          <div
            style={{
              fontSize: 32,
              fontWeight: 800,
              background: 'linear-gradient(90deg, #2563EB, #7C3AED)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: 8,
            }}
          >
            SocialVert
          </div>
          <p
            style={{
              fontSize: 15,
              color: 'var(--text-secondary)',
              margin: 0,
            }}
          >
            Client Content Dashboards
          </p>
        </div>

        {/* Section heading */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 24,
          }}
        >
          <Users size={18} color="var(--text-muted)" />
          <h1
            style={{
              margin: 0,
              fontSize: 14,
              fontWeight: 600,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            Active Clients ({clients.length})
          </h1>
        </div>

        {/* Grid or empty state */}
        {clients.length > 0 ? (
          <ClientGrid clients={clients} />
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '80px 24px',
              textAlign: 'center',
              gap: 12,
            }}
          >
            <Users size={48} color="var(--text-muted)" strokeWidth={1.5} />
            <p style={{ fontSize: 16, fontWeight: 500, color: 'var(--text-primary)', margin: 0 }}>
              No active clients yet
            </p>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0, maxWidth: 320 }}>
              Clients with Dashboard Status set to &ldquo;Active&rdquo; in GHL will appear here automatically.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
