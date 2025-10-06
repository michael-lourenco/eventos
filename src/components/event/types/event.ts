export interface FirestoreTimestamp {
  toDate: () => Date;
  seconds: number;
  nanoseconds: number;
}

export enum EventCategory {
  MUSIC = 'music',
  FOOD = 'food',
  SPORTS = 'sports',
  CULTURE = 'culture',
  BUSINESS = 'business',
  EDUCATION = 'education',
  HEALTH = 'health',
  TECHNOLOGY = 'technology',
  ART = 'art',
  FASHION = 'fashion'
}

export enum EventStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ACTIVE = 'active',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed'
}

export interface Event {
  id: string;
  title: string;
  description: string;
  lat: number;
  lng: number;
  category: EventCategory;
  startDate: Date | FirestoreTimestamp;
  endDate: Date | FirestoreTimestamp;
  organizerEmail: string;
  organizerName: string;
  coverImage?: string;
  status: EventStatus;
  interestedBy: string[];
  attendedBy: string[];
  price?: {
    amount: number;
    currency: string;
    type: 'free' | 'paid';
  };
  capacity?: number;
  currentAttendees: number;
  createdAt: Date | FirestoreTimestamp;
  updatedAt: Date | FirestoreTimestamp;
  paymentStatus: 'pending' | 'paid' | 'failed';
  subscriptionId?: string;
}

export interface EventHistory {
  id: string;
  status: EventStatus;
  timestamp: Date | FirestoreTimestamp;
  updatedBy: string;
  comment?: string;
  metadata?: Record<string, any>;
}

export interface EventInteraction {
  eventId: string;
  userEmail: string;
  type: 'interested' | 'attending' | 'not_interested';
  timestamp: Date;
}

export interface EventFormData {
  title: string;
  description: string;
  category: EventCategory;
  startDate: Date;
  endDate: Date;
  price: {
    type: 'free' | 'paid';
    amount?: number;
  };
  capacity?: number;
  coverImage?: File;
}

export interface EventFilters {
  categories: EventCategory[];
  dateRange: {
    start: Date;
    end: Date;
  };
  priceRange: {
    min: number;
    max: number;
  };
  distance: number;
  status: EventStatus[];
}
