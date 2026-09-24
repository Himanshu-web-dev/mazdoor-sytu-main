import { useState } from 'react'
import BusinessLayout from './BusinessLayout'
import './BusinessPortal.css'

const VERIFIED_WORKERS = [
  {
    id: 'WKR-101',
    name: 'Aman Verma',
    trade: 'Electrician',
    rating: '4.9',
    reviewsCount: 54,
    distance: '1.3 km away',
    area: 'Partapur / Meerut',
    successRate: '96%',
    price: '₹850 / day',
    priceNum: 850,
    availability: 'Available Today',
    experience: '5 Years Experience',
    skills: ['Industrial DB Dressing', 'Conduit Pipe Routing', '3-Phase Continuity', 'Safety Protocol'],
    phone: '+91 8004264176',
    verification: 'Aadhaar & Police Verified'
  },
  {
    id: 'WKR-102',
    name: 'Rakesh Kumar',
    trade: 'Plumber',
    rating: '4.8',
    reviewsCount: 42,
    distance: '2.1 km away',
    area: 'Ganga Nagar / Meerut',
    successRate: '94%',
    price: '₹950 / day',
    priceNum: 950,
    availability: 'Available Today',
    experience: '6 Years Experience',
    skills: ['CPVC / UPVC Solvent Welds', 'Concealed Diverters', 'Overhead PVC Tanks', 'Pressure Pumps'],
    phone: '+91 98112 34567',
    verification: 'Aadhaar Verified'
  },
  {
    id: 'WKR-103',
    name: 'Sonia Das',
    trade: 'Painter',
    rating: '4.8',
    reviewsCount: 38,
    distance: '2.4 km away',
    area: 'Shastri Nagar / Meerut',
    successRate: '92%',
    price: '₹750 / day',
    priceNum: 750,
    availability: 'Open this week',
    experience: '4 Years Experience',
    skills: ['Putty Application', 'Roller Emulsion', 'Texture Paint', 'Waterproofing Coat'],
    phone: '+91 97234 56789',
    verification: 'Aadhaar Verified'
  },
  {
    id: 'WKR-104',
    name: 'Dinesh Yadav',
    trade: 'Welder',
    rating: '4.9',
    reviewsCount: 61,
    distance: '3.0 km away',
    area: 'Transport Nagar, Meerut',
    successRate: '98%',
    price: '₹1,000 / day',
    priceNum: 1000,
    availability: 'Available Today',
    experience: '5 Years Experience',
    skills: ['MIG Welding', 'Arc Welding', 'Oxy-Acetylene Cutting', 'PEB Truss Joints'],
    phone: '+91 96543 21098',
    verification: 'Trade Certified & Aadhaar Verified'
  },
  {
    id: 'WKR-105',
    name: 'Nisha Malhotra',
    trade: 'Cleaning Expert',
    rating: '4.9',
    reviewsCount: 47,
    distance: '2.8 km away',
    area: 'Meerut Cantt',
    successRate: '95%',
    price: '₹650 / day',
    priceNum: 650,
    availability: 'Available Today',
    experience: '3 Years Experience',
    skills: ['Single Disc Floor Scrubber', 'Glass Squeegee', 'Industrial Sanitization', 'Pre-Opening Buffing'],
    phone: '+91 95432 10987',
    verification: 'Aadhaar Verified'
  },
  {
    id: 'WKR-106',
    name: 'Vikash Mistri',
    trade: 'Carpenter',
    rating: '4.7',
    reviewsCount: 33,
    distance: '3.5 km away',
    area: 'Ganga Sagar / Meerut',
    successRate: '91%',
    price: '₹900 / day',
    priceNum: 900,
    availability: 'Open this week',
    experience: '4 Years Experience',
    skills: ['Modular Kitchen Cabinets', 'Plywood Partition', 'Laminate Edge Banding', 'Hinge Adjustment'],
    phone: '+91 94321 09876',
    verification: 'Aadhaar Verified'
  },
  {
    id: 'WKR-107',
    name: 'Mohd. Salim',
    trade: 'Mason (Raj Mistri)',
    rating: '4.9',
    reviewsCount: 58,
    distance: '1.8 km away',
    area: 'Modipuram / Meerut',
    successRate: '97%',
    price: '₹900 / day',
    priceNum: 900,
    availability: 'Available Today',
    experience: '7 Years Experience',
    skills: ['Brick Masonry', 'Smooth Plastering', 'Tile Laying', 'PCC Floor Leveling'],
    phone: '+91 93210 98765',
    verification: 'Aadhaar & Safety Verified'
  },
  {
    id: 'WKR-108',
    name: 'Suraj Pal',
    trade: 'Loading & Unloading',
    rating: '4.8',
    reviewsCount: 29,
    distance: '2.0 km away',
    area: 'Transport Nagar / Meerut',
    successRate: '93%',
    price: '₹700 / day',
    priceNum: 700,
    availability: 'Available Today',
    experience: '3 Years Experience',
    skills: ['Trailer Unloading', 'Palletizing', 'Heavy Carton Handling', 'Challan Tallying'],
    phone: '+91 92109 87654',
    verification: 'Aadhaar Verified'
  }
]

export default function Workers({ onNavigate, session, onLogout }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [tradeFilter, setTradeFilter] = useState('All')
  const [availabilityFilter, setAvailabilityFilter] = useState('All')
  const [selectedWorkerForProfile, setSelectedWorkerForProfile] = useState(null)
  const [bookingConfirmationToast, setBookingConfirmationToast] = useState(null)

  const trades = ['All', 'Electrician', 'Plumber', 'Welder', 'Carpenter', 'Mason (Raj Mistri)', 'Painter', 'Loading & Unloading', 'Cleaning Expert']

  const filteredWorkers = VERIFIED_WORKERS.filter((w) => {
    if (tradeFilter !== 'All' && w.trade !== tradeFilter) return false
    if (availabilityFilter === 'Available Today' && w.availability !== 'Available Today') return false

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const matchName = w.name.toLowerCase().includes(q)
      const matchTrade = w.trade.toLowerCase().includes(q)
      const matchSkill = w.skills.some((s) => s.toLowerCase().includes(q))
      if (!matchName && !matchTrade && !matchSkill) return false
    }

    return true
  })

  const handleInstantBook = (worker) => {
    setBookingConfirmationToast(`Work Order generated for ${worker.name} (${worker.trade}). Added to Bookings!`)
    setTimeout(() => setBookingConfirmationToast(null), 3500)
  }

  return (
    <BusinessLayout
      activePath="/business/workers"
      session={session}
      onNavigate={onNavigate}
      onLogout={onLogout}
      title="Verified Trades Directory"
      eyebrow="On-Demand Staffing"
      subtitle="Discover, inspect credentials and directly book background-verified trade mistris for your projects"
      headerActions={
        <button
          type="button"
          className="biz-btn-primary biz-btn-sm"
          onClick={() => onNavigate('/business/post-requirement')}
        >
          + Post Bulk Requirement
        </button>
      }
    >
      {/* Toast */}
      {bookingConfirmationToast && (
        <div className="biz-toast" role="status">
          <span>✓</span>
          <span>{bookingConfirmationToast}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="biz-filter-bar">
        <div className="biz-search-input-wrap">
          <span className="biz-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search workers by trade, artisan name or specific skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <select
            value={tradeFilter}
            onChange={(e) => setTradeFilter(e.target.value)}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid var(--biz-slate-300)',
              fontSize: '13px',
              fontWeight: 600,
              background: '#ffffff',
            }}
          >
            {trades.map((t) => (
              <option key={t} value={t}>
                {t === 'All' ? 'All Trades' : t}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setAvailabilityFilter(availabilityFilter === 'Available Today' ? 'All' : 'Available Today')}
            style={{
              padding: '7px 14px',
              borderRadius: '8px',
              border: `1.5px solid ${availabilityFilter === 'Available Today' ? '#047857' : '#e2e8f0'}`,
              background: availabilityFilter === 'Available Today' ? '#ecfdf5' : '#ffffff',
              color: availabilityFilter === 'Available Today' ? '#047857' : '#64748b',
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            ⚡ Available Today Only
          </button>
        </div>
      </div>

      {/* Workers Grid */}
      <div className="biz-worker-grid">
        {filteredWorkers.map((worker) => (
          <article className="biz-worker-card" key={worker.id}>
            <div className="biz-worker-top">
              <div className="biz-worker-avatar">
                {worker.name
                  .split(' ')
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join('')}
              </div>
              <div className="biz-worker-info">
                <strong>{worker.name}</strong>
                <span>{worker.trade} • {worker.distance}</span>
              </div>
              <span className="biz-badge active" style={{ marginLeft: 'auto', fontSize: '11px' }}>
                {worker.availability}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', color: '#64748b' }}>
              <span>★ <strong>{worker.rating}</strong> ({worker.reviewsCount})</span>
              <span>{worker.experience}</span>
              <span style={{ color: '#047857', fontWeight: 700 }}>{worker.successRate} job success</span>
            </div>

            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {worker.skills.slice(0, 3).map((s) => (
                <span key={s} className="biz-app-chip" style={{ fontSize: '11px' }}>
                  {s}
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
              <div>
                <strong style={{ fontSize: '16px', color: '#0f172a' }}>{worker.price}</strong>
                <small style={{ color: '#047857', display: 'block', fontSize: '11px', fontWeight: 600 }}>
                  ✓ {worker.verification}
                </small>
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  className="biz-btn-secondary biz-btn-sm"
                  onClick={() => setSelectedWorkerForProfile(worker)}
                >
                  Profile
                </button>
                <button
                  type="button"
                  className="biz-btn-primary biz-btn-sm"
                  onClick={() => handleInstantBook(worker)}
                >
                  Book Shift
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* ── Worker Profile Details Modal ── */}
      {selectedWorkerForProfile && (
        <div
          className="biz-modal-overlay"
          onClick={() => setSelectedWorkerForProfile(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="biz-modal-box" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
            <div className="biz-modal-header">
              <div>
                <h2>{selectedWorkerForProfile.name}</h2>
                <p>{selectedWorkerForProfile.trade} Specialist • {selectedWorkerForProfile.area}</p>
              </div>
              <button
                type="button"
                className="biz-modal-close"
                onClick={() => setSelectedWorkerForProfile(null)}
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>

            <div className="biz-modal-body">
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div className="biz-app-avatar" style={{ width: '60px', height: '60px', fontSize: '20px' }}>
                  {selectedWorkerForProfile.name
                    .split(' ')
                    .map((w) => w[0])
                    .slice(0, 2)
                    .join('')}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>
                    {selectedWorkerForProfile.name}
                  </h3>
                  <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#64748b' }}>
                    Rating: {selectedWorkerForProfile.rating} ★ ({selectedWorkerForProfile.reviewsCount} customer reviews) • {selectedWorkerForProfile.experience}
                  </p>
                  <span className="biz-badge active" style={{ marginTop: '6px' }}>
                    ✓ {selectedWorkerForProfile.verification}
                  </span>
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ margin: '0 0 8px', fontSize: '14px', color: '#0f172a' }}>Verified Trade Skillset</h4>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {selectedWorkerForProfile.skills.map((s) => (
                    <span key={s} className="biz-app-chip">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderTop: '1px solid #e2e8f0' }}>
                <div>
                  <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>Daily Contractor Wage</span>
                  <strong style={{ fontSize: '20px', color: '#047857' }}>{selectedWorkerForProfile.price}</strong>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <a
                    href={`tel:${selectedWorkerForProfile.phone}`}
                    className="biz-btn-secondary"
                  >
                    📞 Call {selectedWorkerForProfile.phone}
                  </a>
                  <button
                    type="button"
                    className="biz-btn-primary"
                    onClick={() => {
                      handleInstantBook(selectedWorkerForProfile)
                      setSelectedWorkerForProfile(null)
                    }}
                  >
                    ✓ Confirm Booking
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </BusinessLayout>
  )
}
