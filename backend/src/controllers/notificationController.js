// src/controllers/notificationController.js
const notificationService = require('../services/notificationService')
const { sendSuccess, sendError } = require('../utils/response')

const notificationController = {
  /**
   * Get notifications for authenticated user
   */
  async getNotifications(req, res, next) {
    try {
      const userId = req.user?.uid
      const notifications = await notificationService.getUserNotifications(userId)
      return sendSuccess(res, notifications)
    } catch (err) {
      return sendError(res, err.message, 500)
    }
  },

  /**
   * Mark notification as read
   */
  async markRead(req, res, next) {
    try {
      const { id } = req.params
      const updated = await notificationService.markAsRead(id)
      return sendSuccess(res, updated, 'Notification marked as read')
    } catch (err) {
      return sendError(res, err.message, 500)
    }
  }
}

module.exports = notificationController
