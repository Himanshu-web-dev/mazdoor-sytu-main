// Mazdoor Sytu - Centralized Admin Platform Store
// Manages platform-wide users, workers, businesses, KYC queue, disputes, reviews, and financial ledger.

const ADMIN_STORAGE_KEY = 'mazdoor_setu_admin_store_v1'

const INITIAL_USERS = [
  {
    id: 'USR-101',
    name: 'Riya Kapoor',
    phone: '+91 98101 22334',
    email: 'riya.kapoor@example.com',
    city: 'Meerut, UP',
    joinedDate: '12 Jan 2026',
    status: 'Active',
    totalBookings: 8,
    totalSpent: '₹4,320',
    walletBalance: '₹4,850',
  },
  {
    id: 'USR-102',
    name: 'Anita Sharma',
    phone: '+91 98712 34567',
    email: 'anita.sharma@example.com',
    city: 'Meerut, UP',
    joinedDate: '03 Feb 2026',
    status: 'Active',
    totalBookings: 14,
    totalSpent: '₹9,840',
    walletBalance: '₹1,200',
  },
  {
    id: 'USR-103',
    name: 'Rohit Verma',
    phone: '+91 99234 56789',
    email: 'rohit.verma@example.com',
    city: 'Meerut, UP',
    joinedDate: '18 Feb 2026',
    status: 'Active',
    totalBookings: 5,
    totalSpent: '₹3,450',
    walletBalance: '₹850',
  },
  {
    id: 'USR-104',
    name: 'Kunal Singhal',
    phone: '+91 97110 88219',
    email: 'kunal.singhal@example.com',
    city: 'Ghaziabad, NCR',
    joinedDate: '01 Mar 2026',
    status: 'Suspended',
    totalBookings: 2,
    totalSpent: '₹1,100',
    walletBalance: '₹0',
    suspensionReason: 'Payment chargeback dispute',
  },
  {
    id: 'USR-105',
    name: 'Pooja Jain',
    phone: '+91 98450 11992',
    email: 'pooja.jain@example.com',
    city: 'Meerut, UP',
    joinedDate: '15 Mar 2026',
    status: 'Active',
    totalBookings: 11,
    totalSpent: '₹7,620',
    walletBalance: '₹2,400',
  },
  {
    id: 'USR-106',
    name: 'Suresh Chandra',
    phone: '+91 98370 44211',
    email: 'suresh.c@example.com',
    city: 'Noida, NCR',
    joinedDate: '22 Mar 2026',
    status: 'Active',
    totalBookings: 6,
    totalSpent: '₹5,100',
    walletBalance: '₹600',
  }
]

const INITIAL_WORKERS = [
  {
    id: 'WRK-201',
    name: 'Rahul Kumar',
    trade: 'Electrician',
    phone: '+91 98765 43210',
    email: 'rahul.kumar@example.com',
    city: 'Meerut & NCR',
    experience: '5 Years',
    rating: 4.9,
    jobsCompleted: 64,
    kycStatus: 'Verified',
    status: 'Active',
    aadhaarNo: '•••• •••• 8492',
    joinedDate: '10 Jan 2026',
    hourlyRate: '₹250/hr',
    badge: 'Elite Pro'
  },
  {
    id: 'WRK-202',
    name: 'Amit Sharma',
    trade: 'Plumber',
    phone: '+91 98765 12345',
    email: 'amit.sharma@example.com',
    city: 'Meerut',
    experience: '7 Years',
    rating: 4.9,
    jobsCompleted: 184,
    kycStatus: 'Verified',
    status: 'Active',
    aadhaarNo: '•••• •••• 3291',
    joinedDate: '05 Jan 2026',
    hourlyRate: '₹300/hr',
    badge: 'Top Rated'
  },
  {
    id: 'WRK-203',
    name: 'Dinesh Yadav',
    trade: 'Mason & Brickwork',
    phone: '+91 98188 77610',
    email: 'dinesh.yadav@example.com',
    city: 'Ghaziabad',
    experience: '8 Years',
    rating: 4.7,
    jobsCompleted: 92,
    kycStatus: 'Pending',
    status: 'Active',
    aadhaarNo: '•••• •••• 7120',
    joinedDate: '18 Sep 2026',
    hourlyRate: '₹350/hr',
    badge: 'Under Review'
  },
  {
    id: 'WRK-204',
    name: 'Vikas Prajapati',
    trade: 'Carpenter',
    phone: '+91 97190 22345',
    email: 'vikas.p@example.com',
    city: 'Meerut',
    experience: '4 Years',
    rating: 4.6,
    jobsCompleted: 38,
    kycStatus: 'Pending',
    status: 'Active',
    aadhaarNo: '•••• •••• 5590',
    joinedDate: '20 Sep 2026',
    hourlyRate: '₹280/hr',
    badge: 'Under Review'
  },
  {
    id: 'WRK-205',
    name: 'Manoj Chauhan',
    trade: 'Painter & Finisher',
    phone: '+91 99270 33412',
    email: 'manoj.c@example.com',
    city: 'Noida',
    experience: '6 Years',
    rating: 4.8,
    jobsCompleted: 110,
    kycStatus: 'Verified',
    status: 'Active',
    aadhaarNo: '•••• •••• 9912',
    joinedDate: '14 Feb 2026',
    hourlyRate: '₹260/hr',
    badge: 'Verified'
  },
  {
    id: 'WRK-206',
    name: 'Rameshwar Pal',
    trade: 'Welder & Fabricator',
    phone: '+91 98371 99012',
    email: 'rameshwar.pal@example.com',
    city: 'Meerut',
    experience: '9 Years',
    rating: 4.5,
    jobsCompleted: 45,
    kycStatus: 'Rejected',
    status: 'Suspended',
    aadhaarNo: '•••• •••• 1042',
    joinedDate: '02 Mar 2026',
    hourlyRate: '₹320/hr',
    badge: 'KYC Flagged',
    rejectionReason: 'Blurry government document submission'
  }
]

const INITIAL_BUSINESSES = [
  {
    id: 'BIZ-301',
    companyName: 'Apex Infra Projects Ltd.',
    contactPerson: 'Vikram Malhotra',
    email: 'vikram.m@apexinfra.com',
    phone: '+91 98110 55432',
    gstNo: '09AAACA1234F1Z5',
    city: 'Meerut / Noida',
    activeJobs: 4,
    totalHired: 42,
    status: 'Active',
    joinedDate: '15 Dec 2025',
    verification: 'Verified'
  },
  {
    id: 'BIZ-302',
    companyName: 'BuildWell Constructions & Infra',
    contactPerson: 'Sanjay Aggarwal',
    email: 'sanjay@buildwell.in',
    phone: '+91 98220 99876',
    gstNo: '09AABCB5678G2Z1',
    city: 'Greater Noida',
    activeJobs: 3,
    totalHired: 28,
    status: 'Active',
    joinedDate: '10 Jan 2026',
    verification: 'Verified'
  },
  {
    id: 'BIZ-303',
    companyName: 'UrbanFit Modular Interiors',
    contactPerson: 'Nidhi Singhal',
    email: 'careers@urbanfit.design',
    phone: '+91 98102 44321',
    gstNo: '07AAACU9876H1Z8',
    city: 'Delhi NCR',
    activeJobs: 2,
    totalHired: 16,
    status: 'Active',
    joinedDate: '01 Feb 2026',
    verification: 'Verified'
  },
  {
    id: 'BIZ-304',
    companyName: 'Shiv Shakti Warehousing Hub',
    contactPerson: 'Mahesh Tyagi',
    email: 'ops@shivshaktiwh.com',
    phone: '+91 99170 33211',
    gstNo: '09AAECS3321K1Z3',
    city: 'Meerut Bypass',
    activeJobs: 1,
    totalHired: 35,
    status: 'Active',
    joinedDate: '20 Feb 2026',
    verification: 'Verified'
  },
  {
    id: 'BIZ-305',
    companyName: 'Delta MEP Services Pvt Ltd',
    contactPerson: 'Gaurav K.',
    email: 'admin@deltamep.com',
    phone: '+91 98188 12340',
    gstNo: '07AABCD8821M1Z4',
    city: 'Noida',
    activeJobs: 0,
    totalHired: 4,
    status: 'Suspended',
    joinedDate: '05 Mar 2026',
    verification: 'Pending',
    suspensionReason: 'GST validation failure'
  }
]

const INITIAL_KYC_QUEUE = [
  {
    id: 'KYC-501',
    workerId: 'WRK-203',
    name: 'Dinesh Yadav',
    trade: 'Mason & Brickwork',
    phone: '+91 98188 77610',
    aadhaarNo: '4821 9021 7120',
    docType: 'Aadhaar Card + Experience Letter',
    submittedDate: '18 Sep 2026 • 11:30 AM',
    status: 'Pending',
    notes: 'Uploaded both sides of Aadhaar and contractor endorsement letter.',
    docFront: 'Aadhaar Card (Front Verified)',
    docBack: 'Aadhaar Card (Back Verified)',
    tradeCert: 'UP Skill Dev Masonry Certificate'
  },
  {
    id: 'KYC-502',
    workerId: 'WRK-204',
    name: 'Vikas Prajapati',
    trade: 'Carpenter',
    phone: '+91 97190 22345',
    aadhaarNo: '3310 9980 5590',
    docType: 'Aadhaar Card + Trade ITI Diploma',
    submittedDate: '20 Sep 2026 • 04:15 PM',
    status: 'Pending',
    notes: 'ITI Carpenter diploma attached. Address matches Meerut jurisdiction.',
    docFront: 'Aadhaar Card (Clear)',
    docBack: 'Aadhaar Card (Clear)',
    tradeCert: 'ITI National Trade Certificate (Carpentry)'
  },
  {
    id: 'KYC-503',
    workerId: 'WRK-206',
    name: 'Rameshwar Pal',
    trade: 'Welder & Fabricator',
    phone: '+91 98371 99012',
    aadhaarNo: '7721 4410 1042',
    docType: 'Aadhaar Card',
    submittedDate: '02 Mar 2026 • 10:00 AM',
    status: 'Rejected',
    notes: 'Document edges were cropped, Aadhaar number obscured by flash reflection.',
    docFront: 'Cropped ID',
    docBack: 'Missing',
    tradeCert: 'None provided'
  }
]

const INITIAL_COMPLAINTS = [
  {
    id: 'CMP-701',
    raisedBy: 'Kunal Singhal (Customer)',
    against: 'Worker #WRK-182 (Tile Layer)',
    subject: 'Worker arrived 2 hours late and incomplete work',
    category: 'Service Quality',
    priority: 'High',
    status: 'Open',
    date: '20 Sep 2026',
    description: 'Booking #BK-860. The worker arrived late and did not complete tile grout sealing, leaving work half done.',
    assignedAdmin: 'Super Admin',
    resolutionNote: ''
  },
  {
    id: 'CMP-702',
    raisedBy: 'Apex Infra Projects (Business)',
    against: 'Worker #WRK-219 (Helper)',
    subject: 'Repeated unexcused absence on construction site',
    category: 'Attendance & Reliability',
    priority: 'Medium',
    status: 'Under Review',
    date: '19 Sep 2026',
    description: 'Worker accepted 3-day shift assignment but did not report on Day 2 without informing supervisor.',
    assignedAdmin: 'Super Admin',
    resolutionNote: 'Contacted worker; claimed family emergency. Warning issued.'
  },
  {
    id: 'CMP-703',
    raisedBy: 'Amit Sharma (Worker)',
    against: 'Customer #USR-089',
    subject: 'Unreasonable extra work demanded without extra pay',
    category: 'Scope & Payment Dispute',
    priority: 'Medium',
    status: 'Resolved',
    date: '15 Sep 2026',
    description: 'Customer requested 2 additional pipeline fittings outside agreed scope and refused to adjust fare.',
    assignedAdmin: 'Super Admin',
    resolutionNote: 'Fare adjustment of ₹300 mediated and disbursed to worker wallet.'
  },
  {
    id: 'CMP-704',
    raisedBy: 'Pooja Jain (Customer)',
    against: 'Appliance Tech',
    subject: 'Overcharge request outside platform',
    category: 'Platform Policy Violation',
    priority: 'High',
    status: 'Open',
    date: '22 Sep 2026',
    description: 'Technician requested direct UPI payment of ₹500 extra instead of billing through Mazdoor Sytu invoice.',
    assignedAdmin: 'Super Admin',
    resolutionNote: ''
  }
]

const INITIAL_REVIEWS = [
  {
    id: 'REV-801',
    author: 'Neha Gupta',
    target: 'Rahul Kumar (Electrician)',
    role: 'Customer',
    rating: 5,
    comment: 'Punctual, professional and solved the issue in one visit. Very neat work.',
    date: '21 Sep 2026',
    flagged: false,
    status: 'Approved'
  },
  {
    id: 'REV-802',
    author: 'Kamal Singh',
    target: 'Rahul Kumar (Electrician)',
    role: 'Customer',
    rating: 5,
    comment: 'Recommended. Quick response, good communication and reasonable price.',
    date: '18 Sep 2026',
    flagged: false,
    status: 'Approved'
  },
  {
    id: 'REV-803',
    author: 'Sunil Mehta',
    target: 'Amit Sharma (Plumber)',
    role: 'Customer',
    rating: 5,
    comment: 'Fixed high-pressure leakage in bathroom within 25 minutes. Genuine spare parts used.',
    date: '16 Sep 2026',
    flagged: false,
    status: 'Approved'
  },
  {
    id: 'REV-804',
    author: 'Anonymous User',
    target: 'Manoj Chauhan (Painter)',
    role: 'Customer',
    rating: 1,
    comment: 'Total fraud and scam do not book call 98765xxxxx for external cheaper service!!',
    date: '14 Sep 2026',
    flagged: true,
    status: 'Hidden'
  },
  {
    id: 'REV-805',
    author: 'Pooja Jain',
    target: 'Rahul Verma (AC Tech)',
    role: 'Customer',
    rating: 4,
    comment: 'Great repair job. The worker explained everything clearly and cleaned up after the work.',
    date: '10 Sep 2026',
    flagged: false,
    status: 'Approved'
  }
]

const INITIAL_PAYMENTS = [
  {
    id: 'TXN-901',
    ref: 'BK-902',
    party: 'Riya Kapoor → Amit Sharma',
    type: 'Booking Settlement',
    amount: '₹380',
    platformFee: '₹38',
    workerPayout: '₹342',
    paymentMethod: 'Wallet UPI',
    date: '23 Sep 2026 • 03:45 PM',
    status: 'Completed'
  },
  {
    id: 'TXN-902',
    ref: 'BIZ-PAY-108',
    party: 'Apex Infra Projects → 6 Workers',
    type: 'Business Batch Payroll',
    amount: '₹34,800',
    platformFee: '₹1,740',
    workerPayout: '₹33,060',
    paymentMethod: 'Corporate NetBanking',
    date: '22 Sep 2026 • 11:20 AM',
    status: 'Completed'
  },
  {
    id: 'TXN-903',
    ref: 'BK-894',
    party: 'Riya Kapoor → Rahul Verma',
    type: 'Advance Escrow Hold',
    amount: '₹850',
    platformFee: '₹85',
    workerPayout: '₹765',
    paymentMethod: 'Mazdoor Wallet',
    date: '23 Sep 2026 • 01:10 PM',
    status: 'In Escrow'
  },
  {
    id: 'TXN-904',
    ref: 'WTH-441',
    party: 'Rahul Kumar (Worker)',
    type: 'Bank Withdrawal Payout',
    amount: '₹3,400',
    platformFee: '₹0',
    workerPayout: '₹3,400',
    paymentMethod: 'IMPS to HDFC••••7591',
    date: '21 Sep 2026 • 06:15 PM',
    status: 'Completed'
  },
  {
    id: 'TXN-905',
    ref: 'RFD-102',
    party: 'Kunal Singhal',
    type: 'Customer Booking Refund',
    amount: '₹650',
    platformFee: '-₹65',
    workerPayout: '₹0',
    paymentMethod: 'Original Source (UPI)',
    date: '20 Sep 2026 • 08:30 PM',
    status: 'Refunded'
  }
]

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
      totalVolume: '₹14.82 Lakhs',
      platformCommission: '₹1.18 Lakhs',
      monthlyGrowth: '+22.4%',
      activeWorkersToday: 148,
      verifiedWorkerPercent: 92,
      openDisputesCount: 2
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
