import { useState, useEffect } from 'react'
import { useAuth } from './use-auth'
import { SubscriptionPlan, SubscriptionStatus, PLAN_LIMITS, PLAN_NAMES, PLAN_PRICES } from '@/types/subscription'
import { SubscriptionGuard } from '@/lib/auth/subscription-guard'

export function useSubscription() {
  const { user, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading) {
      setLoading(false)
    }
  }, [authLoading])

  // Valores padrão para usuário não logado ou sem subscription
  const defaultSubscription = {
    plan: SubscriptionPlan.VISITOR,
    status: SubscriptionStatus.INACTIVE,
    stripeCustomerId: null,
    stripeSubscriptionId: null,
    startDate: null,
    endDate: null,
    renewalDate: null,
    cancelledAt: null,
    gracePeriodEnd: null,
    eventsCreatedThisMonth: 0,
    eventsLimit: 0,
    lastEventCountReset: new Date(),
    highlightsUsedThisMonth: 0,
    highlightsLimit: 0,
    recurringSeriesCount: 0,
    recurringSeriesLimit: 0,
  }

  // Garantir compatibilidade retroativa para usuários sem subscription
  const subscription = user?.subscription ? {
    ...defaultSubscription,
    ...user.subscription
  } : defaultSubscription

  const plan = subscription.plan || SubscriptionPlan.VISITOR
  const planName = PLAN_NAMES[plan] || 'Visitante'
  const planPrice = PLAN_PRICES[plan as keyof typeof PLAN_PRICES]
  const limits = PLAN_LIMITS[plan] || PLAN_LIMITS[SubscriptionPlan.VISITOR]
  const isActive = subscription.status === SubscriptionStatus.ACTIVE
  const isGracePeriod = subscription.status === SubscriptionStatus.GRACE_PERIOD
  const isPremium = plan !== SubscriptionPlan.VISITOR

  // Verificações de permissão
  const canCreateEvent = user ? SubscriptionGuard.canCreateEvent(user) : { allowed: false, reason: 'Faça login para criar eventos' }
  const canHighlight = user ? SubscriptionGuard.canHighlightEvent(user) : { allowed: false, reason: 'Faça login para destacar eventos' }
  const canCreateRecurring = user ? SubscriptionGuard.canCreateRecurringEvent(user) : { allowed: false, reason: 'Faça login para criar eventos recorrentes' }
  const canAccessAnalytics = user ? SubscriptionGuard.canAccessAnalytics(user) : false
  const canCustomizeBranding = user ? SubscriptionGuard.canCustomizeBranding(user) : false
  const exportLevel = user ? SubscriptionGuard.getExportLevel(user) : 'none'
  const supportLevel = user ? SubscriptionGuard.getSupportLevel(user) : 'standard'
  
  // Informações de uso
  const usageInfo = user ? SubscriptionGuard.getUsageInfo(user) : {
    eventsUsed: 0,
    eventsLimit: 0,
    eventsRemaining: 0,
    highlightsUsed: 0,
    highlightsLimit: 0,
    highlightsRemaining: 0,
  }

  // Calcular progresso de uso (%)
  const eventsProgress = limits.eventsPerMonth && usageInfo.eventsLimit
    ? (usageInfo.eventsUsed / usageInfo.eventsLimit) * 100
    : 0

  const highlightsProgress = limits.highlightsPerMonth && usageInfo.highlightsLimit
    ? (usageInfo.highlightsUsed / usageInfo.highlightsLimit) * 100
    : 0

  // Verificar se está próximo do limite
  const isNearEventLimit = eventsProgress >= 80
  const isNearHighlightLimit = highlightsProgress >= 80

  // Calcular dias restantes do período de graça
  const graceDaysRemaining = subscription.gracePeriodEnd 
    ? Math.max(0, Math.ceil((new Date(subscription.gracePeriodEnd).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0

  // Portal de gerenciamento
  const openCustomerPortal = async () => {
    if (!user) {
      console.error('Usuário não autenticado')
      return
    }

    try {
      const response = await fetch('/api/payments/portal', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user.email
        })
      })
      
      const data = await response.json()
      
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error(data.error || 'Erro ao abrir portal de gerenciamento')
      }
    } catch (error) {
      console.error('Erro ao abrir portal:', error)
      throw error
    }
  }

  return {
    // Subscription info
    subscription,
    plan,
    planName,
    planPrice,
    limits,
    isActive,
    isGracePeriod,
    isPremium,
    
    // Permissions
    canCreateEvent,
    canHighlight,
    canCreateRecurring,
    canAccessAnalytics,
    canCustomizeBranding,
    exportLevel,
    supportLevel,
    
    // Usage info
    usageInfo,
    eventsProgress,
    highlightsProgress,
    isNearEventLimit,
    isNearHighlightLimit,
    graceDaysRemaining,
    
    // Actions
    openCustomerPortal,
    
    // State
    loading,
  }
}

