import { useState, useEffect, useMemo } from 'react'
import {
  getSavedLocation,
  saveLocation,
  requestGpsLocation,
  MEERUT_LOCALITIES,
} from '../../utils/locationService'
import './Workers.css'

// Comprehensive Verified Workers with real distances and trades in Meerut & Regional NCR
const WORKERS_CATALOG = [
  // --- ELECTRICIANS ---
  {
    id: 'w-elec-ganga',
    name: 'Rahul Sharma',
    service: 'Electrician',
    location: 'Meerut',
    locality: 'Ganga Sagar',
    distanceKm: 0.8,
    eta: '10–15 min',
    rating: 4.9,
    jobs: 218,
    price: 199,
    badge: 'Top rated',
    experience: '8 yrs',
    availability: 'Available now',
    availableDates: ['today', 'tomorrow', 'flexible'],
  },
  {
    id: 'w-elec-1',
    name: 'Aman Verma',
    service: 'Electrician',
    location: 'Meerut',
    locality: 'Shastri Nagar',
    distanceKm: 1.8,
    eta: '15–20 min',
    rating: 4.9,
    jobs: 214,
    price: 199,
    badge: 'Top rated',
    experience: '7 yrs',
    availability: 'Available now',
    availableDates: ['today', 'tomorrow', 'flexible'],
  },
  {
    id: 'w-elec-2',
    name: 'Suresh Tyagi',
    service: 'Electrician',
    location: 'Meerut',
    locality: 'Modipuram',
    distanceKm: 4.2,
    eta: '20–30 min',
    rating: 4.8,
    jobs: 178,
    price: 199,
    badge: 'Verified',
    experience: '5 yrs',
    availability: 'Available now',
    availableDates: ['today', 'tomorrow', 'flexible'],
  },
  {
    id: 'w-elec-3',
    name: 'Rajesh Rawat',
    service: 'Electrician',
    location: 'Delhi',
    locality: 'Lajpat Nagar',
    distanceKm: 16.5,
    eta: 'Advance Appointment',
    rating: 4.9,
    jobs: 310,
    price: 249,
    badge: 'Master Artisan',
    experience: '11 yrs',
    availability: 'Advance booking',
    availableDates: ['tomorrow', 'flexible'],
  },

  // --- PLUMBERS ---
  {
    id: 'w-plumb-ganga',
    name: 'Amit Tyagi',
    service: 'Plumber',
    location: 'Meerut',
    locality: 'Ganga Sagar',
    distanceKm: 0.9,
    eta: '10–20 min',
    rating: 4.8,
    jobs: 172,
    price: 219,
    badge: 'Verified',
    experience: '6 yrs',
    availability: 'Available now',
    availableDates: ['today', 'tomorrow', 'flexible'],
  },
  {
    id: 'w-plumb-1',
    name: 'Mahesh Yadav',
    service: 'Plumber',
    location: 'Meerut',
    locality: 'Sadar Bazar',
    distanceKm: 2.4,
    eta: '15–25 min',
    rating: 4.9,
    jobs: 198,
    price: 229,
    badge: 'Top rated',
    experience: '8 yrs',
    availability: 'Available now',
    availableDates: ['today', 'tomorrow', 'flexible'],
  },
  {
    id: 'w-plumb-2',
    name: 'Sonu Prajapati',
    service: 'Plumber',
    location: 'Meerut',
    locality: 'Kankerkhera',
    distanceKm: 5.8,
    eta: '25–35 min',
    rating: 4.7,
    jobs: 142,
    price: 199,
    badge: 'Verified',
    experience: '6 yrs',
    availability: 'Available now',
    availableDates: ['today', 'tomorrow', 'flexible'],
  },
  {
    id: 'w-plumb-3',
    name: 'Sandeep Sharma',
    service: 'Plumber',
    location: 'Delhi',
    locality: 'Mayur Vihar',
    distanceKm: 21.0,
    eta: 'Advance Appointment',
    rating: 4.9,
    jobs: 280,
    price: 299,
    badge: 'Master Artisan',
    experience: '12 yrs',
    availability: 'Advance booking',
    availableDates: ['tomorrow', 'flexible'],
  },

  // --- CARPENTERS ---
  {
    id: 'w-carp-1',
    name: 'Nitin Kumar',
    service: 'Carpenter',
    location: 'Meerut',
    locality: 'Civil Lines',
    distanceKm: 2.1,
    eta: '15–25 min',
    rating: 4.8,
    jobs: 164,
    price: 299,
    badge: 'Top rated',
    experience: '8 yrs',
    availability: 'Available now',
    availableDates: ['today', 'tomorrow', 'flexible'],
  },
  {
    id: 'w-carp-2',
    name: 'Deepak Saini',
    service: 'Carpenter',
    location: 'Meerut',
    locality: 'Pallavpuram',
    distanceKm: 7.2,
    eta: '30–40 min',
    rating: 4.8,
    jobs: 135,
    price: 279,
    badge: 'Verified',
    experience: '6 yrs',
    availability: 'Available today',
    availableDates: ['today', 'tomorrow', 'flexible'],
  },
  {
    id: 'w-carp-3',
    name: 'Rakesh Sharma',
    service: 'Carpenter',
    location: 'Noida',
    locality: 'Sector 62',
    distanceKm: 28.5,
    eta: 'Advance Appointment',
    rating: 4.9,
    jobs: 320,
    price: 349,
    badge: 'Master Artisan',
    experience: '14 yrs',
    availability: 'Advance booking',
    availableDates: ['tomorrow', 'flexible'],
  },

  // --- PAINTERS ---
  {
    id: 'w-paint-1',
    name: 'Ajay Verma',
    service: 'Painter',
    location: 'Meerut',
    locality: 'Brahmpuri',
    distanceKm: 3.1,
    eta: '20–30 min',
    rating: 4.8,
    jobs: 154,
    price: 449,
    badge: 'Top rated',
    experience: '7 yrs',
    availability: 'Available now',
    availableDates: ['today', 'tomorrow', 'flexible'],
  },
  {
    id: 'w-paint-2',
    name: 'Himanshu Yadav',
    service: 'Painter',
    location: 'Ghaziabad',
    locality: 'Raj Nagar',
    distanceKm: 18.2,
    eta: 'Advance Appointment',
    rating: 4.7,
    jobs: 190,
    price: 499,
    badge: 'Verified',
    experience: '9 yrs',
    availability: 'Advance booking',
    availableDates: ['tomorrow', 'flexible'],
  },

  // --- AC TECHNICIANS ---
  {
    id: 'w-ac-1',
    name: 'Rohit Singh',
    service: 'AC Technician',
    location: 'Meerut',
    locality: 'Saket',
    distanceKm: 2.8,
    eta: '20–25 min',
    rating: 4.9,
    jobs: 220,
    price: 299,
    badge: 'Top rated',
    experience: '9 yrs',
    availability: 'Available now',
    availableDates: ['today', 'tomorrow', 'flexible'],
  },
  {
    id: 'w-ac-2',
    name: 'Kapil Dev',
    service: 'AC Technician',
    location: 'Noida',
    locality: 'Sector 18',
    distanceKm: 32.0,
    eta: 'Advance Appointment',
    rating: 4.8,
    jobs: 245,
    price: 349,
    badge: 'Verified',
    experience: '10 yrs',
    availability: 'Advance booking',
    availableDates: ['tomorrow', 'flexible'],
  },

  // --- MASONS / RAJ MISTRI ---
  {
    id: 'w-mas-1',
    name: 'Ramphal Mistri',
    service: 'Mason / Raj Mistri',
    location: 'Meerut',
    locality: 'Partapur',
    distanceKm: 4.8,
    eta: '30–45 min',
    rating: 4.9,
    jobs: 260,
    price: 649,
    badge: 'Master Artisan',
    experience: '15 yrs',
    availability: 'Available now',
    availableDates: ['today', 'tomorrow', 'flexible'],
  },
  {
    id: 'w-mas-2',
    name: 'Rajiv Mishra',
    service: 'Mason / Raj Mistri',
    location: 'Ghaziabad',
    locality: 'Indirapuram',
    distanceKm: 24.0,
    eta: 'Advance Appointment',
    rating: 4.7,
    jobs: 180,
    price: 699,
    badge: 'Verified',
    experience: '12 yrs',
    availability: 'Advance booking',
    availableDates: ['tomorrow', 'flexible'],
  },

  // --- HOME CLEANING ---
  {
    id: 'w-clean-1',
    name: 'Suman Devi',
    service: 'Home Cleaning',
    location: 'Meerut',
    locality: 'Junction Area',
    distanceKm: 1.9,
    eta: '15–20 min',
    rating: 4.9,
    jobs: 194,
    price: 349,
    badge: 'Top rated',
    experience: '5 yrs',
    availability: 'Available now',
    availableDates: ['today', 'tomorrow', 'flexible'],
  },
  {
    id: 'w-clean-2',
    name: 'Deepak Tomar',
    service: 'Home Cleaning',
    location: 'Delhi',
    locality: 'Preet Vihar',
    distanceKm: 19.5,
    eta: 'Advance Appointment',
    rating: 4.8,
    jobs: 240,
    price: 399,
    badge: 'Verified',
    experience: '6 yrs',
    availability: 'Advance booking',
    availableDates: ['tomorrow', 'flexible'],
  },

  // --- CONSTRUCTION LABOR ---
  {
    id: 'w-cons-1',
    name: 'Dharamveer Kumar',
    service: 'Construction Labor',
    location: 'Meerut',
    locality: 'Transport Nagar',
    distanceKm: 3.8,
    eta: '20–30 min',
    rating: 4.8,
    jobs: 190,
    price: 549,
    badge: 'Top rated',
    experience: '8 yrs',
    availability: 'Available now',
    availableDates: ['today', 'tomorrow', 'flexible'],
  },
  {
    id: 'w-cons-2',
    name: 'Vikas Chauhan',
    service: 'Construction Labor',
    location: 'Noida',
    locality: 'Sector 137',
    distanceKm: 36.0,
    eta: 'Advance Appointment',
    rating: 4.6,
    jobs: 170,
    price: 599,
    badge: 'Verified',
    experience: '7 yrs',
    availability: 'Advance booking',
    availableDates: ['tomorrow', 'flexible'],
  },

  // --- WELDER & FABRICATOR ---
  {
    id: 'w-weld-1',
    name: 'Mohit Rawat',
    service: 'Welder & Fabricator',
    location: 'Meerut',
    locality: 'Delhi Road Industrial',
    distanceKm: 3.5,
    eta: '25–35 min',
    rating: 4.8,
    jobs: 115,
    price: 349,
    badge: 'Verified',
    experience: '8 yrs',
    availability: 'Available now',
    availableDates: ['today', 'tomorrow', 'flexible'],
  },
  {
    id: 'w-weld-2',
    name: 'Satish Kumar',
    service: 'Welder & Fabricator',
    location: 'Delhi',
    locality: 'Okhla Phase 2',
    distanceKm: 27.0,
    eta: 'Advance Appointment',
    rating: 4.7,
    jobs: 145,
    price: 389,
    badge: 'Master Artisan',
    experience: '11 yrs',
    availability: 'Advance booking',
    availableDates: ['tomorrow', 'flexible'],
  },

  // --- LOADING & SHIFTING ---
  {
    id: 'w-load-1',
    name: 'Pappu Yadav',
    service: 'Loading & Shifting',
    location: 'Meerut',
    locality: 'Railway Road',
    distanceKm: 2.6,
    eta: '15–20 min',
    rating: 4.9,
    jobs: 180,
    price: 279,
    badge: 'Top rated',
    experience: '6 yrs',
    availability: 'Available now',
    availableDates: ['today', 'tomorrow', 'flexible'],
  },
  {
    id: 'w-load-2',
    name: 'Sunil Paswan',
    service: 'Loading & Shifting',
    location: 'Delhi',
    locality: 'Anand Vihar',
    distanceKm: 15.0,
    eta: 'Advance Appointment',
    rating: 4.8,
    jobs: 210,
    price: 299,
    badge: 'Verified',
    experience: '7 yrs',
    availability: 'Advance booking',
    availableDates: ['tomorrow', 'flexible'],
  },

  // --- APPLIANCE REPAIR ---
  {
    id: 'w-app-1',
    name: 'Rahul Rastogi',
    service: 'Appliance Repair',
    location: 'Meerut',
    locality: 'Begum Bridge',
    distanceKm: 1.5,
    eta: '15–20 min',
    rating: 4.9,
    jobs: 195,
    price: 229,
    badge: 'Top rated',
    experience: '7 yrs',
    availability: 'Available now',
    availableDates: ['today', 'tomorrow', 'flexible'],
  },
  {
    id: 'w-app-2',
    name: 'Gaurav Bisht',
    service: 'Appliance Repair',
    location: 'Noida',
    locality: 'Sector 50',
    distanceKm: 31.0,
    eta: 'Advance Appointment',
    rating: 4.9,
    jobs: 230,
    price: 279,
    badge: 'Master Artisan',
    experience: '9 yrs',
    availability: 'Advance booking',
    availableDates: ['tomorrow', 'flexible'],
  },

  // --- TILES & MARBLE MASON ---
  {
    id: 'w-tile-1',
    name: 'Manoj Mistri',
    service: 'Tiles & Marble Mason',
    location: 'Meerut',
    locality: 'Hapur Stand',
    distanceKm: 3.0,
    eta: '20–30 min',
    rating: 4.9,
    jobs: 198,
    price: 389,
    badge: 'Top rated',
    experience: '12 yrs',
    availability: 'Available now',
    availableDates: ['today', 'tomorrow', 'flexible'],
  },

  // --- PEST CONTROL ---
  {
    id: 'w-pest-1',
    name: 'Arun Saxena',
    service: 'Pest Control',
    location: 'Meerut',
    locality: 'Abu Lane',
    distanceKm: 2.2,
    eta: '15–25 min',
    rating: 4.8,
    jobs: 125,
    price: 599,
    badge: 'Verified',
    experience: '6 yrs',
    availability: 'Available now',
    availableDates: ['today', 'tomorrow', 'flexible'],
  },

  // --- GARDENER & LAWN CARE ---
  {
    id: 'w-gard-1',
    name: 'Ramu Mali',
    service: 'Gardener & Lawn Care',
    location: 'Meerut',
    locality: 'Cantt Garden Area',
    distanceKm: 2.7,
    eta: '20–25 min',
    rating: 4.8,
    jobs: 110,
    price: 289,
    badge: 'Verified',
    experience: '9 yrs',
    availability: 'Available now',
    availableDates: ['today', 'tomorrow', 'flexible'],
  },

  // --- CCTV & SMART SECURITY ---
  {
    id: 'w-cctv-1',
    name: 'Deepak Goel',
    service: 'CCTV & Smart Security',
    location: 'Meerut',
    locality: 'Suraj Kund',
    distanceKm: 2.3,
    eta: '15–25 min',
    rating: 4.9,
    jobs: 165,
    price: 349,
    badge: 'Top rated',
    experience: '8 yrs',
    availability: 'Available now',
    availableDates: ['today', 'tomorrow', 'flexible'],
  },
  {
    id: 'w-cctv-2',
    name: 'Vivek Joshi',
    service: 'CCTV & Smart Security',
    location: 'Noida',
    locality: 'Sector 76',
    distanceKm: 29.0,
    eta: 'Advance Appointment',
    rating: 4.9,
    jobs: 210,
    price: 399,
    badge: 'Master Artisan',
    experience: '10 yrs',
    availability: 'Advance booking',
    availableDates: ['tomorrow', 'flexible'],
  },
]

const ALL_SERVICES_LIST = [
  'All services',
  'Electrician',
  'Plumber',
  'Carpenter',
  'Painter',
  'AC Technician',
  'Mason / Raj Mistri',
  'Home Cleaning',
  'Construction Labor',
  'Welder & Fabricator',
  'Loading & Shifting',
  'Appliance Repair',
  'Tiles & Marble Mason',
  'Pest Control',
  'Gardener & Lawn Care',
  'CCTV & Smart Security',
]

const TIME_SLOTS = [
  { id: 'morning', label: 'Morning (09:00 AM – 12:00 PM)', icon: '🌅' },
  { id: 'afternoon', label: 'Afternoon (12:00 PM – 03:00 PM)', icon: '☀️' },
  { id: 'evening', label: 'Evening (03:00 PM – 06:00 PM)', icon: '🌆' },
  { id: 'night', label: 'Late Evening (06:00 PM – 09:00 PM)', icon: '🌙' },
]

// Distance offset index for Meerut localities to dynamically calculate customer proximity
const LOCALITY_OFFSETS_KM = {
  'Ganga Sagar': 0.0,
  'Ganga Nagar': 1.0,
  'Suraj Kund': 2.2,
  'Saket': 2.6,
  'Begum Bridge': 3.2,
  'Civil Lines': 3.5,
  'Cantt': 3.5,
  'Meerut Cantt': 3.5,
  'Cantt Garden Area': 3.5,
  'Abu Lane': 3.6,
  'Sadar Bazar': 3.8,
  'Hapur Stand': 4.0,
  'Shastri Nagar': 4.2,
  'Jagriti Vihar': 4.5,
  'Railway Road': 4.8,
  'Brahmpuri': 5.2,
  'Roorkee Road': 5.8,
  'Pallavpuram': 6.8,
  'Transport Nagar': 7.0,
  'Baghpat Road': 7.2,
  'Kankerkhera': 7.5,
  'Modipuram': 8.2,
  'Partapur': 8.8,
  'Partapur Industrial Area': 8.8,
}

function computeWorkerDistance(worker, currentArea) {
  // If worker is located in another city (e.g. Delhi, Ghaziabad, Noida)
  if (worker.location !== 'Meerut') {
    return {
      distanceKm: worker.distanceKm,
      eta: worker.eta,
      isImmediate: false,
    }
  }

  // Both customer and worker are in Meerut:
  const custOffset = LOCALITY_OFFSETS_KM[currentArea] !== undefined ? LOCALITY_OFFSETS_KM[currentArea] : 0.0
  const workerOffset = LOCALITY_OFFSETS_KM[worker.locality] !== undefined ? LOCALITY_OFFSETS_KM[worker.locality] : 2.5

  let rawDist = 0.8
  if (currentArea && currentArea.toLowerCase() === worker.locality.toLowerCase()) {
    rawDist = 0.8
  } else {
    rawDist = Math.abs(custOffset - workerOffset) + 0.6
  }
  const roundedDist = Math.round(rawDist * 10) / 10

  let etaText = '15–20 min'
  if (roundedDist <= 2.5) {
    etaText = '15–20 min'
  } else if (roundedDist <= 5.0) {
    etaText = '20–30 min'
  } else if (roundedDist <= 7.5) {
    etaText = '25–35 min'
  } else {
    etaText = '30–45 min'
  }

  return {
    distanceKm: roundedDist,
    eta: etaText,
    isImmediate: roundedDist <= 10.0,
  }
}

export default function Workers({ onNavigate }) {
  // 1. Customer Location State (Area, City, Full String)
  const [customerLocation, setCustomerLocation] = useState(() => getSavedLocation())
  const customerArea = customerLocation.area || 'Ganga Sagar'
  const customerCity = customerLocation.city || 'Meerut'

  // Colony/Area Selector Modal State
  const [isAreaModalOpen, setIsAreaModalOpen] = useState(false)
  const [areaSearch, setAreaSearch] = useState('')
  const [gpsDetecting, setGpsDetecting] = useState(false)
  const [gpsStatusMsg, setGpsStatusMsg] = useState('')

  useEffect(() => {
    const handleLocUpdate = (e) => {
      if (e.detail) {
        setCustomerLocation(e.detail)
      }
    }
    window.addEventListener('mazdoor_location_updated', handleLocUpdate)
    return () => window.removeEventListener('mazdoor_location_updated', handleLocUpdate)
  }, [])

  const handleSelectLocality = (localityName) => {
    const full = `${localityName}, ${customerCity}`
    saveLocation(full, customerCity, localityName, customerLocation.coords)
    setCustomerLocation({
      location: full,
      city: customerCity,
      area: localityName,
      coords: customerLocation.coords,
    })
    setIsAreaModalOpen(false)
    setAreaSearch('')
  }

  const handleGpsPinpoint = () => {
    setGpsDetecting(true)
    setGpsStatusMsg('Requesting GPS satellite pinpoint...')
    requestGpsLocation(
      (res) => {
        setGpsDetecting(false)
        setGpsStatusMsg('Location pinpointed successfully!')
        setCustomerLocation(res)
        setTimeout(() => {
          setIsAreaModalOpen(false)
          setGpsStatusMsg('')
        }, 1000)
      },
      (err) => {
        setGpsDetecting(false)
        setGpsStatusMsg(err || 'GPS permission denied. Please select your colony below.')
      }
    )
  }

  // 2. Query, Service & Filter States
  const [query, setQuery] = useState('')
  const [selectedService, setSelectedService] = useState(() => {
    try {
      const p = new URLSearchParams(window.location.search)
      return p.get('service') || 'All services'
    } catch {
      return 'All services'
    }
  })

  // Date Filter: 'any' | 'today' | 'tomorrow' | custom 'YYYY-MM-DD'
  const [selectedDateFilter, setSelectedDateFilter] = useState('any')
  const [customDate, setCustomDate] = useState('')

  // Distance Scope: 'all' | 'immediate' (<=10km of area) | 'scheduled' (all Meerut & regional)
  const [distanceScope, setDistanceScope] = useState('all')

  // Sorting
  const [sortBy, setSortBy] = useState('Recommended')

  // Sync with URL query parameters on navigation
  useEffect(() => {
    try {
      const p = new URLSearchParams(window.location.search)
      const s = p.get('service')
      if (s) setSelectedService(s)
      const q = p.get('q')
      if (q) setQuery(q)
    } catch {
      // ignore
    }
  }, [])

  // 3. Scheduling Modal State
  const [scheduleWorker, setScheduleWorker] = useState(null)
  const [modalForm, setModalForm] = useState({
    name: '',
    phone: '',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // default tomorrow
    slot: TIME_SLOTS[0].label,
    address: '',
    notes: '',
  })
  const [bookingConfirmed, setBookingConfirmed] = useState(false)

  const handleOpenSchedule = (worker) => {
    setScheduleWorker(worker)
    setBookingConfirmed(false)
    setModalForm({
      name: '',
      phone: '',
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      slot: TIME_SLOTS[0].label,
      address: `${customerArea}, ${customerCity}`,
      notes: '',
    })
  }

  const handleCloseSchedule = () => {
    setScheduleWorker(null)
    setBookingConfirmed(false)
  }

  const handleConfirmSchedule = (e) => {
    e.preventDefault()
    setBookingConfirmed(true)
  }

  // 4. Smart Filtering & Dynamic Distance Engine
  const { immediateWorkers, scheduledWorkers } = useMemo(() => {
    const sLower = selectedService.toLowerCase().trim()
    const qLower = query.toLowerCase().trim()

    const matchesServiceWorker = (worker) => {
      if (selectedService === 'All services') return true
      const wLower = worker.service.toLowerCase().trim()
      return (
        wLower === sLower ||
        wLower.includes(sLower) ||
        sLower.includes(wLower) ||
        (sLower.includes('mason') && wLower.includes('mason')) ||
        (sLower.includes('construction') && wLower.includes('construction')) ||
        (sLower.includes('cleaning') && wLower.includes('cleaning')) ||
        (sLower.includes('shifting') && wLower.includes('shifting'))
      )
    }

    const matchesQueryWorker = (worker) => {
      if (!qLower) return true
      const fullText = `${worker.name} ${worker.service} ${worker.location} ${worker.locality} ${worker.experience}`.toLowerCase()
      return fullText.includes(qLower)
    }

    const matchesDateWorker = (worker) => {
      if (selectedDateFilter === 'any') return true
      if (selectedDateFilter === 'today') {
        return worker.availableDates.includes('today')
      }
      if (selectedDateFilter === 'tomorrow') {
        return worker.availableDates.includes('tomorrow')
      }
      return worker.availableDates.includes('flexible') || worker.availableDates.includes('tomorrow')
    }

    // Dynamic distance calculation for all workers based on customer's exact locality
    const dynamicWorkers = WORKERS_CATALOG.map((w) => {
      const calc = computeWorkerDistance(w, customerArea)
      return {
        ...w,
        computedDistance: calc.distanceKm,
        computedEta: calc.eta,
      }
    })

    // Filter all
    let filtered = dynamicWorkers.filter(
      (w) => matchesServiceWorker(w) && matchesQueryWorker(w) && matchesDateWorker(w)
    )

    // Sort
    if (sortBy === 'Nearest') {
      filtered.sort((a, b) => a.computedDistance - b.computedDistance)
    } else if (sortBy === 'Top rated') {
      filtered.sort((a, b) => b.rating - a.rating)
    } else if (sortBy === 'Price: low to high') {
      filtered.sort((a, b) => a.price - b.price)
    }

    // 1. Immediate: workers within 10 km range of customer's locality
    const immediate = filtered.filter((w) => w.computedDistance <= 10.0)

    // 2. Scheduled: ALL Meerut workers + regional craftsmen (as requested: "or schudle m meerut m jitne bhi worker h sab dikhe")
    const scheduled = filtered.filter((w) => w.location === 'Meerut' || w.computedDistance > 10.0)

    return { immediateWorkers: immediate, scheduledWorkers: scheduled }
  }, [customerArea, customerCity, selectedService, query, selectedDateFilter, sortBy])

  const totalMatchesCount = immediateWorkers.length + scheduledWorkers.length

  const filteredLocalities = useMemo(() => {
    if (!areaSearch) return MEERUT_LOCALITIES
    const q = areaSearch.toLowerCase().trim()
    return MEERUT_LOCALITIES.filter((l) => l.name.toLowerCase().includes(q))
  }, [areaSearch])

  return (
    <div className="workers-page-wrap">
      {/* 1. LIVE DETECTED CUSTOMER AREA & RADIUS SWITCH */}
      <section className="workers-location-strip" aria-label="Customer Location & Distance Tiers">
        <div className="workers-loc-left">
          <div className="workers-radar-icon">
            <span className="radar-ping" />
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <div className="workers-loc-details">
            <div className="loc-strip-eyebrow">
              <span className="loc-strip-badge">Auto Synced (GPS / Network)</span>
              <span className="loc-strip-meta">City: <b>{customerCity}</b> · Area: <b>{customerArea}</b></span>
            </div>
            <div className="loc-strip-heading">
              Serving: <em>{customerArea}, {customerCity}</em>
            </div>
          </div>
          <button
            type="button"
            className="btn-change-area-pill"
            onClick={() => setIsAreaModalOpen(true)}
            title="Change your colony/area or pinpoint via GPS"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 14, height: 14 }}>
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>Change Area / Colony</span>
            <span className="pill-gps-chip">⚡ GPS</span>
          </button>
        </div>

        {/* Distance Range Filter Switch */}
        <div className="workers-distance-switch" role="group" aria-label="Distance filter">
          <button
            type="button"
            className={`dist-pill-btn ${distanceScope === 'all' ? 'active' : ''}`}
            onClick={() => setDistanceScope('all')}
          >
            <span>All Distances</span>
            <span className="pill-count">{totalMatchesCount}</span>
          </button>
          <button
            type="button"
            className={`dist-pill-btn ${distanceScope === 'immediate' ? 'active accent-green' : ''}`}
            onClick={() => setDistanceScope('immediate')}
          >
            <span>⚡ Within 10 km ({customerArea})</span>
            <span className="pill-count">{immediateWorkers.length}</span>
          </button>
          <button
            type="button"
            className={`dist-pill-btn ${distanceScope === 'scheduled' ? 'active accent-amber' : ''}`}
            onClick={() => setDistanceScope('scheduled')}
          >
            <span>📅 Schedule (All Meerut)</span>
            <span className="pill-count">{scheduledWorkers.length}</span>
          </button>
        </div>
      </section>

      {/* 2. SEARCH & MULTI-FILTER COMMAND CENTER */}
      <section className="workers-control-card" aria-label="Search and Filter Controls">
        <div className="workers-search-row">
          {/* Keyword Search */}
          <div className="search-input-field">
            <svg className="search-field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              className="workers-search-input"
              placeholder="Search technician by name, colony or trade..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search workers"
            />
          </div>

          {/* Date-wise Booking Filter */}
          <div className="filter-select-wrap">
            <select
              className="workers-select"
              value={selectedDateFilter}
              onChange={(e) => {
                setSelectedDateFilter(e.target.value)
                if (e.target.value !== 'custom') setCustomDate('')
              }}
              aria-label="Filter by appointment date"
            >
              <option value="any">📅 Any Date / Flexible</option>
              <option value="today">⚡ Today (Urgent Dispatch)</option>
              <option value="tomorrow">🗓 Tomorrow (Scheduled Slot)</option>
              <option value="custom">📆 Pick Specific Date...</option>
            </select>
            <svg className="select-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>

          {/* Custom Date Input if selected */}
          {selectedDateFilter === 'custom' ? (
            <div className="date-filter-box">
              <svg className="date-filter-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect width="18" height="18" x="3" y="4" rx="2" />
                <line x1="16" x2="16" y1="2" y2="6" />
                <line x1="8" x2="8" y1="2" y2="6" />
                <line x1="3" x2="21" y1="10" y2="10" />
              </svg>
              <input
                type="date"
                className="date-filter-input"
                min={new Date().toISOString().split('T')[0]}
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
              />
            </div>
          ) : (
            /* Sort Dropdown */
            <div className="filter-select-wrap">
              <select
                className="workers-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort listings"
              >
                <option value="Recommended">Sort: Recommended</option>
                <option value="Nearest">Sort: Nearest Distance</option>
                <option value="Top rated">Sort: Highest Rating</option>
                <option value="Price: low to high">Sort: Standard Rate (Low to High)</option>
              </select>
              <svg className="select-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          )}

          {/* Reset Filters */}
          {(query || selectedService !== 'All services' || selectedDateFilter !== 'any' || distanceScope !== 'all') && (
            <button
              type="button"
              className="btn-reset-filters"
              onClick={() => {
                setQuery('')
                setSelectedService('All services')
                setSelectedDateFilter('any')
                setCustomDate('')
                setDistanceScope('all')
                setSortBy('Recommended')
              }}
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Quick Service Trade Horizontal Pills */}
        <div className="workers-service-scroll" role="tablist" aria-label="Trade categories">
          {ALL_SERVICES_LIST.map((srv) => {
            const isActive = selectedService.toLowerCase() === srv.toLowerCase()
            return (
              <button
                key={srv}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`service-chip-btn ${isActive ? 'active' : ''}`}
                onClick={() => setSelectedService(srv)}
              >
                {srv}
              </button>
            )
          })}
        </div>
      </section>

      {/* 3. TIER A: NEARBY IMMEDIATE DISPATCH (< 10 KM OF CUSTOMER AREA) */}
      {(distanceScope === 'all' || distanceScope === 'immediate') && (
        <section className="tier-section-block" aria-label="Nearby Immediate Workers">
          <div className="tier-section-header">
            <div className="tier-header-left">
              <span className="tier-tag tag-immediate">⚡ Within 10 km</span>
              <h3>Instant Doorstep Dispatch ({customerArea}, {customerCity})</h3>
            </div>
            <span className="tier-header-count">
              <b>{immediateWorkers.length}</b> verified workers available nearby
            </span>
          </div>

          {immediateWorkers.length === 0 ? (
            <div className="workers-empty-state">
              <h4>No immediate workers within 10 km of {customerArea} for this trade</h4>
              <p>Specialized craftsmen across Meerut are available below for scheduled advance booking.</p>
              <button
                type="button"
                className="dist-pill-btn active accent-amber"
                style={{ display: 'inline-flex' }}
                onClick={() => setDistanceScope('scheduled')}
              >
                View All Meerut Scheduled Workers →
              </button>
            </div>
          ) : (
            <div className="worker-cards-grid">
              {immediateWorkers.map((worker) => (
                <article key={worker.id} className="pro-worker-card card-immediate">
                  <div>
                    {/* Top Row: Avatar & Name */}
                    <div className="card-top-row">
                      <div className="card-avatar-wrap">
                        <div className="card-avatar">
                          {worker.name
                            .split(' ')
                            .map((p) => p[0])
                            .slice(0, 2)
                            .join('')}
                        </div>
                        <div className="card-info-header">
                          <div className="card-name-row">
                            <h4 className="worker-name">{worker.name}</h4>
                            <span className="badge-verified-check" title="Aadhaar & Police Verified">✓</span>
                          </div>
                          <span className="worker-trade-label">{worker.service} · {worker.experience} exp</span>
                        </div>
                      </div>
                      <span className="card-avail-badge avail-immediate">⚡ Ready Now</span>
                    </div>

                    {/* Distance & Neighborhood */}
                    <div className="card-location-row">
                      <svg className="card-loc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      <span>
                        <span className="distance-highlight">{worker.computedDistance} km</span> from {customerArea} · {worker.locality}, {worker.location}
                      </span>
                      <span className="card-eta-tag">ETA {worker.computedEta}</span>
                    </div>

                    {/* Metrics: Rating, Jobs, Rate */}
                    <div className="card-metrics-row">
                      <div className="metric-col">
                        <span className="metric-lbl">Rating</span>
                        <span className="metric-val star-rate">★ {worker.rating}</span>
                      </div>
                      <div className="metric-col">
                        <span className="metric-lbl">Completed</span>
                        <span className="metric-val">{worker.jobs}+ jobs</span>
                      </div>
                      <div className="metric-col">
                        <span className="metric-lbl">Visiting Fee</span>
                        <span className="metric-val price-rate">From ₹{worker.price}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="card-action-row">
                    <button
                      type="button"
                      className="btn-book-now"
                      onClick={() => onNavigate('/login')}
                    >
                      <span>⚡ Book Immediate</span>
                      <span>→</span>
                    </button>
                    <button
                      type="button"
                      className="btn-schedule-slot"
                      onClick={() => handleOpenSchedule(worker)}
                      title="Schedule for tomorrow or preferred time slot"
                    >
                      <span>🗓 Schedule</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      {/* 4. TIER B: ALL MEERUT & REGIONAL SPECIALISTS (ADVANCE SCHEDULING) */}
      {(distanceScope === 'all' || distanceScope === 'scheduled') && (
        <section className="tier-section-block" aria-label="Schedule Booking Workers">
          <div className="tier-section-header">
            <div className="tier-header-left">
              <span className="tier-tag tag-scheduled">📅 Schedule Booking</span>
              <h3>All Meerut City &amp; Regional Craftsmen (Advance Booking)</h3>
            </div>
            <span className="tier-header-count">
              <b>{scheduledWorkers.length}</b> specialists available across Meerut
            </span>
          </div>

          {scheduledWorkers.length === 0 ? (
            <div className="workers-empty-state">
              <h4>No workers match this filter in Meerut</h4>
              <p>Try resetting trade categories or date filters.</p>
            </div>
          ) : (
            <div className="worker-cards-grid">
              {scheduledWorkers.map((worker) => (
                <article key={worker.id} className="pro-worker-card card-scheduled">
                  <div>
                    {/* Top Row: Avatar & Name */}
                    <div className="card-top-row">
                      <div className="card-avatar-wrap">
                        <div className="card-avatar" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' }}>
                          {worker.name
                            .split(' ')
                            .map((p) => p[0])
                            .slice(0, 2)
                            .join('')}
                        </div>
                        <div className="card-info-header">
                          <div className="card-name-row">
                            <h4 className="worker-name">{worker.name}</h4>
                            <span className="badge-verified-check" style={{ background: '#d97706' }}>✓</span>
                          </div>
                          <span className="worker-trade-label" style={{ color: '#d97706' }}>
                            {worker.service} · {worker.experience} exp
                          </span>
                        </div>
                      </div>
                      <span className="card-avail-badge avail-scheduled">📅 Slot Booking</span>
                    </div>

                    {/* Distance & Regional Hub */}
                    <div className="card-location-row">
                      <svg className="card-loc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      <span>
                        <span className="distance-highlight">{worker.computedDistance} km</span> away · {worker.locality}, {worker.location}
                      </span>
                      <span className="card-eta-tag" style={{ color: '#d97706' }}>Slot Booking</span>
                    </div>

                    {/* Metrics */}
                    <div className="card-metrics-row">
                      <div className="metric-col">
                        <span className="metric-lbl">Rating</span>
                        <span className="metric-val star-rate">★ {worker.rating}</span>
                      </div>
                      <div className="metric-col">
                        <span className="metric-lbl">Completed</span>
                        <span className="metric-val">{worker.jobs}+ jobs</span>
                      </div>
                      <div className="metric-col">
                        <span className="metric-lbl">Standard Rate</span>
                        <span className="metric-val price-rate">From ₹{worker.price}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons: Schedule Booking Primary */}
                  <div className="card-action-row">
                    <button
                      type="button"
                      className="btn-book-now"
                      style={{ background: '#d97706' }}
                      onClick={() => handleOpenSchedule(worker)}
                    >
                      <span>🗓 Schedule Booking (Pick Slot)</span>
                      <span>→</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      {/* 5. INTERACTIVE SCHEDULE BOOKING MODAL */}
      {scheduleWorker && (
        <div className="modal-overlay-backdrop" onClick={handleCloseSchedule} role="dialog" aria-modal="true">
          <div className="schedule-modal-card" onClick={(e) => e.stopPropagation()}>
            {bookingConfirmed ? (
              <div className="modal-success-banner">
                <div style={{ fontSize: 44, marginBottom: 12 }}>🎉</div>
                <h4>Booking Appointment Scheduled!</h4>
                <p>
                  Your request with <strong>{scheduleWorker.name}</strong> ({scheduleWorker.service}) for{' '}
                  <strong>{modalForm.date}</strong> ({modalForm.slot}) has been confirmed.
                </p>
                <div style={{ background: '#ffffff', padding: 14, borderRadius: 12, border: '1px solid #bbf7d0', marginBottom: 18, fontSize: 13 }}>
                  <div><strong>Location:</strong> {modalForm.address}</div>
                  <div><strong>Booking ID:</strong> MS-SCHED-{Math.floor(1000 + Math.random() * 9000)}</div>
                </div>
                <button
                  type="button"
                  className="modal-submit-btn"
                  onClick={handleCloseSchedule}
                >
                  Done / View More Workers
                </button>
              </div>
            ) : (
              <>
                <div className="modal-header-row">
                  <div className="modal-header-info">
                    <h3>Schedule Booking with {scheduleWorker.name}</h3>
                    <p>{scheduleWorker.service} · {scheduleWorker.computedDistance} km from {customerArea}, {customerCity}</p>
                  </div>
                  <button type="button" className="btn-close-modal" onClick={handleCloseSchedule} aria-label="Close dialog">
                    ×
                  </button>
                </div>

                <form onSubmit={handleConfirmSchedule}>
                  <div className="modal-form-group">
                    <label className="modal-label">Your Full Name &amp; Contact Number</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 10 }}>
                      <input
                        type="text"
                        className="modal-input"
                        placeholder="Your Name"
                        required
                        value={modalForm.name}
                        onChange={(e) => setModalForm({ ...modalForm, name: e.target.value })}
                      />
                      <input
                        type="tel"
                        className="modal-input"
                        placeholder="Phone Number"
                        required
                        value={modalForm.phone}
                        onChange={(e) => setModalForm({ ...modalForm, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="modal-form-group">
                    <label className="modal-label">Appointment Date</label>
                    <input
                      type="date"
                      className="modal-input"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={modalForm.date}
                      onChange={(e) => setModalForm({ ...modalForm, date: e.target.value })}
                    />
                  </div>

                  <div className="modal-form-group">
                    <label className="modal-label">Select Preferred Arrival Time Slot</label>
                    <div className="slots-grid">
                      {TIME_SLOTS.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          className={`slot-chip ${modalForm.slot === s.label ? 'selected' : ''}`}
                          onClick={() => setModalForm({ ...modalForm, slot: s.label })}
                        >
                          <span style={{ marginRight: 6 }}>{s.icon}</span>
                          <span>{s.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="modal-form-group">
                    <label className="modal-label">Service Address / Landmark ({customerCity})</label>
                    <input
                      type="text"
                      className="modal-input"
                      required
                      value={modalForm.address}
                      onChange={(e) => setModalForm({ ...modalForm, address: e.target.value })}
                      placeholder="Enter flat / house number, colony, landmark"
                    />
                  </div>

                  <div className="modal-form-group">
                    <label className="modal-label">Work Description / Problem Details (Optional)</label>
                    <textarea
                      className="modal-textarea"
                      placeholder="Briefly describe what needs to be fixed or installed..."
                      value={modalForm.notes}
                      onChange={(e) => setModalForm({ ...modalForm, notes: e.target.value })}
                    />
                  </div>

                  <button type="submit" className="modal-submit-btn">
                    <span>Confirm Scheduled Booking →</span>
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* 6. AREA / COLONY SELECTION & LIVE GPS PINPOINT MODAL */}
      {isAreaModalOpen && (
        <div className="modal-overlay-backdrop" onClick={() => setIsAreaModalOpen(false)} role="dialog" aria-modal="true">
          <div className="area-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-row">
              <div className="modal-header-info">
                <h3>Select Your Area / Colony in {customerCity}</h3>
                <p>Distances and 10 km doorstep workers will automatically recalculate for your exact colony.</p>
              </div>
              <button type="button" className="btn-close-modal" onClick={() => setIsAreaModalOpen(false)}>×</button>
            </div>

            {/* GPS Pinpoint Button */}
            <div className="gps-pinpoint-card">
              <button
                type="button"
                className="btn-gps-trigger"
                onClick={handleGpsPinpoint}
                disabled={gpsDetecting}
              >
                <span className="gps-btn-icon">⚡</span>
                <span className="gps-btn-text">
                  <b>{gpsDetecting ? 'Detecting Your Exact Street GPS...' : 'Use Live GPS Pinpoint'}</b>
                  <small>Auto-detects your current neighborhood &amp; colony</small>
                </span>
              </button>
              {gpsStatusMsg && <div className="gps-status-text">{gpsStatusMsg}</div>}
            </div>

            {/* Search Colony */}
            <div className="area-search-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}>
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="text"
                placeholder="Type your colony (e.g. Ganga Sagar, Ganga Nagar, Shastri Nagar)..."
                value={areaSearch}
                onChange={(e) => setAreaSearch(e.target.value)}
                className="area-search-input"
              />
            </div>

            {/* If user typed any colony name, show 1-click select button */}
            {areaSearch.trim() && (
              <button
                type="button"
                className="btn-use-custom-area"
                onClick={() => handleSelectLocality(areaSearch.trim())}
              >
                <span>📍 Set My Location: <b>"{areaSearch.trim()}, {customerCity}"</b></span>
                <span className="btn-select-arrow">Apply Now →</span>
              </button>
            )}

            {/* List of Colonies */}
            <div className="colonies-chips-wrap">
              {filteredLocalities.map((loc) => {
                const isCurrent = customerArea.toLowerCase() === loc.name.toLowerCase()
                return (
                  <button
                    key={loc.id}
                    type="button"
                    className={`colony-choice-btn ${isCurrent ? 'selected' : ''}`}
                    onClick={() => handleSelectLocality(loc.name)}
                  >
                    <span className="colony-pin-icon">📍</span>
                    <span className="colony-name">{loc.name}</span>
                    {isCurrent && <span className="colony-selected-tag">Active</span>}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
