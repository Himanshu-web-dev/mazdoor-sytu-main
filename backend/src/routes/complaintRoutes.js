// src/routes/complaintRoutes.js
const express = require('express')
const router = express.Router()
const complaintController = require('../controllers/complaintController')
const { authenticate } = require('../middleware/auth')
const { authorizeRoles } = require('../middleware/roleCheck')

router.post('/', authenticate, complaintController.createComplaint)
router.get('/my-complaints', authenticate, complaintController.getMyComplaints)
router.put('/:id/resolve', authenticate, authorizeRoles('admin'), complaintController.resolveComplaint)

module.exports = router
