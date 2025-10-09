import { UserSubscription } from '@/types/subscription'
import { PaymentHistory } from '@/types/payment'

interface CurrencyData {
  value: number;
  updatedAt: Date;
}

export interface Credit {
  value: number;
  updatedAt: Date;
}

export interface UserMarker {
  id: string;
  lat: number;
  lng: number;
  type: string;
  createdAt: Date;
}

export interface UserPreferences {
  brandColor: string | null
  brandLogo: string | null
  notificationsEnabled: boolean
  emailMarketing: boolean
}

export interface UserData {
  // Dados básicos
  displayName: string;
  email: string;
  photoURL: string;
  
  // Dados legados (manter compatibilidade)
  credits: Credit;
  currency: CurrencyData;
  userMarkers?: UserMarker[];
  
  // Sistema de assinaturas (NOVO - opcional para compatibilidade)
  subscription?: UserSubscription
  
  // Histórico de pagamentos (NOVO - opcional para compatibilidade)
  paymentHistory?: PaymentHistory
  
  // Preferências (NOVO - opcional para compatibilidade)
  preferences?: UserPreferences
  
  // Metadata
  createdAt?: Date
  updatedAt?: Date
}
