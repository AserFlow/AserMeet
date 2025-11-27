export interface Meeting {
  id: string
  title: string
  start: string
  end: string
  attendees?: Array<{
    email: string
    displayName?: string
  }>
  description?: string
}

export interface MeetingPrepSummary {
  quickOverview: string
  whatHappenedLastTime: string
  whatToSayFirst: string
  suggestedQuestions: string[]
  risksAndOpportunities: string
  followUpDraft: string
}
