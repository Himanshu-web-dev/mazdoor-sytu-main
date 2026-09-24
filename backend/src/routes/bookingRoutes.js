// src/routes/bookingRoutes.js
const express = require('express')
const router = express.Router()
const bookingController = require('../controllers/bookingController')
const { authenticate } = require('../middleware/auth')
const { validate } = require('../middleware/validation')
const { validateCreateBooking, validateCancelBooking } = require('../validators/bookingValidator')

router.post('/', authenticate, validate(validateCreateBooking), bookingController.createBooking)
router.get('/my-bookings', authenticate, bookingController.getMyBookings)
router.get('/:id', authenticate, bookingController.getBooking)
router.put('/:id/stage', authenticate, bookingController.updateStage)
router.post('/:id/stage', authenticate, bookingController.updateStage)
router.post('/:id/cancel', authenticate, validate(validateCancelBooking), bookingController.cancelBooking)
router.post('/:id/complete', authenticate, bookingController.completeWithOtp)

module.exports = router
