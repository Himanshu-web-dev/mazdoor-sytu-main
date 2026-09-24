import { useState, useEffect } from 'react'
import AdminLayout from './AdminLayout'
import { loadCustomerStore } from '../../data/customerStore'

export default function AdminBookings({ onNavigate, onLogout }) {
  const [bookings, setBookings] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [selectedBooking, setSelectedBooking] = useState(null)

  useEffect(() => {
    try {
      const data = loadCustomerStore()
      if (data && data.bookings) {
        setBookings(data.bookings)
      }
    } catch (e) {
      console.error('Failed to load customer bookings:', e)
    }
  }, [])

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.worker.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.location && b.location.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = filterStatus === 'All' || b.status === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <AdminLayout
      title="Platform Bookings & Dispatch Oversight"
      subtitle="Complete operational visibility into all active, real-time dispatched, and scheduled service bookings"
      currentPath="/admin/bookings"
      onNavigate={onNavigate}
      onLogout={onLogout}
    >
      {/* ── Controls ── */}
      <div className="admin-control-bar">
        <div className="admin-search-wrapper">
          <span className="admin-search-icon">🔍</span>
          <input
            type="text"
            className="admin-search-input"
            placeholder="Search by Booking ID, service, worker name, or location…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="admin-filter-group">
          {['All', 'Real-Time', 'Scheduled', 'Completed', 'Cancelled'].map((status) => (
            <button
              key={status}
              type="button"
              className={`admin-filter-pill ${filterStatus === status ? 'active' : ''}`}
              onClick={() => setFilterStatus(status)}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table Card ── */}
      <div className="admin-table-card">
        <div className="admin-table-responsive">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>Booking ID & Service</th>
                <th>Assigned Worker</th>
                <th>Service Location</th>
                <th>Date & Schedule</th>
                <th>Fare</th>
                <th>Current Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '36px', color: '#94a3b8' }}>
                    No bookings found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <div className="admin-entity-cell">
                        <div className="admin-entity-avatar" style={{ background: 'rgba(124, 58, 237, 0.15)', color: '#c4b5fd' }}>
                          📋
                        </div>
                        <div className="admin-entity-meta">
                          <strong>{b.service}</strong>
                          <span style={{ color: '#a78bfa', fontWeight: 700 }}>#{b.id} • {b.category}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#fff' }}>{b.worker}</div>
                      <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>{b.workerRole}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.84rem' }}>{b.location}</div>
                      <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>{b.landmark}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#fff' }}>{b.date}</div>
                      <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>{b.time}</div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 800, color: '#34d399' }}>{b.amount}</span>
                    </td>
                    <td>
                      <span className={`admin-badge ${b.status.toLowerCase().replace('-', '_')}`}>
                        {b.status === 'Real-Time' ? '⚡ Real-Time En Route' : b.status}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="admin-btn secondary"
                        onClick={() => setSelectedBooking(b)}
                      >
                        Inspect Timeline
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Booking Inspection Modal ── */}
      {selectedBooking && (
        <div className="admin-modal-overlay" onClick={() => setSelectedBooking(null)}>
          <div className="admin-modal-window" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Booking Details — #{selectedBooking.id}</h3>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setSelectedBooking(null)}
              >
                ✕
              </button>
            </div>
            <div className="admin-modal-body">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                <div>
                  <h4 style={{ margin: '0 0 4px', fontSize: '1.15rem', color: '#fff' }}>{selectedBooking.service}</h4>
                  <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                    Category: <strong style={{ color: '#a78bfa' }}>{selectedBooking.category}</strong>
                  </span>
                </div>
                <span className={`admin-badge ${selectedBooking.status.toLowerCase().replace('-', '_')}`}>
                  {selectedBooking.status}
                </span>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '16px', marginBottom: '18px' }}>
                <strong style={{ display: 'block', color: '#fff', fontSize: '0.84rem', marginBottom: '6px' }}>
                  CUSTOMER PROBLEM DESCRIPTION:
                </strong>
                <p style={{ margin: 0, fontSize: '0.84rem', color: '#cbd5e1', lineHeight: '1.5' }}>
                  {selectedBooking.description}
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '18px' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 14px', borderRadius: '8px' }}>
                  <small style={{ color: '#94a3b8', display: 'block', fontSize: '0.72rem' }}>ASSIGNED WORKER</small>
                  <strong style={{ color: '#fff' }}>{selectedBooking.worker}</strong>
                  <div style={{ fontSize: '0.74rem', color: '#34d399' }}>★ {selectedBooking.workerRating} ({selectedBooking.workerJobs} jobs)</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 14px', borderRadius: '8px' }}>
                  <small style={{ color: '#94a3b8', display: 'block', fontSize: '0.72rem' }}>SECURITY START OTP</small>
                  <strong style={{ color: '#fcd34d', fontSize: '1.1rem', letterSpacing: '0.1em' }}>{selectedBooking.otp}</strong>
                  <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Must be verified on site</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 14px', borderRadius: '8px' }}>
                  <small style={{ color: '#94a3b8', display: 'block', fontSize: '0.72rem' }}>TOTAL SETTLEMENT</small>
                  <strong style={{ color: '#34d399', fontSize: '1.1rem' }}>{selectedBooking.amount}</strong>
                  <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>{selectedBooking.paymentStatus}</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 14px', borderRadius: '8px' }}>
                  <small style={{ color: '#94a3b8', display: 'block', fontSize: '0.72rem' }}>DISPATCH / ETA</small>
                  <strong style={{ color: '#38bdf8' }}>{selectedBooking.eta || selectedBooking.time}</strong>
                  <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>{selectedBooking.distance || 'Scheduled'}</div>
                </div>
              </div>
            </div>
            <div className="admin-modal-footer">
              <button
                type="button"
                className="admin-btn primary"
                onClick={() => setSelectedBooking(null)}
              >
                Close Log
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
