// src/controllers/applicationController.js
const firebaseService = require('../services/firebaseService')
const { APPLICATION_STATUS } = require('../utils/constants')
const { sendSuccess, sendError } = require('../utils/response')

const applicationController = {
  /**
   * Worker applies to a business job (Enforces unique jobId + workerId)
   */
  async apply(req, res, next) {
    try {
      const { jobId, expectedDailyWage, notes } = req.body
      const workerId = req.user?.uid || req.body.workerId

      if (!jobId || !workerId) {
        return sendError(res, 'Both jobId and workerId are required', 400)
      }

      // Check for existing application
      const existing = await firebaseService.queryCollection('applications', { jobId, workerId }, 1)
      if (existing.length > 0) {
        return sendError(res, 'You have already applied for this job requirement', 400)
      }

      const appId = `APP_${jobId}_${workerId}`
      const now = new Date().toISOString()

      const application = {
        id: appId,
        jobId,
        workerId,
        workerName: req.user?.name || req.body.workerName || 'Worker',
        workerPhone: req.user?.phone || req.body.workerPhone || '',
        expectedDailyWagePaise: expectedDailyWage ? Math.round(Number(expectedDailyWage) * 100) : null,
        notes: (notes || '').trim(),
        status: APPLICATION_STATUS.APPLIED,
        appliedAt: now,
        updatedAt: now
      }

      await firebaseService.setDocument('applications', appId, application)

      // Increment applicantsCount on the job
      const job = await firebaseService.getDocument('jobs', jobId)
      if (job) {
        await firebaseService.setDocument('jobs', jobId, {
          applicantsCount: (job.applicantsCount || 0) + 1,
          updatedAt: now
        }, true)
      }

      return sendSuccess(res, application, 'Application submitted successfully', 201)
    } catch (err) {
      return sendError(res, err.message, 500)
    }
  },

  /**
   * Get applications for a specific job
   */
  async getJobApplications(req, res, next) {
    try {
      const { jobId } = req.params
      const applications = await firebaseService.queryCollection('applications', { jobId })
      return sendSuccess(res, applications)
    } catch (err) {
      return sendError(res, err.message, 500)
    }
  },

  /**
   * Business updates application status
   */
  async updateStatus(req, res, next) {
    try {
      const { status } = req.body
      const validStatuses = Object.values(APPLICATION_STATUS)

      if (!validStatuses.includes(status)) {
        return sendError(res, `Invalid status '${status}'. Must be one of: ${validStatuses.join(', ')}`, 400)
      }

      const updated = await firebaseService.setDocument('applications', req.params.id, {
        status,
        updatedAt: new Date().toISOString()
      }, true)

      return sendSuccess(res, updated, `Candidate status updated to ${status}`)
    } catch (err) {
      return sendError(res, err.message, 500)
    }
  }
}

module.exports = applicationController
