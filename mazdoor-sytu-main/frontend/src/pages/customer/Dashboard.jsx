import { useState, useEffect } from 'react'
import CustomerLayout from './CustomerLayout'
import { loadCustomerStore, setSelectedBooking } from '../../data/customerStore'
import './Dashboard.css'

export default function Dashboard({ session, onNavigate, onLogout }) {
  const [store, setStore] = useState(() => loadCustomerStore())

  useEffect(() => {
    setStore(loadCustomerStore())
  }, [])

  const customerName = session?.name || store.profile?.name || 'Riya Kapoor'
  const firstName = customerName.split(' ')[0]

  const getGreeting = () => {
    const hr = new Date().getHours()
    if (hr < 12) return 'Good morning'
    if (hr < 17) return 'Good afternoon'
    return 'Good evening'
  }

  // Live metrics calculated from store
  const activeBookings = store.bookings.filter(
    (b) => b.status === 'Real-Time' || b.status === 'Active' || b.status === 'Confirmed' || b.status === 'Scheduled'
  )
  const completedBookings = store.bookings.filter((b) => b.status === 'Completed')
  const realTimeBooking = store.bookings.find((b) => b.status === 'Real-Time' || b.status === 'Active')

  const metricsData = [
    {
      label: 'Active Bookings',
      value: String(activeBookings.length).padStart(2, '0'),
      note: `${realTimeBooking ? '1 live in progress' : 'Scheduled & confirmed'}`,
      icon: '⚡',
      iconClass: 'icon-orange'
    },
    {
      label: 'Wallet Balance',
      value: `₹${store.wallet?.balance?.toLocaleString() || '2,850'}`,
      note: 'Available instant spend',
      icon: '💳',
      iconClass: 'icon-green',
      isPositive: true
    },
    {
      label: 'Completed Jobs',
      value: String(completedBookings.length).padStart(2, '0'),
      note: 'All verified satisfaction',
      icon: '✓',
      iconClass: 'icon-purple'
    },
    {
      label: 'Verified Pros Nearby',
      value: String(store.workers?.length || 8),
      note: 'Across 6 trade skills',
      icon: '⭐',
      iconClass: 'icon-blue'
    }
  ]

  // Interactive Checklist
  const [checklist, setChecklist] = useState([
    { id: 1, text: 'Confirm arrival timing with your active technician', done: true },
    { id: 2, text: 'Keep electrical / service workspace clear for inspection', done: true },
    { id: 3, text: 'Verify worker ID and uniform before sharing work area', done: false },
    { id: 4, text: 'Release 4-digit OTP only after service completion & satisfaction', done: false }
  ])

  const toggleCheckItem = (id) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    )
  }

  const handleOpenBooking = (bookingId) => {
    setSelectedBooking(bookingId)
    onNavigate('/customer/booking-details')
  }

  return (
    <CustomerLayout
      activePath="/customer/dashboard"
      session={session}
      onNavigate={onNavigate}
      onLogout={onLogout}
      title="Dashboard"
      eyebrow="Customer Portal"
      subtitle="Overview of your home services, active workers and real-time updates"
      headerActions={
        <button
          type="button"
          className="btn-primary-action"
          style={{ flex: 'none', padding: '8px 16px' }}
          onClick={() => onNavigate('/customer/search-workers')}
        >
          <span>⌕ Find Workers</span>
        </button>
      }
    >
      {/* ---------------- 1. Welcome / Live Hero Banner ---------------- */}
      <div className="customer-welcome-banner">
        <div>
          <div className="banner-date-badge">
            <span className="live-dot" /> Verified Customer Portal • Monday, 23 Sep 2026
          </div>
          <h2>{getGreeting()}, {firstName}.</h2>
          <p>
            {realTimeBooking
              ? `Technician ${realTimeBooking.worker} (${realTimeBooking.category}) is ${realTimeBooking.displayStatus.toLowerCase()}. Expected in ${realTimeBooking.eta}.`
              : 'Your local service requests, active workers and payments are synchronized. Find skilled tradespeople nearby with upfront pricing.'}
          </p>
        </div>

        {realTimeBooking ? (
          <button
            className="btn-banner-action"
            type="button"
            onClick={() => handleOpenBooking(realTimeBooking.id)}
          >
            <span>Track Live Worker</span>
            <span>↗</span>
          </button>
        ) : (
          <button
            className="btn-banner-action"
            type="button"
            onClick={() => onNavigate('/customer/search-workers')}
          >
            <span>Book a Worker</span>
            <span>↗</span>
          </button>
        )}
      </div>

      {/* ---------------- 2. Metrics Grid ---------------- */}
      <div className="customer-stats-matrix">
        {metricsData.map((item) => (
          <article className="customer-stat-box" key={item.label}>
            <div className="stat-box-top">
              <span className="stat-box-label">{item.label}</span>
              <span className={`stat-box-icon ${item.iconClass}`}>{item.icon}</span>
            </div>
            <strong className="stat-box-number">{item.value}</strong>
            <span className={`stat-box-note ${item.isPositive ? 'note-positive' : ''}`}>
              {item.note}
            </span>
          </article>
        ))}
      </div>

      {/* ---------------- 3. Middle Section: Active Bookings & Quick Actions ---------------- */}
      <div className="customer-middle-layout">
        {/* Active & Scheduled Bookings */}
        <section className="customer-card-panel">
          <div className="panel-head-row">
            <div>
              <span className="panel-kicker">LIVE & UPCOMING</span>
              <h3>Bookings in motion</h3>
            </div>
            <button
              type="button"
              className="panel-view-link"
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              onClick={() => onNavigate('/customer/bookings')}
            >
              View all ({store.bookings.length}) →
            </button>
          </div>

          <div className="customer-booking-list">
            {activeBookings.slice(0, 3).map((item) => (
              <article
                className="customer-booking-row"
                key={item.id}
                onClick={() => handleOpenBooking(item.id)}
                style={{ cursor: 'pointer' }}
              >
                <div className="booking-service-badge">
                  {item.category ? item.category.slice(0, 2).toUpperCase() : 'SR'}
                </div>

                <div className="booking-info-block">
                  <strong>{item.service}</strong>
                  <p>
                    {item.worker} ({item.category}) • <strong>{item.amount}</strong>
                  </p>
                  <small className="booking-time-tag">
                    🕒 {item.date} • {item.time}
                  </small>
                </div>

                <div className="booking-status-col">
                  <span className={`status-pill ${item.status.toLowerCase()}`}>
                    {item.status === 'Real-Time' && <span className="pulse-dot" />}
                    {item.displayStatus || item.status}
                  </span>
                  <small className="booking-eta-text">{item.eta}</small>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Quick Actions Panel */}
        <section className="customer-card-panel">
          <div className="panel-head-row">
            <div>
              <span className="panel-kicker">SHORTCUTS</span>
              <h3>Quick actions</h3>
            </div>
          </div>

          <div className="customer-actions-grid">
            <button
              className="customer-action-card"
              type="button"
              onClick={() => onNavigate('/customer/search-workers')}
            >
              <span className="action-card-icon">🔍</span>
              <div>
                <strong>Find & Book Workers</strong>
                <p>Electricians, Plumbers, Carpenters & more</p>
              </div>
            </button>

            <button
              className="customer-action-card"
              type="button"
              onClick={() => onNavigate('/customer/bookings')}
            >
              <span className="action-card-icon">📋</span>
              <div>
                <strong>Track All Bookings</strong>
                <p>Real-time, Scheduled & Completed jobs</p>
              </div>
            </button>

            <button
              className="customer-action-card"
              type="button"
              onClick={() => onNavigate('/customer/messages')}
            >
              <span className="action-card-icon">💬</span>
              <div>
                <strong>Direct Chat with Workers</strong>
                <p>Coordinate timing & location details</p>
              </div>
            </button>

            <button
              className="customer-action-card"
              type="button"
              onClick={() => onNavigate('/customer/wallet')}
            >
              <span className="action-card-icon">💳</span>
              <div>
                <strong>Add Money to Wallet</strong>
                <p>Instant UPI top-up with zero convenience fee</p>
              </div>
            </button>
          </div>
        </section>
      </div>

      {/* ---------------- 4. Bottom Section: Recommended Workers & Safety Checklist ---------------- */}
      <div className="customer-bottom-layout">
        {/* Recommended Verified Workers */}
        <section className="customer-card-panel">
          <div className="panel-head-row">
            <div>
              <span className="panel-kicker">VERIFIED WORKFORCE</span>
              <h3>Available nearby in Meerut</h3>
            </div>
            <button
              type="button"
              className="panel-view-link"
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              onClick={() => onNavigate('/customer/search-workers')}
            >
              Browse all →
            </button>
          </div>

          <div className="customer-workers-grid">
            {store.workers.slice(0, 3).map((wkr) => (
              <article className="worker-compact-card" key={wkr.id}>
                <div className="worker-compact-header">
                  <div className="worker-avatar-small">
                    {wkr.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                  </div>
                  <div className="worker-name-group">
                    <strong>{wkr.name}</strong>
                    <span className="worker-trade-tag">{wkr.service}</span>
                  </div>
                  <span className="badge-available">{wkr.badge}</span>
                </div>

                <div className="worker-compact-meta">
                  <span>⭐ {wkr.rating} ({wkr.reviewsCount} jobs)</span>
                  <span>📍 {wkr.distance}</span>
                </div>

                <div className="worker-pricing-row">
                  <span className="worker-rate-text">{wkr.price}</span>
                  <button
                    type="button"
                    className="btn-book-small"
                    onClick={() => onNavigate('/customer/search-workers')}
                  >
                    Book Now →
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Doorstep Safety Checklist */}
        <section className="customer-card-panel">
          <div className="panel-head-row">
            <div>
              <span className="panel-kicker">SAFETY PROTOCOLS</span>
              <h3>Doorstep service checklist</h3>
            </div>
          </div>

          <div className="checklist-container">
            {checklist.map((item) => (
              <label
                key={item.id}
                className={`checklist-item ${item.done ? 'item-checked' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={item.done}
                  onChange={() => toggleCheckItem(item.id)}
                />
                <span className="custom-checkbox-marker" />
                <span className="checklist-text">{item.text}</span>
              </label>
            ))}
          </div>

          <div className="checklist-footer-note">
            🛡️ All jobs covered by <strong>₹10,000 Mazdoor Sytu Damage Guarantee</strong>
          </div>
        </section>
      </div>
    </CustomerLayout>
  )
}
