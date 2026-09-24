// src/routes/documentRoutes.js
const express = require('express')
const router = express.Router()
const documentController = require('../controllers/documentController')
const { authenticate } = require('../middleware/auth')
const { authorizeRoles } = require('../middleware/roleCheck')

router.post('/upload', authenticate, authorizeRoles('worker', 'business'), documentController.uploadKycDoc)
router.get('/my-documents', authenticate, documentController.getMyDocuments)

module.exports = router
