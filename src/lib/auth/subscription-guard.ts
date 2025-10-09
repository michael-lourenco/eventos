import { UserData } from '@/components/user/types/user'
import { SubscriptionPlan, SubscriptionStatus, PLAN_LIMITS } from '@/types/subscription'

export class SubscriptionGuard {
  /**
   * Verifica se usuário pode criar evento
   */
  static canCreateEvent(user: UserData): {
    allowed: boolean
    reason?: string
    action?: 'pay_per_event' | 'upgrade_subscription'
  } {
    // Compatibilidade: usuários sem subscription são tratados como VISITOR
    if (!user.subscription) {
      return {
        allowed: false,
        reason: 'Plano gratuito não permite criar eventos',
        action: 'pay_per_event'
      }
    }

    const sub = user.subscription
    
    // Visitante - deve pagar
    if (sub.plan === SubscriptionPlan.VISITOR) {
      return {
        allowed: false,
        reason: 'Plano gratuito não permite criar eventos',
        action: 'pay_per_event'
      }
    }
    
    // Por Evento - sempre pode (paga por cada)
    if (sub.plan === SubscriptionPlan.PER_EVENT) {
      return { allowed: true }
    }
    
    // Assinatura inativa ou em período de graça
    if (sub.status !== SubscriptionStatus.ACTIVE) {
      return {
        allowed: false,
        reason: 'Assinatura inativa ou vencida. Renove para continuar criando eventos.',
        action: 'upgrade_subscription'
      }
    }
    
    // Verificar limite de eventos/mês
    const limit = PLAN_LIMITS[sub.plan].eventsPerMonth
    if (limit !== null && sub.eventsCreatedThisMonth >= limit) {
      return {
        allowed: false,
        reason: `Limite de ${limit} eventos/mês atingido. Faça upgrade para criar mais eventos.`,
        action: 'upgrade_subscription'
      }
    }
    
    return { allowed: true }
  }
  
  /**
   * Verifica se usuário pode destacar evento
   */
  static canHighlightEvent(user: UserData): {
    allowed: boolean
    reason?: string
  } {
    if (!user.subscription) {
      return {
        allowed: false,
        reason: 'Seu plano não inclui destaques'
      }
    }

    const sub = user.subscription
    const limit = PLAN_LIMITS[sub.plan].highlightsPerMonth
    
    if (limit === 0) {
      return {
        allowed: false,
        reason: 'Seu plano não inclui destaques. Faça upgrade para o plano Mensal ou Anual.'
      }
    }
    
    if (limit !== null && sub.highlightsUsedThisMonth >= limit) {
      return {
        allowed: false,
        reason: `Limite de ${limit} destaques/mês atingido. Faça upgrade para o plano Anual para destaques ilimitados.`
      }
    }
    
    return { allowed: true }
  }
  
  /**
   * Verifica se usuário pode criar evento recorrente
   */
  static canCreateRecurringEvent(user: UserData): {
    allowed: boolean
    reason?: string
  } {
    if (!user.subscription) {
      return {
        allowed: false,
        reason: 'Seu plano não inclui eventos recorrentes'
      }
    }

    const sub = user.subscription
    const limit = PLAN_LIMITS[sub.plan].recurringSeries
    
    if (limit === 0) {
      return {
        allowed: false,
        reason: 'Seu plano não inclui eventos recorrentes. Faça upgrade para o plano Mensal ou Anual.'
      }
    }
    
    if (limit !== null && sub.recurringSeriesCount >= limit) {
      return {
        allowed: false,
        reason: `Limite de ${limit} séries recorrentes atingido. Faça upgrade para o plano Anual para séries ilimitadas.`
      }
    }
    
    return { allowed: true }
  }
  
  /**
   * Verifica acesso a analytics
   */
  static canAccessAnalytics(user: UserData): boolean {
    if (!user.subscription) return false
    return PLAN_LIMITS[user.subscription.plan].analytics
  }
  
  /**
   * Verifica acesso a branding customizado
   */
  static canCustomizeBranding(user: UserData): boolean {
    if (!user.subscription) return false
    return PLAN_LIMITS[user.subscription.plan].branding
  }
  
  /**
   * Verifica tipo de exportação permitida
   */
  static getExportLevel(user: UserData): 'none' | 'basic' | 'advanced' {
    if (!user.subscription) return 'none'
    return PLAN_LIMITS[user.subscription.plan].export
  }
  
  /**
   * Obtém tipo de suporte do usuário
   */
  static getSupportLevel(user: UserData): 'standard' | 'priority' | 'vip' {
    if (!user.subscription) return 'standard'
    return PLAN_LIMITS[user.subscription.plan].support
  }
  
  /**
   * Verifica se o plano é premium (pago)
   */
  static isPremiumUser(user: UserData): boolean {
    if (!user.subscription) return false
    return user.subscription.plan !== SubscriptionPlan.VISITOR
  }
  
  /**
   * Obtém informações de uso do usuário
   */
  static getUsageInfo(user: UserData): {
    eventsUsed: number
    eventsLimit: number | null
    eventsRemaining: number | null
    highlightsUsed: number
    highlightsLimit: number | null
    highlightsRemaining: number | null
  } {
    if (!user.subscription) {
      return {
        eventsUsed: 0,
        eventsLimit: 0,
        eventsRemaining: 0,
        highlightsUsed: 0,
        highlightsLimit: 0,
        highlightsRemaining: 0
      }
    }

    const sub = user.subscription
    const limits = PLAN_LIMITS[sub.plan]
    
    return {
      eventsUsed: sub.eventsCreatedThisMonth,
      eventsLimit: limits.eventsPerMonth,
      eventsRemaining: limits.eventsPerMonth !== null 
        ? Math.max(0, limits.eventsPerMonth - sub.eventsCreatedThisMonth)
        : null,
      highlightsUsed: sub.highlightsUsedThisMonth,
      highlightsLimit: limits.highlightsPerMonth,
      highlightsRemaining: limits.highlightsPerMonth !== null
        ? Math.max(0, limits.highlightsPerMonth - sub.highlightsUsedThisMonth)
        : null
    }
  }
}

