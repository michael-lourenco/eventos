import { doc, updateDoc, setDoc, getDoc, Firestore } from 'firebase/firestore'
import { dbFirestore } from '@/services/firebase/FirebaseService'
import { SubscriptionPlan, SubscriptionStatus } from '@/types/subscription'
import { UserData } from '@/components/user/types/user'

export class SubscriptionService {
  private db: Firestore

  constructor(db: Firestore = dbFirestore) {
    this.db = db
  }

  /**
   * Atualizar assinatura do usuário após pagamento
   */
  async updateUserSubscription(params: {
    userId: string
    plan: SubscriptionPlan
    status: SubscriptionStatus
    subscriptionId?: string
    customerId?: string
  }): Promise<boolean> {
    try {
      const userRef = doc(this.db, 'users', params.userId)
      const now = new Date()

      // Calcular datas baseado no plano
      const endDate = this.calculateEndDate(params.plan)
      const renewalDate = endDate

      const updateData: any = {
        'subscription.plan': params.plan,
        'subscription.status': params.status,
        'subscription.startDate': now,
        'subscription.endDate': endDate,
        'subscription.renewalDate': renewalDate,
        'subscription.eventsCreatedThisMonth': 0,
        'subscription.lastEventCountReset': now,
        updatedAt: now,
      }

      if (params.subscriptionId) {
        updateData['subscription.stripeSubscriptionId'] = params.subscriptionId
      }

      if (params.customerId) {
        updateData['subscription.stripeCustomerId'] = params.customerId
      }

      await updateDoc(userRef, updateData)

      console.log('✅ Assinatura atualizada:', params.userId, params.plan)
      return true
    } catch (error) {
      console.error('❌ Erro ao atualizar assinatura:', error)
      return false
    }
  }

  /**
   * Incrementar contador de eventos criados
   */
  async incrementEventCount(userId: string): Promise<boolean> {
    try {
      const userRef = doc(this.db, 'users', userId)
      const userDoc = await getDoc(userRef)

      if (!userDoc.exists()) {
        throw new Error('Usuário não encontrado')
      }

      const userData = userDoc.data() as UserData
      const currentCount = userData.subscription?.eventsCreatedThisMonth || 0

      await updateDoc(userRef, {
        'subscription.eventsCreatedThisMonth': currentCount + 1,
        updatedAt: new Date(),
      })

      console.log('✅ Contador de eventos incrementado:', userId, currentCount + 1)
      return true
    } catch (error) {
      console.error('❌ Erro ao incrementar contador:', error)
      return false
    }
  }

  /**
   * Incrementar contador de destaques usados
   */
  async incrementHighlightCount(userId: string): Promise<boolean> {
    try {
      const userRef = doc(this.db, 'users', userId)
      const userDoc = await getDoc(userRef)

      if (!userDoc.exists()) {
        throw new Error('Usuário não encontrado')
      }

      const userData = userDoc.data() as UserData
      const currentCount = userData.subscription?.highlightsUsedThisMonth || 0

      await updateDoc(userRef, {
        'subscription.highlightsUsedThisMonth': currentCount + 1,
        updatedAt: new Date(),
      })

      console.log('✅ Contador de destaques incrementado:', userId, currentCount + 1)
      return true
    } catch (error) {
      console.error('❌ Erro ao incrementar contador de destaques:', error)
      return false
    }
  }

  /**
   * Cancelar assinatura (período de graça)
   */
  async cancelSubscription(userId: string): Promise<boolean> {
    try {
      const userRef = doc(this.db, 'users', userId)
      const now = new Date()
      const gracePeriodEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 dias

      await updateDoc(userRef, {
        'subscription.status': SubscriptionStatus.GRACE_PERIOD,
        'subscription.cancelledAt': now,
        'subscription.gracePeriodEnd': gracePeriodEnd,
        updatedAt: now,
      })

      console.log('✅ Assinatura cancelada (período de graça):', userId)
      return true
    } catch (error) {
      console.error('❌ Erro ao cancelar assinatura:', error)
      return false
    }
  }

  /**
   * Reativar assinatura
   */
  async reactivateSubscription(userId: string): Promise<boolean> {
    try {
      const userRef = doc(this.db, 'users', userId)
      const now = new Date()

      await updateDoc(userRef, {
        'subscription.status': SubscriptionStatus.ACTIVE,
        'subscription.cancelledAt': null,
        'subscription.gracePeriodEnd': null,
        updatedAt: now,
      })

      console.log('✅ Assinatura reativada:', userId)
      return true
    } catch (error) {
      console.error('❌ Erro ao reativar assinatura:', error)
      return false
    }
  }

  /**
   * Resetar contadores mensais (executar todo dia 1º)
   */
  async resetMonthlyCounters(userId: string): Promise<boolean> {
    try {
      const userRef = doc(this.db, 'users', userId)

      await updateDoc(userRef, {
        'subscription.eventsCreatedThisMonth': 0,
        'subscription.highlightsUsedThisMonth': 0,
        'subscription.lastEventCountReset': new Date(),
        updatedAt: new Date(),
      })

      console.log('✅ Contadores mensais resetados:', userId)
      return true
    } catch (error) {
      console.error('❌ Erro ao resetar contadores:', error)
      return false
    }
  }

  /**
   * Calcular data de término baseado no plano
   */
  private calculateEndDate(plan: SubscriptionPlan): Date {
    const now = new Date()

    switch (plan) {
      case SubscriptionPlan.MONTHLY:
        return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 dias
      case SubscriptionPlan.ANNUAL:
        return new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000) // 365 dias
      case SubscriptionPlan.PER_EVENT:
        return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 dias
      default:
        return now
    }
  }
}

