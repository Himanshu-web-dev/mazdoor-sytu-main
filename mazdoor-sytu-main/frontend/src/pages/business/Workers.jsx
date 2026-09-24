const workers = [
  { name: 'Aman Verma', role: 'Electrician', rating: '4.9', distance: '1.3 km away', successRate: '92%', price: '₹420 / visit', availability: 'Available today' },
  { name: 'Sonia Das', role: 'Painter', rating: '4.8', distance: '2.2 km away', successRate: '90%', price: '₹350 / day', availability: 'Top rated' },
  { name: 'Rakesh Kumar', role: 'Plumber', rating: '4.7', distance: '3.1 km away', successRate: '88%', price: '₹510 / visit', availability: 'Fast response' },
  { name: 'Nisha Malhotra', role: 'Cleaning expert', rating: '4.9', distance: '2.8 km away', successRate: '95%', price: '₹300 / shift', availability: 'Open this week' },
]

export default function Workers({ onNavigate }) {
  return (
    <section className="portal-page workers-page">
      <aside className="portal-sidebar">
        <div className="portal-brand">
          <img className="portal-logo" src="/official-logo.png" alt="Mazdoor Sytu" />
          <div>
            <strong>Mazdoor Sytu</strong>
            <small>Business Portal</small>
          </div>
        </div>

        <nav className="portal-nav" aria-label="Business workers navigation">
          {[
            ['Overview', '/business/dashboard'],
            ['Business profile', '/business/profile'],
            ['Post requirement', '/business/post-requirement'],
            ['Requirements', '/business/requirements'],
            ['Workers', '/business/workers'],
            ['Bookings', '/business/bookings'],
            ['Payments', '/business/payments'],
          ].map(([label, path], index) => (
            <a className={path === '/business/workers' ? 'active' : ''} href={path} key={path} onClick={(event) => { event.preventDefault(); onNavigate(path) }}>
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
            <h1>Workers</h1>
          </div>
          <button className="portal-action" type="button" onClick={() => onNavigate('/business/post-requirement')}>
            Shortlist workers <span>↗</span>
          </button>
        </header>

        <div className="portal-welcome requirement-welcome">
          <div>
            <span className="portal-date">SHORTLIST</span>
            <h2>Trusted professionals for your work</h2>
            <p>Compare verified skills, response speed and pricing before you make a booking decision.</p>
          </div>
        </div>

        <div className="worker-result-grid business-worker-grid">
          {workers.map(({ name, role, rating, distance, successRate, price, availability }) => (
            <article className="worker-search-card" key={name}>
              <div className="worker-search-header">
                <span className="mini-avatar large">{name.split(' ').map((word) => word[0]).slice(0, 2).join('')}</span>
                <div>
                  <h3>{name}</h3>
                  <p>{role}</p>
                </div>
                <span className="status-pill">{availability}</span>
              </div>

              <div className="worker-search-meta">
                <span>★ {rating}</span>
                <span>{distance}</span>
                <span>{successRate} success</span>
              </div>

              <div className="worker-details-row">
                <strong>{price}</strong>
                <small>Verified profile</small>
              </div>

              <div className="booking-actions">
                <button className="primary-action" type="button">Book now</button>
                <button className="secondary-action" type="button">View profile</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
