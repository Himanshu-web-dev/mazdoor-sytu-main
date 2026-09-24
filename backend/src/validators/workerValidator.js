// src/validators/workerValidator.js

function validateWorkerProfile(req) {
  const errors = {}
  const { name, trade, hourlyRate, experience } = req.body

  if (name && String(name).trim().length < 2) {
    errors.name = 'Name must be at least 2 characters long'
  }

  if (trade && String(trade).trim().length === 0) {
    errors.trade = 'Trade skill category is required'
  }

  if (hourlyRate !== undefined && (isNaN(hourlyRate) || Number(hourlyRate) < 0)) {
    errors.hourlyRate = 'Hourly rate must be a positive number'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

function validateAvailability(req) {
  const errors = {}
  const { availability } = req.body

  const allowed = ['available', 'busy', 'offline']
  if (!availability || !allowed.includes(availability.toLowerCase())) {
    errors.availability = 'Availability must be: available, busy, or offline'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

module.exports = {
  validateWorkerProfile,
  validateAvailability
}
