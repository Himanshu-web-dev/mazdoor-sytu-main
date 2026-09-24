import { useEffect, useState } from 'react'
import { getAdminStore } from '../../data/adminStore'
import './AdminPortal.css'

const NAV_ITEMS = [
  { label: 'Overview', path: '/admin/dashboard', icon: '📊' },
  { label: 'Customers', path: '/admin/users', icon: '👤' },
  { label: 'Workers', path: '/admin/workers', icon: '👷' },
  { label: 'Businesses', path: '/admin/businesses', icon: '🏢' },
  { label: 'Bookings', path: '/admin/bookings', icon: '📋' },
  { label: 'KYC Queue', path: '/admin/verification', icon: '🛡️', badgeKey: 'kyc' },
  { label: 'Disputes & Complaints', path: '/admin/complaints', icon: '⚖️', badgeKey: 'complaints' },
  { label: 'Reviews', path: '/admin/reviews', icon: '⭐' },
  { label: 'Payments', path: '/admin/payments', icon: '💳' },
  { label: 'Analytics', path: '/admin/analytics', icon: '📈' },
]

export default function AdminLayout({
  title = 'Operations Console',
  subtitle = 'Real-time overview of platform activity',
  currentPath = window.location.pathname,
  onNavigate,
  onLogout,
  children
}) {
  const [counts, setCounts] = useState({ kyc: 0, complaints: 0 })

  useEffect(() => {
    const updateCounts = () => {
      const store = getAdminStore()
      const pendingKyc = store.kycQueue.filter((k) => k.status === 'Pending').length
      const openComplaints = store.complaints.filter((c) => c.status === 'Open').length
      setCounts({ kyc: pendingKyc, complaints: openComplaints })
    }

    updateCounts()
    window.addEventListener('admin_store_updated', updateCounts)
    return () => window.removeEventListener('admin_store_updated', updateCounts)
  }, [])

  const handleNavClick = (e, path) => {
    e.preventDefault()
    if (onNavigate) {
      onNavigate(path)
    } else {
      window.history.pushState({}, '', path)
      window.dispatchEvent(new PopStateEvent('popstate'))
    }
  }

  return (
    <div className="admin-portal-wrapper">
      {/* ── Left Fixed Sidebar ── */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div className="admin-brand-cluster">
            <img className="admin-logo-img" src="/official-logo.png" alt="Mazdoor Sytu" />
            <div className="admin-brand-info">
              <strong>Mazdoor Sytu</strong>
              <small>Admin Console</small>
            </div>
          </div>
          <div className="admin-security-pill" title="Private Session Active">
            Live
          </div>
        </div>

        <div className="admin-nav-section">
          <span className="admin-nav-heading">Platform Governance</span>
          {NAV_ITEMS.map((item) => {
            const isActive = currentPath === item.path || (item.path === '/admin/dashboard' && currentPath === '/admin')
            let badge = null
            if (item.badgeKey === 'kyc' && counts.kyc > 0) {
              badge = <span className="admin-nav-count pending">{counts.kyc}</span>
            } else if (item.badgeKey === 'complaints' && counts.complaints > 0) {
              badge = <span className="admin-nav-count alert">{counts.complaints}</span>
            }

            return (
              <a
                key={item.path}
                href={item.path}
                className={`admin-nav-link ${isActive ? 'active' : ''}`}
                onClick={(e) => handleNavClick(e, item.path)}
              >
                <div className="admin-nav-link-left">
                  <span className="admin-nav-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {badge}
              </a>
            )
          })}
        </div>

        <div style={{ padding: '0 14px 12px' }}>
          <a
            href="/"
            onClick={(e) => handleNavClick(e, '/')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '8px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--admin-border)',
              borderRadius: '8px',
              color: '#94a3b8',
              fontSize: '0.78rem',
              fontWeight: 700,
              textDecoration: 'none',
              transition: 'all 0.15s ease'
            }}
          >
            🌐 Public Website ↗
          </a>
        </div>

        <div className="admin-sidebar-footer">
          <div className="admin-user-cell">
            <div className="admin-avatar">SA</div>
            <div className="admin-user-details">
              <strong>Super Admin</strong>
              <span>Security Level 1</span>
            </div>
          </div>
          <button
            type="button"
            className="admin-logout-btn"
            title="Terminate Admin Session"
            onClick={onLogout}
          >
            ⏻
          </button>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <main className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
          <div className="admin-topbar-actions">
            <div className="admin-live-pulse">
              <span className="admin-pulse-dot" />
              <span>Platform Live: 99.98% Uptime</span>
            </div>
          </div>
        </header>

        <div className="admin-content-canvas">
          {children}
        </div>
      </main>
    </div>
  )
}
