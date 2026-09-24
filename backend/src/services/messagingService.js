// src/services/messagingService.js
const firebaseService = require('./firebaseService')
const { generateId } = require('../utils/generateId')

const messagingService = {
  /**
   * Helper to derive deterministic conversationId between two users
   */
  getConversationId(userIdA, userIdB) {
    return [userIdA, userIdB].sort().join('_')
  },

  /**
   * Send chat message between parties
   */
  async sendMessage({ senderId, receiverId, bookingId = null, text }) {
    const messageId = generateId('MESSAGE')
    const conversationId = this.getConversationId(senderId, receiverId)
    const now = new Date().toISOString()

    const message = {
      id: messageId,
      conversationId,
      senderId,
      receiverId,
      bookingId: bookingId || null,
      text: text.trim(),
      read: false,
      timestamp: now
    }

    await firebaseService.setDocument('messages', messageId, message)
    return message
  },

  /**
   * Get conversation between two users
   */
  async getConversation(userA, userB, limit = 50) {
    const conversationId = this.getConversationId(userA, userB)
    const messages = await firebaseService.queryCollection('messages', { conversationId }, limit)

    if (messages.length > 0) {
      return messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    }

    // Fallback if older messages lack conversationId
    const allMessages = await firebaseService.queryCollection('messages', {}, 100)
    return allMessages
      .filter(
        (m) =>
          (m.senderId === userA && m.receiverId === userB) ||
          (m.senderId === userB && m.receiverId === userA)
      )
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
      .slice(-limit)
  }
}

module.exports = messagingService
