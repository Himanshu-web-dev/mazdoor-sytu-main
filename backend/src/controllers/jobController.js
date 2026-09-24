// src/controllers/jobController.js
const firebaseService = require('../services/firebaseService')
const { generateId } = require('../utils/generateId')
const { JOB_STATUS } = require('../utils/constants')
const { sendSuccess, sendError } = require('../utils/response')

const jobController = {
  /**
   * Post new bulk requirement / job
   */
  async createJob(req, res, next) {
    try {
      const jobId = generateId('JOB')
      const businessId = req.user?.uid || req.body.businessId
      if (!businessId) {
        return sendError(res, 'Authentication required: business ID is missing.', 401)
      }
      const dailyWageRupees = Number(req.body.dailyWage) || 500
      const now = new Date().toISOString()

      const job = {
        id: jobId,
        businessId,
        businessName: req.body.businessName || req.user?.name || 'Enterprise Client',
        title: req.body.title || 'Workforce Requirement',
        trade: req.body.trade || 'General',
        skills: Array.isArray(req.body.skills) ? req.body.skills : [],
        workersNeeded: Number(req.body.workersNeeded) || 1,
        dailyWage: dailyWageRupees,
        dailyWagePaise: Math.round(dailyWageRupees * 100),
        duration: req.body.duration || '1 Month',
        location: req.body.location || 'Local',
        startDate: req.body.startDate || null,
        deadline: req.body.deadline || null,
        status: JOB_STATUS.OPEN,
        applicantsCount: 0,
        createdAt: now,
        updatedAt: now
      }

      await firebaseService.setDocument('jobs', jobId, job)
      return sendSuccess(res, job, 'Job requirement posted successfully', 201)
    } catch (err) {
      return sendError(res, err.message, 500)
    }
  },

  /**
   * Get all active job postings
   */
  async listJobs(req, res, next) {
    try {
      const { trade, location } = req.query
      const filters = { status: JOB_STATUS.OPEN }
      if (trade) filters.trade = trade

      const jobs = await firebaseService.queryCollection('jobs', filters, 50)
      return sendSuccess(res, jobs)
    } catch (err) {
      return sendError(res, err.message, 500)
    }
  },

  /**
   * Get single job by ID
   */
  async getJob(req, res, next) {
    try {
      const job = await firebaseService.getDocument('jobs', req.params.id)
      if (!job) return sendError(res, 'Job not found', 404)
      return sendSuccess(res, job)
    } catch (err) {
      return sendError(res, err.message, 500)
    }
  }
}

module.exports = jobController
