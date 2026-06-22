import type { PipelineStage, StageStatus, ScriptStatus, CaptionStatus, ScheduleStatus } from '@/lib/types'

export function getStageColor(stage: PipelineStage): string {
  const map: Record<PipelineStage, string> = {
    'Ideation':         '#6B7280',
    'Scripting':        '#3B82F6',
    'Video Production': '#8B5CF6',
    'Captions':         '#F59E0B',
    'Scheduling':       '#EC4899',
    'Posted':           '#10B981',
  }
  return map[stage] ?? '#6B7280'
}

export function getStageStatusColors(status: StageStatus): { bg: string; text: string } {
  const map: Record<StageStatus, { bg: string; text: string }> = {
    'Not Started': { bg: 'var(--status-not-started-bg)', text: 'var(--status-not-started-text)' },
    'In Progress': { bg: 'var(--status-in-progress-bg)', text: 'var(--status-in-progress-text)' },
    'Complete':    { bg: 'var(--status-complete-bg)',    text: 'var(--status-complete-text)'    },
  }
  return map[status] ?? { bg: 'var(--status-not-started-bg)', text: 'var(--status-not-started-text)' }
}

export function getScriptStatusColors(status: ScriptStatus): { bg: string; text: string } {
  const map: Record<ScriptStatus, { bg: string; text: string }> = {
    'Not Started':        { bg: 'var(--status-not-started-bg)', text: 'var(--status-not-started-text)' },
    'In Progress':        { bg: 'var(--status-in-progress-bg)', text: 'var(--status-in-progress-text)' },
    'Delivered':          { bg: 'var(--status-delivered-bg)',   text: 'var(--status-delivered-text)'   },
    'Approved':           { bg: 'var(--status-approved-bg)',    text: 'var(--status-approved-text)'    },
    'Revision Requested': { bg: 'var(--status-revision-bg)',    text: 'var(--status-revision-text)'    },
  }
  return map[status] ?? { bg: 'var(--status-not-started-bg)', text: 'var(--status-not-started-text)' }
}

export function getCaptionStatusColors(status: CaptionStatus): { bg: string; text: string } {
  const map: Record<CaptionStatus, { bg: string; text: string }> = {
    'Draft':    { bg: 'var(--status-draft-bg)',      text: 'var(--status-draft-text)'      },
    'Final':    { bg: 'var(--status-in-progress-bg)', text: 'var(--status-in-progress-text)' },
    'Approved': { bg: 'var(--status-approved-bg)',   text: 'var(--status-approved-text)'   },
  }
  return map[status] ?? { bg: 'var(--status-draft-bg)', text: 'var(--status-draft-text)' }
}

export function getScheduleStatusColors(status: ScheduleStatus): { bg: string; text: string } {
  const map: Record<ScheduleStatus, { bg: string; text: string }> = {
    'Pending':     { bg: 'var(--status-pending-bg)',     text: 'var(--status-pending-text)'     },
    'Scheduled':   { bg: 'var(--status-scheduled-bg)',   text: 'var(--status-scheduled-text)'   },
    'Posted':      { bg: 'var(--status-posted-bg)',      text: 'var(--status-posted-text)'      },
    'Rescheduled': { bg: 'var(--status-rescheduled-bg)', text: 'var(--status-rescheduled-text)' },
    'Cancelled':   { bg: 'var(--status-cancelled-bg)',   text: 'var(--status-cancelled-text)'   },
  }
  return map[status] ?? { bg: 'var(--status-pending-bg)', text: 'var(--status-pending-text)' }
}
