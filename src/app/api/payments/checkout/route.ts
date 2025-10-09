import { NextResponse } from 'next/server'
import { getPaymentProvider } from '@/services/payments/PaymentProviderFactory'
import { fetchUserData, dbFirestore } from '@/services/firebase/FirebaseService'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { plan, eventId, userId } = body

    if (!userId) {
      return NextResponse.json({ error: 'Usuário não autenticado' }, { status: 401 })
    }

    const user = await fetchUserData(dbFirestore, userId)

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    // Validar plano
    if (!['PER_EVENT', 'MONTHLY', 'ANNUAL'].includes(plan)) {
      return NextResponse.json({ error: 'Plano inválido' }, { status: 400 })
    }

    // Usar o provider (mock ou real)
    const paymentProvider = getPaymentProvider()

    // Criar checkout session
    const session = await paymentProvider.createCheckoutSession({
      userId: user.email,
      userEmail: user.email,
      userName: user.displayName,
      plan,
      eventId,
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/pricing?cancelled=true`,
    })

    console.log('✅ Checkout session criada:', session.id)

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
      metadata: session.metadata,
    })
  } catch (error: any) {
    console.error('❌ Erro ao criar checkout session:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao processar checkout' },
      { status: 500 }
    )
  }
}

