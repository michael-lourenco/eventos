/**
 * Interface abstrata para provedores de pagamento
 * Permite trocar facilmente entre Mock, Stripe, Mercado Pago, etc.
 */

export interface CheckoutSession {
  id: string
  url: string
  metadata: {
    userId: string
    plan: string
    eventId?: string
  }
}

export interface CustomerPortalSession {
  url: string
}

export interface PaymentWebhookEvent {
  type: string
  data: {
    userId: string
    plan: string
    subscriptionId?: string
    customerId?: string
    amount?: number
    status?: string
    eventId?: string
  }
}

export abstract class PaymentProvider {
  /**
   * Criar sessão de checkout
   */
  abstract createCheckoutSession(params: {
    userId: string
    userEmail: string
    userName: string
    plan: 'PER_EVENT' | 'MONTHLY' | 'ANNUAL'
    eventId?: string
    successUrl: string
    cancelUrl: string
  }): Promise<CheckoutSession>

  /**
   * Criar sessão do portal do cliente
   */
  abstract createCustomerPortalSession(params: {
    customerId: string
    returnUrl: string
  }): Promise<CustomerPortalSession>

  /**
   * Validar webhook do provedor
   */
  abstract validateWebhook(
    body: string | Buffer,
    signature: string
  ): Promise<PaymentWebhookEvent | null>

  /**
   * Cancelar assinatura
   */
  abstract cancelSubscription(subscriptionId: string): Promise<boolean>

  /**
   * Obter informações da assinatura
   */
  abstract getSubscription(subscriptionId: string): Promise<{
    status: string
    currentPeriodEnd: Date
  } | null>
}

