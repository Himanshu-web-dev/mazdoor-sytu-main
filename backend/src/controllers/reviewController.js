// src/controllers/reviewController.js
const firebaseService = require('../services/firebaseService')
const workerService = require('../services/workerService')
const { generateId } = require('../utils/generateId')
const { BOOKING_STATUS } = require('../utils/constants')
const { sendSuccess, sendError } = require('../utils/response')

const reviewController = {
  /**
   * Submit review for a completed service
   * Strictly permitted ONLY for completed bookings
   */
  async createReview(req, res, next) {
    try {
      const authorId = req.user?.uid || req.body.authorId
      const authorName = req.user?.name || req.body.authorName || 'Customer'
      const { bookingId, workerId, rating, comment } = req.body

      if (!bookingId) {
        return sendError(res, 'Booking ID is required to submit a review', 400)
      }

      // Verify booking exists and status is COMPLETED
      const booking = await firebaseService.getDocument('bookings', bookingId)
      if (!booking) {
        return sendError(res, `Booking #${bookingId} not found`, 404)
      }

      if (booking.status !== BOOKING_STATUS.COMPLETED) {
        return sendError(
          res,
          `Reviews are strictly allowed only for completed bookings. Current status: '${booking.status}'`,
          400
        )
      }

      const reviewId = generateId('REV')
      const targetWorkerId = workerId || booking.workerId

      const review = {
        id: reviewId,
        bookingId,
        authorId,
        authorName,
        workerId: targetWorkerId,
        rating: Math.min(5, Math.max(1, Number(rating) || 5)),
        comment: (comment || '').trim(),
        flagged: false,
        status: 'Approved',
        createdAt: new Date().toISOString()
      }

      await firebaseService.setDocument('reviews', reviewId, review)

      // Update worker rating aggregate
      if (targetWorkerId) {
        await workerService.updateWorkerRating(targetWorkerId, review.rating)
      }

      return sendSuccess(res, review, 'Thank you for your valuable feedback!', 201)
    } catch (err) {
      return sendError(res, err.message, 500)
    }
  },

  /**
   * Get reviews for a worker
   */
  async getWorkerReviews(req, res, next) {
    try {
      const { workerId } = req.params
      const reviews = await firebaseService.queryCollection('reviews', { workerId })
      return sendSuccess(res, reviews)
    } catch (err) {
      return sendError(res, err.message, 500)
    }
  }
}

module.exports = reviewController
