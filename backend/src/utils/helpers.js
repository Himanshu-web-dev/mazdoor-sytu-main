// src/utils/helpers.js

/**
 * Calculate distance between two GPS coordinates using Haversine formula (km)
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null

  const R = 6371 // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const d = R * c
  return Math.round(d * 10) / 10 // Round to 1 decimal place
}

/**
 * Convert Rupees to Integer Paise (₹1 = 100 paise)
 * @param {number} rupees
 * @returns {number} integer paise
 */
function rupeesToPaise(rupees) {
  return Math.round((Number(rupees) || 0) * 100)
}

/**
 * Convert Integer Paise to Rupees
 * @param {number} paise
 * @returns {number} rupees (decimal)
 */
function paiseToRupees(paise) {
  return (Number(paise) || 0) / 100
}

/**
 * Format Indian currency string
 * @param {number} amount in INR
 * @returns {string} e.g. "₹1,250"
 */
function formatRupees(amount) {
  const num = Number(amount) || 0
  return `₹${num.toLocaleString('en-IN')}`
}

/**
 * Format Indian currency from Paise
 * @param {number} paise
 * @returns {string} e.g. "₹99"
 */
function formatPaiseToRupees(paise) {
  return formatRupees(paiseToRupees(paise))
}

/**
 * Format current timestamp for human display
 */
function formatHumanDateTime(date = new Date()) {
  const d = new Date(date)
  return d.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
}

module.exports = {
  calculateDistance,
  rupeesToPaise,
  paiseToRupees,
  formatRupees,
  formatPaiseToRupees,
  formatHumanDateTime
}
