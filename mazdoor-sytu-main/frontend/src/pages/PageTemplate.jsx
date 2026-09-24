const roleConfig = {
  Customer: {
    label: 'Customer portal',
    nav: [['Overview', '/customer/dashboard'], ['Search workers', '/customer/search-workers'], ['Bookings', '/customer/bookings'], ['Booking details', '/customer/booking-details'], ['Messages', '/customer/messages'], ['Wallet', '/customer/wallet'], ['Reviews', '/customer/reviews'], ['Profile', '/customer/profile'], ['Support', '/customer/support']],
    stats: [['Active bookings', '03', '+2 this week'], ['Saved workers', '12', 'Across 4 skills'], ['Wallet balance', '₹4,850', 'Ready to use']],
    activity: [['AC', 'AC repair request', 'Confirmed for tomorrow', '09:40 AM'], ['PS', 'Paint touch-up', 'Awaiting worker response', 'Yesterday'], ['RW', 'Review submitted', 'Thanks for helping us grow', '18 Sep']],
  },
  Worker: {
    label: 'Worker portal',
    nav: [['Overview', '/worker/dashboard'], ['Jobs', '/worker/jobs'], ['Job details', '/worker/job-details'], ['Active job', '/worker/active-job'], ['Earnings', '/worker/earnings'], ['Wallet', '/worker/wallet'], ['Availability', '/worker/availability'], ['Reviews', '/worker/reviews'], ['Documents', '/worker/documents'], ['Profile', '/worker/profile']],
    stats: [['This month', '₹28,400', '+18% vs last month'], ['Jobs completed', '24', '4.9 average rating'], ['Next payout', '₹8,750', 'On 30 September']],
    activity: [['KP', 'Kitchen plumbing', 'Job completed · ₹2,400', 'Today'], ['HD', 'Home deep clean', 'New request nearby', 'Yesterday'], ['VP', 'Verified profile', 'Documents approved', '20 Sep']],
  },
  Business: {
    label: 'Business portal',
    nav: [['Overview', '/business/dashboard'], ['Business profile', '/business/profile'], ['Post requirement', '/business/post-requirement'], ['Requirements', '/business/requirements'], ['Workers', '/business/workers'], ['Bookings', '/business/bookings'], ['Payments', '/business/payments']],
    stats: [['Open requirements', '08', '3 need attention'], ['People hired', '42', 'This quarter'], ['Total spend', '₹1.84L', 'Across all projects']],
    activity: [['WT', 'Warehouse team', '6 workers shortlisted', 'Today'], ['SF', 'Shopfront renovation', 'Site visit scheduled', 'Yesterday'], ['MT', 'Monthly report', 'Download is ready', '20 Sep']],
  },
  Admin: {
    label: 'Admin console',
    nav: [['Overview', '/admin/dashboard'], ['Users', '/admin/users'], ['Workers', '/admin/workers'], ['Businesses', '/admin/businesses'], ['Services', '/admin/services'], ['Bookings', '/admin/bookings'], ['Payments', '/admin/payments'], ['Verification', '/admin/verification'], ['Analytics', '/admin/analytics']],
    stats: [['Total users', '12,840', '+8.4% this month'], ['Pending verification', '34', 'Needs review'], ['Platform volume', '₹8.6L', 'This month']],
    activity: [['VR', 'Verification queue', '34 profiles need review', 'Today'], ['PB', 'Payment settled', 'Booking #MS-2048', 'Today'], ['AN', 'Weekly analytics', 'Report generated', 'Yesterday']],
  },
}

function getRole(eyebrow, title) {
  if (eyebrow.includes('Customer')) return 'Customer'
  if (eyebrow.includes('Worker')) return 'Worker'
  if (eyebrow.includes('Business')) return 'Business'
  if (eyebrow.includes('Operations')) return 'Admin'
  if (title.toLowerCase().includes('customer')) return 'Customer'
  if (title.toLowerCase().includes('worker')) return 'Worker'
  if (title.toLowerCase().includes('business')) return 'Business'
  return null
}

function PageTemplate({ title, eyebrow = 'Mazdoor Sytu', description = 'Everything you need to manage work, bookings and trusted connections in one place.', session, onLogout }) {
  const role = getRole(eyebrow, title)
  const config = role ? roleConfig[role] : null

  if (!config) {
    return <section className="inner-page"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="inner-page-copy">{description}</p><div className="public-feature-grid"><div><span>01</span><strong>Simple from the start</strong><p>Clear information and thoughtful support for every kind of work.</p></div><div><span>02</span><strong>People first</strong><p>Built around trust, fair opportunities and real local connections.</p></div><div><span>03</span><strong>Always in reach</strong><p>One place to discover, book and manage your next job.</p></div></div></section>
  }

  return (
    <section className="portal-page">
      <aside className="portal-sidebar">
        <div className="portal-brand"><img className="portal-logo" src="/mazdoor-Sytu-mark.svg" alt="Mazdoor Sytu logo" /><div><strong>Mazdoor Sytu</strong><small>{config.label}</small></div></div>
        <nav className="portal-nav" aria-label={`${config.label} navigation`}>
          {config.nav.map(([label, path], index) => <a className={index === 0 && window.location.pathname.endsWith('dashboard') ? 'active' : ''} href={path} key={path}><span className="nav-bullet">{String(index + 1).padStart(2, '0')}</span>{label}</a>)}
        </nav>
        <div className="portal-help"><span>Need a hand?</span><a href="/support">Visit support ↗</a></div>
      </aside>
      <div className="portal-content">
        <header className="portal-header"><div><p className="eyebrow">{config.label}</p><h1>{title}</h1></div><div className="portal-user"><span className="user-avatar">{(session?.name || 'Riya Kapoor').slice(0, 2).toUpperCase()}</span><div><strong>{session?.name || 'Riya Kapoor'}</strong><small>Delhi, India</small></div><span className="user-chevron">⌄</span>{onLogout && <button className="portal-logout" type="button" onClick={onLogout}>Logout</button>}</div></header>
        <div className="portal-welcome"><div><span className="portal-date">MONDAY, 23 SEPTEMBER 2026</span><h2>Good morning, {(session?.name || 'Riya').split(' ')[0]}.</h2><p>{description}</p></div><a className="portal-action" href={config.nav[1]?.[1] || config.nav[0][1]}>Open workspace <span>↗</span></a></div>
        <div className="stats-grid">{config.stats.map(([label, value, note]) => <article className="stat-card" key={label}><span>{label}</span><strong>{value}</strong><small>{note}</small></article>)}</div>
        <div className="portal-columns"><section className="activity-panel"><div className="panel-heading"><div><span className="panel-kicker">RECENT ACTIVITY</span><h3>Keep an eye on things.</h3></div><a href={config.nav[1]?.[1] || config.nav[0][1]}>View all ↗</a></div><div className="activity-list">{config.activity.map(([initials, label, note, time]) => <div className="activity-row" key={label}><span className="activity-avatar">{initials}</span><div><strong>{label}</strong><p>{note}</p></div><time>{time}</time></div>)}</div></section><aside className="next-panel"><span className="panel-kicker">QUICK ACTION</span><h3>What would you like to do next?</h3><div className="quick-links">{config.nav.slice(1, 4).map(([label, path]) => <a href={path} key={path}>{label}<span>→</span></a>)}</div></aside></div>
      </div>
    </section>
  )
}

export default PageTemplate
