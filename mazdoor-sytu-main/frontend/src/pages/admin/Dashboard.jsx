import { useState, useEffect } from 'react'
import AdminLayout from './AdminLayout'
import { getAdminStore } from '../../data/adminStore'
import { getStoredJobs } from '../../data/jobStore'

export default function AdminDashboard({ onNavigate, onLogout }) {
  const [store, setStore] = useState(() => getAdminStore())
  const [jobs, setJobs] = useState(() => getStoredJobs())

  useEffect(() => {
    const handleUpdate = () => {
      setStore(getAdminStore())
      setJobs(getStoredJobs())
    }
    window.addEventListener('admin_store_updated', handleUpdate)
    return () => window.removeEventListener('admin_store_updated', handleUpdate)
  }, [])

  const pendingKycCount = store.kycQueue.filter((k) => k.status === 'Pending').length
  const openComplaintsCount = store.complaints.filter((c) => c.status === 'Open').length
  const activeJobsCount = jobs.filter((j) => j.status === 'Active').length
  const activeWorkersCount = store.workers.filter((w) => w.status === 'Active').length

  const metrics = [
    { label: 'Active Workers Online', value: store.stats.activeWorkersToday, sub: `${store.stats.verifiedWorkerPercent}% KYC Verified`, positive: true },
    { label: 'Platform Volume', value: store.stats.totalVolume, sub: `${store.stats.monthlyGrowth} MoM growth`, positive: true },
    { label: 'Active Job Openings', value: activeJobsCount, sub: 'Public Jobs Portal live', positive: true },
    { label: 'Pending KYC Approvals', value: pendingKycCount, sub: pendingKycCount > 0 ? 'Requires attention' : 'All clear', alert: pendingKycCount > 0 },
  ]

  const recentActivity = [
    { type: 'kyc', icon: '🛡️', title: 'New KYC Submission', desc: 'Dinesh Yadav submitted Aadhaar & Trade Cert', time: '18 min ago', bg: 'rgba(245, 158, 11, 0.15)' },
    { type: 'biz', icon: '🏢', title: 'New Requirement Posted', desc: 'Apex Infra posted requirement for 12 Helpers', time: '42 min ago', bg: 'rgba(124, 58, 237, 0.15)' },
    { type: 'pay', icon: '💳', title: 'Booking Payment Settled', desc: '₹380 auto-disbursed for Booking #BK-902', time: '1 hour ago', bg: 'rgba(16, 185, 129, 0.15)' },
    { type: 'alert', icon: '⚖️', title: 'Dispute Filed', desc: 'Customer raised high-priority quality dispute', time: '3 hours ago', bg: 'rgba(244, 63, 94, 0.15)' },
  ]

  return (
    <AdminLayout
      title="Platform Command Center"
      subtitle="Comprehensive real-time oversight of Mazdoor Sytu operations"
      currentPath="/admin/dashboard"
      onNavigate={onNavigate}
      onLogout={onLogout}
    >
      {/* ── Top Metrics ── */}
      <div className="admin-metrics-row">
        {metrics.map((m) => (
          <div className="admin-metric-card" key={m.label}>
            <div className="admin-metric-label">
              <span>{m.label}</span>
            </div>
            <div className="admin-metric-value">{m.value}</div>
            <div className={`admin-metric-sub ${m.positive ? 'positive' : ''} ${m.alert ? 'alert' : ''}`}>
              {m.sub}
            </div>
          </div>
        ))}
      </div>

      {/* ── Action Alerts Banner if any ── */}
      {(pendingKycCount > 0 || openComplaintsCount > 0) && (
        <div style={{
          background: 'rgba(245, 158, 11, 0.08)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '1.4rem' }}>⚠️</span>
            <div>
              <strong style={{ color: '#fcd34d', display: 'block', fontSize: '0.92rem' }}>
                Action Items Requiring Administrator Attention
              </strong>
              <span style={{ color: '#94a3b8', fontSize: '0.82rem' }}>
                {pendingKycCount} worker KYC submissions awaiting review • {openComplaintsCount} open customer/worker grievances
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {pendingKycCount > 0 && (
              <button
                className="admin-btn primary"
                onClick={() => onNavigate?.('/admin/verification')}
              >
                Review KYC Queue ({pendingKycCount})
              </button>
            )}
            {openComplaintsCount > 0 && (
              <button
                className="admin-btn danger"
                onClick={() => onNavigate?.('/admin/complaints')}
              >
                View Disputes ({openComplaintsCount})
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Two Column Dashboard Layout ── */}
      <div className="admin-dashboard-split">
        {/* Left: Live Platform Status & Key Shortcuts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Platform Health Matrix */}
          <div className="admin-feed-card">
            <div className="admin-feed-header">
              <h3>Core Platform Entities</h3>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Live Database Records</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
              <div
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--admin-border)',
                  borderRadius: '10px',
                  padding: '14px',
                  cursor: 'pointer'
                }}
                onClick={() => onNavigate?.('/admin/users')}
              >
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Customers</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', margin: '4px 0' }}>{store.users.length}</div>
                <div style={{ fontSize: '0.74rem', color: '#34d399' }}>Active & Registered</div>
              </div>

              <div
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--admin-border)',
                  borderRadius: '10px',
                  padding: '14px',
                  cursor: 'pointer'
                }}
                onClick={() => onNavigate?.('/admin/workers')}
              >
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Workers</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', margin: '4px 0' }}>{store.workers.length}</div>
                <div style={{ fontSize: '0.74rem', color: '#a78bfa' }}>Across 8 Trades</div>
              </div>

              <div
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--admin-border)',
                  borderRadius: '10px',
                  padding: '14px',
                  cursor: 'pointer'
                }}
                onClick={() => onNavigate?.('/admin/businesses')}
              >
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Businesses</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', margin: '4px 0' }}>{store.businesses.length}</div>
                <div style={{ fontSize: '0.74rem', color: '#38bdf8' }}>Verified Employers</div>
              </div>
            </div>
          </div>

          {/* Recent Ledger Snapshot */}
          <div className="admin-feed-card">
            <div className="admin-feed-header">
              <h3>Recent Escrow & Settlements</h3>
              <button
                className="admin-btn secondary"
                onClick={() => onNavigate?.('/admin/payments')}
              >
                All Ledger Records →
              </button>
            </div>
            <div className="admin-table-responsive">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Ref ID</th>
                    <th>Parties</th>
                    <th>Amount</th>
                    <th>Platform Fee</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {store.payments.slice(0, 3).map((p) => (
                    <tr key={p.id}>
                      <td style={{ fontWeight: 700, color: '#a78bfa' }}>{p.id}</td>
                      <td>{p.party}</td>
                      <td style={{ fontWeight: 800, color: '#fff' }}>{p.amount}</td>
                      <td style={{ color: '#34d399' }}>{p.platformFee}</td>
                      <td>
                        <span className={`admin-badge ${p.status.toLowerCase().replace(' ', '_')}`}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: Real-time Activity Feed & System Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="admin-feed-card">
            <div className="admin-feed-header">
              <h3>Live Operations Stream</h3>
              <span style={{ fontSize: '0.74rem', color: '#34d399' }}>● Streaming</span>
            </div>
            <div>
              {recentActivity.map((act, idx) => (
                <div className="admin-feed-item" key={idx}>
                  <div className="admin-feed-icon" style={{ background: act.bg }}>
                    {act.icon}
                  </div>
                  <div className="admin-feed-content">
                    <strong>{act.title}</strong>
                    <p>{act.desc}</p>
                    <time>{act.time}</time>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="admin-feed-card">
            <div className="admin-feed-header">
              <h3>Fast Governance Controls</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                className="admin-btn secondary"
                style={{ width: '100%', justifyContent: 'flex-start', padding: '10px 14px' }}
                onClick={() => onNavigate?.('/admin/verification')}
              >
                <span>🛡️</span> Process KYC Documents
              </button>
              <button
                className="admin-btn secondary"
                style={{ width: '100%', justifyContent: 'flex-start', padding: '10px 14px' }}
                onClick={() => onNavigate?.('/admin/complaints')}
              >
                <span>⚖️</span> Mediate Open Grievances
              </button>
              <button
                className="admin-btn secondary"
                style={{ width: '100%', justifyContent: 'flex-start', padding: '10px 14px' }}
                onClick={() => onNavigate?.('/admin/reviews')}
              >
                <span>⭐</span> Moderate Customer Reviews
              </button>
              <button
                className="admin-btn secondary"
                style={{ width: '100%', justifyContent: 'flex-start', padding: '10px 14px' }}
                onClick={() => onNavigate?.('/admin/analytics')}
              >
                <span>📈</span> View Financial Analytics
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
