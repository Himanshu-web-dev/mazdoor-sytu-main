import { useState } from 'react'
import WorkerLayout from './WorkerLayout'

const DEFAULT_TXS = [
  { id: 'TX-901', type: 'Job Payment', desc: 'Ceiling fan repair (#MS-2084)', amount: '+₹1,240', date: 'Today • 11:12 AM', status: 'Completed', positive: true, mode: 'Online UPI' },
  { id: 'TX-900', type: 'Direct Payout', desc: 'Bank transfer to HDFC •••• 7591', amount: '-₹700', date: 'Yesterday • 8:40 PM', status: 'Processed', positive: false, mode: 'IMPS' },
  { id: 'TX-899', type: 'Platform Safety Fee', desc: 'Insurance & mediation charge (5%)', amount: '-₹55', date: '18 Sep • 2:50 PM', status: 'Debited', positive: false, mode: 'Deduction' },
  { id: 'TX-898', type: 'Job Payment', desc: 'Switch wiring repair (#MS-2054)', amount: '+₹520', date: '17 Sep • 6:30 PM', status: 'Completed', positive: true, mode: 'Cash On Delivery' },
  { id: 'TX-897', type: 'Referral Bonus', desc: 'Invited worker Suresh Electrician', amount: '+₹250', date: '15 Sep • 1:15 PM', status: 'Credited', positive: true, mode: 'Bonus' },
]

export default function WorkerWallet({ session, onNavigate, onLogout, workerData }) {
  const wallet = workerData?.wallet || {
    balance: '₹8,420',
    pendingWithdrawal: '₹1,080',
    lastPayout: '₹2,300',
  }

  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [withdrawMethod, setWithdrawMethod] = useState('bank')
  const [withdrawSuccess, setWithdrawSuccess] = useState(false)
  const [txFilter, setTxFilter] = useState('all')

  const handleWithdraw = (e) => {
    e.preventDefault()
    if (!withdrawAmount || Number(withdrawAmount) <= 0) return
    setWithdrawSuccess(true)
    setTimeout(() => {
      setWithdrawSuccess(false)
      setWithdrawAmount('')
    }, 4000)
  }

  const filteredTxs = DEFAULT_TXS.filter(tx => {
    if (txFilter === 'income') return tx.positive
    if (txFilter === 'payout') return !tx.positive
    return true
  })

  return (
    <WorkerLayout
      activePath="/worker/wallet"
      session={session}
      workerData={workerData}
      onNavigate={onNavigate}
      onLogout={onLogout}
      title="Wallet & Payouts"
      eyebrow="Worker Portal"
      subtitle="Track your collected payments, cash on delivery settlements, and request bank withdrawals"
      headerActions={
        <button
          type="button"
          className="wk-btn-primary"
          style={{ padding: '8px 16px', fontSize: '13px' }}
          onClick={() => onNavigate('/worker/earnings')}
        >
          📈 View Earnings Analytics
        </button>
      }
    >
      {/* 1. Wallet Balance Cards */}
      <div className="worker-stats-grid" style={{ marginBottom: '24px' }}>
        <article className="worker-stat-card">
          <div className="stat-card-top">
            <span className="stat-card-label">AVAILABLE BALANCE</span>
            <span className="stat-card-icon stat-icon-green">👛</span>
          </div>
          <strong className="stat-card-value" style={{ color: '#16a34a' }}>
            {wallet.balance || '₹8,420'}
          </strong>
          <span className="stat-card-note positive">Instant withdrawal eligible</span>
        </article>

        <article className="worker-stat-card">
          <div className="stat-card-top">
            <span className="stat-card-label">PENDING SETTLEMENT</span>
            <span className="stat-card-icon stat-icon-orange">⏳</span>
          </div>
          <strong className="stat-card-value">
            {wallet.pendingWithdrawal || '₹1,080'}
          </strong>
          <span className="stat-card-note">In escrow • Clears tonight</span>
        </article>

        <article className="worker-stat-card">
          <div className="stat-card-top">
            <span className="stat-card-label">LAST PAYOUT</span>
            <span className="stat-card-icon stat-icon-blue">🏦</span>
          </div>
          <strong className="stat-card-value">
            {wallet.lastPayout || '₹2,300'}
          </strong>
          <span className="stat-card-note">Credited to HDFC Bank</span>
        </article>

        <article className="worker-stat-card">
          <div className="stat-card-top">
            <span className="stat-card-label">CASH ON DELIVERY (COD)</span>
            <span className="stat-card-icon stat-icon-purple">💵</span>
          </div>
          <strong className="stat-card-value">
            ₹520
          </strong>
          <span className="stat-card-note">Collected cash from customer</span>
        </article>
      </div>

      {/* 2. Middle Row: Withdraw Panel + Bank Card */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        {/* Withdraw Panel */}
        <div className="worker-card-panel">
          <div className="worker-panel-head">
            <div>
              <span className="worker-panel-kicker">INSTANT TRANSFER</span>
              <h3>Withdraw to Bank Account</h3>
            </div>
            <span style={{ fontSize: '12px', background: 'rgba(22,163,74,0.1)', color: '#16a34a', padding: '3px 8px', borderRadius: '6px', fontWeight: 700 }}>
              0% Fee
            </span>
          </div>

          {withdrawSuccess ? (
            <div style={{ background: 'rgba(22,163,74,0.1)', border: '1.5px solid #16a34a', borderRadius: '10px', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', marginBottom: '6px' }}>🎉</div>
              <strong style={{ color: '#15803d', fontSize: '15px' }}>Withdrawal Request Initiated!</strong>
              <p style={{ margin: '6px 0 0', fontSize: '13px', color: '#166534' }}>
                ₹{withdrawAmount} will be transferred to your selected account within 15 minutes.
              </p>
            </div>
          ) : (
            <form onSubmit={handleWithdraw} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                  Amount to Withdraw (₹)
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="number"
                    min="100"
                    max="50000"
                    placeholder="Enter amount (min ₹100)"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    style={{ flex: 1, padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #d4dbd6', fontSize: '14px' }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setWithdrawAmount('8420')}
                    style={{ padding: '0 14px', borderRadius: '8px', border: '1.5px solid #16a34a', background: 'rgba(22,163,74,0.08)', color: '#16a34a', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}
                  >
                    All (₹8,420)
                  </button>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  Payout Destination
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label
                    style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '10px 12px', borderRadius: '8px', border: withdrawMethod === 'bank' ? '2px solid #16a34a' : '1px solid #d4dbd6',
                      background: withdrawMethod === 'bank' ? 'rgba(22,163,74,0.04)' : '#fff', cursor: 'pointer',
                    }}
                  >
                    <input
                      type="radio"
                      name="payout"
                      checked={withdrawMethod === 'bank'}
                      onChange={() => setWithdrawMethod('bank')}
                    />
                    <div>
                      <strong style={{ fontSize: '13px', display: 'block' }}>🏦 HDFC Bank (•••• 7591)</strong>
                      <small style={{ color: '#6b7c6f' }}>IFSC: HDFC0001234 • Primary Account</small>
                    </div>
                  </label>

                  <label
                    style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '10px 12px', borderRadius: '8px', border: withdrawMethod === 'upi' ? '2px solid #16a34a' : '1px solid #d4dbd6',
                      background: withdrawMethod === 'upi' ? 'rgba(22,163,74,0.04)' : '#fff', cursor: 'pointer',
                    }}
                  >
                    <input
                      type="radio"
                      name="payout"
                      checked={withdrawMethod === 'upi'}
                      onChange={() => setWithdrawMethod('upi')}
                    />
                    <div>
                      <strong style={{ fontSize: '13px', display: 'block' }}>📱 UPI ID (rahul@okhdfcbank)</strong>
                      <small style={{ color: '#6b7c6f' }}>Instant IMPS/UPI Transfer</small>
                    </div>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="wk-btn-success"
                style={{ width: '100%', padding: '12px', fontSize: '14px', marginTop: '4px' }}
              >
                💸 Withdraw Money Now
              </button>
            </form>
          )}
        </div>

        {/* Security & COD Policy */}
        <div className="worker-card-panel">
          <div className="worker-panel-head">
            <div>
              <span className="worker-panel-kicker">SETTLEMENT RULES</span>
              <h3>Payment Protection & COD</h3>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '18px' }}>🛡️</span>
              <div>
                <strong style={{ color: '#0f1c14' }}>Mazdoor Sytu Payment Guarantee</strong>
                <p style={{ margin: '2px 0 0', color: '#6b7c6f', fontSize: '12.5px' }}>
                  Online bookings are locked in escrow when the customer books. Once you mark work completed, funds are auto-released into your wallet.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '18px' }}>💵</span>
              <div>
                <strong style={{ color: '#0f1c14' }}>Cash On Delivery (COD) Reconciliation</strong>
                <p style={{ margin: '2px 0 0', color: '#6b7c6f', fontSize: '12.5px' }}>
                  When taking cash directly from a customer, simply enter the collected amount in the app. The platform fee is deducted cleanly from your wallet balance.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '18px' }}>⚡</span>
              <div>
                <strong style={{ color: '#0f1c14' }}>Daily Auto-Sweep</strong>
                <p style={{ margin: '2px 0 0', color: '#6b7c6f', fontSize: '12.5px' }}>
                  Any wallet balance over ₹500 is automatically sent to your registered bank account every night at 11:30 PM.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Transaction History */}
      <div className="worker-card-panel">
        <div className="worker-panel-head">
          <div>
            <span className="worker-panel-kicker">LEDGER</span>
            <h3>Transaction History</h3>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            {[
              { id: 'all', label: 'All Transactions' },
              { id: 'income', label: 'Earnings (+)' },
              { id: 'payout', label: 'Payouts & Fees (-)' },
            ].map(f => (
              <button
                key={f.id}
                type="button"
                onClick={() => setTxFilter(f.id)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: txFilter === f.id ? '1.5px solid #16a34a' : '1px solid #d4dbd6',
                  background: txFilter === f.id ? 'rgba(22,163,74,0.1)' : '#fff',
                  color: txFilter === f.id ? '#16a34a' : '#475569',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filteredTxs.map((tx) => (
            <div
              key={tx.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderRadius: '8px',
                border: '1px solid #eef2ef',
                background: '#fafbfa',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: tx.positive ? 'rgba(22,163,74,0.1)' : 'rgba(239,68,68,0.1)',
                    color: tx.positive ? '#16a34a' : '#ef4444',
                    fontWeight: 800,
                    fontSize: '16px',
                  }}
                >
                  {tx.positive ? '↓' : '↑'}
                </span>
                <div>
                  <strong style={{ fontSize: '13.5px', color: '#0f1c14', display: 'block' }}>
                    {tx.type}
                  </strong>
                  <span style={{ fontSize: '12px', color: '#6b7c6f' }}>
                    {tx.desc} • {tx.mode}
                  </span>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <strong
                  style={{
                    fontSize: '15px',
                    fontWeight: 800,
                    color: tx.positive ? '#16a34a' : '#0f1c14',
                    display: 'block',
                  }}
                >
                  {tx.amount}
                </strong>
                <small style={{ fontSize: '11px', color: '#94a3b8' }}>{tx.date}</small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </WorkerLayout>
  )
}
