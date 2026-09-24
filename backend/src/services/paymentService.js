// src/services/paymentService.js
const firebaseService = require('./firebaseService')
const { generateId } = require('../utils/generateId')
const { PAYMENT_TYPES } = require('../utils/constants')
const { rupeesToPaise, paiseToRupees } = require('../utils/helpers')
const commissionService = require('./commissionService')
const walletService = require('./walletService')

const paymentService = {
  /**
   * Process customer final booking payment
   * Consolidates financial record directly into canonical 'payments' collection
   */
  async processPayment({ bookingId, customerId, amount, paymentMethod = 'UPI', transactionRef = '' }) {
    const booking = await firebaseService.getDocument('bookings', bookingId)
    if (!booking) {
      throw new Error(`Booking #${bookingId} not found`)
    }

    const payId = generateId('PAY')
    const now = new Date().toISOString()

    const labourChargePaise = booking.pricing?.labourChargePaise || rupeesToPaise(booking.pricing?.labourCharge || amount)
    const materialCostPaise = booking.pricing?.materialCostPaise || rupeesToPaise(booking.pricing?.materialCost || 0)
    const advancePaidPaise = booking.advancePaidPaise || rupeesToPaise(booking.advancePaid || 99)

    const fare = commissionService.calculateFarePaise({
      labourPaise: labourChargePaise,
      materialPaise: materialCostPaise,
      advancePaise: advancePaidPaise
    })

    const finalAmountRupees = Number(amount) || fare.customerBalancePayable
    const finalAmountPaise = rupeesToPaise(finalAmountRupees)

    const paymentRecord = {
      id: payId,
      bookingId,
      customerId: customerId || booking.customerId,
      workerId: booking.workerId || null,
      paymentType: PAYMENT_TYPES.FINAL_PAYMENT,
      amountPaise: finalAmountPaise,
      amount: finalAmountRupees,
      paymentMethod,
      transactionRef: transactionRef || `TXN-${Date.now()}`,
      status: 'completed',
      fareBreakdownPaise: {
        grossLabourPaise: fare.grossLabourPaise,
        advanceAdjustedPaise: fare.advanceAdjustedPaise,
        materialCostPaise: fare.materialCostPaise,
        platformCommissionPaise: fare.platformCommissionPaise,
        workerPayoutPaise: fare.workerTotalPayoutPaise
      },
      fareBreakdown: fare,
      invoiceNumber: `INV-${bookingId}-${new Date().getFullYear()}`,
      createdAt: now,
      updatedAt: now
    }

    // Save strictly to canonical 'payments' collection
    await firebaseService.setDocument('payments', payId, paymentRecord)

    // Credit net earnings to worker's wallet
    if (booking.workerId) {
      await walletService.creditWorkerEarnings(
        booking.workerId,
        fare.workerTotalPayout,
        `Net payout for booking #${bookingId} (Labour ₹${fare.workerNetLabour} + Material ₹${fare.materialCost} after ₹${fare.advanceAdjusted} advance adjustment)`
      )
    }

    // Update booking payment status
    await firebaseService.setDocument('bookings', bookingId, {
      paymentStatus: 'paid',
      paymentMethod,
      finalPaymentId: payId,
      paidAt: now
    }, true)

    return paymentRecord
  },

  /**
   * Get payment details
   */
  async getPayment(payId) {
    return firebaseService.getDocument('payments', payId)
  },

  async getTransaction(payId) {
    return this.getPayment(payId)
  }
}

module.exports = paymentService
