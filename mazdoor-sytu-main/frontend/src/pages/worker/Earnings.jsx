import { useState } from 'react'
import WorkerLayout from './WorkerLayout'

const TX_HISTORY = [
  { type: 'Job Payment', amount: '+₹1,240', date: 'Today • 11:12 AM', status: 'Credited', job: 'MS-2084', icon: '💰', positive: true },
  { type: 'Withdrawal',  amount: '-₹2,000', date: 'Yesterday • 8:40 PM', status: 'Processed', job: null, icon: '🏦', positive: false },
  { type: 'Job Payment', amount: '+₹690',   date: 'Yesterday • 5:00 PM', status: 'Credited', job: 'MS-2081', icon: '💰', positive: true },
  { type: 'Platform Fee', amount: '-₹55',   date: '18 Sep • 2:50 PM', status: 'Debited', job: null, icon: '📋', positive: false },
  { type: 'Bonus',        amount: '+₹380',  date: '17 Sep • 6:00 PM', status: 'Credited', job: null, icon: '🎁', positive: true },
  { type: 'Job Payment', amount: '+₹520',   date: '16 Sep • 3:30 PM', status: 'Credited', job: 'MS-2054', icon: '💰', positive: true },
]

export default function Earnings({ session, onNavigate, onLogout, workerData }) {
  const earnings = workerData?.earnings || {}
  const wallet   = workerData?.wallet   || {}

  const earningRows = [
    { label: "Today's Earnings",   value: earnings.today  || '₹0', icon: '⚡', color: '#22c55e' },
    { label: 'This Week',          value: earnings.week   || '₹0', icon: '📅', color: '#3b82f6' },
    { label: 'This Month',         value: earnings.month  || '₹0', icon: '📆', color: '#7c3aed' },
    { label: 'Total Earnings',     value: earnings.total  || '₹0', icon: '📈', color: '#d97706' },
    { label: 'Pending Payout',     value: earnings.payout || '₹0', icon: '⏳', color: '#ea580c' },
    { label: 'Available Balance',  value: wallet.balance  || '₹0', icon: '👛', color: '#16a34a' },
  ]

  const breakdown = workerData?.earnings?.breakdown || [
    { label: 'Completed jobs',       amount: '₹2,860', note: '6 jobs' },
    { label: 'Travel reimbursement', amount: '₹180',   note: '2 rides' },
    { label: 'Bonus',                amount: '₹380',   note: 'Referral bonus' },
  ]

  const [withdrawing, setWithdrawing] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [withdrawDone, setWithdrawDone] = useState(false)

  const handleWithdraw = () => {
    setWithdrawDone(true)
    setWithdrawing(false)
    setTimeout(() => setWithdrawDone(false), 5000)
  }

  return (
    <WorkerLayout
      activePath="/worker/earnings"
      session={session}
      workerData={workerData}
      onNavigate={onNavigate}
      onLogout={onLogout}
      title="Earnings & Wallet"
      eyebrow="Worker Portal"
      subtitle="Track your income, pending payouts and withdraw earnings"
    >
      {withdrawDone && (
        <div style={{ background: 'rgba(22,163,74,0.12)', border: '1.5px solid rgba(22,163,74,0.3)', borderRadius: '12px', padding: '14px 18px', color: '#15803d', fontWeight: 600, fontSize: '14px' }}>
          ✓ Withdrawal of ₹{withdrawAmount} initiated! Will be processed within 24 hours.
        </div>
      )}

      {/* Summary Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {earningRows.map(row => (
          <div key={row.label} style={{
            background: '#fff', border: '1px solid #d4dbd6', borderRadius: '16px', padding: '20px',
            display: 'flex', flexDirection: 'column', gap: '8px',
            transition: 'box-shadow 0.18s',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#6b7c6f', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{row.label}</span>
              <span style={{ fontSize: '18px' }}>{row.icon}</span>
            </div>
            <strong style={{ fontSize: '24px', fontWeight: 900, color: row.color, letterSpacing: '-0.5px' }}>{row.value}</strong>
          </div>
        ))}
      </div>

      {/* Breakdown + Withdraw */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Earnings Breakdown */}
        <div className="worker-card-panel">
          <div>
            <span className="worker-panel-kicker">BREAKDOWN</span>
            <h3>Today's income sources</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {breakdown.map((item, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px 14px', background: '#f4f6f4', borderRadius: '10px',
              }}>
                <div>
                  <strong style={{ fontSize: '13.5px', display: 'block' }}>{item.label}</strong>
                  <span style={{ fontSize: '11.5px', color: '#6b7c6f' }}>{item.note}</span>
                </div>
                <strong style={{ fontSize: '15px', color: '#16a34a' }}>{item.amount}</strong>
              </div>
            ))}
          </div>
        </div>

        {/* Withdrawal */}
        <div className="worker-card-panel">
          <div>
            <span className="worker-panel-kicker">WITHDRAW</span>
            <h3>Transfer to bank</h3>
          </div>
          <div style={{ background: '#f4f6f4', borderRadius: '10px', padding: '14px' }}>
            <div style={{ fontSize: '11.5px', color: '#6b7c6f', fontWeight: 600 }}>Linked Account</div>
            <div style={{ fontSize: '14px', fontWeight: 700, marginTop: '4px' }}>🏦 {earnings.bank || 'HDFC••••7591'}</div>
          </div>
          <div style={{ background: 'rgba(217,119,6,0.08)', border: '1.5px solid rgba(217,119,6,0.2)', borderRadius: '10px', padding: '12px 14px' }}>
            <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#d97706' }}>Pending Payout</div>
            <div style={{ fontSize: '20px', fontWeight: 900, color: '#d97706' }}>{earnings.payout || '₹0'}</div>
            <div style={{ fontSize: '11.5px', color: '#6b7c6f' }}>Settles on {earnings.settlementDate || '27 Sep'}</div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#6b7c6f', marginBottom: '6px' }}>Amount to Withdraw</label>
            <input
              type="number"
              placeholder="Enter amount in ₹"
              value={withdrawAmount}
              onChange={e => setWithdrawAmount(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #d4dbd6', fontSize: '14px' }}
            />
          </div>
          <button
            className="wk-btn-success"
            style={{ width: '100%', padding: '12px' }}
            onClick={handleWithdraw}
          >
            💸 Withdraw to Bank
          </button>
          <p style={{ fontSize: '11.5px', color: '#6b7c6f', margin: 0, textAlign: 'center' }}>
            ✓ Instant IMPS • Usually credited within 24 hrs
          </p>
        </div>
      </div>

      {/* Transaction History */}
      <div className="worker-card-panel">
        <div className="worker-panel-head">
          <div>
            <span className="worker-panel-kicker">TRANSACTION HISTORY</span>
            <h3>Recent payments & withdrawals</h3>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {TX_HISTORY.map((tx, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '14px',
              padding: '12px 14px', background: '#fafbfa', borderRadius: '10px',
              border: '1px solid #d4dbd6',
            }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '10px',
                background: tx.positive ? 'rgba(22,163,74,0.1)' : 'rgba(234,88,12,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '18px', flexShrink: 0,
              }}>
                {tx.icon}
              </div>
              <div style={{ flex: 1 }}>
                <strong style={{ fontSize: '13.5px', display: 'block' }}>{tx.type}</strong>
                <span style={{ fontSize: '11.5px', color: '#6b7c6f' }}>
                  {tx.date} {tx.job ? `• ${tx.job}` : ''}
                </span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <strong style={{ fontSize: '15px', color: tx.positive ? '#16a34a' : '#ea580c' }}>{tx.amount}</strong>
                <div style={{ fontSize: '10.5px', color: '#6b7c6f' }}>{tx.status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </WorkerLayout>
  )
}
