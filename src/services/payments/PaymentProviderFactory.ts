import { PaymentProvider } from './PaymentProvider'
import { MockPaymentProvider } from './MockPaymentProvider'

/**
 * Factory para criar o provedor de pagamento correto
 * Controla qual implementação usar via variável de ambiente
 */

let providerInstance: PaymentProvider | null = null

export function getPaymentProvider(): PaymentProvider {
  if (providerInstance) {
    return providerInstance
  }

  // Verificar qual provedor usar
  const provider = process.env.NEXT_PUBLIC_PAYMENT_PROVIDER || 'mock'

  console.log(`💳 Inicializando Payment Provider: ${provider.toUpperCase()}`)

  switch (provider.toLowerCase()) {
    case 'stripe':
      // TODO: Implementar quando tiver Stripe configurado
      // import { StripePaymentProvider } from './StripePaymentProvider'
      // providerInstance = new StripePaymentProvider()
      console.warn('⚠️ Stripe não implementado ainda, usando MOCK')
      providerInstance = new MockPaymentProvider()
      break
      
    case 'mercadopago':
      // TODO: Implementar no futuro se necessário
      console.warn('⚠️ Mercado Pago não implementado ainda, usando MOCK')
      providerInstance = new MockPaymentProvider()
      break
      
    case 'mock':
    default:
      providerInstance = new MockPaymentProvider()
      break
  }

  return providerInstance
}

/**
 * Força a recriação da instância (útil para testes)
 */
export function resetPaymentProvider(): void {
  providerInstance = null
}

/**
 * Verifica se está usando o provedor mockado
 */
export function isUsingMockProvider(): boolean {
  const provider = process.env.NEXT_PUBLIC_PAYMENT_PROVIDER || 'mock'
  return provider.toLowerCase() === 'mock'
}

