// src/controllers/complaintController.js
const firebaseService = require('../services/firebaseService')
const { generateId } = require('../utils/generateId')
const { sendSuccess, sendError } = require('../utils/response')

const complaintController = {
  /**
   * File a grievance / complaint
   */
  async createComplaint(req, res, next) {
    try {
      const raisedById = req.user?.uid
      const raisedByName = req.user?.name || 'User'
      const { bookingId, againstId, subject, description, category, priority } = req.body

      const complaintId = generateId('COMPLAINT')
      const complaint = {
        id: complaintId,
        bookingId,
        raisedById,
        raisedByName,
        againstId,
        subject,
        description,
        category: category || 'Service Quality',
        priority: priority || 'Medium',
        status: 'open', // 'open', 'under_review', 'resolved'
        resolutionNote: '',
        createdAt: new Date().toISOString()
      }

      await firebaseService.setDocument('complaints', complaintId, complaint)
      return sendSuccess(res, complaint, 'Grievance ticket created. Our team will review within 24 hours.', 201)
    } catch (err) {
      return sendError(res, err.message, 500)
    }
  },

  /**
   * Get complaints filed by current user
   */
  async getMyComplaints(req, res, next) {
    try {
      const userId = req.user?.uid
      const complaints = await firebaseService.queryCollection('complaints', { raisedById: userId })
      return sendSuccess(res, complaints)
    } catch (err) {
      return sendError(res, err.message, 500)
    }
  },

  /**
   * Admin updates complaint status & resolution
   */
  async resolveComplaint(req, res, next) {
    try {
      const { status, resolutionNote } = req.body
      const updated = await firebaseService.setDocument('complaints', req.params.id, {
        status,
        resolutionNote,
        resolvedAt: new Date().toISOString()
      }, true)
      return sendSuccess(res, updated, 'Complaint status updated')
    } catch (err) {
      return sendError(res, err.message, 500)
    }
  }
}

module.exports = complaintController
