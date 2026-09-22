import { useState, useEffect, useMemo } from 'react'
import { getSavedLocation } from '../../utils/locationService'
import './Support.css'

const ROLE_CATEGORIES = {
  customer: [
    { id: 'delay', label: 'Worker arrival delay or not reachable' },
    { id: 'replace', label: 'Request a replacement worker' },
    { id: 'pricing', label: 'Service rate or price estimate query' },
    { id: 'contact', label: 'Cannot reach assigned worker by phone' },
    { id: 'other_cust', label: 'General household support' },
  ],
  worker: [
    { id: 'wage_delay', label: 'Payment delay from customer or contractor' },
    { id: 'id_verify', label: 'Profile or Aadhaar verification assistance' },
    { id: 'job_app', label: 'Help applying for jobs or daily contracts' },
    { id: 'booking_cancel', label: 'Booking cancellation inquiry' },
    { id: 'other_worker', label: 'General artisan and worker inquiry' },
  ],
  contractor: [
    { id: 'bulk_deploy', label: 'Need multiple workers for site (5+ workers)' },
    { id: 'attendance', label: 'Daily attendance or wage tracking' },
    { id: 'other_biz', label: 'Contractor and builder support' },
  ],
}

const FAQS_DATA = [
  {
    id: 'f1',
    category: 'customer',
    q: 'What should I do if the booked worker is running late or cannot come?',
    a: 'You can directly call the worker from your booking screen. If they do not respond or are delayed by more than 15 minutes, select "Request a replacement worker" or message our WhatsApp helpline at +91 94120 78210 to have an alternate verified technician assigned.',
  },
  {
    id: 'f2',
    category: 'worker',
    q: 'How do workers receive their daily wage payment?',
    a: 'Payment is made directly between you and the customer or contractor (via Cash or UPI). Mazdoor Sytu charges 0% commission from your daily wages. If there is any dispute regarding payments, our team assists in immediate mediation.',
  },
  {
    id: 'f3',
    category: 'customer',
    q: 'Are workers verified before visiting my home?',
    a: 'Yes. Every active artisan on the platform verifies their phone number, Aadhaar identity, and trade skill background. You can inspect their verified badge, experience, and past customer ratings prior to confirming any appointment.',
  },
  {
    id: 'f4',
    category: 'contractor',
    q: 'Can contractors hire a team of workers for commercial site construction?',
    a: 'Yes. You can post a project requirement under the Jobs portal or message our WhatsApp helpline (+91 94120 78210) with the number of masons, helpers, electricians, welders, or painters required for your site.',
  },
  {
    id: 'f5',
    category: 'customer',
    q: 'What are the operational hours for customer support?',
    a: 'Our telephone helpline and WhatsApp desk operate daily from 8:00 AM to 9:00 PM. For active on-site emergencies, WhatsApp requests are prioritized and acknowledged within minutes.',
  },
]

export default function Support({ onNavigate }) {
  // Live Locality Sync
  const [customerLoc, setCustomerLoc] = useState(() => getSavedLocation())
  const userArea = customerLoc.area || 'Ganga Sagar'
  const userCity = customerLoc.city || 'Meerut'

  useEffect(() => {
    const handleLocUpdate = (e) => {
      if (e.detail) {
        setCustomerLoc(e.detail)
      }
    }
    window.addEventListener('mazdoor_location_updated', handleLocUpdate)
    return () => window.removeEventListener('mazdoor_location_updated', handleLocUpdate)
  }, [])

  // Interactive Ticket Generator States
  const [selectedRole, setSelectedRole] = useState('customer') // 'customer' | 'worker' | 'contractor'
  const [ticketName, setTicketName] = useState('')
  const [ticketPhone, setTicketPhone] = useState('')
  const [ticketCategory, setTicketCategory] = useState('')
  const [bookingRef, setBookingRef] = useState('')
  const [ticketMessage, setTicketMessage] = useState('')
  const [isUrgent, setIsUrgent] = useState(false)
  const [submittedTicket, setSubmittedTicket] = useState(null)

  // Local storage stored tickets
  const [savedTickets, setSavedTickets] = useState(() => {
    try {
      const raw = localStorage.getItem('mazdoor_support_tickets')
      if (!raw) return []
      const list = JSON.parse(raw)
      return list.map((t) => ({
        ...t,
        category: (t.category || '').split('/')[0].trim(),
      }))
    } catch {
      return []
    }
  })

  // FAQ Category Filter
  const [faqFilter, setFaqFilter] = useState('all')

  const filteredFaqs = useMemo(() => {
    if (faqFilter === 'all') return FAQS_DATA
    return FAQS_DATA.filter((f) => f.category === faqFilter)
  }, [faqFilter])

  // Handle Ticket Submit
  const handleTicketSubmit = (e) => {
    e.preventDefault()
    if (!ticketName.trim() || !ticketPhone.trim() || !ticketMessage.trim()) return

    const newTicket = {
      id: `MS-${Math.floor(10000 + Math.random() * 90000)}`,
      name: ticketName.trim(),
      phone: ticketPhone.trim(),
      role: selectedRole,
      category: ticketCategory || ROLE_CATEGORIES[selectedRole][0].label,
      bookingRef: bookingRef.trim() || 'General Inquiry',
      message: ticketMessage.trim(),
      urgent: isUrgent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', Today',
      status: isUrgent ? 'Priority Callback' : 'Received',
      area: `${userArea}, ${userCity}`,
    }

    const updated = [newTicket, ...savedTickets].slice(0, 10)
    setSavedTickets(updated)
    try {
      localStorage.setItem('mazdoor_support_tickets', JSON.stringify(updated))
    } catch {}

    setSubmittedTicket(newTicket)
  }

  const handleResetForm = () => {
    setSubmittedTicket(null)
    setTicketName('')
    setTicketPhone('')
    setTicketCategory('')
    setBookingRef('')
    setTicketMessage('')
    setIsUrgent(false)
  }

  const handleQuickDemoFill = () => {
    if (selectedRole === 'worker') {
      setTicketName('Rahul Kumar')
      setTicketPhone('9412089456')
      setTicketCategory(ROLE_CATEGORIES.worker[0].label)
      setBookingRef('JOB-GS-01')
      setTicketMessage('Completed electrical wiring project yesterday. Need assistance confirming payment settlement.')
      setIsUrgent(true)
    } else if (selectedRole === 'customer') {
      setTicketName('Suresh Verma')
      setTicketPhone('9837012345')
      setTicketCategory(ROLE_CATEGORIES.customer[0].label)
      setBookingRef('BK-9812')
      setTicketMessage('Booked a plumber for morning shift. Technician has not arrived yet, please provide an update.')
      setIsUrgent(true)
    } else {
      setTicketName('Rajat Construction')
      setTicketPhone('9411098765')
      setTicketCategory(ROLE_CATEGORIES.contractor[0].label)
      setBookingRef('')
      setTicketMessage('Need 4 masons and 6 construction helpers for a 3-day project starting tomorrow.')
      setIsUrgent(false)
    }
  }

  return (
    <div className="pro-support-wrap">
      {/* 
          1. DIRECT CONTACT CHANNELS (REMOVED TOP BANNER, ONLY REAL CHANNELS)
      */}
      <section className="support-channels-section" aria-label="Contact Channels">
        <div className="section-title-wrap">
          <span className="section-label-tiny">01 · Direct Contact</span>
          <h1 className="section-heading-clean" style={{ fontSize: '28px' }}>Support &amp; Customer Assistance</h1>
          <p className="section-sub-clean">
            Reach out directly through any of our active communication channels. We are available daily from 8:00 AM to 9:00 PM.
          </p>
        </div>

        <div className="channels-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          {/* Card 1: Toll-Free Call */}
          <div className="channel-card highlight-tollfree">
            <div>
              <div className="channel-card-top">
                <div className="channel-icon-box">📞</div>
                <div className="channel-meta">
                  <h3>Toll-Free Helpline</h3>
                  <span className="channel-tag-status">8:00 AM – 9:00 PM (Daily)</span>
                </div>
              </div>
              <p className="channel-desc">
                Speak directly with our customer support team. Free call from any mobile or landline across India.
              </p>
            </div>
            <a href="tel:18001206293" className="channel-action-btn btn-green-solid">
              <span>Call 1800-120-6293 (Free)</span>
              <span>↗</span>
            </a>
          </div>

          {/* Card 2: WhatsApp Chat */}
          <div className="channel-card">
            <div>
              <div className="channel-card-top">
                <div className="channel-icon-box">💬</div>
                <div className="channel-meta">
                  <h3>WhatsApp Desk</h3>
                  <span className="channel-tag-status">Fast Response</span>
                </div>
              </div>
              <p className="channel-desc">
                Send a quick text, share site photos, or inquire about your ongoing booking status.
              </p>
            </div>
            <a
              href={`https://wa.me/919412078210?text=${encodeURIComponent(`Hello Mazdoor Sytu Support, I need assistance.`)}`}
              target="_blank"
              rel="noreferrer"
              className="channel-action-btn"
            >
              <span>Message on WhatsApp</span>
              <span>↗</span>
            </a>
          </div>

          {/* Card 3: Email Support */}
          <div className="channel-card">
            <div>
              <div className="channel-card-top">
                <div className="channel-icon-box">✉️</div>
                <div className="channel-meta">
                  <h3>Email Support</h3>
                  <span className="channel-tag-status">Within 24 Hours</span>
                </div>
              </div>
              <p className="channel-desc">
                Submit formal inquiries, verification requests, or service feedback by email anytime.
              </p>
            </div>
            <a href="mailto:support@mazdoorsytu.in" className="channel-action-btn">
              <span>support@mazdoorsytu.in</span>
              <span>↗</span>
            </a>
          </div>
        </div>
      </section>

      {/* 
          2. ASSISTANCE BY USER ROLE
      */}
      <section className="support-roles-section" aria-label="Support by Role">
        <div className="section-title-wrap">
          <span className="section-label-tiny">02 · Common Needs</span>
          <h2 className="section-heading-clean">What Can We Help You With?</h2>
          <p className="section-sub-clean">Select your category below to submit a message or request a priority callback.</p>
        </div>

        <div className="roles-grid">
          {/* For Customers */}
          <div className="role-support-card">
            <div>
              <div className="role-badge-row">
                <span className="role-badge-num">For Households</span>
                <span className="role-icon-lg">🏡</span>
              </div>
              <h3>Households &amp; Customers</h3>
              <p className="role-card-subtitle">Booking Assistance &amp; Help</p>
              <ul className="role-points-list">
                <li>
                  <span className="chk">✓</span>
                  <span>Worker not arrived or delayed</span>
                </li>
                <li>
                  <span className="chk">✓</span>
                  <span>Request an emergency replacement technician</span>
                </li>
                <li>
                  <span className="chk">✓</span>
                  <span>Questions regarding price or job estimate</span>
                </li>
              </ul>
            </div>
            <button
              type="button"
              className="btn-role-action"
              onClick={() => {
                setSelectedRole('customer')
                const el = document.getElementById('ticket-form-section')
                if (el) el.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              <span>Request Customer Support</span>
              <span>↓</span>
            </button>
          </div>

          {/* For Workers */}
          <div className="role-support-card">
            <div>
              <div className="role-badge-row">
                <span className="role-badge-num">For Workers</span>
                <span className="role-icon-lg">👷</span>
              </div>
              <h3>Artisans &amp; Workers</h3>
              <p className="role-card-subtitle">Wage Assistance &amp; Verification</p>
              <ul className="role-points-list">
                <li>
                  <span className="chk">✓</span>
                  <span>Daily wage payment issue or settlement delay</span>
                </li>
                <li>
                  <span className="chk">✓</span>
                  <span>Get profile verified to receive more bookings</span>
                </li>
                <li>
                  <span className="chk">✓</span>
                  <span>Help with applying for jobs or daily contracts</span>
                </li>
              </ul>
            </div>
            <button
              type="button"
              className="btn-role-action"
              onClick={() => {
                setSelectedRole('worker')
                const el = document.getElementById('ticket-form-section')
                if (el) el.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              <span>Request Worker Support</span>
              <span>↓</span>
            </button>
          </div>

          {/* For Contractors */}
          <div className="role-support-card">
            <div>
              <div className="role-badge-row">
                <span className="role-badge-num">For Sites &amp; Projects</span>
                <span className="role-icon-lg">🏗️</span>
              </div>
              <h3>Contractors &amp; Builders</h3>
              <p className="role-card-subtitle">Workforce &amp; Site Supply</p>
              <ul className="role-points-list">
                <li>
                  <span className="chk">✓</span>
                  <span>Need 5 or more workers for construction work</span>
                </li>
                <li>
                  <span className="chk">✓</span>
                  <span>Post bulk job requirements on the platform</span>
                </li>
                <li>
                  <span className="chk">✓</span>
                  <span>Worker attendance or coordination help</span>
                </li>
              </ul>
            </div>
            <button
              type="button"
              className="btn-role-action"
              onClick={() => {
                setSelectedRole('contractor')
                const el = document.getElementById('ticket-form-section')
                if (el) el.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              <span>Request Contractor Support</span>
              <span>↓</span>
            </button>
          </div>
        </div>
      </section>

      {/* 
          3. SEND MESSAGE / CALLBACK FORM
      */}
      <section className="support-ticket-container" id="ticket-form-section" aria-label="Support Form">
        {/* Left Side: Form */}
        <div className="ticket-form-side">
          <h2>Send a Message / Request a Callback</h2>
          <p className="ticket-form-subtitle">
            Provide a few basic details and our support team will get in touch with you shortly.
          </p>

          {submittedTicket ? (
            <div className="ticket-success-card">
              <div className="success-badge-icon">✅</div>
              <h3>Request Received</h3>
              <p style={{ fontSize: '14px', color: '#15803d', margin: '0 0 12px' }}>
                Thank you, <strong>{submittedTicket.name}</strong>. Your request has been logged successfully.
              </p>

              <div className="ticket-id-banner">
                <span>REFERENCE ID</span>
                <strong>{submittedTicket.id}</strong>
              </div>

              <div className="ticket-success-details">
                <div><strong>Topic:</strong> {submittedTicket.category}</div>
                <div><strong>Mobile Number:</strong> {submittedTicket.phone}</div>
                <div><strong>Status:</strong> {submittedTicket.status}</div>
              </div>

              <a
                href={`https://wa.me/919412078210?text=${encodeURIComponent(`Hello Mazdoor Sytu Support, I created reference ID ${submittedTicket.id} regarding "${submittedTicket.category}". My name is ${submittedTicket.name} (${submittedTicket.phone}).`)}`}
                target="_blank"
                rel="noreferrer"
                className="btn-whatsapp-ticket"
              >
                <span>Send this Reference to WhatsApp for Fast Reply</span>
                <span>↗</span>
              </a>

              <button
                type="button"
                className="btn-create-another"
                onClick={handleResetForm}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleTicketSubmit} className="ticket-form-grid">
              {/* Role Tabs */}
              <div className="ticket-role-tabs">
                <button
                  type="button"
                  className={`tab-role-btn ${selectedRole === 'customer' ? 'active' : ''}`}
                  onClick={() => { setSelectedRole('customer'); setTicketCategory('') }}
                >
                  🏡 Household &amp; Customer
                </button>
                <button
                  type="button"
                  className={`tab-role-btn ${selectedRole === 'worker' ? 'active' : ''}`}
                  onClick={() => { setSelectedRole('worker'); setTicketCategory('') }}
                >
                  👷 Skilled Worker
                </button>
                <button
                  type="button"
                  className={`tab-role-btn ${selectedRole === 'contractor' ? 'active' : ''}`}
                  onClick={() => { setSelectedRole('contractor'); setTicketCategory('') }}
                >
                  🏗️ Contractor &amp; Builder
                </button>
              </div>

              {/* Name & Phone */}
              <div className="ticket-field-row-2">
                <div className="field-block">
                  <label>Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={ticketName}
                    onChange={(e) => setTicketName(e.target.value)}
                  />
                </div>
                <div className="field-block">
                  <label>Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile number"
                    pattern="[0-9]{10}"
                    title="Please enter a valid 10-digit mobile number"
                    value={ticketPhone}
                    onChange={(e) => setTicketPhone(e.target.value)}
                  />
                </div>
              </div>

              {/* Category & Booking/Job ID */}
              <div className="ticket-field-row-2">
                <div className="field-block">
                  <label>What is the issue? *</label>
                  <select
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value)}
                    required
                  >
                    <option value="" disabled>Select a topic...</option>
                    {ROLE_CATEGORIES[selectedRole].map((cat) => (
                      <option key={cat.id} value={cat.label}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div className="field-block">
                  <label>Booking ID / Reference (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. BK-1234 or leave blank"
                    value={bookingRef}
                    onChange={(e) => setBookingRef(e.target.value)}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="field-block">
                <label>Details *</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Explain briefly how we can assist you..."
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                />
              </div>

              {/* Urgent Toggle */}
              <label className="urgent-toggle-box">
                <input
                  type="checkbox"
                  checked={isUrgent}
                  onChange={(e) => setIsUrgent(e.target.checked)}
                />
                <div className="urgent-label-wrap">
                  <strong>🚨 Urgent / Worker currently on site</strong>
                  <small>Check this if you require an immediate callback regarding an ongoing job.</small>
                </div>
              </label>

              {/* Action Buttons */}
              <div className="form-actions-row">
                <button type="submit" className="btn-submit-ticket">
                  <span>Submit Request</span>
                  <span>✓</span>
                </button>
                <button
                  type="button"
                  className="btn-quick-fill-test"
                  onClick={handleQuickDemoFill}
                  title="Populates sample test data"
                >
                  ⚡ Test Demo Fill
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right Side: Quick Info */}
        <div className="ticket-info-side">
          <div>
            <div className="sla-card-clean">
              <h4>
                <span>⏱️</span>
                <span>Support Timings &amp; Service</span>
              </h4>
              <div className="sla-metric-row">
                <span>Working Hours</span>
                <b>8:00 AM – 9:00 PM (Daily)</b>
              </div>
              <div className="sla-metric-row">
                <span>WhatsApp Response</span>
                <b className="highlight-green">Within minutes</b>
              </div>
              <div className="sla-metric-row">
                <span>Worker Commission</span>
                <b>0% (Direct Payment)</b>
              </div>
              <div className="sla-metric-row">
                <span>Resolution Commitment</span>
                <b>Same Day Follow-up</b>
              </div>
            </div>

            {/* Active Tickets List */}
            {savedTickets.length > 0 && (
              <div className="active-tickets-box" style={{ marginTop: '20px' }}>
                <h4>
                  <span>Your Recent Requests ({savedTickets.length})</span>
                  <span style={{ fontSize: '11px', color: '#008744', fontWeight: 600 }}>Active</span>
                </h4>
                <div>
                  {savedTickets.slice(0, 3).map((tkt) => (
                    <div className="ticket-mini-card" key={tkt.id}>
                      <div className="tkt-row-top">
                        <strong>Ref: {tkt.id}</strong>
                        <span className={`tkt-status-badge ${tkt.urgent ? 'urgent' : ''}`}>
                          {tkt.urgent ? '⚡ Urgent' : tkt.status}
                        </span>
                      </div>
                      <div className="tkt-desc-mini">{tkt.category}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '12px', padding: '14px 16px', fontSize: '12.5px', color: '#065f46', lineHeight: 1.5 }}>
            🛡️ <strong>Direct &amp; Safe:</strong> You can always call our toll-free helpline at <strong>1800-120-6293</strong> or WhatsApp us directly at <strong>+91 94120 78210</strong> if you prefer not to fill the form.
          </div>
        </div>
      </section>

      {/* 
          4. COMMON QUESTIONS (FAQ ACCORDION)
      */}
      <section className="support-faqs-section" aria-label="Frequently Asked Questions">
        <div className="section-title-wrap">
          <span className="section-label-tiny">03 · Common Questions</span>
          <h2 className="section-heading-clean">Frequently Asked Questions</h2>
          <p className="section-sub-clean">Straightforward answers to the most common inquiries from workers and customers.</p>
        </div>

        {/* Category Pills */}
        <div className="faq-filter-pills">
          <button
            type="button"
            className={`pill-faq-filter ${faqFilter === 'all' ? 'active' : ''}`}
            onClick={() => setFaqFilter('all')}
          >
            All Questions ({FAQS_DATA.length})
          </button>
          <button
            type="button"
            className={`pill-faq-filter ${faqFilter === 'customer' ? 'active' : ''}`}
            onClick={() => setFaqFilter('customer')}
          >
            🏡 Households
          </button>
          <button
            type="button"
            className={`pill-faq-filter ${faqFilter === 'worker' ? 'active' : ''}`}
            onClick={() => setFaqFilter('worker')}
          >
            👷 Workers
          </button>
          <button
            type="button"
            className={`pill-faq-filter ${faqFilter === 'contractor' ? 'active' : ''}`}
            onClick={() => setFaqFilter('contractor')}
          >
            🏗️ Contractors
          </button>
        </div>

        {/* FAQs Accordion */}
        <div className="faq-accordion-grid">
          {filteredFaqs.map((faq, idx) => (
            <details className="faq-item-card" key={faq.id} open={idx === 0}>
              <summary>
                <span>{faq.q}</span>
                <span className="plus-toggle">+</span>
              </summary>
              <div className="faq-answer-body">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* 
          5. TRUST & PROMISE CHARTER
      */}
      <section className="support-charter-section" aria-label="Trust Promises">
        <div className="section-title-wrap" style={{ marginBottom: 0 }}>
          <span className="section-label-tiny">04 · Our Promise</span>
          <h2 className="section-heading-clean">Simple &amp; Honest Platform</h2>
          <p className="section-sub-clean">Designed to make hiring and finding daily work straightforward, dependable, and transparent.</p>
        </div>

        <div className="charter-grid">
          <div className="charter-pillar-card">
            <div className="charter-icon-chip">💰</div>
            <h4>0% Wage Commission</h4>
            <p>Customers and contractors pay workers directly. We never deduct any cut or fee from workers' daily wages.</p>
          </div>

          <div className="charter-pillar-card">
            <div className="charter-icon-chip">🆔</div>
            <h4>Verified Artisans</h4>
            <p>Every professional undergoes Aadhaar identity and trade background checks so you know who is visiting your home.</p>
          </div>

          <div className="charter-pillar-card">
            <div className="charter-icon-chip">⚡</div>
            <h4>Quick Backup Support</h4>
            <p>If an artisan is delayed or unable to attend, our dispatch network promptly assigns an alternate nearby worker.</p>
          </div>

          <div className="charter-pillar-card">
            <div className="charter-icon-chip">🤝</div>
            <h4>Direct Communication</h4>
            <p>Direct phone calls and WhatsApp messaging with complete clarity and no middleman markup.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
