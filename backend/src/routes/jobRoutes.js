// src/routes/jobRoutes.js
const express = require('express')
const router = express.Router()
const jobController = require('../controllers/jobController')
const { authenticate } = require('../middleware/auth')
const { authorizeRoles } = require('../middleware/roleCheck')
const { validate } = require('../middleware/validation')
const { validateJobPosting } = require('../validators/jobValidator')

router.get('/', jobController.listJobs)
router.get('/:id', jobController.getJob)
router.post('/', authenticate, authorizeRoles('business', 'admin'), validate(validateJobPosting), jobController.createJob)

module.exports = router
