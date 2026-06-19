import { notFound } from 'next/navigation'
import { searchContactByToken } from '@/lib/ghl/contacts'
import { getVideosByContactId } from '@/lib/ghl/videos'
import { getScriptsByVideoIds } from '@/lib/ghl/scripts'
import type { Script } from '@/lib/types'
import ScriptsView from '@/components/scripts/ScriptCard'
import PageMotion from '@/components/layout/PageMotion'

export default async function ScriptsPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const client = await searchContactByToken(token)
  if (!client) notFound()

  const videos = await getVideosByContactId(client.id)
  const videoIds = videos.map(v => v.id)
  const scripts = await getScriptsByVideoIds(videoIds)

  const scriptMap: Record<string, Script> = {}
  for (const script of scripts) {
    scriptMap[script.videoId] = script
  }

  return (
    <PageMotion>
      <div style={{ padding: '32px 24px 0', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', margin: 0, marginBottom: 6 }}>
            Scripts
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>
            Read and review your content scripts
          </p>
        </div>
        <ScriptsView videos={videos} scriptMap={scriptMap} />
      </div>
    </PageMotion>
  )
}
