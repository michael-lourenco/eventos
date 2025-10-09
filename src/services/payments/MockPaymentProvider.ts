import { 
  PaymentProvider, 
  CheckoutSession, 
  CustomerPortalSession, 
  PaymentWebhookEvent 
} from './PaymentProvider'

/**
 * Provedor de pagamento MOCKADO para desenvolvimento
 * Simula todo o fluxo do Stripe sem precisar de configuração
 */
export class MockPaymentProvider extends PaymentProvider {
  private sessions: Map<string, any> = new Map()
  private customers: Map<string, any> = new Map()
  private subscriptions: Map<string, any> = new Map()

  async createCheckoutSession(params: {
    userId: string
    userEmail: string
    userName: string
    plan: 'PER_EVENT' | 'MONTHLY' | 'ANNUAL'
    eventId?: string
    successUrl: string
    cancelUrl: string
  }): Promise<CheckoutSession> {
    
    // Gerar IDs mockados
    const sessionId = `mock_cs_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const customerId = `mock_cus_${params.userId.replace(/[^a-zA-Z0-9]/g, '_')}`
    
    console.log('🔷 [MOCK] Criando checkout session:', {
      sessionId,
      userId: params.userId,
      plan: params.plan,
      eventId: params.eventId
    })

    // Simular criação de customer
    if (!this.customers.has(params.userId)) {
      this.customers.set(params.userId, {
        id: customerId,
        email: params.userEmail,
        name: params.userName,
        metadata: {
          userId: params.userId
        }
      })
      console.log('🔷 [MOCK] Customer criado:', customerId)
    }

    // Salvar sessão mockada
    const session = {
      id: sessionId,
      customerId,
      plan: params.plan,
      userId: params.userId,
      eventId: params.eventId,
      status: 'open',
      createdAt: new Date()
    }
    
    this.sessions.set(sessionId, session)

    // URL mockada que vai processar o "pagamento"
    const checkoutUrl = `${params.successUrl.split('?')[0]}?mock_session=${sessionId}&mock_success=true`

    return {
      id: sessionId,
      url: checkoutUrl,
      metadata: {
        userId: params.userId,
        plan: params.plan,
        eventId: params.eventId
      }
    }
  }

  async createCustomerPortalSession(params: {
    customerId: string
    returnUrl: string
  }): Promise<CustomerPortalSession> {
    
    console.log('🔷 [MOCK] Criando portal session para:', params.customerId)

    // URL mockada do portal
    const portalUrl = `${params.returnUrl}?mock_portal=true&customer=${params.customerId}`

    return {
      url: portalUrl
    }
  }

  async validateWebhook(
    body: string | Buffer,
    signature: string
  ): Promise<PaymentWebhookEvent | null> {
    
    try {
      const event = typeof body === 'string' ? JSON.parse(body) : JSON.parse(body.toString())
      
      console.log('🔷 [MOCK] Webhook recebido:', event.type)

      return {
        type: event.type,
        data: event.data
      }
    } catch (error) {
      console.error('🔷 [MOCK] Erro ao validar webhook:', error)
      return null
    }
  }

  async cancelSubscription(subscriptionId: string): Promise<boolean> {
    
    console.log('🔷 [MOCK] Cancelando assinatura:', subscriptionId)

    const subscription = this.subscriptions.get(subscriptionId)
    if (subscription) {
      subscription.status = 'cancelled'
      subscription.cancelledAt = new Date()
      this.subscriptions.set(subscriptionId, subscription)
      return true
    }

    return false
  }

  async getSubscription(subscriptionId: string): Promise<{
    status: string
    currentPeriodEnd: Date
  } | null> {
    
    const subscription = this.subscriptions.get(subscriptionId)
    
    if (subscription) {
      return {
        status: subscription.status || 'active',
        currentPeriodEnd: subscription.currentPeriodEnd || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    }

    return null
  }

  /**
   * Método auxiliar para simular conclusão de checkout (usar em dev)
   */
  async simulateCheckoutComplete(sessionId: string): Promise<PaymentWebhookEvent> {
    let session = this.sessions.get(sessionId)
    
    // Se não encontrar sessão (servidor reiniciou), extrair info do sessionId
    if (!session) {
      console.log('🔷 [MOCK] Sessão não encontrada, extraindo do ID...')
      
      // Parsear sessionId para extrair informações básicas
      // Formato: mock_cs_{timestamp}_{random}
      session = {
        id: sessionId,
        plan: 'MONTHLY', // Assumir mensal por padrão
        userId: 'unknown', // Será atualizado pelo webhook
        status: 'open',
        createdAt: new Date()
      }
    }

    console.log('🔷 [MOCK] Simulando checkout completo para:', sessionId)

    // Se for assinatura, criar subscription mockada
    if (session.plan === 'MONTHLY' || session.plan === 'ANNUAL') {
      const subscriptionId = `mock_sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const periodMonths = session.plan === 'ANNUAL' ? 12 : 1
      
      this.subscriptions.set(subscriptionId, {
        id: subscriptionId,
        customerId: session.customerId,
        plan: session.plan,
        status: 'active',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + periodMonths * 30 * 24 * 60 * 60 * 1000)
      })

      return {
        type: 'checkout.session.completed',
        data: {
          userId: session.userId,
          plan: session.plan,
          subscriptionId,
          customerId: session.customerId,
          status: 'active'
        }
      }
    }

    // Se for pagamento único (por evento)
    return {
      type: 'checkout.session.completed',
      data: {
        userId: session.userId,
        plan: session.plan,
        eventId: session.eventId,
        customerId: session.customerId,
        amount: 29.90,
        status: 'succeeded'
      }
    }
  }

  /**
   * Limpar dados mockados (útil para testes)
   */
  clearMockData(): void {
    this.sessions.clear()
    this.customers.clear()
    this.subscriptions.clear()
    console.log('🔷 [MOCK] Dados limpos')
  }
}

