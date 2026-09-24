// src/routes/paymentRoutes.js
const express = require('express')
const router = express.Router()
const paymentController = require('../controllers/paymentController')
const { authenticate } = require('../middleware/auth')
const { validate } = require('../middleware/validation')
const { validateInitiatePayment } = require('../validators/paymentValidator')

router.post('/', authenticate, validate(validateInitiatePayment), paymentController.processPayment)
router.post('/process', authenticate, validate(validateInitiatePayment), paymentController.processPayment)
router.get('/:id', authenticate, paymentController.getTransaction)

module.exports = router
