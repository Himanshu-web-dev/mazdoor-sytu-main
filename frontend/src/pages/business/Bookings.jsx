import { useState } from 'react'
import BusinessLayout from './BusinessLayout'
import './BusinessPortal.css'

const INITIAL_BOOKINGS = [
  {
    id: 'ORD-2026-881',
    title: 'Commercial Complex Phase 1 — Electrical DB & Conduit Dressing',
    category: 'Electrical Service',
    status: 'In Progress',
    location: 'Partapur Industrial Area, Meerut',
    date: 'Active • 9:00 AM – 6:00 PM',
    crewSize: '4 Electricians Staffed',
    leadWorker: 'Aman Verma (+91 8004264176)',
    amount: '₹34,000',
    amountNum: 34000,
    completionPct: 65,
    daysLeft: '5 Days remaining'
  },
  {
    id: 'ORD-2026-882',
    title: 'Villa Project Duplex Concealed Plumbing & Diverters',
    category: 'Plumbing Service',
    status: 'Confirmed',
    location: 'Ganga Sagar, Meerut',
    date: 'Starts Tomorrow • 9:30 AM',
    crewSize: '2 Plumber Mistris',
    leadWorker: 'Rakesh Kumar (+91 98112 34567)',
    amount: '₹19,000',
    amountNum: 19000,
    completionPct: 10,
    daysLeft: '14 Days remaining'
  },
  {
    id: 'ORD-2026-883',
    title: 'Warehouse Logistics & FMCG Pallet Staging',
    category: 'Loading & Logistics',
    status: 'In Progress',
    location: 'Transport Nagar, Meerut',
    date: 'Night Shift • 8:00 PM – 5:00 AM',
    crewSize: '8 Verified Handlers',
    leadWorker: 'Suraj Pal (+91 92109 87654)',
    amount: '₹16,800',
    amountNum: 16800,
    completionPct: 80,
    daysLeft: '2 Days remaining'
  },
  {
    id: 'ORD-2026-884',
    title: 'Heavy PEB Roof Truss Arc & MIG Welding',
    category: 'Welding & Fabrication',
    status: 'Completed',
    location: 'Partapur Shed 4, Meerut',
    date: 'Completed Yesterday • Verified by Site Engg.',
    crewSize: '3 Certified Welders',
    leadWorker: 'Dinesh Yadav (+91 96543 21098)',
    amount: '₹30,000',
    amountNum: 30000,
    completionPct: 100,
    daysLeft: 'Sign-off complete'
  }
]

export default function Bookings({ onNavigate, session, onLogout }) {
  const [bookingsList, setBookingsList] = useState(INITIAL_BOOKINGS)
  const [statusFilter, setStatusFilter] = useState('All')
  const [selectedOrderForSlip, setSelectedOrderForSlip] = useState(null)
  const [toastMessage, setToastMessage] = useState(null)

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handleMarkCompleted = (orderId) => {
    setBookingsList((prev) =>
      prev.map((b) =>
        b.id === orderId
          ? { ...b, status: 'Completed', completionPct: 100, daysLeft: 'Sign-off complete' }
          : b
      )
    )
    showToast(`Work Order #${orderId} marked as completed. Wage settlement generated!`)
  }

  const filteredBookings = bookingsList.filter((b) => {
    if (statusFilter === 'All') return true
    return b.status === statusFilter
  })

  return (
    <BusinessLayout
      activePath="/business/bookings"
      session={session}
      onNavigate={onNavigate}
      onLogout={onLogout}
      title="Work Orders & Site Bookings"
      eyebrow="Operations Management"
      subtitle="Monitor live site crew deployments, work progress percentages and daily contractor sign-offs"
      headerActions={
        <button
          type="button"
          className="biz-btn-primary biz-btn-sm"
          onClick={() => onNavigate('/business/post-requirement')}
        >
          + New Workforce Order
        </button>
      }
    >
      {/* Toast */}
      {toastMessage && (
        <div className="biz-toast" role="status">
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="biz-filter-bar">
        <div style={{ display: 'flex', gap: '8px' }}>
          {['All', 'In Progress', 'Confirmed', 'Completed'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setStatusFilter(tab)}
              style={{
                padding: '7px 16px',
                borderRadius: '8px',
                border: `1.5px solid ${statusFilter === tab ? '#047857' : '#cbd5e1'}`,
                background: statusFilter === tab ? '#ecfdf5' : '#ffffff',
                color: statusFilter === tab ? '#047857' : '#475569',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Cards Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filteredBookings.map((order) => {
          const isCompleted = order.status === 'Completed'
          const isInProgress = order.status === 'In Progress'

          return (
            <div
              key={order.id}
              className="biz-panel"
              style={{
                borderLeft: `5px solid ${
                  isCompleted ? '#059669' : isInProgress ? '#2563eb' : '#f59e0b'
                }`,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="biz-badge blue">{order.id}</span>
                    <span
                      className={`biz-badge ${
                        isCompleted ? 'active' : isInProgress ? 'filled' : 'review'
                      }`}
                    >
                      {order.status}
                    </span>
                    <span style={{ fontSize: '12.5px', color: '#64748b', fontWeight: 600 }}>
                      {order.category}
                    </span>
                  </div>

                  <h3 style={{ margin: '8px 0 4px', fontSize: '17px', color: '#0f172a' }}>
                    {order.title}
                  </h3>
                  <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
                    📍 {order.location} • 🕒 {order.date}
                  </p>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>Contract Value</span>
                  <strong style={{ fontSize: '20px', color: '#0f172a' }}>{order.amount}</strong>
                  <small style={{ color: '#047857', display: 'block', fontWeight: 700 }}>
                    {order.crewSize}
                  </small>
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{ margin: '16px 0 12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                  <span>Site Progress</span>
                  <span>{order.completionPct}% Completed ({order.daysLeft})</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${order.completionPct}%`,
                      background: isCompleted ? '#059669' : '#2563eb',
                      borderRadius: '999px',
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>
              </div>

              {/* Lead and Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #f1f5f9', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ fontSize: '13px', color: '#475569' }}>
                  Site Supervisor / Lead: <strong>{order.leadWorker}</strong>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    className="biz-btn-secondary biz-btn-sm"
                    onClick={() => setSelectedOrderForSlip(order)}
                  >
                    📄 Work Order Slip
                  </button>

                  {!isCompleted && (
                    <button
                      type="button"
                      className="biz-btn-primary biz-btn-sm"
                      onClick={() => handleMarkCompleted(order.id)}
                    >
                      ✓ Sign Off & Complete
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Work Order Slip Modal ── */}
      {selectedOrderForSlip && (
        <div
          className="biz-modal-overlay"
          onClick={() => setSelectedOrderForSlip(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="biz-modal-box" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
            <div className="biz-modal-header">
              <div>
                <h2>Work Order #{selectedOrderForSlip.id}</h2>
                <p>Enterprise Site Deployment Slip • Mazdoor Sytu</p>
              </div>
              <button
                type="button"
                className="biz-modal-close"
                onClick={() => setSelectedOrderForSlip(null)}
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>

            <div className="biz-modal-body">
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <strong style={{ fontSize: '16px', color: '#0f172a', display: 'block' }}>
                  {selectedOrderForSlip.title}
                </strong>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
                  Site Address: {selectedOrderForSlip.location}
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                <div style={{ background: '#ffffff', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                  <small style={{ color: '#64748b', display: 'block', fontSize: '11px', textTransform: 'uppercase', fontWeight: 700 }}>
                    Assigned Crew
                  </small>
                  <strong style={{ fontSize: '14px', color: '#0f172a' }}>{selectedOrderForSlip.crewSize}</strong>
                </div>

                <div style={{ background: '#ffffff', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                  <small style={{ color: '#64748b', display: 'block', fontSize: '11px', textTransform: 'uppercase', fontWeight: 700 }}>
                    Contract Budget
                  </small>
                  <strong style={{ fontSize: '14px', color: '#047857' }}>{selectedOrderForSlip.amount}</strong>
                </div>
              </div>

              <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5 }}>
                <p style={{ margin: '0 0 6px' }}><strong>Terms & Site Safety:</strong></p>
                <ul style={{ margin: 0, paddingLeft: '18px', color: '#64748b' }}>
                  <li>All deployed artisans have verified Aadhaar IDs on Mazdoor Sytu.</li>
                  <li>Overtime wage clearance computed per standard 1.5x formula.</li>
                  <li>Instant UPI / Bank settlement triggered upon site supervisor sign-off.</li>
                </ul>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '14px', borderTop: '1px solid #e2e8f0' }}>
                <button
                  type="button"
                  className="biz-btn-secondary"
                  onClick={() => {
                    window.print()
                  }}
                >
                  🖨️ Print Slip
                </button>
                <button
                  type="button"
                  className="biz-btn-primary"
                  onClick={() => setSelectedOrderForSlip(null)}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </BusinessLayout>
  )
}
