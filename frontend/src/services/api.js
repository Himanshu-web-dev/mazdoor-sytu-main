// frontend/src/services/api.js
import { auth } from '../config/firebase'

const API_URL = import.meta.env.VITE_API_URL || '/api'

export async function getAuthToken() {
  if (auth?.currentUser) {
    try {
      const fbToken = await auth.currentUser.getIdToken()
      if (fbToken) return fbToken
    } catch {
      // ignore
    }
  }
  return localStorage.getItem('mazdoor_token') || localStorage.getItem('token') || ''
}

export async function apiRequest(path, options = {}) {
  const token = await getAuthToken()
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers
  })

  let data
  try {
    data = await response.json()
  } catch (err) {
    data = null
  }

  if (!response.ok) {
    const errorMsg = data?.message || data?.error || `Request failed with status ${response.status}`
    const error = new Error(errorMsg)
    error.status = response.status
    error.data = data
    throw error
  }

  return data
}

// ============================================================================
// Auth APIs
// ============================================================================
export const authApi = {
  signup: (data) => apiRequest('/v1/auth/signup', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => apiRequest('/v1/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  getMe: () => apiRequest('/v1/auth/me')
}

// ============================================================================
// Service / Rate Card APIs
// ============================================================================
export const serviceApi = {
  getServices: () => apiRequest('/v1/services'),
  getService: (id) => apiRequest(`/v1/services/${id}`)
}

// ============================================================================
// Booking APIs (9 standardized statuses)
// ============================================================================
export const bookingApi = {
  createBooking: (data) => apiRequest('/v1/bookings', { method: 'POST', body: JSON.stringify(data) }),
  getBooking: (id) => apiRequest(`/v1/bookings/${id}`),
  getMyBookings: (role) => apiRequest(`/v1/bookings/my-bookings${role ? `?role=${role}` : ''}`),
  updateStage: (id, stage, note = '') => apiRequest(`/v1/bookings/${id}/stage`, { method: 'POST', body: JSON.stringify({ stage, note }) }),
  cancelBooking: (id, reason) => apiRequest(`/v1/bookings/${id}/cancel`, { method: 'POST', body: JSON.stringify({ reason }) }),
  completeWithOtp: (id, otp) => apiRequest(`/v1/bookings/${id}/complete`, { method: 'POST', body: JSON.stringify({ otp }) })
}

// ============================================================================
// Estimate APIs (Two-step on-site diagnosis & customer approval)
// ============================================================================
export const estimateApi = {
  createEstimate: (data) => apiRequest('/v1/estimates', { method: 'POST', body: JSON.stringify(data) }),
  getByBooking: (bookingId) => apiRequest(`/v1/estimates/booking/${bookingId}`),
  handleApproval: (estimateId, approved) => apiRequest(`/v1/estimates/${estimateId}/approval`, { method: 'POST', body: JSON.stringify({ approved }) })
}

// ============================================================================
// Payment APIs (Canonical 'payments' collection)
// ============================================================================
export const paymentApi = {
  processPayment: (data) => apiRequest('/v1/payments/process', { method: 'POST', body: JSON.stringify(data) }),
  getPayment: (id) => apiRequest(`/v1/payments/${id}`)
}

// ============================================================================
// Wallet APIs (Single source of truth wallets/{userId})
// ============================================================================
export const walletApi = {
  getWallet: (userId) => apiRequest(userId ? `/v1/wallets/${userId}` : '/v1/wallets/my-wallet'),
  requestWithdrawal: (amount, bankDetails) => apiRequest('/v1/wallets/withdraw', { method: 'POST', body: JSON.stringify({ amount, bankDetails }) })
}

// ============================================================================
// Review APIs (Restricted to completed bookings)
// ============================================================================
export const reviewApi = {
  createReview: (data) => apiRequest('/v1/reviews', { method: 'POST', body: JSON.stringify(data) }),
  getWorkerReviews: (workerId) => apiRequest(`/v1/reviews/worker/${workerId}`)
}

// ============================================================================
// Job & Application APIs
// ============================================================================
export const jobApi = {
  listJobs: (filters = {}) => {
    const params = new URLSearchParams(filters).toString()
    return apiRequest(`/v1/jobs${params ? `?${params}` : ''}`)
  },
  getJob: (id) => apiRequest(`/v1/jobs/${id}`),
  createJob: (data) => apiRequest('/v1/jobs', { method: 'POST', body: JSON.stringify(data) }),
  applyJob: (data) => apiRequest('/v1/applications', { method: 'POST', body: JSON.stringify(data) }),
  getJobApplications: (jobId) => apiRequest(`/v1/applications/job/${jobId}`),
  updateApplicationStatus: (appId, status) => apiRequest(`/v1/applications/${appId}/status`, { method: 'PATCH', body: JSON.stringify({ status }) })
}

// ============================================================================
// Worker Profile & Availability APIs
// ============================================================================
export const workerApi = {
  search: (query = {}) => {
    const params = new URLSearchParams(query).toString()
    return apiRequest(`/v1/workers/search${params ? `?${params}` : ''}`)
  },
  getProfile: (id) => apiRequest(`/v1/workers/${id}`),
  updateProfile: (data) => apiRequest('/v1/workers/profile', { method: 'PUT', body: JSON.stringify(data) }),
  setAvailability: (availability) => apiRequest('/v1/workers/availability', { method: 'PUT', body: JSON.stringify({ availability }) })
}

// ============================================================================
// Business Profile & Requirement APIs
// ============================================================================
export const businessApi = {
  list: () => apiRequest('/v1/businesses'),
  getProfile: (id) => apiRequest(`/v1/businesses/${id}`),
  updateProfile: (data) => apiRequest('/v1/businesses/profile', { method: 'PUT', body: JSON.stringify(data) }),
  getRequirements: (id) => apiRequest(`/v1/businesses/${id}/requirements`)
}

// ============================================================================
// Complaint APIs
// ============================================================================
export const complaintApi = {
  createComplaint: (data) => apiRequest('/v1/complaints', { method: 'POST', body: JSON.stringify(data) }),
  getMyComplaints: () => apiRequest('/v1/complaints/my-complaints'),
  resolveComplaint: (id, note) => apiRequest(`/v1/complaints/${id}/resolve`, { method: 'PUT', body: JSON.stringify({ note }) })
}

// ============================================================================
// Notification APIs
// ============================================================================
export const notificationApi = {
  getNotifications: () => apiRequest('/v1/notifications'),
  markRead: (id) => apiRequest(`/v1/notifications/${id}/read`, { method: 'PUT' })
}

// ============================================================================
// Document KYC APIs
// ============================================================================
export const documentApi = {
  uploadKycDoc: (data) => apiRequest('/v1/documents/kyc', { method: 'POST', body: JSON.stringify(data) }),
  getMyDocuments: () => apiRequest('/v1/documents/my-docs')
}

// ============================================================================
// Message APIs
// ============================================================================
export const messageApi = {
  sendMessage: (data) => apiRequest('/v1/messages', { method: 'POST', body: JSON.stringify(data) }),
  getConversation: (otherUserId) => apiRequest(`/v1/messages/conversation/${otherUserId}`)
}

// ============================================================================
// Admin APIs
// ============================================================================
export const adminApi = {
  getDashboardStats: () => apiRequest('/v1/admin/dashboard-stats'),
  reviewKyc: (docId, status, note) => apiRequest(`/v1/admin/kyc/${docId}`, { method: 'PUT', body: JSON.stringify({ status, note }) }),
  listComplaints: () => apiRequest('/v1/admin/complaints')
}
