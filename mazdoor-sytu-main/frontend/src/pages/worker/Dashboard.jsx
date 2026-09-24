import { useState } from 'react'
import WorkerLayout from './WorkerLayout'

// ── Static sample notifications ──────────────────────────────────
const NOTIFICATIONS = [
  { id: 1, icon: '💼', title: 'New Job Request', text: 'Ceiling fan repair – 1.8 km away', time: '2 min ago', color: 'rgba(234,88,12,0.1)' },
  { id: 2, icon: '✅', title: 'Booking Confirmed', text: 'Switch wiring fix – Kamal Singh confirmed', time: '18 min ago', color: 'rgba(22,163,74,0.1)' },
  { id: 3, icon: '💰', title: 'Payment Received', text: '₹1,240 credited to your wallet', time: '1 hr ago', color: 'rgba(37,99,235,0.1)' },
  { id: 4, icon: '⭐', title: 'New Review', text: 'Neha Gupta gave you ★★★★★', time: '2 hrs ago', color: 'rgba(217,119,6,0.1)' },
]

// ── Availability options ──────────────────────────────────────────
const AV_OPTIONS = [
  { key: 'available', label: '🟢 Online',        color: '#22c55e' },
  { key: 'offline',   label: '⚫ Offline',       color: '#94a3b8' },
  { key: 'busy',      label: '🔴 Busy',          color: '#ef4444' },
  { key: 'onjob',     label: '🔵 On Job',        color: '#3b82f6' },
  { key: 'temp',      label: '🔷 Unavailable',   color: '#a855f7' },
]

export default function Dashboard({
  session,
  onNavigate,
  onLogout,
  workerData,
  onAvailabilityToggle,
  onJobDecision,
}) {
  const [availability, setAvailability] = useState(workerData?.availability || 'offline')
  const [activeTab, setActiveTab] = useState('requests')
  const [dismissedNotifs, setDismissedNotifs] = useState([])

  const workerName = session?.name || workerData?.profile?.name || 'Rahul Kumar'
  const firstName  = workerName.split(' ')[0]

  const getGreeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const getToday = () =>
    new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  // ── Derived data ──
  const jobRequests  = workerData?.jobRequests   || []
  const acceptedJobs = workerData?.acceptedJobs  || []
  const upcomingJobs = workerData?.upcomingJobs  || []
  const completedJobs= workerData?.completedJobs || []
  const reviews      = workerData?.reviews       || []
  const earnings     = workerData?.earnings      || {}
  const wallet       = workerData?.wallet        || {}

  const activeJob    = acceptedJobs.find(j => j.status === 'Active')
  const totalJobs    = completedJobs.length
  const avgRating    = reviews.length
    ? (reviews.reduce((a, r) => a + parseFloat(r.rating.replace(/[^\d.]/g, '').slice(0,3)), 0) / reviews.length).toFixed(1)
    : '4.8'

  // ── Stats ──
  const stats = [
    { label: 'New Requests',  value: String(jobRequests.length).padStart(2,'0'), icon: '💼', iconClass: 'stat-icon-orange', note: 'Waiting for response' },
    { label: "Today's Earn", value: earnings.today || '₹0',   icon: '💰', iconClass: 'stat-icon-green',  note: 'Live today', positive: true },
    { label: 'Completed Jobs',value: String(totalJobs).padStart(2,'0'),    icon: '✅', iconClass: 'stat-icon-blue',   note: 'All verified jobs' },
    { label: 'Overall Rating', value: `${avgRating} ★`,                   icon: '⭐', iconClass: 'stat-icon-gold',   note: `${reviews.length} reviews` },
    { label: 'Wallet Balance', value: wallet.balance || '₹0', icon: '👛', iconClass: 'stat-icon-purple', note: 'Available balance' },
    { label: 'Pending Payout', value: earnings.payout || '₹0',icon: '⏳', iconClass: 'stat-icon-orange', note: `Settles ${earnings.settlementDate || 'soon'}` },
    { label: 'Total Earnings', value: earnings.total || '₹0', icon: '📈', iconClass: 'stat-icon-green',  note: 'Since joining', positive: true },
    { label: 'Upcoming Jobs',  value: String(upcomingJobs.length).padStart(2,'0'), icon: '📅', iconClass: 'stat-icon-blue', note: 'Scheduled ahead' },
  ]

  const handleAvailability = (key) => {
    setAvailability(key)
    if (onAvailabilityToggle) onAvailabilityToggle(key)
  }

  const tabData = {
    requests:  jobRequests,
    active:    acceptedJobs,
    upcoming:  upcomingJobs,
    completed: completedJobs,
  }
  const visibleJobs = tabData[activeTab] || []

  const pillClass = (status) => {
    if (!status) return 'worker-status-pill pill-pending'
    const s = status.toLowerCase()
    if (s === 'active' || s === 'in progress') return 'worker-status-pill pill-active'
    if (s === 'accepted')  return 'worker-status-pill pill-accepted'
    if (s === 'scheduled') return 'worker-status-pill pill-scheduled'
    if (s === 'completed') return 'worker-status-pill pill-completed'
    return 'worker-status-pill pill-pending'
  }

  const visibleNotifs = NOTIFICATIONS.filter(n => !dismissedNotifs.includes(n.id))

  return (
    <WorkerLayout
      activePath="/worker/dashboard"
      session={session}
      workerData={{ ...workerData, availability }}
      onNavigate={onNavigate}
      onLogout={onLogout}
      title="Dashboard"
      eyebrow="Worker Portal"
      subtitle="Your live job feed, earnings and work status"
      headerActions={
        <button
          type="button"
          className="wk-btn-success"
          style={{ padding: '8px 16px', fontSize: '13px' }}
          onClick={() => onNavigate('/worker/jobs')}
        >
          ⚡ Find Jobs
        </button>
      }
    >
      {/* ── 1. Welcome Banner ── */}
      <div className="worker-welcome-banner">
        <div>
          <div className="worker-banner-date">
            <span className="worker-live-dot" />
            Verified Worker Portal • {getToday()}
          </div>
          <h2>{getGreeting()}, {firstName}.</h2>
          <p>
            {activeJob
              ? `Active job: "${activeJob.title}" with ${activeJob.customer}. Tap to open live tracker.`
              : `You have ${jobRequests.length} new job request${jobRequests.length !== 1 ? 's' : ''} waiting. Go online to accept bookings.`}
          </p>
        </div>
        {activeJob ? (
          <button className="worker-banner-action" onClick={() => onNavigate('/worker/active-job')}>
            <span>⚡ Open Live Job</span>
            <span>↗</span>
          </button>
        ) : (
          <button className="worker-banner-action" onClick={() => onNavigate('/worker/jobs')}>
            <span>Browse All Jobs</span>
            <span>↗</span>
          </button>
        )}
      </div>

      {/* ── 2. Stats Grid ── */}
      <div className="worker-stats-grid">
        {stats.map(item => (
          <article className="worker-stat-card" key={item.label}>
            <div className="stat-card-top">
              <span className="stat-card-label">{item.label}</span>
              <span className={`stat-card-icon ${item.iconClass}`}>{item.icon}</span>
            </div>
            <strong className="stat-card-value">{item.value}</strong>
            <span className={`stat-card-note ${item.positive ? 'positive' : ''}`}>{item.note}</span>
          </article>
        ))}
      </div>

      {/* ── 3. Availability Toggle ── */}
      <div className="worker-card-panel">
        <div className="worker-panel-head">
          <div>
            <span className="worker-panel-kicker">AVAILABILITY STATUS</span>
            <h3>Set your current status</h3>
          </div>
          <button className="worker-panel-link" onClick={() => onNavigate('/worker/availability')}>
            Full Settings ↗
          </button>
        </div>
        <div className="worker-av-grid">
          {AV_OPTIONS.map(av => (
            <button
              key={av.key}
              className={`worker-av-btn ${availability === av.key ? 'active' : ''}`}
              style={availability === av.key ? { borderColor: av.color, color: av.color, background: `${av.color}18` } : {}}
              onClick={() => handleAvailability(av.key)}
            >
              {av.label}
            </button>
          ))}
        </div>
        <p style={{ fontSize: '12px', color: '#6b7c6f', margin: 0 }}>
          💡 Go <strong>Online</strong> to receive job requests in your area. Set to <strong>Busy</strong> when you need a break.
        </p>
      </div>

      {/* ── 4. Middle: Jobs + Quick Actions ── */}
      <div className="worker-middle-layout">
        {/* Jobs Panel */}
        <div className="worker-card-panel">
          <div className="worker-panel-head">
            <div>
              <span className="worker-panel-kicker">JOB QUEUE</span>
              <h3>Requests, active &amp; upcoming</h3>
            </div>
            <button className="worker-panel-link" onClick={() => onNavigate('/worker/jobs')}>
              All Jobs ↗
            </button>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { key: 'requests',  label: `New Requests (${jobRequests.length})` },
              { key: 'active',    label: `Active (${acceptedJobs.length})` },
              { key: 'upcoming',  label: `Upcoming (${upcomingJobs.length})` },
              { key: 'completed', label: `Completed (${completedJobs.length})` },
            ].map(t => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '999px',
                  border: activeTab === t.key ? '2px solid #16a34a' : '2px solid #d4dbd6',
                  background: activeTab === t.key ? 'rgba(22,163,74,0.1)' : '#fff',
                  color: activeTab === t.key ? '#16a34a' : '#6b7c6f',
                  fontWeight: 700,
                  fontSize: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Job Cards */}
          {activeTab === 'requests' && visibleJobs.length > 0 && (
            <div className="worker-request-list">
              {visibleJobs.map(job => (
                <div key={job.id} className={`worker-request-row ${job.accent === 'urgent' ? 'urgent' : ''}`}>
                  <div className={`request-avatar ${job.accent === 'urgent' ? 'urgent' : ''}`}>
                    {job.id?.slice(-2) || 'NJ'}
                  </div>
                  <div className="request-info">
                    <strong>{job.title}</strong>
                    <p>👤 {job.customer} &nbsp;•&nbsp; 📍 {job.distance}</p>
                    <p>🕒 {job.time} &nbsp;•&nbsp; 💵 {job.price}</p>
                  </div>
                  <div className="request-actions">
                    <button
                      className="wk-btn-success"
                      style={{ fontSize: '12px', padding: '7px 14px' }}
                      onClick={() => onJobDecision && onJobDecision(job.id, 'accept')}
                    >
                      ✓ Accept
                    </button>
                    <button
                      className="wk-btn-danger"
                      style={{ fontSize: '12px', padding: '7px 14px' }}
                      onClick={() => onJobDecision && onJobDecision(job.id, 'reject')}
                    >
                      ✕ Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab !== 'requests' && (
            <div className="worker-job-list">
              {visibleJobs.length === 0 && (
                <div style={{ textAlign: 'center', padding: '24px', color: '#6b7c6f', fontSize: '13.5px' }}>
                  No {activeTab} jobs right now.
                </div>
              )}
              {visibleJobs.map((job, i) => (
                <div
                  key={job.id || i}
                  className="worker-job-row"
                  onClick={() => onNavigate('/worker/job-details')}
                >
                  <div className="job-row-badge">{(job.title || 'JB').slice(0,2).toUpperCase()}</div>
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

          {activeTab === 'requests' && visibleJobs.length === 0 && (
            <div style={{ textAlign: 'center', padding: '28px', color: '#6b7c6f' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>📭</div>
              <strong style={{ fontSize: '14px' }}>No new job requests</strong>
              <p style={{ fontSize: '13px', margin: '4px 0 0' }}>
                Go <span style={{ color: '#22c55e', fontWeight: 700 }}>Online</span> and browse public jobs to find work.
              </p>
              <button className="wk-btn-primary" style={{ marginTop: '14px' }} onClick={() => onNavigate('/worker/jobs')}>
                Browse Jobs →
              </button>
            </div>
          )}
        </div>

        {/* Quick Actions Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Quick Links */}
          <div className="worker-card-panel" style={{ gap: '12px' }}>
            <div>
              <span className="worker-panel-kicker">QUICK ACCESS</span>
              <h3>Jump to</h3>
            </div>
            {[
              { icon: '⚡', label: 'Live Job Tracker', path: '/worker/active-job', note: activeJob ? `${activeJob.title}` : 'No active job' },
              { icon: '💰', label: 'Earnings & Wallet', path: '/worker/earnings', note: `Today: ${earnings.today || '₹0'}` },
              { icon: '💬', label: 'Messages', path: '/worker/messages', note: `${workerData?.messages?.conversations?.reduce((a,c) => a+(c.unread||0),0) || 0} unread` },
              { icon: '⭐', label: 'My Reviews', path: '/worker/reviews', note: `${avgRating} avg rating` },
              { icon: '👤', label: 'Profile & KYC', path: '/worker/profile', note: workerData?.profile?.verified ? '✓ Verified' : 'Pending KYC' },
              { icon: '🛟', label: 'Support', path: '/worker/support', note: 'Help & complaints' },
            ].map(item => (
              <button
                key={item.path}
                type="button"
                onClick={() => onNavigate(item.path)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 14px', borderRadius: '10px',
                  border: '1.5px solid #d4dbd6', background: '#fafbfa',
                  cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                  width: '100%',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#16a34a'; e.currentTarget.style.background = 'rgba(22,163,74,0.04)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#d4dbd6'; e.currentTarget.style.background = '#fafbfa' }}
              >
                <span style={{ fontSize: '20px', width: '28px', textAlign: 'center' }}>{item.icon}</span>
                <div style={{ flex: 1 }}>
                  <strong style={{ fontSize: '13px', display: 'block', color: '#0f1c14' }}>{item.label}</strong>
                  <span style={{ fontSize: '11.5px', color: '#6b7c6f' }}>{item.note}</span>
                </div>
                <span style={{ color: '#6b7c6f', fontSize: '16px' }}>→</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── 5. Bottom: Earnings + Reviews + Notifications ── */}
      <div className="worker-bottom-layout">
        {/* Earnings Summary */}
        <div className="worker-card-panel">
          <div className="worker-panel-head">
            <div>
              <span className="worker-panel-kicker">EARNINGS</span>
              <h3>Earnings summary</h3>
            </div>
            <button className="worker-panel-link" onClick={() => onNavigate('/worker/earnings')}>View all ↗</button>
          </div>
          <div className="worker-earnings-rows">
            {[
              { label: "Today's earnings",  val: earnings.today  || '₹0',     hi: true },
              { label: 'This week',         val: earnings.week   || '₹0',     hi: false },
              { label: 'This month',        val: earnings.month  || '₹0',     hi: false },
              { label: 'Total earnings',    val: earnings.total  || '₹0',     hi: true },
              { label: 'Pending payout',    val: earnings.payout || '₹0',     hi: false },
              { label: 'Wallet balance',    val: wallet.balance  || '₹0',     hi: true },
            ].map(row => (
              <div key={row.label} className={`worker-earnings-row ${row.hi ? 'highlight' : ''}`}>
                <span>{row.label}</span>
                <strong>{row.val}</strong>
              </div>
            ))}
          </div>
          <button className="wk-btn-primary" style={{ width: '100%' }} onClick={() => onNavigate('/worker/wallet')}>
            💸 Withdraw Earnings
          </button>
        </div>

        {/* Recent Reviews */}
        <div className="worker-card-panel">
          <div className="worker-panel-head">
            <div>
              <span className="worker-panel-kicker">CUSTOMER REVIEWS</span>
              <h3>Recent feedback</h3>
            </div>
            <button className="worker-panel-link" onClick={() => onNavigate('/worker/reviews')}>All reviews ↗</button>
          </div>

          <div className="worker-rating-bar">
            <strong className="worker-rating-big">{avgRating}</strong>
            <div>
              <div className="worker-rating-stars">★★★★★</div>
              <div className="worker-rating-count">{reviews.length} reviews total</div>
            </div>
          </div>

          <div className="worker-review-list">
            {reviews.slice(0, 3).map((rev, i) => (
              <div key={i} className="worker-review-item">
                <div className="worker-review-stars">{rev.rating}</div>
                <p className="worker-review-text">"{rev.text}"</p>
                <div className="worker-review-meta">— {rev.customer} &nbsp;•&nbsp; {rev.date}</div>
              </div>
            ))}
            {reviews.length === 0 && (
              <p style={{ color: '#6b7c6f', fontSize: '13px', textAlign: 'center', padding: '12px 0' }}>
                Complete jobs to receive reviews.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── 6. Notifications ── */}
      <div className="worker-card-panel">
        <div className="worker-panel-head">
          <div>
            <span className="worker-panel-kicker">RECENT ACTIVITY</span>
            <h3>Notifications</h3>
          </div>
          <button className="worker-panel-link" onClick={() => onNavigate('/worker/notifications')}>
            View all ↗
          </button>
        </div>
        <div className="worker-notif-list">
          {visibleNotifs.length === 0 && (
            <p style={{ color: '#6b7c6f', fontSize: '13px' }}>All caught up! No new notifications.</p>
          )}
          {visibleNotifs.map(n => (
            <div key={n.id} className="worker-notif-item" style={{ position: 'relative' }}>
              <div className="worker-notif-icon" style={{ background: n.color }}>{n.icon}</div>
              <div className="worker-notif-text" style={{ flex: 1 }}>
                <strong>{n.title}</strong>
                <span style={{ display: 'block' }}>{n.text}</span>
                <span style={{ fontSize: '10.5px', color: '#94a3b8' }}>{n.time}</span>
              </div>
              <button
                type="button"
                onClick={() => setDismissedNotifs(p => [...p, n.id])}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '16px', padding: '4px' }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

    </WorkerLayout>
  )
}
