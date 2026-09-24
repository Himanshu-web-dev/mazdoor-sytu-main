// src/routes/walletRoutes.js
const express = require('express')
const router = express.Router()
const walletController = require('../controllers/walletController')
const { authenticate } = require('../middleware/auth')
const { validate } = require('../middleware/validation')
const { validateWithdrawalRequest } = require('../validators/paymentValidator')

router.get('/', authenticate, walletController.getWallet)
router.get('/my-wallet', authenticate, walletController.getWallet)
router.get('/:userId', authenticate, walletController.getWallet)
router.post('/withdraw', authenticate, validate(validateWithdrawalRequest), walletController.requestWithdrawal)

module.exports = router
