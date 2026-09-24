// src/config/firebase.js
const admin = require('firebase-admin')
const fs = require('fs')
const path = require('path')
const env = require('./env')

let isFirebaseInitialized = false
let db = null
let auth = null
let storage = null

// Check if credentials exist before attempting initialization to avoid gRPC connection hangs
const hasServiceAccountPath = env.FIREBASE_SERVICE_ACCOUNT_PATH && fs.existsSync(env.FIREBASE_SERVICE_ACCOUNT_PATH)
const hasClientCredentials = Boolean(env.FIREBASE_CLIENT_EMAIL && env.FIREBASE_PRIVATE_KEY)
const hasGoogleAppCredentials = Boolean(process.env.GOOGLE_APPLICATION_CREDENTIALS && fs.existsSync(process.env.GOOGLE_APPLICATION_CREDENTIALS))

if (hasServiceAccountPath || hasClientCredentials || hasGoogleAppCredentials) {
  try {
    let credential = null

    if (hasServiceAccountPath) {
      const serviceAccount = require(path.resolve(env.FIREBASE_SERVICE_ACCOUNT_PATH))
      credential = admin.credential.cert(serviceAccount)
    } else if (hasClientCredentials) {
      credential = admin.credential.cert({
        projectId: env.FIREBASE_PROJECT_ID,
        clientEmail: env.FIREBASE_CLIENT_EMAIL,
        privateKey: env.FIREBASE_PRIVATE_KEY
      })
    } else {
      credential = admin.credential.applicationDefault()
    }

    if (!admin.apps.length) {
      admin.initializeApp({
        credential,
        projectId: env.FIREBASE_PROJECT_ID,
        databaseURL: env.FIREBASE_DATABASE_URL
      })
    }

    db = admin.firestore()
    auth = admin.auth()
    storage = admin.storage()
    isFirebaseInitialized = true
    console.log('✅ Firebase Admin SDK initialized successfully.')
  } catch (error) {
    console.warn('⚠️ Firebase Admin SDK initialization failed:', error.message)
    isFirebaseInitialized = false
  }
} else {
  console.log('ℹ️ Running in Local Memory/Mock Database mode (No Firebase credentials configured in .env).')
  isFirebaseInitialized = false
}

module.exports = {
  admin,
  db,
  auth,
  storage,
  isFirebaseInitialized
}
