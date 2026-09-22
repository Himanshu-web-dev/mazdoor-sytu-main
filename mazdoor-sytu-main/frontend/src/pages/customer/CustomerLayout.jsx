import { useState, useEffect } from 'react'
import { loadCustomerStore } from '../../data/customerStore'
import './CustomerPortal.css'

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/customer/dashboard', id: 'dashboard' },
  { label: 'Find Workers', path: '/customer/search-workers', id: 'search-workers' },
  { label: 'Bookings', path: '/customer/bookings', id: 'bookings' },
  { label: 'Booking Details', path: '/customer/booking-details', id: 'booking-details' },
  { label: 'Messages', path: '/customer/messages', id: 'messages' },
  { label: 'Wallet / Payments', path: '/customer/wallet', id: 'wallet' },
  { label: 'Reviews', path: '/customer/reviews', id: 'reviews' },
  { label: 'Notifications', path: '/customer/notifications', id: 'notifications' },
  { label: 'Profile', path: '/customer/profile', id: 'profile' },
  { label: 'Support & Help', path: '/customer/support', id: 'support' },
]

export default function CustomerLayout({
  children,
  activePath,
  session,
  onNavigate,
  onLogout,
  title = 'Customer Portal',
  eyebrow = 'Customer Portal',
  subtitle = 'Manage your home services, active bookings and payments',
  headerActions = null
}) {
  const [store, setStore] = useState(() => loadCustomerStore())

  useEffect(() => {
    // Refresh counts on mount & storage events
    const refresh = () => setStore(loadCustomerStore())
    window.addEventListener('storage', refresh)
    return () => window.removeEventListener('storage', refresh)
  }, [])

  const customerName = session?.name || store.profile?.name || 'Riya Kapoor'
  const initials = customerName.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()

  // Calculate live badge counts
  const activeBookingsCount = store.bookings?.filter(
    (b) => b.status === 'Real-Time' || b.status === 'Active' || b.status === 'Confirmed'
  ).length || 0

  const unreadMessagesCount = store.messages?.conversations?.reduce(
    (acc, curr) => acc + (curr.unread || 0), 0
  ) || 0

  const unreadNotificationsCount = store.notifications?.filter(
    (n) => n.unread
  ).length || 0

  const pendingReviewsCount = store.bookings?.filter(
    (b) => b.status === 'Completed' && !b.rated
  ).length || 0

  const getBadgeForPath = (path) => {
    if (path === '/customer/bookings' && activeBookingsCount > 0) {
      return `${activeBookingsCount} active`
    }
    if (path === '/customer/messages' && unreadMessagesCount > 0) {
      return `${unreadMessagesCount} new`
    }
    if (path === '/customer/notifications' && unreadNotificationsCount > 0) {
      return `${unreadNotificationsCount}`
    }
    if (path === '/customer/reviews' && pendingReviewsCount > 0) {
      return `${pendingReviewsCount} to rate`
    }
    return null
  }

  return (
    <section className="customer-portal-shell">
      {/* ---------------- Sidebar Navigation ---------------- */}
      <aside className="customer-sidebar" aria-label="Customer portal navigation">
        <div className="customer-brand-block">
          <img className="customer-brand-logo" src="/official-logo.png" alt="Mazdoor Sytu logo" />
          <div className="customer-brand-text">
            <strong>Mazdoor Sytu</strong>
            <small>Customer Portal</small>
          </div>
        </div>

        <nav className="customer-nav-list">
          {NAV_ITEMS.map((item, index) => {
            const isActive = activePath === item.path
            const badge = getBadgeForPath(item.path)

            return (
              <a
                key={item.path}
                href={item.path}
                className={`customer-nav-item ${isActive ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault()
                  if (onNavigate) onNavigate(item.path)
                }}
              >
                <span className="nav-num">{String(index + 1).padStart(2, '0')}</span>
                <span>{item.label}</span>
                {badge && <span className="nav-badge-count">{badge}</span>}
              </a>
            )
          })}
        </nav>

        <div className="customer-sidebar-help">
          <span>Priority Helpdesk</span>
          <a
            href="/customer/support"
            onClick={(e) => {
              e.preventDefault()
              if (onNavigate) onNavigate('/customer/support')
            }}
          >
            24×7 Help & Support ↗
          </a>
        </div>
      </aside>

      {/* ---------------- Main Content Area ---------------- */}
      <main className="customer-portal-main">
        {/* Top Header */}
        <header className="customer-top-header">
          <div className="customer-header-title">
            <span className="eyebrow">{eyebrow}</span>
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </div>

          <div className="customer-top-actions">
            {headerActions}

            {/* Quick Wallet Pill */}
            <button
              type="button"
              className="customer-wallet-pill"
              onClick={() => onNavigate && onNavigate('/customer/wallet')}
              title="View wallet & payments"
            >
              <span>💳</span>
              <span>₹{store.wallet?.balance?.toLocaleString() || '2,850'}</span>
            </button>

            {/* User Profile Badge */}
            <div className="customer-user-badge">
              <span className="customer-avatar">{initials}</span>
              <div className="customer-user-meta">
                <strong>{customerName}</strong>
                <small>● Meerut NCR</small>
              </div>
              {onLogout && (
                <button
                  type="button"
                  className="customer-logout-btn"
                  onClick={onLogout}
                  title="Sign out of customer account"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        {children}
      </main>
    </section>
  )
}
