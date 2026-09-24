// src/app.js
const express = require('express')
const cors = require('cors')
const env = require('./config/env')
const { notFoundHandler, globalErrorHandler } = require('./middleware/errorHandler')
const { standardLimiter } = require('./middleware/rateLimiter')

// Import all 17 REST API route modules
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const workerRoutes = require('./routes/workerRoutes')
const businessRoutes = require('./routes/businessRoutes')
const serviceRoutes = require('./routes/serviceRoutes')
const jobRoutes = require('./routes/jobRoutes')
const applicationRoutes = require('./routes/applicationRoutes')
const bookingRoutes = require('./routes/bookingRoutes')
const estimateRoutes = require('./routes/estimateRoutes')
const paymentRoutes = require('./routes/paymentRoutes')
const walletRoutes = require('./routes/walletRoutes')
const messageRoutes = require('./routes/messageRoutes')
const reviewRoutes = require('./routes/reviewRoutes')
const complaintRoutes = require('./routes/complaintRoutes')
const notificationRoutes = require('./routes/notificationRoutes')
const documentRoutes = require('./routes/documentRoutes')
const adminRoutes = require('./routes/adminRoutes')

const app = express()

// Trust proxy for rate limiting behind reverse proxies (Nginx, Cloudflare)
app.set('trust proxy', 1)

// Enable Cross-Origin Resource Sharing
app.use(
  cors({
    origin: env.CORS_ORIGIN === '*' ? true : env.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
)

// Global request rate limiting
app.use(standardLimiter)

// Parse incoming JSON and URL-encoded request bodies
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Health Check API
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'mazdoor-sytu-backend',
    version: '1.0.0',
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString()
  })
})

// Mount all 17 REST API domain routes under /api/v1/
const API_PREFIX = '/api/v1'
app.use(`${API_PREFIX}/auth`, authRoutes)
app.use(`${API_PREFIX}/users`, userRoutes)
app.use(`${API_PREFIX}/workers`, workerRoutes)
app.use(`${API_PREFIX}/businesses`, businessRoutes)
app.use(`${API_PREFIX}/services`, serviceRoutes)
app.use(`${API_PREFIX}/jobs`, jobRoutes)
app.use(`${API_PREFIX}/applications`, applicationRoutes)
app.use(`${API_PREFIX}/bookings`, bookingRoutes)
app.use(`${API_PREFIX}/estimates`, estimateRoutes)
app.use(`${API_PREFIX}/payments`, paymentRoutes)
app.use(`${API_PREFIX}/wallets`, walletRoutes)
app.use(`${API_PREFIX}/messages`, messageRoutes)
app.use(`${API_PREFIX}/reviews`, reviewRoutes)
app.use(`${API_PREFIX}/complaints`, complaintRoutes)
app.use(`${API_PREFIX}/notifications`, notificationRoutes)
app.use(`${API_PREFIX}/documents`, documentRoutes)
app.use(`${API_PREFIX}/admin`, adminRoutes)

// 404 Handler for undefined routes
app.use(notFoundHandler)

// Centralized Global Error Handler
app.use(globalErrorHandler)

module.exports = app
