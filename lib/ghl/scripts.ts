import { ghlPost } from './client'
import type { Script, ScriptStatus } from '@/lib/types'

function normalizeScriptStatus(raw: string): ScriptStatus {
  const map: Record<string, ScriptStatus> = {
    not_started: 'Not Started',
    in_progress: 'In Progress',
    delivered: 'Delivered',
    approved: 'Approved',
    revision_requested: 'Revision Requested',
  }
  return map[raw.toLowerCase().replace(/\s+/g, '_')] ?? 'Not Started'
}

function mapScriptRecord(record: { id: string; properties: Record<string, unknown> }): Script {
  const p = record.properties
  return {
    id:             record.id,
    scriptTitle:    String(p['script_title'] || ''),
    contentBody:    String(p['content_body'] || ''),
    status:         normalizeScriptStatus(String(p['status'] || '')),
    deliveryDate:   p['delivery_date'] ? String(p['delivery_date']) : undefined,
    eta:            p['eta']           ? String(p['eta'])           : undefined,
    version:        p['version']       ? Number(p['version'])       : undefined,
    wordCount:      p['word_count']    ? Number(p['word_count'])    : undefined,
    clientFeedback: p['client_feedback'] ? String(p['client_feedback']) : undefined,
    videoId:        String(p['video_id'] || ''),
  }
}

export async function getScriptsByVideoIds(videoIds: string[]): Promise<Script[]> {
  if (!videoIds.length) return []
  try {
    const data = await ghlPost('/objects/custom_objects.script/records/search', {
      locationId: process.env.GHL_LOCATION_ID,
      page: 1,
      pageLimit: 200,
    })
    const all: Script[] = (data?.records || []).map(mapScriptRecord)
    const idSet = new Set(videoIds)
    return all.filter(s => idSet.has(s.videoId))
  } catch (err) {
    console.error('[GHL] getScriptsByVideoIds error:', err)
    return []
  }
}
