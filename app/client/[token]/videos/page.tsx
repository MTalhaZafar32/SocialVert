import { notFound } from 'next/navigation'
import { searchContactByToken } from '@/lib/ghl/contacts'
import { getVideosByContactId } from '@/lib/ghl/videos'
import VideoLibraryClient from '@/components/videos/VideoLibraryClient'
import PageMotion from '@/components/layout/PageMotion'

export default async function VideosPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const client = await searchContactByToken(token)
  if (!client) notFound()

  const videos = await getVideosByContactId(client.id)

  return (
    <PageMotion>
      <div style={{ padding: '32px 24px', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', margin: 0, marginBottom: 6 }}>
            Video Library
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>
            All your content in one place
          </p>
        </div>
        <VideoLibraryClient videos={videos} />
      </div>
    </PageMotion>
  )
}
