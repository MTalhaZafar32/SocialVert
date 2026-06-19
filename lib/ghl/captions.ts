import { ghlPost } from './client'
import type { Caption, Platform, CaptionStatus } from '@/lib/types'

function normalizePlatform(raw: string): Platform {
  const map: Record<string, Platform> = {
    instagram: 'Instagram',
    tiktok: 'TikTok',
    youtube_shorts: 'YouTube Shorts',
    google_my_business: 'Google My Business',
  }
  return map[raw.toLowerCase().replace(/\s+/g, '_')] ?? 'Instagram'
}

function normalizeCaptionStatus(raw: string): CaptionStatus {
  const map: Record<string, CaptionStatus> = {
    draft: 'Draft',
    final: 'Final',
    approved: 'Approved',
  }
  return map[raw.toLowerCase()] ?? 'Draft'
}

function mapCaptionRecord(record: { id: string; properties: Record<string, unknown> }): Caption {
  const p = record.properties
  return {
    id:             record.id,
    platformVariant: normalizePlatform(String(p['platform_variant'] || '')),
    hook:           String(p['hook']       || ''),
    bodyCopy:       String(p['body_copy']  || ''),
    cta:            String(p['cta']        || ''),
    hashtags:       p['hashtags'] ? String(p['hashtags']) : undefined,
    status:         normalizeCaptionStatus(String(p['status'] || '')),
    characterCount: p['character_count'] ? Number(p['character_count']) : undefined,
    version:        p['version']         ? Number(p['version'])         : undefined,
    videoId:        String(p['video_id'] || ''),
  }
}

export async function getCaptionsByVideoIds(videoIds: string[]): Promise<Caption[]> {
  if (!videoIds.length) return []
  try {
    const data = await ghlPost('/objects/custom_objects.caption/records/search', {
      locationId: process.env.GHL_LOCATION_ID,
      page: 1,
      pageLimit: 200,
    })
    const all: Caption[] = (data?.records || []).map(mapCaptionRecord)
    const idSet = new Set(videoIds)
    return all.filter(c => idSet.has(c.videoId))
  } catch (err) {
    console.error('[GHL] getCaptionsByVideoIds error:', err)
    return []
  }
}
