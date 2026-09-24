// src/services/bookingService.js
const firebaseService = require('./firebaseService')
const { generateId, generateOtp } = require('../utils/generateId')
const { BOOKING_STATUS, FINANCIAL_RULES, PAYMENT_TYPES } = require('../utils/constants')
const { rupeesToPaise, paiseToRupees } = require('../utils/helpers')
const refundService = require('./refundService')

const bookingService = {
  /**
   * Create new doorstep service booking with upfront ₹99 advance fee (9900 paise)
   */
  async createBooking({
    customerId,
    customerName,
    customerPhone,
    service,
    location,
    landmark = '',
    bookingMode = 'realtime',
    scheduledDate = null,
    scheduledTime = null,
    workerId = null,
    workerName = '',
    workerPhone = ''
  }) {
    const bookingId = generateId('BOOKING')
    const otp = generateOtp()
    const now = new Date().toISOString()
    const advanceFeePaise = FINANCIAL_RULES.BOOKING_ADVANCE_FEE_PAISE
    const advanceFeeRupees = FINANCIAL_RULES.BOOKING_ADVANCE_FEE

    const initialStatus = workerId ? BOOKING_STATUS.CONFIRMED : BOOKING_STATUS.PENDING

    const booking = {
      id: bookingId,
      customerId,
      customerName,
      customerPhone,
      service,
      location,
      landmark,
      bookingMode, // 'realtime' or 'scheduled'
      scheduledDate,
      scheduledTime,
      workerId: workerId || null,
      workerName: workerName || '',
      workerPhone: workerPhone || '',
      status: initialStatus,
      otp, // 4-digit completion code
      advancePaidPaise: advanceFeePaise,
      advancePaid: advanceFeeRupees,
      advanceStatus: 'paid',
      pricing: {
        advancePaidPaise: advanceFeePaise,
        advancePaid: advanceFeeRupees,
        labourChargePaise: 0,
        labourCharge: 0,
        labourAdjustedPaise: 0,
        labourAdjusted: 0,
        materialCostPaise: 0,
        materialCost: 0,
        platformCommissionPaise: 0,
        platformCommission: 0,
        totalPayablePaise: 0,
        totalPayable: 0
      },
      timeline: [
        {
          stage: 'Booking Created',
          timestamp: now,
          note: `₹${advanceFeeRupees} advance booking fee paid online`
        }
      ],
      createdAt: now,
      updatedAt: now
    }

    await firebaseService.setDocument('bookings', bookingId, booking)

    // Record initial advance payment record in payments collection
    const advancePaymentId = generateId('PAY')
    await firebaseService.setDocument('payments', advancePaymentId, {
      id: advancePaymentId,
      bookingId,
      customerId,
      workerId: workerId || null,
      paymentType: PAYMENT_TYPES.BOOKING_ADVANCE,
      amountPaise: advanceFeePaise,
      amount: advanceFeeRupees,
      paymentMethod: 'UPI',
      transactionRef: `ADV-${Date.now()}`,
      status: 'completed',
      createdAt: now
    })

    return booking
  },

  /**
   * Get single booking details
   */
  async getBooking(bookingId) {
    return firebaseService.getDocument('bookings', bookingId)
  },

  /**
   * Update booking lifecycle stage (9 standardized stages)
   */
  async updateStage(bookingId, nextStage, metadata = {}) {
    const booking = await this.getBooking(bookingId)
    if (!booking) {
      throw new Error(`Booking #${bookingId} not found`)
    }

    const validStatuses = Object.values(BOOKING_STATUS)
    if (!validStatuses.includes(nextStage)) {
      throw new Error(`Invalid booking status: ${nextStage}. Must be one of: ${validStatuses.join(', ')}`)
    }

    const now = new Date().toISOString()
    const updatedTimeline = [
      ...(booking.timeline || []),
      {
        stage: nextStage,
        timestamp: now,
        note: metadata.note || `Status transitioned to ${nextStage}`
      }
    ]

    const updatePayload = {
      status: nextStage,
      timeline: updatedTimeline,
      updatedAt: now,
      ...metadata
    }

    return firebaseService.setDocument('bookings', bookingId, updatePayload, true)
  },

  /**
   * Cancel booking & process 4-tier refund policy
   */
  async cancelBooking(bookingId, cancelledBy = 'customer', reason = '') {
    const booking = await this.getBooking(bookingId)
    if (!booking) {
      throw new Error(`Booking #${bookingId} not found`)
    }

    const refundDetails = refundService.calculateRefund(
      booking.status,
      booking.advancePaidPaise || FINANCIAL_RULES.BOOKING_ADVANCE_FEE_PAISE
    )

    const now = new Date().toISOString()

    // If eligible for refund, create refund entry in payments collection
    if (refundDetails.refundAmountPaise > 0) {
      const refundPayId = generateId('PAY')
      await firebaseService.setDocument('payments', refundPayId, {
        id: refundPayId,
        bookingId,
        customerId: booking.customerId,
        workerId: booking.workerId || null,
        paymentType: PAYMENT_TYPES.REFUND,
        amountPaise: refundDetails.refundAmountPaise,
        amount: refundDetails.refundAmount,
        paymentMethod: 'UPI',
        transactionRef: `REF-${Date.now()}`,
        status: 'completed',
        refundStage: refundDetails.stage,
        createdAt: now
      })
    }

    const updatedBooking = await this.updateStage(bookingId, BOOKING_STATUS.CANCELLED, {
      cancelledBy,
      cancellationReason: reason,
      refundDetails,
      cancelledAt: now
    })

    return { booking: updatedBooking, refundDetails }
  },

  /**
   * Verify completion OTP and finalize booking
   */
  async completeBookingWithOtp(bookingId, submittedOtp) {
    const booking = await this.getBooking(bookingId)
    if (!booking) {
      throw new Error(`Booking #${bookingId} not found`)
    }

    if (String(booking.otp).trim() !== String(submittedOtp).trim()) {
      throw new Error('Invalid 4-digit verification OTP.')
    }

    return this.updateStage(bookingId, BOOKING_STATUS.COMPLETED, {
      completedAt: new Date().toISOString()
    })
  }
}

module.exports = bookingService
