import { useState } from 'react'
import { saveJobRequirement } from '../../data/jobStore'
import BusinessLayout from './BusinessLayout'
import './BusinessPortal.css'

const TRADE_PRESETS = [
  {
    name: 'Electrician',
    title: 'Industrial Electrical Installation & DB Dressing',
    rate: '₹850/day',
    rateNum: 850,
    skills: 'Industrial Wiring, Conduit Pipes, DB Dressing, Safety Compliance',
    details: 'Urgent requirement for skilled electricians for multi-floor commercial complex electrification. Work involves running conduits, pulling cables, distribution box dressing, testing circuit continuity, and mounting panel accessories.'
  },
  {
    name: 'Plumber',
    title: 'Sanitary Plumbers & Pipe Fitters — Villa Project',
    rate: '₹950/day',
    rateNum: 950,
    skills: 'CPVC Piping, Concealed Diverters, Pressure Testing, Sanitaryware Fitting',
    details: 'Urgent requirement for experienced plumbing mistris for premium residential duplex project. Work includes concealed pipeline routing, drainage layout, overhead PVC tank connections, and sanitaryware fitting.'
  },
  {
    name: 'Carpenter',
    title: 'Modular Kitchen & Plywood Interior Carpenters',
    rate: '₹900/day',
    rateNum: 900,
    skills: 'Laminate Pasting, Modular Cabinet Assembly, Hinge Fitting, Sliding Channels',
    details: 'Experienced finish carpenters needed for commercial interior execution. Precision cuts, laminate edge banding, and carcass mounting.'
  },
  {
    name: 'Mason (Raj Mistri)',
    title: 'Civil Mason & Brickwork Mistri for Site Construction',
    rate: '₹900/day',
    rateNum: 900,
    skills: 'Brickwork Alignment, Plastering, PCC / RCC Pouring, Tile Laying',
    details: 'Skilled civil masons required for commercial foundation and brick masonry. Must know plumb line, water level checking, and smooth cement mortar finish.'
  },
  {
    name: 'Painter',
    title: 'Commercial Interior Putty & Emulsion Painters',
    rate: '₹750/day',
    rateNum: 750,
    skills: 'Putty Sanding, Roller Painting, Primer Coating, Masking',
    details: 'Professional painters required for interior wall finish. Two coats of putty, 1 coat primer, and 2 finish coats of premium acrylic emulsion.'
  },
  {
    name: 'Welder & Fabricator',
    title: 'Structural Steel Welders & Industrial Shed Fabricators',
    rate: '₹1,000/day',
    rateNum: 1000,
    skills: 'MIG Welding, Arc Welding, Gas Cutting, Roof Truss Assembly',
    details: 'Heavy PEB structural welding and roof truss fabrication. Certified in 6mm to 16mm MS plates and angle joint welding.'
  },
  {
    name: 'Loading & Unloading',
    title: 'Warehouse FMCG Loading & Staging Crew',
    rate: '₹700/day',
    rateNum: 700,
    skills: 'Carton Handling, Pallet Loading, Hand Truck Operation, Tally Check',
    details: 'Reliable warehouse crew for trailer unloading, sorting, and pallet stacking. Direct daily payouts with refreshment breaks.'
  },
  {
    name: 'Cleaning Expert',
    title: 'Commercial Showroom Deep Scrubbing & Sanitization',
    rate: '₹650/day',
    rateNum: 650,
    skills: 'Single Disc Scrubber, Glass Squeegee, Carpet Vacuuming, Sanitization',
    details: 'Post-construction pre-opening scrubbing and facade window cleaning for commercial retail space.'
  }
]

const FACILITY_OPTIONS = [
  'Safety Helmet & PPE Supplied',
  'Lunch & Tea Provided on Site',
  'Site Accommodation / Camp',
  'Transport Conveyance Allowance',
  'Overtime Pay Eligible (@ 1.5x)',
  'Tool Kit Provided on Site',
  'Instant Daily Cash / UPI Settlement'
]

export default function PostRequirement({ onNavigate, session, onLogout }) {
  const companyName = session?.companyName || session?.name || 'Apex Infra Ltd.'

  const [category, setCategory] = useState('Electrician')
  const [title, setTitle] = useState('Commercial Complex Electrical Installation & DB Dressing')
  const [location, setLocation] = useState('Partapur Industrial Area, Meerut')
  const [city, setCity] = useState('Meerut')
  const [workersNeeded, setWorkersNeeded] = useState(4)
  const [budget, setBudget] = useState('₹850/day')
  const [daysCount, setDaysCount] = useState(15)
  const [timeline, setTimeline] = useState('Within 48 hours')
  const [workingHours, setWorkingHours] = useState('9:00 AM – 6:00 PM')
  const [skills, setSkills] = useState('Industrial Wiring, Conduit Pipes, DB Dressing, Safety Compliance')
  const [selectedFacilities, setSelectedFacilities] = useState([
    'Safety Helmet & PPE Supplied',
    'Lunch & Tea Provided on Site',
    'Overtime Pay Eligible (@ 1.5x)'
  ])
  const [details, setDetails] = useState(
    'Urgent requirement for skilled electricians for multi-floor commercial complex electrification. Work involves running conduits, pulling cables, distribution box dressing, testing circuit continuity, and mounting panel accessories.'
  )
  const [publishedSuccess, setPublishedSuccess] = useState(false)

  // Handle Preset selection
  const applyPreset = (preset) => {
    setCategory(preset.name)
    setTitle(preset.title)
    setBudget(preset.rate)
    setSkills(preset.skills)
    setDetails(preset.details)
  }

  const toggleFacility = (facility) => {
    setSelectedFacilities((prev) =>
      prev.includes(facility) ? prev.filter((f) => f !== facility) : [...prev, facility]
    )
  }

  // Parse numerical rate for calculator
  const numericRate = parseInt(String(budget).replace(/[^0-9]/g, '') || '850', 10)
  const totalEstimatedCost = workersNeeded * numericRate * daysCount

  const handlePublish = (e) => {
    e.preventDefault()

    saveJobRequirement({
      title,
      company: companyName,
      companyId: session?.email || '',
      businessId: session?.uid || '',
      businessEmail: session?.email || '',
      service: category,
      category,
      location,
      city: city || 'Meerut',
      workersNeeded: parseInt(workersNeeded, 10),
      budget,
      timeline,
      duration: `${daysCount} Days Project`,
      workingHours,
      skills: skills.split(',').map((s) => s.trim()).filter(Boolean),
      facilities: selectedFacilities,
      details,
      description: details,
    })

    setPublishedSuccess(true)
    setTimeout(() => {
      onNavigate('/business/requirements')
    }, 1400)
  }

  return (
    <BusinessLayout
      activePath="/business/post-requirement"
      session={session}
      onNavigate={onNavigate}
      onLogout={onLogout}
      title="Post Workforce Requirement"
      eyebrow="Recruitment Creator"
      subtitle="Publish verified trade openings to thousands of skilled local artisans across Meerut & NCR"
      headerActions={
        <button
          type="button"
          className="biz-btn-secondary biz-btn-sm"
          onClick={() => onNavigate('/business/requirements')}
        >
          View Live Requirements ↗
        </button>
      }
    >
      {publishedSuccess && (
        <div className="biz-toast" style={{ marginBottom: '16px' }} role="status">
          <span>✓</span>
          <span>Requirement published successfully! Synchronized with public Jobs board. Redirecting…</span>
        </div>
      )}

      {/* Preset Trade Selection */}
      <section className="biz-panel" style={{ padding: '20px 24px' }}>
        <div style={{ marginBottom: '12px' }}>
          <span className="biz-eyebrow">QUICK TRADE TEMPLATES</span>
          <h3 style={{ margin: '2px 0 4px', fontSize: '16px', fontWeight: 800 }}>
            Choose a Trade to Auto-Populate Industry Standards
          </h3>
          <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
            Clicking any trade below configures standard market wage rates, essential skill tags, and site responsibilities.
          </p>
        </div>

        <div className="biz-presets-row">
          {TRADE_PRESETS.map((p) => {
            const isSelected = category === p.name
            return (
              <button
                key={p.name}
                type="button"
                className={`biz-preset-chip ${isSelected ? 'active' : ''}`}
                onClick={() => applyPreset(p)}
              >
                {p.name} • {p.rate}
              </button>
            )
          })}
        </div>
      </section>

      {/* Form + Calculator Grid */}
      <form onSubmit={handlePublish} className="biz-form-grid">
        {/* Left Column: Form Details */}
        <div className="biz-form-card">
          <div className="biz-form-section-title">
            <span>1.</span> Position & Deployment Scope
          </div>

          <div className="biz-form-group">
            <label htmlFor="job-title">Requirement Title</label>
            <input
              id="job-title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Commercial Complex Electrical Installation"
            />
          </div>

          <div className="biz-field-row">
            <div className="biz-form-group">
              <label htmlFor="job-category">Trade Category</label>
              <select
                id="job-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {TRADE_PRESETS.map((p) => (
                  <option key={p.name} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="biz-form-group">
              <label htmlFor="workers-needed">Workers Needed (Positions)</label>
              <input
                id="workers-needed"
                type="number"
                min="1"
                max="100"
                required
                value={workersNeeded}
                onChange={(e) => setWorkersNeeded(Math.max(1, parseInt(e.target.value || '1', 10)))}
              />
            </div>
          </div>

          <div className="biz-field-row">
            <div className="biz-form-group">
              <label htmlFor="job-rate">Wage Rate (Per Worker / Day)</label>
              <input
                id="job-rate"
                type="text"
                required
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="e.g. ₹850/day"
              />
            </div>

            <div className="biz-form-group">
              <label htmlFor="project-duration">Project Duration (Days)</label>
              <input
                id="project-duration"
                type="number"
                min="1"
                max="365"
                required
                value={daysCount}
                onChange={(e) => setDaysCount(Math.max(1, parseInt(e.target.value || '1', 10)))}
              />
            </div>
          </div>

          <div className="biz-field-row">
            <div className="biz-form-group">
              <label htmlFor="job-location">Site Location / Address</label>
              <input
                id="job-location"
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Partapur Industrial Area, Meerut"
              />
            </div>

            <div className="biz-form-group">
              <label htmlFor="job-city">City / Region</label>
              <input
                id="job-city"
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Meerut"
              />
            </div>
          </div>

          <div className="biz-field-row">
            <div className="biz-form-group">
              <label htmlFor="job-timeline">Start Timeline</label>
              <select
                id="job-timeline"
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
              >
                <option value="Immediate">Immediate / Today</option>
                <option value="Within 24 hours">Within 24 hours</option>
                <option value="Within 48 hours">Within 48 hours</option>
                <option value="Next Week">Next Week</option>
              </select>
            </div>

            <div className="biz-form-group">
              <label htmlFor="working-hours">Working Hours</label>
              <input
                id="working-hours"
                type="text"
                value={workingHours}
                onChange={(e) => setWorkingHours(e.target.value)}
                placeholder="e.g. 9:00 AM – 6:00 PM"
              />
            </div>
          </div>

          {/* Section 2: Skills & Details */}
          <div className="biz-form-section-title" style={{ marginTop: '12px' }}>
            <span>2.</span> Required Skills & Specifications
          </div>

          <div className="biz-form-group">
            <label htmlFor="job-skills">Key Trade Skills (Comma-separated)</label>
            <input
              id="job-skills"
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g. DB Dressing, Conduit Pipes, 3-Phase Testing"
            />
          </div>

          <div className="biz-form-group">
            <label htmlFor="job-details">Scope of Work & Job Description</label>
            <textarea
              id="job-details"
              rows={4}
              required
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Provide clear instructions on site responsibilities, tools required, and supervisor coordination..."
            />
          </div>

          {/* Section 3: Facility Perks */}
          <div className="biz-form-section-title" style={{ marginTop: '12px' }}>
            <span>3.</span> Site Facilities & Worker Perks
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px' }}>
            {FACILITY_OPTIONS.map((f) => {
              const isChecked = selectedFacilities.includes(f)
              return (
                <label
                  key={f}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: `1px solid ${isChecked ? '#10b981' : '#e2e8f0'}`,
                    background: isChecked ? '#ecfdf5' : '#ffffff',
                    cursor: 'pointer',
                    fontSize: '12.5px',
                    fontWeight: isChecked ? 700 : 500,
                    color: isChecked ? '#047857' : '#475569',
                    transition: 'all 0.15s'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleFacility(f)}
                    style={{ accentColor: '#059669' }}
                  />
                  <span>{f}</span>
                </label>
              )
            })}
          </div>

          <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
            <button type="submit" className="biz-btn-primary" style={{ padding: '12px 28px', fontSize: '15px' }}>
              ✓ Publish Requirement to Jobs Board
            </button>
            <button
              type="button"
              className="biz-btn-secondary"
              onClick={() => onNavigate('/business/requirements')}
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Right Column: Live Calculator & Job Card Preview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Live Cost Calculator */}
          <div className="biz-calculator-box">
            <div>
              <span style={{ fontSize: '11px', color: '#34d399', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                LIVE COST ESTIMATOR
              </span>
              <h3 style={{ margin: '4px 0 0', color: '#ffffff', fontSize: '18px', fontWeight: 800 }}>
                Budget Projection
              </h3>
            </div>

            <div className="biz-calc-row">
              <span>Workers Requested:</span>
              <strong>{workersNeeded} Workers</strong>
            </div>

            <div className="biz-calc-row">
              <span>Wage Rate Per Worker:</span>
              <strong>₹{numericRate.toLocaleString()} / day</strong>
            </div>

            <div className="biz-calc-row">
              <span>Duration of Engagement:</span>
              <strong>{daysCount} Days</strong>
            </div>

            <div className="biz-calc-row">
              <span>Daily Total Wage Outlay:</span>
              <strong>₹{(workersNeeded * numericRate).toLocaleString()} / day</strong>
            </div>

            <div className="biz-calc-row">
              <span>Mazdoor Sytu Platform Fee:</span>
              <strong style={{ color: '#34d399' }}>₹0 (Enterprise Tier)</strong>
            </div>

            <div className="biz-calc-total">
              <span>Estimated Total Outlay:</span>
              <strong>₹{totalEstimatedCost.toLocaleString()}</strong>
            </div>

            <small style={{ color: '#94a3b8', fontSize: '11.5px', lineHeight: 1.4 }}>
              * GST invoices and daily digital attendance muster available under Payments & Finance.
            </small>
          </div>

          {/* Live Preview Card */}
          <div className="biz-panel">
            <span className="biz-eyebrow">PUBLIC FEED PREVIEW</span>
            <h3 style={{ margin: '4px 0 14px', fontSize: '16px', fontWeight: 800 }}>
              Worker Card Preview
            </h3>

            <div
              style={{
                border: '1.5px solid #e2e8f0',
                borderRadius: '12px',
                padding: '16px',
                background: '#ffffff',
                boxShadow: 'var(--biz-shadow-xs)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                <div>
                  <span className="biz-badge active" style={{ marginBottom: '6px' }}>
                    {category}
                  </span>
                  <strong style={{ fontSize: '14.5px', display: 'block', color: '#0f172a' }}>
                    {title || 'Job Title Preview'}
                  </strong>
                  <span style={{ fontSize: '12.5px', color: '#64748b' }}>
                    {companyName} • {city}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <strong style={{ fontSize: '16px', color: '#047857', display: 'block' }}>
                    {budget}
                  </strong>
                  <small style={{ color: '#64748b', fontSize: '11px' }}>{workersNeeded} Vacancies</small>
                </div>
              </div>

              <p style={{ margin: '10px 0', fontSize: '12.5px', color: '#475569', lineHeight: 1.4 }}>
                {details.slice(0, 140)}…
              </p>

              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                {skills.split(',').slice(0, 3).map((s) => (
                  <span key={s} className="biz-app-chip" style={{ fontSize: '11px' }}>
                    {s.trim()}
                  </span>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: '11.5px', color: '#64748b' }}>
                  🕒 {timeline} • {daysCount} Days
                </span>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#2563eb' }}>
                  Apply via Mazdoor Sytu →
                </span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </BusinessLayout>
  )
}
