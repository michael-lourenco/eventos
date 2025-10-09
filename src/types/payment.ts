export interface Payment {
  userId: string
  type: 'per_event' | 'subscription'
  
  // Stripe
  stripePaymentIntentId: string
  stripeInvoiceId: string | null
  
  // Evento associado (se tipo = per_event)
  eventId: string | null
  
  // Valores
  amount: number
  currency: 'BRL'
  status: 'pending' | 'succeeded' | 'failed' | 'refunded'
  
  // Metadata
  description: string
  receiptUrl: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Subscription {
  userId: string // email do usuário
  plan: 'per_event' | 'monthly' | 'annual'
  status: 'active' | 'past_due' | 'cancelled' | 'grace_period'
  
  // Stripe
  stripeSubscriptionId: string
  stripeCustomerId: string
  stripePriceId: string
  
  // Datas
  currentPeriodStart: Date
  currentPeriodEnd: Date
  cancelAt: Date | null
  cancelledAt: Date | null
  gracePeriodEnd: Date | null
  
  // Financeiro
  amount: number
  currency: 'BRL'
  interval: 'month' | 'year'
  
  // Metadata
  createdAt: Date
  updatedAt: Date
}

export interface PaymentHistory {
  totalSpent: number
  lastPaymentDate: Date | null
  lastPaymentAmount: number
}

