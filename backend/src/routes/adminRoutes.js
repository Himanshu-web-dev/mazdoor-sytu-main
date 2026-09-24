// src/routes/adminRoutes.js
const express = require('express')
const router = express.Router()
const adminController = require('../controllers/adminController')
const { authenticate } = require('../middleware/auth')
const { authorizeRoles } = require('../middleware/roleCheck')

// All admin routes protected by 'admin' role check
router.use(authenticate, authorizeRoles('admin'))

router.get('/dashboard-stats', adminController.getDashboardStats)
router.put('/kyc/:docId', adminController.reviewKyc)
router.get('/complaints', adminController.listComplaints)

module.exports = router
