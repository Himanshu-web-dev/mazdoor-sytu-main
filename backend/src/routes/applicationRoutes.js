// src/routes/applicationRoutes.js
const express = require('express')
const router = express.Router()
const applicationController = require('../controllers/applicationController')
const { authenticate } = require('../middleware/auth')
const { authorizeRoles } = require('../middleware/roleCheck')

router.post('/', authenticate, authorizeRoles('worker'), applicationController.apply)
router.get('/job/:jobId', authenticate, authorizeRoles('business', 'admin'), applicationController.getJobApplications)
router.put('/:id/status', authenticate, authorizeRoles('business', 'admin'), applicationController.updateStatus)

module.exports = router
