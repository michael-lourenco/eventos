export enum SubscriptionPlan {
  VISITOR = 'visitor',
  PER_EVENT = 'per_event',
  MONTHLY = 'monthly',
  ANNUAL = 'annual'
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  GRACE_PERIOD = 'grace_period',
  CANCELLED = 'cancelled',
  PAST_DUE = 'past_due'
}

export interface SubscriptionLimits {
  eventsPerMonth: number | null // null = ilimitado
  highlightsPerMonth: number | null
  recurringSeries: number | null
  analytics: boolean
  branding: boolean
  export: 'none' | 'basic' | 'advanced'
  support: 'standard' | 'priority' | 'vip'
}

export const PLAN_LIMITS: Record<SubscriptionPlan, SubscriptionLimits> = {
  [SubscriptionPlan.VISITOR]: {
    eventsPerMonth: 0,
    highlightsPerMonth: 0,
    recurringSeries: 0,
    analytics: false,
    branding: false,
    export: 'none',
    support: 'standard'
  },
  [SubscriptionPlan.PER_EVENT]: {
    eventsPerMonth: null, // paga por evento
    highlightsPerMonth: 0,
    recurringSeries: 0,
    analytics: false,
    branding: false,
    export: 'none',
    support: 'standard'
  },
  [SubscriptionPlan.MONTHLY]: {
    eventsPerMonth: 8,
    highlightsPerMonth: 2,
    recurringSeries: 2,
    analytics: true,
    branding: false,
    export: 'basic',
    support: 'priority'
  },
  [SubscriptionPlan.ANNUAL]: {
    eventsPerMonth: 8,
    highlightsPerMonth: null, // ilimitado
    recurringSeries: null, // ilimitado
    analytics: true,
    branding: true,
    export: 'advanced',
    support: 'vip'
  }
}

export const PLAN_PRICES = {
  [SubscriptionPlan.PER_EVENT]: 29.90,
  [SubscriptionPlan.MONTHLY]: 199.90,
  [SubscriptionPlan.ANNUAL]: 1999.00
}

export const PLAN_NAMES = {
  [SubscriptionPlan.VISITOR]: 'Visitante',
  [SubscriptionPlan.PER_EVENT]: 'Por Evento',
  [SubscriptionPlan.MONTHLY]: 'Mensal',
  [SubscriptionPlan.ANNUAL]: 'Anual'
}

export interface UserSubscription {
  plan: SubscriptionPlan
  status: SubscriptionStatus
  
  // Stripe IDs
  stripeCustomerId: string | null
  stripeSubscriptionId: string | null
  
  // Datas importantes
  startDate: Date | null
  endDate: Date | null
  renewalDate: Date | null
  cancelledAt: Date | null
  gracePeriodEnd: Date | null
  
  // Limites e uso
  eventsCreatedThisMonth: number
  eventsLimit: number | null
  lastEventCountReset: Date
  
  // Recursos premium
  highlightsUsedThisMonth: number
  highlightsLimit: number | null
  recurringSeriesCount: number
  recurringSeriesLimit: number | null
}

