import { ghlPost } from './client'
import type { Video, Platform, PipelineStage, StageStatus, RecordingStatus } from '@/lib/types'

function normalizePlatform(raw: string): Platform | null {
  const map: Record<string, Platform> = {
    instagram: 'Instagram',
    tiktok: 'TikTok',
    youtube_shorts: 'YouTube Shorts',
    google_my_business: 'Google My Business',
  }
  return map[raw.toLowerCase().replace(/\s+/g, '_')] ?? null
}

function normalizePlatforms(value: unknown): Platform[] {
  if (!value) return []
  const arr = Array.isArray(value) ? value : String(value).split(',').map(s => s.trim())
  return arr.map(v => normalizePlatform(String(v))).filter((p): p is Platform => p !== null)
}

function normalizePipelineStage(raw: string): PipelineStage {
  const map: Record<string, PipelineStage> = {
    ideation: 'Ideation',
    scripting: 'Scripting',
    video_production: 'Video Production',
    captions: 'Captions',
    scheduling: 'Scheduling',
    posted: 'Posted',
  }
  return map[raw.toLowerCase().replace(/\s+/g, '_')] ?? 'Ideation'
}

function normalizeStageStatus(raw: string): StageStatus {
  const map: Record<string, StageStatus> = {
    not_started: 'Not Started',
    in_progress: 'In Progress',
    complete: 'Complete',
  }
  return map[raw.toLowerCase().replace(/\s+/g, '_')] ?? 'Not Started'
}

function normalizeRecordingStatus(raw: string): RecordingStatus {
  const map: Record<string, RecordingStatus> = {
    not_started: 'Not Started',
    awaiting_recording: 'Awaiting Recording',
    in_editing: 'In Editing',
    ready: 'Ready',
  }
  return map[raw.toLowerCase().replace(/\s+/g, '_')] ?? 'Not Started'
}

function normalizeMonth(raw: string): string {
  if (!raw) return ''
  return raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase()
}

function mapVideoRecord(record: { id: string; properties: Record<string, unknown> }): Video {
  const p = record.properties
  return {
    id:             record.id,
    title:          String(p['title'] || ''),
    contentAngle:   p['content_angle'] ? String(p['content_angle']) : undefined,
    videoType:      String(p['video_type'] || '').toLowerCase() === 'authentic' ? 'Authentic' : 'Educational',
    platforms:      normalizePlatforms(p['platforms']),
    pipelineStage:  normalizePipelineStage(String(p['pipeline_stage'] || '')),
    stageStatus:    normalizeStageStatus(String(p['stage_status'] || '')),
    recordingStatus: p['recording_status']
                    ? normalizeRecordingStatus(String(p['recording_status']))
                    : undefined,
    videoFileLink:  p['video_file_link'] ? String(p['video_file_link']) : undefined,
    contentMonth:   normalizeMonth(String(p['content_month'] || '')),
    contentYear:    Number(p['content_year'] || new Date().getFullYear()),
    sortOrder:      Number(p['sort_order'] || 0),
    contactId:      String(p['contact_id'] || ''),
    dateAdded:      p['video_date_added'] ? String(p['video_date_added']) : undefined,
  }
}

export async function getVideosByContactId(contactId: string): Promise<Video[]> {
  try {
    const data = await ghlPost('/objects/custom_objects.video/records/search', {
      locationId: process.env.GHL_LOCATION_ID,
      page: 1,
      pageLimit: 200,
    })
    const all: Video[] = (data?.records || []).map(mapVideoRecord)
    return all
      .filter(v => v.contactId === contactId)
      .sort((a, b) => a.sortOrder - b.sortOrder)
  } catch (err) {
    console.error('[GHL] getVideosByContactId error:', err)
    return []
  }
}
