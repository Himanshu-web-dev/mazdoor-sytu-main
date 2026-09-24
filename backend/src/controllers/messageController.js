// src/controllers/messageController.js
const messagingService = require('../services/messagingService')
const { sendSuccess, sendError } = require('../utils/response')

const messageController = {
  /**
   * Send message
   */
  async sendMessage(req, res, next) {
    try {
      const senderId = req.user?.uid
      const { receiverId, bookingId, text, message: msgField } = req.body

      const message = await messagingService.sendMessage({
        senderId,
        receiverId,
        bookingId,
        text: text || msgField || ''
      })

      return sendSuccess(res, message, 'Message sent', 201)
    } catch (err) {
      return sendError(res, err.message, 500)
    }
  },

  /**
   * Get conversation with another user
   */
  async getConversation(req, res, next) {
    try {
      const currentUserId = req.user?.uid
      const otherUserId = req.params.userId
      const limit = Number(req.query.limit) || 50

      const conversation = await messagingService.getConversation(currentUserId, otherUserId, limit)
      return sendSuccess(res, conversation)
    } catch (err) {
      return sendError(res, err.message, 500)
    }
  }
}

module.exports = messageController
