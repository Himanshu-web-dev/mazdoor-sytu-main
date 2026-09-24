// src/services/authService.js
const jwt = require('jsonwebtoken')
const env = require('../config/env')
const firebaseService = require('./firebaseService')
const { generateId } = require('../utils/generateId')

const authService = {
  /**
   * Generate JWT token for user session
   */
  generateToken(user) {
    const payload = {
      uid: user.id || user.uid,
      phone: user.phone || '',
      email: user.email || '',
      name: user.name || 'User',
      role: user.role || 'customer'
    }

    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN
    })
  },

  /**
   * Register new user profile
   */
  async registerUser({ phone = '', name, role = 'customer', email = '', city = 'Meerut, UP', trade, companyName, experience, password }) {
    const normalizedPhone = phone ? String(phone).replace(/\s|-/g, '') : ''
    const normalizedEmail = email ? String(email).trim().toLowerCase() : ''

    // Check if phone already registered
    if (normalizedPhone) {
      const existingPhone = await firebaseService.queryCollection('users', { phone: normalizedPhone }, 1)
      if (existingPhone.length > 0) {
        throw new Error('A user with this mobile phone number is already registered.')
      }
    }

    // Check if email already registered
    if (normalizedEmail) {
      const existingEmail = await firebaseService.queryCollection('users', { email: normalizedEmail }, 1)
      if (existingEmail.length > 0) {
        throw new Error('A user with this email address is already registered.')
      }
    }

    const userId = generateId(role === 'worker' ? 'WORKER' : role === 'business' ? 'BUSINESS' : 'USER')
    const newUser = {
      id: userId,
      phone: normalizedPhone,
      name: name.trim(),
      email: normalizedEmail,
      password: password || '', // In production with Firebase Auth, passwords stay in Firebase
      role: role.toLowerCase(),
      city,
      trade: role === 'worker' ? trade || 'Electrician' : undefined,
      companyName: role === 'business' ? companyName || name.trim() : undefined,
      experience: role === 'worker' ? experience || '3-5 years' : undefined,
      status: 'active',
      walletBalance: 0,
      createdAt: new Date().toISOString()
    }

    await firebaseService.setDocument('users', userId, newUser)

    // Also initialize worker or business profile if applicable
    if (role === 'worker') {
      await firebaseService.setDocument('workers', userId, {
        id: userId,
        name: newUser.name,
        phone: newUser.phone,
        email: newUser.email,
        trade: newUser.trade,
        experience: newUser.experience,
        availability: 'available',
        hourlyRate: 250,
        kycStatus: 'pending',
        rating: 5.0,
        jobsCompleted: 0
      })
    } else if (role === 'business') {
      await firebaseService.setDocument('businesses', userId, {
        id: userId,
        companyName: newUser.companyName || newUser.name,
        phone: newUser.phone,
        email: newUser.email,
        verification: 'pending',
        activeJobs: 0
      })
    }

    const token = this.generateToken(newUser)
    return { user: newUser, token }
  },

  /**
   * Login user by email or mobile number and password/OTP
   */
  async loginUser({ phone, email, otp, password, role }) {
    let users = []

    if (phone) {
      const normalizedPhone = String(phone).replace(/\s|-/g, '')
      users = await firebaseService.queryCollection('users', { phone: normalizedPhone }, 1)
    } else if (email) {
      users = await firebaseService.queryCollection('users', { email: String(email).trim().toLowerCase() }, 1)
    }

    const user = users[0]

    if (!user) {
      throw new Error('Account not found with provided credentials. Please register first.')
    }

    if (user.status === 'suspended') {
      throw new Error('This account has been suspended by administration.')
    }

    // If password provided and user has password stored, verify
    if (password && user.password && user.password !== password) {
      throw new Error('Incorrect password. Please try again.')
    }

    const token = this.generateToken(user)
    return { user, token }
  }
}

module.exports = authService
