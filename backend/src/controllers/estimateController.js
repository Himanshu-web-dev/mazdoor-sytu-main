// src/controllers/estimateController.js
const estimateService = require('../services/estimateService')
const { sendSuccess, sendError } = require('../utils/response')

const estimateController = {
  /**
   * Worker submits on-site diagnosis and material estimate
   */
  async createEstimate(req, res, next) {
    try {
      const workerId = req.user?.uid || req.body.workerId
      const { bookingId, labourRate, materials, notes } = req.body

      const estimate = await estimateService.createEstimate({
        bookingId,
        workerId,
        labourRate,
        materials,
        notes
      })

      return sendSuccess(res, estimate, 'On-site estimate created. Awaiting customer approval.', 201)
    } catch (err) {
      return sendError(res, err.message, 400)
    }
  },

  /**
   * Customer approves or rejects the on-site estimate
   */
  async handleApproval(req, res, next) {
    try {
      const { estimateId } = req.params
      const { approved } = req.body

      const updated = await estimateService.updateApproval(estimateId, Boolean(approved))
      const msg = approved ? 'Estimate approved by customer. Work started.' : 'Estimate rejected by customer.'
      return sendSuccess(res, updated, msg)
    } catch (err) {
      return sendError(res, err.message, 400)
    }
  },

  /**
   * Get estimate for a booking
   */
  async getByBooking(req, res, next) {
    try {
      const { bookingId } = req.params
      const estimate = await estimateService.getByBookingId(bookingId)
      if (!estimate) return sendError(res, 'No estimate found for this booking', 404)
      return sendSuccess(res, estimate)
    } catch (err) {
      return sendError(res, err.message, 500)
    }
  }
}

module.exports = estimateController
