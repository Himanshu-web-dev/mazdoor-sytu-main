// src/config/env.js
const dotenv = require('dotenv')
const path = require('path')

// Load environment variables from backend/.env
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  JWT_SECRET: process.env.JWT_SECRET || 'mazdoor_sytu_default_secret_key_2026',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  
  // Firebase configuration
  FIREBASE_SERVICE_ACCOUNT_PATH: process.env.FIREBASE_SERVICE_ACCOUNT_PATH || '',
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || 'mazdoor-setu',
  FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL || '',
  FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : '',
  FIREBASE_DATABASE_URL: process.env.FIREBASE_DATABASE_URL || '',

  // Financial & platform constants
  BOOKING_ADVANCE_FEE: parseInt(process.env.BOOKING_ADVANCE_FEE || '99', 10),
  PLATFORM_COMMISSION_PERCENT: parseInt(process.env.PLATFORM_COMMISSION_PERCENT || '10', 10),
}

module.exports = env
