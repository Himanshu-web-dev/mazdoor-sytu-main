// src/validators/jobValidator.js

function validateJobPosting(req) {
  const errors = {}
  const { title, trade, workersNeeded, dailyWage, location, startDate } = req.body

  if (!title || String(title).trim().length < 4) {
    errors.title = 'Job title must be at least 4 characters'
  }

  if (!trade || String(trade).trim().length === 0) {
    errors.trade = 'Required trade skill is mandatory'
  }

  if (!workersNeeded || isNaN(workersNeeded) || Number(workersNeeded) < 1) {
    errors.workersNeeded = 'Workers needed must be at least 1'
  }

  if (!dailyWage || isNaN(dailyWage) || Number(dailyWage) < 100) {
    errors.dailyWage = 'Daily wage must be specified and meet minimum floor rate (₹100)'
  }

  if (!location || String(location).trim().length === 0) {
    errors.location = 'Job location / project site is required'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

module.exports = {
  validateJobPosting
}
