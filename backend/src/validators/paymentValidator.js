// src/validators/paymentValidator.js

function validateInitiatePayment(req) {
  const errors = {}
  const { bookingId, amount, paymentMethod } = req.body

  if (!bookingId) {
    errors.bookingId = 'Booking ID is required'
  }

  if (amount !== undefined && (isNaN(amount) || Number(amount) <= 0)) {
    errors.amount = 'Valid payment amount is required'
  }

  const validMethods = ['UPI', 'Wallet', 'Card', 'NetBanking', 'Cash']
  if (!paymentMethod || !validMethods.includes(paymentMethod)) {
    errors.paymentMethod = `Payment method must be one of: ${validMethods.join(', ')}`
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

function validateWithdrawalRequest(req) {
  const errors = {}
  const { amount, bankDetails } = req.body

  if (!amount || isNaN(amount) || Number(amount) < 100) {
    errors.amount = 'Minimum withdrawal amount is ₹100'
  }

  if (!bankDetails || (!bankDetails.accountNumber && !bankDetails.upiId)) {
    errors.bankDetails = 'Bank account number or UPI ID is required for payout'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

module.exports = {
  validateInitiatePayment,
  validateWithdrawalRequest
}
