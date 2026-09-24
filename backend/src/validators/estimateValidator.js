// src/validators/estimateValidator.js

function validateAddEstimate(req) {
  const errors = {}
  const { bookingId, labourRate, materials } = req.body

  if (!bookingId) {
    errors.bookingId = 'Booking ID is required'
  }

  if (labourRate === undefined || isNaN(labourRate) || Number(labourRate) < 0) {
    errors.labourRate = 'Confirmed labour rate must be a valid non-negative number'
  }

  if (materials && !Array.isArray(materials)) {
    errors.materials = 'Materials must be an array of items [{ name, cost }]'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

function validateApproveEstimate(req) {
  const errors = {}
  const { approved } = req.body

  if (approved === undefined || typeof approved !== 'boolean') {
    errors.approved = 'Approval status (boolean) is required'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

module.exports = {
  validateAddEstimate,
  validateApproveEstimate
}
