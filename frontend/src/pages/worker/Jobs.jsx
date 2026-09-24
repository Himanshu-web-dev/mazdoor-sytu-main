import { useState, useEffect } from 'react'
import WorkerLayout from './WorkerLayout'
import { getStoredJobs, getStoredApplications, submitJobApplication } from '../../data/jobStore'

export default function Jobs({ session, onNavigate, onLogout, workerData, onJobDecision }) {
  const [activeTab, setActiveTab] = useState('business_jobs')
  const [storedJobs, setStoredJobs] = useState([])
  const [appliedJobs, setAppliedJobs] = useState([])
  const [detailJob, setDetailJob] = useState(null)
  const [applyModalJob, setApplyModalJob] = useState(null)
  const [applyRate, setApplyRate] = useState('')
  const [applyNotes, setApplyNotes] = useState('')
  const [actionNotice, setActionNotice] = useState(null)

  const reloadData = () => {
    const jobs = getStoredJobs()
    const apps = getStoredApplications()
    setStoredJobs(jobs)
    setAppliedJobs(apps)
  }

  useEffect(() => {
    reloadData()
    const handleStorage = () => reloadData()
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const workerPhone = session?.phone || workerData?.profile?.phone || '+91 8004264176'
  const workerName = session?.name || workerData?.profile?.name || 'Rahul Kumar'
  const workerService = workerData?.profile?.service || workerData?.profile?.trade || 'Electrician'

  // Identify applications submitted by this worker
  const myApplications = appliedJobs.filter(
    (app) => app.workerPhone === workerPhone || app.workerName === workerName
  )
  const appliedJobIds = new Set(myApplications.map((app) => app.jobId))

  const jobRequests   = workerData?.jobRequests   || []
  const acceptedJobs  = workerData?.acceptedJobs  || []
  const upcomingJobs  = workerData?.upcomingJobs  || []
  const completedJobs = workerData?.completedJobs || []
  const cancelledJobs = workerData?.cancelledJobs || []

  // Filter open jobs
  const openRequirements = storedJobs.filter((j) => j.status === 'Active')

  const handleOpenApplyModal = (job) => {
    setApplyModalJob(job)
    setApplyRate(job.rate || '₹800/day')
    setApplyNotes(`Hello ${job.company}, I have ${workerData?.profile?.experience || '3+ years'} of verified experience in ${workerService}. Ready to join immediately.`)
  }

  const handleSubmitApply = (e) => {
    e.preventDefault()
    if (!applyModalJob) return

    const workerProfileSnapshot = {
      name: workerName,
      phone: workerPhone,
      email: session?.email || workerData?.profile?.email || 'mazdoorsetu.support@gmail.com',
      service: workerService,
      experience: workerData?.profile?.experience || '4 years',
      skills: workerData?.profile?.skills || [workerService, 'Safety Compliant', 'Field Work', 'Tools Ready'],
      serviceArea: workerData?.profile?.serviceArea || 'Meerut & NCR Region',
      rating: workerData?.profile?.rating || '4.9 ★ (48 reviews)',
      verification: 'Aadhaar Verified Worker'
    }

    const res = submitJobApplication({
      jobId: applyModalJob.id,
      jobTitle: applyModalJob.title,
      company: applyModalJob.company,
      workerProfile: workerProfileSnapshot,
      expectedRate: applyRate,
      notes: applyNotes
    })

    if (res.success) {
      setActionNotice({ type: 'success', message: `Application submitted successfully for ${applyModalJob.title}!` })
      reloadData()
      setApplyModalJob(null)
      setTimeout(() => setActionNotice(null), 4000)
    } else {
      setActionNotice({ type: 'info', message: res.message })
      setApplyModalJob(null)
      setTimeout(() => setActionNotice(null), 4000)
    }
  }

  const pillClass = (status) => {
    if (!status) return 'worker-status-pill pill-pending'
    const s = status.toLowerCase()
    if (s === 'active' || s === 'in progress' || s === 'accepted') return 'worker-status-pill pill-active'
    if (s === 'shortlisted') return 'worker-status-pill pill-scheduled'
    if (s === 'completed') return 'worker-status-pill pill-completed'
    if (s === 'rejected' || s === 'closed') return 'worker-status-pill pill-pending'
    return 'worker-status-pill pill-accepted'
  }

  const TABS = [
    { key: 'business_jobs',  label: `Open Jobs (${openRequirements.length})` },
    { key: 'my_applications',label: `My Applications (${myApplications.length})` },
    { key: 'requests',       label: `Direct Requests (${jobRequests.length})` },
    { key: 'active',         label: `Active (${acceptedJobs.length})` },
    { key: 'upcoming',       label: `Upcoming (${upcomingJobs.length})` },
    { key: 'completed',      label: `Completed (${completedJobs.length})` },
    { key: 'cancelled',      label: `Cancelled (${cancelledJobs.length})` },
  ]

  const tabDataMap = {
    requests:  jobRequests,
    active:    acceptedJobs,
    upcoming:  upcomingJobs,
    completed: completedJobs,
    cancelled: cancelledJobs,
  }

  return (
    <WorkerLayout
      activePath="/worker/jobs"
      session={session}
      workerData={workerData}
      onNavigate={onNavigate}
      onLogout={onLogout}
      title="Jobs & Requirements"
      eyebrow="Worker Portal"
      subtitle="Browse open company requirements, apply directly and monitor your application status"
      headerActions={
        <button
          className="wk-btn-success"
          onClick={() => onNavigate('/worker/active-job')}
          style={{ padding: '8px 16px', fontSize: '13px' }}
        >
          ⚡ Live Job
        </button>
      }
    >
      {/* Notice Banner */}
      {actionNotice && (
        <div style={{
          padding: '12px 18px',
          borderRadius: '12px',
          background: actionNotice.type === 'success' ? '#ecfdf5' : '#eff6ff',
          border: `1.5px solid ${actionNotice.type === 'success' ? '#10b981' : '#3b82f6'}`,
          color: actionNotice.type === 'success' ? '#065f46' : '#1e40af',
          fontSize: '13.5px',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px'
        }}>
          <span>{actionNotice.type === 'success' ? '✓' : 'ℹ'} {actionNotice.message}</span>
          <button
            onClick={() => setActionNotice(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: 'inherit' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            style={{
              padding: '8px 16px',
              borderRadius: '999px',
              border: activeTab === t.key ? '2px solid #16a34a' : '2px solid #d4dbd6',
              background: activeTab === t.key ? 'rgba(22,163,74,0.1)' : '#fff',
              color: activeTab === t.key ? '#16a34a' : '#6b7c6f',
              fontWeight: 700,
              fontSize: '12.5px',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── 1. OPEN JOBS FROM BUSINESSES ── */}
      {activeTab === 'business_jobs' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="worker-card-panel" style={{ padding: '16px 20px', background: '#f8fafc', borderColor: '#cbd5e1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <strong style={{ fontSize: '14px', color: '#0f172a' }}>Verified Business Requirements</strong>
                <p style={{ margin: '2px 0 0', fontSize: '12.5px', color: '#64748b' }}>
                  Direct hiring from registered companies and contractors. Apply with your verified profile to get shortlisted faster.
                </p>
              </div>
              <button
                className="wk-btn-outline"
                style={{ fontSize: '12px', padding: '6px 14px' }}
                onClick={() => onNavigate('/jobs')}
              >
                View Public Jobs Feed ↗
              </button>
            </div>
          </div>

          {openRequirements.length === 0 ? (
            <div className="worker-card-panel" style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: '36px', marginBottom: '10px' }}>🔍</div>
              <h3 style={{ margin: '0 0 6px', fontSize: '16px' }}>No active business requirements right now</h3>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Check back soon as new contractor jobs are posted daily.</p>
            </div>
          ) : (
            openRequirements.map((job) => {
              const isApplied = appliedJobIds.has(job.id)
              const isFull = (job.workersFilled || 0) >= (job.workersNeeded || 1)

              return (
                <div key={job.id} className="worker-card-panel" style={{ gap: '14px' }}>
                  {/* Top Line */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                        <span style={{
                          background: job.urgency === 'Immediate' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(22,163,74,0.1)',
                          color: job.urgency === 'Immediate' ? '#dc2626' : '#16a34a',
                          fontSize: '11px', fontWeight: 800, padding: '3px 10px', borderRadius: '999px'
                        }}>
                          {job.urgency === 'Immediate' ? '🔥 URGENT HIRING' : '✓ ACTIVE REQUIREMENT'}
                        </span>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                          🏢 {job.company}
                        </span>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>{job.id}</span>
                      </div>

                      <h3 style={{ margin: '4px 0 6px', fontSize: '16.5px', fontWeight: 800, color: '#0f172a' }}>
                        {job.title}
                      </h3>

                      <p style={{ margin: 0, fontSize: '12.5px', color: '#64748b' }}>
                        📍 {job.location} &nbsp;•&nbsp; 👥 {job.workersNeeded || 1} workers needed ({job.workersFilled || 0} hired) &nbsp;•&nbsp; ⏱️ {job.duration || 'Daily contract'}
                      </p>
                    </div>

                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: '18px', fontWeight: 900, color: '#047857' }}>{job.rate}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>Contract Rate</div>
                    </div>
                  </div>

                  {/* Skills Grid */}
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {(job.skills || []).map((sk) => (
                      <span key={sk} style={{
                        background: '#f1f5f9', color: '#334155',
                        padding: '3px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 600
                      }}>
                        {sk}
                      </span>
                    ))}
                  </div>

                  {/* Description snippet */}
                  <p style={{ margin: 0, fontSize: '13px', color: '#334155', lineHeight: 1.6, borderLeft: '3px solid #cbd5e1', paddingLeft: '12px' }}>
                    {job.description}
                  </p>

                  {/* Action row */}
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '4px' }}>
                    {isApplied ? (
                      <span style={{
                        padding: '9px 18px',
                        background: '#ecfdf5',
                        color: '#059669',
                        borderRadius: '10px',
                        fontSize: '13px',
                        fontWeight: 800,
                        border: '1px solid #a7f3d0'
                      }}>
                        ✓ Application Submitted
                      </span>
                    ) : isFull ? (
                      <span style={{
                        padding: '9px 18px',
                        background: '#f1f5f9',
                        color: '#64748b',
                        borderRadius: '10px',
                        fontSize: '13px',
                        fontWeight: 700
                      }}>
                        Position Filled
                      </span>
                    ) : (
                      <button
                        className="wk-btn-success"
                        onClick={() => handleOpenApplyModal(job)}
                        style={{ padding: '9px 20px', fontSize: '13px' }}
                      >
                        Apply for This Job →
                      </button>
                    )}

                    <button
                      className="wk-btn-outline"
                      onClick={() => setDetailJob(job)}
                      style={{ padding: '9px 16px', fontSize: '13px' }}
                    >
                      View Full Details
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}

      {/* ── 2. MY APPLICATIONS ── */}
      {activeTab === 'my_applications' && (
        <div className="worker-card-panel">
          <div className="worker-panel-head">
            <div>
              <span className="worker-panel-kicker">APPLICATION TRACKER</span>
              <h3>Your job applications ({myApplications.length})</h3>
            </div>
          </div>

          {myApplications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px', color: '#64748b' }}>
              <div style={{ fontSize: '36px', marginBottom: '10px' }}>📄</div>
              <strong style={{ fontSize: '15px', color: '#0f172a' }}>You haven't applied to any business jobs yet</strong>
              <p style={{ fontSize: '13px', margin: '6px 0 16px' }}>
                Browse open contractor and business requirements and submit your application with one click.
              </p>
              <button
                className="wk-btn-success"
                onClick={() => setActiveTab('business_jobs')}
                style={{ padding: '8px 18px', fontSize: '13px' }}
              >
                Browse Open Jobs
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {myApplications.map((app) => {
                const statusColor =
                  app.status === 'Accepted' ? '#059669' :
                  app.status === 'Shortlisted' ? '#0284c7' :
                  app.status === 'Rejected' ? '#dc2626' : '#d97706'
                
                const statusBg =
                  app.status === 'Accepted' ? '#ecfdf5' :
                  app.status === 'Shortlisted' ? '#f0f9ff' :
                  app.status === 'Rejected' ? '#fef2f2' : '#fffbeb'

                return (
                  <div
                    key={app.id}
                    style={{
                      border: '1.5px solid #e2e8f0',
                      borderRadius: '14px',
                      padding: '16px 18px',
                      background: '#fff',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span style={{
                            padding: '3px 10px',
                            borderRadius: '999px',
                            background: statusBg,
                            color: statusColor,
                            fontSize: '11px',
                            fontWeight: 800,
                            letterSpacing: '0.5px',
                            textTransform: 'uppercase'
                          }}>
                            ● {app.status || 'Applied'}
                          </span>
                          <span style={{ fontSize: '11px', color: '#94a3b8' }}>{app.id}</span>
                          <span style={{ fontSize: '12px', color: '#64748b' }}>• Applied {app.appliedAt}</span>
                        </div>
                        <h4 style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
                          {app.jobTitle}
                        </h4>
                        <p style={{ margin: 0, fontSize: '12.5px', color: '#64748b' }}>
                          🏢 {app.company} &nbsp;•&nbsp; 💰 Expected Rate: <strong>{app.expectedRate || app.rateOffered}</strong>
                        </p>
                      </div>

                      {app.status === 'Accepted' && (
                        <span style={{
                          background: '#ecfdf5',
                          border: '1px solid #10b981',
                          color: '#065f46',
                          padding: '6px 14px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: 800
                        }}>
                          🎉 Congratulations! Hired by Company
                        </span>
                      )}
                    </div>

                    {app.notes && (
                      <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', fontSize: '12.5px', color: '#475569' }}>
                        <strong>Your pitch note:</strong> "{app.notes}"
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ── 3. DIRECT CUSTOMER REQUESTS ── */}
      {activeTab === 'requests' && (
        <div className="worker-card-panel">
          <div className="worker-panel-head">
            <div>
              <span className="worker-panel-kicker">DIRECT INCOMING BOOKINGS</span>
              <h3>Customer booking requests ({jobRequests.length})</h3>
            </div>
          </div>
          {jobRequests.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px', color: '#6b7c6f' }}>
              <div style={{ fontSize: '36px', marginBottom: '10px' }}>📭</div>
              <strong>No new job requests</strong>
              <p style={{ fontSize: '13px', margin: '6px 0 0' }}>Make sure you're Online in your Availability settings to receive requests.</p>
            </div>
          ) : (
            <div className="worker-request-list">
              {jobRequests.map((job) => (
                <div key={job.id} className="worker-request-row">
                  <div className="request-avatar">{job.id?.slice(-2) || 'JB'}</div>
                  <div className="request-info">
                    <strong>{job.title}</strong>
                    <p>👤 {job.customer} &nbsp;•&nbsp; 📍 {job.distance}</p>
                    <p>🕒 {job.date}, {job.time} &nbsp;•&nbsp; 📝 {job.service}</p>
                    {job.description && (
                      <p style={{ fontSize: '11.5px', color: '#2d3a30', marginTop: '4px', fontStyle: 'italic' }}>
                        "{job.description.slice(0, 80)}..."
                      </p>
                    )}
                  </div>
                  <div className="request-meta">
                    <span className="request-price">{job.price}</span>
                    <span className="request-time">{job.eta} away</span>
                    <div className="request-actions">
                      <button
                        className="wk-btn-success"
                        style={{ fontSize: '12px', padding: '7px 12px' }}
                        onClick={() => onJobDecision && onJobDecision(job.id, 'accept')}
                      >
                        ✓ Accept
                      </button>
                      <button
                        className="wk-btn-danger"
                        style={{ fontSize: '12px', padding: '7px 12px' }}
                        onClick={() => onJobDecision && onJobDecision(job.id, 'reject')}
                      >
                        ✕ Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── 4. OTHER TABS (Active / Upcoming / Completed / Cancelled) ── */}
      {['active', 'upcoming', 'completed', 'cancelled'].includes(activeTab) && (
        <div className="worker-card-panel">
          <div className="worker-panel-head">
            <div>
              <span className="worker-panel-kicker">{activeTab.toUpperCase()} JOBS</span>
              <h3>{tabDataMap[activeTab]?.length || 0} job{tabDataMap[activeTab]?.length !== 1 ? 's' : ''}</h3>
            </div>
          </div>
          {tabDataMap[activeTab]?.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '28px', color: '#6b7c6f', fontSize: '13.5px' }}>
              No {activeTab} jobs yet.
            </div>
          ) : (
            <div className="worker-job-list">
              {tabDataMap[activeTab].map((job, i) => (
                <div
                  key={job.id || i}
                  className="worker-job-row"
                  onClick={() => onNavigate('/worker/job-details')}
                >
                  <div className="job-row-badge">{(job.title || 'JB').slice(0, 2).toUpperCase()}</div>
                  <div className="job-row-info">
                    <strong>{job.title}</strong>
                    <p>👤 {job.customer} &nbsp;•&nbsp; 🕒 {job.date}</p>
                  </div>
                  <span className={pillClass(job.status)}>{job.status}</span>
                  <strong style={{ fontSize: '14px', fontWeight: 800, color: '#0f1c14', marginLeft: '8px' }}>{job.price}</strong>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Apply Modal */}
      {applyModalJob && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)', zIndex: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
        }}>
          <div style={{
            background: '#fff', borderRadius: '20px', padding: '28px',
            maxWidth: '520px', width: '100%', maxHeight: '90vh', overflowY: 'auto',
            boxShadow: '0 24px 80px rgba(0,0,0,0.25)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#047857', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                  JOB APPLICATION
                </span>
                <h3 style={{ margin: '4px 0 0', fontSize: '19px', fontWeight: 900, color: '#0f172a' }}>
                  Apply to {applyModalJob.company}
                </h3>
              </div>
              <button
                style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#64748b' }}
                onClick={() => setApplyModalJob(null)}
              >
                ✕
              </button>
            </div>

            <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '14px', marginBottom: '18px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
                {applyModalJob.title}
              </div>
              <div style={{ fontSize: '12.5px', color: '#64748b' }}>
                📍 {applyModalJob.location} &nbsp;•&nbsp; Standard Budget: <strong>{applyModalJob.rate}</strong>
              </div>
            </div>

            <form onSubmit={handleSubmitApply} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Applicant Name &amp; Trade
                </label>
                <input
                  type="text"
                  disabled
                  value={`${workerName} (${workerService})`}
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: '10px',
                    border: '1.5px solid #cbd5e1', background: '#f1f5f9', color: '#475569', fontSize: '13.5px', fontWeight: 600
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Your Expected Daily Wage / Rate
                </label>
                <input
                  type="text"
                  required
                  value={applyRate}
                  onChange={(e) => setApplyRate(e.target.value)}
                  placeholder="e.g. ₹800/day"
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: '10px',
                    border: '1.5px solid #94a3b8', fontSize: '14px', fontWeight: 600, color: '#0f172a', outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Pitch Note for Employer
                </label>
                <textarea
                  rows={3}
                  value={applyNotes}
                  onChange={(e) => setApplyNotes(e.target.value)}
                  placeholder="Briefly state your trade experience, availability and tools..."
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: '10px',
                    border: '1.5px solid #94a3b8', fontSize: '13px', color: '#0f172a', outline: 'none', resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="submit"
                  className="wk-btn-success"
                  style={{ flex: 1, padding: '12px', fontSize: '14px', fontWeight: 800 }}
                >
                  Submit Application Now →
                </button>
                <button
                  type="button"
                  className="wk-btn-outline"
                  onClick={() => setApplyModalJob(null)}
                  style={{ padding: '12px 18px', fontSize: '13px' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Job Detail Modal */}
      {detailJob && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div style={{
            background: '#fff', borderRadius: '20px', padding: '28px',
            maxWidth: '540px', width: '100%', maxHeight: '90vh', overflowY: 'auto',
            boxShadow: '0 24px 80px rgba(0,0,0,0.25)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#16a34a', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                  {detailJob.id} &nbsp;•&nbsp; {detailJob.category}
                </span>
                <h2 style={{ margin: '4px 0 0', fontSize: '20px', fontWeight: 900, color: '#0f172a' }}>{detailJob.title}</h2>
              </div>
              <button
                style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#6b7c6f', padding: '4px' }}
                onClick={() => setDetailJob(null)}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
              {[
                { label: 'Company / Employer', val: detailJob.company || 'Direct Client' },
                { label: 'Location',          val: detailJob.location || detailJob.area },
                { label: 'Offered Rate',       val: detailJob.rate || detailJob.budget },
                { label: 'Duration',          val: detailJob.duration || 'Flexible' },
                { label: 'Working Hours',     val: detailJob.workingHours || 'Standard Day Shift' },
                { label: 'Workers Needed',     val: `${detailJob.workersNeeded || 1} required (${detailJob.workersFilled || 0} hired)` },
              ].map((d) => (
                <div key={d.label} style={{ background: '#f8fafc', borderRadius: '8px', padding: '10px 12px', border: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: '10.5px', color: '#64748b', fontWeight: 700, marginBottom: '2px' }}>{d.label}</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{d.val}</div>
                </div>
              ))}
            </div>

            {detailJob.skills && (
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', marginBottom: '6px' }}>SKILLS REQUIRED</div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {detailJob.skills.map((s) => (
                    <span key={s} style={{ background: 'rgba(22,163,74,0.1)', color: '#16a34a', padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 600 }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {detailJob.facilities && (
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', marginBottom: '6px' }}>PERKS &amp; FACILITIES</div>
                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: '#334155' }}>
                  {detailJob.facilities.map((fac) => (
                    <li key={fac} style={{ marginBottom: '4px' }}>{fac}</li>
                  ))}
                </ul>
              </div>
            )}

            <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '14px', marginBottom: '20px', borderLeft: '3px solid #16a34a' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', marginBottom: '6px' }}>JOB DESCRIPTION</div>
              <p style={{ margin: 0, fontSize: '13.5px', lineHeight: 1.7, color: '#334155' }}>{detailJob.description}</p>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              {appliedJobIds.has(detailJob.id) ? (
                <span style={{ flex: 1, textAlign: 'center', padding: '12px', background: '#ecfdf5', color: '#059669', borderRadius: '10px', fontWeight: 700, border: '1px solid #a7f3d0' }}>
                  ✓ Application Already Sent
                </span>
              ) : (
                <button
                  className="wk-btn-success"
                  style={{ flex: 1, padding: '12px' }}
                  onClick={() => {
                    const jobToApply = detailJob
                    setDetailJob(null)
                    handleOpenApplyModal(jobToApply)
                  }}
                >
                  Apply for This Job →
                </button>
              )}
              <button className="wk-btn-outline" onClick={() => setDetailJob(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </WorkerLayout>
  )
}
