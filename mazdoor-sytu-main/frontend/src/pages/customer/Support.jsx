import { useState, useMemo } from 'react'
import CustomerLayout from './CustomerLayout'
import { loadCustomerStore, createSupportTicket } from '../../data/customerStore'
import './CustomerPortal.css'

const CATEGORIES = [
  { id: 'cat-booking', title: 'Booking Issue', desc: 'Timing delay, rescheduling or technician no-show.', icon: '⚡' },
  { id: 'cat-payment', title: 'Payment & Wallet', desc: 'Top-up discrepancies, refunds or invoice receipt inquiry.', icon: '💳' },
  { id: 'cat-worker', title: 'Worker Quality & Safety', desc: 'Workmanship guarantee, behavioral feedback or damage claim.', icon: '🛡️' },
  { id: 'cat-cancel', title: 'Cancellation Policy', desc: 'Instant refund questions or cancellation dispute.', icon: '↺' },
  { id: 'cat-app', title: 'App & Account', desc: 'Profile updates, login verification or password reset.', icon: '⚙️' },
]

export default function Support({ session, onNavigate, onLogout }) {
  const [store, setStore] = useState(() => loadCustomerStore())
  const [ticketModalOpen, setTicketModalOpen] = useState(false)
  const [selectedTicketCategory, setSelectedTicketCategory] = useState('Booking Issue')
  const [ticketSubject, setTicketSubject] = useState('')
  const [ticketBookingId, setTicketBookingId] = useState(store.bookings[0]?.id || '')
  const [ticketMessage, setTicketMessage] = useState('')
  const [activeTicketDetail, setActiveTicketDetail] = useState(null)
  const [ticketAlert, setTicketAlert] = useState(null)

  // FAQ Search & Accordion State
  const [faqSearch, setFaqSearch] = useState('')
  const [expandedFaqIndex, setExpandedFaqIndex] = useState(0)

  const tickets = store.support?.tickets || []
  const faqs = store.support?.faqs || []

  const filteredFaqs = useMemo(() => {
    const q = faqSearch.trim().toLowerCase()
    if (!q) return faqs
    return faqs.filter((f) => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q))
  }, [faqs, faqSearch])

  const handleRaiseTicket = (e) => {
    e.preventDefault()
    if (!ticketSubject || !ticketMessage) return

    const { store: updatedStore, newTicket } = createSupportTicket({
      subject: ticketSubject,
      category: selectedTicketCategory,
      bookingId: ticketBookingId,
      message: ticketMessage
    })

    setStore(updatedStore)
    setTicketModalOpen(false)
    setTicketSubject('')
    setTicketMessage('')
    setTicketAlert(`✓ Ticket ${newTicket.id} registered! Priority support team assigned.`)
    setTimeout(() => setTicketAlert(null), 5000)
  }

  return (
    <CustomerLayout
      activePath="/customer/support"
      session={session}
      onNavigate={onNavigate}
      onLogout={onLogout}
      title="Priority Helpdesk & Support"
      eyebrow="Customer Portal"
      subtitle="24×7 customer assistance, service guarantee claims, active ticket tracking and FAQs"
      headerActions={
        <button
          type="button"
          className="btn-primary-action"
          style={{ flex: 'none' }}
          onClick={() => setTicketModalOpen(true)}
        >
          <span>+ Raise Support Ticket</span>
        </button>
      }
    >
      {ticketAlert && (
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
          {ticketAlert}
        </div>
      )}

      {/* ---------------- 1. Quick Assistance Channels ---------------- */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px',
          marginBottom: '28px'
        }}
      >
        <div
          style={{
            background: '#ffffff',
            border: '1px solid var(--line, #d9d8cd)',
            borderRadius: '16px',
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: '#fff5ea',
              display: 'grid',
              placeItems: 'center',
              fontSize: '22px'
            }}
          >
            📞
          </div>
          <div>
            <strong style={{ fontSize: '15px', color: 'var(--ink, #16221d)', display: 'block' }}>
              Direct Helpline
            </strong>
            <small style={{ color: 'var(--muted, #68736d)', fontSize: '12px' }}>
              Toll-Free 24×7 Support
            </small>
            <div style={{ marginTop: '4px', fontSize: '14px', fontWeight: '700', color: 'var(--orange, #e97447)' }}>
              1800-2026-SETU
            </div>
          </div>
        </div>

        <div
          style={{
            background: '#ffffff',
            border: '1px solid var(--line, #d9d8cd)',
            borderRadius: '16px',
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: '#f0fff4',
              display: 'grid',
              placeItems: 'center',
              fontSize: '22px'
            }}
          >
            💬
          </div>
          <div>
            <strong style={{ fontSize: '15px', color: 'var(--ink, #16221d)', display: 'block' }}>
              WhatsApp Priority Desk
            </strong>
            <small style={{ color: 'var(--muted, #68736d)', fontSize: '12px' }}>
              Instant Chat with Agent
            </small>
            <div style={{ marginTop: '4px', fontSize: '14px', fontWeight: '700', color: '#2a7c3d' }}>
              +91 98765 43210
            </div>
          </div>
        </div>

        <div
          style={{
            background: '#ffffff',
            border: '1px solid var(--line, #d9d8cd)',
            borderRadius: '16px',
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: '#ebf8ff',
              display: 'grid',
              placeItems: 'center',
              fontSize: '22px'
            }}
          >
            🛡️
          </div>
          <div>
            <strong style={{ fontSize: '15px', color: 'var(--ink, #16221d)', display: 'block' }}>
              ₹10,000 Guarantee
            </strong>
            <small style={{ color: 'var(--muted, #68736d)', fontSize: '12px' }}>
              Damage & Satisfaction Cover
            </small>
            <div style={{ marginTop: '4px', fontSize: '12.5px', fontWeight: '600', color: '#2b6cb0' }}>
              30-Day Free Rework
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- 2. Help Categories ---------------- */}
      <div style={{ marginBottom: '28px' }}>
        <span className="eyebrow" style={{ fontSize: '11px', color: 'var(--orange, #e97447)' }}>
          HOW CAN WE HELP YOU?
        </span>
        <h3 style={{ margin: '2px 0 16px', fontSize: '20px', color: 'var(--ink, #16221d)' }}>
          Browse by Issue Category
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className="customer-action-card"
              style={{ padding: '16px', textAlign: 'left', cursor: 'pointer' }}
              onClick={() => {
                setSelectedTicketCategory(cat.title)
                setTicketModalOpen(true)
              }}
            >
              <span style={{ fontSize: '24px', display: 'block', marginBottom: '8px' }}>{cat.icon}</span>
              <strong style={{ fontSize: '14px', color: 'var(--ink, #16221d)', display: 'block' }}>
                {cat.title}
              </strong>
              <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--muted, #68736d)', lineHeight: 1.4 }}>
                {cat.desc}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* ---------------- 3. My Active Support Tickets ---------------- */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <span className="eyebrow" style={{ fontSize: '11px', color: 'var(--orange, #e97447)' }}>
              SERVICE TICKETS
            </span>
            <h3 style={{ margin: '2px 0 0', fontSize: '20px', color: 'var(--ink, #16221d)' }}>
              My Registered Tickets ({tickets.length})
            </h3>
          </div>
          <button
            type="button"
            className="btn-secondary-action"
            style={{ fontSize: '12px' }}
            onClick={() => setTicketModalOpen(true)}
          >
            + New Ticket
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {tickets.map((tkt) => {
            const isOpen = tkt.status === 'Open'
            return (
              <div
                key={tkt.id}
                style={{
                  background: '#ffffff',
                  border: '1px solid var(--line, #d9d8cd)',
                  borderRadius: '14px',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '14px',
                  flexWrap: 'wrap'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '14.5px', color: 'var(--ink, #16221d)' }}>
                      {tkt.subject}
                    </strong>
                    <span className={`status-pill ${isOpen ? 'active' : 'confirmed'}`} style={{ fontSize: '10px' }}>
                      {tkt.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--muted, #68736d)' }}>
                    <span>Ticket ID: <strong>{tkt.id}</strong></span>
                    <span> • </span>
                    <span>Category: {tkt.category}</span>
                    <span> • </span>
                    <span>Booking: {tkt.bookingId}</span>
                    <span> • </span>
                    <span>{tkt.lastUpdate}</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn-secondary-action"
                  onClick={() => setActiveTicketDetail(tkt)}
                >
                  View Details & Chat →
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* ---------------- 4. Searchable FAQs Accordion ---------------- */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid var(--line, #d9d8cd)',
          borderRadius: '18px',
          padding: '24px 28px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.02)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span className="eyebrow" style={{ fontSize: '11px', color: 'var(--orange, #e97447)' }}>
              KNOWLEDGE BASE
            </span>
            <h3 style={{ margin: '2px 0 0', fontSize: '20px', color: 'var(--ink, #16221d)' }}>
              Frequently Asked Questions
            </h3>
          </div>

          <div style={{ position: 'relative', minWidth: '260px' }}>
            <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#a0aec0' }}>
              ⌕
            </span>
            <input
              type="text"
              value={faqSearch}
              onChange={(e) => setFaqSearch(e.target.value)}
              placeholder="Search FAQs..."
              style={{
                width: '100%',
                padding: '8px 12px 8px 30px',
                borderRadius: '10px',
                border: '1px solid var(--line, #d9d8cd)',
                fontSize: '12.5px'
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredFaqs.map((faq, index) => {
            const isExpanded = expandedFaqIndex === index
            return (
              <div
                key={faq.q}
                style={{
                  border: '1px solid var(--line, #d9d8cd)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  background: isExpanded ? '#faf8f3' : '#ffffff',
                  transition: 'background 0.2s ease'
                }}
              >
                <button
                  type="button"
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    textAlign: 'left',
                    background: 'none',
                    border: 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: 'var(--ink, #16221d)'
                  }}
                  onClick={() => setExpandedFaqIndex(isExpanded ? -1 : index)}
                >
                  <span>{faq.q}</span>
                  <span style={{ fontSize: '16px', color: 'var(--orange, #e97447)' }}>
                    {isExpanded ? '−' : '+'}
                  </span>
                </button>

                {isExpanded && (
                  <div style={{ padding: '0 18px 16px', fontSize: '13.5px', color: '#4a5568', lineHeight: 1.55 }}>
                    {faq.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* ---------------- Raise Ticket Modal ---------------- */}
      {ticketModalOpen && (
        <div className="portal-modal-backdrop">
          <div className="portal-modal-card">
            <div className="portal-modal-header">
              <h3>Raise a Support Ticket</h3>
              <button
                type="button"
                className="portal-modal-close"
                onClick={() => setTicketModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRaiseTicket}>
              <div className="portal-modal-body">
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '6px' }}>
                    Issue Category:
                  </label>
                  <select
                    value={selectedTicketCategory}
                    onChange={(e) => setSelectedTicketCategory(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '10px',
                      border: '1px solid var(--line, #d9d8cd)',
                      fontSize: '13px'
                    }}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.title}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '6px' }}>
                    Related Booking:
                  </label>
                  <select
                    value={ticketBookingId}
                    onChange={(e) => setTicketBookingId(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '10px',
                      border: '1px solid var(--line, #d9d8cd)',
                      fontSize: '13px'
                    }}
                  >
                    <option value="General Inquiry">General / Not related to specific booking</option>
                    {store.bookings.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.id} - {b.service} ({b.worker})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '6px' }}>
                    Subject:
                  </label>
                  <input
                    type="text"
                    required
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    placeholder="Brief description of the problem..."
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '10px',
                      border: '1px solid var(--line, #d9d8cd)',
                      fontSize: '13px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '6px' }}>
                    Detailed Explanation:
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                    placeholder="Please explain the issue in detail so our priority support officer can assist immediately..."
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '10px',
                      border: '1px solid var(--line, #d9d8cd)',
                      fontSize: '13px',
                      resize: 'vertical'
                    }}
                  />
                </div>
              </div>

              <div className="portal-modal-footer">
                <button
                  type="button"
                  className="btn-secondary-action"
                  onClick={() => setTicketModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary-action">
                  Submit Ticket ↗
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------- Ticket Detail Modal ---------------- */}
      {activeTicketDetail && (
        <div className="portal-modal-backdrop">
          <div className="portal-modal-card">
            <div className="portal-modal-header">
              <h3>Ticket #{activeTicketDetail.id}</h3>
              <button
                type="button"
                className="portal-modal-close"
                onClick={() => setActiveTicketDetail(null)}
              >
                ✕
              </button>
            </div>

            <div className="portal-modal-body">
              <div>
                <span className="status-pill active" style={{ fontSize: '11px', marginBottom: '6px' }}>
                  Status: {activeTicketDetail.status}
                </span>
                <h4 style={{ margin: '6px 0 2px', fontSize: '16px' }}>
                  {activeTicketDetail.subject}
                </h4>
                <small style={{ color: 'var(--muted, #68736d)' }}>
                  Registered: {activeTicketDetail.createdDate} • Booking: {activeTicketDetail.bookingId}
                </small>
              </div>

              <div
                style={{
                  background: '#faf8f3',
                  border: '1px solid var(--line, #d9d8cd)',
                  borderRadius: '12px',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  maxHeight: '260px',
                  overflowY: 'auto'
                }}
              >
                {activeTicketDetail.conversation?.map((msg, i) => (
                  <div
                    key={i}
                    style={{
                      alignSelf: msg.from === 'customer' ? 'flex-end' : 'flex-start',
                      background: msg.from === 'customer' ? 'var(--ink, #16221d)' : '#ffffff',
                      color: msg.from === 'customer' ? '#ffffff' : 'var(--ink, #16221d)',
                      padding: '8px 14px',
                      borderRadius: '12px',
                      maxWidth: '85%',
                      fontSize: '12.5px',
                      border: msg.from === 'customer' ? 'none' : '1px solid var(--line, #d9d8cd)'
                    }}
                  >
                    <p style={{ margin: 0 }}>{msg.text}</p>
                    <time style={{ fontSize: '9.5px', opacity: 0.7, display: 'block', textAlign: 'right', marginTop: '3px' }}>
                      {msg.time}
                    </time>
                  </div>
                ))}
              </div>
            </div>

            <div className="portal-modal-footer">
              <button
                type="button"
                className="btn-primary-action"
                onClick={() => setActiveTicketDetail(null)}
              >
                Close Ticket View
              </button>
            </div>
          </div>
        </div>
      )}
    </CustomerLayout>
  )
}
