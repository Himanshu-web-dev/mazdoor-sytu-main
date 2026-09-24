// src/controllers/paymentController.js
const paymentService = require('../services/paymentService')
const { sendSuccess, sendError } = require('../utils/response')

const paymentController = {
  /**
   * Process customer final invoice payment
   */
  async processPayment(req, res, next) {
    try {
      const customerId = req.user?.uid || req.body.customerId
      const { bookingId, amount, paymentMethod, transactionRef } = req.body

      const transaction = await paymentService.processPayment({
        bookingId,
        customerId,
        amount,
        paymentMethod,
        transactionRef
      })

      return sendSuccess(res, transaction, 'Payment successful. Invoice generated.')
    } catch (err) {
      return sendError(res, err.message, 400)
    }
  },

  /**
   * Get transaction details / invoice
   */
  async getTransaction(req, res, next) {
    try {
      const transaction = await paymentService.getTransaction(req.params.id)
      if (!transaction) return sendError(res, 'Transaction not found', 404)
      return sendSuccess(res, transaction)
    } catch (err) {
      return sendError(res, err.message, 500)
    }
  }
}

module.exports = paymentController
