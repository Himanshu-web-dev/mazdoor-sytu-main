import { useState, useEffect } from 'react'
import {
  getStoredJobs,
  getStoredApplications,
  updateApplicationStatus,
  updateJobStatus,
  deleteJobRequirement,
} from '../../data/jobStore'
import BusinessLayout from './BusinessLayout'
import './BusinessPortal.css'

export default function Requirements({ onNavigate, session, onLogout }) {
  const [jobs, setJobs] = useState([])
  const [applications, setApplications] = useState([])
  const [viewingApplicantsJob, setViewingApplicantsJob] = useState(null)
  const [statusFilter, setStatusFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [feedbackToast, setFeedbackToast] = useState(null)
  const [modalStatusFilter, setModalStatusFilter] = useState('All')

  const myCompanyName = session?.companyName || session?.name || 'Enterprise'
  const myBusinessId = session?.uid || session?.email

  const reloadData = () => {
    const allJobs = getStoredJobs()
    const allApps = getStoredApplications()

    const myJobs = allJobs.filter(
      (job) =>
        (job.businessId && job.businessId === myBusinessId) ||
        (job.companyId && session?.email && job.companyId === session.email) ||
        (job.company && myCompanyName && job.company.toLowerCase().includes(myCompanyName.toLowerCase().split(' ')[0]))
    )

    const myJobIds = new Set(myJobs.map((j) => j.id))
    const myApplications = allApps.filter(
      (app) =>
        myJobIds.has(app.jobId) ||
        (app.company && app.company.toLowerCase().includes(myCompanyName.toLowerCase().split(' ')[0]))
    )

    setJobs(myJobs)
    setApplications(myApplications)
  }

  useEffect(() => {
    reloadData()
  }, [session, myCompanyName])

  const showToast = (message) => {
    setFeedbackToast(message)
    setTimeout(() => setFeedbackToast(null), 3000)
  }

  const handleUpdateAppStatus = (appId, newStatus) => {
    updateApplicationStatus(appId, newStatus)
    reloadData()
    showToast(`Applicant status updated to "${newStatus}".`)
  }

  const handleToggleJobStatus = (jobId, nextStatus) => {
    updateJobStatus(jobId, nextStatus)
    reloadData()
    showToast(`Requirement status updated to "${nextStatus}". Public listings synchronized.`)
  }

  const handleDeleteJob = (jobId) => {
    if (window.confirm('Are you sure you want to remove this requirement? It will be unlisted from public search.')) {
      deleteJobRequirement(jobId)
      reloadData()
      showToast('Requirement removed from public search.')
      if (viewingApplicantsJob?.id === jobId) {
        setViewingApplicantsJob(null)
      }
    }
  }

  // Filtered requirements
  const filteredJobs = jobs.filter((job) => {
    if (statusFilter === 'Active' && job.status !== 'Active') return false
    if (statusFilter === 'Filled' && job.status !== 'Filled') return false
    if (statusFilter === 'Closed' && job.status !== 'Closed') return false

    if (categoryFilter !== 'All' && job.category !== categoryFilter) return false

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const matchTitle = job.title?.toLowerCase().includes(q)
      const matchCategory = job.category?.toLowerCase().includes(q)
      const matchLocation = job.location?.toLowerCase().includes(q)
      if (!matchTitle && !matchCategory && !matchLocation) return false
    }

    return true
  })

  // Summary counts
  const totalPostings = jobs.length
  const activePostings = jobs.filter((j) => j.status === 'Active').length
  const totalApplicants = applications.length
  const hiredWorkers = applications.filter((a) => a.status === 'Accepted').length

  // Categories list for filter dropdown
  const categoriesList = ['All', ...new Set(jobs.map((j) => j.category).filter(Boolean))]

  // Applicants for currently opened modal
  const currentModalApplicants = viewingApplicantsJob
    ? applications
        .filter((a) => a.jobId === viewingApplicantsJob.id)
        .filter((a) => {
          if (modalStatusFilter === 'All') return true
          return a.status === modalStatusFilter
        })
    : []

  const rawJobApplicants = viewingApplicantsJob
    ? applications.filter((a) => a.jobId === viewingApplicantsJob.id)
    : []

  return (
    <BusinessLayout
      activePath="/business/requirements"
      session={session}
      onNavigate={onNavigate}
      onLogout={onLogout}
      title="Requirements & Candidate Pipeline"
      eyebrow="Talent Acquisition"
      subtitle="Track active trade openings, inspect candidate credentials, shortlist and staff tradesmen on site"
      headerActions={
        <button
          type="button"
          className="biz-btn-primary biz-btn-sm"
          onClick={() => onNavigate('/business/post-requirement')}
        >
          + Post New Requirement
        </button>
      }
    >
      {/* Toast */}
      {feedbackToast && (
        <div className="biz-toast" role="status">
          <span>✓</span>
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* KPI Stats */}
      <section className="biz-stats-grid">
        <article className="biz-stat-card">
          <div className="biz-stat-top">
            <span className="biz-stat-label">Total Requirements</span>
            <span className="biz-stat-icon">📁</span>
          </div>
          <div className="biz-stat-value">{String(totalPostings).padStart(2, '0')}</div>
          <div className="biz-stat-meta">
            <span>All registered postings</span>
          </div>
        </article>

        <article className="biz-stat-card">
          <div className="biz-stat-top">
            <span className="biz-stat-label">Active Openings</span>
            <span className="biz-stat-icon">⚡</span>
          </div>
          <div className="biz-stat-value" style={{ color: '#047857' }}>
            {String(activePostings).padStart(2, '0')}
          </div>
          <div className="biz-stat-meta">
            <span className="biz-stat-badge emerald">Live</span>
            <span>Receiving candidate submissions</span>
          </div>
        </article>

        <article className="biz-stat-card">
          <div className="biz-stat-top">
            <span className="biz-stat-label">Total Applicants</span>
            <span className="biz-stat-icon">👥</span>
          </div>
          <div className="biz-stat-value" style={{ color: '#2563eb' }}>
            {String(totalApplicants).padStart(2, '0')}
          </div>
          <div className="biz-stat-meta">
            <span className="biz-stat-badge blue">Verified</span>
            <span>Local trade mistris</span>
          </div>
        </article>

        <article className="biz-stat-card">
          <div className="biz-stat-top">
            <span className="biz-stat-label">Hired Tradesmen</span>
            <span className="biz-stat-icon">✓</span>
          </div>
          <div className="biz-stat-value" style={{ color: '#059669' }}>
            {String(hiredWorkers).padStart(2, '0')}
          </div>
          <div className="biz-stat-meta">
            <span className="biz-stat-badge emerald">On Site</span>
            <span>Confirmed and staffed</span>
          </div>
        </article>
      </section>

      {/* Filter and Search Bar */}
      <div className="biz-filter-bar">
        <div className="biz-search-input-wrap">
          <span className="biz-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by requirement title, trade or site location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid var(--biz-slate-300)',
              fontSize: '13px',
              fontWeight: 600,
              background: '#ffffff',
            }}
          >
            {categoriesList.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'All' ? 'All Trades' : cat}
              </option>
            ))}
          </select>

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
                transition: 'all 0.15s',
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Requirements List */}
      <section className="biz-panel">
        <div className="biz-panel-heading">
          <div>
            <span className="biz-eyebrow">DIRECTORY</span>
            <h3>Requirements Directory ({filteredJobs.length})</h3>
          </div>
          <button
            type="button"
            className="biz-link-action"
            onClick={() => onNavigate('/jobs')}
          >
            Preview Public Jobs Board ↗
          </button>
        </div>

        <div className="biz-req-list">
          {filteredJobs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
              <p style={{ fontSize: '15px', fontWeight: 600, margin: '0 0 10px' }}>
                No requirements found matching your criteria.
              </p>
              <button
                type="button"
                className="biz-btn-primary"
                onClick={() => onNavigate('/business/post-requirement')}
              >
                + Post a New Requirement Now
              </button>
            </div>
          ) : (
            filteredJobs.map((job) => {
              const jobApps = applications.filter((app) => app.jobId === job.id)
              const isFilled = job.status === 'Filled' || (job.workersFilled || 0) >= (job.workersNeeded || 1)
              const isClosed = job.status === 'Closed'
              const pct = Math.min(
                100,
                Math.round(((job.workersFilled || 0) / (job.workersNeeded || 1)) * 100)
              )

              return (
                <div
                  className="biz-req-item"
                  key={job.id}
                  style={{
                    borderLeft: `4px solid ${
                      isClosed ? '#94a3b8' : isFilled ? '#2563eb' : '#10b981'
                    }`,
                  }}
                >
                  {/* Left Column: Title & Info */}
                  <div className="biz-req-main">
                    <div className="biz-req-header-row">
                      <strong className="biz-req-title">{job.title}</strong>
                      <span
                        className={`biz-badge ${
                          isClosed ? 'closed' : isFilled ? 'filled' : 'active'
                        }`}
                      >
                        {job.status || 'Active'}
                      </span>
                      {job.urgency === 'Immediate' && (
                        <span className="biz-badge review" style={{ fontSize: '10.5px' }}>
                          Immediate
                        </span>
                      )}
                    </div>
                    <p className="biz-req-meta">
                      {job.category} • {job.location} • <strong>{job.rate}</strong> • {job.duration || 'Project-Based'}
                    </p>
                  </div>

                  {/* Staffing Progress */}
                  <div className="biz-req-progress-wrap">
                    <div className="biz-req-progress-labels">
                      <span>Staffed</span>
                      <span style={{ color: isFilled ? '#2563eb' : '#059669' }}>
                        {job.workersFilled || 0} / {job.workersNeeded || 1}
                      </span>
                    </div>
                    <div className="biz-req-progress-track">
                      <div
                        className="biz-req-progress-bar"
                        style={{
                          width: `${pct}%`,
                          background: isFilled ? '#2563eb' : '#059669',
                        }}
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="biz-req-actions">
                    <button
                      type="button"
                      className="biz-btn-secondary biz-btn-sm"
                      onClick={() => {
                        setViewingApplicantsJob(job)
                        setModalStatusFilter('All')
                      }}
                      style={{
                        background: jobApps.length > 0 ? '#eff6ff' : '#ffffff',
                        borderColor: jobApps.length > 0 ? '#bfdbfe' : '#cbd5e1',
                        color: jobApps.length > 0 ? '#1d4ed8' : '#475569',
                      }}
                    >
                      👥 {jobApps.length} Applicant{jobApps.length === 1 ? '' : 's'}
                    </button>

                    {job.status === 'Active' && (
                      <>
                        <button
                          type="button"
                          className="biz-btn-secondary biz-btn-sm"
                          onClick={() => handleToggleJobStatus(job.id, 'Filled')}
                          title="Mark position as fully staffed"
                        >
                          Mark Filled
                        </button>
                        <button
                          type="button"
                          className="biz-btn-secondary biz-btn-sm"
                          onClick={() => handleToggleJobStatus(job.id, 'Closed')}
                          title="Close and unlist from job feed"
                        >
                          Close
                        </button>
                      </>
                    )}

                    {job.status !== 'Active' && (
                      <button
                        type="button"
                        className="biz-btn-secondary biz-btn-sm"
                        onClick={() => handleToggleJobStatus(job.id, 'Active')}
                        title="Reopen vacancy to public job board"
                      >
                        Reopen
                      </button>
                    )}

                    <button
                      type="button"
                      className="biz-btn-secondary biz-btn-sm"
                      style={{ color: '#dc2626' }}
                      onClick={() => handleDeleteJob(job.id)}
                      title="Delete requirement"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </section>

      {/* ── Comprehensive Applicant Review Modal ── */}
      {viewingApplicantsJob && (
        <div
          className="biz-modal-overlay"
          onClick={() => setViewingApplicantsJob(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="biz-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="biz-modal-header">
              <div>
                <h2>Applicants: {viewingApplicantsJob.title}</h2>
                <p>
                  {viewingApplicantsJob.category} • {viewingApplicantsJob.location} • Rate:{' '}
                  <strong>{viewingApplicantsJob.rate}</strong> • Staffed:{' '}
                  {viewingApplicantsJob.workersFilled || 0}/{viewingApplicantsJob.workersNeeded || 1}
                </p>
              </div>
              <button
                type="button"
                className="biz-modal-close"
                onClick={() => setViewingApplicantsJob(null)}
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>

            {/* Modal Filter Tabs */}
            <div
              style={{
                padding: '12px 28px',
                background: '#f8fafc',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                gap: '8px',
              }}
            >
              {[
                ['All', rawJobApplicants.length],
                ['Under Review', rawJobApplicants.filter((a) => a.status === 'Under Review' || a.status === 'Applied').length],
                ['Shortlisted', rawJobApplicants.filter((a) => a.status === 'Shortlisted').length],
                ['Accepted', rawJobApplicants.filter((a) => a.status === 'Accepted').length],
              ].map(([status, count]) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setModalStatusFilter(status)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '6px',
                    border: `1px solid ${modalStatusFilter === status ? '#047857' : '#cbd5e1'}`,
                    background: modalStatusFilter === status ? '#ecfdf5' : '#ffffff',
                    color: modalStatusFilter === status ? '#047857' : '#475569',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {status} ({count})
                </button>
              ))}
            </div>

            {/* Applicant Cards List */}
            <div className="biz-modal-body">
              {currentModalApplicants.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '36px 20px', color: '#64748b' }}>
                  <p style={{ fontSize: '14.5px', margin: 0 }}>
                    No candidates found under "{modalStatusFilter}".
                  </p>
                </div>
              ) : (
                currentModalApplicants.map((app) => (
                  <div className="biz-app-card" key={app.id}>
                    <div className="biz-app-header">
                      <div className="biz-app-left">
                        <div className="biz-app-avatar">
                          {app.workerName
                            .split(' ')
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join('')}
                        </div>
                        <div>
                          <div className="biz-app-name">
                            <span>{app.workerName}</span>
                            <span className="biz-verified-badge">✓ Aadhaar Verified</span>
                          </div>
                          <p className="biz-app-sub">
                            {app.service} • {app.experience} • Rating: {app.rating || '4.9 ★'} • Applied: {app.appliedAt}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`biz-badge ${
                          app.status === 'Accepted'
                            ? 'active'
                            : app.status === 'Shortlisted'
                              ? 'shortlisted'
                              : app.status === 'Rejected'
                                ? 'rejected'
                                : 'review'
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>

                    {app.skills && (
                      <div className="biz-app-meta-chips">
                        {app.skills.map((skill) => (
                          <span className="biz-app-chip" key={skill}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    {app.notes && (
                      <p className="biz-app-note">
                        <strong>Applicant Statement:</strong> “{app.notes}”
                      </p>
                    )}

                    <div className="biz-app-actions">
                      <div style={{ fontSize: '13px', color: '#64748b' }}>
                        Requested rate: <strong style={{ color: '#0f172a' }}>{app.expectedRate || app.rateOffered}</strong>
                        {' • '}
                        <a
                          href={`tel:${app.workerPhone}`}
                          style={{ color: '#2563eb', fontWeight: 700, textDecoration: 'none' }}
                        >
                          📞 Call {app.workerPhone}
                        </a>
                      </div>

                      <div className="biz-app-actions-right">
                        {app.status !== 'Shortlisted' && app.status !== 'Accepted' && (
                          <button
                            type="button"
                            className="biz-btn-secondary biz-btn-sm"
                            onClick={() => handleUpdateAppStatus(app.id, 'Shortlisted')}
                          >
                            ⭐ Shortlist
                          </button>
                        )}

                        {app.status !== 'Accepted' && (
                          <button
                            type="button"
                            className="biz-btn-primary biz-btn-sm"
                            onClick={() => handleUpdateAppStatus(app.id, 'Accepted')}
                          >
                            ✓ Accept & Staff on Site
                          </button>
                        )}

                        {app.status !== 'Rejected' && app.status !== 'Accepted' && (
                          <button
                            type="button"
                            className="biz-btn-secondary biz-btn-sm"
                            style={{ color: '#dc2626' }}
                            onClick={() => handleUpdateAppStatus(app.id, 'Rejected')}
                          >
                            ✕ Reject
                          </button>
                        )}

                        {app.status === 'Accepted' && (
                          <span
                            style={{
                              color: '#047857',
                              fontWeight: 800,
                              fontSize: '13px',
                              padding: '6px 12px',
                            }}
                          >
                            ✓ Staffed on Site
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </BusinessLayout>
  )
}
