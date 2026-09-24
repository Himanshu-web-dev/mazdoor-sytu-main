// src/middleware/rateLimiter.js
const { sendError } = require('../utils/response')

// In-memory rate limiting bucket
const requestCounts = new Map()

/**
 * Lightweight in-memory rate limiter
 * @param {number} windowMs Time window in milliseconds (default: 15 min)
 * @param {number} maxRequests Maximum requests per IP in the window (default: 100)
 */
function rateLimiter({ windowMs = 15 * 60 * 1000, maxRequests = 100, message = 'Too many requests' } = {}) {
  // Cleanup expired windows every 5 minutes
  setInterval(() => {
    const now = Date.now()
    for (const [key, record] of requestCounts.entries()) {
      if (now - record.startTime > windowMs) {
        requestCounts.delete(key)
      }
    }
  }, 5 * 60 * 1000)

  return (req, res, next) => {
    const clientIp = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown'
    const now = Date.now()

    let record = requestCounts.get(clientIp)

    if (!record || now - record.startTime > windowMs) {
      record = { count: 1, startTime: now }
      requestCounts.set(clientIp, record)
      return next()
    }

    record.count += 1

    if (record.count > maxRequests) {
      return sendError(res, message, 429)
    }

    next()
  }
}

// Pre-configured rate limiters
const standardLimiter = rateLimiter({ windowMs: 15 * 60 * 1000, maxRequests: 200 })
const authLimiter = rateLimiter({ windowMs: 10 * 60 * 1000, maxRequests: 25, message: 'Too many login attempts. Please try again after 10 minutes.' })
const otpLimiter = rateLimiter({ windowMs: 5 * 60 * 1000, maxRequests: 5, message: 'Too many OTP requests. Please wait a few minutes.' })

module.exports = {
  rateLimiter,
  standardLimiter,
  authLimiter,
  otpLimiter
}
