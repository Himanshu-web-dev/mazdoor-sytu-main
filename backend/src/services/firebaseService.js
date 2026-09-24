// src/services/firebaseService.js
const { db, isFirebaseInitialized } = require('../config/firebase')
const logger = require('../utils/logger')

// In-memory fallback mock storage when Firebase credentials are not supplied
const memoryStore = new Map()

const firebaseService = {
  /**
   * Get document by ID
   */
  async getDocument(collectionName, docId) {
    if (isFirebaseInitialized && db) {
      try {
        const docRef = db.collection(collectionName).doc(docId)
        const snap = await docRef.get()
        if (!snap.exists) return null
        return { id: snap.id, ...snap.data() }
      } catch (err) {
        logger.error(`Firestore getDocument error [${collectionName}/${docId}]: ${err.message}`)
      }
    }

    // Memory Store fallback
    const key = `${collectionName}:${docId}`
    return memoryStore.get(key) || null
  },

  /**
   * Set or update document
   */
  async setDocument(collectionName, docId, data, merge = true) {
    const timestamp = new Date().toISOString()
    const docData = { ...data, updatedAt: timestamp }

    if (isFirebaseInitialized && db) {
      try {
        const docRef = db.collection(collectionName).doc(docId)
        await docRef.set(docData, { merge })
        return { id: docId, ...docData }
      } catch (err) {
        logger.error(`Firestore setDocument error [${collectionName}/${docId}]: ${err.message}`)
      }
    }

    // Memory Store fallback
    const key = `${collectionName}:${docId}`
    const existing = memoryStore.get(key) || { id: docId, createdAt: timestamp }
    const updated = merge ? { ...existing, ...docData } : { id: docId, ...docData }
    memoryStore.set(key, updated)
    return updated
  },

  /**
   * Query collection with simple field equality filters
   */
  async queryCollection(collectionName, filters = {}, limit = 50) {
    if (isFirebaseInitialized && db) {
      try {
        let query = db.collection(collectionName)
        for (const [field, value] of Object.entries(filters)) {
          if (value !== undefined) {
            query = query.where(field, '==', value)
          }
        }
        const snap = await query.limit(limit).get()
        return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      } catch (err) {
        logger.error(`Firestore queryCollection error [${collectionName}]: ${err.message}`)
      }
    }

    // Memory Store fallback filter
    const prefix = `${collectionName}:`
    const results = []
    for (const [key, value] of memoryStore.entries()) {
      if (key.startsWith(prefix)) {
        let matches = true
        for (const [field, filterVal] of Object.entries(filters)) {
          if (filterVal !== undefined && value[field] !== filterVal) {
            matches = false
            break
          }
        }
        if (matches) results.push(value)
      }
    }
    return results.slice(0, limit)
  },

  /**
   * Delete document
   */
  async deleteDocument(collectionName, docId) {
    if (isFirebaseInitialized && db) {
      try {
        await db.collection(collectionName).doc(docId).delete()
        return true
      } catch (err) {
        logger.error(`Firestore deleteDocument error [${collectionName}/${docId}]: ${err.message}`)
      }
    }

    const key = `${collectionName}:${docId}`
    return memoryStore.delete(key)
  }
}

module.exports = firebaseService
