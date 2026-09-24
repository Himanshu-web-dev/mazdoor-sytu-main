// src/controllers/workerController.js
const workerService = require('../services/workerService')
const { sendSuccess, sendError } = require('../utils/response')

const workerController = {
  /**
   * Search workers by trade or location
   */
  async search(req, res, next) {
    try {
      const { trade, city, availability, limit } = req.query
      const workers = await workerService.searchWorkers({ trade, city, availability, limit: Number(limit) || 20 })
      return sendSuccess(res, workers)
    } catch (err) {
      return sendError(res, err.message, 500)
    }
  },

  /**
   * Get worker profile
   */
  async getProfile(req, res, next) {
    try {
      const workerId = req.params.id || req.user?.uid
      const worker = await workerService.getProfile(workerId)
      if (!worker) return sendError(res, 'Worker not found', 404)
      return sendSuccess(res, worker)
    } catch (err) {
      return sendError(res, err.message, 500)
    }
  },

  /**
   * Update worker profile
   */
  async updateProfile(req, res, next) {
    try {
      const workerId = req.params.id || req.user?.uid
      const updated = await workerService.updateProfile(workerId, req.body)
      return sendSuccess(res, updated, 'Worker profile updated')
    } catch (err) {
      return sendError(res, err.message, 500)
    }
  },

  /**
   * Toggle availability status (available, busy, offline)
   */
  async setAvailability(req, res, next) {
    try {
      const workerId = req.user?.uid
      const { availability } = req.body
      const updated = await workerService.setAvailability(workerId, availability)
      return sendSuccess(res, updated, `Availability updated to ${availability}`)
    } catch (err) {
      return sendError(res, err.message, 500)
    }
  }
}

module.exports = workerController
