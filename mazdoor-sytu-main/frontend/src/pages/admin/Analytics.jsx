import AdminLayout from './AdminLayout'

export default function AdminAnalytics({ onNavigate, onLogout }) {
  const tradeDistribution = [
    { trade: 'Electricians', percentage: 28, count: '412 jobs', color: '#7c3aed' },
    { trade: 'Plumbers', percentage: 24, count: '354 jobs', color: '#06b6d4' },
    { trade: 'Appliance Repair', percentage: 18, count: '265 jobs', color: '#10b981' },
    { trade: 'Masons & Helpers', percentage: 16, count: '235 jobs', color: '#f59e0b' },
    { trade: 'Carpentry & Welding', percentage: 14, count: '206 jobs', color: '#ec4899' },
  ]

  const monthlyGrowth = [
    { month: 'Apr', value: 45 },
    { month: 'May', value: 58 },
    { month: 'Jun', value: 68 },
    { month: 'Jul', value: 74 },
    { month: 'Aug', value: 88 },
    { month: 'Sep', value: 100 },
  ]

  const regionalBreakdown = [
    { city: 'Meerut Urban & Cantt', share: '38%', activeJobs: 84 },
    { city: 'Ghaziabad & Indirapuram', share: '26%', activeJobs: 56 },
    { city: 'Noida & Greater Noida', share: '22%', activeJobs: 48 },
    { city: 'Modinagar & Muradnagar', share: '14%', activeJobs: 30 },
  ]

  return (
    <AdminLayout
      title="Platform Operations Analytics"
      subtitle="High-level operational metrics, trade volume distributions, and regional expansion data"
      currentPath="/admin/analytics"
      onNavigate={onNavigate}
      onLogout={onLogout}
    >
      {/* ── Metric Snapshot ── */}
      <div className="admin-metrics-row">
        <div className="admin-metric-card">
          <div className="admin-metric-label">Order Fulfillment Rate</div>
          <div className="admin-metric-value" style={{ color: '#34d399' }}>96.4%</div>
          <div className="admin-metric-sub positive">+1.8% vs last month</div>
        </div>
        <div className="admin-metric-card">
          <div className="admin-metric-label">Avg. Worker Arrival (Real-time)</div>
          <div className="admin-metric-value">14.2 min</div>
          <div className="admin-metric-sub positive">2.1 min faster than benchmark</div>
        </div>
        <div className="admin-metric-card">
          <div className="admin-metric-label">Worker Retention Rate</div>
          <div className="admin-metric-value">91.2%</div>
          <div className="admin-metric-sub positive">Consistent repeat availability</div>
        </div>
        <div className="admin-metric-card">
          <div className="admin-metric-label">Dispute Ratio</div>
          <div className="admin-metric-value" style={{ color: '#38bdf8' }}>0.48%</div>
          <div className="admin-metric-sub">Under 1 in 200 orders</div>
        </div>
      </div>

      {/* ── Two Column Charts & Breakdown ── */}
      <div className="admin-dashboard-split">
        {/* Left: Monthly Volume Bar Chart Simulation */}
        <div className="admin-feed-card">
          <div className="admin-feed-header">
            <h3>Monthly Platform Volume Growth (2026)</h3>
            <span style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 700 }}>+122% H1 vs H2</span>
          </div>

          <div style={{ height: '220px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '16px', padding: '20px 10px 0' }}>
            {monthlyGrowth.map((g) => (
              <div key={g.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '6px' }}>{g.value}%</span>
                <div
                  style={{
                    width: '100%',
                    maxWidth: '48px',
                    height: `${g.value}%`,
                    background: g.month === 'Sep' ? 'linear-gradient(180deg, #a78bfa 0%, #7c3aed 100%)' : 'rgba(124, 58, 237, 0.35)',
                    borderRadius: '8px 8px 0 0',
                    border: '1px solid rgba(124, 58, 237, 0.4)',
                    boxShadow: g.month === 'Sep' ? '0 0 16px rgba(124, 58, 237, 0.4)' : 'none',
                    transition: 'height 0.4s ease'
                  }}
                />
                <span style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 700, marginTop: '8px' }}>{g.month}</span>
              </div>
            ))}
          </div>

          <p style={{ margin: '20px 0 0', fontSize: '0.82rem', color: '#94a3b8', textAlign: 'center' }}>
            Volume represents normalized booking count and business requirements posted across NCR corridors.
          </p>
        </div>

        {/* Right: Trade Volume Distribution */}
        <div className="admin-feed-card">
          <div className="admin-feed-header">
            <h3>Trade Category Share</h3>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>1,471 Bookings</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {tradeDistribution.map((t) => (
              <div key={t.trade}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}>
                  <strong style={{ color: '#fff' }}>{t.trade}</strong>
                  <span style={{ color: '#94a3b8' }}>{t.count} ({t.percentage}%)</span>
                </div>
                <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${t.percentage}%`,
                      background: t.color,
                      borderRadius: '999px'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Regional Growth Corridor ── */}
      <div className="admin-feed-card" style={{ marginTop: '24px' }}>
        <div className="admin-feed-header">
          <h3>Geographic Cluster Penetration</h3>
          <span style={{ fontSize: '0.78rem', color: '#38bdf8' }}>Tier-2 & Metro Corridors</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
          {regionalBreakdown.map((r) => (
            <div
              key={r.city}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--admin-border)',
                borderRadius: '10px',
                padding: '16px'
              }}
            >
              <strong style={{ display: 'block', color: '#fff', fontSize: '0.92rem', marginBottom: '4px' }}>
                {r.city}
              </strong>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#a78bfa', margin: '6px 0' }}>
                {r.share}
              </div>
              <span style={{ fontSize: '0.78rem', color: '#34d399' }}>
                {r.activeJobs} Live Workers & Dispatches
              </span>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}
