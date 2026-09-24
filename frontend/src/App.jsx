import { useEffect, useState, lazy, Suspense } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTopButton from './components/ScrollToTopButton'
import Home from './pages/public/Home'
import './App.css'

// Public Pages (Code-Split via React.lazy - loaded on demand)
const Jobs = lazy(() => import('./pages/public/Jobs'))
const Services = lazy(() => import('./pages/public/Services'))
const Workers = lazy(() => import('./pages/public/Workers'))
const HowItWorks = lazy(() => import('./pages/public/HowItWorks'))
const About = lazy(() => import('./pages/public/About'))
const Careers = lazy(() => import('./pages/public/Careers'))
const Support = lazy(() => import('./pages/public/Support'))
const Terms = lazy(() => import('./pages/public/Terms'))
const Privacy = lazy(() => import('./pages/public/Privacy'))
const RefundPolicy = lazy(() => import('./pages/public/RefundPolicy'))
const Login = lazy(() => import('./pages/Login'))
const Signup = lazy(() => import('./pages/Signup'))

// Customer Portal Pages
const CustomerDashboard = lazy(() => import('./pages/customer/Dashboard'))
const CustomerSearchWorkers = lazy(() => import('./pages/customer/SearchWorkers'))
const CustomerBookings = lazy(() => import('./pages/customer/Bookings'))
const BookingDetails = lazy(() => import('./pages/customer/BookingDetails'))
const CustomerMessages = lazy(() => import('./pages/customer/Messages'))
const CustomerWallet = lazy(() => import('./pages/customer/Wallet'))
const CustomerProfile = lazy(() => import('./pages/customer/Profile'))
const CustomerReviews = lazy(() => import('./pages/customer/Reviews'))
const CustomerNotifications = lazy(() => import('./pages/customer/Notifications'))
const CustomerSupport = lazy(() => import('./pages/customer/Support'))

// Worker Portal Pages
const WorkerDashboard = lazy(() => import('./pages/worker/Dashboard'))
const WorkerJobs = lazy(() => import('./pages/worker/Jobs'))
const JobDetails = lazy(() => import('./pages/worker/JobDetails'))
const ActiveJob = lazy(() => import('./pages/worker/ActiveJob'))
const WorkerEarnings = lazy(() => import('./pages/worker/Earnings'))
const WorkerWallet = lazy(() => import('./pages/worker/Wallet'))
const Availability = lazy(() => import('./pages/worker/Availability'))
const WorkerProfile = lazy(() => import('./pages/worker/Profile'))
const WorkerReviews = lazy(() => import('./pages/worker/Reviews'))
const WorkerDocuments = lazy(() => import('./pages/worker/Documents'))
const WorkerMessages = lazy(() => import('./pages/worker/Messages'))
const WorkerNotifications = lazy(() => import('./pages/worker/Notifications'))
const WorkerSupport = lazy(() => import('./pages/worker/Support'))

// Business Portal Pages
const BusinessDashboard = lazy(() => import('./pages/business/Dashboard'))
const BusinessProfile = lazy(() => import('./pages/business/BusinessProfile'))
const PostRequirement = lazy(() => import('./pages/business/PostRequirement'))
const Requirements = lazy(() => import('./pages/business/Requirements'))
const BusinessWorkers = lazy(() => import('./pages/business/Workers'))
const BusinessBookings = lazy(() => import('./pages/business/Bookings'))
const BusinessPayments = lazy(() => import('./pages/business/Payments'))

// Admin Portal Pages (Hidden from Public UI)
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'))
const Users = lazy(() => import('./pages/admin/Users'))
const AdminWorkers = lazy(() => import('./pages/admin/Workers'))
const Businesses = lazy(() => import('./pages/admin/Businesses'))
const AdminServices = lazy(() => import('./pages/admin/Services'))
const AdminBookings = lazy(() => import('./pages/admin/Bookings'))
const Payments = lazy(() => import('./pages/admin/Payments'))
const Verification = lazy(() => import('./pages/admin/Verification'))
const AdminReviews = lazy(() => import('./pages/admin/Reviews'))
const Complaints = lazy(() => import('./pages/admin/Complaints'))
const Analytics = lazy(() => import('./pages/admin/Analytics'))
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'))

function PageLoader() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '55vh',
      gap: '14px',
      color: '#0d9488',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '3px solid #ccfbf1',
        borderTopColor: '#0d9488',
        borderRadius: '50%',
        animation: 'msSpin 0.75s linear infinite'
      }} />
      <style>{`@keyframes msSpin { to { transform: rotate(360deg); } }`}</style>
      <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#64748b' }}>
        Loading Mazdoor Sytu…
      </span>
    </div>
  )
}

const pageMap = {
  '/': Home,
  '/jobs': Jobs,
  '/services': Services,
  '/workers': Workers,
  '/how-it-works': HowItWorks,
  '/about': About,
  '/careers': Careers,
  '/support': Support,
  '/terms': Terms,
  '/privacy': Privacy,
  '/refund-policy': RefundPolicy,
  '/cancellation-policy': RefundPolicy,
  '/login': Login,
  '/signup': Signup,
  '/customer/dashboard': CustomerDashboard,
  '/customer/search-workers': CustomerSearchWorkers,
  '/customer/bookings': CustomerBookings,
  '/customer/booking-details': BookingDetails,
  '/customer/messages': CustomerMessages,
  '/customer/wallet': CustomerWallet,
  '/customer/profile': CustomerProfile,
  '/customer/reviews': CustomerReviews,
  '/customer/notifications': CustomerNotifications,
  '/customer/support': CustomerSupport,
  '/worker/dashboard': WorkerDashboard,
  '/worker/jobs': WorkerJobs,
  '/worker/job-details': JobDetails,
  '/worker/active-job': ActiveJob,
  '/worker/earnings': WorkerEarnings,
  '/worker/wallet': WorkerWallet,
  '/worker/availability': Availability,
  '/worker/messages': WorkerMessages,
  '/worker/notifications': WorkerNotifications,
  '/worker/profile': WorkerProfile,
  '/worker/reviews': WorkerReviews,
  '/worker/documents': WorkerDocuments,
  '/worker/support': WorkerSupport,
  '/business/dashboard': BusinessDashboard,
  '/business/profile': BusinessProfile,
  '/business/post-requirement': PostRequirement,
  '/business/requirements': Requirements,
  '/business/workers': BusinessWorkers,
  '/business/bookings': BusinessBookings,
  '/business/payments': BusinessPayments,
  '/admin': AdminLogin,
  '/admin/dashboard': AdminDashboard,
  '/admin/users': Users,
  '/admin/workers': AdminWorkers,
  '/admin/businesses': Businesses,
  '/admin/services': AdminServices,
  '/admin/bookings': AdminBookings,
  '/admin/payments': Payments,
  '/admin/verification': Verification,
  '/admin/reviews': AdminReviews,
  '/admin/complaints': Complaints,
  '/admin/analytics': Analytics,
}

const SESSION_KEY = 'mazdoor_sytu_session_v1'
const LEGACY_SESSION_KEY = 'mazdoor-Setu-session'
const WORKER_DATA_KEY = 'mazdoor_sytu_worker_data'
const LEGACY_WORKER_KEY = 'mazdoor-Setu-worker-data'

function App() {
  const [path, setPath] = useState(window.location.pathname)
  const [session, setSession] = useState(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY) || localStorage.getItem(LEGACY_SESSION_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })

  const defaultWorkerData = {
    availability: 'available',
    profile: {
      name: 'Rahul Kumar',
      phone: '+91 8004264176',
      email: 'mazdoorsetu.support@gmail.com',
      service: 'Electrician',
      experience: '5 years',
      serviceArea: 'Meerut city and nearby areas',
      pricing: '₹250 onwards',
      verification: 'Verified by Mazdoor Sytu',
      documents: ['Aadhaar card', 'Trade certificate', 'GST invoice', 'Police verification'],
    },
    jobRequests: [
      { id: 'MS-2084', title: 'Ceiling fan repair', customer: 'Anita Sharma', distance: '1.8 km away', eta: '10–15 min', price: '₹560', status: 'New request', address: 'Near Modi Nagar, Meerut', service: 'Electrical service', date: '23 September 2026', time: '5:30 PM', description: 'One fan is wobbling and the switch is not responding correctly. Please inspect the wiring and fix it on-site.' },
      { id: 'MS-2081', title: 'Bathroom pipe leak', customer: 'Rohit Verma', distance: '2.1 km away', eta: '18 min', price: '₹690', status: 'New request', address: 'Shastri Nagar, Meerut', service: 'Plumbing', date: '23 September 2026', time: '6:15 PM', description: 'Pipe leakage near bathroom wall. Need immediate compact repair and pressure check.' },
    ],
    acceptedJobs: [
      { id: 'MS-2054', title: 'Switch wiring fix', customer: 'Kamal Singh', date: 'Today, 6:45 PM', price: '₹520', status: 'Accepted' },
      { id: 'MS-2048', title: 'AC cleaning', customer: 'Pooja Jain', date: 'Tomorrow, 10:00 AM', price: '₹1,200', status: 'Accepted' },
    ],
    upcomingJobs: [
      { id: 'MS-2039', title: 'Kitchen sink repair', customer: 'Neha Gupta', date: 'Tomorrow, 10:30 AM', price: '₹640', status: 'Scheduled' },
      { id: 'MS-2027', title: 'Water heater issue', customer: 'Amit Soni', date: 'Wed, 8:15 AM', price: '₹720', status: 'Scheduled' },
    ],
    completedJobs: [
      { id: 'MS-2009', title: 'Light installation', customer: 'Sunil Mehta', date: 'Yesterday', price: '₹440', status: 'Completed' },
      { id: 'MS-1998', title: 'Fan replacement', customer: 'Pragya', date: 'Mon', price: '₹510', status: 'Completed' },
    ],
    cancelledJobs: [
      { id: 'MS-1986', title: 'Pipe fitting', customer: 'Aman', date: 'Last week', price: '₹350', status: 'Cancelled' },
    ],
    activeJob: {
      id: 'MS-2054',
      title: 'Switch wiring fix',
      customer: 'Kamal Singh',
      phone: '+91 8004264176',
      address: 'Sector 8, Meerut',
      service: 'Electrical service',
      date: '23 September 2026',
      time: '6:45 PM',
      price: '₹520',
      status: 'In progress',
      description: 'The customer reported a loose switch board and irregular socket output. Please inspect and repair the wiring safely.',
    },
    activity: [
      ['Customer confirmed', '3 min ago'],
      ['Worker started driving', '9 min ago'],
      ['Reached service area', '11 min ago'],
      ['Arrived at site', 'Live'],
    ],
    earnings: {
      today: '₹3,420',
      week: '₹14,800',
      month: '₹48,250',
      total: '₹18,940',
      payout: '₹1,080',
      settlementDate: '27 Sep',
      bank: 'HDFC••••7591',
      breakdown: [
        { label: 'Completed jobs', amount: '₹2,860', note: '6 jobs' },
        { label: 'Travel reimbursement', amount: '₹180', note: '2 rides' },
        { label: 'Bonus', amount: '₹380', note: 'Referral bonus' },
      ],
    },
    wallet: {
      balance: '₹8,420',
      pendingWithdrawal: '₹1,080',
      lastPayout: '₹2,300',
      transactions: [
        { type: 'Service payment', amount: '+₹1,240', date: 'Today • 11:12 AM', status: 'Completed' },
        { type: 'Withdrawal', amount: '-₹700', date: 'Yesterday • 8:40 PM', status: 'Processed' },
        { type: 'Platform fee', amount: '-₹55', date: '18 Sep • 2:50 PM', status: 'Debited' },
      ],
    },
    messages: {
      conversations: [
        { name: 'Anita Sharma', last: 'I am at the gate. Please come in.', time: '2 min ago', unread: 2 },
        { name: 'Kamal Singh', last: 'The issue is resolved. Thank you.', time: '9 min ago', unread: 0 },
        { name: 'Neha Gupta', last: 'Can you arrive by 10:30?', time: 'Yesterday', unread: 1 },
      ],
      thread: [
        { from: 'customer', text: 'Hi Rahul, I have left the main door open for you.', time: '5:12 PM' },
        { from: 'worker', text: 'Perfect. I am almost there.', time: '5:13 PM' },
        { from: 'customer', text: 'I am at the gate. Please come in.', time: '5:15 PM' },
      ],
    },
    reviews: [
      { customer: 'Neha Gupta', rating: '★★★★★', text: 'Punctual, professional and solved the issue in one visit. Very neat work.', date: '2 days ago' },
      { customer: 'Kamal Singh', rating: '★★★★★', text: 'Recommended. Quick response, good communication and reasonable price.', date: '5 days ago' },
      { customer: 'Pooja Jain', rating: '★★★★☆', text: 'Great repair job. The worker explained everything clearly and cleaned up after the work.', date: '1 week ago' },
    ],
  }

  const [workerData, setWorkerData] = useState(() => {
    try {
      const saved = localStorage.getItem(WORKER_DATA_KEY) || localStorage.getItem(LEGACY_WORKER_KEY)
      return saved ? JSON.parse(saved) : defaultWorkerData
    } catch {
      return defaultWorkerData
    }
  })

  useEffect(() => {
    localStorage.setItem(WORKER_DATA_KEY, JSON.stringify(workerData))
    localStorage.setItem(LEGACY_WORKER_KEY, JSON.stringify(workerData))
  }, [workerData])

  useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname + window.location.search)
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const currentPathname = (path || '').split('?')[0].split('#')[0]

  const isCustomerPortalRoute = currentPathname.startsWith('/customer/')
  const isWorkerPortalRoute = currentPathname.startsWith('/worker/')
  const isBusinessPortalRoute = currentPathname.startsWith('/business/')
  const isAdminPortalRoute = currentPathname.startsWith('/admin/')
  const isAdminLoginRoute = currentPathname === '/admin'
  const isAnyAdminRoute = isAdminLoginRoute || isAdminPortalRoute
  const isAuthRoute = currentPathname === '/login' || currentPathname === '/signup'
  const isPublicRoute = !isCustomerPortalRoute && !isWorkerPortalRoute && !isBusinessPortalRoute && !isAnyAdminRoute && !isAuthRoute

  const shouldGateCustomerPortal = isCustomerPortalRoute && (!session || session.role !== 'customer' || !session.authenticated)
  const shouldGateWorkerPortal = isWorkerPortalRoute && (!session || session.role !== 'worker' || !session.authenticated)
  const shouldGateBusinessPortal = isBusinessPortalRoute && (!session || session.role !== 'business' || !session.authenticated)
  const shouldGateAdminPortal = isAdminPortalRoute && (!session || session.role !== 'admin' || !session.authenticated)

  const shouldRedirectAdminFromLogin = isAdminLoginRoute && session?.role === 'admin' && Boolean(session?.authenticated)
  const shouldRedirectAuthenticatedUserFromAuth = isAuthRoute && Boolean(session?.authenticated)
  const redirectDashboardPath = session?.role === 'admin' ? '/admin/dashboard' : session?.role ? `/${session.role}/dashboard` : '/customer/dashboard'

  let Page = Home
  if (shouldGateAdminPortal) {
    Page = AdminLogin
  } else if (shouldRedirectAdminFromLogin) {
    Page = AdminDashboard
  } else if (shouldGateCustomerPortal || shouldGateWorkerPortal || shouldGateBusinessPortal) {
    Page = Login
  } else if (shouldRedirectAuthenticatedUserFromAuth) {
    Page = pageMap[redirectDashboardPath] || pageMap['/customer/dashboard']
  } else {
    Page = pageMap[currentPathname] || Home
  }

  const navigate = (nextPath) => {
    window.history.pushState({}, '', nextPath)
    setPath(nextPath)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleAuthenticated = (user) => {
    const nextSession = { ...user, authenticated: true }
    localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession))
    localStorage.setItem(LEGACY_SESSION_KEY, JSON.stringify(nextSession))
    setSession(nextSession)

    const returnRedirect = sessionStorage.getItem('mazdoor_redirect_after_auth')
    if (returnRedirect) {
      sessionStorage.removeItem('mazdoor_redirect_after_auth')
      navigate(returnRedirect)
      return
    }

    if (user.role === 'admin') {
      navigate('/admin/dashboard')
      return
    }

    const destinationPath = user.role ? `/${user.role}/dashboard` : '/customer/dashboard'
    navigate(destinationPath)
  }

  const handleProfileUpdate = (updatedProfile) => {
    const nextSession = { ...(session || {}), ...updatedProfile, authenticated: true }
    localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession))
    localStorage.setItem(LEGACY_SESSION_KEY, JSON.stringify(nextSession))
    setSession(nextSession)

    setWorkerData((current) => {
      const next = {
        ...current,
        profile: {
          ...(current?.profile || {}),
          ...updatedProfile,
        },
      }
      localStorage.setItem(WORKER_DATA_KEY, JSON.stringify(next))
      localStorage.setItem(LEGACY_WORKER_KEY, JSON.stringify(next))
      return next
    })
  }

  const handleWorkerAvailabilityToggle = () => {
    setWorkerData((current) => ({
      ...current,
      availability: current.availability === 'available' ? 'offline' : 'available',
    }))
  }

  const handleJobDecision = (jobId, decision) => {
    setWorkerData((current) => {
      const nextRequests = current.jobRequests.filter((job) => job.id !== jobId)
      const accepted = current.jobRequests.find((job) => job.id === jobId)

      if (decision === 'accept' && accepted) {
        return {
          ...current,
          jobRequests: nextRequests,
          acceptedJobs: [
            { ...accepted, status: 'Accepted', date: 'Today, 6:45 PM' },
            ...current.acceptedJobs,
          ],
        }
      }

      if (decision === 'reject' && accepted) {
        return {
          ...current,
          jobRequests: nextRequests,
        }
      }

      return current
    })
  }

  const handleCompleteJob = () => {
    setWorkerData((current) => ({
      ...current,
      activeJob: {
        ...current.activeJob,
        status: 'Completed',
      },
      completedJobs: [
        { id: current.activeJob.id, title: current.activeJob.title, customer: current.activeJob.customer, date: 'Today', price: current.activeJob.price, status: 'Completed' },
        ...current.completedJobs,
      ],
    }))
  }

  const handleLogout = () => {
    const wasAdmin = session?.role === 'admin' || isAnyAdminRoute
    localStorage.removeItem(SESSION_KEY)
    localStorage.removeItem(LEGACY_SESSION_KEY)
    setSession(null)
    navigate(wasAdmin ? '/admin' : '/login')
  }

  if (isAnyAdminRoute) {
    return (
      <main className="admin-root-view">
        <Suspense fallback={<PageLoader />}>
          <Page
            onNavigate={navigate}
            onAuthenticated={handleAuthenticated}
            onProfileUpdate={handleProfileUpdate}
            onAvailabilityToggle={handleWorkerAvailabilityToggle}
            onJobDecision={handleJobDecision}
            onCompleteJob={handleCompleteJob}
            onLogout={handleLogout}
            session={session}
            workerData={workerData}
          />
        </Suspense>
      </main>
    )
  }

  return (
    <div className="app-shell">
      <Navbar onNavigate={navigate} session={session} onLogout={handleLogout} />
      <main>
        <Suspense fallback={<PageLoader />}>
          <Page
            onNavigate={navigate}
            onAuthenticated={handleAuthenticated}
            onProfileUpdate={handleProfileUpdate}
            onAvailabilityToggle={handleWorkerAvailabilityToggle}
            onJobDecision={handleJobDecision}
            onCompleteJob={handleCompleteJob}
            onLogout={handleLogout}
            session={session}
            workerData={workerData}
          />
        </Suspense>
      </main>
      {currentPathname === '/' && <Footer onNavigate={navigate} />}
      <ScrollToTopButton />
    </div>
  )
}

export default App
