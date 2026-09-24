// src/validators/authValidator.js

function validateLogin(req) {
  const errors = {}
  const { phone, email, password, otp } = req.body

  if (!phone && !email) {
    errors.identifier = 'Please provide either mobile phone number or email address'
  } else if (phone && !/^[6-9]\d{9}$/.test(String(phone).replace(/\+91|\s|-/g, ''))) {
    errors.phone = 'Please enter a valid 10-digit Indian phone number'
  }

  if (!password && !otp) {
    errors.authMethod = 'Either password or OTP must be provided'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

function validateSignup(req) {
  const errors = {}
  const { phone, email, name, role } = req.body

  if (!phone && !email) {
    errors.identifier = 'Mobile phone number or email address is required'
  } else if (phone && !/^[6-9]\d{9}$/.test(String(phone).replace(/\+91|\s|-/g, ''))) {
    errors.phone = 'Please enter a valid 10-digit Indian mobile number'
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Please enter a valid email address'
  }

  if (!name || String(name).trim().length < 2) {
    errors.name = 'Full name must be at least 2 characters long'
  }

  const validRoles = ['customer', 'worker', 'business']
  if (!role || !validRoles.includes(role.toLowerCase())) {
    errors.role = 'Role must be one of: customer, worker, business'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

module.exports = {
  validateLogin,
  validateSignup
}
