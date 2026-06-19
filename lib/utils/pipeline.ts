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
    'Not Started': { bg: '#1F2937',                    text: '#6B7280' },
    'In Progress': { bg: 'rgba(30,150,245,0.12)',      text: '#4FB3F6' },
    'Complete':    { bg: 'rgba(16,185,129,0.12)',      text: '#10B981' },
  }
  return map[status] ?? { bg: '#1F2937', text: '#6B7280' }
}

export function getScriptStatusColors(status: ScriptStatus): { bg: string; text: string } {
  const map: Record<ScriptStatus, { bg: string; text: string }> = {
    'Not Started':        { bg: '#1F2937',                    text: '#6B7280' },
    'In Progress':        { bg: 'rgba(30,150,245,0.12)',      text: '#4FB3F6' },
    'Delivered':          { bg: 'rgba(124,92,232,0.12)',      text: '#7C5CE8' },
    'Approved':           { bg: 'rgba(0,212,170,0.12)',       text: '#00D4AA' },
    'Revision Requested': { bg: 'rgba(245,101,101,0.12)',     text: '#FC8181' },
  }
  return map[status] ?? { bg: '#1F2937', text: '#6B7280' }
}

export function getCaptionStatusColors(status: CaptionStatus): { bg: string; text: string } {
  const map: Record<CaptionStatus, { bg: string; text: string }> = {
    'Draft':    { bg: '#1F2937',                text: '#6B7280' },
    'Final':    { bg: 'rgba(30,150,245,0.12)', text: '#4FB3F6' },
    'Approved': { bg: 'rgba(16,185,129,0.12)', text: '#10B981' },
  }
  return map[status] ?? { bg: '#1F2937', text: '#6B7280' }
}

export function getScheduleStatusColors(status: ScheduleStatus): { bg: string; text: string } {
  const map: Record<ScheduleStatus, { bg: string; text: string }> = {
    'Pending':     { bg: '#1F2937',                text: '#6B7280' },
    'Scheduled':   { bg: 'rgba(30,150,245,0.12)', text: '#4FB3F6' },
    'Posted':      { bg: 'rgba(16,185,129,0.12)', text: '#10B981' },
    'Rescheduled': { bg: 'rgba(245,158,11,0.12)', text: '#F59E0B' },
    'Cancelled':   { bg: 'rgba(245,101,101,0.12)',text: '#FC8181' },
  }
  return map[status] ?? { bg: '#1F2937', text: '#6B7280' }
}
