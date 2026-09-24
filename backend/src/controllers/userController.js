// src/controllers/userController.js
const firebaseService = require('../services/firebaseService')
const { sendSuccess, sendError } = require('../utils/response')

const userController = {
  /**
   * Get user profile by ID
   */
  async getProfile(req, res, next) {
    try {
      const userId = req.params.id || req.user?.uid
      const user = await firebaseService.getDocument('users', userId)
      if (!user) return sendError(res, 'User not found', 404)
      return sendSuccess(res, user)
    } catch (err) {
      return sendError(res, err.message, 500)
    }
  },

  /**
   * Update user profile
   */
  async updateProfile(req, res, next) {
    try {
      const userId = req.params.id || req.user?.uid
      const updated = await firebaseService.setDocument('users', userId, req.body, true)
      return sendSuccess(res, updated, 'Profile updated successfully')
    } catch (err) {
      return sendError(res, err.message, 500)
    }
  }
}

module.exports = userController
