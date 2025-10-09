'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, X, Crown, Zap, Star } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useSubscription } from '@/hooks/use-subscription'
import { SubscriptionPlan } from '@/types/subscription'
import { isUsingMockProvider } from '@/services/payments/PaymentProviderFactory'
import { InternalLayout } from '@/components/common/internal-layout'
import Link from 'next/link'

export default function PricingPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { plan: currentPlan, loading: subLoading } = useSubscription()
  const [processingPlan, setProcessingPlan] = useState<string | null>(null)

  const plans = [
    {
      id: 'visitor',
      name: 'Visitante',
      icon: null,
      price: 0,
      description: 'Para quem quer apenas participar de eventos',
      features: [
        { text: 'Ver todos os eventos no mapa', included: true },
        { text: 'Demonstrar interesse em eventos', included: true },
        { text: 'Confirmar participação', included: true },
        { text: 'Criar eventos', included: false },
        { text: 'Dashboard de organizador', included: false },
        { text: 'Analytics avançado', included: false },
      ],
      cta: 'Plano Atual',
      disabled: true,
      highlight: false,
    },
    {
      id: 'per_event',
      name: 'Por Evento',
      icon: Zap,
      price: 29.90,
      priceNote: '/evento',
      description: 'Pague apenas quando criar um evento',
      features: [
        { text: 'Tudo do plano Visitante', included: true },
        { text: 'Criar eventos pagando por cada', included: true },
        { text: 'Eventos ilimitados', included: true },
        { text: 'Dashboard básico do organizador', included: true },
        { text: 'Analytics avançado', included: false },
        { text: 'Destaque no mapa', included: false },
      ],
      cta: 'Começar',
      apiPlan: 'PER_EVENT',
      highlight: false,
    },
    {
      id: 'monthly',
      name: 'Mensal',
      icon: Crown,
      price: 199.90,
      priceNote: '/mês',
      originalPrice: 239.20, // 8 eventos * 29.90
      savings: '~16% de economia',
      description: 'Ideal para organizadores frequentes',
      features: [
        { text: 'Tudo do plano Por Evento', included: true },
        { text: 'Até 8 eventos por mês', included: true },
        { text: 'Analytics avançado completo', included: true },
        { text: '2 destaques por mês no mapa', included: true },
        { text: 'Eventos recorrentes (2 séries)', included: true },
        { text: 'Suporte prioritário (24h)', included: true },
        { text: 'Exportação de dados básica', included: true },
      ],
      cta: 'Assinar Mensal',
      apiPlan: 'MONTHLY',
      highlight: true,
      badge: 'Mais Popular',
    },
    {
      id: 'annual',
      name: 'Anual',
      icon: Star,
      price: 166.58, // 1999 / 12
      priceNote: '/mês',
      billingNote: 'Cobrado anualmente (R$ 1.999,00)',
      originalPrice: 199.90,
      savings: '~17% de economia',
      description: 'Melhor custo-benefício',
      features: [
        { text: 'Tudo do plano Mensal', included: true },
        { text: 'Até 8 eventos por mês', included: true },
        { text: 'Destaques ILIMITADOS no mapa', included: true },
        { text: 'Eventos recorrentes ILIMITADOS', included: true },
        { text: 'Customização de marca completa', included: true },
        { text: 'Exportação avançada (CSV, Excel, PDF)', included: true },
        { text: 'Suporte VIP prioritário', included: true },
        { text: 'Badge "Organizador Verificado"', included: true },
      ],
      cta: 'Assinar Anual',
      apiPlan: 'ANNUAL',
      highlight: false,
      badge: 'Melhor Valor',
    },
  ]

  const handleCheckout = async (planId: string | undefined) => {
    if (!planId) return

    if (!user) {
      router.push('/login')
      return
    }

    setProcessingPlan(planId)

    try {
      const response = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.email,
          plan: planId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar checkout')
      }

      // Redirecionar para URL de checkout
      window.location.href = data.url
    } catch (error: any) {
      console.error('Erro ao processar checkout:', error)
      alert(error.message || 'Erro ao processar checkout')
      setProcessingPlan(null)
    }
  }

  const isCurrentPlan = (planId: string) => {
    return currentPlan === planId
  }

  return (
    <InternalLayout
      title="Escolha seu Plano"
      subtitle="Comece gratuitamente ou escolha o plano ideal para suas necessidades"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          {isUsingMockProvider() && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm">
              <span className="text-lg">🔷</span>
              <span><strong>Modo Mock:</strong> Pagamentos simulados - sem cobranças reais</span>
            </div>
          )}

          {!user && (
            <div className="mt-6 p-4 rounded-lg bg-blue-50 border border-blue-200 max-w-3xl mx-auto">
              <p className="text-sm text-blue-800">
                <Link href="/login" className="font-semibold underline">Faça login</Link> para assinar um plano e começar a criar eventos
              </p>
            </div>
          )}
        </div>

        {/* Cards de Planos */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 max-w-7xl mx-auto">
          {plans.map((plan) => {
            const Icon = plan.icon
            const isCurrent = isCurrentPlan(plan.id)
            const isProcessing = processingPlan === plan.apiPlan

            return (
              <Card
                key={plan.id}
                className={`relative ${plan.highlight ? 'border-primary shadow-lg scale-105 z-10' : ''} ${isCurrent ? 'border-green-500' : ''}`}
              >
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">{plan.badge}</Badge>
                  </div>
                )}

                {isCurrent && (
                  <div className="absolute -top-4 right-4">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                      Plano Atual
                    </Badge>
                  </div>
                )}

                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    {Icon && <Icon className="h-5 w-5 text-primary" />}
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                  
                  <div className="mt-4">
                    {plan.originalPrice && (
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm line-through text-muted-foreground">
                          R$ {(plan.originalPrice || 0).toFixed(2)}
                        </span>
                        <Badge variant="secondary" className="text-xs">{plan.savings}</Badge>
                      </div>
                    )}
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold">
                        R$ {(plan.price || 0).toFixed(2)}
                      </span>
                      <span className="text-muted-foreground">{plan.priceNote}</span>
                    </div>
                    {plan.billingNote && (
                      <p className="text-xs text-muted-foreground mt-1">{plan.billingNote}</p>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        {feature.included ? (
                          <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        ) : (
                          <X className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                        )}
                        <span className={!feature.included ? 'text-muted-foreground' : ''}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {plan.apiPlan ? (
                    <Button
                      onClick={() => handleCheckout(plan.apiPlan)}
                      disabled={isProcessing || authLoading || isCurrent}
                      className="w-full"
                      variant={plan.highlight ? 'default' : 'outline'}
                    >
                      {isProcessing ? 'Processando...' : isCurrent ? 'Plano Atual' : plan.cta}
                    </Button>
                  ) : (
                    <Button disabled className="w-full" variant="outline">
                      {plan.cta}
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Perguntas Frequentes</h2>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Como funciona o plano &quot;Por Evento&quot;?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Você paga R$ 29,90 apenas quando criar um evento. Não há limite de eventos,
                  mas cada um precisa ser pago individualmente. Ideal para quem cria eventos ocasionalmente.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Posso mudar de plano?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Sim! Você pode fazer upgrade a qualquer momento. Para planos anuais já pagos,
                  você mantém os benefícios até o final do período contratado.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">O que acontece se eu cancelar?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Seus eventos permanecem ativos até a data de término. Você tem 7 dias de período
                  de graça para renovar sem perder acesso às funcionalidades premium.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Como funciona o limite de 8 eventos/mês?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  O limite reseta automaticamente todo dia 1º do mês. Se precisar criar mais de 8 eventos
                  em um mês, você pode pagar avulso (R$ 29,90/evento adicional).
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Final */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">
            Ainda com dúvidas? <Link href="/user" className="text-primary hover:underline">Fale conosco</Link>
          </p>
        </div>
      </div>
    </InternalLayout>
  )
}

