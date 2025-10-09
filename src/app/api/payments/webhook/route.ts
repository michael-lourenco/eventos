import { NextResponse } from 'next/server'
import { getPaymentProvider, isUsingMockProvider } from '@/services/payments/PaymentProviderFactory'
import { MockPaymentProvider } from '@/services/payments/MockPaymentProvider'
import { SubscriptionService } from '@/services/subscriptions/SubscriptionService'
import { PaymentService } from '@/services/payments/PaymentService'
import { SubscriptionPlan, SubscriptionStatus } from '@/types/subscription'

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature') || ''

    // Validar webhook
    const paymentProvider = getPaymentProvider()
    const event = await paymentProvider.validateWebhook(body, signature)

    if (!event) {
      return NextResponse.json({ error: 'Invalid webhook' }, { status: 400 })
    }

    console.log('📨 Webhook recebido:', event.type)

    // Processar eventos
    const subscriptionService = new SubscriptionService()
    const paymentService = new PaymentService()

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data, subscriptionService, paymentService)
        break

      case 'subscription.created':
      case 'subscription.updated':
        await handleSubscriptionUpdate(event.data, subscriptionService)
        break

      case 'subscription.deleted':
        await handleSubscriptionDeleted(event.data, subscriptionService)
        break

      default:
        console.log(`ℹ️ Evento não tratado: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('❌ Erro ao processar webhook:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

// Também aceitar GET para simular webhooks em desenvolvimento
export async function GET(request: Request) {
  // Apenas em modo mock
  if (!isUsingMockProvider()) {
    return NextResponse.json({ error: 'Only available in mock mode' }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')
  const sessionId = searchParams.get('session_id')
  const userId = searchParams.get('user_id')

  if (action === 'simulate_complete' && sessionId) {
    try {
      const provider = getPaymentProvider() as MockPaymentProvider
      const event = await provider.simulateCheckoutComplete(sessionId)

      // Se userId foi passado, sobrescrever
      if (userId) {
        event.data.userId = userId
      }

      const subscriptionService = new SubscriptionService()
      const paymentService = new PaymentService()

      await handleCheckoutCompleted(event.data, subscriptionService, paymentService)

      return NextResponse.json({
        success: true,
        message: 'Checkout simulado com sucesso',
        event
      })
    } catch (error: any) {
      console.error('❌ Erro na simulação:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}

// Handlers

async function handleCheckoutCompleted(
  data: any,
  subscriptionService: SubscriptionService,
  paymentService: PaymentService
) {
  const { userId, plan, subscriptionId, customerId, eventId, amount } = data

  if (!userId || userId === 'unknown') {
    console.error('❌ userId inválido ou não fornecido:', userId)
    throw new Error('userId é obrigatório para processar checkout')
  }

  console.log('✅ Processando checkout completo:', { userId, plan, eventId })

  // Mapear string do plano para enum
  const planMap: Record<string, SubscriptionPlan> = {
    'PER_EVENT': SubscriptionPlan.PER_EVENT,
    'MONTHLY': SubscriptionPlan.MONTHLY,
    'ANNUAL': SubscriptionPlan.ANNUAL,
  }

  const subscriptionPlan = planMap[plan] || SubscriptionPlan.VISITOR

  // Atualizar assinatura do usuário
  await subscriptionService.updateUserSubscription({
    userId,
    plan: subscriptionPlan,
    status: SubscriptionStatus.ACTIVE,
    subscriptionId,
    customerId,
  })

  // Registrar pagamento
  await paymentService.recordPayment({
    userId,
    type: plan === 'PER_EVENT' ? 'per_event' : 'subscription',
    stripePaymentIntentId: subscriptionId || `mock_pi_${Date.now()}`,
    stripeInvoiceId: null,
    eventId: eventId || null,
    amount: amount || getPlanPrice(plan),
    currency: 'BRL',
    status: 'succeeded',
    description: `Pagamento ${plan}${eventId ? ` - Evento ${eventId}` : ''}`,
    receiptUrl: null,
  })

  // Se for por evento, marcar o evento como pago
  if (eventId) {
    console.log(`✅ Evento ${eventId} marcado como pago`)
    // TODO: Atualizar evento no Firestore
  }
}

async function handleSubscriptionUpdate(
  data: any,
  subscriptionService: SubscriptionService
) {
  const { userId, status } = data
  console.log('✅ Processando atualização de assinatura:', { userId, status })
  
  // Converter status
  const statusMap: Record<string, SubscriptionStatus> = {
    'active': SubscriptionStatus.ACTIVE,
    'past_due': SubscriptionStatus.PAST_DUE,
    'cancelled': SubscriptionStatus.CANCELLED,
  }

  // TODO: Implementar lógica de atualização se necessário
}

async function handleSubscriptionDeleted(
  data: any,
  subscriptionService: SubscriptionService
) {
  const { userId } = data
  console.log('✅ Processando cancelamento de assinatura:', { userId })
  
  await subscriptionService.cancelSubscription(userId)
}

// Helper para obter preço do plano
function getPlanPrice(plan: string): number {
  const prices: Record<string, number> = {
    'PER_EVENT': 29.90,
    'MONTHLY': 199.90,
    'ANNUAL': 1999.00,
  }
  return prices[plan] || 0
}

