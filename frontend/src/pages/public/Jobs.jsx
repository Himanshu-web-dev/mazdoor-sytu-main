import { useState, useMemo, useEffect } from 'react'
import { getStoredJobs, getStoredApplications, submitJobApplication } from '../../data/jobStore'
import { getSavedLocation } from '../../utils/locationService'
import './Jobs.css'

const CATEGORIES = [
  { id: 'all', name: 'All Categories', icon: '⚡' },
  { id: 'electrician', name: 'Electrician', icon: '⚡' },
  { id: 'plumber', name: 'Plumber', icon: '🔧' },
  { id: 'carpenter', name: 'Carpenter', icon: '🪚' },
  { id: 'mason', name: 'Mason', icon: '🧱' },
  { id: 'painter', name: 'Painter', icon: '🎨' },
  { id: 'welder', name: 'Welder', icon: '👨‍🏭' },
  { id: 'construction', name: 'Construction Worker', icon: '🏗️' },
  { id: 'cleaning', name: 'Cleaning Worker', icon: '🧹' },
  { id: 'loading', name: 'Loading & Unloading', icon: '🚚' },
  { id: 'driver', name: 'Driver', icon: '🚘' },
]

const LOCATIONS = [
  'All Locations',
  'Meerut',
  'Ganga Sagar & Ganga Nagar',
  'Noida',
  'Ghaziabad',
  'Delhi NCR',
  'Lucknow',
  'Jhansi',
]

const WORK_TYPES = [
  { id: 'all', label: 'All Work Types' },
  { id: 'Daily Contract', label: '⚡ Daily Wage / दिहाड़ी' },
  { id: 'Project-Based', label: '📅 Project Contract / ठेका' },
  { id: 'Full-Time', label: '🏢 Full-Time / स्थायी' },
]

const EXPERIENCE_LEVELS = [
  'All Experience',
  '1+ Years',
  '2+ Years',
  '3+ Years',
  '4+ Years',
]

const LOCALITY_OFFSETS_KM = {
  'Ganga Sagar': 0.0,
  'Ganga Nagar': 1.0,
  'Suraj Kund': 2.2,
  'Saket': 2.6,
  'Begum Bridge': 3.2,
  'Civil Lines': 3.5,
  'Cantt': 3.5,
  'Meerut Cantt': 3.5,
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
}

function computeJobProximity(job, customerArea, customerCity) {
  const isMeerutCity = (job.city && job.city.toLowerCase() === 'meerut') || (job.location && job.location.toLowerCase().includes('meerut'))

  if (!isMeerutCity) {
    let regionalDist = 32
    if (job.city === 'Noida') regionalDist = 34
    else if (job.city === 'Ghaziabad') regionalDist = 26
    else if (job.city === 'Delhi' || job.city === 'Delhi NCR') regionalDist = 48
    else if (job.city === 'Lucknow') regionalDist = 420
    else if (job.city === 'Jhansi') regionalDist = 390
    return {
      distanceKm: regionalDist,
      distanceText: `${regionalDist} km away`,
      isLocal: false,
    }
  }

  // Both job and customer are in Meerut
  const custOffset = LOCALITY_OFFSETS_KM[customerArea] !== undefined ? LOCALITY_OFFSETS_KM[customerArea] : 0.0
  let matchedOffset = 3.5
  for (const [colony, offset] of Object.entries(LOCALITY_OFFSETS_KM)) {
    if (job.location.toLowerCase().includes(colony.toLowerCase())) {
      matchedOffset = offset
      break
    }
  }

  let dist = 0.9
  if (job.location.toLowerCase().includes(customerArea.toLowerCase())) {
    dist = 0.9
  } else {
    dist = Math.abs(custOffset - matchedOffset) + 0.8
  }
  const rounded = Math.round(dist * 10) / 10

  return {
    distanceKm: rounded,
    distanceText: `${rounded} km from ${customerArea}`,
    isLocal: rounded <= 10.0,
  }
}

export default function Jobs({ onNavigate, session, workerData }) {
  const [jobs, setJobs] = useState([])
  const [applications, setApplications] = useState([])

  // Live Location Sync
  const [customerLocation, setCustomerLocation] = useState(() => getSavedLocation())
  const customerArea = customerLocation.area || 'Ganga Sagar'
  const customerCity = customerLocation.city || 'Meerut'

  useEffect(() => {
    const handleLocUpdate = (e) => {
      if (e.detail) {
        setCustomerLocation(e.detail)
      }
    }
    window.addEventListener('mazdoor_location_updated', handleLocUpdate)
    return () => window.removeEventListener('mazdoor_location_updated', handleLocUpdate)
  }, [])

  // Filter States
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [selectedLocation, setSelectedLocation] = useState('All Locations')
  const [selectedWorkType, setSelectedWorkType] = useState('All Work Types')
  const [selectedExperience, setSelectedExperience] = useState('All Experience')
  const [selectedRate, setSelectedRate] = useState('All Rates')
  const [activeTab, setActiveTab] = useState('all') // 'all', 'urgent', 'nearby', 'highpay', 'recommended'

  // Modal States
  const [selectedJobForModal, setSelectedJobForModal] = useState(null)
  const [applyingJob, setApplyingJob] = useState(null)
  const [authRequiredJob, setAuthRequiredJob] = useState(null)
  const [roleMismatchInfo, setRoleMismatchInfo] = useState(null)
  const [expectedRate, setExpectedRate] = useState('')
  const [availabilityChoice, setAvailabilityChoice] = useState('Tomorrow Morning')
  const [applyNotes, setApplyNotes] = useState('')
  const [applyFeedback, setApplyFeedback] = useState(null)
  const [submittedAppId, setSubmittedAppId] = useState(null)

  // Load jobs and applications
  useEffect(() => {
    setJobs(getStoredJobs())
    setApplications(getStoredApplications())
  }, [])

  // Auto-open application if returned from login with applyJobId query parameter
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      const targetJobId = params.get('applyJobId')
      if (targetJobId) {
        const allJobs = getStoredJobs()
        const target = allJobs.find((j) => j.id === targetJobId)
        if (target && session?.authenticated && session?.role === 'worker') {
          setApplyingJob(target)
          setExpectedRate(target.rate || '₹850/day')
          setApplyNotes(`I have verified skills in ${target.category} work and am ready to join site immediately.`)
        }
      }
    } catch (err) {
      console.error('Error handling applyJobId query:', err)
    }
  }, [session])

  // Worker profile from session or props
  const workerProfile = workerData?.profile || {
    name: session?.name || 'Rahul Kumar',
    phone: session?.phone || '+91 8004264176',
    service: session?.trade || 'Electrician',
    experience: '5 years',
    serviceArea: `${customerArea}, ${customerCity} and nearby areas`,
    verification: 'Aadhaar Verified Skilled Worker',
  }

  const workerTrade = workerProfile.service || 'Electrician'

  // Set of job IDs already applied for BY THIS LOGGED-IN WORKER
  const appliedJobIds = useMemo(() => {
    if (!session || !session.authenticated || session.role !== 'worker') {
      return new Set()
    }
    const myIdentifier = session.uid || workerProfile?.phone || session.email
    return new Set(
      applications
        .filter(
          (app) =>
            (app.workerIdentifier && app.workerIdentifier === myIdentifier) ||
            (app.workerPhone && workerProfile?.phone && app.workerPhone === workerProfile.phone) ||
            (app.workerEmail && session?.email && app.workerEmail.toLowerCase() === session.email.toLowerCase())
        )
        .map((app) => app.jobId)
    )
  }, [applications, session, workerProfile])

  // Open Apply Flow with STRICT Login/Signup requirement
  const handleOpenApply = (job) => {
    const isFilled = job.status === 'Filled' || (job.workersFilled || 0) >= (job.workersNeeded || 1)
    const isClosed = job.status === 'Closed'
    if (isFilled || isClosed) return

    // Must be logged in as worker
    if (!session || !session.authenticated) {
      setAuthRequiredJob(job)
      return
    }

    if (session.role !== 'worker') {
      setRoleMismatchInfo({ job, role: session.role })
      return
    }

    setApplyingJob(job)
    setExpectedRate(job.rate || '₹850/day')
    setAvailabilityChoice('Tomorrow Morning')
    setApplyNotes(`Namaste, I have verified skills in ${job.category} work and can start at your site from ${availabilityChoice}.`)
    setApplyFeedback(null)
    setSubmittedAppId(null)
  }



  const handleSubmitApplication = (e) => {
    e.preventDefault()
    if (!applyingJob) return

    const res = submitJobApplication({
      jobId: applyingJob.id,
      jobTitle: applyingJob.title,
      company: applyingJob.company,
      workerProfile,
      expectedRate,
      notes: `${applyNotes} [Availability: ${availabilityChoice}]`,
    })

    if (res.success) {
      const generatedId = res.application?.id || `APP-${Math.floor(1000 + Math.random() * 9000)}`
      setSubmittedAppId(generatedId)
      setApplyFeedback({
        type: 'success',
        message: 'Application Submitted Successfully! The contractor has received your verified profile.',
      })
      setApplications(getStoredApplications())
    } else {
      setApplyFeedback({ type: 'error', message: res.message })
    }
  }

  // Enhanced Filter Engine with Distance calculation from customer's locality
  const { filteredJobs, tabCounts } = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    const catLower = selectedCategory.toLowerCase()

    // 1. Map distance and proximity metadata onto every job
    const mapped = jobs.map((job) => {
      const prox = computeJobProximity(job, customerArea, customerCity)
      return {
        ...job,
        computedDistance: prox.distanceKm,
        computedDistanceText: prox.distanceText,
        isLocal: prox.isLocal,
      }
    })

    // Compute Tab Counts
    let urgentCount = 0
    let nearbyCount = 0
    let highPayCount = 0

    mapped.forEach((j) => {
      if (j.urgency === 'Immediate') urgentCount++
      if (j.isLocal || (j.city && j.city.toLowerCase() === customerCity.toLowerCase())) nearbyCount++
      if ((j.rateAmount || 0) >= 850) highPayCount++
    })

    const result = mapped.filter((job) => {
      // Search Query
      if (q) {
        const matchTitle = job.title.toLowerCase().includes(q)
        const matchCompany = job.company.toLowerCase().includes(q)
        const matchSkills = job.skills.some((s) => s.toLowerCase().includes(q))
        const matchLoc = job.location.toLowerCase().includes(q)
        if (!matchTitle && !matchCompany && !matchSkills && !matchLoc) return false
      }

      // Category
      if (selectedCategory !== 'All Categories' && job.category.toLowerCase() !== catLower) {
        return false
      }

      // Location
      if (selectedLocation !== 'All Locations') {
        if (selectedLocation === 'Ganga Sagar & Ganga Nagar') {
          const locLower = job.location.toLowerCase()
          if (!locLower.includes('ganga sagar') && !locLower.includes('ganga nagar') && !locLower.includes('mawana road')) {
            return false
          }
        } else if (!job.location.toLowerCase().includes(selectedLocation.toLowerCase())) {
          return false
        }
      }

      // Work Type
      if (selectedWorkType !== 'All Work Types' && !selectedWorkType.toLowerCase().includes('all')) {
        const rawType = selectedWorkType.split('/')[0].replace('⚡', '').replace('📅', '').replace('🏢', '').trim()
        if (job.workType.toLowerCase() !== rawType.toLowerCase() && !job.workType.toLowerCase().includes(rawType.toLowerCase())) {
          return false
        }
      }

      // Experience
      if (selectedExperience !== 'All Experience') {
        const requiredYears = parseInt(selectedExperience, 10)
        if ((job.minExperienceYears || 0) < requiredYears) return false
      }

      // Rate
      if (selectedRate === 'Under ₹750' && (job.rateAmount || 0) > 750) return false
      if (selectedRate === '₹750 – ₹900' && ((job.rateAmount || 0) < 750 || (job.rateAmount || 0) > 900)) return false
      if (selectedRate === '₹900+' && (job.rateAmount || 0) < 900) return false

      // Tabs
      if (activeTab === 'urgent' && job.urgency !== 'Immediate') return false
      if (activeTab === 'nearby') {
        if (!job.isLocal && !job.location.toLowerCase().includes(customerCity.toLowerCase())) return false
      }
      if (activeTab === 'highpay' && (job.rateAmount || 0) < 850) return false
      if (activeTab === 'recommended') {
        if (job.category.toLowerCase() !== workerTrade.toLowerCase()) return false
      }

      return true
    })

    // Sort: Latest first by default
    result.sort((a, b) => {
      if (activeTab === 'urgent') {
        if (a.urgency === 'Immediate' && b.urgency !== 'Immediate') return -1
        if (b.urgency === 'Immediate' && a.urgency !== 'Immediate') return 1
      }
      return (b.postedTimestamp || 0) - (a.postedTimestamp || 0)
    })

    return {
      filteredJobs: result,
      tabCounts: {
        all: jobs.length,
        urgent: urgentCount,
        nearby: nearbyCount,
        highpay: highPayCount,
      },
    }
  }, [jobs, searchQuery, selectedCategory, selectedLocation, selectedWorkType, selectedExperience, selectedRate, activeTab, customerArea, customerCity, workerTrade])

  const handleResetFilters = () => {
    setSearchQuery('')
    setSelectedCategory('All Categories')
    setSelectedLocation('All Locations')
    setSelectedWorkType('All Work Types')
    setSelectedExperience('All Experience')
    setSelectedRate('All Rates')
    setActiveTab('all')
  }

  return (
    <div className="pro-jobs-wrapper">
      {/* 
          1. LIVE LOCALITY & HERO EXCHANGE BANNER
      */}
      <section className="jobs-live-ribbon" aria-label="Customer Locality & Stats">
        <div className="jobs-ribbon-left">
          <div className="jobs-beacon-icon">
            <span className="beacon-ping" />
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" style={{ width: 20, height: 20 }}>
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <div className="jobs-ribbon-text">
            <div className="ribbon-eyebrow">
              <span className="ribbon-dot-live" />
              <span>Verified Site Vacancy Radar</span>
              <span className="ribbon-colony-tag">Serving: {customerArea}, {customerCity}</span>
            </div>
            <h1 className="ribbon-headline">
              Work Opportunities &amp; Daily Contracts in <em>{customerArea}, {customerCity}</em>
            </h1>
          </div>
        </div>

        {/* Quick Highlights Stats */}
        <div className="jobs-ribbon-metrics">
          <div className="ribbon-metric-pill">
            <span className="pill-num">{jobs.length}+</span>
            <span className="pill-lbl">Active Site Works</span>
          </div>
          <div className="ribbon-metric-pill">
            <span className="pill-num">₹650 – ₹1,200</span>
            <span className="pill-lbl">Daily Wage / दिहाड़ी</span>
          </div>
        </div>
      </section>

      {/* 
          2. UNIFIED SEARCH & FILTER COMMAND CENTER
      */}
      <section className="jobs-command-center" aria-label="Search and Filter Controls">
        <div className="jobs-search-grid">
          {/* Search Input */}
          <div className="search-field-box">
            <svg className="search-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className="jobs-search-input"
              placeholder="Search by trade (e.g. Electrician, Plumber), colony or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search jobs"
            />
            {searchQuery && (
              <button
                type="button"
                className="btn-clear-search"
                onClick={() => setSearchQuery('')}
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Location Selector */}
          <div className="custom-select-wrap">
            <select
              className="jobs-styled-select"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              aria-label="Filter by Location"
            >
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc === 'Ganga Sagar & Ganga Nagar' ? '📍 Ganga Sagar & Ganga Nagar' : `📍 ${loc}`}
                </option>
              ))}
            </select>
            <svg className="select-arrow-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>

          {/* Work Type Selector */}
          <div className="custom-select-wrap">
            <select
              className="jobs-styled-select"
              value={selectedWorkType}
              onChange={(e) => setSelectedWorkType(e.target.value)}
              aria-label="Filter by Work Type"
            >
              {WORK_TYPES.map((t) => (
                <option key={t.id} value={t.label}>{t.label}</option>
              ))}
            </select>
            <svg className="select-arrow-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>

          {/* Rate Selector */}
          <div className="custom-select-wrap">
            <select
              className="jobs-styled-select"
              value={selectedRate}
              onChange={(e) => setSelectedRate(e.target.value)}
              aria-label="Filter by Wage Rate"
            >
              <option value="All Rates">💰 All Wage Rates</option>
              <option value="Under ₹750">Under ₹750 / day</option>
              <option value="₹750 – ₹900">₹750 – ₹900 / day</option>
              <option value="₹900+">₹900+ / day (High Pay)</option>
            </select>
            <svg className="select-arrow-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>

          {/* Reset Action */}
          {(searchQuery || selectedCategory !== 'All Categories' || selectedLocation !== 'All Locations' || selectedWorkType !== 'All Work Types' || selectedRate !== 'All Rates' || activeTab !== 'all') && (
            <button
              type="button"
              className="btn-reset-command"
              onClick={handleResetFilters}
              title="Reset all filters"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Trade Category Horizontal Scrolling Badges */}
        <div className="trade-chips-carousel" role="tablist" aria-label="Trade categories">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory.toLowerCase() === cat.name.toLowerCase()
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`trade-chip-btn ${isActive ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.name)}
              >
                <span className="chip-icon">{cat.icon}</span>
                <span className="chip-name">{cat.name}</span>
              </button>
            )
          })}
        </div>
      </section>

      {/* 
          3. SEGMENTED TABS WITH COUNTS
      */}
      <section className="jobs-tabs-container">
        <div className="jobs-segmented-bar" role="tablist">
          <button
            type="button"
            className={`tab-segment-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            <span>All Openings</span>
            <span className="tab-badge-num">{tabCounts.all}</span>
          </button>
          <button
            type="button"
            className={`tab-segment-btn ${activeTab === 'urgent' ? 'active urgent' : ''}`}
            onClick={() => setActiveTab('urgent')}
          >
            <span>⚡ Urgent / Immediate Join</span>
            <span className="tab-badge-num accent-red">{tabCounts.urgent}</span>
          </button>
          <button
            type="button"
            className={`tab-segment-btn ${activeTab === 'nearby' ? 'active nearby' : ''}`}
            onClick={() => setActiveTab('nearby')}
          >
            <span>📍 Near {customerArea}</span>
            <span className="tab-badge-num">{tabCounts.nearby}</span>
          </button>
          <button
            type="button"
            className={`tab-segment-btn ${activeTab === 'highpay' ? 'active highpay' : ''}`}
            onClick={() => setActiveTab('highpay')}
          >
            <span>💰 High Daily Wage (₹850+)</span>
            <span className="tab-badge-num">{tabCounts.highpay}</span>
          </button>
          <button
            type="button"
            className={`tab-segment-btn ${activeTab === 'recommended' ? 'active' : ''}`}
            onClick={() => setActiveTab('recommended')}
          >
            <span>Recommended ({workerTrade})</span>
          </button>
        </div>

        <div className="jobs-counter-text">
          Showing <b>{filteredJobs.length}</b> verified work opportunities
        </div>
      </section>

      {/* 
          4. PROFESSIONAL JOBS GRID & CARDS
      */}
      <main className="jobs-grid-section">
        {filteredJobs.length > 0 ? (
          <div className="pro-jobs-grid">
            {filteredJobs.map((job) => {
              const isApplied = appliedJobIds.has(job.id)
              const isFilled = job.status === 'Filled' || (job.workersFilled || 0) >= (job.workersNeeded || 1)
              const isClosed = job.status === 'Closed'
              const fillPct = Math.min(100, Math.round(((job.workersFilled || 0) / (job.workersNeeded || 1)) * 100))
              const spotsLeft = Math.max(0, (job.workersNeeded || 1) - (job.workersFilled || 0))

              return (
                <article className={`pro-job-card ${job.urgency === 'Immediate' ? 'card-urgent' : ''}`} key={job.id}>
                  {/* Card Header: Company, Verification & Urgency Badge */}
                  <div className="card-contractor-bar">
                    <div className="contractor-identity">
                      <div className="contractor-avatar">
                        {job.company.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="contractor-meta">
                        <div className="contractor-name-row">
                          <span className="contractor-name">{job.company}</span>
                          {job.isVerifiedBusiness && (
                            <span className="verified-seal-tag" title="GST & Contractor License Verified">
                              ✓ Verified
                            </span>
                          )}
                        </div>
                        <span className="job-posted-timestamp">Posted {job.postedDate}</span>
                      </div>
                    </div>

                    {isClosed ? (
                      <span className="job-pill-badge pill-closed">Closed</span>
                    ) : isFilled ? (
                      <span className="job-pill-badge pill-filled">Position Filled</span>
                    ) : job.urgency === 'Immediate' ? (
                      <span className="job-pill-badge pill-immediate">
                        <span className="live-dot-pulse" />
                        Immediate / तुरंत काम
                      </span>
                    ) : (
                      <span className="job-pill-badge pill-active">Open Contract</span>
                    )}
                  </div>

                  {/* Title & Trade */}
                  <h3 className="card-job-title" onClick={() => setSelectedJobForModal(job)}>
                    {job.title}
                  </h3>

                  {/* Location & Proximity */}
                  <div className="card-location-row">
                    <svg className="location-pin-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span className="location-text">
                      <b className="distance-highlight">{job.computedDistanceText}</b> · {job.location}
                    </span>
                  </div>

                  {/* Wage Highlight Banner */}
                  <div className="card-wage-banner">
                    <div className="wage-left">
                      <span className="wage-sublabel">Daily Payout / दिहाड़ी</span>
                      <div className="wage-amount-row">
                        <span className="wage-amount">{job.rate}</span>
                        <span className="wage-type-pill">{job.workType}</span>
                      </div>
                    </div>
                    <div className="wage-right">
                      <span className="wage-settlement-tag">✓ Direct Contractor Payout</span>
                      <span className="wage-overtime-tag">{job.workingHours}</span>
                    </div>
                  </div>

                  {/* Workforce Spots Progress Bar */}
                  <div className="card-hiring-progress">
                    <div className="progress-label-row">
                      <span className="progress-txt">
                        Workforce: <b>{job.workersFilled || 0} of {job.workersNeeded} Hired</b>
                      </span>
                      <span className={`spots-left-badge ${spotsLeft <= 2 ? 'spots-critical' : ''}`}>
                        {spotsLeft > 0 ? `${spotsLeft} Spots Left` : 'Filled'}
                      </span>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${fillPct}%` }} />
                    </div>
                  </div>

                  {/* Site Perks / Facilities */}
                  {job.facilities && job.facilities.length > 0 && (
                    <div className="card-perks-row">
                      {job.facilities.slice(0, 3).map((fac, idx) => (
                        <span className="perk-chip" key={idx}>✓ {fac}</span>
                      ))}
                    </div>
                  )}

                  {/* Skill Chips */}
                  <div className="card-skills-row">
                    {job.skills.slice(0, 4).map((skill) => (
                      <span className="skill-chip" key={skill}>{skill}</span>
                    ))}
                    {job.skills.length > 4 && (
                      <span className="skill-chip-more">+{job.skills.length - 4} more</span>
                    )}
                  </div>

                  {/* Card Actions Footer */}
                  <div className="card-actions-bar">
                    <button
                      type="button"
                      className="btn-card-view-scope"
                      onClick={() => setSelectedJobForModal(job)}
                    >
                      <span>View Scope</span>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 14, height: 14 }}>
                        <path d="M15 3h6v6M10 14L21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      </svg>
                    </button>

                    {isApplied ? (
                      <button type="button" className="btn-card-applied" disabled>
                        <span>Applied ✓</span>
                      </button>
                    ) : isFilled ? (
                      <button type="button" className="btn-card-locked" disabled>
                        <span>Position Filled</span>
                      </button>
                    ) : isClosed ? (
                      <button type="button" className="btn-card-locked" disabled>
                        <span>Closed</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn-card-apply"
                        onClick={() => handleOpenApply(job)}
                      >
                        <span>⚡ Apply with 1-Click</span>
                        <span>→</span>
                      </button>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <div className="jobs-empty-box">
            <div className="empty-icon-circle">🔍</div>
            <h3>No matching job requirements found</h3>
            <p>Try resetting trade categories, location or keywords to view more active opportunities across Meerut.</p>
            <button type="button" className="btn-reset-filters-large" onClick={handleResetFilters}>
              Clear All Filters
            </button>
          </div>
        )}
      </main>

      {/* 
          5. JOB DETAILS & SCOPE MODAL
      */}
      {selectedJobForModal && (
        <div className="modal-overlay" onClick={() => setSelectedJobForModal(null)} role="dialog" aria-modal="true">
          <div className="modal-content-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-bar">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span className="verified-seal-tag">{selectedJobForModal.company}</span>
                  <span className="job-pill-badge pill-active">{selectedJobForModal.category}</span>
                </div>
                <h2 style={{ fontSize: '22px', margin: 0, color: 'var(--ink)' }}>{selectedJobForModal.title}</h2>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setSelectedJobForModal(null)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="modal-body-scroll">
              {/* Highlight Metrics */}
              <div className="modal-metrics-strip">
                <div className="modal-metric-card">
                  <span className="metric-lbl">Offered Daily Rate</span>
                  <span className="metric-val highlight-green">{selectedJobForModal.rate}</span>
                </div>
                <div className="modal-metric-card">
                  <span className="metric-lbl">Site Location</span>
                  <span className="metric-val">{selectedJobForModal.location}</span>
                </div>
                <div className="modal-metric-card">
                  <span className="metric-lbl">Duration</span>
                  <span className="metric-val">{selectedJobForModal.duration}</span>
                </div>
                <div className="modal-metric-card">
                  <span className="metric-lbl">Daily Shift</span>
                  <span className="metric-val">{selectedJobForModal.workingHours}</span>
                </div>
              </div>

              {/* Requirement Description */}
              <div className="detail-section">
                <h4>Requirement Overview</h4>
                <p>{selectedJobForModal.description}</p>
              </div>

              {/* Responsibilities */}
              {selectedJobForModal.responsibilities && (
                <div className="detail-section">
                  <h4>Work Responsibilities</h4>
                  <ul className="detail-list">
                    {selectedJobForModal.responsibilities.map((item, idx) => (
                      <li key={idx}>
                        <span className="bullet-check">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Required Skills */}
              <div className="detail-section">
                <h4>Required Trade Skills</h4>
                <div className="facilities-tag-grid">
                  {selectedJobForModal.skills.map((skill) => (
                    <span className="skill-chip" key={skill}>{skill}</span>
                  ))}
                </div>
              </div>

              {/* Facilities Provided at Site */}
              {selectedJobForModal.facilities && (
                <div className="detail-section">
                  <h4>Facilities Provided by Contractor</h4>
                  <div className="facilities-tag-grid">
                    {selectedJobForModal.facilities.map((fac, idx) => (
                      <span className="perk-chip" key={idx}>✓ {fac}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Eligibility */}
              {selectedJobForModal.requirements && (
                <div className="detail-section">
                  <h4>Eligibility &amp; Verification</h4>
                  <ul className="detail-list">
                    {selectedJobForModal.requirements.map((req, idx) => (
                      <li key={idx}>
                        <span className="bullet-check">✓</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="privacy-safety-notice">
                🔒 <strong>Direct Worker Protection:</strong> Contractor phone number and exact site street number are verified by Mazdoor Sytu. Once your application is submitted, you can chat directly with the site manager.
              </div>
            </div>

            <div className="modal-footer-bar">
              <div>
                <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>Application Deadline</span>
                <strong style={{ fontSize: '14px', color: '#0f172a' }}>{selectedJobForModal.deadline}</strong>
              </div>

              {appliedJobIds.has(selectedJobForModal.id) ? (
                <button type="button" className="btn-card-applied" disabled>
                  Applied ✓
                </button>
              ) : selectedJobForModal.status === 'Filled' || (selectedJobForModal.workersFilled || 0) >= (selectedJobForModal.workersNeeded || 1) ? (
                <button type="button" className="btn-card-locked" disabled>
                  Position Filled
                </button>
              ) : (
                <button
                  type="button"
                  className="btn-card-apply"
                  onClick={() => {
                    const j = selectedJobForModal
                    setSelectedJobForModal(null)
                    handleOpenApply(j)
                  }}
                >
                  <span>Apply for this Job</span>
                  <span>→</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 
          6. AUTH REQUIRED MODAL
      */}
      {authRequiredJob && (
        <div className="modal-overlay" onClick={() => setAuthRequiredJob(null)} role="dialog" aria-modal="true">
          <div className="modal-content-box" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-bar">
              <div>
                <span className="verified-seal-tag" style={{ marginBottom: '4px' }}>Worker Sign In Required</span>
                <h2 style={{ fontSize: '20px', margin: 0 }}>Please Sign In to Apply</h2>
              </div>
              <button type="button" className="modal-close-btn" onClick={() => setAuthRequiredJob(null)}>✕</button>
            </div>

            <div className="modal-body-scroll" style={{ padding: '24px' }}>
              <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6, margin: '0 0 16px' }}>
                To protect worker wages and enable direct contractor payouts without middlemen, please sign in with your <strong>Worker Account</strong> to submit applications.
              </p>

              <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '14px', padding: '14px 16px', marginBottom: '20px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#166534', letterSpacing: '0.06em', display: 'block', marginBottom: '2px' }}>
                  Target Vacancy
                </span>
                <strong style={{ display: 'block', fontSize: '15px', color: '#0f172a' }}>{authRequiredJob.title}</strong>
                <span style={{ fontSize: '13px', color: '#15803d' }}>
                  {authRequiredJob.company} • Offered Rate: <b>{authRequiredJob.rate}</b>
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  type="button"
                  className="btn-card-apply"
                  style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
                  onClick={() => {
                    try {
                      sessionStorage.setItem('mazdoor_redirect_after_auth', `/jobs?applyJobId=${authRequiredJob.id}`)
                    } catch {}
                    if (onNavigate) onNavigate('/login')
                  }}
                >
                  Sign In as a Worker →
                </button>

                <button
                  type="button"
                  className="btn-card-view-scope"
                  style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
                  onClick={() => {
                    try {
                      sessionStorage.setItem('mazdoor_redirect_after_auth', `/jobs?applyJobId=${authRequiredJob.id}`)
                    } catch {}
                    if (onNavigate) onNavigate('/signup')
                  }}
                >
                  Create New Worker Account
                </button>


              </div>
            </div>
          </div>
        </div>
      )}

      {/* 
          7. ROLE MISMATCH MODAL
      */}
      {roleMismatchInfo && (
        <div className="modal-overlay" onClick={() => setRoleMismatchInfo(null)} role="dialog" aria-modal="true">
          <div className="modal-content-box" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-bar">
              <div>
                <span className="verified-seal-tag" style={{ marginBottom: '4px' }}>Account Role Notice</span>
                <h2 style={{ fontSize: '20px', margin: 0 }}>Worker Profile Required</h2>
              </div>
              <button type="button" className="modal-close-btn" onClick={() => setRoleMismatchInfo(null)}>✕</button>
            </div>

            <div className="modal-body-scroll" style={{ padding: '24px' }}>
              <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6, margin: '0 0 16px' }}>
                You are currently signed in with a <strong>{roleMismatchInfo.role?.toUpperCase()}</strong> account.
                Job applications are strictly reserved for registered artisans and workers.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  type="button"
                  className="btn-card-apply"
                  style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
                  onClick={() => {
                    setRoleMismatchInfo(null)
                    if (onNavigate) onNavigate('/login')
                  }}
                >
                  Log In as Worker
                </button>
                <button
                  type="button"
                  className="btn-card-view-scope"
                  style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
                  onClick={() => setRoleMismatchInfo(null)}
                >
                  Continue Browsing Jobs
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 
          8. AUTHENTICATED WORKER APPLICATION MODAL
      */}
      {applyingJob && (
        <div className="modal-overlay" onClick={() => setApplyingJob(null)} role="dialog" aria-modal="true">
          <div className="modal-content-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-bar">
              <div>
                <span className="verified-seal-tag" style={{ marginBottom: '4px' }}>Verified Worker Application</span>
                <h2 style={{ fontSize: '20px', margin: 0 }}>Apply to {applyingJob.company}</h2>
                <small style={{ color: '#64748b' }}>{applyingJob.title}</small>
              </div>
              <button type="button" className="modal-close-btn" onClick={() => setApplyingJob(null)}>✕</button>
            </div>

            {submittedAppId ? (
              <div className="modal-body-scroll" style={{ padding: '28px', textAlign: 'center' }}>
                <div style={{ fontSize: 44, marginBottom: 12 }}>🎉</div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: '#166534', margin: '0 0 8px' }}>
                  Application Submitted Successfully!
                </h3>
                <p style={{ fontSize: 14, color: '#15803d', margin: '0 0 20px', lineHeight: 1.5 }}>
                  Your application for <strong>{applyingJob.title}</strong> has been received by{' '}
                  <strong>{applyingJob.company}</strong>.
                </p>
                <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: 14, padding: 16, marginBottom: 20, textAlign: 'left', fontSize: 13.5 }}>
                  <div><strong>Application ID:</strong> {submittedAppId}</div>
                  <div><strong>Expected Rate:</strong> {expectedRate}</div>
                  <div><strong>Availability:</strong> {availabilityChoice}</div>
                  <div><strong>Status:</strong> Under Contractor Review (SMS Sent)</div>
                </div>
                <button
                  type="button"
                  className="btn-card-apply"
                  style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
                  onClick={() => setApplyingJob(null)}
                >
                  Done / View More Jobs
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitApplication} className="modal-body-scroll">
                {/* Profile Snapshot */}
                <div className="apply-profile-card">
                  <div className="apply-profile-row">
                    <div className="apply-avatar">
                      {workerProfile.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <strong style={{ fontSize: '16px', color: '#0f172a' }}>{workerProfile.name}</strong>
                      <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                        {workerProfile.service} • {workerProfile.experience} experience • {workerProfile.phone}
                      </div>
                      <div style={{ fontSize: '12px', color: '#008744', fontWeight: 700, marginTop: '2px' }}>
                        ✓ {workerProfile.verification || 'Aadhaar Verified Skilled Worker'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expected Daily Rate */}
                <div className="apply-field-group">
                  <label>Your Expected Daily Wage / Rate</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 10 }}>
                    <input
                      type="text"
                      value={expectedRate}
                      onChange={(e) => setExpectedRate(e.target.value)}
                      placeholder="e.g. ₹850/day"
                      required
                    />
                    <div className="rate-preset-chips">
                      {['₹800/day', '₹850/day', '₹900/day', '₹950/day'].map((r) => (
                        <button
                          key={r}
                          type="button"
                          className={`rate-mini-chip ${expectedRate === r ? 'selected' : ''}`}
                          onClick={() => setExpectedRate(r)}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Joining Availability */}
                <div className="apply-field-group">
                  <label>When can you start on site?</label>
                  <div className="avail-choice-grid">
                    {['Tomorrow Morning', 'Immediate (Today)', 'Within 3 Days', 'Next Week'].map((av) => (
                      <button
                        key={av}
                        type="button"
                        className={`avail-btn ${availabilityChoice === av ? 'selected' : ''}`}
                        onClick={() => setAvailabilityChoice(av)}
                      >
                        {av}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notes to Contractor */}
                <div className="apply-field-group">
                  <label>Message / Experience Note for Contractor</label>
                  <textarea
                    rows="3"
                    value={applyNotes}
                    onChange={(e) => setApplyNotes(e.target.value)}
                    placeholder="Describe your matching experience, tools you possess, or previous projects..."
                    required
                  />
                </div>

                {applyFeedback && (
                  <div style={{
                    padding: '12px',
                    borderRadius: '10px',
                    fontSize: '13.5px',
                    marginBottom: '16px',
                    background: applyFeedback.type === 'success' ? '#f0fdf4' : '#fef2f2',
                    color: applyFeedback.type === 'success' ? '#166534' : '#b91c1c',
                    fontWeight: 700,
                  }}>
                    {applyFeedback.message}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
                  <button
                    type="button"
                    className="btn-card-view-scope"
                    onClick={() => setApplyingJob(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-card-apply"
                  >
                    <span>Submit Application</span>
                    <span>✓</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
