import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY não configurada nas variáveis de ambiente')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-09-30.clover',
  typescript: true,
})

// IDs dos produtos no Stripe (configurar após criar produtos no dashboard)
export const STRIPE_PRICES = {
  PER_EVENT: process.env.STRIPE_PRICE_PER_EVENT_ID || '',
  MONTHLY: process.env.STRIPE_PRICE_MONTHLY_ID || '',
  ANNUAL: process.env.STRIPE_PRICE_ANNUAL_ID || '',
}

// Validar que os IDs estão configurados
export function validateStripeConfig(): boolean {
  const missing = []
  
  if (!STRIPE_PRICES.PER_EVENT) missing.push('STRIPE_PRICE_PER_EVENT_ID')
  if (!STRIPE_PRICES.MONTHLY) missing.push('STRIPE_PRICE_MONTHLY_ID')
  if (!STRIPE_PRICES.ANNUAL) missing.push('STRIPE_PRICE_ANNUAL_ID')
  
  if (missing.length > 0) {
    console.warn(`⚠️ Configurações Stripe faltando: ${missing.join(', ')}`)
    return false
  }
  
  return true
}

// Log de inicialização
console.log('✅ Stripe inicializado com sucesso')
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 Modo: Desenvolvimento')
  validateStripeConfig()
}

