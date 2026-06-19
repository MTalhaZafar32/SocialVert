import { notFound } from 'next/navigation'
import { searchContactByToken } from '@/lib/ghl/contacts'
import { getVideosByContactId } from '@/lib/ghl/videos'
import { getSchedulesByVideoIds } from '@/lib/ghl/schedule'
import type { Video } from '@/lib/types'
import ScheduleView from '@/components/schedule/ScheduleView'
import PageMotion from '@/components/layout/PageMotion'

export default async function SchedulePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const client = await searchContactByToken(token)
  if (!client) notFound()

  const videos = await getVideosByContactId(client.id)
  const videoIds = videos.map(v => v.id)
  const schedules = await getSchedulesByVideoIds(videoIds)

  const videoMap: Record<string, Video> = {}
  for (const video of videos) {
    videoMap[video.id] = video
  }

  return (
    <PageMotion>
      <div style={{ padding: '32px 24px', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', margin: 0, marginBottom: 6 }}>
            Schedule
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>
            Upcoming and past posts across all platforms
          </p>
        </div>
        <ScheduleView schedules={schedules} videoMap={videoMap} />
      </div>
    </PageMotion>
  )
}
