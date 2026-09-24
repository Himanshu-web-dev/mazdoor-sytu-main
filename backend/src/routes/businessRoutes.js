// src/routes/businessRoutes.js
const express = require('express')
const router = express.Router()
const businessController = require('../controllers/businessController')
const { authenticate } = require('../middleware/auth')
const { authorizeRoles } = require('../middleware/roleCheck')
const { validate } = require('../middleware/validation')
const { validateBusinessProfile } = require('../validators/businessValidator')

router.get('/', businessController.list)
router.get('/:id', businessController.getProfile)
router.put('/profile', authenticate, authorizeRoles('business', 'admin'), validate(validateBusinessProfile), businessController.updateProfile)
router.get('/:id/requirements', businessController.getRequirements)

module.exports = router
