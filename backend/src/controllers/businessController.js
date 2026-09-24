// src/controllers/businessController.js
const businessService = require('../services/businessService')
const { sendSuccess, sendError } = require('../utils/response')

const businessController = {
  /**
   * Get business profile
   */
  async getProfile(req, res, next) {
    try {
      const businessId = req.params.id || req.user?.uid
      const business = await businessService.getProfile(businessId)
      if (!business) return sendError(res, 'Business not found', 404)
      return sendSuccess(res, business)
    } catch (err) {
      return sendError(res, err.message, 500)
    }
  },

  /**
   * Update corporate profile
   */
  async updateProfile(req, res, next) {
    try {
      const businessId = req.params.id || req.user?.uid
      const updated = await businessService.updateProfile(businessId, req.body)
      return sendSuccess(res, updated, 'Business profile updated')
    } catch (err) {
      return sendError(res, err.message, 500)
    }
  },

  /**
   * Get job requirements posted by business
   */
  async getRequirements(req, res, next) {
    try {
      const businessId = req.params.id || req.user?.uid
      const requirements = await businessService.getRequirements(businessId)
      return sendSuccess(res, requirements)
    } catch (err) {
      return sendError(res, err.message, 500)
    }
  },

  /**
   * List all verified businesses
   */
  async list(req, res, next) {
    try {
      const businesses = await businessService.listBusinesses()
      return sendSuccess(res, businesses)
    } catch (err) {
      return sendError(res, err.message, 500)
    }
  }
}

module.exports = businessController
