import { useState, useEffect } from 'react'
import AdminLayout from './AdminLayout'
import { getAdminStore } from '../../data/adminStore'

export default function AdminPayments({ onNavigate, onLogout }) {
  const [payments, setPayments] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')

  useEffect(() => {
    const load = () => {
      const store = getAdminStore()
      setPayments(store.payments)
    }
    load()
    window.addEventListener('admin_store_updated', load)
    return () => window.removeEventListener('admin_store_updated', load)
  }, [])

  const filtered = payments.filter((p) => {
    const matchesSearch =
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.party.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === 'All' || p.status === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <AdminLayout
      title="Financial Ledger & Escrow Settlement"
      subtitle="Audit platform transactions, monitor escrow reserves, fee deductions, and worker payout disbursements"
      currentPath="/admin/payments"
      onNavigate={onNavigate}
      onLogout={onLogout}
    >
      {/* ── Metric Snapshot ── */}
      <div className="admin-metrics-row">
        <div className="admin-metric-card">
          <div className="admin-metric-label">Escrow Volume</div>
          <div className="admin-metric-value">₹14.82L</div>
          <div className="admin-metric-sub positive">Platform Total GMV</div>
        </div>
        <div className="admin-metric-card">
          <div className="admin-metric-label">Net Platform Fee (Commission)</div>
          <div className="admin-metric-value" style={{ color: '#34d399' }}>₹1.18L</div>
          <div className="admin-metric-sub positive">8%–10% Average Take Rate</div>
        </div>
        <div className="admin-metric-card">
          <div className="admin-metric-label">In-Flight Escrow Reserve</div>
          <div className="admin-metric-value" style={{ color: '#fcd34d' }}>₹42,850</div>
          <div className="admin-metric-sub">Held until job OTP completion</div>
        </div>
        <div className="admin-metric-card">
          <div className="admin-metric-label">Disbursed Worker Payouts</div>
          <div className="admin-metric-value">₹13.22L</div>
          <div className="admin-metric-sub positive">100% On-Time Settlements</div>
        </div>
      </div>

      {/* ── Controls ── */}
      <div className="admin-control-bar">
        <div className="admin-search-wrapper">
          <span className="admin-search-icon">🔍</span>
          <input
            type="text"
            className="admin-search-input"
            placeholder="Search by Tx ID, party, or method…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="admin-filter-group">
          {['All', 'Completed', 'In Escrow', 'Refunded'].map((status) => (
            <button
              key={status}
              type="button"
              className={`admin-filter-pill ${filterStatus === status ? 'active' : ''}`}
              onClick={() => setFilterStatus(status)}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table Card ── */}
      <div className="admin-table-card">
        <div className="admin-table-responsive">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>Transaction ID & Ref</th>
                <th>Parties Involved</th>
                <th>Transfer Type</th>
                <th>Gross Total</th>
                <th>Platform Commission</th>
                <th>Disbursed to Worker</th>
                <th>Payment Channel</th>
                <th>Timestamp</th>
                <th>Settlement Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '36px', color: '#94a3b8' }}>
                    No ledger entries match this criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((tx) => (
                  <tr key={tx.id}>
                    <td>
                      <code style={{ color: '#a78bfa', fontWeight: 800, fontSize: '0.84rem' }}>{tx.id}</code>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Ref: {tx.ref}</div>
                    </td>
                    <td>
                      <strong style={{ color: '#fff', fontSize: '0.84rem' }}>{tx.party}</strong>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>{tx.type}</span>
                    </td>
                    <td>
                      <strong style={{ color: '#fff', fontSize: '0.92rem' }}>{tx.amount}</strong>
                    </td>
                    <td>
                      <span style={{ color: '#34d399', fontWeight: 700 }}>{tx.platformFee}</span>
                    </td>
                    <td>
                      <span style={{ color: '#c4b5fd', fontWeight: 700 }}>{tx.workerPayout}</span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{tx.paymentMethod}</td>
                    <td style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>{tx.date}</td>
                    <td>
                      <span className={`admin-badge ${tx.status.toLowerCase().replace(' ', '_')}`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}
