// Mazdoor Sytu - Centralized Customer Portal Data Store
// Manages Bookings (8 statuses), Workers, Wallet, Messages, Reviews, Notifications, Profile, and Support

const STORAGE_KEY = 'mazdoor_setu_customer_data_v2'

const INITIAL_BOOKINGS = [
  {
    id: 'BK-902',
    service: 'Plumbing Leakage & Pipe Repair',
    category: 'Plumber',
    worker: 'Amit Sharma',
    workerRole: 'Senior Licensed Plumber',
    workerPhone: '+91 98765 12345',
    workerRating: 4.9,
    workerJobs: 184,
    date: 'Today, 23 Sep 2026',
    time: '3:30 PM',
    status: 'Real-Time', // Matches "Real-Time" tab
    displayStatus: 'Worker en route',
    eta: '10–12 minutes',
    distance: '1.8 km away',
    location: 'B-42, Shastri Nagar, Meerut',
    landmark: 'Near Central Park',
    amount: '₹380',
    amountNum: 380,
    otp: '4829',
    description: 'Main bathroom inlet pipe joint has an active water leak causing water pressure loss. Needs instant seal replacement.',
    pricing: { baseFare: 250, spareParts: 130, platformFee: 0, discount: 0, total: 380 },
    timelineIndex: 2, // 0: Confirmed, 1: Worker Assigned, 2: En Route, 3: Arrived, 4: Work Started, 5: Completed
    paymentStatus: 'Paid via Mazdoor Wallet',
    rated: false
  },
  {
    id: 'BK-894',
    service: 'Split AC Servicing & Gas Top-up',
    category: 'Appliance Tech',
    worker: 'Rahul Verma',
    workerRole: 'Certified HVAC & AC Specialist',
    workerPhone: '+91 98234 56789',
    workerRating: 4.8,
    workerJobs: 130,
    date: 'Tomorrow, 24 Sep 2026',
    time: '10:00 AM',
    status: 'Scheduled', // Matches "Scheduled" tab
    displayStatus: 'Scheduled for tomorrow',
    eta: 'Tomorrow morning',
    distance: '3.2 km away',
    location: 'B-42, Shastri Nagar, Meerut',
    landmark: 'Near Central Park',
    amount: '₹850',
    amountNum: 850,
    otp: '6219',
    description: '1.5 ton Inverter AC cooling coil cleaning, filter wash, and refrigerant pressure inspection.',
    pricing: { baseFare: 450, spareParts: 400, platformFee: 0, discount: 0, total: 850 },
    timelineIndex: 1,
    paymentStatus: 'Pre-authorized (Wallet)',
    rated: false
  },
  {
    id: 'BK-881',
    service: 'Living Room Accent Wall Touch-up',
    category: 'Painter',
    worker: 'Sonia Das',
    workerRole: 'Master Wall Finishing & Texture Painter',
    workerPhone: '+91 97123 45678',
    workerRating: 4.7,
    workerJobs: 98,
    date: '25 Sep 2026',
    time: '11:30 AM',
    status: 'Pending', // Matches "Pending" tab
    displayStatus: 'Awaiting worker acceptance',
    eta: 'Awaiting confirmation',
    distance: '4.1 km away',
    location: 'B-42, Shastri Nagar, Meerut',
    landmark: 'Near Central Park',
    amount: '₹650',
    amountNum: 650,
    otp: '7741',
    description: 'Two interior wall putty patching and primer touch-up following electrical wiring conduit work.',
    pricing: { baseFare: 500, spareParts: 150, platformFee: 0, discount: 0, total: 650 },
    timelineIndex: 0,
    paymentStatus: 'Pending Worker Acceptance',
    rated: false
  },
  {
    id: 'BK-875',
    service: 'Modular Kitchen Cabinet Hinge Fitting',
    category: 'Carpenter',
    worker: 'Vikas Yadav',
    workerRole: 'Architectural Carpenter & Joinery Expert',
    workerPhone: '+91 96543 21098',
    workerRating: 4.8,
    workerJobs: 112,
    date: '26 Sep 2026',
    time: '2:00 PM',
    status: 'Confirmed', // Matches "Confirmed" tab
    displayStatus: 'Booking confirmed',
    eta: 'In 3 days',
    distance: '2.5 km away',
    location: 'B-42, Shastri Nagar, Meerut',
    landmark: 'Near Central Park',
    amount: '₹450',
    amountNum: 450,
    otp: '9312',
    description: 'Replacing 4 soft-close hydraulic hinges on overhead kitchen cabinets and aligning cabinet doors.',
    pricing: { baseFare: 300, spareParts: 150, platformFee: 0, discount: 0, total: 450 },
    timelineIndex: 1,
    paymentStatus: 'Cash / UPI on Completion',
    rated: false
  },
  {
    id: 'BK-860',
    service: 'Ceiling Fan Installation & Switch Repair',
    category: 'Electrician',
    worker: 'Rahul Kumar',
    workerRole: 'Licensed Electrical Technician',
    workerPhone: '+91 98765 43210',
    workerRating: 4.8,
    workerJobs: 142,
    date: 'Today, 23 Sep 2026',
    time: '1:15 PM',
    status: 'Active', // Matches "Active" tab
    displayStatus: 'Work in progress on-site',
    eta: 'Active right now',
    distance: 'At your location',
    location: 'B-42, Shastri Nagar, Meerut',
    landmark: 'Near Central Park',
    amount: '₹420',
    amountNum: 420,
    otp: '5531',
    description: 'Bed room ceiling fan balance inspection, hook check, and fixing 2 loose sparking modular switches.',
    pricing: { baseFare: 250, spareParts: 170, platformFee: 0, discount: 0, total: 420 },
    timelineIndex: 4,
    paymentStatus: 'Held in Escrow',
    rated: false
  },
  {
    id: 'BK-842',
    service: 'Full Home Deep Cleaning & Sanitization',
    category: 'Cleaner',
    worker: 'Nitin Verma',
    workerRole: 'Professional Cleaning Supervisor',
    workerPhone: '+91 95432 10987',
    workerRating: 4.6,
    workerJobs: 75,
    date: '18 Sep 2026',
    time: '9:00 AM',
    status: 'Completed', // Matches "Completed" tab
    displayStatus: 'Job completed & verified',
    eta: 'Completed',
    distance: 'Completed',
    location: 'B-42, Shastri Nagar, Meerut',
    landmark: 'Near Central Park',
    amount: '₹1,200',
    amountNum: 1200,
    otp: '1940',
    description: 'Intense floor buffing, kitchen exhaust degreasing, and bathroom tile descaling with industrial equipment.',
    pricing: { baseFare: 1000, spareParts: 200, platformFee: 0, discount: 0, total: 1200 },
    timelineIndex: 5,
    paymentStatus: 'Settled via Mazdoor Wallet',
    rated: true,
    userRating: 5,
    userFeedback: 'Excellent deep cleaning! Nitin and team were very thorough and cleaned every corner spotlessly.'
  },
  {
    id: 'BK-830',
    service: 'Kitchen Sink Trap Replacement',
    category: 'Plumber',
    worker: 'Rakesh Kumar',
    workerRole: 'Plumbing Specialist',
    workerPhone: '+91 94321 09876',
    workerRating: 4.7,
    workerJobs: 89,
    date: '14 Sep 2026',
    time: '5:00 PM',
    status: 'Completed', // Matches "Completed" tab
    displayStatus: 'Job completed',
    eta: 'Completed',
    distance: 'Completed',
    location: 'B-42, Shastri Nagar, Meerut',
    landmark: 'Near Central Park',
    amount: '₹320',
    amountNum: 320,
    otp: '3892',
    description: 'Replacing blocked PVC bottle trap under sink with a heavy-duty stainless steel coupling.',
    pricing: { baseFare: 220, spareParts: 100, platformFee: 0, discount: 0, total: 320 },
    timelineIndex: 5,
    paymentStatus: 'Paid via UPI',
    rated: false // Pending review!
  },
  {
    id: 'BK-815',
    service: 'Balcony Tile Chipping & Waterproof Repair',
    category: 'Mason',
    worker: 'Rakesh Singh',
    workerRole: 'Master Mason & Civil Repair Mistri',
    workerPhone: '+91 93210 98765',
    workerRating: 4.8,
    workerJobs: 89,
    date: '12 Sep 2026',
    time: '1:00 PM',
    status: 'Cancelled', // Matches "Cancelled" tab
    displayStatus: 'Cancelled by customer',
    eta: 'Cancelled',
    distance: '-',
    location: 'B-42, Shastri Nagar, Meerut',
    landmark: 'Near Central Park',
    amount: '₹550',
    amountNum: 550,
    otp: '0000',
    description: 'Balcony tile grouting and waterproofing. Cancelled due to personal rescheduling conflict.',
    pricing: { baseFare: 400, spareParts: 150, platformFee: 0, discount: 0, total: 550 },
    timelineIndex: -1,
    paymentStatus: 'Refunded (100% credited to Wallet)',
    cancelReason: 'Customer requested reschedule to next month',
    rated: false
  }
]

const INITIAL_WORKERS = [
  {
    id: 'WKR-101',
    name: 'Rahul Kumar',
    service: 'Electrician',
    rating: 4.8,
    reviewsCount: 142,
    experience: '5 years',
    distance: '1.2 km away',
    status: 'Available now',
    eta: '10–15 min',
    price: '₹250 onwards',
    priceNum: 250,
    badge: 'Verified Pro',
    skills: ['Wiring & Concealed conduits', 'MCB & DB repair', 'Fan & Lights fitting', 'Appliance testing'],
    bio: 'Licensed trade electrician with 5+ years experience handling residential wiring, fault finding, and modern lighting systems in Meerut.',
    phone: '+91 98765 43210',
    completedJobs: 142
  },
  {
    id: 'WKR-102',
    name: 'Amit Sharma',
    service: 'Plumber',
    rating: 4.9,
    reviewsCount: 184,
    experience: '7 years',
    distance: '1.8 km away',
    status: 'Available now',
    eta: '12–18 min',
    price: '₹300 onwards',
    priceNum: 300,
    badge: 'Top Rated',
    skills: ['Leak repair', 'CPVC pipe installation', 'Sanitaryware fitting', 'Pressure testing', 'Water motor repair'],
    bio: 'Punctual, certified master plumber specializing in quick leak repairs, bathroom fixtures, and pressure diagnostics.',
    phone: '+91 98765 12345',
    completedJobs: 184
  },
  {
    id: 'WKR-103',
    name: 'Sonia Das',
    service: 'Painter',
    rating: 4.7,
    reviewsCount: 98,
    experience: '4 years',
    distance: '2.8 km away',
    status: 'Available now',
    eta: '25–35 min',
    price: '₹450 onwards',
    priceNum: 450,
    badge: 'Popular',
    skills: ['Wall putty & primer', 'Texture design', 'Waterproof coating', 'Door & grill enamel paint'],
    bio: 'Expert wall finish and texture painter delivering flawless finishes, clean masking, and fast completion.',
    phone: '+91 97123 45678',
    completedJobs: 98
  },
  {
    id: 'WKR-104',
    name: 'Vikas Yadav',
    service: 'Carpenter',
    rating: 4.8,
    reviewsCount: 112,
    experience: '6 years',
    distance: '2.5 km away',
    status: 'Available now',
    eta: '20–30 min',
    price: '₹350 onwards',
    priceNum: 350,
    badge: 'Verified Pro',
    skills: ['Modular furniture', 'Hinges & lock fitting', 'Door alignment', 'Wooden repair & polish'],
    bio: 'Precision carpenter experienced in modular kitchens, wardrobe adjustments, and durable timber repairs.',
    phone: '+91 96543 21098',
    completedJobs: 112
  },
  {
    id: 'WKR-105',
    name: 'Nitin Verma',
    service: 'Cleaner',
    rating: 4.6,
    reviewsCount: 75,
    experience: '3 years',
    distance: '3.4 km away',
    status: 'Available now',
    eta: '15–25 min',
    price: '₹200 onwards',
    priceNum: 200,
    badge: 'Fast Responder',
    skills: ['Deep kitchen cleaning', 'Bathroom descaling', 'Sofa shampooing', 'Floor scrubbing machine'],
    bio: 'Dedicated deep cleaning specialist equipped with professional hygiene chemicals and high-pressure machines.',
    phone: '+91 95432 10987',
    completedJobs: 75
  },
  {
    id: 'WKR-106',
    name: 'Rakesh Singh',
    service: 'Mason',
    rating: 4.8,
    reviewsCount: 89,
    experience: '8 years',
    distance: '4.2 km away',
    status: 'Busy',
    eta: '45–60 min',
    price: '₹500 onwards',
    priceNum: 500,
    badge: 'Master Craftsman',
    skills: ['Tile fixing & grouting', 'Brickwork & plastering', 'Wall crack repair', 'Waterproofing'],
    bio: 'Veteran civil mason with 8+ years on commercial & domestic renovation, tiling, and crack remediation.',
    phone: '+91 93210 98765',
    completedJobs: 89
  },
  {
    id: 'WKR-107',
    name: 'Rahul Verma',
    service: 'Appliance Tech',
    rating: 4.8,
    reviewsCount: 130,
    experience: '5 years',
    distance: '3.2 km away',
    status: 'Available now',
    eta: '20–30 min',
    price: '₹400 onwards',
    priceNum: 400,
    badge: 'AC & Appliance Pro',
    skills: ['AC servicing & gas top-up', 'Washing machine repair', 'Microwave PCB fix', 'Refrigerator cooling issue'],
    bio: 'Certified technician for all major appliance brands (LG, Samsung, Voltas, Daikin, Whirlpool).',
    phone: '+91 98234 56789',
    completedJobs: 130
  },
  {
    id: 'WKR-108',
    name: 'Devendra Pal',
    service: 'Mechanic',
    rating: 4.7,
    reviewsCount: 64,
    experience: '6 years',
    distance: '2.1 km away',
    status: 'Available now',
    eta: '15–20 min',
    price: '₹250 onwards',
    priceNum: 250,
    badge: 'On-Spot Assistance',
    skills: ['Two-wheeler roadside repair', 'Battery jumpstart', 'Puncture & tube fix', 'Oil change & brakes'],
    bio: 'Mobile doorstep vehicle technician providing roadside assistance and two-wheeler periodic tuning.',
    phone: '+91 91234 56780',
    completedJobs: 64
  }
]

const INITIAL_WALLET = {
  balance: 2850,
  promotionalCredit: 200,
  pendingRefund: 0,
  transactions: [
    {
      id: 'TXN-9021',
      title: 'Plumbing Service Payment (BK-902)',
      bookingId: 'BK-902',
      amount: -380,
      type: 'debit',
      date: 'Today, 2:30 PM',
      status: 'Completed',
      method: 'Mazdoor Wallet',
      category: 'Booking'
    },
    {
      id: 'TXN-8842',
      title: 'Instant Top-Up via UPI (Google Pay)',
      amount: 1500,
      type: 'credit',
      date: '21 Sep 2026, 11:15 AM',
      status: 'Completed',
      method: 'UPI ••9821',
      category: 'Top-Up'
    },
    {
      id: 'TXN-8720',
      title: 'Refund for Cancelled Mason Booking (BK-815)',
      bookingId: 'BK-815',
      amount: 550,
      type: 'credit',
      date: '19 Sep 2026, 4:40 PM',
      status: 'Refunded',
      method: 'Auto-Refund',
      category: 'Refund'
    },
    {
      id: 'TXN-8510',
      title: 'House Deep Cleaning Payment (BK-842)',
      bookingId: 'BK-842',
      amount: -1200,
      type: 'debit',
      date: '18 Sep 2026, 1:45 PM',
      status: 'Completed',
      method: 'Mazdoor Wallet',
      category: 'Booking'
    },
    {
      id: 'TXN-8201',
      title: 'Welcome Joining Bonus Cash',
      amount: 200,
      type: 'credit',
      date: '10 Sep 2026, 10:00 AM',
      status: 'Completed',
      method: 'Platform Reward',
      category: 'Reward'
    }
  ]
}

const INITIAL_MESSAGES = {
  conversations: [
    {
      id: 'conv-amit',
      workerId: 'WKR-102',
      name: 'Amit Sharma',
      service: 'Plumber',
      status: 'Online',
      avatar: 'AS',
      lastMessage: 'I am taking the Delhi Road flyover, will reach in 10 mins.',
      time: '2 mins ago',
      unread: 2,
      bookingId: 'BK-902'
    },
    {
      id: 'conv-rahul',
      workerId: 'WKR-101',
      name: 'Rahul Kumar',
      service: 'Electrician',
      status: 'Online',
      avatar: 'RK',
      lastMessage: 'The switch board issue is completely sorted. Please check.',
      time: '1 hour ago',
      unread: 0,
      bookingId: 'BK-860'
    },
    {
      id: 'conv-sonia',
      workerId: 'WKR-103',
      name: 'Sonia Das',
      service: 'Painter',
      status: 'Away',
      avatar: 'SD',
      lastMessage: 'Understood. I will carry the Royal Luxury Emulsion color swatch.',
      time: 'Yesterday',
      unread: 0,
      bookingId: 'BK-881'
    },
    {
      id: 'conv-support',
      workerId: 'SUP-001',
      name: 'Mazdoor Sytu Priority Support',
      service: 'Customer Care Desk',
      status: 'Online',
      avatar: 'MS',
      lastMessage: 'We have confirmed your booking refund for BK-815.',
      time: '2 days ago',
      unread: 0,
      bookingId: null
    }
  ],
  threads: {
    'conv-amit': [
      { id: 'm1', from: 'customer', text: 'Hello Amit ji, please come to Gate No. 2 of Shastri Nagar colony.', time: '3:10 PM' },
      { id: 'm2', from: 'worker', text: 'Namaste Riya ji. Got it! I am carrying CPVC seal couplings and standard pipe wrenches.', time: '3:12 PM' },
      { id: 'm3', from: 'customer', text: 'Great! The leak is near the water meter valve behind the bathroom wall.', time: '3:14 PM' },
      { id: 'm4', from: 'worker', text: 'I am taking the Delhi Road flyover, will reach in 10 mins.', time: '3:20 PM' }
    ],
    'conv-rahul': [
      { id: 'm1', from: 'customer', text: 'Hi Rahul, one of the bedroom fans makes a rattling sound on speed 4.', time: '1:00 PM' },
      { id: 'm2', from: 'worker', text: 'No problem, I will check the ball bearing and downrod rubber balance.', time: '1:05 PM' },
      { id: 'm3', from: 'worker', text: 'The switch board issue is completely sorted. Please check.', time: '1:55 PM' }
    ],
    'conv-sonia': [
      { id: 'm1', from: 'customer', text: 'Hi Sonia, can we do a light beige accent instead of white?', time: 'Yesterday, 4:00 PM' },
      { id: 'm2', from: 'worker', text: 'Understood. I will carry the Royal Luxury Emulsion color swatch.', time: 'Yesterday, 4:15 PM' }
    ],
    'conv-support': [
      { id: 'm1', from: 'support', text: 'Welcome to Mazdoor Sytu! Our priority team is available 24×7 for any booking assistance.', time: '10 Sep' },
      { id: 'm2', from: 'support', text: 'We have confirmed your booking refund for BK-815. ₹550 has been credited to your Mazdoor Wallet.', time: '19 Sep' }
    ]
  }
}

const INITIAL_REVIEWS = [
  {
    id: 'REV-01',
    workerId: 'WKR-105',
    workerName: 'Nitin Verma',
    service: 'Cleaner',
    bookingId: 'BK-842',
    rating: 5,
    date: '19 Sep 2026',
    comment: 'Excellent deep cleaning! Nitin and his helper were extremely thorough. Cleaned the kitchen grease and bathroom tiles perfectly. Will definitely hire again.',
    tags: ['Punctual', 'Spotless Cleaning', 'Polite', 'Reasonable Price'],
    workerResponse: 'Thank you Riya ji! Happy to be of service anytime.'
  },
  {
    id: 'REV-02',
    workerId: 'WKR-101',
    workerName: 'Rahul Kumar',
    service: 'Electrician',
    bookingId: 'BK-790',
    rating: 5,
    date: '05 Sep 2026',
    comment: 'Quick and safe wiring work. Identified the MCB trip reason within 5 minutes and replaced the faulty breaker safely.',
    tags: ['Safety First', 'Expert Diagnostics', 'Fast Response'],
    workerResponse: 'Glad to assist! Safety is always our top priority.'
  }
]

const INITIAL_NOTIFICATIONS = [
  {
    id: 'NT-1',
    title: 'Amit Sharma is on the way',
    detail: 'Plumbing technician is 1.8 km away. Estimated arrival in 10–12 minutes.',
    category: 'Bookings',
    time: '2 mins ago',
    unread: true,
    targetPath: '/customer/booking-details',
    bookingId: 'BK-902'
  },
  {
    id: 'NT-2',
    title: 'AC Servicing Scheduled for Tomorrow',
    detail: 'Rahul Verma will arrive at 10:00 AM on 24 Sep. Keep the AC power plug accessible.',
    category: 'Bookings',
    time: '1 hour ago',
    unread: true,
    targetPath: '/customer/bookings',
    bookingId: 'BK-894'
  },
  {
    id: 'NT-3',
    title: 'Wallet Balance Top-up Successful',
    detail: '₹1,500 credited to your Mazdoor Wallet via Google Pay UPI.',
    category: 'Payments',
    time: '2 days ago',
    unread: false,
    targetPath: '/customer/wallet',
    bookingId: null
  },
  {
    id: 'NT-4',
    title: 'Pending Review for Rakesh Kumar',
    detail: 'Your sink trap repair is complete. Please share your rating & experience.',
    category: 'Bookings',
    time: '3 days ago',
    unread: false,
    targetPath: '/customer/reviews',
    bookingId: 'BK-830'
  },
  {
    id: 'NT-5',
    title: 'Safety Guarantee Activated',
    detail: 'All Mazdoor Sytu jobs are covered under our ₹10,000 damage protection guarantee.',
    category: 'System',
    time: '5 days ago',
    unread: false,
    targetPath: '/customer/support',
    bookingId: null
  }
]

const INITIAL_PROFILE = {
  name: 'Riya Kapoor',
  phone: '+91 98765 43210',
  email: 'riya.kapoor@example.com',
  city: 'Meerut, Uttar Pradesh',
  avatar: 'RK',
  addresses: [
    {
      id: 'ADDR-1',
      label: 'Home (Default)',
      street: 'Flat B-42, Gulmohar Apartments',
      area: 'Shastri Nagar',
      landmark: 'Near Central Park & SBI Bank',
      city: 'Meerut',
      pincode: '250004',
      isDefault: true
    },
    {
      id: 'ADDR-2',
      label: 'Office',
      street: 'Suite 302, Cyber Tower',
      area: 'Delhi Road Industrial Area',
      landmark: 'Opposite Metro Pillar 114',
      city: 'Meerut',
      pincode: '250002',
      isDefault: false
    },
    {
      id: 'ADDR-3',
      label: 'Parents Residence',
      street: 'House 18, Street 4',
      area: 'Civil Lines',
      landmark: 'Near Circuit House',
      city: 'Meerut',
      pincode: '250001',
      isDefault: false
    }
  ],
  emergencyContact: {
    name: 'Suresh Kapoor',
    relation: 'Brother',
    phone: '+91 98111 22233',
    shareLiveBooking: true
  },
  preferences: {
    language: 'English',
    whatsappUpdates: true,
    smsAlerts: true,
    emailReceipts: true,
    promotionalOffers: false
  }
}

const INITIAL_SUPPORT = {
  tickets: [
    {
      id: 'MS-TKT-104',
      subject: 'Inquiry regarding additional parts warranty',
      bookingId: 'BK-860',
      category: 'Booking & Warranty',
      status: 'Open',
      createdDate: 'Today, 11:30 AM',
      lastUpdate: 'Support agent assigned',
      priority: 'Normal',
      conversation: [
        { from: 'customer', text: 'Does the newly installed modular switch carry replacement warranty?', time: '11:30 AM' },
        { from: 'support', text: 'Yes Riya ji! All electrical hardware fitted by verified workers is covered by our 30-day service warranty.', time: '12:00 PM' }
      ]
    },
    {
      id: 'MS-TKT-098',
      subject: 'Refund confirmation for cancelled masonry job',
      bookingId: 'BK-815',
      category: 'Payment & Refund',
      status: 'Resolved',
      createdDate: '19 Sep 2026',
      lastUpdate: 'Resolved & credited to wallet',
      priority: 'High',
      conversation: [
        { from: 'customer', text: 'I cancelled BK-815. When will the ₹550 reflect in wallet?', time: '19 Sep, 4:00 PM' },
        { from: 'support', text: 'Your refund of ₹550 has been processed instantly to your Mazdoor Wallet balance.', time: '19 Sep, 4:40 PM' }
      ]
    }
  ],
  faqs: [
    {
      q: 'How does real-time live worker booking work?',
      a: 'When you request an on-demand worker (marked "Real-Time"), our matching system instantly dispatches the nearest verified tradesperson within 3-5 km. You can track their live GPS en route, call via masked numbers, and verify identity with a secure 4-digit OTP.'
    },
    {
      q: 'What is the 4-digit OTP and when should I share it?',
      a: 'The 4-digit OTP displayed on your booking details ensures your safety and proof of service completion. Only share this OTP with the worker when they have reached your doorstep and completed the requested work to your satisfaction.'
    },
    {
      q: 'How do I cancel or reschedule a booking?',
      a: 'Navigate to "Bookings", select your scheduled or confirmed booking, and click "Cancel Booking" or "Reschedule". If you cancel before the worker is dispatched, you receive a 100% instant refund to your Mazdoor Wallet with zero deduction.'
    },
    {
      q: 'Are workers background verified?',
      a: 'Yes! Every worker on Mazdoor Sytu undergoes a 4-step verification: Aadhaar identity KYC, police background record clearance, physical trade skill assessment, and continuous customer rating audits.'
    },
    {
      q: 'How does payment and wallet refund work?',
      a: 'You can pay using Mazdoor Wallet, UPI (Google Pay, PhonePe, Paytm), or Net Banking. Any cancellation refunds or promo rewards are instantly credited back to your Mazdoor Wallet balance.'
    },
    {
      q: 'What if work is defective or something is damaged?',
      a: 'All completed jobs are backed by Mazdoor Sytu’s 30-Day Service Guarantee and up to ₹10,000 Insurance Damage Protection. Simply raise a support ticket or call our 24×7 priority helpline.'
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
        selectedBookingId: parsed.selectedBookingId || 'BK-902'
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
    selectedBookingId: 'BK-902'
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

export function createBooking({ worker, service, date, time, address, note, amount }) {
  const store = loadCustomerStore()
  const nextNum = 900 + Math.floor(Math.random() * 90) + 1
  const id = `BK-${nextNum}`
  const otp = String(Math.floor(1000 + Math.random() * 9000))
  const amountNum = typeof amount === 'number' ? amount : parseInt(String(amount).replace(/\D/g, ''), 10) || 350

  const isToday = (date || '').toLowerCase().includes('today') || (date || '').toLowerCase().includes('real-time')
  const status = isToday ? 'Real-Time' : 'Scheduled'

  const newBooking = {
    id,
    service: service || `${worker.service} Service`,
    category: worker.service,
    worker: worker.name,
    workerRole: worker.badge || `${worker.service} Specialist`,
    workerPhone: worker.phone || '+91 98765 00000',
    workerRating: worker.rating || 4.8,
    workerJobs: worker.completedJobs || 120,
    date: date || 'Today, 23 Sep 2026',
    time: time || '4:00 PM',
    status,
    displayStatus: isToday ? 'Worker en route (Live)' : 'Scheduled',
    eta: isToday ? '15–20 minutes' : date,
    distance: worker.distance || '2.2 km away',
    location: address?.street ? `${address.street}, ${address.area}, ${address.city}` : 'B-42, Shastri Nagar, Meerut',
    landmark: address?.landmark || 'Near Central Park',
    amount: `₹${amountNum}`,
    amountNum,
    otp,
    description: note || `Doorstep ${worker.service} requested by customer. Upfront estimate confirmed.`,
    pricing: {
      baseFare: Math.round(amountNum * 0.7),
      spareParts: Math.round(amountNum * 0.3),
      platformFee: 0,
      discount: 0,
      total: amountNum
    },
    timelineIndex: isToday ? 2 : 1,
    paymentStatus: 'Paid via Mazdoor Wallet',
    rated: false
  }

  // Prepend to bookings
  store.bookings = [newBooking, ...store.bookings]
  store.selectedBookingId = id

  // Deduct from wallet if balance is available
  if (store.wallet.balance >= amountNum) {
    store.wallet.balance -= amountNum
    store.wallet.transactions = [
      {
        id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
        title: `${newBooking.service} (Booking ${id})`,
        bookingId: id,
        amount: -amountNum,
        type: 'debit',
        date: 'Just now',
        status: 'Completed',
        method: 'Mazdoor Wallet',
        category: 'Booking'
      },
      ...store.wallet.transactions
    ]
  }

  // Add notification
  store.notifications = [
    {
      id: `NT-${Date.now()}`,
      title: `Booking Confirmed: ${newBooking.service}`,
      detail: `Your booking ${id} with ${worker.name} is confirmed. OTP: ${otp}`,
      category: 'Bookings',
      time: 'Just now',
      unread: true,
      targetPath: '/customer/booking-details',
      bookingId: id
    },
    ...store.notifications
  ]

  // Add or update conversation in messages
  const existingConv = store.messages.conversations.find((c) => c.name === worker.name)
  if (existingConv) {
    existingConv.lastMessage = `Booking ${id} confirmed. I am getting ready.`
    existingConv.time = 'Just now'
    existingConv.bookingId = id
  } else {
    const convId = `conv-${worker.id || Date.now()}`
    store.messages.conversations.unshift({
      id: convId,
      workerId: worker.id,
      name: worker.name,
      service: worker.service,
      status: 'Online',
      avatar: worker.name.split(' ').map((n) => n[0]).slice(0, 2).join(''),
      lastMessage: `Booking ${id} confirmed! On my way shortly.`,
      time: 'Just now',
      unread: 1,
      bookingId: id
    })
    store.messages.threads[convId] = [
      { id: 'm1', from: 'customer', text: `Hi ${worker.name}, I have placed booking ${id} for ${service}.`, time: 'Just now' },
      { id: 'm2', from: 'worker', text: 'Namaste! I have accepted your request and will reach on time.', time: 'Just now' }
    ]
  }

  saveCustomerStore(store)
  return { store, newBooking }
}

export function cancelBooking(bookingId, reason = 'Customer requested cancellation') {
  const store = loadCustomerStore()
  const booking = store.bookings.find((b) => b.id === bookingId)
  if (!booking) return store

  booking.status = 'Cancelled'
  booking.displayStatus = 'Cancelled by customer'
  booking.cancelReason = reason
  booking.timelineIndex = -1

  // Refund to wallet
  const refundAmount = booking.amountNum || 350
  store.wallet.balance += refundAmount
  store.wallet.transactions = [
    {
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      title: `Refund for Cancelled Booking (${bookingId})`,
      bookingId,
      amount: refundAmount,
      type: 'credit',
      date: 'Just now',
      status: 'Refunded',
      method: 'Instant Wallet Refund',
      category: 'Refund'
    },
    ...store.wallet.transactions
  ]

  // Notification
  store.notifications = [
    {
      id: `NT-${Date.now()}`,
      title: `Booking ${bookingId} Cancelled`,
      detail: `₹${refundAmount} has been refunded immediately to your Mazdoor Wallet.`,
      category: 'Bookings',
      time: 'Just now',
      unread: true,
      targetPath: '/customer/wallet',
      bookingId
    },
    ...store.notifications
  ]

  saveCustomerStore(store)
  return store
}

export function advanceBookingStage(bookingId) {
  const store = loadCustomerStore()
  const booking = store.bookings.find((b) => b.id === bookingId)
  if (!booking) return store

  if (booking.timelineIndex < 5) {
    booking.timelineIndex += 1
    if (booking.timelineIndex === 3) {
      booking.displayStatus = 'Worker arrived at location'
      booking.eta = 'Arrived on-site'
      booking.distance = 'At your doorstep'
    } else if (booking.timelineIndex === 4) {
      booking.status = 'Active'
      booking.displayStatus = 'Work in progress'
      booking.eta = 'Active'
    } else if (booking.timelineIndex === 5) {
      booking.status = 'Completed'
      booking.displayStatus = 'Job completed & verified'
      booking.eta = 'Completed'
      booking.distance = 'Completed'
    }
    saveCustomerStore(store)
  }
  return store
}

export function addWalletFunds(amount, method = 'UPI (Google Pay)') {
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
      detail: `Your wallet balance is now ₹${store.wallet.balance}. Ready to use for any instant booking.`,
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

  // Mark booking as rated
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
