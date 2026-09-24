// Mazdoor Sytu - Centralized Customer Portal Data Store
// Manages Bookings, Workers, Wallet, Messages, Reviews, Notifications, Profile, and Support

const STORAGE_KEY = 'mazdoor_setu_customer_data_v2'

const INITIAL_BOOKINGS = []
const INITIAL_WORKERS = []
const INITIAL_WALLET = { balance: 0, pending: 0, transactions: [] }
const INITIAL_MESSAGES = { conversations: [], threads: {} }
const INITIAL_REVIEWS = []
const INITIAL_NOTIFICATIONS = []
const INITIAL_PROFILE = {
  name: '',
  email: '',
  phone: '',
  city: 'Meerut',
  addresses: []
}
const INITIAL_SUPPORT = {
  tickets: [],
  faqs: [
    {
      q: 'How does the ₹99 booking advance work?',
      a: 'The ₹99 advance fee confirms your booking instantly and reserves a verified technician. Upon arrival, this entire ₹99 is 100% adjusted against your confirmed final bill.'
    },
    {
      q: 'Are workers background verified?',
      a: 'Yes! Every worker on Mazdoor Sytu undergoes verification: Aadhaar identity KYC, trade skill assessment, and continuous customer rating audits.'
    },
    {
      q: 'How does payment and wallet refund work?',
      a: 'You can pay using UPI, Cards, or Net Banking. Any cancellation refunds are processed as per the 4-tier transparent refund policy.'
    }
  ]
}

// -----------------------------------------------------------------------------
// Store Management & Persistence
// -----------------------------------------------------------------------------

export function loadCustomerStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return {
        bookings: parsed.bookings || INITIAL_BOOKINGS,
        workers: parsed.workers || INITIAL_WORKERS,
        wallet: parsed.wallet || INITIAL_WALLET,
        messages: parsed.messages || INITIAL_MESSAGES,
        reviews: parsed.reviews || INITIAL_REVIEWS,
        notifications: parsed.notifications || INITIAL_NOTIFICATIONS,
        profile: parsed.profile || INITIAL_PROFILE,
        support: parsed.support || INITIAL_SUPPORT,
        selectedBookingId: parsed.selectedBookingId || null
      }
    }
  } catch (err) {
    console.error('Error reading customer store:', err)
  }

  const initial = {
    bookings: INITIAL_BOOKINGS,
    workers: INITIAL_WORKERS,
    wallet: INITIAL_WALLET,
    messages: INITIAL_MESSAGES,
    reviews: INITIAL_REVIEWS,
    notifications: INITIAL_NOTIFICATIONS,
    profile: INITIAL_PROFILE,
    support: INITIAL_SUPPORT,
    selectedBookingId: null
  }
  saveCustomerStore(initial)
  return initial
}

export function saveCustomerStore(store) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  } catch (err) {
    console.error('Error saving customer store:', err)
  }
}

// -----------------------------------------------------------------------------
// Action Helpers
// -----------------------------------------------------------------------------

export function setSelectedBooking(bookingId) {
  const store = loadCustomerStore()
  store.selectedBookingId = bookingId
  saveCustomerStore(store)
  return store
}

export function createBooking({ worker, service, date, time, address, note, amount, workerId, workerPhone }) {
  const store = loadCustomerStore()
  const nextNum = 900 + Math.floor(Math.random() * 90) + 1
  const id = `BK-${nextNum}`
  const otp = String(Math.floor(1000 + Math.random() * 9000))
  const amountNum = typeof amount === 'number' ? amount : parseInt(String(amount || 350).replace(/\D/g, ''), 10) || 350

  const isToday = (date || '').toLowerCase().includes('today') || (date || '').toLowerCase().includes('real-time')

  const newBooking = {
    id,
    service: service || 'Skilled Home Service',
    category: worker?.trade || worker?.service || 'Technician',
    worker: worker?.name || 'Assigned Technician',
    workerId: workerId || worker?.id || worker?.uid || null,
    workerRole: worker?.trade || 'Certified Professional',
    workerPhone: workerPhone || worker?.phone || '',
    workerRating: worker?.rating || 5.0,
    workerJobs: worker?.jobs || 0,
    date: date || 'Today',
    time: time || 'Immediate',
    status: isToday ? 'Real-Time' : 'Confirmed',
    displayStatus: isToday ? 'Worker assigned' : 'Booking confirmed',
    eta: isToday ? '15–20 minutes' : 'Scheduled time',
    distance: '2.5 km away',
    location: address || 'Customer Address',
    landmark: 'Doorstep',
    amount: `₹${amountNum}`,
    amountNum,
    otp,
    description: note || 'Doorstep service appointment.',
    pricing: {
      advancePaid: 99,
      baseFare: amountNum - 99 > 0 ? amountNum - 99 : amountNum,
      spareParts: 0,
      total: amountNum
    },
    timelineIndex: 1,
    paymentStatus: '₹99 Advance Paid Online',
    rated: false,
    createdAt: new Date().toISOString()
  }

  store.bookings = [newBooking, ...store.bookings]
  store.selectedBookingId = id

  store.notifications = [
    {
      id: `NT-${Date.now()}`,
      title: 'Booking Confirmed!',
      detail: `Your booking #${id} for ${newBooking.service} is confirmed. 4-digit verification OTP: ${otp}.`,
      category: 'Booking',
      time: 'Just now',
      unread: true,
      targetPath: '/customer/booking-details',
      bookingId: id
    },
    ...store.notifications
  ]

  saveCustomerStore(store)
  return { store, newBooking }
}

export function cancelBooking(bookingId, reason = '') {
  const store = loadCustomerStore()
  const booking = store.bookings.find((b) => b.id === bookingId)
  if (booking) {
    booking.status = 'Cancelled'
    booking.displayStatus = 'Cancelled by Customer'
    booking.cancellationReason = reason
    booking.cancelledAt = new Date().toISOString()

    store.notifications = [
      {
        id: `NT-${Date.now()}`,
        title: 'Booking Cancelled',
        detail: `Booking #${bookingId} has been cancelled. Refund processed as per 4-tier cancellation policy.`,
        category: 'Booking',
        time: 'Just now',
        unread: true,
        targetPath: '/customer/bookings',
        bookingId
      },
      ...store.notifications
    ]

    saveCustomerStore(store)
  }
  return store
}

export function addWalletFunds(amount, method = 'UPI') {
  const store = loadCustomerStore()
  const num = parseInt(amount, 10) || 500
  store.wallet.balance += num
  store.wallet.transactions = [
    {
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      title: `Wallet Top-Up via ${method}`,
      amount: num,
      type: 'credit',
      date: 'Just now',
      status: 'Completed',
      method,
      category: 'Top-Up'
    },
    ...store.wallet.transactions
  ]

  store.notifications = [
    {
      id: `NT-${Date.now()}`,
      title: `₹${num} Added to Mazdoor Wallet`,
      detail: `Your wallet balance is now ₹${store.wallet.balance}. Ready to use for instant bookings.`,
      category: 'Payments',
      time: 'Just now',
      unread: true,
      targetPath: '/customer/wallet',
      bookingId: null
    },
    ...store.notifications
  ]

  saveCustomerStore(store)
  return store
}

export function submitReview({ workerId, workerName, service, bookingId, rating, comment, tags }) {
  const store = loadCustomerStore()
  const newReview = {
    id: `REV-${Date.now()}`,
    workerId,
    workerName,
    service,
    bookingId,
    rating: Number(rating) || 5,
    date: 'Just now',
    comment: comment || 'Very polite, skilled, and finished the work with great precision.',
    tags: tags && tags.length ? tags : ['Punctual', 'Skilled Work', 'Polite'],
    workerResponse: 'Thank you for your valuable rating and feedback!'
  }

  const booking = store.bookings.find((b) => b.id === bookingId)
  if (booking) {
    booking.rated = true
    booking.userRating = newReview.rating
    booking.userFeedback = newReview.comment
  }

  store.reviews = [newReview, ...store.reviews]
  saveCustomerStore(store)
  return store
}

export function sendChatMessage(convId, text) {
  const store = loadCustomerStore()
  const thread = store.messages.threads[convId] || []
  const newMsg = {
    id: `m-${Date.now()}`,
    from: 'customer',
    text,
    time: 'Just now'
  }
  store.messages.threads[convId] = [...thread, newMsg]

  const conv = store.messages.conversations.find((c) => c.id === convId)
  if (conv) {
    conv.lastMessage = text
    conv.time = 'Just now'
  }

  saveCustomerStore(store)
  return store
}

export function addAddress(address) {
  const store = loadCustomerStore()
  const id = `ADDR-${Date.now()}`
  const newAddr = { ...address, id }
  if (newAddr.isDefault) {
    store.profile.addresses.forEach((a) => { a.isDefault = false })
  }
  store.profile.addresses = [...store.profile.addresses, newAddr]
  saveCustomerStore(store)
  return store
}

export function updateProfileDetails(profileUpdates) {
  const store = loadCustomerStore()
  store.profile = { ...store.profile, ...profileUpdates }
  saveCustomerStore(store)
  return store
}

export function createSupportTicket({ subject, category, bookingId, message }) {
  const store = loadCustomerStore()
  const ticketId = `MS-TKT-${Math.floor(100 + Math.random() * 900)}`
  const newTicket = {
    id: ticketId,
    subject: subject || 'Help with booking or payment',
    bookingId: bookingId || 'General inquiry',
    category: category || 'Booking Issue',
    status: 'Open',
    createdDate: 'Just now',
    lastUpdate: 'Ticket registered & assigned to priority queue',
    priority: 'Normal',
    conversation: [
      { from: 'customer', text: message || 'I need assistance regarding this request.', time: 'Just now' },
      { from: 'support', text: 'Namaste! We have received your ticket. A support executive will respond shortly.', time: 'Just now' }
    ]
  }
  store.support.tickets = [newTicket, ...store.support.tickets]
  saveCustomerStore(store)
  return { store, newTicket }
}
