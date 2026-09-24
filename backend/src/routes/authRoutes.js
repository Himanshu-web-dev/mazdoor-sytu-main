// src/routes/authRoutes.js
const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const { authenticate } = require('../middleware/auth')
const { validate } = require('../middleware/validation')
const { validateLogin, validateSignup } = require('../validators/authValidator')
const { authLimiter } = require('../middleware/rateLimiter')

router.post('/signup', validate(validateSignup), authController.signup)
router.post('/login', authLimiter, validate(validateLogin), authController.login)
router.get('/me', authenticate, authController.getMe)

module.exports = router
