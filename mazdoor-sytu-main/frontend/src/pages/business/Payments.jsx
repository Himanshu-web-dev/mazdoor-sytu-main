const paymentSummary = [
  ['Total spend', '₹1.84L'],
  ['This month', '₹46,200'],
  ['Outstanding', '₹12,600'],
]

const transactions = [
  { label: 'Warehouse staffing', date: '23 Sep 2026', amount: '-₹18,500', type: 'Debit' },
  { label: 'Office repair', date: '20 Sep 2026', amount: '-₹12,600', type: 'Debit' },
  { label: 'Refund', date: '18 Sep 2026', amount: '+₹2,000', type: 'Credit' },
]

export default function Payments({ onNavigate }) {
  return (
    <section className="portal-page payments-page">
      <aside className="portal-sidebar">
        <div className="portal-brand">
          <img className="portal-logo" src="/official-logo.png" alt="Mazdoor Sytu" />
          <div>
            <strong>Mazdoor Sytu</strong>
            <small>Business portal</small>
          </div>
        </div>

        <nav className="portal-nav" aria-label="Business payments navigation">
          {[
            ['Overview', '/business/dashboard'],
            ['Business profile', '/business/profile'],
            ['Post requirement', '/business/post-requirement'],
            ['Requirements', '/business/requirements'],
            ['Workers', '/business/workers'],
            ['Bookings', '/business/bookings'],
            ['Payments', '/business/payments'],
          ].map(([label, path], index) => (
            <a className={path === '/business/payments' ? 'active' : ''} href={path} key={path} onClick={(event) => { event.preventDefault(); onNavigate(path) }}>
              <span className="nav-bullet">{String(index + 1).padStart(2, '0')}</span>
              {label}
            </a>
          ))}
        </nav>

        <div className="portal-help">
          <span>Need a hand?</span>
          <a href="/support" onClick={(event) => { event.preventDefault(); onNavigate('/support') }}>Visit support ↗</a>
        </div>
      </aside>

      <div className="portal-content">
        <header className="portal-header">
          <div>
            <p className="eyebrow">Business portal</p>
            <h1>Payments</h1>
          </div>
        </header>

        <div className="portal-welcome requirement-welcome">
          <div>
            <span className="portal-date">FINANCE</span>
            <h2>Your payment overview</h2>
            <p>Review all payroll and service settlements made through Mazdoor Sytu.</p>
          </div>
        </div>

        <div className="stats-grid">
          {paymentSummary.map(([label, value]) => (
            <article className="stat-card" key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
              <small>Updated today</small>
            </article>
          ))}
        </div>

        <section className="dashboard-card payment-table-card">
          <div className="panel-heading">
            <div>
              <span className="panel-kicker">TRANSACTIONS</span>
              <h3>Recent activity</h3>
            </div>
          </div>

          <div className="transaction-list">
            {transactions.map(({ label, date, amount, type }) => (
              <div className="transaction-row" key={label + date}>
                <div>
                  <strong>{label}</strong>
                  <small>{date}</small>
                </div>
                <span className={`transaction-type ${type === 'Credit' ? 'credit' : 'debit'}`}>{type}</span>
                <strong className={type === 'Credit' ? 'credit-total' : 'debit-total'}>{amount}</strong>
              </div>
            ))}
          </div>
        </section>
      </div>
    </section>
  )
}

