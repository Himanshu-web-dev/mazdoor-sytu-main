// src/utils/generateId.js
const crypto = require('crypto')

const PREFIXES = {
  BOOKING: 'BK',
  WORKER: 'WRK',
  USER: 'USR',
  BUSINESS: 'BIZ',
  TRANSACTION: 'TXN',
  COMPLAINT: 'CMP',
  ESTIMATE: 'EST',
  REVIEW: 'REV',
  JOB: 'JOB',
  APPLICATION: 'APP',
  NOTIFICATION: 'NTF'
}

/**
 * Generate human-readable entity ID
 * @param {string} type Key in PREFIXES (e.g. 'BOOKING')
 * @returns {string} e.g. "BK-9482"
 */
function generateId(type = 'BOOKING') {
  const prefix = PREFIXES[type.toUpperCase()] || 'GEN'
  const randomNum = Math.floor(1000 + Math.random() * 9000)
  return `${prefix}-${randomNum}`
}

/**
 * Generate numeric 4-digit verification OTP
 * @returns {string} e.g. "4829"
 */
function generateOtp() {
  return String(Math.floor(1000 + Math.random() * 9000))
}

module.exports = {
  generateId,
  generateOtp,
  PREFIXES
}
