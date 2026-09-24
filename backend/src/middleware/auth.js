// src/middleware/auth.js
const jwt = require('jsonwebtoken')
const env = require('../config/env')
const { auth: firebaseAuth, isFirebaseInitialized } = require('../config/firebase')
const { sendError } = require('../utils/response')

/**
 * Authentication Middleware
 * Validates either Firebase ID Token or fallback JWT
 */
async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'Authentication required. Bearer token missing.', 401)
    }

    const token = authHeader.split(' ')[1]

    if (!token) {
      return sendError(res, 'Invalid token format.', 401)
    }

    // 1. Try Firebase Admin token verification if available
    if (isFirebaseInitialized && firebaseAuth) {
      try {
        const decodedFirebaseToken = await firebaseAuth.verifyIdToken(token)
        req.user = {
          uid: decodedFirebaseToken.uid,
          phone: decodedFirebaseToken.phone_number || '',
          email: decodedFirebaseToken.email || '',
          name: decodedFirebaseToken.name || '',
          role: decodedFirebaseToken.role || 'customer',
          isFirebase: true
        }
        return next()
      } catch (fbError) {
        // Fall through to JWT verification if Firebase verification fails (allows backend JWT sessions)
      }
    }

    // 2. Fallback to standard JWT verification
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET)
      req.user = {
        uid: decoded.uid || decoded.id,
        phone: decoded.phone || '',
        email: decoded.email || '',
        name: decoded.name || '',
        role: decoded.role || 'customer',
        isFirebase: false
      }
      return next()
    } catch (jwtError) {
      return sendError(res, 'Invalid or expired session token.', 401)
    }
  } catch (error) {
    return sendError(res, 'Authentication error: ' + error.message, 401)
  }
}

/**
 * Optional authentication middleware (populates req.user if token present, doesn't block if missing)
 */
async function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null
    return next()
  }

  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET)
    req.user = decoded
  } catch {
    req.user = null
  }
  return next()
}

module.exports = {
  authenticate,
  optionalAuth
}
