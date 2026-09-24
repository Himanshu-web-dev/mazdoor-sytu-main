import { useState, useMemo } from 'react'
import CustomerLayout from './CustomerLayout'
import { loadCustomerStore, setSelectedBooking, cancelBooking } from '../../data/customerStore'
import './CustomerPortal.css'

const TABS = [
  'All',
  'Real-Time',
  'Scheduled',
  'Pending',
  'Confirmed',
  'Active',
  'Completed',
  'Cancelled'
]

export default function Bookings({ session, onNavigate, onLogout }) {
  const [store, setStore] = useState(() => loadCustomerStore())
  const [activeTab, setActiveTab] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [cancelModalBooking, setCancelModalBooking] = useState(null)
  const [cancelReason, setCancelReason] = useState('Found another alternative')
  const [refundAlert, setRefundAlert] = useState(null)

  // Calculate counts per tab
  const tabCounts = useMemo(() => {
    const counts = { All: store.bookings.length }
    TABS.slice(1).forEach((tab) => {
      counts[tab] = store.bookings.filter((b) => b.status === tab).length
    })
    return counts
  }, [store.bookings])

  // Filtered bookings
  const filteredBookings = useMemo(() => {
    return store.bookings.filter((booking) => {
      const matchesTab = activeTab === 'All' || booking.status === activeTab
      const query = searchQuery.trim().toLowerCase()
      const matchesSearch =
        !query ||
        booking.id.toLowerCase().includes(query) ||
        booking.worker.toLowerCase().includes(query) ||
        booking.service.toLowerCase().includes(query) ||
        booking.category?.toLowerCase().includes(query)

      return matchesTab && matchesSearch
    })
  }, [store.bookings, activeTab, searchQuery])

  const handleOpenDetails = (bookingId) => {
    setSelectedBooking(bookingId)
    onNavigate('/customer/booking-details')
  }

  const handleOpenChat = (workerName) => {
    onNavigate('/customer/messages')
  }

  const handleConfirmCancel = () => {
    if (!cancelModalBooking) return
    const updatedStore = cancelBooking(cancelModalBooking.id, cancelReason)
    setStore(updatedStore)
    setRefundAlert(`Booking ${cancelModalBooking.id} cancelled. ₹${cancelModalBooking.amountNum || 350} refunded to your Wallet.`)
    setCancelModalBooking(null)
    setTimeout(() => setRefundAlert(null), 5000)
  }

  return (
    <CustomerLayout
      activePath="/customer/bookings"
      session={session}
      onNavigate={onNavigate}
      onLogout={onLogout}
      title="Bookings"
      eyebrow="Customer Portal"
      subtitle="Track your real-time requests, scheduled visits, and completed service history"
      headerActions={
        <button
          type="button"
          className="btn-primary-action"
          style={{ flex: 'none', padding: '8px 16px' }}
          onClick={() => onNavigate('/customer/search-workers')}
        >
          <span>+ Book New Service</span>
        </button>
      }
    >
      {refundAlert && (
        <div
          style={{
            background: '#f0fff4',
            border: '1px solid #9ae6b4',
            color: '#22543d',
            padding: '12px 18px',
            borderRadius: '12px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '13.5px',
            fontWeight: '600'
          }}
        >
          <span>✓ {refundAlert}</span>
          <button
            type="button"
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: '700' }}
            onClick={() => setRefundAlert(null)}
          >
            ✕
          </button>
        </div>
      )}

      {/* ---------------- 1. Search Bar & Filters ---------------- */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '20px',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#a0aec0' }}>
            ⌕
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Booking ID, worker name or trade skill..."
            style={{
              width: '100%',
              padding: '10px 14px 10px 34px',
              borderRadius: '12px',
              border: '1px solid var(--line, #d9d8cd)',
              fontSize: '13.5px',
              background: '#ffffff'
            }}
          />
        </div>

        <div style={{ fontSize: '13px', color: 'var(--muted, #68736d)', fontWeight: '600' }}>
          Showing <strong>{filteredBookings.length}</strong> of {store.bookings.length} bookings
        </div>
      </div>

      {/* ---------------- 2. Exactly 8 Booking Tabs ---------------- */}
      <div className="booking-tabs-bar" role="tablist">
        {TABS.map((tab) => {
          const isActive = activeTab === tab
          const count = tabCounts[tab] || 0

          return (
            <button
              type="button"
              key={tab}
              role="tab"
              aria-selected={isActive}
              className={`tab-pill ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              <span>{tab}</span>
              <span className="tab-count">{count}</span>
            </button>
          )
        })}
      </div>

      {/* ---------------- 3. Bookings Card Grid ---------------- */}
      {filteredBookings.length > 0 ? (
        <div className="booking-card-grid">
          {filteredBookings.map((booking) => {
            const isLive = booking.status === 'Real-Time' || booking.status === 'Active'
            const isCompleted = booking.status === 'Completed'
            const isCancelled = booking.status === 'Cancelled'

            return (
              <article className="booking-item-card" key={booking.id}>
                {/* Header */}
                <div className="booking-card-header">
                  <div>
                    <span className="eyebrow" style={{ fontSize: '10px', color: 'var(--orange, #e97447)' }}>
                      {booking.category || 'HOME SERVICE'}
                    </span>
                    <h3>{booking.service}</h3>
                    <div className="booking-worker-sub">
                      <strong>👤 {booking.worker}</strong>
                      <span>• {booking.workerRole}</span>
                    </div>
                  </div>

                  <span className={`status-pill ${booking.status.toLowerCase()}`}>
                    {isLive && <span className="pulse-dot" />}
                    {booking.displayStatus || booking.status}
                  </span>
                </div>

                {/* Metadata Table */}
                <div className="booking-meta-table">
                  <div>
                    <span>Booking ID</span>
                    <strong>{booking.id}</strong>
                  </div>
                  <div>
                    <span>Service Slot</span>
                    <strong>{booking.date} • {booking.time}</strong>
                  </div>
                  <div>
                    <span>Service Address</span>
                    <strong>{booking.location}</strong>
                  </div>
                  <div>
                    <span>Estimated Total</span>
                    <strong style={{ color: 'var(--orange, #e97447)' }}>{booking.amount}</strong>
                  </div>
                </div>

                {/* OTP Display for Active/Scheduled/Real-Time */}
                {!isCancelled && !isCompleted && booking.otp && (
                  <div className="booking-otp-badge">
                    <span>🔐 Doorstep Security OTP:</span>
                    <strong>{booking.otp}</strong>
                    <small style={{ marginLeft: 'auto', fontSize: '11px', opacity: 0.8 }}>
                      (Share upon arrival)
                    </small>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="booking-card-actions">
                  <button
                    type="button"
                    className="btn-primary-action"
                    onClick={() => handleOpenDetails(booking.id)}
                  >
                    {isLive ? 'Track Live Details →' : 'View Details →'}
                  </button>

                  <button
                    type="button"
                    className="btn-secondary-action"
                    onClick={() => handleOpenChat(booking.worker)}
                    title="Chat with worker"
                  >
                    💬 Message
                  </button>

                  {!isCompleted && !isCancelled && (
                    <button
                      type="button"
                      className="btn-danger-action"
                      onClick={() => setCancelModalBooking(booking)}
                    >
                      Cancel
                    </button>
                  )}

                  {isCompleted && !booking.rated && (
                    <button
                      type="button"
                      className="btn-secondary-action"
                      style={{ background: '#fff9db', borderColor: '#f59f00', color: '#d9480f' }}
                      onClick={() => onNavigate('/customer/reviews')}
                    >
                      ★ Rate Service
                    </button>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      ) : (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: '#ffffff',
            border: '1px dashed var(--line, #d9d8cd)',
            borderRadius: '16px'
          }}
        >
          <div style={{ fontSize: '42px', marginBottom: '12px' }}>📂</div>
          <h3 style={{ margin: '0 0 6px', color: 'var(--ink, #16221d)' }}>No bookings in "{activeTab}"</h3>
          <p style={{ color: 'var(--muted, #68736d)', fontSize: '13.5px', margin: '0 0 20px' }}>
            There are no booking records matching your active tab or search query.
          </p>
          <button
            type="button"
            className="btn-primary-action"
            style={{ maxWidth: '220px', margin: '0 auto' }}
            onClick={() => onNavigate('/customer/search-workers')}
          >
            Find a Skilled Worker
          </button>
        </div>
      )}

      {/* ---------------- Cancellation Modal ---------------- */}
      {cancelModalBooking && (
        <div className="portal-modal-backdrop">
          <div className="portal-modal-card">
            <div className="portal-modal-header">
              <h3>Cancel Booking {cancelModalBooking.id}</h3>
              <button
                type="button"
                className="portal-modal-close"
                onClick={() => setCancelModalBooking(null)}
              >
                ✕
              </button>
            </div>

            <div className="portal-modal-body">
              <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--muted, #68736d)' }}>
                Are you sure you want to cancel your booking for <strong>{cancelModalBooking.service}</strong> with{' '}
                <strong>{cancelModalBooking.worker}</strong>?
              </p>

              <div style={{ background: '#f0fff4', border: '1px solid #c6f6d5', padding: '12px 16px', borderRadius: '10px' }}>
                <strong style={{ color: '#22543d', display: 'block', fontSize: '13.5px' }}>
                  ✓ 100% Instant Refund Guarantee
                </strong>
                <span style={{ fontSize: '12.5px', color: '#276749' }}>
                  ₹{cancelModalBooking.amountNum || 350} will be immediately refunded to your Mazdoor Wallet with zero cancellation fees.
                </span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>
                  Reason for cancellation:
                </label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '10px',
                    border: '1px solid var(--line, #d9d8cd)',
                    fontSize: '13px'
                  }}
                >
                  <option>Found another alternative</option>
                  <option>Personal plan changed / need reschedule</option>
                  <option>Worker took too long to arrive</option>
                  <option>Booked by mistake</option>
                  <option>Problem resolved by myself</option>
                </select>
              </div>
            </div>

            <div className="portal-modal-footer">
              <button
                type="button"
                className="btn-secondary-action"
                onClick={() => setCancelModalBooking(null)}
              >
                Keep Booking
              </button>
              <button
                type="button"
                className="btn-danger-action"
                onClick={handleConfirmCancel}
              >
                Confirm Cancellation & Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </CustomerLayout>
  )
}
