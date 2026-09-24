// src/routes/estimateRoutes.js
const express = require('express')
const router = express.Router()
const estimateController = require('../controllers/estimateController')
const { authenticate } = require('../middleware/auth')
const { authorizeRoles } = require('../middleware/roleCheck')
const { validate } = require('../middleware/validation')
const { validateAddEstimate, validateApproveEstimate } = require('../validators/estimateValidator')

router.post('/', authenticate, authorizeRoles('worker', 'admin'), validate(validateAddEstimate), estimateController.createEstimate)
router.get('/booking/:bookingId', authenticate, estimateController.getByBooking)
router.put('/:estimateId/approval', authenticate, authorizeRoles('customer', 'admin'), validate(validateApproveEstimate), estimateController.handleApproval)
router.post('/:estimateId/approval', authenticate, authorizeRoles('customer', 'admin'), validate(validateApproveEstimate), estimateController.handleApproval)

module.exports = router
