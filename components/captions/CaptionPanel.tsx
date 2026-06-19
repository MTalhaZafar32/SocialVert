'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Music, PlayCircle, MapPin, MessageSquare } from 'lucide-react'
import type { Video, Caption, Platform } from '@/lib/types'
import Badge from '@/components/ui/Badge'
import { getCaptionStatusColors } from '@/lib/utils/pipeline'

const platformIcon: Record<Platform, React.ElementType> = {
  'Instagram':          Camera,
  'TikTok':             Music,
  'YouTube Shorts':     PlayCircle,
  'Google My Business': MapPin,
}

interface CaptionsViewProps {
  videos: Video[]
  captionMap: Record<string, Caption[]>
}

export default function CaptionsView({ videos, captionMap }: CaptionsViewProps) {
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(
    videos.length > 0 ? videos[0].id : null
  )
  const [activePlatform, setActivePlatform] = useState<Platform | null>(null)

  const selectedVideo = videos.find(v => v.id === selectedVideoId)
  const captions = selectedVideoId ? (captionMap[selectedVideoId] ?? []) : []

  const resolvedPlatform = activePlatform && captions.some(c => c.platformVariant === activePlatform)
    ? activePlatform
    : captions.length > 0 ? captions[0].platformVariant : null

  const selectedCaption = captions.find(c => c.platformVariant === resolvedPlatform)

  const captionSummary = (videoId: string) => {
    const caps = captionMap[videoId] ?? []
    const approved = caps.filter(c => c.status === 'Approved').length
    return caps.length > 0 ? `${approved}/${caps.length} approved` : 'No captions yet'
  }

  const hashtags = useMemo(() => {
    if (!selectedCaption?.hashtags) return []
    return selectedCaption.hashtags.split(/[\s\n]+/).filter(h => h.trim())
  }, [selectedCaption])

  return (
    <div style={{ display: 'flex', gap: 0, height: 'calc(100vh - 140px)', minHeight: 400 }}>
      {/* LEFT PANEL */}
      <div
        style={{
          width: 320,
          flexShrink: 0,
          borderRight: '1px solid var(--border-subtle)',
          overflowY: 'auto',
        }}
      >
        {videos.map(video => {
          const caps = captionMap[video.id] ?? []
          const approvedCount = caps.filter(c => c.status === 'Approved').length
          const allApproved = caps.length > 0 && approvedCount === caps.length
          const hasAny = caps.length > 0
          const isActive = video.id === selectedVideoId

          return (
            <button
              key={video.id}
              onClick={() => {
                setSelectedVideoId(video.id)
                setActivePlatform(null)
              }}
              style={{
                width: '100%',
                textAlign: 'left',
                background: isActive ? 'var(--bg-elevated)' : 'transparent',
                border: 'none',
                borderLeft: isActive ? '2px solid var(--blue-400)' : '2px solid transparent',
                padding: '12px 16px',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: 8,
                minHeight: 44,
              }}
              onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'var(--bg-card-hover)' }}
              onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {video.title}
                </p>
                <p style={{ margin: '4px 0 0', fontSize: 11, color: 'var(--text-muted)' }}>
                  {captionSummary(video.id)}
                </p>
              </div>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: allApproved ? '#10B981' : hasAny ? '#4FB3F6' : '#4A5568',
                  flexShrink: 0,
                  marginTop: 4,
                }}
              />
            </button>
          )
        })}
      </div>

      {/* RIGHT PANEL */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <AnimatePresence mode="wait">
          {!selectedVideo ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, gap: 12, flexDirection: 'column' }}>
              <MessageSquare size={48} color="var(--text-muted)" strokeWidth={1.5} />
              <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Select a video to view its captions</p>
            </motion.div>
          ) : (
            <motion.div key={selectedVideo.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
              style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

              {/* Video title + platform tabs */}
              <div style={{ padding: '20px 24px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 16px' }}>
                  {selectedVideo.title}
                </h2>

                {captions.length > 0 ? (
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {captions.map(cap => {
                      const PIcon = platformIcon[cap.platformVariant]
                      const isTab = cap.platformVariant === resolvedPlatform
                      return (
                        <button
                          key={cap.id}
                          onClick={() => setActivePlatform(cap.platformVariant)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            padding: '8px 14px',
                            borderRadius: '8px 8px 0 0',
                            border: 'none',
                            borderBottom: isTab ? '2px solid var(--blue-400)' : '2px solid transparent',
                            background: isTab ? 'var(--bg-elevated)' : 'transparent',
                            color: isTab ? 'var(--blue-400)' : 'var(--text-muted)',
                            cursor: 'pointer',
                            fontSize: 13,
                            fontWeight: 500,
                            minHeight: 44,
                          }}
                        >
                          <PIcon size={14} />
                          {cap.platformVariant}
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  <p style={{ color: 'var(--text-muted)', fontSize: 14, paddingBottom: 16 }}>No captions written yet for this video</p>
                )}
              </div>

              {/* Caption content */}
              {selectedCaption && (
                <div style={{ padding: 24, flex: 1, overflowY: 'auto' }}>
                  {/* HOOK */}
                  <div style={{ marginBottom: 24 }}>
                    <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      Hook
                    </p>
                    <div
                      style={{
                        background: 'rgba(79,179,246,0.05)',
                        borderLeft: '3px solid var(--blue-400)',
                        padding: 16,
                        borderRadius: '0 8px 8px 0',
                      }}
                    >
                      <p style={{ margin: 0, fontSize: 18, fontStyle: 'italic', color: 'var(--blue-400)', lineHeight: 1.6 }}>
                        {selectedCaption.hook}
                      </p>
                    </div>
                  </div>

                  <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)', margin: '0 0 24px' }} />

                  {/* CAPTION */}
                  <div style={{ marginBottom: 24 }}>
                    <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      Caption
                    </p>
                    <p style={{ margin: 0, fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                      {selectedCaption.bodyCopy}
                    </p>
                  </div>

                  <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)', margin: '0 0 24px' }} />

                  {/* CTA */}
                  <div style={{ marginBottom: 24 }}>
                    <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      Call to Action
                    </p>
                    <p style={{ margin: 0, fontSize: 14, color: 'var(--accent-amber)', fontWeight: 600 }}>
                      {selectedCaption.cta}
                    </p>
                  </div>

                  {/* HASHTAGS */}
                  {hashtags.length > 0 && (
                    <>
                      <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)', margin: '0 0 24px' }} />
                      <div style={{ marginBottom: 24 }}>
                        <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                          Hashtags
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                          {hashtags.map((h, i) => (
                            <span
                              key={i}
                              style={{
                                background: 'var(--bg-elevated)',
                                color: 'var(--blue-400)',
                                borderRadius: 999,
                                fontSize: 11,
                                padding: '3px 8px',
                                fontWeight: 500,
                              }}
                            >
                              {h}
                            </span>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Footer */}
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                    <Badge
                      label={selectedCaption.status}
                      bg={getCaptionStatusColors(selectedCaption.status).bg}
                      text={getCaptionStatusColors(selectedCaption.status).text}
                    />
                    {selectedCaption.characterCount && (
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{selectedCaption.characterCount} chars</span>
                    )}
                    {selectedCaption.version && (
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>v{selectedCaption.version}</span>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
