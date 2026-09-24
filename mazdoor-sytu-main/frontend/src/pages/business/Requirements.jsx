import { useState, useEffect } from 'react'
import {
  getStoredJobs,
  getStoredApplications,
  updateApplicationStatus,
  updateJobStatus,
  deleteJobRequirement,
} from '../../data/jobStore'
import './BusinessPortal.css'

export default function Requirements({ onNavigate, session }) {
  const [jobs, setJobs] = useState([])
  const [applications, setApplications] = useState([])
  const [viewingApplicantsJob, setViewingApplicantsJob] = useState(null)
  const [statusFilter, setStatusFilter] = useState('All')
  const [feedbackToast, setFeedbackToast] = useState(null)

  const myCompanyName = session?.companyName || session?.name || 'Apex Infra Projects'
  const myBusinessId = session?.uid || session?.email

  const reloadData = () => {
    const allJobs = getStoredJobs()
    const allApps = getStoredApplications()

    // Filter jobs belonging strictly to this business
    const myJobs = allJobs.filter(
      (job) =>
        (job.businessId && (job.businessId === myBusinessId || job.businessId === session?.uid)) ||
        (job.companyId && session?.email && job.companyId === session.email) ||
        (job.company && job.company.toLowerCase() === myCompanyName.toLowerCase())
    )

    const myJobIds = new Set(myJobs.map((j) => j.id))

    // Filter applications belonging strictly to this business's jobs
    const myApplications = allApps.filter(
      (app) => myJobIds.has(app.jobId) || (app.company && app.company.toLowerCase() === myCompanyName.toLowerCase())
    )

    setJobs(myJobs)
    setApplications(myApplications)
  }

  useEffect(() => {
    reloadData()
  }, [session])

  const showToast = (message) => {
    setFeedbackToast(message)
    setTimeout(() => setFeedbackToast(null), 3500)
  }

  const handleUpdateAppStatus = (appId, newStatus) => {
    updateApplicationStatus(appId, newStatus)
    reloadData()
    showToast(`Applicant status updated to "${newStatus}".`)
  }

  const handleToggleJobStatus = (jobId, nextStatus) => {
    updateJobStatus(jobId, nextStatus)
    reloadData()
    showToast(`Requirement status changed to "${nextStatus}". Public listings updated.`)
  }

  const handleDeleteJob = (jobId) => {
    if (window.confirm('Are you sure you want to remove this requirement? It will be unlisted from public search.')) {
      deleteJobRequirement(jobId)
      reloadData()
      showToast('Requirement removed from public search.')
    }
  }

  // Filter jobs based on active filter
  const filteredJobs = jobs.filter((job) => {
    if (statusFilter === 'Active') return job.status === 'Active'
    if (statusFilter === 'Filled') return job.status === 'Filled'
    if (statusFilter === 'Closed') return job.status === 'Closed'
    return true
  })

  // Summary counts
  const totalPostings = jobs.length
  const activePostings = jobs.filter((j) => j.status === 'Active').length
  const totalApplicants = applications.length
  const hiredWorkers = applications.filter((a) => a.status === 'Accepted').length

  const modalApplicants = viewingApplicantsJob
    ? applications.filter((a) => a.jobId === viewingApplicantsJob.id)
    : []

  return (
    <section className="portal-page requirements-page">
      {/* ── Sidebar ── */}
      <aside className="portal-sidebar">
        <div className="portal-brand">
          <img className="portal-logo" src="/official-logo.png" alt="Mazdoor Sytu" />
          <div>
            <strong>Mazdoor Sytu</strong>
            <small>Business Portal</small>
          </div>
        </div>

        <nav className="portal-nav" aria-label="Business requirements navigation">
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
              className={path === '/business/requirements' ? 'active' : ''}
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

      {/* ── Main Content ── */}
      <div className="portal-content">
        <header className="portal-header">
          <div>
            <p className="eyebrow">Recruitment Pipeline</p>
            <h1>Workforce Requirements & Applicants</h1>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              className="btn-shortlist"
              type="button"
              onClick={() => onNavigate('/jobs')}
            >
              View Public Jobs Feed ↗
            </button>
            <button
              className="btn-accept"
              type="button"
              onClick={() => onNavigate('/business/post-requirement')}
            >
              + Post New Requirement
            </button>
          </div>
        </header>

        {/* ── Banner ── */}
        <div className="portal-welcome requirement-welcome">
          <div>
            <span className="portal-date">CENTRALIZED HIRING CONTROL</span>
            <h2>Manage Live Requirements & Candidate Shortlists</h2>
            <p>
              Requirements posted here are automatically synchronized with the public Jobs page.
              Inspect worker qualifications, shortlist matching tradesmen, and confirm hires.
            </p>
          </div>
        </div>

        {/* ── Feedback Notification ── */}
        {feedbackToast && (
          <div
            style={{
              background: '#ecfdf5',
              border: '1.5px solid #10b981',
              borderRadius: '10px',
              padding: '12px 18px',
              color: '#065f46',
              fontWeight: 700,
              fontSize: '13.5px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>✓</span>
            <span>{feedbackToast}</span>
          </div>
        )}

        {/* ── Key Metrics ── */}
        <div className="stats-grid">
          <article className="stat-card">
            <span>Total Postings</span>
            <strong>{String(totalPostings).padStart(2, '0')}</strong>
            <small>All registered requirements</small>
          </article>
          <article className="stat-card">
            <span>Active Openings</span>
            <strong style={{ color: '#059669' }}>{String(activePostings).padStart(2, '0')}</strong>
            <small>Receiving applications</small>
          </article>
          <article className="stat-card">
            <span>Total Applicants</span>
            <strong style={{ color: '#2563eb' }}>{String(totalApplicants).padStart(2, '0')}</strong>
            <small>Verified worker submissions</small>
          </article>
          <article className="stat-card">
            <span>Hired Tradesmen</span>
            <strong style={{ color: '#047857' }}>{String(hiredWorkers).padStart(2, '0')}</strong>
            <small>Accepted on site</small>
          </article>
        </div>

        {/* ── Table Card ── */}
        <section className="dashboard-card requirement-list-card" style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '24px' }}>
          <div className="panel-heading" style={{ marginBottom: '18px' }}>
            <div>
              <span className="panel-kicker">ACTIVE HIRING PIPELINE</span>
              <h3 style={{ margin: '4px 0 0', fontSize: '20px', fontWeight: 800 }}>
                Requirement Directory ({filteredJobs.length})
              </h3>
            </div>

            {/* Filter Pills */}
            <div style={{ display: 'flex', gap: '8px' }}>
              {['All', 'Active', 'Filled', 'Closed'].map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setStatusFilter(f)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    border: `1.5px solid ${statusFilter === f ? '#047857' : '#e2e8f0'}`,
                    background: statusFilter === f ? '#ecfdf5' : '#ffffff',
                    color: statusFilter === f ? '#047857' : '#64748b',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="requirement-table">
            {filteredJobs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                <p style={{ fontSize: '15px', fontWeight: 600 }}>No requirements found under "{statusFilter}".</p>
                <button
                  type="button"
                  className="btn-accept"
                  style={{ marginTop: '10px' }}
                  onClick={() => onNavigate('/business/post-requirement')}
                >
                  Post a New Requirement Now
                </button>
              </div>
            ) : (
              filteredJobs.map((job) => {
                const jobApps = applications.filter((app) => app.jobId === job.id)
                const isFilled = job.status === 'Filled' || (job.workersFilled || 0) >= (job.workersNeeded || 1)
                const isClosed = job.status === 'Closed'

                return (
                  <div
                    className="requirement-row"
                    key={job.id}
                    style={{
                      borderLeft: `4px solid ${
                        isClosed ? '#94a3b8' : isFilled ? '#2563eb' : '#10b981'
                      }`,
                    }}
                  >
                    {/* Title & Info */}
                    <div style={{ flex: '1 1 260px', minWidth: '220px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <strong style={{ fontSize: '15px', color: 'var(--biz-slate-900)' }}>
                          {job.title}
                        </strong>
                        <span
                          className={`status-badge ${
                            isClosed ? 'closed' : isFilled ? 'filled' : 'active'
                          }`}
                        >
                          {job.status || 'Active'}
                        </span>
                      </div>
                      <small style={{ color: 'var(--biz-slate-500)', display: 'block', marginTop: '3px' }}>
                        {job.category} • {job.location} • {job.duration || 'Short-term'}
                      </small>
                    </div>

                    {/* Rate */}
                    <div style={{ minWidth: '100px', textAlign: 'center' }}>
                      <span style={{ fontSize: '11px', color: '#64748b', display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>
                        Rate Offered
                      </span>
                      <strong style={{ fontSize: '15px', color: '#0f172a' }}>{job.rate}</strong>
                    </div>

                    {/* Hiring Progress */}
                    <div style={{ minWidth: '140px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
                        <span>Staffed</span>
                        <span style={{ color: isFilled ? '#2563eb' : '#059669' }}>
                          {job.workersFilled || 0} / {job.workersNeeded || 1}
                        </span>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
                        <div
                          style={{
                            height: '100%',
                            width: `${Math.min(100, (((job.workersFilled || 0) / (job.workersNeeded || 1)) * 100))}%`,
                            background: isFilled ? '#2563eb' : '#10b981',
                            borderRadius: '999px',
                            transition: 'width 0.3s ease',
                          }}
                        />
                      </div>
                    </div>

                    {/* Applicants Button */}
                    <div>
                      <button
                        type="button"
                        onClick={() => setViewingApplicantsJob(job)}
                        style={{
                          background: jobApps.length > 0 ? '#eff6ff' : '#f8fafc',
                          color: jobApps.length > 0 ? '#1d4ed8' : '#64748b',
                          border: '1.5px solid',
                          borderColor: jobApps.length > 0 ? '#bfdbfe' : '#e2e8f0',
                          borderRadius: '8px',
                          padding: '8px 16px',
                          fontSize: '13px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <span>👥</span>
                        <span>{jobApps.length} Applicant{jobApps.length === 1 ? '' : 's'}</span>
                      </button>
                    </div>

                    {/* Lifecycle Status Actions */}
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {job.status === 'Active' && (
                        <>
                          <button
                            type="button"
                            title="Mark position as filled"
                            onClick={() => handleToggleJobStatus(job.id, 'Filled')}
                            style={{
                              padding: '6px 12px',
                              borderRadius: '6px',
                              border: '1px solid #bfdbfe',
                              background: '#eff6ff',
                              color: '#1d4ed8',
                              fontSize: '12px',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            Mark Filled
                          </button>
                          <button
                            type="button"
                            title="Close requirement"
                            onClick={() => handleToggleJobStatus(job.id, 'Closed')}
                            style={{
                              padding: '6px 12px',
                              borderRadius: '6px',
                              border: '1px solid #e2e8f0',
                              background: '#f8fafc',
                              color: '#475569',
                              fontSize: '12px',
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                          >
                            Close
                          </button>
                        </>
                      )}

                      {(job.status === 'Filled' || job.status === 'Closed') && (
                        <button
                          type="button"
                          title="Reopen requirement on public job feed"
                          onClick={() => handleToggleJobStatus(job.id, 'Active')}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: '1px solid #a7f3d0',
                            background: '#ecfdf5',
                            color: '#047857',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          Reopen
                        </button>
                      )}

                      <button
                        type="button"
                        title="Delete requirement"
                        onClick={() => handleDeleteJob(job.id)}
                        style={{
                          padding: '6px 10px',
                          borderRadius: '6px',
                          border: '1px solid #fecaca',
                          background: '#fff1f2',
                          color: '#e11d48',
                          fontSize: '12px',
                          cursor: 'pointer',
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </section>
      </div>

      {/* ── Applicant Review Modal ── */}
      {viewingApplicantsJob && (
        <div className="biz-modal-overlay" onClick={() => setViewingApplicantsJob(null)}>
          <div className="biz-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="biz-modal-header">
              <div>
                <span className="applicant-chip" style={{ background: '#ecfdf5', color: '#047857', marginBottom: '6px', display: 'inline-block' }}>
                  Candidate Management
                </span>
                <h2>Applicants for: {viewingApplicantsJob.title}</h2>
                <small style={{ color: '#64748b' }}>
                  {viewingApplicantsJob.location} • Offered Rate: {viewingApplicantsJob.rate} •
                  Staffed: {viewingApplicantsJob.workersFilled || 0}/{viewingApplicantsJob.workersNeeded || 1}
                </small>
              </div>
              <button
                type="button"
                className="biz-modal-close"
                onClick={() => setViewingApplicantsJob(null)}
              >
                ✕
              </button>
            </div>

            <div className="biz-modal-body">
              {modalApplicants.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 24px', color: '#64748b' }}>
                  <span style={{ fontSize: '36px', display: 'block', marginBottom: '8px' }}>📭</span>
                  <strong style={{ fontSize: '16px', color: '#0f172a', display: 'block' }}>
                    No applications submitted yet
                  </strong>
                  <p style={{ fontSize: '13.5px', maxWidth: '420px', margin: '6px auto 0' }}>
                    As verified workers discover your requirement on the Public Jobs page and click "Apply Now",
                    their complete profiles will appear here for review.
                  </p>
                </div>
              ) : (
                modalApplicants.map((app) => {
                  const initials = app.workerName
                    .split(' ')
                    .map((w) => w[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase()

                  return (
                    <article className="applicant-card" key={app.id}>
                      <div className="applicant-card-header">
                        <div className="applicant-left">
                          <div className="applicant-avatar">{initials}</div>
                          <div className="applicant-info">
                            <strong>{app.workerName}</strong>
                            <p>
                              {app.service} • {app.experience} Experience • {app.serviceArea}
                            </p>
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <span
                            className={`status-badge ${
                              app.status === 'Accepted'
                                ? 'active'
                                : app.status === 'Shortlisted'
                                ? 'filled'
                                : app.status === 'Rejected'
                                ? 'closed'
                                : 'active'
                            }`}
                          >
                            {app.status}
                          </span>
                          <span style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                            Applied {app.appliedAt}
                          </span>
                        </div>
                      </div>

                      {/* Skills & Contact Chips */}
                      <div className="applicant-chips">
                        <span className="applicant-chip">📞 {app.workerPhone}</span>
                        <span className="applicant-chip">⭐ {app.rating || '4.9 ★'}</span>
                        <span className="applicant-chip">✓ Aadhaar Verified</span>
                        <span className="applicant-chip" style={{ background: '#fef3c7', color: '#92400e' }}>
                          Expected: {app.expectedRate || app.rateOffered}
                        </span>
                      </div>

                      {/* Pitch Note */}
                      <p className="applicant-note">
                        <strong>Worker Note:</strong> "{app.notes || 'Ready to join immediately.'}"
                      </p>

                      {/* Direct Call & Hiring Actions */}
                      <div className="applicant-actions">
                        <a
                          href={`tel:${app.workerPhone}`}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '7px 14px',
                            borderRadius: '8px',
                            border: '1px solid #cbd5e1',
                            background: '#ffffff',
                            color: '#334155',
                            textDecoration: 'none',
                            fontSize: '13px',
                            fontWeight: 600,
                          }}
                        >
                          <span>📞</span> Direct Call
                        </a>

                        {app.status !== 'Rejected' && (
                          <button
                            type="button"
                            className="btn-reject"
                            onClick={() => handleUpdateAppStatus(app.id, 'Rejected')}
                          >
                            Reject
                          </button>
                        )}

                        {app.status !== 'Shortlisted' && app.status !== 'Accepted' && (
                          <button
                            type="button"
                            className="btn-shortlist"
                            onClick={() => handleUpdateAppStatus(app.id, 'Shortlisted')}
                          >
                            ⭐ Shortlist
                          </button>
                        )}

                        {app.status !== 'Accepted' && (
                          <button
                            type="button"
                            className="btn-accept"
                            onClick={() => handleUpdateAppStatus(app.id, 'Accepted')}
                          >
                            ✓ Accept & Hire Worker
                          </button>
                        )}

                        {app.status === 'Accepted' && (
                          <span style={{ fontSize: '13px', fontWeight: 800, color: '#047857' }}>
                            ✓ Hired on Site
                          </span>
                        )}
                      </div>
                    </article>
                  )
                })
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
