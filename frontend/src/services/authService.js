// src/services/authService.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  updateProfile,
  onAuthStateChanged,
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db, googleProvider, isFirebaseConfigured } from '../config/firebase'
import { authApi } from './api'

const SESSION_KEY = 'mazdoor_sytu_session_v1'
const TOKEN_KEY = 'mazdoor_token'

// Helper to get stored active session
export function getActiveSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

// Helper to save session
export function saveActiveSession(session, token = null) {
  try {
    if (session) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session))
      if (token) {
        localStorage.setItem(TOKEN_KEY, token)
      }
    } else {
      localStorage.removeItem(SESSION_KEY)
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem('token')
    }
  } catch (err) {
    console.error('Failed to save session:', err)
  }
}

// Register with Email & Password (Real Firebase Auth + Firestore Sync)
export async function registerUser({ email, password, name, phone, role, trade, companyName, experience }) {
  if (isFirebaseConfigured && auth && db) {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password)
      const user = cred.user

      if (name) {
        await updateProfile(user, { displayName: name })
      }

      const userProfile = {
        uid: user.uid,
        email: user.email,
        name: name || 'User',
        phone: phone || '',
        role: role || 'customer',
        trade: role === 'worker' ? trade || 'Electrician' : null,
        experience: role === 'worker' ? experience || '3-5 years' : null,
        companyName: role === 'business' ? companyName || '' : null,
        status: 'Active',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }

      await setDoc(doc(db, 'users', user.uid), userProfile)

      // Also create worker / business record if applicable
      if (role === 'worker') {
        await setDoc(doc(db, 'workers', user.uid), {
          id: user.uid,
          name: userProfile.name,
          phone: userProfile.phone,
          trade: userProfile.trade,
          experience: userProfile.experience,
          availability: 'available',
          hourlyRate: 250,
          kycStatus: 'pending',
          rating: 5.0,
          jobsCompleted: 0,
          createdAt: serverTimestamp()
        })
      } else if (role === 'business') {
        await setDoc(doc(db, 'businesses', user.uid), {
          id: user.uid,
          companyName: userProfile.companyName || userProfile.name,
          phone: userProfile.phone,
          verification: 'pending',
          activeJobs: 0,
          createdAt: serverTimestamp()
        })
      }

      const token = await user.getIdToken()
      const session = {
        uid: user.uid,
        name: userProfile.name,
        email: userProfile.email,
        phone: userProfile.phone,
        role: userProfile.role,
        trade: userProfile.trade,
        companyName: userProfile.companyName,
        authenticated: true,
      }

      saveActiveSession(session, token)
      return { success: true, session }
    } catch (error) {
      console.error('Firebase registration error:', error)
      let message = 'Registration failed. Please try again.'
      if (error.code === 'auth/email-already-in-use') message = 'This email address is already registered. Please sign in instead.'
      if (error.code === 'auth/weak-password') message = 'Password is too weak. Please use at least 6 characters.'
      if (error.code === 'auth/invalid-email') message = 'Please enter a valid email address.'
      return { success: false, error: message }
    }
  }

  // If Firebase client is not directly configured in browser, use backend REST API
  try {
    const res = await authApi.signup({
      email: email.trim(),
      password,
      name,
      phone,
      role: role || 'customer',
      trade,
      companyName,
      experience
    })

    if (res?.data?.user && res?.data?.token) {
      const u = res.data.user
      const session = {
        uid: u.id || u.uid,
        name: u.name,
        email: u.email,
        phone: u.phone,
        role: u.role,
        trade: u.trade,
        companyName: u.companyName,
        authenticated: true
      }
      saveActiveSession(session, res.data.token)
      return { success: true, session }
    }
    return { success: false, error: 'Registration failed. Please check server connection.' }
  } catch (backendErr) {
    if (backendErr?.status === 502 || backendErr?.message?.includes('502')) {
      return {
        success: false,
        error: 'Backend API server (port 5000) चालू नहीं है। कृपया दूसरे टर्मिनल में "cd backend" और फिर "npm start" चलाएं।'
      }
    }
    return {
      success: false,
      error: backendErr?.message || 'Registration service unavailable. Please check backend server.'
    }
  }
}

// Login with Email & Password
export async function loginUser({ email, password, role }) {
  if (isFirebaseConfigured && auth && db) {
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password)
      const user = cred.user

      const userDoc = await getDoc(doc(db, 'users', user.uid))
      if (!userDoc.exists()) {
        return { success: false, error: 'Account record not found in system.' }
      }

      const profile = userDoc.data()
      if (profile.status === 'Suspended') {
        await signOut(auth)
        return { success: false, error: 'This account has been suspended by administration. Please contact support.' }
      }

      const token = await user.getIdToken()
      const session = {
        uid: user.uid,
        name: profile.name || user.displayName || 'User',
        email: profile.email || user.email,
        phone: profile.phone || '',
        role: profile.role || role || 'customer',
        trade: profile.trade,
        companyName: profile.companyName,
        authenticated: true,
      }

      saveActiveSession(session, token)
      return { success: true, session }
    } catch (error) {
      console.error('Firebase login error:', error)
      let message = 'Invalid email or password.'
      if (error.code === 'auth/user-not-found') message = 'No account found with this email address.'
      if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') message = 'Incorrect password. Please try again.'
      if (error.code === 'auth/user-disabled') message = 'This account has been disabled.'
      return { success: false, error: message }
    }
  }

  // Backend REST API login when Firebase client is not directly embedded
  try {
    const res = await authApi.login({ email: email.trim(), password, role })
    if (res?.data?.user && res?.data?.token) {
      const u = res.data.user
      const session = {
        uid: u.id || u.uid,
        name: u.name,
        email: u.email,
        phone: u.phone,
        role: u.role,
        trade: u.trade,
        companyName: u.companyName,
        authenticated: true
      }
      saveActiveSession(session, res.data.token)
      return { success: true, session }
    }
    return { success: false, error: 'Invalid credentials.' }
  } catch (err) {
    if (err?.status === 502 || err?.message?.includes('502')) {
      return {
        success: false,
        error: 'Backend API server (port 5000) चालू नहीं है। कृपया दूसरे टर्मिनल में "cd backend" और फिर "npm start" चलाएं।'
      }
    }
    return { success: false, error: err?.message || 'Authentication service unreachable.' }
  }
}

// Google Authentication
export async function loginWithGoogle(defaultRole = 'customer') {
  if (isFirebaseConfigured && auth && googleProvider && db) {
    try {
      const cred = await signInWithPopup(auth, googleProvider)
      const user = cred.user

      const userRef = doc(db, 'users', user.uid)
      const userDoc = await getDoc(userRef)

      let profile = null
      if (userDoc.exists()) {
        profile = userDoc.data()
      } else {
        profile = {
          uid: user.uid,
          email: user.email,
          name: user.displayName || 'Google User',
          phone: user.phoneNumber || '',
          role: defaultRole,
          status: 'Active',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }
        await setDoc(userRef, profile)
      }

      if (profile.status === 'Suspended') {
        await signOut(auth)
        return { success: false, error: 'This account has been suspended.' }
      }

      const token = await user.getIdToken()
      const session = {
        uid: user.uid,
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        role: profile.role,
        trade: profile.trade,
        companyName: profile.companyName,
        authenticated: true,
      }

      saveActiveSession(session, token)
      return { success: true, session }
    } catch (error) {
      console.error('Google Auth error:', error)
      return { success: false, error: error.message || 'Google authentication failed.' }
    }
  }

  return {
    success: false,
    error: 'Google Sign-In is only available when Firebase client credentials are configured in .env'
  }
}

// Admin Authentication (Strictly Validated via Firebase / Backend)
export async function loginAdmin({ email, password }) {
  if (!email.trim() || !password) {
    return { success: false, error: 'Please enter admin credentials.' }
  }

  if (isFirebaseConfigured && auth && db) {
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password)
      const user = cred.user

      // Verify admin privileges in Firestore
      const adminDoc = await getDoc(doc(db, 'admins', user.uid))
      const userDoc = await getDoc(doc(db, 'users', user.uid))

      const isAdmin = (adminDoc.exists() && adminDoc.data().active) || (userDoc.exists() && userDoc.data().role === 'admin')

      if (!isAdmin) {
        await signOut(auth)
        return { success: false, error: 'Access denied. Account does not have administrative privileges.' }
      }

      const token = await user.getIdToken()
      const session = {
        uid: user.uid,
        name: userDoc.exists() ? userDoc.data().name : 'Super Admin',
        email: user.email,
        role: 'admin',
        authenticated: true,
        adminSince: new Date().toISOString(),
      }

      saveActiveSession(session, token)
      return { success: true, session }
    } catch (error) {
      console.error('Admin Auth error:', error)
      return { success: false, error: 'Invalid admin credentials. Access denied.' }
    }
  }

  // Backend admin authentication endpoint
  try {
    const res = await authApi.login({ email: email.trim(), password, role: 'admin' })
    if (res?.data?.user && res?.data?.token && res.data.user.role === 'admin') {
      const session = {
        uid: res.data.user.id || res.data.user.uid,
        name: res.data.user.name || 'Super Admin',
        email: res.data.user.email,
        role: 'admin',
        authenticated: true,
        adminSince: new Date().toISOString()
      }
      saveActiveSession(session, res.data.token)
      return { success: true, session }
    }
    return { success: false, error: 'Access denied. Invalid administrator credentials.' }
  } catch (err) {
    return { success: false, error: err?.message || 'Access denied. Invalid administrator credentials.' }
  }
}

// Logout
export async function logoutUser() {
  if (isFirebaseConfigured && auth) {
    try {
      await signOut(auth)
    } catch (err) {
      console.error('Error signing out from Firebase:', err)
    }
  }
  saveActiveSession(null)
}

// Real-time Auth State Listener
export function onAuthStateChangedListener(callback) {
  if (isFirebaseConfigured && auth) {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken()
        localStorage.setItem(TOKEN_KEY, token)
      }
      if (callback) callback(user)
    })
  }
  return () => {}
}
