export interface Organizer {
  email: string;
  displayName: string;
  photoURL: string;
  subscription: {
    plan: 'free' | 'basic' | 'premium';
    status: 'active' | 'cancelled' | 'expired';
    startDate: Date;
    endDate: Date;
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
  };
  eventsCreated: number;
  totalRevenue: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrganizerMetrics {
  totalEvents: number;
  activeEvents: number;
  totalInterested: number;
  totalAttendees: number;
  revenue: number;
  subscriptionStatus: string;
  nextPaymentDate?: Date;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: {
    maxEventsPerMonth: number;
    maxAttendeesPerEvent: number;
    analytics: boolean;
    prioritySupport: boolean;
    customBranding: boolean;
  };
}
