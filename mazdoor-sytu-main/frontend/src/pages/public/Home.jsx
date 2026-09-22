import { useState, useEffect, useRef } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { autoDetectLocation, getSavedLocation } from '../../utils/locationService'
import './Home.css'

const PLAYSTORE_URL = 'https://play.google.com/store/apps/details?id=com.mazdoorsetu.mazdoor_setu&pcampaignid=web_share'

// 20 Verified Skilled Services with authentic photos and rich metadata
const popularServices = [
  {
    id: 'electrician',
    title: 'Electrician',
    actionLabel: 'Book Electrician',
    category: 'Electrical',
    group: 'repair',
    description: 'Wiring, switchboard fixes, fan repair, circuit breakers, and electrical installations.',
    image: '/services/service-electrician.jpg',
    rating: '4.9',
    jobsDone: '3.8k',
    startingPrice: '₹199',
    tags: ['Wiring & MCB', 'Ceiling Fans', 'Inverter Setup'],
  },
  {
    id: 'plumber',
    title: 'Plumber',
    actionLabel: 'Book Plumber',
    category: 'Plumbing',
    group: 'repair',
    description: 'Leak repairs, pipe fittings, drain cleaning, tap installations, and sanitary setup.',
    image: '/services/service-plumber.jpg',
    rating: '4.8',
    jobsDone: '4.1k',
    startingPrice: '₹149',
    tags: ['Pipe Leaks', 'Tap Fitting', 'Drain Unclog'],
  },
  {
    id: 'carpenter',
    title: 'Carpenter',
    actionLabel: 'Book Carpenter',
    category: 'Woodwork',
    group: 'repair',
    description: 'Custom furniture, woodwork repairs, door locks, modular cabinets, and fittings.',
    image: '/services/service-carpenter.jpg',
    rating: '4.9',
    jobsDone: '2.9k',
    startingPrice: '₹249',
    tags: ['Furniture Fix', 'Door & Locks', 'Modular Wood'],
  },
  {
    id: 'painter',
    title: 'Painter',
    actionLabel: 'Book Painter',
    category: 'Painting',
    group: 'construction',
    description: 'Interior & exterior wall painting, waterproof coating, primer application, and finishes.',
    image: '/services/service-painter.jpg',
    rating: '4.8',
    jobsDone: '2.1k',
    startingPrice: '₹349',
    tags: ['Wall Painting', 'Putty & Primer', 'Waterproofing'],
  },
  {
    id: 'ac-technician',
    title: 'AC Technician',
    actionLabel: 'Book AC Technician',
    category: 'HVAC & Cooling',
    group: 'repair',
    description: 'AC installation, filter cleaning, cooling diagnostics, compressor repair, and gas refilling.',
    image: '/services/service-ac-technician.jpg',
    rating: '4.9',
    jobsDone: '3.4k',
    startingPrice: '₹399',
    tags: ['Deep Jet Cleaning', 'Gas Refill', 'AC Install'],
  },
  {
    id: 'mason',
    title: 'Mason (Raj Mistri)',
    actionLabel: 'Book Mason',
    category: 'Civil & Masonry',
    group: 'construction',
    description: 'Brickwork, wall plastering, tile setting, concrete foundation, and civil renovations.',
    image: '/services/service-mason.jpg',
    rating: '4.8',
    jobsDone: '1.9k',
    startingPrice: '₹499',
    tags: ['Brick Masonry', 'Wall Plaster', 'Civil Renovation'],
  },
  {
    id: 'construction-worker',
    title: 'Construction Labor',
    actionLabel: 'Hire Construction Labor',
    category: 'Site Labor',
    group: 'construction',
    description: 'Site labor, building construction, material shifting, excavation, and renovation teams.',
    image: '/services/service-construction.jpg',
    rating: '4.7',
    jobsDone: '5.2k',
    startingPrice: '₹449',
    tags: ['Site Labor', 'Material Shifting', 'Bulk Teams'],
  },
  {
    id: 'home-cleaning',
    title: 'Home Deep Cleaning',
    actionLabel: 'Book Deep Cleaning',
    category: 'Sanitization',
    group: 'cleaning',
    description: 'Deep house cleaning, kitchen scrubbing, bathroom sanitization, and floor polishing.',
    image: '/services/service-cleaning.jpg',
    rating: '4.8',
    jobsDone: '2.6k',
    startingPrice: '₹499',
    tags: ['Deep Cleaning', 'Kitchen & Bath', 'Floor Scrub'],
  },
  {
    id: 'loading-unloading',
    title: 'Loading & Shifting',
    actionLabel: 'Book Shifting Helpers',
    category: 'Logistics',
    group: 'moving',
    description: 'Heavy goods shifting, furniture moving, truck unloading, and warehouse handling.',
    image: '/services/service-loading.jpg',
    rating: '4.8',
    jobsDone: '3.1k',
    startingPrice: '₹299',
    tags: ['Furniture Move', 'Truck Unloading', 'Luggage Helper'],
  },
  {
    id: 'welder-fabricator',
    title: 'Welder & Fabricator',
    actionLabel: 'Book Fabricator',
    category: 'Metalwork',
    group: 'construction',
    description: 'Iron gates, window grills, structural metal frames, cutting, and precision welding.',
    image: '/services/service-welder.jpg',
    rating: '4.8',
    jobsDone: '1.7k',
    startingPrice: '₹349',
    tags: ['Iron Gates', 'Window Grills', 'Metal Cutting'],
  },
  {
    id: 'appliance-repair',
    title: 'Appliance Repair',
    actionLabel: 'Book Appliance Repair',
    category: 'Home Appliances',
    group: 'repair',
    description: 'Washing machines, refrigerators, microwaves, water purifiers (RO), and geyser fixes.',
    image: '/services/service-appliance.jpg',
    rating: '4.9',
    jobsDone: '2.8k',
    startingPrice: '₹249',
    tags: ['Washing Machine', 'Refrigerator', 'Geysers'],
  },
  {
    id: 'tiling-flooring',
    title: 'Tiles & Marble Mason',
    actionLabel: 'Book Tile & Marble Mason',
    category: 'Flooring',
    group: 'construction',
    description: 'Floor and wall tile fixing, marble cutting, granite fitting, and diamond polishing.',
    image: '/services/service-tiler.jpg',
    rating: '4.9',
    jobsDone: '1.6k',
    startingPrice: '₹399',
    tags: ['Floor Tiles', 'Marble Cutting', 'Granite Slabs'],
  },
  {
    id: 'pest-control',
    title: 'Pest Control',
    actionLabel: 'Book Pest Control',
    category: 'Pest Management',
    group: 'cleaning',
    description: 'Termite protection, cockroach gel treatment, bed bug removal, and mosquito fogging.',
    image: '/services/service-pest-control.jpg',
    rating: '4.8',
    jobsDone: '1.8k',
    startingPrice: '₹599',
    tags: ['Cockroach Gel', 'Termite Shield', 'Bed Bug Clean'],
  },
  {
    id: 'gardener',
    title: 'Gardener & Lawn Care',
    actionLabel: 'Book Gardening Service',
    category: 'Gardening',
    group: 'cleaning',
    description: 'Lawn mowing, hedge trimming, plant potting, soil enrichment, and terrace garden care.',
    image: '/services/service-gardener.jpg',
    rating: '4.8',
    jobsDone: '1.4k',
    startingPrice: '₹299',
    tags: ['Lawn Mowing', 'Hedge Trimming', 'Terrace Garden'],
  },
  {
    id: 'cctv-technician',
    title: 'CCTV & Smart Security',
    actionLabel: 'Book CCTV Technician',
    category: 'Tech & Security',
    group: 'repair',
    description: 'Security camera installation, DVR/NVR network setup, smart video doorbells, and intercoms.',
    image: '/services/service-cctv.jpg',
    rating: '4.9',
    jobsDone: '1.9k',
    startingPrice: '₹349',
    tags: ['CCTV Camera', 'WiFi Video Doorbell', 'DVR / NVR'],
  },
  {
    id: 'metal-fabricator',
    title: 'Iron Gate & Grill Works',
    actionLabel: 'Book Fabrication Work',
    category: 'Fabrication',
    group: 'construction',
    description: 'Custom balcony safety grills, main entry metal gates, stair railings, and metal sheds.',
    image: '/services/service-fabricator.jpg',
    rating: '4.8',
    jobsDone: '1.3k',
    startingPrice: '₹449',
    tags: ['Main Gates', 'Balcony Grills', 'Stair Railings'],
  },
  {
    id: 'waterproofing',
    title: 'Waterproofing Specialist',
    actionLabel: 'Book Waterproofing',
    category: 'Waterproofing',
    group: 'construction',
    description: 'Roof leakage solutions, bathroom dampness proofing, terrace bitumen coating, and crack seal.',
    image: '/services/service-waterproofing.jpg',
    rating: '4.9',
    jobsDone: '1.5k',
    startingPrice: '₹549',
    tags: ['Roof Leakage', 'Damp Treatment', 'Terrace Coating'],
  },
  {
    id: 'pop-false-ceiling',
    title: 'POP & False Ceiling',
    actionLabel: 'Book Ceiling Expert',
    category: 'Interior Civil',
    group: 'construction',
    description: 'Designer gypsum ceilings, POP cornice borders, cove lighting framing, and wall acoustic boards.',
    image: '/services/service-pop-ceiling.jpg',
    rating: '4.8',
    jobsDone: '1.2k',
    startingPrice: '₹499',
    tags: ['Gypsum Ceiling', 'POP Borders', 'Cove Lighting'],
  },
  {
    id: 'ro-purifier',
    title: 'RO Water Purifier',
    actionLabel: 'Book RO Service',
    category: 'Appliances',
    group: 'repair',
    description: 'Filter replacement, membrane cleaning, TDS adjustment, new RO installation, and servicing.',
    image: '/services/service-ro-purifier.jpg',
    rating: '4.9',
    jobsDone: '2.9k',
    startingPrice: '₹199',
    tags: ['Filter Change', 'RO Service', 'TDS Check'],
  },
  {
    id: 'solar-panel',
    title: 'Solar Panel Technician',
    actionLabel: 'Book Solar Technician',
    category: 'Solar & Clean Tech',
    group: 'repair',
    description: 'Rooftop solar panel installation, inverter wiring, battery bank maintenance, and panel cleaning.',
    image: '/services/service-solar.jpg',
    rating: '4.9',
    jobsDone: '940+',
    startingPrice: '₹599',
    tags: ['Rooftop Solar', 'Inverter Wiring', 'Panel Cleaning'],
  },
]

// 8-Step Transparent Workflow for How Mazdoor Sytu Works
const howItWorksSteps = [
  {
    num: '01',
    title: 'Choose a Service',
    description: 'Select the exact skill you need, from electrical and plumbing to masonry and painting.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Enter Location',
    description: 'Provide your neighborhood or PIN code to discover eligible workers closest to you.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Find a Suitable Worker',
    description: 'Browse verified profiles, compare real ratings, review work history, and check hourly rates.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    num: '04',
    title: 'Immediate or Scheduled',
    description: 'Choose instant dispatch with Book Now, or schedule a worker for a future date and time.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect width="18" height="18" x="3" y="4" rx="2" />
        <line x1="16" x2="16" y1="2" y2="6" />
        <line x1="8" x2="8" y1="2" y2="6" />
        <line x1="3" x2="21" y1="10" y2="10" />
      </svg>
    ),
  },
  {
    num: '05',
    title: 'Track the Worker',
    description: 'Receive real-time booking updates and track your worker’s arrival live on the map.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polygon points="3 11 22 2 13 21 11 13 3 11" />
      </svg>
    ),
  },
  {
    num: '06',
    title: 'Complete the Work',
    description: 'The professional completes the task on site with direct communication and care.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
  },
  {
    num: '07',
    title: 'Make Payment',
    description: 'Pay securely using digital methods or cash, and receive an instant digital invoice.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect width="20" height="14" x="2" y="5" rx="2" />
        <line x1="2" x2="22" y1="10" y2="10" />
      </svg>
    ),
  },
  {
    num: '08',
    title: 'Leave a Review',
    description: 'Rate your worker’s service to help fellow community members make informed decisions.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
]

// 9 Capabilities for Why Choose Mazdoor Sytu
const capabilities = [
  {
    title: 'Verified Worker Profiles',
    description: 'Every worker undergoes strict government ID (Aadhaar) and background verification checks.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    title: 'Nearby Worker Discovery',
    description: 'Intelligent hyperlocal discovery matches you with skilled professionals closest to your address.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="m4.93 4.93 4.24 4.24" />
        <path d="m14.83 9.17 4.24-4.24" />
        <path d="m14.83 14.83 4.24 4.24" />
        <path d="m9.17 14.83-4.24 4.24" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    title: 'Real-Time Availability',
    description: 'See live status indicators showing who is online, ready for work now, or available today.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    title: 'Scheduled Bookings',
    description: 'Book days or weeks in advance with guaranteed worker attendance for renovations and projects.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="18" x="3" y="4" rx="2" />
        <line x1="16" x2="16" y1="2" y2="6" />
        <line x1="8" x2="8" y1="2" y2="6" />
        <line x1="3" x2="21" y1="10" y2="10" />
      </svg>
    ),
  },
  {
    title: 'Live Tracking for Eligible Bookings',
    description: 'Track your worker’s real-time journey on the map with accurate estimated arrival times.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="3 11 22 2 13 21 11 13 3 11" />
      </svg>
    ),
  },
  {
    title: 'Secure Payments',
    description: 'Transparent rates with secure digital escrow, UPI, card options, or cash upon completion.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="14" x="2" y="5" rx="2" />
        <line x1="2" x2="22" y1="10" y2="10" />
      </svg>
    ),
  },
  {
    title: 'Digital Invoices',
    description: 'Receive itemized, transparent bills and GST-compliant invoices immediately after job completion.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" x2="8" y1="13" y2="13" />
        <line x1="16" x2="8" y1="17" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    title: 'Platform Communication',
    description: 'Communicate directly with your worker while keeping personal contact numbers secure and private.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    title: 'Dedicated Customer Support',
    description: 'Our customer care team is available 24/7 to help with bookings, disputes, and inquiries.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
]

// 4 Pillars of Trust & Safety
const trustPillars = [
  {
    title: '100% Identity Verification',
    description: 'Government photo IDs, trade credentials, and background checks are authenticated before onboarding.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <polyline points="16 11 18 13 22 9" />
      </svg>
    ),
  },
  {
    title: 'Verified Customer Reviews',
    description: 'Every rating and review comes strictly from customers with completed, authentic platform bookings.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    title: 'Transparent Pricing Guarantee',
    description: 'Clear starting rates with no hidden fees or unfair surge markups. You know the cost before confirming.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
        <path d="M12 18V6" />
      </svg>
    ),
  },
  {
    title: 'Safety & Dispute Resolution',
    description: 'Round-the-clock safety protocol support, booking mediation, and fair customer conflict resolution.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
]

// 9 Comprehensive FAQs
const faqs = [
  {
    q: 'How do I discover skilled workers near me?',
    a: 'You can discover nearby workers right from the homepage search bar or the Find Workers page. Simply select the service you need (e.g., Electrician, Plumber, Mason) and enter your locality or city. The platform instantly displays verified professionals who operate in your area with their ratings, response times, and starting prices.',
  },
  {
    q: 'How do I book a worker on Mazdoor Sytu?',
    a: 'Once you select a service and review available worker profiles, click "Book Now" for instant dispatch or "Schedule" to choose a convenient future date and time. Confirm your address and job requirements, and your booking request will be instantly dispatched to the worker.',
  },
  {
    q: 'Can I schedule a worker for a future date and time?',
    a: 'Yes! Mazdoor Sytu offers full scheduling capabilities. When choosing "Schedule a Worker," you can select the exact date, preferred morning or afternoon time slot, and specify multi-day requirements for larger repair or construction projects.',
  },
  {
    q: 'How quickly can an immediate worker arrive at my location?',
    a: 'When you select "Book Now," our hyperlocal algorithm assigns eligible workers located within 2 to 5 km of your address. In most urban clusters, workers arrive within 15 to 30 minutes of booking confirmation.',
  },
  {
    q: 'How does live tracking work?',
    a: 'For eligible instant bookings, once a worker accepts and departs for your location, you can view their real-time location and estimated time of arrival (ETA) directly in the mobile app and customer dashboard.',
  },
  {
    q: 'What payment methods are accepted and when do I pay?',
    a: 'You can pay using UPI, debit/credit cards, net banking, or verified cash directly to the worker upon job completion. Once payment is confirmed, an itemized digital invoice is generated and saved in your account.',
  },
  {
    q: 'What is the cancellation policy?',
    a: 'You can cancel any booking free of charge before the worker has departed for your location. If you need to change your schedule, you can easily reschedule to a new date or time from your customer dashboard.',
  },
  {
    q: 'How can skilled workers register on Mazdoor Sytu?',
    a: 'Workers can click "Join as a Worker" or sign up through the mobile app. You will provide your name, phone number, primary skill, experience, and upload your Aadhaar card and trade certificates. Once verified by our onboarding team, your profile goes live.',
  },
  {
    q: 'How do businesses hire multiple workers or teams?',
    a: 'Businesses can click "Post a Requirement" to submit bulk workforce needs, specifying the number of workers, trades, project duration, and site location. Mazdoor Sytu provides dedicated account management, crew coordination, and consolidated GST invoicing.',
  },
]

// Starter prompts for AI Assistant
const starterPrompts = [
  'What is Mazdoor Sytu?',
  'How does it work?',
  'Who can use this platform?',
  'Find me a plumber',
  'Need electrician nearby',
  'Help me book a worker',
]

function getAssistantReply(input) {
  const normalized = input.toLowerCase()
  if (!normalized.trim()) {
    return 'Tell me what you need and I can guide you on the right service, worker, or booking flow.'
  }
  if (normalized.includes('mazdoor') || normalized.includes('setu') || normalized.includes('platform') || normalized.includes('what is this')) {
    return 'Mazdoor Sytu is a trusted platform that connects workers, households, and businesses. You can find nearby workers, compare profiles, check availability, and book services with clear pricing.'
  }
  if (normalized.includes('how does it work') || normalized.includes('process') || normalized.includes('steps')) {
    return 'It works in 8 simple steps: choose a service, enter your location, find a worker, choose instant Book Now or Schedule, track the worker, complete the work, pay securely, and leave a review.'
  }
  if (normalized.includes('plumb')) {
    return 'We have top-rated plumbers available for leak repairs, tap fittings, and drainage work. Tap "Find Workers" to browse nearby plumbers.'
  }
  if (normalized.includes('electric')) {
    return 'Electricians are ready in your area for wiring, appliance setup, and fan/switch repairs. Browse verified electricians with same-day availability.'
  }
  return 'Mazdoor Sytu helps people find reliable local skilled workers quickly. You can search by service, compare verified profiles, see real-time availability, and book with complete confidence.'
}

function AnimatedMetricCounter({ target, duration = 1900, isVisible, decimals = 0, suffix = '' }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isVisible) return

    let startTime = null
    let animationFrameId = null

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3)
      setCount(ease * target)

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step)
      } else {
        setCount(target)
      }
    }

    animationFrameId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(animationFrameId)
  }, [target, duration, isVisible])

  if (decimals > 0) {
    return (
      <span>
        {count.toFixed(decimals)}
        {suffix}
      </span>
    )
  }

  return (
    <span>
      {Math.floor(count).toLocaleString('en-IN')}
      {suffix}
    </span>
  )
}

export default function Home({ onNavigate }) {
  const { t } = useLanguage()

  // Animated counting metrics ribbon observer
  const metricsRibbonRef = useRef(null)
  const [metricsVisible, setMetricsVisible] = useState(false)

  useEffect(() => {
    const el = metricsRibbonRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMetricsVisible(true)
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Search Bar State with instant auto-detected location
  const [selectedService, setSelectedService] = useState('All services')
  const [locationQuery, setLocationQuery] = useState(() => getSavedLocation().location || '')
  const [locationSource, setLocationSource] = useState(() => (getSavedLocation().location ? 'auto' : ''))
  const [isLocating, setIsLocating] = useState(false)

  // Auto-detect user location immediately upon arriving at the website
  useEffect(() => {
    setIsLocating(true)
    autoDetectLocation((detectedLoc, detectedCity, source) => {
      if (detectedLoc) {
        setLocationQuery(detectedLoc)
        setLocationSource(source)
        setIsLocating(false)
      }
    })
  }, [])

  const handleManualLocate = () => {
    setIsLocating(true)
    autoDetectLocation((detectedLoc, detectedCity, source) => {
      if (detectedLoc) {
        setLocationQuery(detectedLoc)
        setLocationSource(source)
        setIsLocating(false)
      }
    })
  }

  // Popular Services Filtering & Search State
  const [activeServiceTab, setActiveServiceTab] = useState('all')
  const [serviceSearchQuery, setServiceSearchQuery] = useState('')

  const serviceCategories = [
    { id: 'all', label: t('category_all', 'All Trades'), count: popularServices.length },
    { id: 'repair', label: t('category_repair', 'Home Repairs'), count: popularServices.filter(s => s.group === 'repair').length },
    { id: 'construction', label: t('category_construction', 'Construction & Civil'), count: popularServices.filter(s => s.group === 'construction').length },
    { id: 'cleaning', label: t('category_cleaning', 'Cleaning & Pest'), count: popularServices.filter(s => s.group === 'cleaning').length },
    { id: 'moving', label: t('category_logistics', 'Shifting & Logistics'), count: popularServices.filter(s => s.group === 'moving').length },
  ]

  const filteredServices = popularServices.filter((srv) => {
    const matchesTab = activeServiceTab === 'all' || srv.group === activeServiceTab
    const q = serviceSearchQuery.trim().toLowerCase()
    if (!q) return matchesTab
    const matchesQuery =
      srv.title.toLowerCase().includes(q) ||
      srv.category.toLowerCase().includes(q) ||
      srv.description.toLowerCase().includes(q) ||
      (srv.tags && srv.tags.some(t => t.toLowerCase().includes(q)))
    return matchesTab && matchesQuery
  })

  // FAQ Accordion State
  const [activeFaq, setActiveFaq] = useState(null)

  // Floating AI Assistant State
  const [assistantVisible, setAssistantVisible] = useState(true)
  const [assistantAccepted, setAssistantAccepted] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hi! I can help you find the right worker or service. Tell me what you need.' },
  ])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (selectedService && selectedService !== 'All services') {
      params.set('service', selectedService)
    }
    if (locationQuery.trim()) {
      params.set('location', locationQuery.trim())
    }
    const qStr = params.toString()
    onNavigate(`/workers${qStr ? `?${qStr}` : ''}`)
  }

  const handleToggleFaq = (index) => {
    setActiveFaq((prev) => (prev === index ? null : index))
  }

  const handleSend = () => {
    const trimmed = inputValue.trim()
    if (!trimmed) return
    const userMessage = { sender: 'user', text: trimmed }
    const aiReply = { sender: 'ai', text: getAssistantReply(trimmed) }
    setMessages((current) => [...current, userMessage, aiReply])
    setInputValue('')
  }

  const handlePromptClick = (prompt) => {
    const userMessage = { sender: 'user', text: prompt }
    const aiReply = { sender: 'ai', text: getAssistantReply(prompt) }
    setMessages((current) => [...current, userMessage, aiReply])
  }

  return (
    <div className="home-container">
      {/* 
          1. HERO SECTION (Pronto Style - High Conversion Layout)
           */}
      <section className="hero-wrapper" aria-label="Hero and Worker Search">
        {/* Full-width integrated background image */}
        <div className="hero-bg-img" aria-hidden="true" />

        <div className="hero-container">
          <div className="hero-left">
            {/* Top Trust Pill */}
            <div className="hero-trust-pill">
              <span className="trust-dot">●</span>
              <span>{t('hero_badge', 'Trusted by 500,000+ homes · 11 cities live')}</span>
            </div>

            {/* Main Headline */}
            <h1 className="hero-headline">
              {t('hero_title_1', 'Find Trusted Workers.')} <br className="hero-br" />
              <em>{t('hero_title_2', 'Get Work Done Fast!')}</em>
            </h1>

            {/* Subtitle */}
            <p className="hero-description">
              {t('hero_subtitle', 'Skilled workers for home, construction & business — available near you.')}
            </p>

            {/* Locality Request Link */}
            <div className="hero-locality-row">
              <button
                type="button"
                className="hero-locality-btn"
                onClick={() => onNavigate('/workers')}
              >
                <span>{t('hero_request_locality', 'Request Mazdoor SYTU in your locality →')}</span>
              </button>
            </div>

            {/* Service & Location Search Card */}
            <div className="hero-search-card">
              <form className="hero-search-form" onSubmit={handleSearchSubmit}>
                <div className="search-field-group">
                  <svg className="search-field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="m14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                  </svg>
                  <div className="search-field-inner">
                    <label htmlFor="hero-service-select">{t('hero_service_label', 'Service')}</label>
                    <select id="hero-service-select" value={selectedService} onChange={(e) => setSelectedService(e.target.value)}>
                      <option value="All services">{t('hero_service_placeholder', 'Select a service')}</option>
                      {popularServices.map((srv) => (
                        <option key={srv.id} value={srv.title}>{srv.title}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="search-field-group">
                  <svg className="search-field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <div className="search-field-inner">
                    <div className="location-field-label-row">
                      <label htmlFor="hero-location-input">{t('hero_location_label', 'Location')}</label>
                      {locationQuery && (
                        <span className="location-auto-pill" title={locationSource === 'gps' ? 'High precision GPS location' : 'Auto-detected via network'}>
                          <span className="live-radar-dot" />
                          <span>{locationSource === 'gps' ? 'GPS' : 'Live'}</span>
                        </span>
                      )}
                    </div>
                    <input
                      id="hero-location-input"
                      type="text"
                      placeholder={isLocating ? 'Detecting your location...' : t('hero_location_placeholder', 'Enter city or locality (e.g. Noida)')}
                      value={locationQuery}
                      onChange={(e) => {
                        setLocationQuery(e.target.value)
                        setLocationSource('manual')
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    className="btn-locate-gps"
                    onClick={handleManualLocate}
                    title="Detect my current location"
                    aria-label="Detect current location"
                  >
                    <svg className={`gps-target-icon ${isLocating ? 'locating-spin' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="7" />
                      <line x1="12" y1="1" x2="12" y2="5" />
                      <line x1="12" y1="19" x2="12" y2="23" />
                      <line x1="1" y1="12" x2="5" y2="12" />
                      <line x1="19" y1="12" x2="23" y2="12" />
                    </svg>
                  </button>
                </div>
                <button type="submit" className="btn-search-submit">
                  <span>{t('hero_btn_find', 'Find Workers')}</span>
                  <span>→</span>
                </button>
              </form>
            </div>

            {/* App Badges */}
            <div className="hero-app-badges">
              <a href={PLAYSTORE_URL} target="_blank" rel="noreferrer" className="store-badge-btn">
                <svg viewBox="0 0 24 24" className="store-icon" fill="currentColor">
                  <path d="M3.609 1.814L14.792 13 3.61 24.186A2.84 2.84 0 0 1 3 22.251V3.749c0-.727.22-1.396.609-1.935zM16.206 14.414L19.29 17.5l-13.626 7.857 10.542-10.943zm0-2.828L5.664 0.643 19.29 8.5l-3.084 3.086zm1.414-1.414l3.82 2.2a1.8 1.8 0 0 1 0 3.12l-3.82 2.2-2.355-2.356 2.355-2.364z" />
                </svg>
                <div className="store-btn-text">
                  <span className="store-btn-sub">GET IT ON</span>
                  <span className="store-btn-main">Google Play</span>
                </div>
              </a>
              <a href={PLAYSTORE_URL} target="_blank" rel="noreferrer" className="store-badge-btn">
                <svg viewBox="0 0 24 24" className="store-icon" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.07c.66-.8 1.11-1.92.99-3.04-.96.04-2.13.64-2.82 1.44-.61.71-1.14 1.86-1 2.97 1.08.08 2.18-.57 2.83-1.37z" />
                </svg>
                <div className="store-btn-text">
                  <span className="store-btn-sub">Download on the</span>
                  <span className="store-btn-main">App Store</span>
                </div>
              </a>
            </div>

            {/* Rating Row */}
            <div className="hero-rating-line">
              <div className="rating-stars">★★★★★</div>
              <span className="rating-score">4.5</span>
              <span className="rating-from">{t('hero_rating_text', 'from 42,700+ ratings')}</span>
            </div>

            {/* Live Cities Row */}
            <div className="hero-cities-section">
              <span className="cities-label">LIVE IN</span>
              <div className="cities-pills">
                <span className="city-pill">Bengaluru</span>
                <span className="city-pill">Delhi</span>
                <span className="city-pill">Noida</span>
                <span className="city-pill">Gurgaon</span>
                <span className="city-pill">Mumbai</span>
                <span className="city-pill">Pune</span>
                <span className="city-pill">Hyderabad</span>
                <span className="city-pill">Meerut</span>
                <span className="city-pill">Jhansi</span>
                <button type="button" className="city-pill city-pill-more" onClick={() => onNavigate('/workers')}>
                  + 2 more cities →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 
          2. THE MAZDOOR SYTU STANDARD (Professional Value & Metric Pillars)
           */}
      <section className="why-us-section" aria-label="Why Mazdoor Sytu">
        <div className="why-us-container">
          {/* Header */}
          <div className="why-us-header">
            <span className="why-us-eyebrow">{t('why_us_eyebrow', 'WHY MAZDOOR SYTU')}</span>
            <h2 className="why-us-headline">{t('why_us_heading', 'A more dependable way to hire skilled trades.')}</h2>
            <p className="why-us-subtitle">
              {t('why_us_subheading', 'Every technician is thoroughly background-verified and arrives with standardized transparent pricing, rapid local dispatch, and platform-backed quality assurance.')}
            </p>
          </div>

          {/* Executive Metrics Bar with Live Animated Counting & Highlighting */}
          <div className="why-us-metrics-ribbon" ref={metricsRibbonRef}>
            <div className="metric-ribbon-item item-highlight-green">
              <div className="metric-badge-chip chip-green">
                <span className="chip-icon">✦</span>
                <span>Verified Deliveries</span>
              </div>
              <strong className="ribbon-num num-glow-green">
                <AnimatedMetricCounter target={10000} duration={1900} isVisible={metricsVisible} suffix="+" />
              </strong>
              <span className="ribbon-label">Bookings Completed</span>
            </div>

            <div className="metric-ribbon-divider" aria-hidden="true" />

            <div className="metric-ribbon-item item-highlight-amber">
              <div className="metric-badge-chip chip-amber">
                <span className="metric-pulse-dot" />
                <span>Rapid Dispatch</span>
              </div>
              <strong className="ribbon-num num-glow-dark">
                15–30 min
              </strong>
              <span className="ribbon-label">Average Arrival Time</span>
            </div>

            <div className="metric-ribbon-divider" aria-hidden="true" />

            <div className="metric-ribbon-item item-highlight-blue">
              <div className="metric-badge-chip chip-blue">
                <span className="chip-icon">🛡️</span>
                <span>Aadhaar Verified</span>
              </div>
              <strong className="ribbon-num num-glow-blue">
                <AnimatedMetricCounter target={5000} duration={1900} isVisible={metricsVisible} suffix="+" />
              </strong>
              <span className="ribbon-label">Verified Tradesmen</span>
            </div>

            <div className="metric-ribbon-divider" aria-hidden="true" />

            <div className="metric-ribbon-item item-highlight-gold">
              <div className="metric-badge-chip chip-gold">
                <span className="chip-icon">★</span>
                <span>Customer Trust</span>
              </div>
              <strong className="ribbon-num num-glow-gold">
                <AnimatedMetricCounter target={4.85} duration={1900} isVisible={metricsVisible} decimals={2} suffix=" / 5" />
              </strong>
              <span className="ribbon-label">Customer Satisfaction</span>
            </div>
          </div>

          {/* 4 Professional Pillar Cards */}
          <div className="why-us-cards-grid">
            {/* Pillar 1 */}
            <article className="why-us-card">
              <div className="why-us-icon-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <polyline points="9 12 11 14 15 10" />
                </svg>
              </div>
              <h3 className="why-us-card-title">Government ID &amp; Police Vetting</h3>
              <p className="why-us-card-desc">
                Every tradesperson undergoes biometric Aadhaar authentication, trade certification review, and background screening before accepting platform bookings.
              </p>
              <div className="why-us-card-spec">
                <span className="spec-bullet" />
                <span>100% ID Verified</span>
              </div>
            </article>

            {/* Pillar 2 */}
            <article className="why-us-card">
              <div className="why-us-icon-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M6 3h12" />
                  <path d="M6 8h12" />
                  <path d="m6 13 8.5 8" />
                  <path d="M6 13h3" />
                  <path d="M9 13c6.667 0 6.667-10 0-10" />
                </svg>
              </div>
              <h3 className="why-us-card-title">Standardized Upfront Rates</h3>
              <p className="why-us-card-desc">
                Clear, published rate schedules with itemized service estimates. No unexpected surcharges or arbitrary bargaining — pay securely upon completion.
              </p>
              <div className="why-us-card-spec">
                <span className="spec-bullet" />
                <span>Zero Hidden Fees</span>
              </div>
            </article>

            {/* Pillar 3 */}
            <article className="why-us-card">
              <div className="why-us-icon-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <h3 className="why-us-card-title">Rapid Hyperlocal Dispatch</h3>
              <p className="why-us-card-desc">
                Intelligent routing matches your requirement with top-rated professionals active within 2 to 5 km of your address for timely doorstep arrival.
              </p>
              <div className="why-us-card-spec">
                <span className="spec-bullet" />
                <span>15–30 Min Arrival</span>
              </div>
            </article>

            {/* Pillar 4 */}
            <article className="why-us-card">
              <div className="why-us-icon-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <h3 className="why-us-card-title">Workmanship Warranty</h3>
              <p className="why-us-card-desc">
                Platform mediation, dedicated customer assistance, and a complimentary 7-day rework guarantee on eligible services for complete peace of mind.
              </p>
              <div className="why-us-card-spec">
                <span className="spec-bullet" />
                <span>7-Day Rework Guarantee</span>
              </div>
            </article>
          </div>

          {/* Corporate CTA Footer */}
          <div className="why-us-footer">
            <span className="why-us-footer-note">
              Operating across 11 cities including Delhi NCR, Mumbai, Bengaluru, Pune, Hyderabad, and Meerut.
            </span>
            <button
              type="button"
              className="btn-why-us-explore"
              onClick={() => onNavigate('/workers')}
            >
              <span>Explore Verified Workers</span>
              <span className="arrow">→</span>
            </button>
          </div>
        </div>
      </section>

      {/* 
          3. POPULAR SERVICES SECTION (20 Services + Category Filter + Instant Search)
           */}
      <section className="home-section popular-services-section" aria-label="Popular Services">
        <div className="section-header popular-services-header">
          <span className="why-us-eyebrow">{t('services_eyebrow', 'VERIFIED TRADE DIRECTORY')}</span>
          <h2 className="section-title">{t('services_heading', 'Popular Skilled Services')}</h2>
          <p className="section-subtitle">
            {t('services_subheading', 'Book verified electricians, plumbers, carpenters, and construction specialists with standardized upfront rates and rapid local arrival.')}
          </p>
        </div>

        {/* Interactive Filter Tabs & Quick Search Bar */}
        <div className="services-toolbar">
          <div className="services-filter-tabs" role="tablist" aria-label="Filter services by trade group">
            {serviceCategories.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeServiceTab === tab.id}
                className={`service-tab-btn ${activeServiceTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveServiceTab(tab.id)}
              >
                <span className="tab-label">{tab.label}</span>
                <span className="tab-badge">{tab.count}</span>
              </button>
            ))}
          </div>

          <div className="services-search-input-box">
            <svg className="services-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className="services-search-input"
              placeholder={t('services_search_placeholder', 'Search trades (e.g. Electrician, Painter, RO, AC, Tiler)...')}
              value={serviceSearchQuery}
              onChange={(e) => setServiceSearchQuery(e.target.value)}
              aria-label="Search trade services"
            />
            {serviceSearchQuery && (
              <button
                type="button"
                className="services-search-clear"
                onClick={() => setServiceSearchQuery('')}
                aria-label="Clear trade search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Results summary row */}
        {(activeServiceTab !== 'all' || serviceSearchQuery.trim()) && (
          <div className="services-filter-feedback">
            <span>
              Showing <strong>{filteredServices.length}</strong> of <strong>{popularServices.length}</strong> services
              {serviceSearchQuery.trim() && <> for &ldquo;<strong>{serviceSearchQuery}</strong>&rdquo;</>}
            </span>
            <button
              type="button"
              className="services-reset-filter-btn"
              onClick={() => {
                setActiveServiceTab('all')
                setServiceSearchQuery('')
              }}
            >
              Reset Filters ↺
            </button>
          </div>
        )}

        {/* Empty state if search finds nothing */}
        {filteredServices.length === 0 ? (
          <div className="services-empty-state">
            <div className="empty-icon">🔍</div>
            <h3>No matching trades found</h3>
            <p>We couldn&apos;t find any service matching &ldquo;{serviceSearchQuery}&rdquo;. Try another trade or reset filters.</p>
            <button
              type="button"
              className="btn-reset-empty"
              onClick={() => {
                setActiveServiceTab('all')
                setServiceSearchQuery('')
              }}
            >
              Show All 20 Services
            </button>
          </div>
        ) : (
          <div className="services-grid-container">
            {filteredServices.map((service) => (
              <article
                className="service-feature-card"
                key={service.id}
                role="button"
                tabIndex={0}
                onClick={() => onNavigate(`/workers?service=${encodeURIComponent(service.title)}`)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onNavigate(`/workers?service=${encodeURIComponent(service.title)}`)
                  }
                }}
                aria-label={`View ${service.title} workers`}
              >
                <div className="service-card-media">
                  <img src={service.image} alt={service.title} className="service-card-img" loading="lazy" />

                  {/* Category Pill on top-left */}
                  <span className="service-card-category-pill">
                    {service.category}
                  </span>
                </div>

                <div className="service-card-content">
                  <div className="service-card-header-row">
                    <h3 className="service-card-title">{service.title}</h3>
                  </div>

                  <p className="service-card-desc">{service.description}</p>

                  {/* Tag chips */}
                  {service.tags && (
                    <div className="service-tag-chips">
                      {service.tags.map((tag, idx) => (
                        <span key={idx} className="service-tag-chip">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Primary Action Button */}
                  <div className="service-card-actions">
                    <button
                      type="button"
                      className="service-btn-primary"
                      onClick={(e) => {
                        e.stopPropagation()
                        onNavigate(`/workers?service=${encodeURIComponent(service.title)}`)
                      }}
                      aria-label={`${service.actionLabel || `Book ${service.title}`} near you`}
                    >
                      <span>{service.actionLabel || `Book ${service.title}`}</span>
                      <span className="arrow-icon">→</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Custom Trade Requirement CTA */}
        <div className="services-custom-banner">
          <div className="custom-banner-info">
            <span className="custom-banner-badge">Bulk &amp; Commercial Contracts</span>
            <h3 className="custom-banner-title">Need multi-trade crews or turnkey contracts?</h3>
            <p className="custom-banner-subtitle">
              Post custom requirements for commercial renovation, residential construction, or large site labor deployments with managed coordination and GST invoicing.
            </p>
          </div>
          <div className="custom-banner-actions">
            <button
              type="button"
              className="btn-custom-post"
              onClick={() => onNavigate('/workers')}
            >
              <span>Post Custom Requirement</span>
              <span>→</span>
            </button>
            <button
              type="button"
              className="btn-custom-view-all"
              onClick={() => onNavigate('/jobs')}
            >
              <span>View All Postings</span>
              <span>↗</span>
            </button>
          </div>
        </div>
      </section>

      {/* 
          3. HOW MAZDOOR SYTU WORKS (8-Step Transparent Workflow)
         */}
      <section className="home-section how-it-works-section" aria-label="How Mazdoor Sytu Works">
        <div className="section-header">
          <span className="why-us-eyebrow">SIMPLE JOURNEY</span>
          <h2 className="section-title">How Mazdoor Sytu Works</h2>
          <p className="section-subtitle">
            A seamless, transparent 8-step workflow from discovery to completion and feedback.
          </p>
        </div>

        <div className="how-steps-grid">
          {howItWorksSteps.map((step) => (
            <div className="step-card" key={step.num}>
              <div className="step-header">
                <span className="step-num">{step.num}</span>
                <div className="step-icon-wrap">{step.icon}</div>
              </div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 
          4. TWO BOOKING OPTIONS (Immediate Dispatch vs Scheduled Booking)
          */}
      <section className="home-section booking-options-section" aria-label="Two Ways to Book a Worker">
        <div className="section-header">
          <span className="why-us-eyebrow">FLEXIBLE BOOKING</span>
          <h2 className="section-title">Two Ways to Book a Worker</h2>
          <p className="section-subtitle">
            Whether you need urgent immediate assistance or wish to plan work ahead, we have you covered.
          </p>
        </div>

        <div className="booking-options-grid">
          {/* Card 1: Immediate Need */}
          <article className="booking-card highlight">
            <div className="booking-card-top-row">
              <span className="booking-card-badge badge-instant">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ width: 14, height: 14 }}>
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
                <span>Immediate Need</span>
              </span>
              <span className="live-beacon-pill">
                <span className="pulsing-beacon-dot" /> Online in your area
              </span>
            </div>
            <h3>Book Now</h3>
            <p className="booking-card-desc">
              For customers who need an eligible nearby worker immediately. Instant automated dispatch gets help to your doorstep in minutes.
            </p>
            <ul className="booking-feature-list">
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Instant dispatch from closest nearby workers</span>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Estimated arrival in 15–30 minutes</span>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Live GPS route tracking of your technician</span>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Ideal for urgent water leaks, electrical breakdowns &amp; fixes</span>
              </li>
            </ul>
            <button
              type="button"
              className="btn-booking-action btn-booking-primary"
              onClick={() => onNavigate('/workers')}
            >
              <span>Book an Immediate Worker</span>
              <span>→</span>
            </button>
          </article>

          {/* Card 2: Advance Planning */}
          <article className="booking-card">
            <div className="booking-card-top-row">
              <span className="booking-card-badge badge-schedule">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ width: 14, height: 14 }}>
                  <rect width="18" height="18" x="3" y="4" rx="2" />
                  <line x1="16" x2="16" y1="2" y2="6" />
                  <line x1="8" x2="8" y1="2" y2="6" />
                  <line x1="3" x2="21" y1="10" y2="10" />
                </svg>
                <span>Advance Planning</span>
              </span>
              <span className="live-beacon-pill" style={{ color: '#475569', background: '#f1f5f9' }}>
                Flexible Slots
              </span>
            </div>
            <h3>Schedule a Worker</h3>
            <p className="booking-card-desc">
              For customers who want to select a worker, date, time and location in advance. Plan around your routine with total convenience.
            </p>
            <ul className="booking-feature-list">
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Pick your preferred calendar date and hour</span>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Compare and shortlist specific top-rated craftsmen</span>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Free rescheduling &amp; flexible modifications</span>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Ideal for home renovations, painting, carpentry &amp; site work</span>
              </li>
            </ul>
            <button
              type="button"
              className="btn-booking-action btn-booking-secondary"
              onClick={() => onNavigate('/workers')}
            >
              <span>Schedule for Later</span>
              <span>↗</span>
            </button>
          </article>
        </div>
      </section>

      {/* ===========
          5. MAZDOOR SYTU IN ACTION (Event Photograph with Anandiben Patel ji)
          ======= */}
      <section className="home-section action-section" aria-label="Mazdoor Sytu in Action">
        <div className="section-header">
          <span className="why-us-eyebrow">REAL-WORLD JOURNEY</span>
          <h2 className="section-title">Mazdoor Sytu in Action</h2>
          <p className="section-subtitle">
            Pioneering technology-driven worker discovery, customer connectivity, and grassroots workforce solutions.
          </p>
        </div>

        <div className="action-grid">
          {/* Photo Visual with Caption & Milestone Badge */}
          <div className="action-photo-wrap">
            <div className="action-floating-tag">
              <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 13, height: 13, color: '#f59e0b' }} aria-hidden="true">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span>Official Milestone</span>
              <span className="dot-divider">•</span>
              <span>State Innovation Summit</span>
            </div>
            <img
              src="/anandiben-patel-event.webp"
              alt="Hon'ble Governor of Uttar Pradesh Smt. Anandiben Patel interacting with MazdoorSytu team"
              className="action-img"
              width="900"
              height="600"
              loading="lazy"
              decoding="async"
            />
            <div className="action-photo-overlay">
              <div className="action-caption-badge">
                <span className="live-pulsing-dot" /> High-Level Dignitary Visit
              </div>
              <p className="action-photo-caption">
                <strong>Hon&apos;ble Governor of Uttar Pradesh Smt. Anandiben Patel ji</strong>
                Interacting with the Mazdoor Sytu founding team at the state innovation exhibition, reviewing our AI-driven worker discovery platform and artisan empowerment initiative.
              </p>
            </div>
          </div>

          {/* Narrative Content */}
          <div className="action-narrative">
            <div className="action-badges-row">
              <span className="action-pill pill-up">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ width: 14, height: 14 }}>
                  <path d="M12 2 2 7l10 5 10-5-10-5Z" />
                  <path d="m2 17 10 5 10-5" />
                  <path d="m2 12 10 5 10-5" />
                </svg>
                <span>UP Startup Recognized</span>
              </span>
              <span className="action-pill pill-dst">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ width: 14, height: 14 }}>
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                <span>DST NIDHI Supported</span>
              </span>
              <span className="action-pill pill-msme">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ width: 14, height: 14 }}>
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                <span>MSME Registered</span>
              </span>
              <span className="action-pill pill-aic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ width: 14, height: 14 }}>
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <span>AIC Incubation</span>
              </span>
            </div>

            <h3 className="action-narrative-title">
              Bridging the Gap Between Skilled Labor and Digital Opportunity
            </h3>

            <p className="action-text">
              Mazdoor Sytu was born from a fundamental belief: every hardworking tradesperson deserves dignified, reliable work, and every household and enterprise deserves access to trusted, verified skill without exploitative intermediaries.
            </p>

            <p className="action-text">
              Our real-world journey combines hyper-local geolocation, AI-assisted trade matching, and institutional support from premier incubation centers. From grassroots artisan fairs to industrial construction sites, we empower workers with digital identity, timely compensation, and direct market visibility.
            </p>

            <div className="action-highlights">
              <div className="action-stat-box">
                <div className="stat-icon-circle icon-workers">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ width: 20, height: 20 }}>
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div className="stat-text-wrap">
                  <strong>10,000+</strong>
                  <span>Registered skilled workers</span>
                </div>
              </div>
              <div className="action-stat-box">
                <div className="stat-icon-circle icon-trades">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ width: 20, height: 20 }}>
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                  </svg>
                </div>
                <div className="stat-text-wrap">
                  <strong>50+</strong>
                  <span>Specialized trade categories</span>
                </div>
              </div>
              <div className="action-stat-box">
                <div className="stat-icon-circle icon-satisfaction">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ width: 20, height: 20 }}>
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </div>
                <div className="stat-text-wrap">
                  <strong>98.4%</strong>
                  <span>Verified customer satisfaction</span>
                </div>
              </div>
              <div className="action-stat-box">
                <div className="stat-icon-circle icon-dispatch">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ width: 20, height: 20 }}>
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <div className="stat-text-wrap">
                  <strong>15–30 min</strong>
                  <span>Average rapid dispatch time</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="btn-know-story"
              onClick={() => onNavigate('/about')}
            >
              <span>Know Our Full Story</span>
              <span className="story-arrow">→</span>
            </button>
          </div>
        </div>
      </section>

      {/* 
          6. PLATFORM ECOSYSTEM: HOUSEHOLDS, ENTERPRISES, ARTISANS
           */}
      <section className="home-section platform-portals-section" aria-label="Customer, Business, and Worker Portals">
        <div className="section-header">
          <span className="why-us-eyebrow">PLATFORM PORTALS</span>
          <h2 className="section-title">Tailored for Every Need</h2>
          <p className="section-subtitle">
            Dedicated access, customized tools, and clear entry points whether you are hiring help, running a business, or offering your skills.
          </p>
        </div>

        <div className="ecosystem-grid">
          {/* Customer Focus */}
          <article className="ecosystem-card card-customer">
            <div className="ecosystem-icon-header">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <span className="ecosystem-kicker">For Households &amp; Individuals</span>
            <h3>Need a Worker?</h3>
            <p>
              Find skilled, verified professionals for home maintenance, plumbing, electrical repairs, painting, cleaning, and everyday household requirements.
            </p>
            <ul className="ecosystem-perks">
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Nearby verified tradespeople</span>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Upfront transparent rates</span>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Secure cashless payments</span>
              </li>
            </ul>
            <button
              type="button"
              className="btn-ecosystem-action btn-eco-customer"
              onClick={() => onNavigate('/workers')}
            >
              <span>Find Workers</span>
              <span>→</span>
            </button>
          </article>

          {/* Business Focus */}
          <article className="ecosystem-card card-business">
            <div className="ecosystem-icon-header">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect width="20" height="14" x="2" y="7" rx="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            </div>
            <span className="ecosystem-kicker">For Commercial &amp; Industrial</span>
            <h3>Need Workers for Your Business?</h3>
            <p>
              Post business requirements, hire multiple workers or complete crews, coordinate shifts, and manage commercial billing and GST invoices with ease.
            </p>
            <ul className="ecosystem-perks">
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Bulk workforce deployment</span>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Centralized billing &amp; GST receipts</span>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Dedicated account manager</span>
              </li>
            </ul>
            <button
              type="button"
              className="btn-ecosystem-action btn-eco-business"
              onClick={() => onNavigate('/business/post-requirement')}
            >
              <span>Post a Requirement</span>
              <span>→</span>
            </button>
          </article>

          {/* Worker Focus */}
          <article className="ecosystem-card card-worker">
            <div className="ecosystem-icon-header">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
              </svg>
            </div>
            <span className="ecosystem-kicker">For Skilled Tradespeople</span>
            <h3>Are You a Skilled Worker?</h3>
            <p>
              Create your verified professional profile, showcase your trades and past work, receive direct customer job alerts, and grow your steady daily earnings.
            </p>
            <ul className="ecosystem-perks">
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Zero registration or joining fee</span>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Direct daily payouts to your account</span>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Government-verified badge &amp; trust</span>
              </li>
            </ul>
            <button
              type="button"
              className="btn-ecosystem-action btn-eco-worker"
              onClick={() => onNavigate('/signup')}
            >
              <span>Join as a Worker</span>
              <span>→</span>
            </button>
          </article>
        </div>
      </section>

      {/* 
          9. DOWNLOAD THE Mazdoor Sytu APP
           */}
      <section className="home-section" aria-label="Download App">
        <div className="app-download-banner">
          <div className="app-download-copy">
            <span className="section-badge section-badge-lime" style={{ color: '#d4e64e', background: 'rgba(212, 230, 78, 0.15)' }}>
              Official Mobile App
            </span>
            <h3>Download the Mazdoor Sytu App</h3>
            <p>
              Access India’s fastest worker discovery platform anywhere, anytime. Enjoy real-time job tracking, instant status notifications, hassle-free booking, and one-tap customer assistance on your smartphone.
            </p>

            <div className="app-benefits-list">
              <div className="app-benefit-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Live GPS tracking of your worker</span>
              </div>
              <div className="app-benefit-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Instant dispatch notifications</span>
              </div>
              <div className="app-benefit-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Secure cashless digital payments</span>
              </div>
              <div className="app-benefit-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>In-app private direct calling</span>
              </div>
            </div>

            <a
              href={PLAYSTORE_URL}
              target="_blank"
              rel="noreferrer"
              className="btn-playstore-large"
            >
              <svg className="playstore-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.609 1.814L13.792 12 3.61 22.186a1.944 1.944 0 0 1-.61-.926V2.74c0-.348.115-.68.609-.926zm11.306 11.309L4.417 2.378a1.236 1.236 0 0 1 .472-.088 1.9 1.9 0 0 1 1.096.347l10.93 6.273-2 2.213zm0 1.754l2 2.214-10.93 6.273a1.9 1.9 0 0 1-1.096.347 1.236 1.236 0 0 1-.472-.088l10.498-10.746zm1.258-1.257l2.802 1.609c.803.46 1.308 1.307 1.308 2.235 0 .927-.505 1.774-1.308 2.234l-2.802 1.609-2.226-2.46 2.226-2.46v-.767z" />
              </svg>
              <div className="playstore-text-group">
                <span className="playstore-sub">GET IT ON</span>
                <span className="playstore-main">Google Play</span>
              </div>
            </a>
          </div>

          {/* Visual Phone Mockup */}
          <div className="app-visual-mockup">
            <div className="mockup-frame">
              <div className="mockup-notch" />
              <div className="mockup-screen-content">
                <div className="mockup-header-row">
                  <span style={{ fontSize: '11px', fontWeight: 700 }}>Mazdoor Sytu</span>
                  <span className="mockup-status-dot" />
                </div>
                <div style={{ background: 'rgba(233, 116, 71, 0.1)', padding: '10px', borderRadius: '10px', marginBottom: '10px', textAlign: 'left' }}>
                  <small style={{ fontSize: '10px', color: 'var(--orange)', fontWeight: 700 }}>LIVE TRACKING</small>
                  <strong style={{ display: 'block', fontSize: '12px' }}>Aman Verma (Electrician)</strong>
                  <span style={{ fontSize: '11px', color: 'var(--muted)' }}>ETA: 8 minutes away</span>
                </div>
                <div style={{ background: 'rgba(22, 34, 29, 0.05)', padding: '8px', borderRadius: '8px', fontSize: '11px', textAlign: 'left' }}>
                  ✓ ID Verified & Background Checked
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/*
          10. WHY CHOOSE Mazdoor Sytu (9 Platform Capabilities)
          */}
      <section className="home-section" aria-label="Why Choose Mazdoor Sytu">
        <div className="section-header">
          <span className="section-badge">{t('why_us_eyebrow', 'Platform Capabilities')}</span>
          <h2 className="section-title">{t('why_us_heading', 'Why Choose Mazdoor Sytu')}</h2>
          <p className="section-subtitle">
            {t('why_us_subheading', 'Engineered from the ground up to provide transparency, safety, speed, and fairness for every job.')}
          </p>
        </div>

        <div className="capabilities-grid">
          {capabilities.map((cap, i) => (
            <div className="capability-card" key={i}>
              <div className="capability-icon-wrap">{cap.icon}</div>
              <h3>{cap.title}</h3>
              <p>{cap.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/*
          11. TRUST & SAFETY SECTION
          */}
      <section className="home-section" aria-label="Trust and Safety">
        <div className="section-header">
          <span className="section-badge section-badge-lime">{t('trust_eyebrow', 'Peace of Mind')}</span>
          <h2 className="section-title">{t('trust_heading', 'Trust & Safety at Our Core')}</h2>
          <p className="section-subtitle">
            {t('trust_subheading', 'We hold ourselves to rigorous standards so you can invite skilled professionals into your home and workplace with complete confidence.')}
          </p>
        </div>

        <div className="trust-pillars-grid">
          {trustPillars.map((pillar, i) => (
            <div className="trust-pillar-card" key={i}>
              <div className="trust-pillar-icon">{pillar.icon}</div>
              <h3>{pillar.title}</h3>
              <p>{pillar.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 
          12. FREQUENTLY ASKED QUESTIONS (Interactive Accordion)
           */}
      <section className="home-section" aria-label="Frequently Asked Questions">
        <div className="section-header">
          <span className="section-badge">{t('faq_eyebrow', 'Clear Answers')}</span>
          <h2 className="section-title">{t('faq_heading', 'Frequently Asked Questions')}</h2>
          <p className="section-subtitle">
            {t('faq_subheading', 'Everything you need to know about discovering, booking, tracking, and paying on Mazdoor Sytu.')}
          </p>
        </div>

        <div className="faq-accordion-wrap">
          {faqs.map((faq, index) => {
            const isOpen = activeFaq === index
            return (
              <div className={`faq-accordion-item ${isOpen ? 'active' : ''}`} key={index}>
                <button
                  type="button"
                  className="faq-question-btn"
                  onClick={() => handleToggleFaq(index)}
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  <svg className="faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                {isOpen && (
                  <div className="faq-answer-content">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/*
          13. FINAL STRONG CONVERSION CTA
           */}
      <section className="final-cta-section home-section" aria-label="Final Call to Action">
        <div className="final-cta-banner">
          <h2>{t('cta_heading', 'Need Work Done? Find the Right Worker.')}</h2>
          <p>
            {t('cta_subheading', 'Join thousands of households and businesses connecting with verified, reliable local professionals in minutes.')}
          </p>
          <div className="final-cta-buttons">
            <button
              type="button"
              className="btn-cta-find"
              onClick={() => onNavigate('/workers')}
            >
              <span>{t('cta_btn_find', 'Find Workers')}</span>
              <span>→</span>
            </button>
            <a
              href={PLAYSTORE_URL}
              target="_blank"
              rel="noreferrer"
              className="btn-cta-app"
            >
              <span>{t('cta_btn_app', 'Download App')}</span>
              <span>↗</span>
            </a>
          </div>
        </div>
      </section>

      {/*
          FLOATING AI ASSISTANT WIDGET (Preserved)
          */}
      {assistantVisible ? (
        assistantAccepted ? (
          <div className="ai-chat-panel" aria-live="polite">
            <div className="ai-chat-header">
              <div className="ai-assistant-icon">AI</div>
              <div>
                <strong>Mazdoor Assistant</strong>
                <small>Here to help</small>
              </div>
              <button
                type="button"
                className="ai-assistant-close"
                onClick={() => setAssistantVisible(false)}
                aria-label="Close assistant"
              >
                ×
              </button>
            </div>

            <div className="ai-chat-body">
              {messages.map((message, index) => (
                <div key={`${message.sender}-${index}`} className={`ai-chat-message ${message.sender}`}>
                  {message.text}
                </div>
              ))}
            </div>

            <div className="ai-prompt-row">
              {starterPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  className="ai-prompt-chip"
                  onClick={() => handlePromptClick(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>

            <div className="ai-chat-input-row">
              <input
                type="text"
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') handleSend()
                }}
                placeholder="Ask about a service, price, or booking"
              />
              <button type="button" onClick={handleSend}>
                Send
              </button>
            </div>
          </div>
        ) : (
          <div className="ai-assistant-card" aria-live="polite">
            <div className="ai-assistant-head">
              <div className="ai-assistant-icon">AI</div>
              <div>
                <strong>Need a quick assist?</strong>
                <small>We can help you find the right service faster.</small>
              </div>
            </div>
            <p>Choose whether you want guided help or keep browsing on your own.</p>
            <div className="ai-assistant-actions">
              <button type="button" className="ai-primary" onClick={() => setAssistantAccepted(true)}>
                Yes, help me
              </button>
              <button type="button" className="ai-secondary" onClick={() => setAssistantVisible(false)}>
                No thanks
              </button>
            </div>
          </div>
        )
      ) : (
        <button
          type="button"
          className="ai-assistant-fab"
          onClick={() => setAssistantVisible(true)}
          aria-label="Open AI assistant"
        >
          AI
        </button>
      )}
    </div>
  )
}
