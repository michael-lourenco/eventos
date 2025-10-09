'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, ArrowRight, Loader2 } from 'lucide-react'
import { isUsingMockProvider } from '@/services/payments/PaymentProviderFactory'

function SuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [processing, setProcessing] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const sessionId = searchParams?.get('session_id') || searchParams?.get('mock_session')
  const isMockSuccess = searchParams?.get('mock_success') === 'true'

  const simulateMockCheckout = useCallback(async () => {
    try {
      console.log('🔷 Simulando conclusão de checkout mockado...')
      
      // Pegar userId do localStorage
      const userDataString = localStorage.getItem('user')
      const userData = userDataString ? JSON.parse(userDataString) : null
      const userId = userData?.email || 'unknown'
      
      // Chamar webhook para processar o "pagamento" (URL relativa para usar porta correta)
      const response = await fetch(
        `/api/payments/webhook?action=simulate_complete&session_id=${sessionId}&user_id=${userId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao simular checkout')
      }

      const data = await response.json()
      console.log('✅ Checkout mockado processado:', data)

      setProcessing(false)
    } catch (error: any) {
      console.error('❌ Erro ao simular checkout:', error)
      setError(error.message)
      setProcessing(false)
    }
  }, [sessionId])

  useEffect(() => {
    if (!sessionId) {
      setError('Sessão de checkout não encontrada')
      setProcessing(false)
      return
    }

    // Se estiver usando o provider mockado, simular conclusão
    if (isUsingMockProvider() && isMockSuccess) {
      simulateMockCheckout()
    } else {
      // Webhook já deve ter processado, apenas mostrar sucesso
      setProcessing(false)
    }
  }, [sessionId, isMockSuccess, simulateMockCheckout])

  if (processing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-muted flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
              <h3 className="text-lg font-semibold mb-2">Processando pagamento...</h3>
              <p className="text-sm text-muted-foreground text-center">
                Aguarde enquanto confirmamos seu pagamento
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-muted flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Erro ao processar pagamento</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/pricing')} className="w-full">
              Tentar Novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-primary">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl">Pagamento Confirmado!</CardTitle>
          <CardDescription>
            Sua assinatura foi ativada com sucesso
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {isUsingMockProvider() && (
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
              <p className="text-sm text-amber-800">
                <strong>🔷 Modo Mock:</strong> Este é um pagamento simulado. 
                Nenhuma cobrança real foi feita.
              </p>
            </div>
          )}

          <div className="space-y-2 text-sm">
            <p>✅ Pagamento processado</p>
            <p>✅ Assinatura ativada</p>
            <p>✅ Acesso aos recursos premium liberado</p>
          </div>

          <div className="pt-4 space-y-2">
            <Button 
              onClick={() => router.push('/organizer/create')} 
              className="w-full"
              size="lg"
            >
              Criar Seu Primeiro Evento
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            
            <Button 
              onClick={() => router.push('/user')} 
              variant="outline" 
              className="w-full"
            >
              Ir para Minha Conta
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground pt-4">
            Um email de confirmação será enviado em breve
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default function SubscriptionSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}

