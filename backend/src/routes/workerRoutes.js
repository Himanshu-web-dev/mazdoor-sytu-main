// src/routes/workerRoutes.js
const express = require('express')
const router = express.Router()
const workerController = require('../controllers/workerController')
const { authenticate } = require('../middleware/auth')
const { authorizeRoles } = require('../middleware/roleCheck')
const { validate } = require('../middleware/validation')
const { validateWorkerProfile, validateAvailability } = require('../validators/workerValidator')

// Public worker search
router.get('/search', workerController.search)
router.get('/:id', workerController.getProfile)

// Authenticated worker endpoints
router.put('/profile', authenticate, authorizeRoles('worker', 'admin'), validate(validateWorkerProfile), workerController.updateProfile)
router.put('/availability', authenticate, authorizeRoles('worker', 'admin'), validate(validateAvailability), workerController.setAvailability)

module.exports = router
