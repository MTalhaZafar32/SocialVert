import { notFound } from 'next/navigation'
import { searchContactByToken } from '@/lib/ghl/contacts'
import { getVideosByContactId } from '@/lib/ghl/videos'
import { getCaptionsByVideoIds } from '@/lib/ghl/captions'
import type { Caption } from '@/lib/types'
import CaptionsView from '@/components/captions/CaptionPanel'
import PageMotion from '@/components/layout/PageMotion'

export default async function CaptionsPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const client = await searchContactByToken(token)
  if (!client) notFound()

  const videos = await getVideosByContactId(client.id)
  const videoIds = videos.map(v => v.id)
  const captions = await getCaptionsByVideoIds(videoIds)

  const captionMap: Record<string, Caption[]> = {}
  for (const caption of captions) {
    if (!captionMap[caption.videoId]) captionMap[caption.videoId] = []
    captionMap[caption.videoId].push(caption)
  }

  return (
    <PageMotion>
      <div style={{ padding: '32px 24px 0', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', margin: 0, marginBottom: 6 }}>
            Captions
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>
            Platform-specific copy for your videos
          </p>
        </div>
        <CaptionsView videos={videos} captionMap={captionMap} />
      </div>
    </PageMotion>
  )
}
