// src/routes/reviewRoutes.js
const express = require('express')
const router = express.Router()
const reviewController = require('../controllers/reviewController')
const { authenticate } = require('../middleware/auth')

router.post('/', authenticate, reviewController.createReview)
router.get('/worker/:workerId', reviewController.getWorkerReviews)

module.exports = router
