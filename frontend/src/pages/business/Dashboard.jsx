import { useState, useEffect } from 'react'
import {
  getStoredJobs,
  getStoredApplications,
  updateApplicationStatus,
} from '../../data/jobStore'
import BusinessLayout from './BusinessLayout'
import './BusinessPortal.css'

export default function BusinessDashboard({ session, onNavigate, onLogout }) {
  const companyName = session?.companyName || session?.name || 'Apex Infra Ltd.'
  const firstName = companyName.split(' ')[0]

  const [jobs, setJobs] = useState([])
  const [applications, setApplications] = useState([])
  const [feedbackToast, setFeedbackToast] = useState(null)
  const [selectedJobForModal, setSelectedJobForModal] = useState(null)

  const reloadData = () => {
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

    setJobs(myJobs)
    setApplications(myApps)
  }

  useEffect(() => {
    reloadData()
  }, [session, companyName])

  const showToast = (msg) => {
    setFeedbackToast(msg)
    setTimeout(() => setFeedbackToast(null), 3000)
  }

  const handleUpdateAppStatus = (appId, newStatus) => {
    updateApplicationStatus(appId, newStatus)
    reloadData()
    showToast(`Candidate status updated to "${newStatus}".`)
  }

  const activeJobs = jobs.filter((j) => j.status === 'Active')
  const hiredCount = applications.filter((a) => a.status === 'Accepted').length
  const shortlistedCount = applications.filter((a) => a.status === 'Shortlisted').length
  const underReviewCount = applications.filter(
    (a) => a.status === 'Under Review' || a.status === 'Applied'
  ).length

  const totalWorkersNeeded = jobs.reduce((sum, j) => sum + (j.workersNeeded || 1), 0)
  const totalWorkersFilled = jobs.reduce((sum, j) => sum + (j.workersFilled || 0), 0)

  // Estimated payroll budget
  const estimatedPayroll = jobs.reduce((sum, j) => {
    const rate = j.rateAmount || 850
    const count = j.workersFilled || j.workersNeeded || 2
    return sum + rate * count * 15
  }, 0)

  const modalApplicants = selectedJobForModal
    ? applications.filter((a) => a.jobId === selectedJobForModal.id)
    : []

  return (
    <BusinessLayout
      activePath="/business/dashboard"
      session={session}
      onNavigate={onNavigate}
      onLogout={onLogout}
      title="Enterprise Dashboard"
      eyebrow="Recruitment & Workforce Command"
      subtitle="Real-time candidate pipeline, on-site staffing fulfillment and active job requirements"
      headerActions={
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            className="biz-btn-secondary biz-btn-sm"
            onClick={() => onNavigate('/business/workers')}
          >
            🔍 Browse Workers
          </button>
          <button
            type="button"
            className="biz-btn-primary biz-btn-sm"
            onClick={() => onNavigate('/business/post-requirement')}
          >
            + Post Requirement
          </button>
        </div>
      }
    >
      {/* ── Feedback Notification ── */}
      {feedbackToast && (
        <div className="biz-toast" role="status">
          <span>✓</span>
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* ── Welcome Banner ── */}
      <section className="biz-hero">
        <div className="biz-hero-left">
          <span className="biz-hero-tag">⚡ VERIFIED ENTERPRISE ACCOUNT</span>
          <h2>Welcome back, {firstName}.</h2>
          <p>
            Your contractor workforce operations are live. You have{' '}
            <strong>{activeJobs.length} active requirements</strong> currently receiving verified
            applications from skilled trade mistris across Meerut & NCR.
          </p>
        </div>
        <div className="biz-hero-actions">
          <button
            className="biz-btn-primary"
            type="button"
            onClick={() => onNavigate('/business/post-requirement')}
          >
            + New Requirement ↗
          </button>
          <button
            className="biz-btn-secondary"
            type="button"
            onClick={() => onNavigate('/business/requirements')}
          >
            Review Candidates ({underReviewCount})
          </button>
        </div>
      </section>

      {/* ── KPI Metrics Grid ── */}
      <section className="biz-stats-grid">
        <article className="biz-stat-card">
          <div className="biz-stat-top">
            <span className="biz-stat-label">Active Requirements</span>
            <span className="biz-stat-icon">📋</span>
          </div>
          <div className="biz-stat-value">{String(activeJobs.length).padStart(2, '0')}</div>
          <div className="biz-stat-meta">
            <span className="biz-stat-badge emerald">Live</span>
            <span>Receiving candidate submissions</span>
          </div>
        </article>

        <article className="biz-stat-card">
          <div className="biz-stat-top">
            <span className="biz-stat-label">Total Applications</span>
            <span className="biz-stat-icon">👥</span>
          </div>
          <div className="biz-stat-value" style={{ color: '#2563eb' }}>
            {String(applications.length).padStart(2, '0')}
          </div>
          <div className="biz-stat-meta">
            <span className="biz-stat-badge blue">{underReviewCount} pending</span>
            <span>Across all openings</span>
          </div>
        </article>

        <article className="biz-stat-card">
          <div className="biz-stat-top">
            <span className="biz-stat-label">Workers Staffed</span>
            <span className="biz-stat-icon">👷</span>
          </div>
          <div className="biz-stat-value" style={{ color: '#047857' }}>
            {String(hiredCount).padStart(2, '0')}
          </div>
          <div className="biz-stat-meta">
            <span className="biz-stat-badge emerald">Aadhaar Verified</span>
            <span>Staffed & active on-site</span>
          </div>
        </article>

        <article className="biz-stat-card">
          <div className="biz-stat-top">
            <span className="biz-stat-label">Est. Monthly Payroll</span>
            <span className="biz-stat-icon">💳</span>
          </div>
          <div className="biz-stat-value" style={{ color: '#0f172a' }}>
            ₹{(estimatedPayroll / 1000).toFixed(0)}k
          </div>
          <div className="biz-stat-meta">
            <span className="biz-stat-badge emerald">GST Compliant</span>
            <span>Direct contractor settlement</span>
          </div>
        </article>
      </section>

      {/* ── Recruitment Pipeline Stages ── */}
      <section className="biz-pipeline-card">
        <div className="biz-pipeline-header">
          <div>
            <h3>Recruitment Pipeline Overview</h3>
            <small style={{ color: '#64748b' }}>
              Overall fulfillment: {totalWorkersFilled} of {totalWorkersNeeded} positions staffed
            </small>
          </div>
          <button
            type="button"
            className="biz-link-action"
            onClick={() => onNavigate('/business/requirements')}
          >
            Manage Pipeline ↗
          </button>
        </div>

        <div className="biz-pipeline-steps">
          <div className="biz-pipeline-step">
            <div className="biz-step-icon">📝</div>
            <div className="biz-step-info">
              <span>Vacancies</span>
              <strong>{totalWorkersNeeded} Positions</strong>
            </div>
          </div>
          <div className="biz-pipeline-step">
            <div className="biz-step-icon" style={{ color: '#2563eb' }}>
              📥
            </div>
            <div className="biz-step-info">
              <span>Applied</span>
              <strong>{applications.length} Candidates</strong>
            </div>
          </div>
          <div className="biz-pipeline-step">
            <div className="biz-step-icon" style={{ color: '#7c3aed' }}>
              ⭐
            </div>
            <div className="biz-step-info">
              <span>Shortlisted</span>
              <strong>{shortlistedCount} Selected</strong>
            </div>
          </div>
          <div className="biz-pipeline-step">
            <div className="biz-step-icon" style={{ color: '#059669' }}>
              ✓
            </div>
            <div className="biz-step-info">
              <span>Staffed on Site</span>
              <strong>{hiredCount} Deployed</strong>
            </div>
          </div>
        </div>
      </section>

      {/* ── Two-Column Layout: Requirements + Quick Hub ── */}
      <div className="biz-grid-2col">
        {/* Left: Active Requirements List */}
        <section className="biz-panel">
          <div className="biz-panel-heading">
            <div>
              <span className="biz-eyebrow">LIVE WORKFORCE POSTINGS</span>
              <h3>Active Job Openings ({activeJobs.length})</h3>
            </div>
            <button
              type="button"
              className="biz-link-action"
              onClick={() => onNavigate('/business/requirements')}
            >
              View all requirements ↗
            </button>
          </div>

          <div className="biz-req-list">
            {activeJobs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '36px 20px', color: '#64748b' }}>
                <p style={{ margin: '0 0 12px', fontSize: '15px' }}>
                  No active requirements found.
                </p>
                <button
                  type="button"
                  className="biz-btn-primary"
                  onClick={() => onNavigate('/business/post-requirement')}
                >
                  Post Your First Requirement
                </button>
              </div>
            ) : (
              activeJobs.slice(0, 4).map((job) => {
                const jobApps = applications.filter((app) => app.jobId === job.id)
                const isFilled = (job.workersFilled || 0) >= (job.workersNeeded || 1)
                const pct = Math.min(
                  100,
                  Math.round(((job.workersFilled || 0) / (job.workersNeeded || 1)) * 100)
                )

                return (
                  <div className="biz-req-item" key={job.id}>
                    <div className="biz-req-main">
                      <div className="biz-req-header-row">
                        <strong className="biz-req-title">{job.title}</strong>
                        <span className={`biz-badge ${isFilled ? 'filled' : 'active'}`}>
                          {isFilled ? 'Filled' : job.status}
                        </span>
                      </div>
                      <p className="biz-req-meta">
                        {job.category} • {job.location} • <strong>{job.rate}</strong>
                      </p>
                    </div>

                    <div className="biz-req-progress-wrap">
                      <div className="biz-req-progress-labels">
                        <span>Staffed</span>
                        <span>
                          {job.workersFilled || 0}/{job.workersNeeded || 1}
                        </span>
                      </div>
                      <div className="biz-req-progress-track">
                        <div className="biz-req-progress-bar" style={{ width: `${pct}%` }} />
                      </div>
                    </div>

                    <div className="biz-req-actions">
                      <button
                        type="button"
                        className="biz-btn-secondary biz-btn-sm"
                        onClick={() => setSelectedJobForModal(job)}
                      >
                        👥 {jobApps.length} Applicants
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </section>

        {/* Right: Recent Applicants & Quick Hub */}
        <section className="biz-panel">
          <div className="biz-panel-heading">
            <div>
              <span className="biz-eyebrow">TALENT PIPELINE</span>
              <h3>Recent Candidate Submissions</h3>
            </div>
            <button
              type="button"
              className="biz-link-action"
              onClick={() => onNavigate('/business/requirements')}
            >
              All Applicants ↗
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {applications.slice(0, 4).map((app) => (
              <div
                key={app.id}
                style={{
                  background: 'var(--biz-slate-50)',
                  border: '1px solid var(--biz-slate-200)',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: '#0f172a',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '13px',
                      flexShrink: 0,
                    }}
                  >
                    {app.workerName
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <strong
                      style={{
                        display: 'block',
                        fontSize: '13.5px',
                        color: 'var(--biz-slate-900)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {app.workerName}
                    </strong>
                    <span style={{ fontSize: '11.5px', color: 'var(--biz-slate-500)' }}>
                      {app.service} • {app.experience}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  <span
                    className={`biz-badge ${
                      app.status === 'Accepted'
                        ? 'active'
                        : app.status === 'Shortlisted'
                          ? 'shortlisted'
                          : 'review'
                    }`}
                  >
                    {app.status}
                  </span>
                  {app.status !== 'Accepted' && (
                    <button
                      type="button"
                      style={{
                        background: '#ecfdf5',
                        border: '1px solid #10b981',
                        color: '#047857',
                        borderRadius: '6px',
                        padding: '4px 8px',
                        fontSize: '11.5px',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                      onClick={() => handleUpdateAppStatus(app.id, 'Shortlisted')}
                    >
                      Shortlist
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Action Buttons */}
          <div
            style={{
              marginTop: '20px',
              paddingTop: '16px',
              borderTop: '1px solid var(--biz-slate-200)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <span
              style={{
                fontSize: '11px',
                fontWeight: 800,
                color: 'var(--biz-slate-400)',
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
              }}
            >
              Enterprise Shortcuts
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
              <button
                type="button"
                className="biz-btn-secondary biz-btn-sm"
                onClick={() => onNavigate('/business/post-requirement')}
              >
                ✍️ Post Requirement
              </button>
              <button
                type="button"
                className="biz-btn-secondary biz-btn-sm"
                onClick={() => onNavigate('/business/workers')}
              >
                👷 Hire Trade Crew
              </button>
              <button
                type="button"
                className="biz-btn-secondary biz-btn-sm"
                onClick={() => onNavigate('/business/bookings')}
              >
                📑 Site Bookings
              </button>
              <button
                type="button"
                className="biz-btn-secondary biz-btn-sm"
                onClick={() => onNavigate('/business/payments')}
              >
                💳 Payroll Settlements
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* ── Quick Applicants Modal ── */}
      {selectedJobForModal && (
        <div
          className="biz-modal-overlay"
          onClick={() => setSelectedJobForModal(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="biz-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="biz-modal-header">
              <div>
                <h2>{selectedJobForModal.title}</h2>
                <p>
                  {selectedJobForModal.category} • {selectedJobForModal.location} • Rate:{' '}
                  {selectedJobForModal.rate}
                </p>
              </div>
              <button
                type="button"
                className="biz-modal-close"
                onClick={() => setSelectedJobForModal(null)}
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>

            <div className="biz-modal-body">
              {modalApplicants.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                  <p>No applicants have submitted applications for this requirement yet.</p>
                </div>
              ) : (
                modalApplicants.map((app) => (
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
                            {app.service} • {app.experience} • Rating: {app.rating || '4.9 ★'}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`biz-badge ${
                          app.status === 'Accepted'
                            ? 'active'
                            : app.status === 'Shortlisted'
                              ? 'shortlisted'
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
                        <strong>Worker Application Note:</strong> “{app.notes}”
                      </p>
                    )}

                    <div className="biz-app-actions">
                      <div style={{ fontSize: '13px', color: '#64748b' }}>
                        Applied rate:{' '}
                        <strong style={{ color: '#0f172a' }}>
                          {app.expectedRate || app.rateOffered}
                        </strong>{' '}
                        • Contact: <strong>{app.workerPhone}</strong>
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
                        {app.status === 'Accepted' && (
                          <span
                            style={{
                              color: '#047857',
                              fontWeight: 800,
                              fontSize: '13px',
                              padding: '6px 12px',
                            }}
                          >
                            ✓ Confirmed Staffed
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
