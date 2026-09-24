import { useState, useEffect } from 'react'
import { getStoredJobs, getStoredApplications } from '../../data/jobStore'
import './BusinessPortal.css'

const BIZ_NAV_ITEMS = [
  { label: 'Overview', path: '/business/dashboard', icon: '📊', id: 'dashboard' },
  { label: 'Requirements & Applicants', path: '/business/requirements', icon: '📋', id: 'requirements' },
  { label: 'Post Requirement', path: '/business/post-requirement', icon: '✍️', id: 'post-requirement' },
  { label: 'Verified Workers', path: '/business/workers', icon: '👷', id: 'workers' },
  { label: 'Bookings & Orders', path: '/business/bookings', icon: '📑', id: 'bookings' },
  { label: 'Payments & Payroll', path: '/business/payments', icon: '💳', id: 'payments' },
  { label: 'Company Profile & KYC', path: '/business/profile', icon: '🏢', id: 'profile' },
]

export default function BusinessLayout({
  children,
  activePath = '/business/dashboard',
  session,
  onNavigate,
  onLogout,
  title = 'Enterprise Dashboard',
  eyebrow = 'Enterprise Workforce Suite',
  subtitle = 'Manage workforce requirements, candidate applications and active site bookings',
  headerActions = null,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [counts, setCounts] = useState({ activeJobs: 0, totalApps: 0, pendingApps: 0 })

  const companyName = session?.companyName || session?.name || 'Apex Infra Ltd.'
  const initials = companyName
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'AI'

  useEffect(() => {
    try {
      const allJobs = getStoredJobs()
      const allApps = getStoredApplications()

      const myBusinessId = session?.uid || session?.email
      const myJobs = allJobs.filter(
        (job) =>
          (job.businessId && job.businessId === myBusinessId) ||
          (job.companyId && session?.email && job.companyId === session.email) ||
          (job.company && companyName && job.company.toLowerCase().includes(companyName.toLowerCase().split(' ')[0]))
      )

      const myJobIds = new Set(myJobs.map((j) => j.id))
      const myApps = allApps.filter(
        (app) =>
          myJobIds.has(app.jobId) ||
          (app.company && app.company.toLowerCase().includes(companyName.toLowerCase().split(' ')[0]))
      )

      const activeJobs = myJobs.filter((j) => j.status === 'Active').length
      const pendingApps = myApps.filter((a) => a.status === 'Under Review' || a.status === 'Applied').length

      setCounts({
        activeJobs,
        totalApps: myApps.length,
        pendingApps,
      })
    } catch (e) {
      console.error('Error loading business layout counts:', e)
    }
  }, [session, companyName])

  // Close mobile drawer on route change or Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMobileMenuOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleNavClick = (path) => {
    setMobileMenuOpen(false)
    if (onNavigate) onNavigate(path)
  }

  const getBadgeForPath = (path) => {
    if (path === '/business/requirements') {
      if (counts.pendingApps > 0) return `${counts.pendingApps} new`
      if (counts.activeJobs > 0) return `${counts.activeJobs} live`
    }
    return null
  }

  return (
    <div className="biz-shell">
      {/* ── Mobile Drawer Backdrop ── */}
      {mobileMenuOpen && (
        <div
          className="biz-mobile-backdrop"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Enterprise Sidebar ── */}
      <aside className={`biz-sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="biz-brand">
          <div className="biz-brand-logo-wrap">
            <img className="biz-brand-logo" src="/official-logo.png" alt="Mazdoor Sytu" />
            <span className="biz-status-dot" title="Account Active & Online" />
          </div>
          <div className="biz-brand-info">
            <strong>Mazdoor Sytu</strong>
            <span className="biz-badge-pill">Enterprise Hub</span>
          </div>
          <button
            type="button"
            className="biz-drawer-close"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close navigation menu"
          >
            ✕
          </button>
        </div>

        {/* Company Quick Profile Card in Sidebar */}
        <div className="biz-sidebar-account">
          <div className="biz-account-avatar">{initials}</div>
          <div className="biz-account-meta">
            <strong>{companyName}</strong>
            <small>Verified Contractor ✓</small>
          </div>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="biz-nav" aria-label="Business portal navigation">
          {BIZ_NAV_ITEMS.map((item, index) => {
            const isActive = activePath === item.path
            const badge = getBadgeForPath(item.path)

            return (
              <a
                key={item.path}
                href={item.path}
                className={`biz-nav-item ${isActive ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault()
                  handleNavClick(item.path)
                }}
              >
                <span className="biz-nav-num">{String(index + 1).padStart(2, '0')}</span>
                <span className="biz-nav-icon">{item.icon}</span>
                <span className="biz-nav-label">{item.label}</span>
                {badge && <span className="biz-nav-badge">{badge}</span>}
              </a>
            )
          })}
        </nav>

        {/* Support & Public Link Section */}
        <div className="biz-sidebar-footer">
          <div className="biz-support-box">
            <div className="biz-support-header">
              <span>🛠️ Enterprise Support</span>
              <small>24×7 Contractor SLA</small>
            </div>
            <p>Direct assistance with bulk contractor hiring & KYC approvals.</p>
            <a
              href="/support"
              onClick={(e) => {
                e.preventDefault()
                handleNavClick('/support')
              }}
              className="biz-support-btn"
            >
              Contact Support ↗
            </a>
          </div>

          <div className="biz-public-links">
            <a
              href="/jobs"
              onClick={(e) => {
                e.preventDefault()
                handleNavClick('/jobs')
              }}
            >
              Live Jobs Feed ↗
            </a>
            <span className="biz-divider">•</span>
            <a
              href="/workers"
              onClick={(e) => {
                e.preventDefault()
                handleNavClick('/workers')
              }}
            >
              Browse Workers ↗
            </a>
          </div>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <div className="biz-main">
        {/* Top Header Bar */}
        <header className="biz-topbar">
          <div className="biz-topbar-left">
            <button
              type="button"
              className="biz-menu-toggle"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open portal navigation"
            >
              <span className="biz-hamburger-bar" />
              <span className="biz-hamburger-bar" />
              <span className="biz-hamburger-bar" />
            </button>
            <div className="biz-page-title-group">
              <span className="biz-eyebrow">{eyebrow}</span>
              <h1>{title}</h1>
              {subtitle && <p className="biz-subtitle">{subtitle}</p>}
            </div>
          </div>

          <div className="biz-topbar-right">
            {headerActions}

            <div className="biz-user-profile-badge">
              <div className="biz-user-text">
                <span className="biz-user-company">{companyName}</span>
                <span className="biz-user-role">GST Verified Account</span>
              </div>
              <div className="biz-avatar-round">{initials}</div>
              {onLogout && (
                <button
                  type="button"
                  className="biz-logout-btn"
                  onClick={onLogout}
                  title="Sign out of enterprise portal"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="biz-content">{children}</main>
      </div>
    </div>
  )
}
