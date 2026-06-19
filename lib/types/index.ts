export type Platform = 'Instagram' | 'TikTok' | 'YouTube Shorts' | 'Google My Business'
export type PipelineStage = 'Ideation' | 'Scripting' | 'Video Production' | 'Captions' | 'Scheduling' | 'Posted'
export type StageStatus = 'Not Started' | 'In Progress' | 'Complete'
export type RecordingStatus = 'Not Started' | 'Awaiting Recording' | 'In Editing' | 'Ready'
export type ScriptStatus = 'Not Started' | 'In Progress' | 'Delivered' | 'Approved' | 'Revision Requested'
export type CaptionStatus = 'Draft' | 'Final' | 'Approved'
export type ScheduleStatus = 'Pending' | 'Scheduled' | 'Posted' | 'Rescheduled' | 'Cancelled'
export type DashboardStatus = 'Active' | 'Paused' | 'Churned'

export interface GHLClient {
  id: string
  firstName: string
  lastName: string
  companyName: string
  email: string
  customFields: {
    clientToken: string
    monthlyQuota: number
    activePlatforms: Platform[]
    dashboardStatus: DashboardStatus
    socialHandle?: string
    industryNiche?: string
  }
}

export interface Video {
  id: string
  title: string
  contentAngle?: string
  videoType: 'Educational' | 'Authentic'
  platforms: Platform[]
  pipelineStage: PipelineStage
  stageStatus: StageStatus
  recordingStatus?: RecordingStatus
  videoFileLink?: string
  contentMonth: string
  contentYear: number
  sortOrder: number
  contactId: string
  dateAdded?: string
}

export interface Script {
  id: string
  scriptTitle: string
  contentBody: string
  status: ScriptStatus
  deliveryDate?: string
  eta?: string
  version?: number
  wordCount?: number
  clientFeedback?: string
  videoId: string
}

export interface Caption {
  id: string
  platformVariant: Platform
  hook: string
  bodyCopy: string
  cta: string
  hashtags?: string
  status: CaptionStatus
  characterCount?: number
  version?: number
  videoId: string
}

export interface Schedule {
  id: string
  postingDate: string
  platform: Platform
  postingTime?: string
  dayOfWeek?: string
  status: ScheduleStatus
  postUrl?: string
  schedulerTool?: string
  notes?: string
  videoId: string
}
