// src/services/notificationService.js
const firebaseService = require('./firebaseService')
const { generateId } = require('../utils/generateId')
const logger = require('../utils/logger')

const notificationService = {
  /**
   * Dispatch notification to user
   */
  async sendNotification({ userId, title, body, type = 'booking_update', data = {} }) {
    const notificationId = generateId('NOTIFICATION')

    const notification = {
      id: notificationId,
      userId,
      title,
      body,
      type,
      data,
      read: false,
      createdAt: new Date().toISOString()
    }

    await firebaseService.setDocument('notifications', notificationId, notification)
    logger.info(`Notification sent to [${userId}]: ${title}`)
    return notification
  },

  /**
   * Get user notifications list
   */
  async getUserNotifications(userId, limit = 20) {
    return firebaseService.queryCollection('notifications', { userId }, limit)
  },

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId) {
    return firebaseService.setDocument('notifications', notificationId, { read: true }, true)
  }
}

module.exports = notificationService
