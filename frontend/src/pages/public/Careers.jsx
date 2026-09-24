
const roles = [
  ['Community Growth Manager', 'Remote · India', 'Build partnerships and growth loops that connect skilled workers with new opportunities.', 'Full-time'],
  ['Product Designer', 'Bengaluru · Hybrid', 'Design simple, trustworthy user journeys for workers, households and businesses.', 'Full-time'],
  ['Operations Lead', 'Meerut · On-site', 'Own day-to-day operational quality, worker support and service coordination.', 'Full-time'],
  ['Field Partnerships Associate', 'Multiple cities', 'Support regional hiring, outreach and onboarding for local service networks.', 'Contract'],
]

const values = [
  ['Purpose-led work', 'We are building a better way for people to find opportunity and trust in everyday work.'],
  ['Operational clarity', 'Our team moves quickly, makes decisions with context and keeps the quality bar high.'],
  ['Human-first culture', 'We respect the realities on the ground and design systems around real people.'],
]

function Careers() {
  return (
    <section className="careers-page">
      <header className="careers-hero">
        <div>
          <p className="eyebrow">Grow with Mazdoor Sytu</p>
          <h1>Build the future of <em>trusted work.</em></h1>
          <p>We are creating a more reliable, transparent and rewarding way for skilled workers and service-seeking people to connect.</p>
        </div>
        <div className="careers-meta">
          <span>NOW HIRING</span>
          <strong>India-wide opportunities</strong>
          <small>Product, operations, partnerships, and field support</small>
        </div>
      </header>

      <div className="careers-layout">
        <aside className="careers-summary">
          <span className="panel-kicker">WHY JOIN</span>
          <h2>Work that matters, with people who care.</h2>
          <p>At Mazdoor Sytu, we are building digital access for real-world work — making service discovery more transparent, worker opportunities more fair and local ecosystems easier to trust.</p>
          <a href="mailto:mazdoorsetu.support@gmail.com">mazdoorsetu.support@gmail.com ↗</a>
        </aside>

        <div className="careers-content">
          <p className="careers-intro">Whether you are shaping product experiences, building local operational systems or helping workers grow into better opportunities, there is a role for people who care deeply about trust, access and impact.</p>

          <div className="roles-grid">
            {roles.map(([title, location, description, type]) => (
              <article className="role-card" key={title}>
                <div className="role-topline">
                  <span>{type}</span>
                  <strong>{location}</strong>
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
                <button type="button">Apply now <span>↗</span></button>
              </article>
            ))}
          </div>

          <div className="careers-values">
            <div className="careers-values-intro">
              <span className="about-number">01</span>
              <p className="eyebrow">Our culture</p>
              <h2>Clarity, compassion and a bias toward action.</h2>
            </div>
            <div className="values-list careers-value-list">
              {values.map(([title, text], index) => (
                <article key={title}>
                  <span>0{index + 1}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="careers-contact">
            <strong>Thinking of joining us?</strong>
            <p>We are looking for people who care about better systems, better jobs and a more trustworthy service economy.</p>
            <a href="mailto:mazdoorsetu.support@gmail.com">Send your profile ↗</a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Careers
