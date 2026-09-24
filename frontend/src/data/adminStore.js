// Mazdoor Sytu - Centralized Admin Platform Store
// Manages platform-wide users, workers, businesses, KYC queue, disputes, reviews, and financial ledger.

const ADMIN_STORAGE_KEY = 'mazdoor_setu_admin_store_v1'

const INITIAL_USERS = []
const INITIAL_WORKERS = []
const INITIAL_BUSINESSES = []
const INITIAL_KYC_QUEUE = []
const INITIAL_COMPLAINTS = []
const INITIAL_REVIEWS = []
const INITIAL_PAYMENTS = []

export function getAdminStore() {
  try {
    const raw = localStorage.getItem(ADMIN_STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch (e) {
    console.error('Failed to parse admin store:', e)
  }

  const initial = {
    users: INITIAL_USERS,
    workers: INITIAL_WORKERS,
    businesses: INITIAL_BUSINESSES,
    kycQueue: INITIAL_KYC_QUEUE,
    complaints: INITIAL_COMPLAINTS,
    reviews: INITIAL_REVIEWS,
    payments: INITIAL_PAYMENTS,
    stats: {
      totalVolume: '₹0',
      platformCommission: '₹0',
      monthlyGrowth: '0%',
      activeWorkersToday: 0,
      verifiedWorkerPercent: 0,
      openDisputesCount: 0
    }
  }

  localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(initial))
  return initial
}

export function saveAdminStore(store) {
  try {
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(store))
    window.dispatchEvent(new Event('admin_store_updated'))
  } catch (e) {
    console.error('Failed to save admin store:', e)
  }
}

// User Actions
export function toggleUserStatus(userId) {
  const store = getAdminStore()
  store.users = store.users.map((u) => {
    if (u.id === userId) {
      return { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' }
    }
    return u
  })
  saveAdminStore(store)
  return store
}

// Worker Actions
export function toggleWorkerStatus(workerId) {
  const store = getAdminStore()
  store.workers = store.workers.map((w) => {
    if (w.id === workerId) {
      return { ...w, status: w.status === 'Active' ? 'Suspended' : 'Active' }
    }
    return w
  })
  saveAdminStore(store)
  return store
}

export function approveWorkerKyc(workerId) {
  const store = getAdminStore()
  store.workers = store.workers.map((w) => {
    if (w.id === workerId) {
      return { ...w, kycStatus: 'Verified', badge: 'Verified' }
    }
    return w
  })
  store.kycQueue = store.kycQueue.map((k) => {
    if (k.workerId === workerId) {
      return { ...k, status: 'Approved' }
    }
    return k
  })
  saveAdminStore(store)
  return store
}

export function rejectWorkerKyc(workerId, reason) {
  const store = getAdminStore()
  store.workers = store.workers.map((w) => {
    if (w.id === workerId) {
      return { ...w, kycStatus: 'Rejected', badge: 'KYC Flagged', rejectionReason: reason }
    }
    return w
  })
  store.kycQueue = store.kycQueue.map((k) => {
    if (k.workerId === workerId) {
      return { ...k, status: 'Rejected', notes: `Rejected: ${reason}` }
    }
    return k
  })
  saveAdminStore(store)
  return store
}

// Business Actions
export function toggleBusinessStatus(bizId) {
  const store = getAdminStore()
  store.businesses = store.businesses.map((b) => {
    if (b.id === bizId) {
      return { ...b, status: b.status === 'Active' ? 'Suspended' : 'Active' }
    }
    return b
  })
  saveAdminStore(store)
  return store
}

// Complaint Actions
export function updateComplaintStatus(complaintId, status, resolutionNote = '') {
  const store = getAdminStore()
  store.complaints = store.complaints.map((c) => {
    if (c.id === complaintId) {
      return { ...c, status, resolutionNote: resolutionNote || c.resolutionNote }
    }
    return c
  })
  saveAdminStore(store)
  return store
}

// Review Moderation
export function toggleReviewStatus(reviewId) {
  const store = getAdminStore()
  store.reviews = store.reviews.map((r) => {
    if (r.id === reviewId) {
      const nextStatus = r.status === 'Approved' ? 'Hidden' : 'Approved'
      return { ...r, status: nextStatus, flagged: nextStatus === 'Hidden' }
    }
    return r
  })
  saveAdminStore(store)
  return store
}
