// src/services/refundService.js
const { REFUND_TIERS, BOOKING_STATUS, FINANCIAL_RULES } = require('../utils/constants')
const { paiseToRupees, rupeesToPaise } = require('../utils/helpers')

const refundService = {
  /**
   * Determine refund percentage and amount based on booking stage at cancellation
   * Handles 9 canonical booking statuses with exact integer paise.
   *
   * @param {string} bookingStatus Current booking status
   * @param {number} paidAmountPaiseOrRupees Total advance amount eligible for refund
   * @returns {object} Full refund breakdown
   */
  calculateRefund(bookingStatus, paidAmount = FINANCIAL_RULES.BOOKING_ADVANCE_FEE_PAISE) {
    // Standardize input to paise: if < 500, treat as Rupees, otherwise paise
    const totalPaidPaise = paidAmount < 500 ? rupeesToPaise(paidAmount) : Math.round(Number(paidAmount) || FINANCIAL_RULES.BOOKING_ADVANCE_FEE_PAISE)
    let tier = REFUND_TIERS.STAGE_1_BEFORE_ACCEPTANCE

    switch (bookingStatus) {
      case BOOKING_STATUS.PENDING:
        tier = REFUND_TIERS.STAGE_1_BEFORE_ACCEPTANCE
        break

      case BOOKING_STATUS.CONFIRMED:
        tier = REFUND_TIERS.STAGE_2_AFTER_ACCEPTANCE
        break

      case BOOKING_STATUS.ON_THE_WAY:
        tier = REFUND_TIERS.STAGE_3_WORKER_ON_THE_WAY
        break

      case BOOKING_STATUS.ARRIVED:
      case BOOKING_STATUS.ESTIMATE_PENDING:
      case BOOKING_STATUS.WORK_STARTED:
      case BOOKING_STATUS.COMPLETED:
        tier = REFUND_TIERS.STAGE_4_WORKER_ARRIVED
        break

      default:
        tier = REFUND_TIERS.STAGE_1_BEFORE_ACCEPTANCE
    }

    const refundPercentage = tier.refundPercentage
    const refundAmountPaise = Math.round((totalPaidPaise * refundPercentage) / 100)
    const retainedAmountPaise = totalPaidPaise - refundAmountPaise

    return {
      stage: tier.stage,
      tierName: tier.name,
      refundPercentage,
      totalPaidPaise,
      refundAmountPaise,
      retainedAmountPaise,
      totalPaid: paiseToRupees(totalPaidPaise),
      refundAmount: paiseToRupees(refundAmountPaise),
      retainedAmount: paiseToRupees(retainedAmountPaise),
      policyNote: tier.description,
      processedAt: new Date().toISOString()
    }
  }
}

module.exports = refundService
