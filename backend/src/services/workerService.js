// src/services/workerService.js
const firebaseService = require('./firebaseService')

const workerService = {
  /**
   * Get worker profile by ID
   */
  async getProfile(workerId) {
    return firebaseService.getDocument('workers', workerId)
  },

  /**
   * Update worker details
   */
  async updateProfile(workerId, updateData) {
    return firebaseService.setDocument('workers', workerId, updateData, true)
  },

  /**
   * Toggle worker availability status
   */
  async setAvailability(workerId, availability) {
    return firebaseService.setDocument('workers', workerId, { availability }, true)
  },

  /**
   * Search workers by trade and city
   */
  async searchWorkers({ trade, city, availability = 'available', limit = 20 }) {
    const filters = {}
    if (trade) filters.trade = trade
    if (city) filters.city = city
    if (availability) filters.availability = availability

    return firebaseService.queryCollection('workers', filters, limit)
  },

  /**
   * Update worker review rating
   */
  async updateWorkerRating(workerId, newRating) {
    const worker = await this.getProfile(workerId)
    if (!worker) return null

    const currentCount = worker.jobsCompleted || 1
    const currentRating = worker.rating || 5.0
    const updatedRating = Number(((currentRating * currentCount + newRating) / (currentCount + 1)).toFixed(1))

    return firebaseService.setDocument('workers', workerId, {
      rating: updatedRating,
      jobsCompleted: currentCount + 1
    }, true)
  }
}

module.exports = workerService
