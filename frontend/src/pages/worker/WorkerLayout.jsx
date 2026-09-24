import { useState } from 'react'
import './WorkerPortal.css'

const ICONS = {
  dashboard: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </svg>
  ),
  jobs: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  ),
  'job-details': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  'active-job': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  availability: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  earnings: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 20V10" />
      <path d="M12 20V4" />
      <path d="M6 20v-6" />
    </svg>
  ),
  wallet: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
      <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
    </svg>
  ),
  messages: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  notifications: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  reviews: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  profile: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  documents: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  support: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
}

const NAV_SECTIONS = [
  {
    title: 'OVERVIEW',
    items: [
      { label: 'Dashboard', path: '/worker/dashboard', id: 'dashboard' },
      { label: 'Jobs', path: '/worker/jobs', id: 'jobs' },
      { label: 'Live Job', path: '/worker/active-job', id: 'active-job' },
      { label: 'Job Details', path: '/worker/job-details', id: 'job-details' },
    ],
  },
  {
    title: 'MANAGE WORK',
    items: [
      { label: 'Availability', path: '/worker/availability', id: 'availability' },
      { label: 'Earnings', path: '/worker/earnings', id: 'earnings' },
      { label: 'Wallet', path: '/worker/wallet', id: 'wallet' },
    ],
  },
  {
    title: 'COMMUNICATIONS',
    items: [
      { label: 'Messages', path: '/worker/messages', id: 'messages' },
      { label: 'Notifications', path: '/worker/notifications', id: 'notifications' },
      { label: 'Reviews & Ratings', path: '/worker/reviews', id: 'reviews' },
    ],
  },
  {
    title: 'ACCOUNT & HELP',
    items: [
      { label: 'Profile', path: '/worker/profile', id: 'profile' },
      { label: 'KYC & Documents', path: '/worker/documents', id: 'documents' },
      { label: 'Support', path: '/worker/support', id: 'support' },
    ],
  },
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
  const availability = workerData?.availability || 'available'

  const availabilityConfig = {
    available: { label: 'Online',       color: '#22c55e', bg: 'rgba(34,197,94,0.15)' },
    offline:   { label: 'Offline',      color: '#94a3b8', bg: 'rgba(148,163,184,0.15)' },
    busy:      { label: 'Busy',         color: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
    onjob:     { label: 'On Job',       color: '#3b82f6', bg: 'rgba(59,130,246,0.15)' },
    temp:      { label: 'Unavailable',  color: '#a855f7', bg: 'rgba(168,85,247,0.15)' },
  }
  const avCfg = availabilityConfig[availability] || availabilityConfig.available

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
        <div className="worker-brand-block" onClick={() => onNavigate('/')} title="Go to Homepage">
          <div className="worker-brand-logo-card">
            <img className="worker-brand-logo" src="/official-logo.png" alt="Mazdoor Sytu Logo" />
          </div>
          <div className="worker-brand-text">
            <strong>Mazdoor Sytu</strong>
            <span className="worker-brand-badge">Worker Portal</span>
          </div>
        </div>

        {/* Availability status in sidebar */}
        <div
          className="worker-sidebar-av"
          style={{ cursor: 'pointer' }}
          onClick={() => { onNavigate('/worker/availability'); setSidebarOpen(false); }}
          title="Click to manage availability & schedule"
        >
          <div className="worker-sidebar-av-left">
            <span
              className="worker-status-dot"
              style={{ background: avCfg.color, boxShadow: `0 0 0 3px ${avCfg.bg}` }}
            />
            <span className="worker-status-text">
              {avCfg.label}
            </span>
          </div>
          <span className="worker-status-tag">Change ▾</span>
        </div>

        <nav className="worker-nav-list" aria-label="Worker portal navigation">
          {NAV_SECTIONS.map((section) => (
            <div key={section.title} className="worker-nav-group">
              <span className="worker-nav-section-title">{section.title}</span>
              {section.items.map((item) => {
                const isActive = activePath === item.path
                const badge = getBadge(item.path)
                return (
                  <a
                    key={item.path}
                    href={item.path}
                    className={`worker-nav-item ${isActive ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault()
                      onNavigate(item.path)
                      setSidebarOpen(false)
                    }}
                  >
                    <span className="worker-nav-icon">{ICONS[item.id]}</span>
                    <span className="worker-nav-label">{item.label}</span>
                    {badge && <span className="worker-nav-badge">{badge}</span>}
                  </a>
                )
              })}
            </div>
          ))}
        </nav>

        <div className="worker-sidebar-footer">
          <div className="worker-sidebar-earnings-card">
            <div className="worker-earnings-label">Today's Earnings</div>
            <div className="worker-earnings-val">{workerData?.earnings?.today || '₹0'}</div>
          </div>
          <div className="worker-sidebar-footer-links">
            <button
              type="button"
              className="worker-sidebar-link-btn"
              onClick={() => onNavigate('/worker/support')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 14, height: 14 }}>
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <span>Support</span>
            </button>
            {onLogout && (
              <button
                type="button"
                className="worker-sidebar-link-btn logout"
                onClick={onLogout}
                title="Logout"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 14, height: 14 }}>
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span>Logout</span>
              </button>
            )}
          </div>
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
