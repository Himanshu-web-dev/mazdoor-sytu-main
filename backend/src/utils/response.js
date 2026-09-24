// src/utils/response.js

/**
 * Send standard success response
 * @param {object} res Express response object
 * @param {*} data Payload to send
 * @param {string} message Optional success message
 * @param {number} statusCode HTTP status code (default: 200)
 */
function sendSuccess(res, data = null, message = 'Success', statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  })
}

/**
 * Send standard error response
 * @param {object} res Express response object
 * @param {string} message Error message
 * @param {number} statusCode HTTP status code (default: 400)
 * @param {object|null} errors Additional validation/error details
 */
function sendError(res, message = 'An error occurred', statusCode = 400, errors = null) {
  const response = {
    success: false,
    message,
    timestamp: new Date().toISOString()
  }

  if (errors) {
    response.errors = errors
  }

  return res.status(statusCode).json(response)
}

/**
 * Send paginated success response
 */
function sendPaginated(res, items, page = 1, limit = 10, total = 0, message = 'Data fetched successfully') {
  return res.status(200).json({
    success: true,
    message,
    data: items,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total: Number(total),
      totalPages: Math.ceil(total / limit) || 1
    },
    timestamp: new Date().toISOString()
  })
}

module.exports = {
  sendSuccess,
  sendError,
  sendPaginated
}
