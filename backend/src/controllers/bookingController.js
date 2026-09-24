// src/controllers/bookingController.js
const bookingService = require('../services/bookingService')
const firebaseService = require('../services/firebaseService')
const { sendSuccess, sendError } = require('../utils/response')

const bookingController = {
  /**
   * Customer creates a new booking with upfront ₹99 advance fee (9900 paise)
   */
  async createBooking(req, res, next) {
    try {
      const customerId = req.user?.uid || req.body.customerId
      if (!customerId) {
        return sendError(res, 'Authentication required: customer ID is missing.', 401)
      }
      const customerName = req.user?.name || req.body.customerName || 'Customer'
      const customerPhone = req.user?.phone || req.body.customerPhone || ''

      const booking = await bookingService.createBooking({
        customerId,
        customerName,
        customerPhone,
        service: req.body.service,
        location: req.body.location,
        landmark: req.body.landmark,
        bookingMode: req.body.bookingMode || 'realtime',
        scheduledDate: req.body.scheduledDate,
        scheduledTime: req.body.scheduledTime,
        workerId: req.body.workerId,
        workerName: req.body.workerName,
        workerPhone: req.body.workerPhone
      })

      return sendSuccess(res, booking, 'Booking created successfully with ₹99 advance fee', 201)
    } catch (err) {
      return sendError(res, err.message, 400)
    }
  },

  /**
   * Get single booking by ID
   */
  async getBooking(req, res, next) {
    try {
      const booking = await bookingService.getBooking(req.params.id)
      if (!booking) return sendError(res, 'Booking not found', 404)
      return sendSuccess(res, booking)
    } catch (err) {
      return sendError(res, err.message, 500)
    }
  },

  /**
   * List bookings for current user (customer or worker)
   */
  async getMyBookings(req, res, next) {
    try {
      const userId = req.user?.uid || req.query.userId
      const isWorker = req.user?.role === 'worker' || req.query.role === 'worker'
      const filterField = isWorker ? 'workerId' : 'customerId'

      const filter = userId ? { [filterField]: userId } : {}
      const bookings = await firebaseService.queryCollection('bookings', filter)
      return sendSuccess(res, bookings)
    } catch (err) {
      return sendError(res, err.message, 500)
    }
  },

  /**
   * Worker/Customer updates booking lifecycle stage
   */
  async updateStage(req, res, next) {
    try {
      const { stage, note } = req.body
      const updated = await bookingService.updateStage(req.params.id, stage, { note })
      return sendSuccess(res, updated, `Booking stage advanced to ${stage}`)
    } catch (err) {
      return sendError(res, err.message, 400)
    }
  },

  /**
   * Cancel booking & trigger 4-tier refund policy
   */
  async cancelBooking(req, res, next) {
    try {
      const { reason } = req.body
      const cancelledBy = req.user?.role || req.body.cancelledBy || 'customer'
      const result = await bookingService.cancelBooking(req.params.id, cancelledBy, reason)
      return sendSuccess(res, result, 'Booking cancelled. Refund processed as per 4-tier policy.')
    } catch (err) {
      return sendError(res, err.message, 400)
    }
  },

  /**
   * Complete booking via 4-digit verification OTP
   */
  async completeWithOtp(req, res, next) {
    try {
      const { otp } = req.body
      const completed = await bookingService.completeBookingWithOtp(req.params.id, otp)
      return sendSuccess(res, completed, 'Booking verified and completed successfully')
    } catch (err) {
      return sendError(res, err.message, 400)
    }
  }
}

module.exports = bookingController
