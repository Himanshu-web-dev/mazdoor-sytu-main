// src/controllers/authController.js
const authService = require('../services/authService')
const { sendSuccess, sendError } = require('../utils/response')

const authController = {
  /**
   * Register new user
   */
  async signup(req, res, next) {
    try {
      const { phone, name, role, email, city, trade, companyName, experience, password } = req.body
      const result = await authService.registerUser({
        phone,
        name,
        role,
        email,
        city,
        trade,
        companyName,
        experience,
        password
      })
      return sendSuccess(res, result, 'Registration successful', 201)
    } catch (err) {
      return sendError(res, err.message, 400)
    }
  },

  /**
   * Login user
   */
  async login(req, res, next) {
    try {
      const { phone, email, otp, password, role } = req.body
      const result = await authService.loginUser({ phone, email, otp, password, role })
      return sendSuccess(res, result, 'Login successful')
    } catch (err) {
      return sendError(res, err.message, 401)
    }
  },

  /**
   * Get current authenticated user profile
   */
  async getMe(req, res, next) {
    try {
      return sendSuccess(res, req.user, 'Current user profile')
    } catch (err) {
      return sendError(res, err.message, 500)
    }
  }
}

module.exports = authController
