// src/controllers/adminController.js
const firebaseService = require('../services/firebaseService')
const { sendSuccess, sendError } = require('../utils/response')

const adminController = {
  /**
   * Get administrative platform dashboard metrics
   */
  async getDashboardStats(req, res, next) {
    try {
      const users = await firebaseService.queryCollection('users', {}, 200)
      const bookings = await firebaseService.queryCollection('bookings', {}, 200)
      const complaints = await firebaseService.queryCollection('complaints', {}, 200)
      const kycQueue = await firebaseService.queryCollection('kyc_documents', { status: 'pending' }, 200)

      const workersCount = users.filter((u) => u.role === 'worker').length
      const businessesCount = users.filter((u) => u.role === 'business').length
      const customersCount = users.filter((u) => u.role === 'customer').length

      // Calculate total platform revenue from 10% commission on labour
      const totalRevenue = bookings.reduce((sum, b) => {
        const comm = b.pricing?.platformCommission || 0
        return sum + comm
      }, 0)

      const stats = {
        totalUsers: users.length,
        customersCount,
        workersCount,
        businessesCount,
        totalBookings: bookings.length,
        pendingKycCount: kycQueue.length,
        openComplaintsCount: complaints.filter((c) => c.status === 'open').length,
        platformCommissionRevenue: totalRevenue,
        systemStatus: 'Operational',
        timestamp: new Date().toISOString()
      }

      return sendSuccess(res, stats)
    } catch (err) {
      return sendError(res, err.message, 500)
    }
  },

  /**
   * Admin reviews & approves/rejects KYC document
   */
  async reviewKyc(req, res, next) {
    try {
      const { docId } = req.params
      const { status, note } = req.body // 'verified' or 'rejected'

      const updated = await firebaseService.setDocument('kyc_documents', docId, {
        status,
        adminNote: note || '',
        reviewedAt: new Date().toISOString()
      }, true)

      if (updated.workerId && status === 'verified') {
        await firebaseService.setDocument('workers', updated.workerId, {
          kycStatus: 'Verified'
        }, true)
      }

      return sendSuccess(res, updated, `KYC document marked as ${status}`)
    } catch (err) {
      return sendError(res, err.message, 500)
    }
  },

  /**
   * Admin lists all complaints
   */
  async listComplaints(req, res, next) {
    try {
      const complaints = await firebaseService.queryCollection('complaints', {}, 100)
      return sendSuccess(res, complaints)
    } catch (err) {
      return sendError(res, err.message, 500)
    }
  }
}

module.exports = adminController
