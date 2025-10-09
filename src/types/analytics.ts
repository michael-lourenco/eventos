export interface EventAnalytics {
  views: number
  clicks: number
  shares: number
  viewsByDate: { [date: string]: number }
}

export interface UserAnalytics {
  userId: string
  month: number
  year: number
  
  events: {
    total: number
    highlighted: number
    recurring: number
  }
  
  engagement: {
    totalViews: number
    totalInterested: number
    totalAttended: number
    averageEngagementRate: number
  }
  
  topEvents: Array<{
    eventId: string
    title: string
    views: number
    interested: number
  }>
  
  demographics: {
    viewsByDay: { [day: string]: number }
    viewsByHour: { [hour: string]: number }
    peakTimes: Array<{ day: string; hour: number; count: number }>
  }
  
  createdAt: Date
  updatedAt: Date
}

