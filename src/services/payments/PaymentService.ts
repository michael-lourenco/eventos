import { doc, setDoc, updateDoc, getDoc, Firestore } from 'firebase/firestore'
import { dbFirestore } from '@/services/firebase/FirebaseService'
import { Payment } from '@/types/payment'

export class PaymentService {
  private db: Firestore

  constructor(db: Firestore = dbFirestore) {
    this.db = db
  }

  /**
   * Registrar pagamento
   */
  async recordPayment(payment: Omit<Payment, 'createdAt' | 'updatedAt'>): Promise<boolean> {
    try {
      const paymentId = `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const paymentRef = doc(this.db, 'payments', paymentId)
      const now = new Date()

      const paymentData: Payment = {
        ...payment,
        createdAt: now,
        updatedAt: now,
      }

      await setDoc(paymentRef, paymentData)

      console.log('✅ Pagamento registrado:', paymentId, payment.amount)

      // Atualizar histórico de pagamentos do usuário
      await this.updateUserPaymentHistory(payment.userId, payment.amount)

      return true
    } catch (error) {
      console.error('❌ Erro ao registrar pagamento:', error)
      return false
    }
  }

  /**
   * Atualizar histórico de pagamentos do usuário
   */
  private async updateUserPaymentHistory(userId: string, amount: number): Promise<void> {
    try {
      const userRef = doc(this.db, 'users', userId)
      const userDoc = await getDoc(userRef)

      if (!userDoc.exists()) {
        console.warn('Usuário não encontrado:', userId)
        return
      }

      const userData = userDoc.data()
      const currentTotal = userData.paymentHistory?.totalSpent || 0

      await updateDoc(userRef, {
        'paymentHistory.totalSpent': currentTotal + amount,
        'paymentHistory.lastPaymentDate': new Date(),
        'paymentHistory.lastPaymentAmount': amount,
        updatedAt: new Date(),
      })

      console.log('✅ Histórico de pagamentos atualizado:', userId)
    } catch (error) {
      console.error('❌ Erro ao atualizar histórico de pagamentos:', error)
    }
  }

  /**
   * Atualizar status do pagamento
   */
  async updatePaymentStatus(
    paymentIntentId: string,
    status: 'pending' | 'succeeded' | 'failed' | 'refunded'
  ): Promise<boolean> {
    try {
      // Buscar pagamento pelo stripePaymentIntentId
      // Por simplicidade, vamos usar o paymentIntentId como ID do documento
      const paymentRef = doc(this.db, 'payments', paymentIntentId)
      
      await updateDoc(paymentRef, {
        status,
        updatedAt: new Date(),
      })

      console.log('✅ Status do pagamento atualizado:', paymentIntentId, status)
      return true
    } catch (error) {
      console.error('❌ Erro ao atualizar status do pagamento:', error)
      return false
    }
  }

  /**
   * Obter pagamento por ID
   */
  async getPayment(paymentId: string): Promise<Payment | null> {
    try {
      const paymentRef = doc(this.db, 'payments', paymentId)
      const paymentDoc = await getDoc(paymentRef)

      if (!paymentDoc.exists()) {
        return null
      }

      return paymentDoc.data() as Payment
    } catch (error) {
      console.error('❌ Erro ao buscar pagamento:', error)
      return null
    }
  }
}

