import { useState, useMemo } from 'react'
import CustomerLayout from './CustomerLayout'
import { loadCustomerStore, addWalletFunds } from '../../data/customerStore'
import PaymentGateway from '../../components/PaymentGateway'
import './CustomerPortal.css'

const PRESETS = [200, 500, 1000, 2000]

export default function Wallet({ session, onNavigate, onLogout }) {
  const [store, setStore] = useState(() => loadCustomerStore())
  const [activeFilter, setActiveFilter] = useState('All')
  const [addMoneyModalOpen, setAddMoneyModalOpen] = useState(false)
  const [selectedAmount, setSelectedAmount] = useState(500)
  const [customAmount, setCustomAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('UPI (Google Pay)')
  const [receiptModalTxn, setReceiptModalTxn] = useState(null)
  const [successMsg, setSuccessMsg] = useState(null)

  const transactions = store.wallet?.transactions || []

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    if (activeFilter === 'All') return transactions
    if (activeFilter === 'Bookings') return transactions.filter((t) => t.category === 'Booking' || t.amount < 0)
    if (activeFilter === 'Top-ups') return transactions.filter((t) => t.category === 'Top-Up')
    if (activeFilter === 'Refunds') return transactions.filter((t) => t.category === 'Refund')
    return transactions
  }, [transactions, activeFilter])

  const handleAddFunds = (e) => {
    e.preventDefault()
    const amountToAdd = customAmount ? parseInt(customAmount, 10) : selectedAmount
    if (!amountToAdd || amountToAdd <= 0) return

    const updated = addWalletFunds(amountToAdd, paymentMethod)
    setStore(updated)
    setAddMoneyModalOpen(false)
    setCustomAmount('')
    setSuccessMsg(`✓ ₹${amountToAdd} successfully added to your Mazdoor Wallet via ${paymentMethod}!`)
    setTimeout(() => setSuccessMsg(null), 5000)
  }

  return (
    <CustomerLayout
      activePath="/customer/wallet"
      session={session}
      onNavigate={onNavigate}
      onLogout={onLogout}
      title="Wallet & Payments"
      eyebrow="Customer Portal"
      subtitle="Manage your Mazdoor Wallet balance, top-ups, refund ledger and invoice receipts"
      headerActions={
        <button
          type="button"
          className="btn-primary-action"
          style={{ flex: 'none' }}
          onClick={() => setAddMoneyModalOpen(true)}
        >
          <span>+ Add Money</span>
        </button>
      }
    >
      {/* ---------------- Success Alert ---------------- */}
      {successMsg && (
        <div
          style={{
            background: '#f0fff4',
            border: '1px solid #9ae6b4',
            color: '#22543d',
            padding: '12px 18px',
            borderRadius: '12px',
            marginBottom: '20px',
            fontSize: '13.5px',
            fontWeight: '600'
          }}
        >
          {successMsg}
        </div>
      )}

      {/* ---------------- 1. Balance Hero Card ---------------- */}
      <div className="wallet-hero-card">
        <div>
          <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--orange, #e97447)' }}>
            AVAILABLE WALLET BALANCE
          </span>
          <div className="wallet-balance-amount">
            ₹{store.wallet?.balance?.toLocaleString() || '2,850'}
          </div>
          <div className="wallet-breakdown-row">
            <span>🎁 Promotional Credits: <strong>₹{store.wallet?.promotionalCredit || 200}</strong></span>
            <span>•</span>
            <span>⚡ Zero Convenience Fees</span>
            <span>•</span>
            <span>🛡️ 100% Escrow Protected</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            className="btn-banner-action"
            onClick={() => setAddMoneyModalOpen(true)}
          >
            <span>+ Add Funds to Wallet</span>
            <span>↗</span>
          </button>
        </div>
      </div>

      {/* ---------------- 2. Quick Presets Bar ---------------- */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid var(--line, #d9d8cd)',
          borderRadius: '16px',
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--ink, #16221d)' }}>
          Quick Top-Up Presets:
        </span>
        <div style={{ display: 'flex', gap: '10px' }}>
          {PRESETS.map((amt) => (
            <button
              key={amt}
              type="button"
              className="btn-secondary-action"
              onClick={() => {
                setSelectedAmount(amt)
                setCustomAmount('')
                setAddMoneyModalOpen(true)
              }}
            >
              + ₹{amt}
            </button>
          ))}
        </div>
      </div>

      {/* ---------------- 3. Transaction History Section ---------------- */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <span className="eyebrow" style={{ fontSize: '11px', color: 'var(--orange, #e97447)' }}>
            PAYMENT LEDGER
          </span>
          <h3 style={{ margin: '2px 0 0', fontSize: '18px', color: 'var(--ink, #16221d)' }}>
            Transaction History
          </h3>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {['All', 'Bookings', 'Top-ups', 'Refunds'].map((tab) => (
            <button
              key={tab}
              type="button"
              className={`tag-btn ${activeFilter === tab ? 'selected' : ''}`}
              onClick={() => setActiveFilter(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="transaction-table">
        {filteredTransactions.map((txn) => {
          const isCredit = txn.amount > 0
          return (
            <div className="transaction-row" key={txn.id}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: isCredit ? '#f0fff4' : '#fff5f5',
                    color: isCredit ? '#2a7c3d' : '#c53030',
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: '16px',
                    fontWeight: '700'
                  }}
                >
                  {isCredit ? '↓' : '↑'}
                </div>

                <div>
                  <strong style={{ fontSize: '14px', color: 'var(--ink, #16221d)', display: 'block' }}>
                    {txn.title}
                  </strong>
                  <div style={{ fontSize: '12px', color: 'var(--muted, #68736d)', marginTop: '2px' }}>
                    <span>{txn.date}</span>
                    <span> • </span>
                    <span>Method: {txn.method}</span>
                    <span> • </span>
                    <span style={{ color: '#2a7c3d', fontWeight: '600' }}>✓ {txn.status}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span className={isCredit ? 'amount-positive' : 'amount-negative'}>
                  {isCredit ? `+₹${txn.amount}` : `-₹${Math.abs(txn.amount)}`}
                </span>

                <button
                  type="button"
                  className="btn-secondary-action"
                  style={{ fontSize: '11.5px', padding: '4px 10px' }}
                  onClick={() => setReceiptModalTxn(txn)}
                >
                  Receipt
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* ---------------- Add Money Modal ---------------- */}
      {addMoneyModalOpen && (
        <div className="portal-modal-backdrop">
          <div className="portal-modal-card" style={{ maxWidth: '520px' }}>
            <div className="portal-modal-header">
              <div>
                <h3>Add Money to Mazdoor Wallet</h3>
                <p style={{ margin: '2px 0 0', fontSize: '13px', color: 'var(--muted,#68736d)' }}>
                  Adding: ₹{customAmount || selectedAmount}
                </p>
              </div>
              <button
                type="button"
                className="portal-modal-close"
                onClick={() => setAddMoneyModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="portal-modal-body">
              {/* Amount Selector */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '8px' }}>
                  Select Amount to Add:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '10px' }}>
                  {PRESETS.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => { setSelectedAmount(amt); setCustomAmount('') }}
                      style={{
                        padding: '10px 4px',
                        border: `2px solid ${selectedAmount === amt && !customAmount ? 'var(--orange,#e97447)' : 'var(--line,#d9d8cd)'}`,
                        borderRadius: '10px',
                        background: selectedAmount === amt && !customAmount ? '#fff5f0' : '#fff',
                        fontWeight: '700',
                        fontSize: '13.5px',
                        cursor: 'pointer',
                        color: selectedAmount === amt && !customAmount ? 'var(--orange,#e97447)' : 'var(--ink,#16221d)'
                      }}
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="Or enter custom amount in ₹"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: `1.5px solid ${customAmount ? 'var(--orange,#e97447)' : 'var(--line,#d9d8cd)'}`,
                    fontSize: '13.5px'
                  }}
                />
              </div>

              {/* Payment Gateway */}
              <PaymentGateway
                amount={customAmount ? parseInt(customAmount, 10) : selectedAmount}
                walletBalance={store.wallet?.balance || 0}
                onConfirm={(method, detail) => {
                  const amountToAdd = customAmount ? parseInt(customAmount, 10) : selectedAmount
                  if (!amountToAdd || amountToAdd <= 0) return
                  const updated = addWalletFunds(amountToAdd, method)
                  setStore(updated)
                  setAddMoneyModalOpen(false)
                  setCustomAmount('')
                  setSuccessMsg(`✓ ₹${amountToAdd} successfully added to your Mazdoor Wallet via ${method}!`)
                  setTimeout(() => setSuccessMsg(null), 5000)
                }}
                onCancel={() => setAddMoneyModalOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* ---------------- Receipt Modal ---------------- */}
      {receiptModalTxn && (
        <div className="portal-modal-backdrop">
          <div className="portal-modal-card">
            <div className="portal-modal-header">
              <h3>Transaction Receipt #{receiptModalTxn.id}</h3>
              <button
                type="button"
                className="portal-modal-close"
                onClick={() => setReceiptModalTxn(null)}
              >
                ✕
              </button>
            </div>

            <div className="portal-modal-body">
              <div style={{ textAlign: 'center', padding: '10px 0' }}>
                <span style={{ fontSize: '36px' }}>🧾</span>
                <h3 style={{ margin: '8px 0 2px', fontSize: '22px' }}>
                  {receiptModalTxn.amount > 0 ? `+₹${receiptModalTxn.amount}` : `-₹${Math.abs(receiptModalTxn.amount)}`}
                </h3>
                <span style={{ color: '#2a7c3d', fontWeight: '700', fontSize: '13px' }}>
                  ✓ Payment {receiptModalTxn.status}
                </span>
              </div>

              <div
                style={{
                  background: '#faf8f3',
                  border: '1px solid var(--line, #d9d8cd)',
                  borderRadius: '12px',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  fontSize: '13px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--muted, #68736d)' }}>Transaction ID:</span>
                  <strong>{receiptModalTxn.id}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--muted, #68736d)' }}>Description:</span>
                  <strong>{receiptModalTxn.title}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--muted, #68736d)' }}>Date & Time:</span>
                  <strong>{receiptModalTxn.date}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--muted, #68736d)' }}>Payment Mode:</span>
                  <strong>{receiptModalTxn.method}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--muted, #68736d)' }}>Tax & Fees:</span>
                  <strong>₹0.00 (Zero Fee)</strong>
                </div>
              </div>
            </div>

            <div className="portal-modal-footer">
              <button
                type="button"
                className="btn-secondary-action"
                onClick={() => alert('Receipt downloaded as PDF!')}
              >
                📥 Download PDF
              </button>
              <button
                type="button"
                className="btn-primary-action"
                onClick={() => setReceiptModalTxn(null)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </CustomerLayout>
  )
}
