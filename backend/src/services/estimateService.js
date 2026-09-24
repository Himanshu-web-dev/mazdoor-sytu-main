// src/services/estimateService.js
const firebaseService = require('./firebaseService')
const { generateId } = require('../utils/generateId')
const { BOOKING_STATUS } = require('../utils/constants')
const commissionService = require('./commissionService')
const { rupeesToPaise, paiseToRupees } = require('../utils/helpers')

const estimateService = {
  /**
   * Worker adds on-site diagnosis and material quotation
   * Transitions booking to 'estimate_pending'
   */
  async createEstimate({ bookingId, workerId, labourRate, materials = [], notes = '' }) {
    const estimateId = generateId('ESTIMATE')
    const now = new Date().toISOString()

    const booking = await firebaseService.getDocument('bookings', bookingId)
    if (!booking) {
      throw new Error(`Booking #${bookingId} not found`)
    }

    const labourPaise = labourRate > 5000 ? Math.round(Number(labourRate)) : rupeesToPaise(labourRate)

    // Calculate total materials cost
    const materialCostPaise = materials.reduce((acc, item) => {
      const itemCost = Number(item.cost) || 0
      const itemPaise = itemCost > 5000 ? itemCost : rupeesToPaise(itemCost)
      return acc + itemPaise
    }, 0)

    // Check if labourRate is out of standard price range for this service
    let isOutOfPriceRange = false
    let rateCard = null
    if (booking.service) {
      const services = await firebaseService.queryCollection('services', { title: booking.service }, 1)
      if (services.length > 0) {
        rateCard = services[0]
        const minRate = rateCard.minLabourRatePaise || rupeesToPaise(rateCard.minRate || 199)
        const maxRate = rateCard.maxLabourRatePaise || rupeesToPaise(rateCard.maxRate || 2500)
        if (labourPaise < minRate || labourPaise > maxRate) {
          isOutOfPriceRange = true
        }
      }
    }

    // Compute fair price breakdown in integer paise
    const fare = commissionService.calculateFarePaise({
      labourPaise,
      materialPaise: materialCostPaise,
      advancePaise: booking.advancePaidPaise || 9900
    })

    const estimate = {
      id: estimateId,
      bookingId,
      workerId: workerId || booking.workerId,
      labourRatePaise: labourPaise,
      labourRate: paiseToRupees(labourPaise),
      labourChargePaise: labourPaise,
      labourCharge: paiseToRupees(labourPaise),
      materialCostPaise,
      materialCost: paiseToRupees(materialCostPaise),
      materials,
      notes,
      isOutOfPriceRange,
      requiresCustomerConsent: isOutOfPriceRange,
      status: 'pending_customer_approval',
      fareBreakdown: fare,
      createdAt: now,
      updatedAt: now
    }

    await firebaseService.setDocument('estimates', estimateId, estimate)

    // Transition booking stage to 'estimate_pending'
    const updatedTimeline = [
      ...(booking.timeline || []),
      {
        stage: BOOKING_STATUS.ESTIMATE_PENDING,
        timestamp: now,
        note: `Worker submitted estimate: Labour ₹${fare.grossLabour} + Material ₹${fare.materialCost}${isOutOfPriceRange ? ' (Custom quote outside standard card)' : ''}`
      }
    ]

    await firebaseService.setDocument('bookings', bookingId, {
      status: BOOKING_STATUS.ESTIMATE_PENDING,
      currentEstimateId: estimateId,
      pricing: {
        advancePaidPaise: fare.advanceAdjustedPaise,
        advancePaid: fare.advanceAdjusted,
        labourChargePaise: fare.grossLabourPaise,
        labourCharge: fare.grossLabour,
        labourAdjustedPaise: fare.labourAdjustedPaise,
        labourAdjusted: fare.labourAdjusted,
        materialCostPaise: fare.materialCostPaise,
        materialCost: fare.materialCost,
        platformCommissionPaise: fare.platformCommissionPaise,
        platformCommission: fare.platformCommission,
        totalPayablePaise: fare.customerBalancePayablePaise,
        totalPayable: fare.customerBalancePayable
      },
      timeline: updatedTimeline,
      updatedAt: now
    }, true)

    return estimate
  },

  /**
   * Customer approves or rejects the on-site estimate
   * On approval, transitions booking to 'work_started'
   */
  async updateApproval(estimateId, isApproved) {
    const estimate = await firebaseService.getDocument('estimates', estimateId)
    if (!estimate) {
      throw new Error(`Estimate #${estimateId} not found`)
    }

    const now = new Date().toISOString()
    const newStatus = isApproved ? 'approved' : 'rejected'

    const updated = await firebaseService.setDocument('estimates', estimateId, {
      status: newStatus,
      approvedAt: now,
      updatedAt: now
    }, true)

    if (estimate.bookingId) {
      const booking = await firebaseService.getDocument('bookings', estimate.bookingId)
      if (booking) {
        if (isApproved) {
          // Transition to work_started
          const updatedTimeline = [
            ...(booking.timeline || []),
            {
              stage: BOOKING_STATUS.WORK_STARTED,
              timestamp: now,
              note: 'Customer approved estimate. Worker started physical work on site.'
            }
          ]
          await firebaseService.setDocument('bookings', estimate.bookingId, {
            status: BOOKING_STATUS.WORK_STARTED,
            estimateApproved: true,
            timeline: updatedTimeline,
            updatedAt: now
          }, true)
        } else {
          // Rejected estimate
          const updatedTimeline = [
            ...(booking.timeline || []),
            {
              stage: 'Estimate Rejected',
              timestamp: now,
              note: 'Customer declined the proposed quotation.'
            }
          ]
          await firebaseService.setDocument('bookings', estimate.bookingId, {
            estimateApproved: false,
            timeline: updatedTimeline,
            updatedAt: now
          }, true)
        }
      }
    }

    return updated
  },

  /**
   * Get estimate by booking ID
   */
  async getByBookingId(bookingId) {
    const estimates = await firebaseService.queryCollection('estimates', { bookingId }, 1)
    return estimates[0] || null
  }
}

module.exports = estimateService
