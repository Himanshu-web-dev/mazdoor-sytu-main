import { useState } from 'react'
import WorkerLayout from './WorkerLayout'

export default function WorkerSupport({ session, onNavigate, onLogout, workerData }) {
  const [category, setCategory] = useState('')
  const [message, setMessage]   = useState('')
  const [submitted, setSubmitted] = useState(false)

  const CATEGORIES = [
    { key: 'payment',      label: '💰 Payment Issue',       desc: 'Late payment, wrong amount, missing transaction' },
    { key: 'job-dispute',  label: '⚖️ Job Dispute',         desc: 'Unfair review, customer complaint, job cancellation' },
    { key: 'cancellation', label: '❌ Cancellation Issue',  desc: 'Last-minute cancel, no-show customer, penalty dispute' },
    { key: 'verification', label: '🪪 Verification Issue',  desc: 'KYC stuck, document rejected, badge not showing' },
    { key: 'technical',    label: '🛠️ Technical Problem',   desc: 'App bug, map error, chat not working' },
    { key: 'other',        label: '💬 Other Issue',         desc: 'Anything not listed above' },
  ]

  const FAQ = [
    { q: 'How long does payment take after job completion?', a: 'Payments are credited within 24 hours of job completion confirmation.' },
    { q: 'What if the customer cancels after I reach the site?', a: "You'll receive a cancellation fee of 25% of the job value for last-minute cancellations." },
    { q: 'How do I get my KYC verified?', a: 'Upload your Aadhaar and trade certificate in Profile > Documents. Verification takes 24-48 hours.' },
    { q: 'Can I change my service area radius?', a: 'Yes, go to Availability > Service Area to set your preferred radius from 2 to 50 km.' },
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!category || !message.trim()) return
    setSubmitted(true)
    setTimeout(() => { setSubmitted(false); setCategory(''); setMessage('') }, 5000)
  }

  return (
    <WorkerLayout
      activePath="/worker/support"
      session={session}
      workerData={workerData}
      onNavigate={onNavigate}
      onLogout={onLogout}
      title="Support"
      eyebrow="Worker Portal"
      subtitle="Help center, complaint filing and Mazdoor Sytu support"
    >
      {submitted && (
        <div style={{ background: 'rgba(22,163,74,0.12)', border: '1.5px solid rgba(22,163,74,0.3)', borderRadius: '12px', padding: '16px 20px', color: '#15803d', fontWeight: 600 }}>
          ✓ Your ticket has been submitted! Our team will respond within 24 hours. Ticket ID: #SUP-{Math.floor(Math.random() * 9000 + 1000)}
        </div>
      )}

      {/* Contact options */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
        {[
          { icon: '💬', label: 'Live Chat',     desc: 'Chat with support agent', color: '#16a34a' },
          { icon: '📞', label: 'Call Support',  desc: '+91 8004264176 (9am–9pm)', color: '#2563eb' },
          { icon: '📧', label: 'Email Us',      desc: 'mazdoorsetu.support@gmail.com', color: '#7c3aed' },
        ].map(c => (
          <div key={c.label} style={{
            background: '#fff', border: '1px solid #d4dbd6', borderRadius: '14px', padding: '20px',
            textAlign: 'center', cursor: 'pointer', transition: 'all 0.18s',
          }}>
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>{c.icon}</div>
            <strong style={{ fontSize: '14px', display: 'block', color: c.color }}>{c.label}</strong>
            <span style={{ fontSize: '12px', color: '#6b7c6f' }}>{c.desc}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Complaint Form */}
        <div className="worker-card-panel">
          <div>
            <span className="worker-panel-kicker">RAISE A TICKET</span>
            <h3>Submit a complaint</h3>
          </div>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#6b7c6f', marginBottom: '8px' }}>Select Category</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setCategory(cat.key)}
                    style={{
                      display: 'flex', gap: '10px', alignItems: 'center',
                      padding: '10px 14px', borderRadius: '10px',
                      border: `2px solid ${category === cat.key ? '#16a34a' : '#d4dbd6'}`,
                      background: category === cat.key ? 'rgba(22,163,74,0.08)' : '#fff',
                      cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s', width: '100%',
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <strong style={{ fontSize: '13px', color: '#0f1c14' }}>{cat.label}</strong>
                      <div style={{ fontSize: '11px', color: '#6b7c6f' }}>{cat.desc}</div>
                    </div>
                    {category === cat.key && <span style={{ color: '#16a34a', fontSize: '16px' }}>✓</span>}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#6b7c6f', marginBottom: '6px' }}>Describe your issue</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Please describe the issue in detail..."
                rows={5}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #d4dbd6', fontSize: '13px', resize: 'vertical', fontFamily: 'Inter, sans-serif' }}
              />
            </div>
            <button type="submit" className="wk-btn-success" style={{ padding: '12px', fontSize: '14px' }}>
              Submit Complaint →
            </button>
          </form>
        </div>

        {/* FAQ */}
        <div className="worker-card-panel">
          <div>
            <span className="worker-panel-kicker">HELP CENTER</span>
            <h3>Frequently asked questions</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {FAQ.map((item, i) => (
              <div key={i} style={{ padding: '14px', background: '#fafbfa', borderRadius: '10px', border: '1px solid #d4dbd6' }}>
                <strong style={{ fontSize: '13.5px', display: 'block', marginBottom: '6px', color: '#0f1c14' }}>
                  {item.q}
                </strong>
                <p style={{ margin: 0, fontSize: '13px', color: '#6b7c6f', lineHeight: 1.6 }}>{item.a}</p>
              </div>
            ))}
          </div>
          <div style={{ background: 'rgba(37,99,235,0.06)', border: '1.5px solid rgba(37,99,235,0.15)', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
            <strong style={{ display: 'block', fontSize: '14px', color: '#1d4ed8', marginBottom: '6px' }}>
              🛡️ Mazdoor Sytu Worker Protection
            </strong>
            <p style={{ margin: 0, fontSize: '12.5px', color: '#6b7c6f' }}>
              Every worker is covered by our payment guarantee and dispute resolution program.
            </p>
          </div>
        </div>
      </div>
    </WorkerLayout>
  )
}
