// src/services/authService.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db, googleProvider, isFirebaseConfigured } from '../config/firebase'

const SESSION_KEY = 'mazdoor_sytu_session_v1'
const LOCAL_USERS_KEY = 'mazdoor_sytu_users_v1'

// Helper to get stored session
export function getActiveSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

// Helper to save session
export function saveActiveSession(session) {
  try {
    if (session) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    } else {
      localStorage.removeItem(SESSION_KEY)
    }
  } catch (err) {
    console.error('Failed to save session:', err)
  }
}

// Register with Email & Password
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

      saveActiveSession(session)
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

  // Development simulated fallback when Firebase credentials are not yet configured
  let localUsers = []
  try {
    localUsers = JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || '[]')
  } catch {}

  const exists = localUsers.find((u) => u.email.toLowerCase() === email.trim().toLowerCase())
  if (exists) {
    return { success: false, error: 'This email address is already registered. Please log in.' }
  }

  const newUid = `USR-${Date.now().toString().slice(-6)}`
  const newAccount = {
    uid: newUid,
    name,
    email: email.trim().toLowerCase(),
    phone,
    role,
    trade: role === 'worker' ? trade : undefined,
    companyName: role === 'business' ? companyName : undefined,
    status: 'Active',
  }

  localUsers.push({ ...newAccount, password })
  try {
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(localUsers))
  } catch {}

  const session = { ...newAccount, authenticated: true }
  saveActiveSession(session)
  return { success: true, session }
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

      saveActiveSession(session)
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

  // Development simulated fallback
  let localUsers = []
  try {
    localUsers = JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || '[]')
  } catch {}

  const user = localUsers.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
  )

  if (user) {
    if (user.status === 'Suspended') {
      return { success: false, error: 'This account has been suspended by administration.' }
    }
    const session = {
      uid: user.uid,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role || role,
      trade: user.trade,
      companyName: user.companyName,
      authenticated: true,
    }
    saveActiveSession(session)
    return { success: true, session }
  }

  return { success: false, error: 'Invalid email address or password.' }
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

      saveActiveSession(session)
      return { success: true, session }
    } catch (error) {
      console.error('Google Auth error:', error)
      return { success: false, error: error.message || 'Google authentication failed.' }
    }
  }

  // Simulated Google Sign-In in dev
  const session = {
    uid: `GGL-${Date.now().toString().slice(-6)}`,
    name: defaultRole === 'worker' ? 'Rahul Kumar' : defaultRole === 'business' ? 'Apex Infra' : 'Riya Kapoor',
    email: 'user@google.com',
    phone: '+91 98765 43210',
    role: defaultRole,
    authenticated: true,
  }
  saveActiveSession(session)
  return { success: true, session }
}

// Admin Authentication (Strictly Validated, No Hardcoded Fallback in Production)
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

      const session = {
        uid: user.uid,
        name: 'Super Admin',
        email: user.email,
        role: 'admin',
        authenticated: true,
        adminSince: new Date().toISOString(),
      }

      saveActiveSession(session)
      return { success: true, session }
    } catch (error) {
      console.error('Admin Auth error:', error)
      return { success: false, error: 'Invalid admin credentials. Access denied.' }
    }
  }

  // When Firebase is not configured, check secure environment variables
  const envAdminEmail = import.meta.env.VITE_ADMIN_EMAIL
  const envAdminPassword = import.meta.env.VITE_ADMIN_PASSWORD

  if (
    envAdminEmail &&
    envAdminPassword &&
    email.trim().toLowerCase() === envAdminEmail.toLowerCase() &&
    password === envAdminPassword
  ) {
    const session = {
      uid: 'ADMIN-ROOT',
      name: 'Super Admin',
      email: envAdminEmail,
      role: 'admin',
      authenticated: true,
      adminSince: new Date().toISOString(),
    }
    saveActiveSession(session)
    return { success: true, session }
  }

  return { success: false, error: 'Access denied. Invalid administrator credentials.' }
}

// Logout
export async function logoutUser() {
  if (isFirebaseConfigured && auth) {
    try {
      await signOut(auth)
    } catch (err) {
      console.error('Error signing out:', err)
    }
  }
  saveActiveSession(null)
}
