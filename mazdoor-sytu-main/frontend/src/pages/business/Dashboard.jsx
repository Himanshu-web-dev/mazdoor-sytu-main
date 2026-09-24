import { useState, useEffect } from 'react'
import { getStoredJobs, getStoredApplications } from '../../data/jobStore'
import './BusinessPortal.css'

export default function BusinessDashboard({ session, onNavigate, onLogout }) {
  const companyName = session?.companyName || session?.name || 'Apex Infra Projects'
  const firstName = companyName.split(' ')[0]

  const [jobs, setJobs] = useState([])
  const [applications, setApplications] = useState([])

  useEffect(() => {
    const allJobs = getStoredJobs()
    const allApps = getStoredApplications()

    const myBusinessId = session?.uid || session?.email
    const myJobs = allJobs.filter(
      (job) =>
        (job.businessId && (job.businessId === myBusinessId || job.businessId === session?.uid)) ||
        (job.companyId && session?.email && job.companyId === session.email) ||
        (job.company && job.company.toLowerCase() === companyName.toLowerCase())
    )

    const myJobIds = new Set(myJobs.map((j) => j.id))
    const myApps = allApps.filter(
      (app) => myJobIds.has(app.jobId) || (app.company && app.company.toLowerCase() === companyName.toLowerCase())
    )

    setJobs(myJobs)
    setApplications(myApps)
  }, [session, companyName])

  const activeJobs = jobs.filter((j) => j.status === 'Active')
  const hiredCount = applications.filter((a) => a.status === 'Accepted').length

  const metrics = [
    ['Active Requirements', String(activeJobs.length).padStart(2, '0'), 'Receiving candidate applications'],
    ['Total Applications', String(applications.length).padStart(2, '0'), 'Across all posted vacancies'],
    ['Workers Hired', String(hiredCount).padStart(2, '0'), 'Verified & staffed on site'],
  ]

  const quickActions = [
    { label: 'Post a New Requirement', path: '/business/post-requirement', icon: '📝' },
    { label: 'Review Applicants', path: '/business/requirements', icon: '👥' },
    { label: 'Browse Verified Workers', path: '/business/workers', icon: '🔍' },
    { label: 'Company Profile & KYC', path: '/business/profile', icon: '🏢' },
  ]

  return (
    <section className="portal-page business-page">
      {/* ── Sidebar ── */}
      <aside className="portal-sidebar">
        <div className="portal-brand">
          <img className="portal-logo" src="/official-logo.png" alt="Mazdoor Sytu" />
          <div>
            <strong>Mazdoor Sytu</strong>
            <small>Business Portal</small>
          </div>
        </div>

        <nav className="portal-nav" aria-label="Business portal navigation">
          {[
            ['Overview', '/business/dashboard'],
            ['Business Profile', '/business/profile'],
            ['Post Requirement', '/business/post-requirement'],
            ['Requirements & Applicants', '/business/requirements'],
            ['Workers', '/business/workers'],
            ['Bookings', '/business/bookings'],
            ['Payments', '/business/payments'],
          ].map(([label, path], index) => (
            <a
              className={index === 0 ? 'active' : ''}
              href={path}
              key={path}
              onClick={(event) => {
                event.preventDefault()
                onNavigate(path)
              }}
            >
              <span className="nav-bullet">{String(index + 1).padStart(2, '0')}</span>
              {label}
            </a>
          ))}
        </nav>

        <div className="portal-help">
          <span>Need hiring support?</span>
          <a
            href="/support"
            onClick={(event) => {
              event.preventDefault()
              onNavigate('/support')
            }}
          >
            Visit Support ↗
          </a>
        </div>
      </aside>

      {/* ── Main Dashboard Content ── */}
      <div className="portal-content business-dashboard-content">
        <header className="portal-header">
          <div>
            <p className="eyebrow">Enterprise Hiring Portal</p>
            <h1>Dashboard Overview</h1>
          </div>
          <div className="portal-user" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ textAlign: 'right' }}>
              <strong style={{ display: 'block', fontSize: '14px', color: '#0f172a' }}>{companyName}</strong>
              <small style={{ color: '#64748b' }}>Verified Contractor Account</small>
            </div>
            {onLogout && (
              <button
                className="btn-reject"
                type="button"
                onClick={onLogout}
                style={{ border: '1px solid #cbd5e1', padding: '6px 14px' }}
              >
                Logout
              </button>
            )}
          </div>
        </header>

        {/* ── Welcome Banner ── */}
        <div className="portal-welcome business-welcome">
          <div>
            <span className="portal-date">ENTERPRISE RECRUITMENT SUITE</span>
            <h2>Welcome back, {firstName}.</h2>
            <p>
              Your workforce operations are live. You have {activeJobs.length} active requirements receiving
              applications from verified local artisans.
            </p>
          </div>
          <button
            className="btn-accept"
            type="button"
            style={{ padding: '12px 24px', fontSize: '14px' }}
            onClick={() => onNavigate('/business/post-requirement')}
          >
            + Post Requirement ↗
          </button>
        </div>

        {/* ── Metric Cards ── */}
        <div className="stats-grid">
          {metrics.map(([label, value, note]) => (
            <article className="stat-card" key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
              <small>{note}</small>
            </article>
          ))}
        </div>

        {/* ── Two-Column Layout ── */}
        <div className="portal-columns business-portal-columns">
          {/* Active Requirements List */}
          <section className="activity-panel business-panel" style={{ background: '#ffffff', borderRadius: '14px', padding: '24px', border: '1px solid #e2e8f0' }}>
            <div className="panel-heading" style={{ marginBottom: '16px' }}>
              <div>
                <span className="panel-kicker" style={{ color: '#059669' }}>LIVE POSTINGS</span>
                <h3 style={{ margin: '4px 0 0', fontSize: '20px', fontWeight: 800 }}>
                  Active Requirements ({activeJobs.length})
                </h3>
              </div>
              <a
                href="/business/requirements"
                onClick={(event) => {
                  event.preventDefault()
                  onNavigate('/business/requirements')
                }}
                style={{ fontSize: '13px', fontWeight: 700, color: '#047857' }}
              >
                View all requirements ↗
              </a>
            </div>

            <div className="activity-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {activeJobs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px 20px', color: '#64748b' }}>
                  <p>No active requirements at the moment.</p>
                  <button
                    type="button"
                    className="btn-accept"
                    style={{ marginTop: '8px' }}
                    onClick={() => onNavigate('/business/post-requirement')}
                  >
                    Post Your First Requirement
                  </button>
                </div>
              ) : (
                activeJobs.slice(0, 4).map((job) => {
                  const jobApps = applications.filter((app) => app.jobId === job.id)
                  return (
                    <div
                      className="activity-row booking-row"
                      key={job.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 14px',
                        border: '1px solid #f1f5f9',
                        borderRadius: '10px',
                        background: '#f8fafc',
                      }}
                    >
                      <div>
                        <strong style={{ fontSize: '14.5px', color: '#0f172a', display: 'block' }}>
                          {job.title}
                        </strong>
                        <p style={{ margin: '3px 0 0', fontSize: '12.5px', color: '#64748b' }}>
                          {job.category} • {job.location} • {job.rate}
                        </p>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span
                          style={{
                            background: jobApps.length > 0 ? '#eff6ff' : '#f1f5f9',
                            color: jobApps.length > 0 ? '#1d4ed8' : '#64748b',
                            padding: '4px 10px',
                            borderRadius: '999px',
                            fontSize: '12px',
                            fontWeight: 700,
                          }}
                        >
                          {jobApps.length} Applicant{jobApps.length === 1 ? '' : 's'}
                        </span>
                        <button
                          type="button"
                          className="btn-shortlist"
                          style={{ padding: '6px 12px', fontSize: '12px' }}
                          onClick={() => onNavigate('/business/requirements')}
                        >
                          Manage
                        </button>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </section>

          {/* Quick Actions & Recent Applicants */}
          <aside className="next-panel business-quick-panel" style={{ background: '#0f172a', borderRadius: '14px', padding: '24px' }}>
            <span className="panel-kicker" style={{ color: '#34d399' }}>QUICK NAVIGATION</span>
            <h3 style={{ margin: '4px 0 16px', color: '#ffffff' }}>Recruitment Hub</h3>

            <div className="quick-links" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {quickActions.map(({ label, path, icon }) => (
                <a
                  href={path}
                  key={path}
                  onClick={(event) => {
                    event.preventDefault()
                    onNavigate(path)
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    color: '#f8fafc',
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: '13.5px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span>{icon} {label}</span>
                  <span style={{ color: '#34d399' }}>→</span>
                </a>
              ))}
            </div>

            {/* Latest Applicants Preview */}
            <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <span style={{ color: '#94a3b8', fontSize: '11px', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.8px' }}>
                Latest Applicants
              </span>
              <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {applications.slice(0, 3).map((app) => (
                  <div
                    key={app.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      padding: '10px',
                      borderRadius: '8px',
                      fontSize: '12.5px',
                      color: '#e2e8f0',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <strong style={{ color: '#ffffff' }}>{app.workerName}</strong>
                      <span style={{ color: '#34d399', fontWeight: 700 }}>{app.status}</span>
                    </div>
                    <small style={{ color: '#94a3b8', display: 'block', marginTop: '2px' }}>
                      {app.service} • {app.appliedAt}
                    </small>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
