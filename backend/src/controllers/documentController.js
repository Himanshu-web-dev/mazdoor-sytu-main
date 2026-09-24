// src/controllers/documentController.js
const firebaseService = require('../services/firebaseService')
const { generateId } = require('../utils/generateId')
const { sendSuccess, sendError } = require('../utils/response')

const documentController = {
  /**
   * Upload / Submit KYC verification document for Worker or Business
   */
  async uploadKycDoc(req, res, next) {
    try {
      const userId = req.user?.uid || req.body.userId
      const userRole = req.user?.role || req.body.userRole || 'worker'
      const { docType, documentNumber, aadhaarNo, documentUrl, certificateName } = req.body

      if (!userId) {
        return sendError(res, 'User ID is required to submit a document', 400)
      }

      const docId = generateId('DOC')
      const now = new Date().toISOString()

      const kycRecord = {
        id: docId,
        userId,
        userRole,
        userName: req.user?.name || req.body.userName || 'User',
        docType: docType || 'Aadhaar Card',
        documentNumber: documentNumber || aadhaarNo || '',
        certificateName: certificateName || '',
        documentUrl: documentUrl || 'https://placehold.co/600x400/png?text=Verified+KYC+Doc',
        status: 'Pending',
        submittedAt: now,
        updatedAt: now
      }

      await firebaseService.setDocument('documents', docId, kycRecord)
      return sendSuccess(res, kycRecord, 'KYC document submitted for verification', 201)
    } catch (err) {
      return sendError(res, err.message, 500)
    }
  },

  /**
   * Get user's uploaded documents
   */
  async getMyDocuments(req, res, next) {
    try {
      const userId = req.user?.uid || req.query.userId
      if (!userId) {
        return sendError(res, 'User ID is required', 400)
      }

      const docs = await firebaseService.queryCollection('documents', { userId })
      return sendSuccess(res, docs)
    } catch (err) {
      return sendError(res, err.message, 500)
    }
  }
}

module.exports = documentController
