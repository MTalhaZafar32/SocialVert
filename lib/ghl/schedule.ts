import { ghlPost } from './client'
import type { Schedule, Platform, ScheduleStatus } from '@/lib/types'

function normalizePlatform(raw: string): Platform {
  const map: Record<string, Platform> = {
    instagram: 'Instagram',
    tiktok: 'TikTok',
    youtube_shorts: 'YouTube Shorts',
    google_my_business: 'Google My Business',
  }
  return map[raw.toLowerCase().replace(/\s+/g, '_')] ?? 'Instagram'
}

function normalizeScheduleStatus(raw: string): ScheduleStatus {
  const map: Record<string, ScheduleStatus> = {
    pending: 'Pending',
    scheduled: 'Scheduled',
    posted: 'Posted',
    rescheduled: 'Rescheduled',
    cancelled: 'Cancelled',
  }
  return map[raw.toLowerCase()] ?? 'Pending'
}

function mapScheduleRecord(record: { id: string; properties: Record<string, unknown> }): Schedule {
  const p = record.properties
  return {
    id:            record.id,
    postingDate:   String(p['posting_date']  || ''),
    platform:      normalizePlatform(String(p['platform'] || '')),
    postingTime:   p['posting_time']   ? String(p['posting_time'])   : undefined,
    dayOfWeek:     p['day_of_week']    ? String(p['day_of_week'])    : undefined,
    status:        normalizeScheduleStatus(String(p['status'] || '')),
    postUrl:       p['post_url']       ? String(p['post_url'])       : undefined,
    schedulerTool: p['scheduler_tool'] ? String(p['scheduler_tool']) : undefined,
    notes:         p['notes']          ? String(p['notes'])          : undefined,
    videoId:       String(p['video_id'] || ''),
  }
}

export async function getSchedulesByVideoIds(videoIds: string[]): Promise<Schedule[]> {
  if (!videoIds.length) return []
  try {
    const data = await ghlPost('/objects/custom_objects.schedule/records/search', {
      locationId: process.env.GHL_LOCATION_ID,
      page: 1,
      pageLimit: 200,
    })
    const all: Schedule[] = (data?.records || []).map(mapScheduleRecord)
    const idSet = new Set(videoIds)
    const filtered = all.filter(s => idSet.has(s.videoId))
    return filtered.sort((a, b) => {
      const da = new Date(a.postingDate).getTime() || 0
      const db = new Date(b.postingDate).getTime() || 0
      return da - db
    })
  } catch (err) {
    console.error('[GHL] getSchedulesByVideoIds error:', err)
    return []
  }
}
