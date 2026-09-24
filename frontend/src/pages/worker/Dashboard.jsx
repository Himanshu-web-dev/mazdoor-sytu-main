import { useState } from 'react'
import WorkerLayout from './WorkerLayout'

const NOTIFICATIONS = [
  { id: 1, icon: '💼', title: 'New Job Request', text: 'Ceiling fan repair – 1.8 km away', time: '2 min ago', color: 'rgba(234,88,12,0.1)' },
  { id: 2, icon: '✅', title: 'Booking Confirmed', text: 'Switch wiring fix – Kamal Singh confirmed', time: '18 min ago', color: 'rgba(22,163,74,0.1)' },
  { id: 3, icon: '💰', title: 'Payment Received', text: '₹1,240 credited to your wallet', time: '1 hr ago', color: 'rgba(37,99,235,0.1)' },
  { id: 4, icon: '⭐', title: 'New Review', text: 'Neha Gupta gave you ★★★★★', time: '2 hrs ago', color: 'rgba(217,119,6,0.1)' },
]

const AV_OPTIONS = [
  { key: 'available', label: '🟢 Online',      color: '#22c55e' },
  { key: 'offline',   label: '⚫ Offline',     color: '#94a3b8' },
  { key: 'busy',      label: '🔴 Busy',        color: '#ef4444' },
  { key: 'onjob',     label: '🔵 On Job',      color: '#3b82f6' },
  { key: 'temp',      label: '🔷 Unavailable', color: '#a855f7' },
]

export default function Dashboard({ session, onNavigate, onLogout, workerData, onAvailabilityToggle, onJobDecision }) {
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

  const todayLabel = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })

  const jobRequests  = workerData?.jobRequests   || []
  const acceptedJobs = workerData?.acceptedJobs  || []
  const upcomingJobs = workerData?.upcomingJobs  || []
  const completedJobs = workerData?.completedJobs || []
  const reviews      = workerData?.reviews       || []
  const earnings     = workerData?.earnings      || {}
  const wallet       = workerData?.wallet        || {}

  const activeJob  = acceptedJobs.find(j => j.status === 'Active')
  const totalJobs  = completedJobs.length
  const getRatingVal = (r) => {
    if (!r || !r.rating) return 5
    if (typeof r.rating === 'number') return r.rating
    const starMatches = (String(r.rating).match(/★/g) || []).length
    if (starMatches > 0) return starMatches
    const parsed = parseFloat(String(r.rating).replace(/[^\d.]/g, ''))
    return isNaN(parsed) ? 5 : parsed
  }
  const avgRating = reviews.length
    ? (reviews.reduce((a, r) => a + getRatingVal(r), 0) / reviews.length).toFixed(1)
    : '4.8'

  const stats = [
    { label: 'New Requests',   value: String(jobRequests.length).padStart(2,'0'), icon: '💼', iconClass: 'stat-icon-orange', note: 'Waiting for response' },
    { label: "Today's Earn",   value: earnings.today || '₹0',                     icon: '💰', iconClass: 'stat-icon-green',  note: 'Live today',       positive: true },
    { label: 'Completed Jobs', value: String(totalJobs).padStart(2,'0'),           icon: '✅', iconClass: 'stat-icon-blue',   note: 'All verified jobs' },
    { label: 'Overall Rating', value: `${avgRating} ★`,                           icon: '⭐', iconClass: 'stat-icon-gold',   note: `${reviews.length} reviews` },
    { label: 'Wallet Balance', value: wallet.balance || '₹0',                     icon: '👛', iconClass: 'stat-icon-purple', note: 'Available balance' },
    { label: 'Pending Payout', value: earnings.payout || '₹0',                   icon: '⏳', iconClass: 'stat-icon-orange', note: `Settles ${earnings.settlementDate || 'soon'}` },
    { label: 'Total Earnings', value: earnings.total || '₹0',                    icon: '📈', iconClass: 'stat-icon-green',  note: 'Since joining',    positive: true },
    { label: 'Upcoming Jobs',  value: String(upcomingJobs.length).padStart(2,'0'),icon: '📅', iconClass: 'stat-icon-blue',  note: 'Scheduled ahead'  },
  ]

  const handleAvailability = (key) => {
    setAvailability(key)
    if (onAvailabilityToggle) onAvailabilityToggle(key)
  }

  const tabData = { requests: jobRequests, active: acceptedJobs, upcoming: upcomingJobs, completed: completedJobs }
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

  const quickLinks = [
    { icon: '⚡', label: 'Live Job Tracker', path: '/worker/active-job',   note: activeJob ? activeJob.title : 'No active job' },
    { icon: '💰', label: 'Earnings & Wallet', path: '/worker/earnings',    note: `Today: ${earnings.today || '₹0'}` },
    { icon: '💬', label: 'Messages',          path: '/worker/messages',    note: `${workerData?.messages?.conversations?.reduce((a,c) => a+(c.unread||0),0)||0} unread` },
    { icon: '⭐', label: 'My Reviews',         path: '/worker/reviews',    note: `${avgRating} avg rating` },
    { icon: '👤', label: 'Profile & KYC',     path: '/worker/profile',     note: workerData?.profile?.verified ? '✓ Verified' : 'Pending KYC' },
    { icon: '🛟', label: 'Support',           path: '/worker/support',     note: 'Help & complaints' },
  ]

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
        <button type="button" className="wk-btn-success" style={{ padding: '8px 16px', fontSize: '13px' }} onClick={() => onNavigate('/worker/jobs')}>
          ⚡ Find Jobs
        </button>
      }
    >
      {/* ── 1. Welcome Banner ── */}
      <div className="worker-welcome-banner">
        <div>
          <div className="worker-banner-date">
            <span className="worker-live-dot" />
            Worker Portal &nbsp;•&nbsp; {todayLabel}
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
            <span>⚡ Open Live Job</span><span>↗</span>
          </button>
        ) : (
          <button className="worker-banner-action" onClick={() => onNavigate('/worker/jobs')}>
            <span>Browse All Jobs</span><span>↗</span>
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
              style={availability === av.key ? { borderColor: av.color, color: av.color, background: `${av.color}1a` } : {}}
              onClick={() => handleAvailability(av.key)}
            >
              {av.label}
            </button>
          ))}
        </div>
        <p className="wk-av-hint">
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
            <button className="worker-panel-link" onClick={() => onNavigate('/worker/jobs')}>All Jobs ↗</button>
          </div>

          {/* Tabs */}
          <div className="wk-tabs">
            {[
              { key: 'requests',  label: `New Requests`, count: jobRequests.length },
              { key: 'active',    label: `Active`,       count: acceptedJobs.length },
              { key: 'upcoming',  label: `Upcoming`,     count: upcomingJobs.length },
              { key: 'completed', label: `Completed`,    count: completedJobs.length },
            ].map(t => (
              <button
                key={t.key}
                className={`wk-tab-btn ${activeTab === t.key ? 'active' : ''}`}
                onClick={() => setActiveTab(t.key)}
              >
                {t.label}
                {t.count > 0 && <span className="wk-tab-count">{t.count}</span>}
              </button>
            ))}
          </div>

          {/* New Request Cards */}
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
                    <button className="wk-btn-success" style={{ fontSize: '12px', padding: '7px 16px' }}
                      onClick={() => onJobDecision && onJobDecision(job.id, 'accept')}>
                      ✓ Accept
                    </button>
                    <button className="wk-btn-danger" style={{ fontSize: '12px', padding: '7px 16px' }}
                      onClick={() => onJobDecision && onJobDecision(job.id, 'reject')}>
                      ✕ Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Other Tab Jobs */}
          {activeTab !== 'requests' && (
            <div className="worker-job-list">
              {visibleJobs.length === 0 && (
                <div className="wk-empty-state">
                  <span className="wk-empty-icon">📭</span>
                  <p>No {activeTab} jobs right now.</p>
                </div>
              )}
              {visibleJobs.map((job, i) => (
                <div key={job.id || i} className="worker-job-row" onClick={() => onNavigate('/worker/job-details')}>
                  <div className="job-row-badge">{(job.title || 'JB').slice(0,2).toUpperCase()}</div>
                  <div className="job-row-info">
                    <strong>{job.title}</strong>
                    <p>👤 {job.customer} &nbsp;•&nbsp; 🕒 {job.date}</p>
                  </div>
                  <span className={pillClass(job.status)}>{job.status}</span>
                  <strong className="job-row-price">{job.price}</strong>
                </div>
              ))}
            </div>
          )}

          {/* Empty requests state */}
          {activeTab === 'requests' && visibleJobs.length === 0 && (
            <div className="wk-empty-state">
              <span className="wk-empty-icon">📭</span>
              <strong>No new job requests</strong>
              <p>Go <span className="wk-green-text">Online</span> and browse public jobs to find work.</p>
              <button className="wk-btn-primary" onClick={() => onNavigate('/worker/jobs')}>Browse Jobs →</button>
            </div>
          )}
        </div>

        {/* Quick Links Panel */}
        <div className="worker-card-panel">
          <div>
            <span className="worker-panel-kicker">QUICK ACCESS</span>
            <h3>Jump to</h3>
          </div>
          <div className="wk-quick-links">
            {quickLinks.map(item => (
              <button key={item.path} type="button" className="wk-quick-link-btn" onClick={() => onNavigate(item.path)}>
                <span className="wk-ql-icon">{item.icon}</span>
                <div className="wk-ql-text">
                  <strong>{item.label}</strong>
                  <span>{item.note}</span>
                </div>
                <span className="wk-ql-arrow">→</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── 5. Bottom: Earnings + Reviews ── */}
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
              { label: "Today's earnings", val: earnings.today  || '₹0', hi: true },
              { label: 'This week',        val: earnings.week   || '₹0', hi: false },
              { label: 'This month',       val: earnings.month  || '₹0', hi: false },
              { label: 'Total earnings',   val: earnings.total  || '₹0', hi: true },
              { label: 'Pending payout',   val: earnings.payout || '₹0', hi: false },
              { label: 'Wallet balance',   val: wallet.balance  || '₹0', hi: true },
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
              <p className="wk-empty-text">Complete jobs to receive reviews.</p>
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
          <button className="worker-panel-link" onClick={() => onNavigate('/worker/notifications')}>View all ↗</button>
        </div>
        <div className="worker-notif-list">
          {visibleNotifs.length === 0 && (
            <p className="wk-empty-text">All caught up! No new notifications.</p>
          )}
          {visibleNotifs.map(n => (
            <div key={n.id} className="worker-notif-item">
              <div className="worker-notif-icon" style={{ background: n.color }}>{n.icon}</div>
              <div className="worker-notif-text">
                <strong>{n.title}</strong>
                <span>{n.text}</span>
                <span className="notif-time">{n.time}</span>
              </div>
              <button type="button" className="wk-notif-dismiss" onClick={() => setDismissedNotifs(p => [...p, n.id])}>✕</button>
            </div>
          ))}
        </div>
      </div>

    </WorkerLayout>
  )
}
