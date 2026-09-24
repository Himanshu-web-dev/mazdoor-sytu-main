// src/services/businessService.js
const firebaseService = require('./firebaseService')

const businessService = {
  /**
   * Get business entity profile
   */
  async getProfile(businessId) {
    return firebaseService.getDocument('businesses', businessId)
  },

  /**
   * Update company information
   */
  async updateProfile(businessId, updateData) {
    return firebaseService.setDocument('businesses', businessId, updateData, true)
  },

  /**
   * Get active job requirements posted by business
   */
  async getRequirements(businessId) {
    return firebaseService.queryCollection('jobs', { businessId })
  },

  /**
   * Get list of verified businesses
   */
  async listBusinesses(limit = 20) {
    return firebaseService.queryCollection('businesses', {}, limit)
  }
}

module.exports = businessService
