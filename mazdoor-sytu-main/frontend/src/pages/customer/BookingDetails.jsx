import { useState, useMemo } from 'react'
import CustomerLayout from './CustomerLayout'
import {
  loadCustomerStore,
  setSelectedBooking,
  advanceBookingStage,
  cancelBooking
} from '../../data/customerStore'
import MapEmbed from '../../components/MapEmbed'
import './BookingDetails.css'
import './CustomerPortal.css'

const STAGES = [
  {
    title: 'Booking Confirmed',
    time: '2:45 PM',
    desc: 'Order placed & scheduled in Mazdoor Sytu system',
    icon: '📋'
  },
  {
    title: 'Worker Assigned & Dispatched',
    time: '2:48 PM',
    desc: 'Technician accepted job & verified PPE safety kit',
    icon: '🛵'
  },
  {
    title: 'Worker On The Way (Live GPS)',
    time: 'Live En Route',
    desc: 'Driving via Delhi Road (Live location tracking active)',
    icon: '📍'
  },
  {
    title: 'Worker Arrived at Doorstep',
    time: 'Pending Arrival',
    desc: 'Verify technician identity badge & show service area',
    icon: '🚪'
  },
  {
    title: 'Work In Progress & Diagnostics',
    time: 'Pending Start',
    desc: 'Inspection, repair, testing and spare parts fitting',
    icon: '🔧'
  },
  {
    title: 'Work Completed & OTP Release',
    time: 'Final Step',
    desc: 'Verify complete satisfaction and share 4-digit OTP',
    icon: '✓'
  }
]

export default function BookingDetails({ session, onNavigate, onLogout }) {
  const [store, setStore] = useState(() => loadCustomerStore())

  // Modal states
  const [callModalOpen, setCallModalOpen] = useState(false)
  const [copiedOtp, setCopiedOtp] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [cancelModalOpen, setCancelModalOpen] = useState(false)
  const [cancelReason, setCancelReason] = useState('Found another alternative')
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false)
  const [rescheduleDate, setRescheduleDate] = useState('Tomorrow, 24 Sep')
  const [rescheduleTime, setRescheduleTime] = useState('10:00 AM – 1:00 PM')
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false)
  const [sosModalOpen, setSosModalOpen] = useState(false)
  const [statusNotice, setStatusNotice] = useState(null)

  // Doorstep gate instructions
  const [entryNotes, setEntryNotes] = useState(
    'Please enter through Gate No. 2 of Shastri Nagar colony. Apartment elevator is functional.'
  )
  const [isEditingNotes, setIsEditingNotes] = useState(false)
  const [tempNotes, setTempNotes] = useState(entryNotes)

  // Find currently selected booking or fallback to first
  const booking = useMemo(() => {
    return (
      store.bookings.find((b) => b.id === store.selectedBookingId) ||
      store.bookings[0]
    )
  }, [store.bookings, store.selectedBookingId])

  const currentStageIndex = booking ? Math.max(0, Math.min(booking.timelineIndex ?? 2, 5)) : 2

  const handleSelectDifferentBooking = (e) => {
    const nextId = e.target.value
    setSelectedBooking(nextId)
    setStore(loadCustomerStore())
  }

  const handleCopyOtp = () => {
    if (booking?.otp) {
      navigator.clipboard?.writeText(booking.otp)
      setCopiedOtp(true)
      setTimeout(() => setCopiedOtp(false), 2000)
    }
  }

  const handleShareTrackingLink = () => {
    const link = window.location.href
    navigator.clipboard?.writeText(link)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2500)
  }

  const handleAdvanceSimulation = () => {
    if (!booking) return
    const updated = advanceBookingStage(booking.id)
    setStore(updated)
    setStatusNotice(`Stage updated: ${STAGES[Math.min(currentStageIndex + 1, 5)].title}`)
    setTimeout(() => setStatusNotice(null), 3500)
  }

  const handleConfirmCancel = () => {
    if (!booking) return
    const updated = cancelBooking(booking.id, cancelReason)
    setStore(updated)
    setCancelModalOpen(false)
    setStatusNotice(`Booking ${booking.id} cancelled. ₹${booking.amountNum || 380} refunded to your Wallet.`)
    setTimeout(() => setStatusNotice(null), 5000)
  }

  const handleConfirmReschedule = (e) => {
    e.preventDefault()
    if (!booking) return
    booking.date = rescheduleDate
    booking.time = rescheduleTime
    booking.status = 'Scheduled'
    booking.displayStatus = `Rescheduled for ${rescheduleDate}`
    setRescheduleModalOpen(false)
    setStatusNotice(`✓ Booking rescheduled to ${rescheduleDate} (${rescheduleTime})`)
    setTimeout(() => setStatusNotice(null), 4000)
  }

  const handleSaveNotes = () => {
    setEntryNotes(tempNotes)
    setIsEditingNotes(false)
    setStatusNotice('✓ Entry gate instructions updated for worker.')
    setTimeout(() => setStatusNotice(null), 3000)
  }

  if (!booking) {
    return (
      <CustomerLayout
        activePath="/customer/booking-details"
        session={session}
        onNavigate={onNavigate}
        onLogout={onLogout}
        title="Booking Details"
      >
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <h3>No Booking Found</h3>
          <button
            type="button"
            className="btn-primary-action"
            style={{ maxWidth: '240px', margin: '16px auto' }}
            onClick={() => onNavigate('/customer/bookings')}
          >
            Go to Bookings List
          </button>
        </div>
      </CustomerLayout>
    )
  }

  const isLive = booking.status === 'Real-Time' || booking.status === 'Active'
  const isCompleted = booking.status === 'Completed'
  const isCancelled = booking.status === 'Cancelled'

  return (
    <CustomerLayout
      activePath="/customer/booking-details"
      session={session}
      onNavigate={onNavigate}
      onLogout={onLogout}
      title={`Booking Details #${booking.id}`}
      eyebrow="Live Tracking & Order Status"
      subtitle={`${booking.service} • Assigned to ${booking.worker}`}
      headerActions={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Quick Booking Switcher */}
          <select
            value={booking.id}
            onChange={handleSelectDifferentBooking}
            style={{
              padding: '7px 12px',
              borderRadius: '999px',
              border: '1.5px solid var(--line, #d9d8cd)',
              fontSize: '12.5px',
              fontWeight: '700',
              background: '#ffffff',
              color: 'var(--ink, #16221d)',
              cursor: 'pointer'
            }}
            title="Switch between your customer bookings"
          >
            {store.bookings.map((b) => (
              <option key={b.id} value={b.id}>
                {b.id} — {b.worker} ({b.status})
              </option>
            ))}
          </select>

          <button
            type="button"
            className="btn-secondary-action"
            style={{ fontSize: '12px', padding: '7px 14px' }}
            onClick={handleShareTrackingLink}
          >
            {copiedLink ? '✓ Link Copied!' : '🔗 Share Live Link'}
          </button>

          <button
            type="button"
            className="btn-danger-action"
            style={{ fontSize: '12px', padding: '7px 12px' }}
            onClick={() => setSosModalOpen(true)}
            title="Emergency SOS assistance"
          >
            🛡️ SOS Help
          </button>
        </div>
      }
    >
      {/* ---------------- Live Notification Alert ---------------- */}
      {statusNotice && (
        <div
          style={{
            background: '#f0fff4',
            border: '1px solid #9ae6b4',
            color: '#22543d',
            padding: '12px 18px',
            borderRadius: '12px',
            marginBottom: '20px',
            fontSize: '13.5px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <span>{statusNotice}</span>
          <button
            type="button"
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: '700' }}
            onClick={() => setStatusNotice(null)}
          >
            ✕
          </button>
        </div>
      )}

      {/* ---------------- 1. Hero Status Card ---------------- */}
      <div className="booking-hero-card">
        <div className="hero-left">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <span className="eyebrow" style={{ fontSize: '11px', color: 'var(--orange, #e97447)' }}>
              {booking.category || 'HOME SERVICE'} • ORDER #{booking.id}
            </span>
          </div>

          <h2>{booking.service}</h2>

          <div className="hero-meta-subtitle">
            <span>👤 Assigned Pro: <strong>{booking.worker}</strong> ({booking.workerRole})</span>
            <span>•</span>
            <span>⭐ <strong>{booking.workerRating}</strong> rating</span>
            <span>•</span>
            <span>📍 Meerut City</span>
          </div>

          <p style={{ margin: '8px 0 0', fontSize: '13px', color: '#4a5568', lineHeight: 1.45 }}>
            {booking.description}
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
          <div className={`booking-status-badge ${isLive ? 'status-enroute' : ''}`}>
            {isLive && <span className="live-pulse-dot" />}
            <span>{booking.displayStatus || booking.status}</span>
          </div>

          {!isCompleted && !isCancelled && booking.otp && (
            <div
              style={{
                background: '#fffdf8',
                border: '1.5px dashed var(--orange, #e97447)',
                borderRadius: '12px',
                padding: '6px 14px',
                textAlign: 'right'
              }}
            >
              <span style={{ fontSize: '10.5px', fontWeight: '800', color: 'var(--muted, #68736d)', textTransform: 'uppercase', display: 'block' }}>
                DOORSTEP OTP
              </span>
              <strong style={{ fontSize: '18px', color: 'var(--orange, #e97447)', fontFamily: 'monospace', letterSpacing: '0.15em' }}>
                {booking.otp}
              </strong>
            </div>
          )}
        </div>
      </div>

      {/* ---------------- 2. Quick Highlight Metrics Matrix ---------------- */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}
      >
        <div className="booking-panel-box" style={{ padding: '16px 20px' }}>
          <span className="panel-kicker-tag">ARRIVAL ETA</span>
          <strong style={{ fontSize: '20px', color: 'var(--ink, #16221d)', display: 'block', margin: '4px 0 2px' }}>
            {booking.eta}
          </strong>
          <small style={{ color: 'var(--muted, #68736d)', fontSize: '12px' }}>
            Distance: {booking.distance}
          </small>
        </div>

        <div className="booking-panel-box" style={{ padding: '16px 20px' }}>
          <span className="panel-kicker-tag">SCHEDULED SLOT</span>
          <strong style={{ fontSize: '18px', color: 'var(--ink, #16221d)', display: 'block', margin: '4px 0 2px' }}>
            {booking.time}
          </strong>
          <small style={{ color: 'var(--muted, #68736d)', fontSize: '12px' }}>
            {booking.date}
          </small>
        </div>

        <div className="booking-panel-box" style={{ padding: '16px 20px', background: '#fff9f5' }}>
          <span className="panel-kicker-tag">SECURITY CODE</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '4px 0 2px' }}>
            <strong style={{ fontSize: '20px', color: 'var(--orange, #e97447)', fontFamily: 'monospace', letterSpacing: '0.12em' }}>
              {booking.otp || '4829'}
            </strong>
            <button
              type="button"
              className="copy-otp-btn"
              style={{ fontSize: '11px', padding: '3px 8px' }}
              onClick={handleCopyOtp}
            >
              {copiedOtp ? '✓' : 'Copy'}
            </button>
          </div>
          <small style={{ color: '#c04318', fontSize: '11.5px' }}>
            Share only after worker arrives
          </small>
        </div>

        <div className="booking-panel-box" style={{ padding: '16px 20px' }}>
          <span className="panel-kicker-tag">FARE ESTIMATE</span>
          <strong style={{ fontSize: '20px', color: 'var(--ink, #16221d)', display: 'block', margin: '4px 0 2px' }}>
            {booking.amount}
          </strong>
          <small style={{ color: '#2a7c3d', fontSize: '12px', fontWeight: '700' }}>
            ✓ {booking.paymentStatus || 'Wallet Pre-authorized'}
          </small>
        </div>
      </div>

      {/* ---------------- 3. Main 2-Column Layout ---------------- */}
      <div className="booking-layout-grid">
        {/* ==================== LEFT COLUMN ==================== */}
        <div className="booking-column-main">
          {/* Live GPS Route Visualizer (for Real-Time / Active) */}
          <div className="booking-panel-box">
            <div className="panel-header-title">
              <div>
                <span className="panel-kicker-tag">LIVE GPS TELEMATICS</span>
                <h3>Route & Technician Tracking</h3>
              </div>
              <span style={{ fontSize: '12px', color: '#2a7c3d', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <span className="live-pulse-dot" /> Live Satellite Sync
              </span>
            </div>

            {/* Real Google Maps Embed */}
            <MapEmbed
              workerName={booking.worker || 'Technician'}
              workerDistance={booking.distance || '1.8 km'}
              workerEta={booking.eta || '~14 mins'}
              workerArea="Shastri Nagar"
              customerLocation="Your Home"
              height={280}
              showRoute={true}
              compact={false}
            />
          </div>

          {/* Stepper Timeline Panel */}
          <div className="booking-panel-box">
            <div className="panel-header-title">
              <div>
                <span className="panel-kicker-tag">STAGE-BY-STAGE PROGRESS</span>
                <h3>Job Progression Stepper</h3>
              </div>

              {/* Stage Advance Interactive Demo Controller */}
              {!isCompleted && !isCancelled && currentStageIndex < 5 && (
                <button
                  type="button"
                  className="btn-secondary-action"
                  style={{ fontSize: '12px', borderColor: 'var(--orange, #e97447)', color: 'var(--orange, #e97447)', background: '#fff9f5' }}
                  onClick={handleAdvanceSimulation}
                  title="Click to simulate technician moving to next stage"
                >
                  ⚡ Advance to Next Stage →
                </button>
              )}
            </div>

            {/* Stepper List */}
            <div className="stepper-timeline">
              {STAGES.map((stage, idx) => {
                const isDone = idx < currentStageIndex
                const isCurrent = idx === currentStageIndex

                return (
                  <div
                    key={stage.title}
                    className={`stepper-row ${isDone ? 'completed' : ''}`}
                  >
                    <div className="stepper-line" />
                    <div
                      className={`stepper-icon-node ${isDone ? 'node-completed' : isCurrent ? 'node-active' : 'node-pending'}`}
                    >
                      {isDone ? '✓' : isCurrent ? stage.icon : idx + 1}
                    </div>

                    <div className="stepper-text">
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                        <strong style={{ color: isCurrent ? 'var(--orange, #e97447)' : 'var(--ink, #16221d)' }}>
                          {stage.title}
                        </strong>
                        <time style={{ fontSize: '11px', fontWeight: '700', color: isCurrent ? 'var(--orange, #e97447)' : 'var(--muted, #68736d)' }}>
                          {isCurrent ? '● Active Now' : stage.time}
                        </time>
                      </div>
                      <small>{stage.desc}</small>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Doorstep Location & Gate Entry Instructions */}
          <div className="booking-panel-box">
            <div className="panel-header-title">
              <div>
                <span className="panel-kicker-tag">DESTINATION & ENTRY ACCESS</span>
                <h3>Doorstep Service Address</h3>
              </div>
              <button
                type="button"
                className="btn-secondary-action"
                style={{ fontSize: '12px', padding: '4px 10px' }}
                onClick={() => {
                  setTempNotes(entryNotes)
                  setIsEditingNotes(!isEditingNotes)
                }}
              >
                {isEditingNotes ? 'Cancel' : '✎ Edit Gate Notes'}
              </button>
            </div>

            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', marginBottom: '14px' }}>
              <span style={{ fontSize: '24px' }}>📍</span>
              <div>
                <strong style={{ fontSize: '15px', color: 'var(--ink, #16221d)', display: 'block' }}>
                  {booking.location}
                </strong>
                <span style={{ color: 'var(--muted, #68736d)', fontSize: '13px' }}>
                  Landmark: {booking.landmark || 'Near Central Park & SBI Bank'} • Meerut, UP
                </span>
              </div>
            </div>

            {/* Entry Notes Box */}
            <div
              style={{
                background: '#faf8f3',
                border: '1px solid var(--line, #d9d8cd)',
                borderRadius: '12px',
                padding: '12px 16px'
              }}
            >
              <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--muted, #68736d)', display: 'block', marginBottom: '4px' }}>
                Colony Gate & Access Notes for Worker:
              </span>

              {isEditingNotes ? (
                <div>
                  <textarea
                    rows={2}
                    value={tempNotes}
                    onChange={(e) => setTempNotes(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--line, #d9d8cd)',
                      fontSize: '13px',
                      marginBottom: '8px'
                    }}
                  />
                  <button
                    type="button"
                    className="btn-primary-action"
                    style={{ fontSize: '12px', padding: '6px 14px' }}
                    onClick={handleSaveNotes}
                  >
                    Save Notes
                  </button>
                </div>
              ) : (
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink, #16221d)', fontStyle: 'italic' }}>
                  "{entryNotes}"
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ==================== RIGHT COLUMN ==================== */}
        <div className="booking-column-side">
          {/* Worker Contact & Verification Card */}
          <div className="booking-panel-box assigned-worker-card">
            <div className="worker-avatar-large">
              {booking.worker.split(' ').map((n) => n[0]).slice(0, 2).join('')}
              <span className="worker-online-indicator" />
            </div>

            <h4>{booking.worker}</h4>
            <p className="worker-trade-title">{booking.workerRole || 'Senior Licensed Tradesperson'}</p>

            <div className="worker-badges-row">
              <span className="badge-verified-worker">✓ Aadhaar Verified</span>
              <span className="badge-rating-worker">⭐ {booking.workerRating} ({booking.workerJobs} jobs)</span>
            </div>

            {/* Worker Tools Checklist */}
            <div
              style={{
                background: '#faf8f3',
                border: '1px solid var(--line, #d9d8cd)',
                borderRadius: '12px',
                padding: '10px 14px',
                fontSize: '12px',
                color: '#4a5568',
                textAlign: 'left',
                marginBottom: '18px'
              }}
            >
              <strong style={{ display: 'block', marginBottom: '4px', color: 'var(--ink, #16221d)' }}>
                Equipment Carried:
              </strong>
              <span>✓ Safety Gloves & Insulated Tool Set</span><br />
              <span>✓ Professional Diagnostic Multi-meter</span><br />
              <span>✓ Standard Replacement Spares</span>
            </div>

            {/* Call & Chat Action Buttons */}
            <div className="worker-actions-grid">
              <button
                type="button"
                className="btn-worker-call"
                onClick={() => setCallModalOpen(true)}
              >
                📞 Call (Masked)
              </button>

              <button
                type="button"
                className="btn-worker-chat"
                onClick={() => onNavigate('/customer/messages')}
              >
                💬 Chat on App
              </button>
            </div>
          </div>

          {/* Security OTP Box (Big Display) */}
          {!isCancelled && !isCompleted && (
            <div className="security-otp-box">
              <h4>Doorstep Verification Code</h4>
              <p>Share this 4-digit code only after worker arrives at your door.</p>

              <div className="otp-digit-display">
                {booking.otp || '4829'}
              </div>

              <div>
                <button
                  type="button"
                  className="btn-secondary-action"
                  style={{ fontSize: '12px', padding: '6px 14px' }}
                  onClick={handleCopyOtp}
                >
                  {copiedOtp ? '✓ Code Copied' : '📋 Copy OTP'}
                </button>
              </div>
            </div>
          )}

          {/* Transparent Itemized Price Receipt */}
          <div className="booking-panel-box">
            <div className="panel-header-title">
              <div>
                <span className="panel-kicker-tag">TRANSPARENT BILL</span>
                <h3>Itemized Fare Breakdown</h3>
              </div>
            </div>

            <div className="price-breakdown-table">
              <div className="price-row">
                <span>Base Inspection & Labor</span>
                <strong>₹{booking.pricing?.baseFare || 250}</strong>
              </div>
              <div className="price-row">
                <span>Consumables & Parts Fitted</span>
                <strong>₹{booking.pricing?.spareParts || 130}</strong>
              </div>
              <div className="price-row">
                <span>Platform Convenience Fee</span>
                <span style={{ color: '#2a7c3d', fontWeight: '700' }}>FREE (₹0)</span>
              </div>
              <div className="price-row">
                <span>Safety & Tool Sanitization</span>
                <span style={{ color: '#2a7c3d', fontWeight: '700' }}>Included</span>
              </div>
              <div className="price-row">
                <span>GST / Taxes</span>
                <span>Included</span>
              </div>

              <div className="price-row total-row">
                <span>Total Amount</span>
                <span style={{ color: 'var(--orange, #e97447)' }}>{booking.amount}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px' }}>
              <span className="payment-status-tag">
                💳 {booking.paymentStatus || 'Paid via Mazdoor Wallet'}
              </span>

              <button
                type="button"
                className="btn-secondary-action"
                style={{ fontSize: '11px', padding: '4px 10px' }}
                onClick={() => setInvoiceModalOpen(true)}
              >
                View Invoice ↗
              </button>
            </div>
          </div>

          {/* Guarantee & Safety Shield Card */}
          <div
            style={{
              background: '#f0fff4',
              border: '1px solid #c6f6d5',
              borderRadius: '16px',
              padding: '16px',
              display: 'flex',
              gap: '12px',
              alignItems: 'center'
            }}
          >
            <span style={{ fontSize: '24px' }}>🛡️</span>
            <div>
              <strong style={{ fontSize: '13px', color: '#22543d', display: 'block' }}>
                ₹10,000 Mazdoor Sytu Cover
              </strong>
              <small style={{ color: '#276749', fontSize: '11.5px', lineHeight: 1.35, display: 'block' }}>
                All service appointments are backed by 30-day rework warranty & damage protection guarantee.
              </small>
            </div>
          </div>

          {/* Action Links (Reschedule / Cancel) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {!isCompleted && !isCancelled && (
              <>
                <button
                  type="button"
                  className="btn-secondary-action"
                  style={{ width: '100%', padding: '10px' }}
                  onClick={() => setRescheduleModalOpen(true)}
                >
                  📅 Reschedule Appointment
                </button>

                <button
                  type="button"
                  className="btn-danger-action"
                  style={{ width: '100%', padding: '10px', textAlign: 'center' }}
                  onClick={() => setCancelModalOpen(true)}
                >
                  Cancel Booking (100% Refund)
                </button>
              </>
            )}

            {isCompleted && !booking.rated && (
              <button
                type="button"
                className="btn-primary-action"
                style={{ width: '100%', padding: '12px' }}
                onClick={() => onNavigate('/customer/reviews')}
              >
                ★ Rate & Review Worker
              </button>
            )}

            <button
              type="button"
              className="btn-secondary-action"
              style={{ width: '100%', padding: '10px', fontSize: '12.5px' }}
              onClick={() => onNavigate('/customer/support')}
            >
              Need Support or File Dispute? ↗
            </button>
          </div>
        </div>
      </div>

      {/* ====================================================================
          MODALS
          ==================================================================== */}

      {/* ---------------- 1. Masked Calling Modal ---------------- */}
      {callModalOpen && (
        <div className="portal-modal-backdrop">
          <div className="portal-modal-card" style={{ maxWidth: '440px' }}>
            <div className="portal-modal-header">
              <h3>Private Masked Call</h3>
              <button
                type="button"
                className="portal-modal-close"
                onClick={() => setCallModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="portal-modal-body" style={{ textAlign: 'center' }}>
              <div
                className="customer-avatar"
                style={{
                  width: '68px',
                  height: '68px',
                  fontSize: '24px',
                  margin: '0 auto 12px',
                  background: 'var(--ink, #16221d)'
                }}
              >
                {booking.worker.split(' ').map((n) => n[0]).slice(0, 2).join('')}
              </div>

              <h4 style={{ margin: '0 0 4px', fontSize: '18px' }}>Calling {booking.worker}</h4>
              <p style={{ margin: '0 0 16px', color: 'var(--muted, #68736d)', fontSize: '13px' }}>
                Your private phone number is completely masked via Mazdoor Sytu Cloud Telephony.
              </p>

              <div
                style={{
                  background: '#faf8f3',
                  border: '1px solid var(--line, #d9d8cd)',
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'inline-block',
                  margin: '0 auto'
                }}
              >
                <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--muted, #68736d)' }}>
                  Virtual Telephony Bridge
                </div>
                <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--ink, #16221d)', letterSpacing: '0.05em' }}>
                  +91 11-4084-2910
                </div>
                <small style={{ color: '#2a7c3d', fontWeight: '700' }}>● Connecting in progress...</small>
              </div>
            </div>

            <div className="portal-modal-footer">
              <button
                type="button"
                className="btn-danger-action"
                style={{ width: '100%', padding: '10px' }}
                onClick={() => setCallModalOpen(false)}
              >
                End Call
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- 2. Reschedule Appointment Modal ---------------- */}
      {rescheduleModalOpen && (
        <div className="portal-modal-backdrop">
          <div className="portal-modal-card">
            <div className="portal-modal-header">
              <h3>Reschedule Appointment #{booking.id}</h3>
              <button
                type="button"
                className="portal-modal-close"
                onClick={() => setRescheduleModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmReschedule}>
              <div className="portal-modal-body">
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted, #68736d)' }}>
                  Choose a preferred new date and time slot for <strong>{booking.service}</strong> with{' '}
                  <strong>{booking.worker}</strong>:
                </p>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '6px' }}>
                    Select New Date:
                  </label>
                  <select
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '10px',
                      border: '1px solid var(--line, #d9d8cd)',
                      fontSize: '13px'
                    }}
                  >
                    <option>Tomorrow, 24 Sep</option>
                    <option>Day After Tomorrow, 25 Sep</option>
                    <option>Saturday, 26 Sep</option>
                    <option>Sunday, 27 Sep</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '6px' }}>
                    Select New Time Slot:
                  </label>
                  <select
                    value={rescheduleTime}
                    onChange={(e) => setRescheduleTime(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '10px',
                      border: '1px solid var(--line, #d9d8cd)',
                      fontSize: '13px'
                    }}
                  >
                    <option>Morning (9:00 AM – 12:00 PM)</option>
                    <option>Afternoon (12:00 PM – 3:00 PM)</option>
                    <option>Evening (3:00 PM – 6:00 PM)</option>
                  </select>
                </div>

                <div
                  style={{
                    background: '#f0fff4',
                    border: '1px solid #c6f6d5',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    fontSize: '12.5px',
                    color: '#22543d'
                  }}
                >
                  ✓ Free rescheduling with zero deduction.
                </div>
              </div>

              <div className="portal-modal-footer">
                <button
                  type="button"
                  className="btn-secondary-action"
                  onClick={() => setRescheduleModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary-action">
                  Confirm Reschedule ↗
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------- 3. Cancellation & Refund Modal ---------------- */}
      {cancelModalOpen && (
        <div className="portal-modal-backdrop">
          <div className="portal-modal-card">
            <div className="portal-modal-header">
              <h3>Cancel Booking {booking.id}</h3>
              <button
                type="button"
                className="portal-modal-close"
                onClick={() => setCancelModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="portal-modal-body">
              <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--muted, #68736d)' }}>
                Are you sure you want to cancel your booking for <strong>{booking.service}</strong>?
              </p>

              <div style={{ background: '#f0fff4', border: '1px solid #c6f6d5', padding: '12px', borderRadius: '10px' }}>
                <strong style={{ color: '#22543d', display: 'block', fontSize: '13.5px' }}>
                  ✓ 100% Instant Refund to Mazdoor Wallet
                </strong>
                <span style={{ fontSize: '12.5px', color: '#276749' }}>
                  ₹{booking.amountNum || 380} will be immediately refunded to your Mazdoor Wallet balance.
                </span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '6px' }}>
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
                  <option>Personal schedule conflict / need reschedule</option>
                  <option>Worker took too long to arrive</option>
                  <option>Booked by mistake</option>
                  <option>Issue resolved by myself</option>
                </select>
              </div>
            </div>

            <div className="portal-modal-footer">
              <button
                type="button"
                className="btn-secondary-action"
                onClick={() => setCancelModalOpen(false)}
              >
                Keep Booking
              </button>
              <button
                type="button"
                className="btn-danger-action"
                onClick={handleConfirmCancel}
              >
                Confirm & Refund ₹{booking.amountNum || 380}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- 4. Tax Invoice Modal ---------------- */}
      {invoiceModalOpen && (
        <div className="portal-modal-backdrop">
          <div className="portal-modal-card">
            <div className="portal-modal-header">
              <h3>Tax Invoice #{booking.id}</h3>
              <button
                type="button"
                className="portal-modal-close"
                onClick={() => setInvoiceModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="portal-modal-body">
              <div style={{ textAlign: 'center', padding: '10px 0' }}>
                <img src="/official-logo.png" alt="Mazdoor Sytu" style={{ width: '42px', height: '42px' }} />
                <h4 style={{ margin: '8px 0 2px', fontSize: '16px' }}>Mazdoor Sytu Technologies Pvt. Ltd.</h4>
                <small style={{ color: 'var(--muted, #68736d)' }}>GSTIN: 09AAECM1234F1Z8 • Meerut, UP</small>
              </div>

              <div
                style={{
                  background: '#faf8f3',
                  border: '1px solid var(--line, #d9d8cd)',
                  borderRadius: '12px',
                  padding: '14px',
                  fontSize: '12.5px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Invoice Number:</span>
                  <strong>INV-{booking.id}-2026</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Customer Name:</span>
                  <strong>{session?.name || store.profile?.name || 'Riya Kapoor'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Service:</span>
                  <strong>{booking.service}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Technician:</span>
                  <strong>{booking.worker} ({booking.workerRole})</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Payment Mode:</span>
                  <strong>{booking.paymentStatus || 'Mazdoor Wallet'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed var(--line, #d9d8cd)', paddingTop: '6px', marginTop: '4px' }}>
                  <strong style={{ fontSize: '14px' }}>Total Amount Paid:</strong>
                  <strong style={{ fontSize: '14px', color: 'var(--orange, #e97447)' }}>{booking.amount}</strong>
                </div>
              </div>
            </div>

            <div className="portal-modal-footer">
              <button
                type="button"
                className="btn-secondary-action"
                onClick={() => alert('Invoice downloaded as PDF!')}
              >
                📥 Download PDF
              </button>
              <button
                type="button"
                className="btn-primary-action"
                onClick={() => setInvoiceModalOpen(false)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- 5. Emergency SOS Modal ---------------- */}
      {sosModalOpen && (
        <div className="portal-modal-backdrop">
          <div className="portal-modal-card">
            <div className="portal-modal-header" style={{ background: '#fff5f5' }}>
              <h3 style={{ color: '#c53030' }}>🛡️ Emergency SOS & Safety Response</h3>
              <button
                type="button"
                className="portal-modal-close"
                onClick={() => setSosModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="portal-modal-body">
              <p style={{ margin: 0, fontSize: '13px', color: '#4a5568' }}>
                If you feel unsafe or require instant on-ground intervention during this visit:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <a
                  href="tel:112"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 18px',
                    background: '#fff5f5',
                    border: '1px solid #fed7d7',
                    borderRadius: '12px',
                    color: '#c53030',
                    textDecoration: 'none',
                    fontWeight: '700',
                    fontSize: '14px'
                  }}
                >
                  <span>🚨 Call Police Emergency (112)</span>
                  <span>Dial ↗</span>
                </a>

                <a
                  href="tel:180020267388"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 18px',
                    background: '#ebf8ff',
                    border: '1px solid #bee3f8',
                    borderRadius: '12px',
                    color: '#2b6cb0',
                    textDecoration: 'none',
                    fontWeight: '700',
                    fontSize: '14px'
                  }}
                >
                  <span>🛡️ 24×7 Mazdoor Sytu Incident Helpline</span>
                  <span>Dial ↗</span>
                </a>
              </div>

              <div style={{ fontSize: '12px', color: 'var(--muted, #68736d)', lineHeight: 1.45 }}>
                Your live booking location (<strong>{booking.location}</strong>) and technician profile (<strong>{booking.worker}</strong>) are logged on secure platform servers.
              </div>
            </div>

            <div className="portal-modal-footer">
              <button
                type="button"
                className="btn-secondary-action"
                onClick={() => setSosModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </CustomerLayout>
  )
}
