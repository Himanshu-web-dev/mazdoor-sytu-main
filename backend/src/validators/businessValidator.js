// src/validators/businessValidator.js

function validateBusinessProfile(req) {
  const errors = {}
  const { companyName, gstNo, contactPerson, email } = req.body

  if (!companyName || String(companyName).trim().length < 2) {
    errors.companyName = 'Company / Enterprise name is required'
  }

  if (gstNo && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gstNo)) {
    errors.gstNo = 'Invalid 15-character GSTIN format'
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Please provide a valid company email address'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

module.exports = {
  validateBusinessProfile
}
