// src/validators/bookingValidator.js

function validateCreateBooking(req) {
  const errors = {}
  const { service, location, bookingMode } = req.body

  if (!service || String(service).trim().length === 0) {
    errors.service = 'Service skill or category is required'
  }

  if (!location || String(location).trim().length === 0) {
    errors.location = 'Doorstep service address is required'
  }

  const allowedModes = ['realtime', 'scheduled']
  if (bookingMode && !allowedModes.includes(bookingMode.toLowerCase())) {
    errors.bookingMode = 'Booking mode must be realtime (immediate) or scheduled'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

function validateCancelBooking(req) {
  const errors = {}
  const { reason } = req.body

  if (!reason || String(reason).trim().length < 3) {
    errors.reason = 'Cancellation reason is required'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

module.exports = {
  validateCreateBooking,
  validateCancelBooking
}
