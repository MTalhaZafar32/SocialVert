import { notFound } from 'next/navigation'
import { searchContactByToken } from '@/lib/ghl/contacts'
import { getVideosByContactId } from '@/lib/ghl/videos'
import QuotaTracker from '@/components/dashboard/QuotaTracker'
import PipelineOverview from '@/components/dashboard/PipelineOverview'
import PlatformPill from '@/components/ui/PlatformPill'
import Badge from '@/components/ui/Badge'
import { getStageColor, getStageStatusColors } from '@/lib/utils/pipeline'
import PageMotion from '@/components/layout/PageMotion'

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function getTodayString(): string {
  return new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const client = await searchContactByToken(token)
  if (!client) notFound()

  const videos = await getVideosByContactId(client.id)
  const quota = client.customFields.monthlyQuota

  const completed  = videos.filter(v => v.pipelineStage === 'Posted').length
  const inProgress = videos.filter(v => v.pipelineStage !== 'Posted' && v.pipelineStage !== 'Ideation').length
  const remaining  = Math.max(0, quota - completed - inProgress)

  const recentVideos = [...videos].slice(0, 4)

  return (
    <PageMotion>
    <div style={{ padding: '32px 24px', maxWidth: 1280, margin: '0 auto' }}>
      {/* Greeting */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', margin: 0, marginBottom: 6 }}>
          {getGreeting()}, {client.companyName}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>
          {getTodayString()}
        </p>
      </div>

      {/* Quota Tracker */}
      <div style={{ marginBottom: 32 }}>
        <QuotaTracker quota={quota} completed={completed} inProgress={inProgress} remaining={remaining} />
      </div>

      {/* Pipeline Overview */}
      <div style={{ marginBottom: 32 }}>
        <PipelineOverview videos={videos} />
      </div>

      {/* Recent Videos */}
      {recentVideos.length > 0 && (
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16, marginTop: 0 }}>
            Your Videos This Month
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 16,
            }}
          >
            {recentVideos.map((video, i) => {
              const stageColor = getStageColor(video.pipelineStage)
              const statusColors = getStageStatusColors(video.stageStatus)
              return (
                <div
                  key={video.id}
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 12,
                    padding: 20,
                    transition: 'border-color 150ms ease',
                  }}
                >
                  <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 12, lineHeight: 1.4 }}>
                    {video.title}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
                    {video.platforms.map(p => <PlatformPill key={p} platform={p} />)}
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <Badge
                      label={video.pipelineStage}
                      bg={`${stageColor}20`}
                      text={stageColor}
                    />
                    <Badge
                      label={video.stageStatus}
                      bg={statusColors.bg}
                      text={statusColors.text}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
    </PageMotion>
  )
}
