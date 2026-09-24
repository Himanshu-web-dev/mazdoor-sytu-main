// src/utils/constants.js

const USER_ROLES = {
  CUSTOMER: 'customer',
  WORKER: 'worker',
  BUSINESS: 'business',
  ADMIN: 'admin'
}

const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  ON_THE_WAY: 'on_the_way',
  ARRIVED: 'arrived',
  ESTIMATE_PENDING: 'estimate_pending',
  WORK_STARTED: 'work_started',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  REJECTED: 'rejected'
}

const APPLICATION_STATUS = {
  APPLIED: 'applied',
  UNDER_REVIEW: 'under_review',
  SHORTLISTED: 'shortlisted',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  WITHDRAWN: 'withdrawn'
}

const JOB_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
}

const PAYMENT_TYPES = {
  BOOKING_ADVANCE: 'booking_advance',
  FINAL_PAYMENT: 'final_payment',
  REFUND: 'refund',
  WORKER_WITHDRAWAL: 'worker_withdrawal'
}

const REFUND_TIERS = {
  STAGE_1_BEFORE_ACCEPTANCE: {
    stage: 1,
    name: 'Before Worker Acceptance',
    refundPercentage: 100,
    description: 'Booking is pending acceptance. 100% full refund with zero deductions.'
  },
  STAGE_2_AFTER_ACCEPTANCE: {
    stage: 2,
    name: 'After Worker Acceptance',
    refundPercentage: 50,
    description: 'Worker confirmed booking but has not departed. 50% refund.'
  },
  STAGE_3_WORKER_ON_THE_WAY: {
    stage: 3,
    name: 'Worker On The Way',
    refundPercentage: 20,
    description: 'Worker in transit to customer doorstep. 20% refund.'
  },
  STAGE_4_WORKER_ARRIVED: {
    stage: 4,
    name: 'Worker Arrived / Work In Progress',
    refundPercentage: 0,
    description: 'Worker arrived on site, estimate presented, or work started. 0% refund.'
  }
}

const FINANCIAL_RULES = {
  BOOKING_ADVANCE_FEE_PAISE: 9900,
  BOOKING_ADVANCE_FEE: 99,
  PLATFORM_COMMISSION_PERCENT_ON_LABOUR: 10,
  PLATFORM_COMMISSION_PERCENT_ON_MATERIAL: 0
}

const TRADE_CATEGORIES = [
  'Electrician',
  'Plumber',
  'Carpenter',
  'Painter',
  'Mason',
  'Welder',
  'Appliance Tech',
  'Tile Layer',
  'Helper'
]

const PAYMENT_METHODS = {
  UPI: 'UPI',
  WALLET: 'Wallet',
  CARD: 'Card',
  NETBANKING: 'NetBanking',
  CASH: 'Cash'
}

module.exports = {
  USER_ROLES,
  BOOKING_STATUS,
  APPLICATION_STATUS,
  JOB_STATUS,
  PAYMENT_TYPES,
  REFUND_TIERS,
  FINANCIAL_RULES,
  TRADE_CATEGORIES,
  PAYMENT_METHODS
}
