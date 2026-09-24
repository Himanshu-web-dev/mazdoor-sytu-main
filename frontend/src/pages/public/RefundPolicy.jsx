const refundTiers = [
  {
    tier: 'Stage 1',
    status: 'Before Worker Acceptance',
    refund: '100% Full Refund',
    refundPct: '100%',
    badgeClass: 'refund-full',
    description: 'If the worker has not accepted the booking yet, the customer can cancel with zero deductions and will receive an immediate 100% full refund.',
    timing: 'Instant cancellation permitted',
    applicableTo: 'All home & commercial service bookings'
  },
  {
    tier: 'Stage 2',
    status: 'After Worker Acceptance',
    refund: '50% Refund',
    refundPct: '50%',
    badgeClass: 'refund-half',
    description: 'If the worker has accepted the booking but has not yet started travelling, the customer will receive a 50% refund. The remaining 50% compensates the worker for reserved schedule slot and platform processing.',
    timing: 'Before worker marks "On The Way"',
    applicableTo: 'Standard confirmed bookings'
  },
  {
    tier: 'Stage 3',
    status: 'Worker On The Way',
    refund: '20% Refund',
    refundPct: '20%',
    badgeClass: 'refund-partial',
    description: 'If the worker has started travelling to the customer\'s location, the customer will receive a 20% refund. 80% is retained to cover worker fuel, transit time, and route reservation costs.',
    timing: 'Worker is in transit to site',
    applicableTo: 'Hyperlocal & on-demand dispatch'
  },
  {
    tier: 'Stage 4',
    status: 'Worker Arrived on Site',
    refund: 'No Refund (0%)',
    refundPct: '0%',
    badgeClass: 'refund-none',
    description: 'If the worker has reached the customer\'s location, no refund will be applicable. The full service fee is payable to ensure fair compensation for the artisan\'s completed travel and time.',
    timing: 'Worker marks "Arrived"',
    applicableTo: 'Site arrival confirmed'
  }
]

const policySections = [
  [
    'Scope and Applicability',
    'This Cancellation & Refund Policy applies to all bookings created via the Mazdoor Sytu mobile application and website across domestic households, commercial complexes, and enterprise contracting projects.'
  ],
  [
    'Refund Processing Timelines',
    'Approved refunds are credited to the original payment source (UPI, Debit/Credit Card, Net Banking, or Mazdoor Sytu Wallet) within 3 to 5 business days, depending on your issuing bank\'s clearance schedule. Wallet refunds are processed instantly.'
  ],
  [
    'Cancellations Initiated by Worker or Platform',
    'In the rare event that an accepted worker cancels the appointment or is unable to reach the destination due to unforeseen emergencies, Mazdoor Sytu will automatically dispatch an alternative verified tradesperson or issue a 100% full refund with zero deductions.'
  ],
  [
    'Service Quality Guarantee & Dispute Resolution',
    'If you experience an issue with workmanship, non-performance, or safety misconduct, please report it via the customer support desk within 24 hours of scheduled completion. Our safety grievance team investigates site logs and muster timestamps to resolve disputes fairly.'
  ]
]

export default function RefundPolicy() {
  return (
    <section className="legal-page refund-policy-page">
      <header className="legal-hero">
        <div>
          <p className="eyebrow">Fair, Transparent & Dignified Work</p>
          <h1>Cancellation &amp; <em>Refund Policy.</em></h1>
          <p>
            Clear and equitable refund rules designed to protect customers while ensuring fair compensation for hard-working local tradespeople.
          </p>
        </div>
        <div className="legal-meta">
          <span>LAST UPDATED</span>
          <strong>23 September 2026</strong>
          <small>Policy Version 2.0</small>
        </div>
      </header>

      {/* Visual Refund Slabs Table / Grid */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px 32px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #071510 0%, #0e291f 100%)',
          borderRadius: '16px',
          padding: '32px',
          color: '#ffffff',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.2)'
        }}>
          <div style={{ marginBottom: '24px' }}>
            <span style={{ color: '#34d399', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
              AT A GLANCE REFUND SCHEDULE
            </span>
            <h2 style={{ color: '#ffffff', fontSize: '24px', fontWeight: 800, margin: '4px 0 8px' }}>
              Booking Cancellation Refund Tiers
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: '14px', margin: 0, maxWidth: '720px' }}>
              Refund percentages are determined automatically based on the real-time fulfillment status of the booking at the moment of cancellation:
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '16px'
          }}>
            {refundTiers.map((t) => (
              <div
                key={t.tier}
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
                    {t.tier}
                  </span>
                  <span style={{
                    fontSize: '15px',
                    fontWeight: 900,
                    color: t.refundPct === '100%' ? '#34d399' : t.refundPct === '50%' ? '#38bdf8' : t.refundPct === '20%' ? '#fbbf24' : '#f87171',
                    background: 'rgba(255, 255, 255, 0.08)',
                    padding: '4px 10px',
                    borderRadius: '999px'
                  }}>
                    {t.refund}
                  </span>
                </div>

                <strong style={{ fontSize: '16px', color: '#ffffff' }}>
                  {t.status}
                </strong>

                <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8', lineHeight: 1.5, flex: 1 }}>
                  {t.description}
                </p>

                <div style={{ paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', fontSize: '11.5px', color: '#64748b' }}>
                  Timeline: <strong>{t.timing}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="legal-layout">
        <aside className="legal-summary">
          <span className="panel-kicker">FAIR WORK STANDARDS</span>
          <h2>Respecting Time &amp; Commitment.</h2>
          <p>
            When a tradesperson accepts your booking, they decline other customer requests and commit their travel fuel. Our tiered policy balances flexibility for households with fairness for workers.
          </p>
          <a href="/support">Need help with a refund? Contact Support ↗</a>
        </aside>

        <div className="legal-content">
          <p className="legal-intro">
            This policy applies to all registered customers, workers, and enterprise partners of Mazdoor Sytu. Cancellations must be initiated directly through the active booking dashboard in the app or website.
          </p>

          {policySections.map(([title, text], index) => (
            <article className="legal-section" key={title}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h2>{title}</h2>
                <p>{text}</p>
              </div>
            </article>
          ))}

          <div className="legal-contact">
            <strong>Have questions about a specific booking cancellation?</strong>
            <p>Our dedicated grievance desk is available 24×7 to assist with dispute reviews and refund status tracking.</p>
            <a href="/support">Open Support Ticket ↗</a>
          </div>
        </div>
      </div>
    </section>
  )
}
