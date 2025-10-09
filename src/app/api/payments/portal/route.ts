import { NextResponse } from 'next/server'
import { getPaymentProvider } from '@/services/payments/PaymentProviderFactory'
import { fetchUserData, dbFirestore } from '@/services/firebase/FirebaseService'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json({ error: 'Usuário não autenticado' }, { status: 401 })
    }

    const user = await fetchUserData(dbFirestore, userId)

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    if (!user.subscription?.stripeCustomerId) {
      return NextResponse.json(
        { error: 'Nenhuma assinatura ativa encontrada' },
        { status: 404 }
      )
    }

    // Usar o provider (mock ou real)
    const paymentProvider = getPaymentProvider()

    // Criar portal session
    const session = await paymentProvider.createCustomerPortalSession({
      customerId: user.subscription.stripeCustomerId,
      returnUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/user`,
    })

    console.log('✅ Portal session criada para:', userId)

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('❌ Erro ao criar portal session:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

