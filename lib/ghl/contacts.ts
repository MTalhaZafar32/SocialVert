import { ghlPost } from './client'
import type { GHLClient, Platform } from '@/lib/types'

const FIELD_IDS = {
  clientToken:     'zxQtAKp5RjAAN3cVUVH1',
  monthlyQuota:    'H4pyTMVrPhYNhEcdYyPZ',
  activePlatforms: '5NXljRuVztyrmV4FkDxk',
  dashboardStatus: 'ih2x1IpAvhcILdey4kbo',
  socialHandle:    'awuWvL5G5KXQrmj93k3L',
  industryNiche:   'U6rI5kEuogg8yLHKGF2c',
  internalNotes:   '0xIiXRWxjkgZV0FJlFt5',
} as const

export async function searchContactByToken(token: string): Promise<GHLClient | null> {
  try {
    const data = await ghlPost('/contacts/search', {
      locationId: process.env.GHL_LOCATION_ID,
      filters: [
        {
          field: `customFields.${FIELD_IDS.clientToken}`,
          operator: 'eq',
          value: token,
        }
      ],
      pageLimit: 1,
    })

    const contact = data?.contacts?.[0]
    if (!contact) return null

    const cf: Array<{ id: string; value: unknown }> = contact.customFields || []
    const getField = (id: string) => cf.find(f => f.id === id)?.value

    const rawPlatforms = getField(FIELD_IDS.activePlatforms)
    const platforms: Platform[] = Array.isArray(rawPlatforms)
      ? rawPlatforms as Platform[]
      : typeof rawPlatforms === 'string'
        ? rawPlatforms.split(',').map(s => s.trim()) as Platform[]
        : []

    return {
      id:          contact.id,
      firstName:   contact.firstName  || '',
      lastName:    contact.lastName   || '',
      companyName: contact.companyName || contact.name || '',
      email:       contact.email      || '',
      customFields: {
        clientToken:     String(getField(FIELD_IDS.clientToken)  || ''),
        monthlyQuota:    Number(getField(FIELD_IDS.monthlyQuota) || 0),
        activePlatforms: platforms,
        dashboardStatus: (getField(FIELD_IDS.dashboardStatus) as 'Active' | 'Paused' | 'Churned') || 'Active',
        socialHandle:    getField(FIELD_IDS.socialHandle)  ? String(getField(FIELD_IDS.socialHandle))  : undefined,
        industryNiche:   getField(FIELD_IDS.industryNiche) ? String(getField(FIELD_IDS.industryNiche)) : undefined,
      },
    }
  } catch (err) {
    console.error('[GHL] searchContactByToken error:', err)
    return null
  }
}
