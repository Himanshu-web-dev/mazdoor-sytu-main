/**
 * PaymentGateway.jsx
 * Full-featured payment selector for Mazdoor Sytu Customer Portal.
 * Supports: UPI, Cards, Net Banking, Wallet, Cash on Delivery (COD)
 */

import { useState } from 'react'

const PAYMENT_METHODS = [
  {
    id: 'upi',
    label: 'UPI Payment',
    icon: '📱',
    badge: 'Instant',
    badgeColor: '#22543d',
    badgeBg: '#f0fff4',
    desc: 'Pay via Google Pay, PhonePe, Paytm or any UPI app',
    options: ['Google Pay', 'PhonePe', 'Paytm', 'BHIM UPI', 'Other UPI']
  },
  {
    id: 'card',
    label: 'Debit / Credit Card',
    icon: '💳',
    badge: 'Secure',
    badgeColor: '#1a365d',
    badgeBg: '#ebf8ff',
    desc: 'Visa, Mastercard, RuPay — 256-bit encrypted',
    options: []
  },
  {
    id: 'netbanking',
    label: 'Net Banking',
    icon: '🏦',
    badge: 'All Banks',
    badgeColor: '#5c4a1e',
    badgeBg: '#fffff0',
    desc: 'SBI, HDFC, ICICI, Axis and 50+ banks',
    options: ['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Punjab National Bank', 'Other Bank']
  },
  {
    id: 'wallet',
    label: 'Mazdoor Wallet',
    icon: '👛',
    badge: '₹2,850 available',
    badgeColor: '#2a7c3d',
    badgeBg: '#f0fff4',
    desc: 'Instant debit from your Mazdoor Sytu wallet balance',
    options: []
  },
  {
    id: 'cod',
    label: 'Cash on Delivery',
    icon: '💵',
    badge: 'COD',
    badgeColor: '#742a2a',
    badgeBg: '#fff5f5',
    desc: 'Pay cash directly to the worker after service is complete',
    options: []
  }
]

const BANKS = [
  'State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank',
  'Punjab National Bank', 'Bank of Baroda', 'Kotak Mahindra Bank', 'Other Bank'
]

/**
 * @param {object} props
 * @param {number} props.amount - Payment amount in ₹
 * @param {function} props.onConfirm - (method: string, detail: string) => void
 * @param {function} props.onCancel - () => void
 * @param {number} props.walletBalance - Current wallet balance
 */
export default function PaymentGateway({ amount = 350, onConfirm, onCancel, walletBalance = 2850 }) {
  const [selectedMethod, setSelectedMethod] = useState('upi')
  const [upiApp, setUpiApp] = useState('Google Pay')
  const [upiId, setUpiId] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [cardName, setCardName] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [selectedBank, setSelectedBank] = useState('State Bank of India')
  const [processing, setProcessing] = useState(false)
  const [codConfirmed, setCodConfirmed] = useState(false)

  const walletSufficient = walletBalance >= amount

  const handlePay = (e) => {
    e.preventDefault()
    setProcessing(true)

    let methodLabel = ''
    let detail = ''

    if (selectedMethod === 'upi') {
      methodLabel = `UPI – ${upiApp}`
      detail = upiId || `via ${upiApp}`
    } else if (selectedMethod === 'card') {
      methodLabel = 'Debit/Credit Card'
      detail = `****${cardNumber.slice(-4) || '0000'}`
    } else if (selectedMethod === 'netbanking') {
      methodLabel = 'Net Banking'
      detail = selectedBank
    } else if (selectedMethod === 'wallet') {
      methodLabel = 'Mazdoor Wallet'
      detail = `Deducted from balance`
    } else if (selectedMethod === 'cod') {
      methodLabel = 'Cash on Delivery'
      detail = 'Pay to worker at doorstep'
    }

    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false)
      onConfirm(methodLabel, detail)
    }, 1800)
  }

  const formatCard = (val) => {
    return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
  }
  const formatExpiry = (val) => {
    const clean = val.replace(/\D/g, '').slice(0, 4)
    return clean.length >= 3 ? `${clean.slice(0, 2)}/${clean.slice(2)}` : clean
  }

  return (
    <form onSubmit={handlePay}>
      {/* Amount Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg,#16221d,#2a3d34)',
          color: '#ffffff',
          borderRadius: '16px',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px'
        }}
      >
        <div>
          <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.6)' }}>
            TOTAL PAYABLE
          </span>
          <div style={{ fontSize: '28px', fontWeight: '800', margin: '2px 0' }}>₹{amount}</div>
          <small style={{ color: 'rgba(255,255,255,0.55)', fontSize: '12px' }}>Zero platform fee • Secure payment</small>
        </div>
        <div style={{ fontSize: '44px', opacity: 0.3 }}>🔐</div>
      </div>

      {/* Payment Method Selector */}
      <p style={{ margin: '0 0 12px', fontSize: '12.5px', fontWeight: '700', color: 'var(--ink,#16221d)' }}>
        Select Payment Method:
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
        {PAYMENT_METHODS.map(method => {
          const isSelected = selectedMethod === method.id
          const isDisabled = method.id === 'wallet' && !walletSufficient

          return (
            <button
              key={method.id}
              type="button"
              disabled={isDisabled}
              onClick={() => !isDisabled && setSelectedMethod(method.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '14px 16px',
                border: `2px solid ${isSelected ? 'var(--orange,#e97447)' : 'var(--line,#d9d8cd)'}`,
                borderRadius: '12px',
                background: isSelected ? '#fff9f5' : '#ffffff',
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                textAlign: 'left',
                opacity: isDisabled ? 0.5 : 1,
                transition: 'all 0.15s ease'
              }}
            >
              {/* Radio Circle */}
              <div
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  border: `2px solid ${isSelected ? 'var(--orange,#e97447)' : '#cbd5e0'}`,
                  background: isSelected ? 'var(--orange,#e97447)' : 'transparent',
                  flexShrink: 0,
                  display: 'grid',
                  placeItems: 'center'
                }}
              >
                {isSelected && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fff' }} />}
              </div>

              <span style={{ fontSize: '22px', flexShrink: 0 }}>{method.icon}</span>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <strong style={{ fontSize: '14px', color: 'var(--ink,#16221d)' }}>{method.label}</strong>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: '700',
                      padding: '2px 7px',
                      borderRadius: '999px',
                      background: method.id === 'wallet' && !walletSufficient ? '#fff5f5' : method.badgeBg,
                      color: method.id === 'wallet' && !walletSufficient ? '#c53030' : method.badgeColor
                    }}
                  >
                    {method.id === 'wallet' && !walletSufficient ? 'Insufficient' : method.badge}
                  </span>
                </div>
                <small style={{ color: 'var(--muted,#68736d)', fontSize: '11.5px' }}>{method.desc}</small>
              </div>
            </button>
          )
        })}
      </div>

      {/* ---- Method-specific inputs ---- */}
      {selectedMethod === 'upi' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', display: 'block', marginBottom: '6px' }}>Select UPI App:</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['Google Pay', 'PhonePe', 'Paytm', 'BHIM'].map(app => (
                <button
                  key={app}
                  type="button"
                  onClick={() => setUpiApp(app)}
                  style={{
                    padding: '8px 14px',
                    border: `2px solid ${upiApp === app ? 'var(--orange,#e97447)' : 'var(--line,#d9d8cd)'}`,
                    borderRadius: '10px',
                    background: upiApp === app ? '#fff5f0' : '#fff',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    color: upiApp === app ? 'var(--orange,#e97447)' : 'var(--ink,#16221d)'
                  }}
                >
                  {app}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', display: 'block', marginBottom: '6px' }}>UPI ID (optional):</label>
            <input
              type="text"
              placeholder={`yourname@${upiApp === 'Google Pay' ? 'okaxis' : upiApp === 'PhonePe' ? 'ybl' : 'paytm'}`}
              value={upiId}
              onChange={e => setUpiId(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--line,#d9d8cd)', fontSize: '13px' }}
            />
          </div>
        </div>
      )}

      {selectedMethod === 'card' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', display: 'block', marginBottom: '6px' }}>Card Number:</label>
            <input
              type="text"
              placeholder="0000 0000 0000 0000"
              value={cardNumber}
              onChange={e => setCardNumber(formatCard(e.target.value))}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--line,#d9d8cd)', fontSize: '15px', letterSpacing: '0.1em' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', display: 'block', marginBottom: '6px' }}>Name on Card:</label>
            <input
              type="text"
              placeholder="JOHN DOE"
              value={cardName}
              onChange={e => setCardName(e.target.value.toUpperCase())}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--line,#d9d8cd)', fontSize: '13px' }}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', display: 'block', marginBottom: '6px' }}>Expiry (MM/YY):</label>
              <input
                type="text"
                placeholder="MM/YY"
                value={cardExpiry}
                onChange={e => setCardExpiry(formatExpiry(e.target.value))}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--line,#d9d8cd)', fontSize: '13px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', display: 'block', marginBottom: '6px' }}>CVV:</label>
              <input
                type="password"
                placeholder="•••"
                maxLength={4}
                value={cardCvv}
                onChange={e => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--line,#d9d8cd)', fontSize: '13px' }}
              />
            </div>
          </div>
          <small style={{ color: 'var(--muted,#68736d)', fontSize: '11.5px' }}>
            🔒 Your card info is encrypted with 256-bit SSL. We never store card numbers.
          </small>
        </div>
      )}

      {selectedMethod === 'netbanking' && (
        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '12px', fontWeight: '700', display: 'block', marginBottom: '6px' }}>Select Your Bank:</label>
          <select
            value={selectedBank}
            onChange={e => setSelectedBank(e.target.value)}
            style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--line,#d9d8cd)', fontSize: '13px' }}
          >
            {BANKS.map(b => <option key={b}>{b}</option>)}
          </select>
        </div>
      )}

      {selectedMethod === 'wallet' && (
        <div
          style={{
            background: '#f0fff4',
            border: '1px solid #9ae6b4',
            borderRadius: '12px',
            padding: '14px 16px',
            marginBottom: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <strong style={{ color: '#22543d', fontSize: '13.5px', display: 'block' }}>Mazdoor Wallet</strong>
            <small style={{ color: '#2f9e44' }}>
              Balance: ₹{walletBalance.toLocaleString()} → After payment: ₹{(walletBalance - amount).toLocaleString()}
            </small>
          </div>
          <span style={{ fontSize: '28px' }}>👛</span>
        </div>
      )}

      {selectedMethod === 'cod' && (
        <div
          style={{
            background: '#fff9f0',
            border: '1px solid #fbd38d',
            borderRadius: '12px',
            padding: '14px 16px',
            marginBottom: '16px'
          }}
        >
          <strong style={{ color: '#744210', fontSize: '13.5px', display: 'block', marginBottom: '6px' }}>
            💵 Cash on Delivery Terms:
          </strong>
          <ul style={{ margin: '0 0 10px 16px', padding: 0, color: '#92400e', fontSize: '12.5px', lineHeight: 1.7 }}>
            <li>Pay ₹{amount} in cash directly to the worker after work is complete</li>
            <li>Worker will collect exact change or provide receipt</li>
            <li>Booking is confirmed immediately — no advance needed</li>
            <li>OTP required to start work (shared at doorstep)</li>
          </ul>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={codConfirmed}
              onChange={e => setCodConfirmed(e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: 'var(--orange,#e97447)' }}
            />
            <span style={{ fontSize: '12.5px', fontWeight: '700', color: '#744210' }}>
              I agree to pay ₹{amount} cash on delivery
            </span>
          </label>
        </div>
      )}

      {/* Security Note */}
      <div
        style={{
          background: '#faf8f3',
          border: '1px solid var(--line,#d9d8cd)',
          borderRadius: '10px',
          padding: '10px 14px',
          marginBottom: '16px',
          fontSize: '11.5px',
          color: 'var(--muted,#68736d)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <span style={{ fontSize: '16px' }}>🛡️</span>
        <span>
          All transactions are secured & escrow-protected. Full refund on cancellation before worker arrival.
        </span>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '10px' }}>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={processing}
            style={{
              flex: 1,
              padding: '13px',
              border: '1.5px solid var(--line,#d9d8cd)',
              borderRadius: '12px',
              background: '#ffffff',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              color: 'var(--ink,#16221d)'
            }}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={processing || (selectedMethod === 'cod' && !codConfirmed)}
          style={{
            flex: 2,
            padding: '13px',
            border: 'none',
            borderRadius: '12px',
            background: processing ? '#ccc' : 'linear-gradient(135deg,#e97447,#c4593a)',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: '800',
            cursor: processing || (selectedMethod === 'cod' && !codConfirmed) ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s ease'
          }}
        >
          {processing ? (
            <>
              <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⟳</span>
              Processing...
            </>
          ) : selectedMethod === 'cod' ? (
            `✓ Confirm COD Booking — ₹${amount}`
          ) : (
            `Pay ₹${amount} →`
          )}
        </button>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </form>
  )
}
