import { useState } from 'react'
import BusinessLayout from './BusinessLayout'
import './BusinessPortal.css'

const INITIAL_TRANSACTIONS = [
  {
    id: 'TXN-2026-904',
    orderId: 'ORD-2026-884',
    label: 'PEB Roof Truss Structural Welding Settlement',
    site: 'Partapur Shed 4, Meerut',
    date: '23 Sep 2026, 6:40 PM',
    amount: '-₹30,000',
    amountNum: 30000,
    type: 'Debit',
    status: 'Settled',
    method: 'HDFC Bank Escrow Payout',
    gstInvoice: 'INV-MS-2026-4412'
  },
  {
    id: 'TXN-2026-903',
    orderId: 'ORD-2026-881',
    label: 'Commercial Complex Phase 1 — Electrical Milestone 1',
    site: 'Partapur Industrial Area',
    date: '20 Sep 2026, 5:15 PM',
    amount: '-₹18,500',
    amountNum: 18500,
    type: 'Debit',
    status: 'Settled',
    method: 'Instant UPI Payout',
    gstInvoice: 'INV-MS-2026-4398'
  },
  {
    id: 'TXN-2026-902',
    orderId: 'ORD-2026-883',
    label: 'Warehouse Loading & Logistics Shift Payout',
    site: 'Transport Nagar, Meerut',
    date: '18 Sep 2026, 11:30 AM',
    amount: '-₹12,600',
    amountNum: 12600,
    type: 'Debit',
    status: 'Settled',
    method: 'Direct Bank Settlement',
    gstInvoice: 'INV-MS-2026-4355'
  },
  {
    id: 'TXN-2026-901',
    orderId: 'REF-2026-092',
    label: 'Weather Stoppage Wage Adjustment Refund',
    site: 'Ganga Sagar Project',
    date: '15 Sep 2026, 2:10 PM',
    amount: '+₹2,400',
    amountNum: 2400,
    type: 'Credit',
    status: 'Credited',
    method: 'Escrow Refund',
    gstInvoice: 'CRN-MS-2026-018'
  }
]

export default function Payments({ onNavigate, session, onLogout }) {
  const [filterType, setFilterType] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [topupToast, setTopupToast] = useState(null)

  const companyName = session?.companyName || session?.name || 'Apex Infra Ltd.'

  const filteredTxns = INITIAL_TRANSACTIONS.filter((t) => {
    if (filterType === 'Debit' && t.type !== 'Debit') return false
    if (filterType === 'Credit' && t.type !== 'Credit') return false

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const matchLabel = t.label.toLowerCase().includes(q)
      const matchId = t.id.toLowerCase().includes(q)
      const matchOrder = t.orderId.toLowerCase().includes(q)
      if (!matchLabel && !matchId && !matchOrder) return false
    }

    return true
  })

  const handleSimulateTopup = () => {
    setTopupToast('Escrow Balance topped up with ₹50,000 for upcoming payroll milestone!')
    setTimeout(() => setTopupToast(null), 3500)
  }

  return (
    <BusinessLayout
      activePath="/business/payments"
      session={session}
      onNavigate={onNavigate}
      onLogout={onLogout}
      title="Payments, Wages & GST Invoices"
      eyebrow="Financial Operations"
      subtitle="Review daily artisan payroll settlements, downloadable GST compliance invoices and escrow records"
      headerActions={
        <button
          type="button"
          className="biz-btn-primary biz-btn-sm"
          onClick={handleSimulateTopup}
        >
          + Add Escrow Funds
        </button>
      }
    >
      {/* Toast */}
      {topupToast && (
        <div className="biz-toast" role="status">
          <span>✓</span>
          <span>{topupToast}</span>
        </div>
      )}

      {/* KPI Stats */}
      <section className="biz-stats-grid">
        <article className="biz-stat-card">
          <div className="biz-stat-top">
            <span className="biz-stat-label">Total Wages Settled</span>
            <span className="biz-stat-icon">💰</span>
          </div>
          <div className="biz-stat-value" style={{ color: '#047857' }}>₹1,84,500</div>
          <div className="biz-stat-meta">
            <span className="biz-stat-badge emerald">100% Disbursed</span>
            <span>Direct artisan bank & UPI</span>
          </div>
        </article>

        <article className="biz-stat-card">
          <div className="biz-stat-top">
            <span className="biz-stat-label">This Month Outlay</span>
            <span className="biz-stat-icon">📅</span>
          </div>
          <div className="biz-stat-value">₹46,200</div>
          <div className="biz-stat-meta">
            <span className="biz-stat-badge blue">4 Active Projects</span>
            <span>September 2026</span>
          </div>
        </article>

        <article className="biz-stat-card">
          <div className="biz-stat-top">
            <span className="biz-stat-label">Escrow Available</span>
            <span className="biz-stat-icon">🛡️</span>
          </div>
          <div className="biz-stat-value" style={{ color: '#2563eb' }}>₹68,400</div>
          <div className="biz-stat-meta">
            <span className="biz-stat-badge emerald">Protected</span>
            <span>Ready for milestone release</span>
          </div>
        </article>

        <article className="biz-stat-card">
          <div className="biz-stat-top">
            <span className="biz-stat-label">GST Input Tax Credit</span>
            <span className="biz-stat-icon">📑</span>
          </div>
          <div className="biz-stat-value">₹33,210</div>
          <div className="biz-stat-meta">
            <span className="biz-stat-badge emerald">18% GST</span>
            <span>B2B Invoiced</span>
          </div>
        </article>
      </section>

      {/* Filter and Search Bar */}
      <div className="biz-filter-bar">
        <div className="biz-search-input-wrap">
          <span className="biz-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search transactions by title, order number or site..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {['All', 'Debit', 'Credit'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFilterType(type)}
              style={{
                padding: '7px 16px',
                borderRadius: '8px',
                border: `1.5px solid ${filterType === type ? '#047857' : '#cbd5e1'}`,
                background: filterType === type ? '#ecfdf5' : '#ffffff',
                color: filterType === type ? '#047857' : '#475569',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {type === 'All' ? 'All Transactions' : type === 'Debit' ? 'Payouts (Debit)' : 'Credits & Refunds'}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Table Panel */}
      <section className="biz-panel">
        <div className="biz-panel-heading">
          <div>
            <span className="biz-eyebrow">AUDIT TRAIL</span>
            <h3>Workforce Settlement Ledger ({filteredTxns.length})</h3>
          </div>
          <button
            type="button"
            className="biz-btn-secondary biz-btn-sm"
            onClick={() => {
              alert('Exporting settlement ledger to CSV spreadsheet…')
            }}
          >
            📥 Export to CSV / Excel
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredTxns.map((txn) => {
            const isCredit = txn.type === 'Credit'

            return (
              <div
                key={txn.id}
                style={{
                  background: 'var(--biz-slate-50)',
                  border: '1px solid var(--biz-slate-200)',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                  flexWrap: 'wrap',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <strong style={{ fontSize: '15px', color: '#0f172a' }}>{txn.label}</strong>
                    <span className={`biz-badge ${isCredit ? 'active' : 'blue'}`}>{txn.type}</span>
                    <span style={{ fontSize: '11.5px', color: '#64748b' }}>{txn.id}</span>
                  </div>
                  <p style={{ margin: '3px 0 0', fontSize: '12.5px', color: '#64748b' }}>
                    📍 {txn.site} • 🕒 {txn.date} • Method: {txn.method}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <strong
                      style={{
                        fontSize: '18px',
                        color: isCredit ? '#047857' : '#0f172a',
                        display: 'block',
                      }}
                    >
                      {txn.amount}
                    </strong>
                    <small style={{ color: '#047857', fontWeight: 700 }}>✓ {txn.status}</small>
                  </div>

                  <button
                    type="button"
                    className="biz-btn-secondary biz-btn-sm"
                    onClick={() => setSelectedInvoice(txn)}
                  >
                    🧾 GST Invoice
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── GST Tax Invoice Modal ── */}
      {selectedInvoice && (
        <div
          className="biz-modal-overlay"
          onClick={() => setSelectedInvoice(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="biz-modal-box" style={{ maxWidth: '680px' }} onClick={(e) => e.stopPropagation()}>
            <div className="biz-modal-header">
              <div>
                <h2>GST Tax Invoice — {selectedInvoice.gstInvoice}</h2>
                <p>Tax Compliant Service Statement • Mazdoor Sytu Enterprise</p>
              </div>
              <button
                type="button"
                className="biz-modal-close"
                onClick={() => setSelectedInvoice(null)}
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>

            <div className="biz-modal-body">
              {/* B2B Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid #e2e8f0' }}>
                <div>
                  <small style={{ color: '#64748b', textTransform: 'uppercase', fontSize: '11px', fontWeight: 800 }}>
                    Billed To Contractor
                  </small>
                  <strong style={{ fontSize: '15px', color: '#0f172a', display: 'block' }}>
                    {companyName}
                  </strong>
                  <span style={{ fontSize: '12.5px', color: '#64748b' }}>
                    GSTIN: 09AAICA1234F1Z5 • Meerut, UP
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <small style={{ color: '#64748b', textTransform: 'uppercase', fontSize: '11px', fontWeight: 800 }}>
                    Service Platform Provider
                  </small>
                  <strong style={{ fontSize: '15px', color: '#047857', display: 'block' }}>
                    Mazdoor Sytu Private Limited
                  </strong>
                  <span style={{ fontSize: '12.5px', color: '#64748b' }}>
                    GSTIN: 07AAECM9876Q1Z9 • New Delhi
                  </span>
                </div>
              </div>

              {/* Line Items */}
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                    {selectedInvoice.label} (Order #{selectedInvoice.orderId})
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: 800 }}>
                    {selectedInvoice.amount.replace('-', '')}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  SAC Code: 998519 (Support services of personnel placement) • Site: {selectedInvoice.site}
                </div>
              </div>

              {/* Tax Breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                  <span>Taxable Base Amount:</span>
                  <span>₹{(selectedInvoice.amountNum / 1.18).toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                  <span>CGST @ 9%:</span>
                  <span>₹{((selectedInvoice.amountNum / 1.18) * 0.09).toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                  <span>SGST @ 9%:</span>
                  <span>₹{((selectedInvoice.amountNum / 1.18) * 0.09).toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '16px', color: '#047857', paddingTop: '8px', borderTop: '1px solid #e2e8f0' }}>
                  <span>Total Settled:</span>
                  <span>{selectedInvoice.amount.replace('-', '')}</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                <button
                  type="button"
                  className="biz-btn-secondary"
                  onClick={() => window.print()}
                >
                  🖨️ Print / Download PDF
                </button>
                <button
                  type="button"
                  className="biz-btn-primary"
                  onClick={() => setSelectedInvoice(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </BusinessLayout>
  )
}
