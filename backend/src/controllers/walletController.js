// src/controllers/walletController.js
const walletService = require('../services/walletService')
const { sendSuccess, sendError } = require('../utils/response')

const walletController = {
  /**
   * Get wallet balance and transactions
   */
  async getWallet(req, res, next) {
    try {
      const userId = req.user?.uid || req.params.userId || req.query.userId
      if (!userId) return sendError(res, 'User ID is required', 400)
      const wallet = await walletService.getWallet(userId)
      return sendSuccess(res, wallet)
    } catch (err) {
      return sendError(res, err.message, 500)
    }
  },

  /**
   * Request bank / UPI withdrawal
   */
  async requestWithdrawal(req, res, next) {
    try {
      const workerId = req.user?.uid || req.body.workerId
      if (!workerId) return sendError(res, 'Worker ID is required', 400)
      const { amount, bankDetails } = req.body

      const result = await walletService.requestWithdrawal(workerId, amount, bankDetails)
      return sendSuccess(res, result, `Withdrawal of ₹${amount} initiated successfully`)
    } catch (err) {
      return sendError(res, err.message, 400)
    }
  }
}

module.exports = walletController
