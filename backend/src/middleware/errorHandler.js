// src/middleware/errorHandler.js
const logger = require('../utils/logger')

/**
 * 404 Not Found Middleware
 */
function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    message: `Resource not found: ${req.method} ${req.originalUrl}`,
    timestamp: new Date().toISOString()
  })
}

/**
 * Global Error Handling Middleware
 */
function globalErrorHandler(err, req, res, next) {
  logger.error(`Unhandled Error [${req.method} ${req.originalUrl}]: ${err.message}`, {
    stack: err.stack
  })

  const statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500)
  const isProduction = process.env.NODE_ENV === 'production'

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(isProduction ? {} : { stack: err.stack }),
    timestamp: new Date().toISOString()
  })
}

module.exports = {
  notFoundHandler,
  globalErrorHandler
}
