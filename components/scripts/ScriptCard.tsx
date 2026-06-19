'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, AlertTriangle } from 'lucide-react'
import type { Video, Script, ScriptStatus } from '@/lib/types'
import Badge from '@/components/ui/Badge'
import { getScriptStatusColors } from '@/lib/utils/pipeline'
import { formatShortDate } from '@/lib/utils/date'

interface ScriptsViewProps {
  videos: Video[]
  scriptMap: Record<string, Script>
}

const STATUS_OPTIONS: Array<ScriptStatus | 'All'> = [
  'All', 'Not Started', 'In Progress', 'Delivered', 'Approved', 'Revision Requested',
]

export default function ScriptsView({ videos, scriptMap }: ScriptsViewProps) {
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(
    videos.length > 0 ? videos[0].id : null
  )
  const [statusFilter, setStatusFilter] = useState<ScriptStatus | 'All'>('All')

  const filteredVideos = useMemo(() => {
    if (statusFilter === 'All') return videos
    return videos.filter(v => {
      const script = scriptMap[v.id]
      return script ? script.status === statusFilter : statusFilter === 'Not Started'
    })
  }, [videos, scriptMap, statusFilter])

  const selectedVideo = videos.find(v => v.id === selectedVideoId)
  const selectedScript = selectedVideoId ? scriptMap[selectedVideoId] : undefined

  const selectStyle = {
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border-subtle)',
    color: 'var(--text-secondary)',
    borderRadius: 8,
    padding: '6px 12px',
    fontSize: 13,
    cursor: 'pointer',
    outline: 'none',
    width: '100%',
    marginBottom: 12,
  }

  return (
    <div style={{ display: 'flex', gap: 0, height: 'calc(100vh - 140px)', minHeight: 400 }}>
      {/* LEFT PANEL */}
      <div
        style={{
          width: 320,
          flexShrink: 0,
          borderRight: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
        className="scripts-left-panel"
      >
        <div style={{ padding: '16px 16px 12px' }}>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as ScriptStatus | 'All')}
            style={selectStyle}
          >
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s}</option>)}
          </select>
        </div>

        <div style={{ overflowY: 'auto', flex: 1 }}>
          {filteredVideos.map(video => {
            const script = scriptMap[video.id]
            const status: ScriptStatus = script?.status ?? 'Not Started'
            const colors = getScriptStatusColors(status)
            const isActive = video.id === selectedVideoId
            const dateStr = script?.deliveryDate
              ? `Delivered ${formatShortDate(script.deliveryDate)}`
              : script?.eta
              ? `ETA ${formatShortDate(script.eta)}`
              : ''

            return (
              <button
                key={video.id}
                onClick={() => setSelectedVideoId(video.id)}
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
                  transition: 'background 150ms ease',
                  minHeight: 44,
                }}
                onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'var(--bg-card-hover)' }}
                onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 13,
                      fontWeight: 500,
                      color: 'var(--text-primary)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {video.title}
                  </p>
                  {dateStr && (
                    <p style={{ margin: '4px 0 0', fontSize: 11, color: 'var(--text-muted)' }}>{dateStr}</p>
                  )}
                </div>
                <Badge label={status} bg={colors.bg} text={colors.text} size="sm" />
              </button>
            )
          })}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>
        <AnimatePresence mode="wait">
          {!selectedVideo ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12 }}
            >
              <FileText size={48} color="var(--text-muted)" strokeWidth={1.5} />
              <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Select a video to read its script</p>
            </motion.div>
          ) : (
            <motion.div
              key={selectedVideo.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ maxWidth: 680 }}
            >
              {/* Header */}
              <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 12px' }}>
                {selectedVideo.title}
              </h2>

              {selectedScript ? (
                <>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 20 }}>
                    <Badge
                      label={selectedScript.status}
                      bg={getScriptStatusColors(selectedScript.status).bg}
                      text={getScriptStatusColors(selectedScript.status).text}
                    />
                    {selectedScript.deliveryDate && (
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        Delivered {formatShortDate(selectedScript.deliveryDate)}
                      </span>
                    )}
                    {!selectedScript.deliveryDate && selectedScript.eta && (
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        ETA {formatShortDate(selectedScript.eta)}
                      </span>
                    )}
                  </div>

                  {/* Revision feedback */}
                  {selectedScript.status === 'Revision Requested' && selectedScript.clientFeedback && (
                    <div
                      style={{
                        background: 'rgba(245,158,11,0.08)',
                        border: '1px solid rgba(245,158,11,0.3)',
                        borderRadius: 8,
                        padding: 16,
                        marginBottom: 20,
                        display: 'flex',
                        gap: 10,
                      }}
                    >
                      <AlertTriangle size={16} color="#F59E0B" style={{ flexShrink: 0, marginTop: 2 }} />
                      <div>
                        <p style={{ margin: '0 0 6px', fontSize: 12, fontWeight: 600, color: '#F59E0B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          Revision Feedback
                        </p>
                        <p style={{ margin: 0, fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                          {selectedScript.clientFeedback}
                        </p>
                      </div>
                    </div>
                  )}

                  <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)', margin: '0 0 24px' }} />

                  {/* Script body */}
                  <div
                    style={{
                      fontSize: 16,
                      lineHeight: 1.8,
                      color: 'var(--text-primary)',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {selectedScript.contentBody}
                  </div>

                  {/* Footer */}
                  <div style={{ marginTop: 24, display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-muted)' }}>
                    {selectedScript.wordCount && <span>{selectedScript.wordCount} words</span>}
                    {selectedScript.version && <span>Version {selectedScript.version}</span>}
                  </div>
                </>
              ) : (
                <div
                  style={{
                    background: 'var(--bg-elevated)',
                    borderRadius: 10,
                    padding: '24px',
                    textAlign: 'center',
                  }}
                >
                  <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>
                    Script in progress
                    {/* eta would go here if available */}
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
