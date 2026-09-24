// src/middleware/validation.js
const { sendError } = require('../utils/response')

/**
 * Higher-order middleware to run a validator function
 * @param {Function} validatorFn Function that takes (req.body, req.query, req.params) and returns { isValid, errors }
 */
function validate(validatorFn) {
  return (req, res, next) => {
    if (typeof validatorFn !== 'function') {
      return next()
    }

    const { isValid, errors } = validatorFn(req)

    if (!isValid) {
      return sendError(res, 'Request validation failed', 422, errors)
    }

    next()
  }
}

module.exports = {
  validate
}
