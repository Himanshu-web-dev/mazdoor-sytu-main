// src/routes/messageRoutes.js
const express = require('express')
const router = express.Router()
const messageController = require('../controllers/messageController')
const { authenticate } = require('../middleware/auth')

router.post('/', authenticate, messageController.sendMessage)
router.post('/send', authenticate, messageController.sendMessage)
router.get('/conversation/:userId', authenticate, messageController.getConversation)

module.exports = router
