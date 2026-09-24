import { useState } from 'react'
import { saveJobRequirement } from '../../data/jobStore'
import './BusinessPortal.css'

const SERVICES = [
  'Electrician',
  'Plumber',
  'Carpenter',
  'Mason (Raj Mistri)',
  'Painter',
  'Welder & Fabricator',
  'Loading & Unloading',
  'Cleaning Expert',
  'Machine Operator',
  'General Maintenance',
]

const FACILITY_OPTIONS = [
  'Safety Helmet & PPE Supplied',
  'Lunch & Tea Provided on Site',
  'Site Accommodation / Camp',
  'Transport Conveyance Allowance',
  'Overtime Pay Eligible',
]

export default function PostRequirement({ onNavigate, session }) {
  const companyName = session?.companyName || session?.name || 'Apex Infra Projects'
  
  const [title, setTitle] = useState('Commercial Complex Electrical Installation')
  const [category, setCategory] = useState('Electrician')
  const [location, setLocation] = useState('Partapur Industrial Area, Meerut')
  const [city, setCity] = useState('Meerut')
  const [workersNeeded, setWorkersNeeded] = useState(4)
  const [budget, setBudget] = useState('₹850/day')
  const [timeline, setTimeline] = useState('Within 48 hours')
  const [duration, setDuration] = useState('15 Days Project')
  const [workingHours, setWorkingHours] = useState('9:00 AM – 6:00 PM')
  const [skills, setSkills] = useState('Industrial Wiring, Conduit Pipes, DB Dressing, Safety Compliance')
  const [selectedFacilities, setSelectedFacilities] = useState([
    'Safety Helmet & PPE Supplied',
    'Lunch & Tea Provided on Site',
  ])
  const [details, setDetails] = useState(
    'Urgent requirement for skilled electricians for multi-floor commercial complex electrification. Work involves running conduits, pulling cables, distribution box dressing, testing circuit continuity, and mounting panel accessories.'
  )
  const [publishedSuccess, setPublishedSuccess] = useState(false)

  const toggleFacility = (facility) => {
    setSelectedFacilities((prev) =>
      prev.includes(facility) ? prev.filter((f) => f !== facility) : [...prev, facility]
    )
  }

  const handlePublish = (e) => {
    e.preventDefault()

    const newJob = saveJobRequirement({
      title,
      company: companyName,
      companyId: session?.email || 'BUS-101',
      businessId: session?.uid || session?.email || 'BUS-101',
      businessEmail: session?.email,
      service: category,
      category,
      location,
      city: city || 'Meerut',
      workersNeeded,
      budget,
      timeline,
      duration,
      workingHours,
      skills: skills.split(',').map((s) => s.trim()).filter(Boolean),
      facilities: selectedFacilities,
      details,
      description: details,
    })

    setPublishedSuccess(true)
    setTimeout(() => {
      onNavigate('/business/requirements')
    }, 1500)
  }

  return (
    <section className="portal-page requirement-page">
      {/* ── Sidebar ── */}
      <aside className="portal-sidebar">
        <div className="portal-brand">
          <img className="portal-logo" src="/official-logo.png" alt="Mazdoor Sytu" />
          <div>
            <strong>Mazdoor Sytu</strong>
            <small>Business Portal</small>
          </div>
        </div>

        <nav className="portal-nav" aria-label="Business requirement navigation">
          {[
            ['Overview', '/business/dashboard'],
            ['Business Profile', '/business/profile'],
            ['Post Requirement', '/business/post-requirement'],
            ['Requirements & Applicants', '/business/requirements'],
            ['Workers', '/business/workers'],
            ['Bookings', '/business/bookings'],
            ['Payments', '/business/payments'],
          ].map(([label, path], index) => (
            <a
              className={path === '/business/post-requirement' ? 'active' : ''}
              href={path}
              key={path}
              onClick={(event) => {
                event.preventDefault()
                onNavigate(path)
              }}
            >
              <span className="nav-bullet">{String(index + 1).padStart(2, '0')}</span>
              {label}
            </a>
          ))}
        </nav>

        <div className="portal-help">
          <span>Need hiring support?</span>
          <a
            href="/support"
            onClick={(event) => {
              event.preventDefault()
              onNavigate('/support')
            }}
          >
            Contact Help Desk ↗
          </a>
        </div>
      </aside>

      {/* ── Content Area ── */}
      <div className="portal-content">
        <header className="portal-header">
          <div>
            <p className="eyebrow">Enterprise Hiring Pipeline</p>
            <h1>Post a New Worker Requirement</h1>
          </div>
          <button
            type="button"
            className="btn-shortlist"
            onClick={() => onNavigate('/business/requirements')}
          >
            ← View All Requirements
          </button>
        </header>

        <div className="portal-welcome requirement-welcome">
          <div>
            <span className="portal-date">INSTANT RECRUITMENT FEED</span>
            <h2>Hire Skilled Tradesmen for Your Site</h2>
            <p>
              Requirements published from your company dashboard are automatically visible on the public
              Jobs page. Verified workers can browse details and apply directly.
            </p>
          </div>
        </div>

        {publishedSuccess && (
          <div
            style={{
              background: '#ecfdf5',
              border: '1.5px solid #10b981',
              borderRadius: '12px',
              padding: '16px 20px',
              color: '#065f46',
              fontWeight: 700,
              fontSize: '14.5px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <span>✓</span>
            <span>
              Requirement posted successfully! It is now live on the Public Jobs page. Redirecting to your
              requirements board...
            </span>
          </div>
        )}

        <div className="requirement-form-wrap" style={{ marginTop: '20px' }}>
          <section className="dashboard-card requirement-form-card" style={{ background: '#ffffff' }}>
            <div className="panel-heading">
              <div>
                <span className="panel-kicker">POSTING DETAILS</span>
                <h3>Workforce Specifications</h3>
              </div>
            </div>

            <form className="requirement-form" onSubmit={handlePublish}>
              {/* Job Title */}
              <label style={{ gridColumn: '1 / -1' }}>
                <span>Requirement Title</span>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Heavy Structural Welders for Industrial Shed"
                  required
                />
              </label>

              {/* Service Category */}
              <label>
                <span>Trade Category</span>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  {SERVICES.map((srv) => (
                    <option key={srv} value={srv}>
                      {srv}
                    </option>
                  ))}
                </select>
              </label>

              {/* Workers Needed */}
              <label>
                <span>Number of Workers Required</span>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={workersNeeded}
                  onChange={(e) => setWorkersNeeded(Number(e.target.value))}
                  required
                />
              </label>

              {/* Daily Wage / Budget */}
              <label>
                <span>Daily Wage / Rate Offered</span>
                <input
                  type="text"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="e.g. ₹850/day or ₹22,000/month"
                  required
                />
              </label>

              {/* Expected Start Date */}
              <label>
                <span>Start Timeline</span>
                <input
                  type="text"
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  placeholder="e.g. Tomorrow, Within 48 hours"
                  required
                />
              </label>

              {/* Project Duration */}
              <label>
                <span>Project Duration</span>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g. 15 Days, 1 Month Contract"
                  required
                />
              </label>

              {/* Working Hours */}
              <label>
                <span>Daily Working Hours</span>
                <input
                  type="text"
                  value={workingHours}
                  onChange={(e) => setWorkingHours(e.target.value)}
                  placeholder="e.g. 9:00 AM – 6:00 PM"
                  required
                />
              </label>

              {/* Site Location */}
              <label>
                <span>Site Address & Locality</span>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Sector 62, Noida"
                  required
                />
              </label>

              {/* City */}
              <label>
                <span>City / Region</span>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Meerut, Noida, Delhi NCR"
                  required
                />
              </label>

              {/* Required Skills */}
              <label style={{ gridColumn: '1 / -1' }}>
                <span>Required Skills (separated by commas)</span>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="e.g. Conduit Pipe, DB Dressing, Industrial Wiring"
                  required
                />
              </label>

              {/* Site Facilities */}
              <div style={{ gridColumn: '1 / -1' }}>
                <span style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '8px', color: 'var(--biz-slate-700)' }}>
                  Facilities & Benefits Provided to Workers
                </span>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {FACILITY_OPTIONS.map((facility) => {
                    const isSelected = selectedFacilities.includes(facility)
                    return (
                      <button
                        key={facility}
                        type="button"
                        onClick={() => toggleFacility(facility)}
                        style={{
                          padding: '7px 14px',
                          borderRadius: '8px',
                          border: `1.5px solid ${isSelected ? '#059669' : '#cbd5e1'}`,
                          background: isSelected ? '#ecfdf5' : '#ffffff',
                          color: isSelected ? '#065f46' : '#475569',
                          fontWeight: 600,
                          fontSize: '12.5px',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {facility}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Scope of Work */}
              <label style={{ gridColumn: '1 / -1' }}>
                <span>Scope of Work & Job Description</span>
                <textarea
                  rows={4}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Describe the exact requirements, site conditions, safety guidelines, and tasks..."
                  required
                />
              </label>

              {/* Action Buttons */}
              <div
                style={{
                  gridColumn: '1 / -1',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '12px',
                  paddingTop: '16px',
                  borderTop: '1px solid #e2e8f0',
                }}
              >
                <button
                  type="button"
                  className="btn-reject"
                  onClick={() => onNavigate('/business/requirements')}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-accept"
                  style={{ padding: '12px 28px', fontSize: '14.5px' }}
                >
                  Publish Requirement to Public Jobs ↗
                </button>
              </div>
            </form>
          </section>

          {/* Quick Info Sidebar */}
          <aside className="next-panel" style={{ background: '#0f172a', borderRadius: '14px' }}>
            <span className="panel-kicker" style={{ color: '#34d399' }}>HIRING WORKFLOW</span>
            <h3>How It Works</h3>
            <div className="quick-links">
              <div style={{ padding: '10px 0', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <strong style={{ display: 'block', color: '#ffffff', fontSize: '13.5px' }}>1. Automatic Public Listing</strong>
                <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: '12.5px' }}>
                  Your requirement immediately appears on the public Jobs page for all verified artisans to see.
                </p>
              </div>
              <div style={{ padding: '10px 0', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <strong style={{ display: 'block', color: '#ffffff', fontSize: '13.5px' }}>2. Verified Worker Applications</strong>
                <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: '12.5px' }}>
                  Only logged-in workers with verified Aadhaar and skill records can submit applications.
                </p>
              </div>
              <div style={{ padding: '10px 0', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <strong style={{ display: 'block', color: '#ffffff', fontSize: '13.5px' }}>3. Shortlist, Hire & Close</strong>
                <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: '12.5px' }}>
                  Review applicants in your dashboard, hire your crew, and mark jobs as filled anytime.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
