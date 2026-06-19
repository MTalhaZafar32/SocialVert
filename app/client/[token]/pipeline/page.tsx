import { notFound } from 'next/navigation'
import { searchContactByToken } from '@/lib/ghl/contacts'
import { getVideosByContactId } from '@/lib/ghl/videos'
import PipelineBoard from '@/components/pipeline/PipelineBoard'
import PageMotion from '@/components/layout/PageMotion'

export default async function PipelinePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const client = await searchContactByToken(token)
  if (!client) notFound()

  const videos = await getVideosByContactId(client.id)

  return (
    <PageMotion>
      <div style={{ padding: '32px 24px', maxWidth: 1440, margin: '0 auto' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', margin: 0, marginBottom: 6 }}>
            Content Pipeline
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>
            Track every video from ideation to posted
          </p>
        </div>
        <PipelineBoard videos={videos} />
      </div>
    </PageMotion>
  )
}
