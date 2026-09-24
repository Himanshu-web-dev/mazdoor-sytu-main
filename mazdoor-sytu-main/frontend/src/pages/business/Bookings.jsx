const bookings = [
  { title: 'Warehouse team', status: 'Confirmed', location: 'Noida', date: 'Today • 5:30 PM', amount: '₹18,500' },
  { title: 'Office repair', status: 'Pending approval', location: 'Gurugram', date: 'Tomorrow • 10:30 AM', amount: '₹12,600' },
  { title: 'Apartment maintenance', status: 'Completed', location: 'Meerut', date: 'Friday • 1:15 PM', amount: '₹9,750' },
]

export default function Bookings({ onNavigate }) {
  return (
    <section className="portal-page bookings-page">
      <aside className="portal-sidebar">
        <div className="portal-brand">
          <img className="portal-logo" src="/official-logo.png" alt="Mazdoor Sytu" />
          <div>
            <strong>Mazdoor Sytu</strong>
            <small>Business Portal</small>
          </div>
        </div>

        <nav className="portal-nav" aria-label="Business bookings navigation">
          {[
            ['Overview', '/business/dashboard'],
            ['Business profile', '/business/profile'],
            ['Post requirement', '/business/post-requirement'],
            ['Requirements', '/business/requirements'],
            ['Workers', '/business/workers'],
            ['Bookings', '/business/bookings'],
            ['Payments', '/business/payments'],
          ].map(([label, path], index) => (
            <a className={path === '/business/bookings' ? 'active' : ''} href={path} key={path} onClick={(event) => { event.preventDefault(); onNavigate(path) }}>
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
            <h1>Bookings</h1>
          </div>
        </header>

        <div className="portal-welcome requirement-welcome">
          <div>
            <span className="portal-date">LIVE BOOKINGS</span>
            <h2>Track every work order</h2>
            <p>Keep tabs on confirmed work, approvals and job progress across all active contracts.</p>
          </div>
        </div>

        <section className="dashboard-card booking-card-list">
          {bookings.map(({ title, status, location, date, amount }) => (
            <div className="booking-card" key={title}>
              <div className="booking-card-top">
                <div>
                  <span className="panel-kicker">SERVICE</span>
                  <h3>{title}</h3>
                </div>
                <span className={`booking-status ${status.toLowerCase().includes('completed') ? 'completed' : status.toLowerCase().includes('pending') ? 'pending' : 'confirmed'}`}>{status}</span>
              </div>

              <div className="booking-meta-grid">
                <div>
                  <span>Location</span>
                  <strong>{location}</strong>
                </div>
                <div>
                  <span>Schedule</span>
                  <strong>{date}</strong>
                </div>
                <div>
                  <span>Amount</span>
                  <strong>{amount}</strong>
                </div>
              </div>

              <div className="booking-actions">
                <button className="primary-action" type="button">View details</button>
                <button className="secondary-action" type="button">Message team</button>
              </div>
            </div>
          ))}
        </section>
      </div>
    </section>
  )
}
