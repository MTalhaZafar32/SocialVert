import { searchContactByToken } from '@/lib/ghl/contacts'
import { notFound } from 'next/navigation'
import NavBar from '@/components/layout/NavBar'
import { ClientProvider } from '@/contexts/ClientContext'

export default async function ClientLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const client = await searchContactByToken(token)

  if (!client) notFound()

  if (client.customFields.dashboardStatus !== 'Active') {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-base)',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: 480, padding: '0 24px' }}>
          <div style={{ fontSize: 48, marginBottom: 24 }}>⏸</div>
          <h1 style={{ color: 'var(--text-primary)', fontSize: 24, fontWeight: 700, marginBottom: 12 }}>
            Dashboard Unavailable
          </h1>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Your content dashboard is temporarily unavailable.
            Please contact your SocialVert account manager.
          </p>
        </div>
      </div>
    )
  }

  return (
    <ClientProvider client={client}>
      <NavBar />
      <main style={{ paddingTop: 64, minHeight: '100vh', background: 'var(--bg-base)' }}>
        {children}
      </main>
    </ClientProvider>
  )
}
