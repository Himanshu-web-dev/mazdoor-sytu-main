// src/services/commissionService.js
const { FINANCIAL_RULES } = require('../utils/constants')
const { rupeesToPaise, paiseToRupees } = require('../utils/helpers')

const commissionService = {
  /**
   * Calculate transparent pricing and commission in exact Integer Paise (zero floating-point drift):
   * ₹99 booking advance (9900 paise) → labour price confirmed → ₹99 adjusted → material separately → 10% platform commission on labour.
   *
   * @param {number} labourPaise Confirmed labour charge in paise
   * @param {number} materialPaise Material cost in paise (default 0)
   * @param {number} advancePaise Upfront booking advance in paise (default 9900)
   * @returns {object} Full financial breakdown in paise and rupees
   */
  calculateFarePaise({
    labourPaise = 0,
    materialPaise = 0,
    advancePaise = FINANCIAL_RULES.BOOKING_ADVANCE_FEE_PAISE
  }) {
    const grossLabourPaise = Math.max(0, Math.round(Number(labourPaise) || 0))
    const grossMaterialPaise = Math.max(0, Math.round(Number(materialPaise) || 0))
    const advanceAdjustedPaise = Math.max(0, Math.round(Number(advancePaise) || FINANCIAL_RULES.BOOKING_ADVANCE_FEE_PAISE))

    // 1. ₹99 (9900 paise) Advance Adjusted against confirmed labour charge
    const labourAdjustedPaise = Math.max(0, grossLabourPaise - advanceAdjustedPaise)

    // 2. Net remaining payable by customer at doorstep
    const customerBalancePayablePaise = labourAdjustedPaise + grossMaterialPaise

    // 3. Platform commission: Strictly 10% on Labour only
    const commissionPercent = FINANCIAL_RULES.PLATFORM_COMMISSION_PERCENT_ON_LABOUR || 10
    const platformCommissionPaise = Math.round((grossLabourPaise * commissionPercent) / 100)

    // 4. Worker earnings: 90% Net Labour + 100% Material Reimbursement
    const workerNetLabourPaise = grossLabourPaise - platformCommissionPaise
    const workerTotalPayoutPaise = workerNetLabourPaise + grossMaterialPaise

    return {
      // Exact integer paise
      grossLabourPaise,
      advanceAdjustedPaise,
      labourAdjustedPaise,
      materialCostPaise: grossMaterialPaise,
      customerBalancePayablePaise,
      totalCustomerCostPaise: advanceAdjustedPaise + customerBalancePayablePaise,
      platformCommissionPaise,
      commissionPercent,
      workerNetLabourPaise,
      workerTotalPayoutPaise,

      // Convenience Rupee equivalents for display/invoices
      grossLabour: paiseToRupees(grossLabourPaise),
      advanceAdjusted: paiseToRupees(advanceAdjustedPaise),
      labourAdjusted: paiseToRupees(labourAdjustedPaise),
      materialCost: paiseToRupees(grossMaterialPaise),
      customerBalancePayable: paiseToRupees(customerBalancePayablePaise),
      totalCustomerCost: paiseToRupees(advanceAdjustedPaise + customerBalancePayablePaise),
      platformCommission: paiseToRupees(platformCommissionPaise),
      workerNetLabour: paiseToRupees(workerNetLabourPaise),
      workerTotalPayout: paiseToRupees(workerTotalPayoutPaise),

      ruleSummary: `₹${paiseToRupees(advanceAdjustedPaise)} advance adjusted + ₹${paiseToRupees(labourAdjustedPaise)} net labour + ₹${paiseToRupees(grossMaterialPaise)} material (10% commission of ₹${paiseToRupees(platformCommissionPaise)} on labour only)`
    }
  },

  /**
   * Helper accepting Rupee inputs and returning complete breakdown
   */
  calculateFare({
    labourCharge = 0,
    materialCost = 0,
    advancePaid = FINANCIAL_RULES.BOOKING_ADVANCE_FEE
  }) {
    return this.calculateFarePaise({
      labourPaise: rupeesToPaise(labourCharge),
      materialPaise: rupeesToPaise(materialCost),
      advancePaise: rupeesToPaise(advancePaid)
    })
  }
}

module.exports = commissionService
