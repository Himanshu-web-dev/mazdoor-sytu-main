import { useState } from 'react'
import './WorkerPortal.css'

const NAV_ITEMS = [
  { label: 'Dashboard',        path: '/worker/dashboard',   icon: '🏠', id: 'dashboard' },
  { label: 'Jobs',             path: '/worker/jobs',        icon: '💼', id: 'jobs' },
  { label: 'Job Details',      path: '/worker/job-details', icon: '📋', id: 'job-details' },
  { label: 'Live Job',         path: '/worker/active-job',  icon: '⚡', id: 'active-job' },
  { label: 'Availability',     path: '/worker/availability',icon: '🟢', id: 'availability' },
  { label: 'Earnings',         path: '/worker/earnings',    icon: '💰', id: 'earnings' },
  { label: 'Wallet',           path: '/worker/wallet',      icon: '👛', id: 'wallet' },
  { label: 'Messages',         path: '/worker/messages',    icon: '💬', id: 'messages' },
  { label: 'Notifications',    path: '/worker/notifications',icon: '🔔', id: 'notifications' },
  { label: 'Reviews & Ratings',path: '/worker/reviews',     icon: '⭐', id: 'reviews' },
  { label: 'Profile',          path: '/worker/profile',     icon: '👤', id: 'profile' },
  { label: 'KYC & Documents',  path: '/worker/documents',   icon: '📄', id: 'documents' },
  { label: 'Support',          path: '/worker/support',     icon: '🛟', id: 'support' },
]

export default function WorkerLayout({
  children,
  activePath,
  session,
  workerData,
  onNavigate,
  onLogout,
  title = 'Dashboard',
  eyebrow = 'Worker Portal',
  subtitle = '',
  headerActions = null,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const workerName = session?.name || workerData?.profile?.name || 'Rahul Kumar'
  const initials = workerName.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
  const availability = workerData?.availability || 'offline'

  const availabilityConfig = {
    available: { label: '🟢 Online',       color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
    offline:   { label: '⚫ Offline',      color: '#94a3b8', bg: 'rgba(148,163,184,0.12)' },
    busy:      { label: '🔴 Busy',         color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
    onjob:     { label: '🔵 On Job',       color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
    temp:      { label: '🔷 Unavailable',  color: '#a855f7', bg: 'rgba(168,85,247,0.12)' },
  }
  const avCfg = availabilityConfig[availability] || availabilityConfig.offline

  const newRequestsCount = workerData?.jobRequests?.length || 0
  const activeJobCount   = workerData?.acceptedJobs?.filter(j => j.status === 'Active')?.length || 0
  const unreadMsgs       = workerData?.messages?.conversations?.reduce((a, c) => a + (c.unread || 0), 0) || 0

  const getBadge = (path) => {
    if (path === '/worker/jobs' && newRequestsCount > 0) return `${newRequestsCount} new`
    if (path === '/worker/active-job' && activeJobCount > 0) return `${activeJobCount} live`
    if (path === '/worker/messages' && unreadMsgs > 0) return `${unreadMsgs}`
    return null
  }

  return (
    <section className="worker-portal-shell">
      {/* ── Mobile overlay ── */}
      {sidebarOpen && (
        <div className="worker-sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Sidebar ── */}
      <aside className={`worker-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="worker-brand-block">
          <img className="worker-brand-logo" src="/official-logo.png" alt="Mazdoor Sytu" />
          <div className="worker-brand-text">
            <strong>Mazdoor Sytu</strong>
            <small>Worker Portal</small>
          </div>
        </div>

        {/* Availability pill in sidebar */}
        <div
          className="worker-sidebar-av"
          style={{ background: avCfg.bg, color: avCfg.color, cursor: 'pointer' }}
          onClick={() => { onNavigate('/worker/availability'); setSidebarOpen(false); }}
          title="Click to manage availability & schedule"
        >
          <span>●</span>
          <span>{avCfg.label.replace(/^[^\s]+\s*/, '')}</span>
          <span style={{ fontSize: '10px', opacity: 0.7 }}>⚙️</span>
        </div>

        <nav className="worker-nav-list" aria-label="Worker portal navigation">
          {NAV_ITEMS.map((item, i) => {
            const isActive = activePath === item.path
            const badge = getBadge(item.path)
            return (
              <a
                key={item.path}
                href={item.path}
                className={`worker-nav-item ${isActive ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); onNavigate(item.path); setSidebarOpen(false) }}
              >
                <span className="worker-nav-icon">{item.icon}</span>
                <span className="worker-nav-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="worker-nav-label">{item.label}</span>
                {badge && <span className="worker-nav-badge">{badge}</span>}
              </a>
            )
          })}
        </nav>

        <div className="worker-sidebar-footer">
          <div className="worker-sidebar-earnings">
            <span>Today's Earnings</span>
            <strong>{workerData?.earnings?.today || '₹0'}</strong>
          </div>
          <a href="/worker/support" onClick={(e) => { e.preventDefault(); onNavigate('/worker/support') }}>
            🛟 Help & Support ↗
          </a>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="worker-portal-main">
        {/* Top Header */}
        <header className="worker-top-header">
          <button
            className="worker-hamburger"
            type="button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation"
          >
            ☰
          </button>
          <div className="worker-header-title">
            <span className="worker-eyebrow">{eyebrow}</span>
            <h1>{title}</h1>
            {subtitle && <p className="worker-header-subtitle">{subtitle}</p>}
          </div>

          <div className="worker-top-actions">
            {headerActions}

            {/* Earnings pill */}
            <button
              type="button"
              className="worker-earnings-pill"
              onClick={() => onNavigate('/worker/earnings')}
              title="View earnings"
            >
              <span>💰</span>
              <span>{workerData?.earnings?.today || '₹0'} today</span>
            </button>

            {/* User badge */}
            <div className="worker-user-badge">
              <div
                className="worker-avatar"
                style={{ cursor: 'pointer' }}
                onClick={() => onNavigate('/worker/profile')}
                title="View Profile"
              >
                {initials}
              </div>
              <div
                className="worker-user-meta"
                style={{ cursor: 'pointer' }}
                onClick={() => onNavigate('/worker/availability')}
                title="Manage status"
              >
                <strong>{workerName}</strong>
                <small style={{ color: avCfg.color, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: avCfg.color }} />
                  {avCfg.label.replace(/^[^\s]+\s*/, '')}
                </small>
              </div>
              {onLogout && (
                <button
                  type="button"
                  className="worker-logout-btn"
                  onClick={onLogout}
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="worker-page-content">
          {children}
        </div>
      </main>
    </section>
  )
}
