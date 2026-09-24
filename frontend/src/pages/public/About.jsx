import { useEffect, useState, useMemo } from 'react'
import './About.css'

function AnimatedStat({ value, suffix, label, sub, decimals = 0, isStatic = false }) {
  const [currentValue, setCurrentValue] = useState(isStatic ? value : 0)

  useEffect(() => {
    if (isStatic) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCurrentValue(value)
      return undefined
    }

    const animationStart = performance.now()
    const animationDuration = 1800
    let animationFrame

    const updateCounter = (currentTime) => {
      const progress = Math.min((currentTime - animationStart) / animationDuration, 1)
      const easedProgress = 1 - Math.pow(1 - progress, 3)
      setCurrentValue(value * easedProgress)
      if (progress < 1) animationFrame = requestAnimationFrame(updateCounter)
    }

    animationFrame = requestAnimationFrame(updateCounter)
    return () => cancelAnimationFrame(animationFrame)
  }, [value, isStatic])

  const formatted = useMemo(() => {
    if (isStatic) return value
    if (decimals > 0) return currentValue.toFixed(decimals)
    return Math.floor(currentValue).toLocaleString()
  }, [currentValue, decimals, isStatic, value])

  return (
    <div className="about-stat-value">
      {formatted}
      {suffix && <span className="suffix">{suffix}</span>}
    </div>
  )
}

export default function About({ onNavigate = () => {} }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <div className="about-pro-page">
      {/* ====================================================================
          1. HERO SECTION
          ==================================================================== */}
      <section className="about-pro-hero" aria-label="About Mazdoor Sytu Hero">
        <div className="about-hero-grid">
          <div className="about-hero-copy">
            <div className="about-hero-badge-row">
              <span className="about-live-pill">
                <span className="pulse-dot" />
                <span>Verified Skilled Workforce Platform</span>
              </span>
              <span className="about-est-tag">Est. 2026 • Meerut & Delhi-NCR</span>
            </div>

            <h1 className="about-hero-title">
              Empowering India&apos;s skilled workforce with <em>trust, direct access & dignity.</em>
            </h1>

            <p className="about-hero-description">
              Mazdoor Sytu connects daily-wage artisans, certified technicians, and construction
              crews directly with households and commercial contractors — with transparent hourly
              rates and verified Aadhaar identities.
            </p>

            <div className="about-hero-actions">
              <button
                type="button"
                className="about-btn-primary"
                onClick={() => onNavigate('/workers')}
              >
                <span>Find Nearby Workers</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>

              <button
                type="button"
                className="about-btn-secondary"
                onClick={() => onNavigate('/jobs')}
              >
                <span>Post Site Requirement</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <line x1="19" x2="19" y1="8" y2="14" />
                  <line x1="22" x2="16" y1="11" y2="11" />
                </svg>
              </button>

              <button
                type="button"
                className="about-btn-outline"
                onClick={() => onNavigate('/support')}
              >
                <span>Help &amp; Support</span>
              </button>
            </div>
          </div>

          {/* Hero Right Seal / Trust Card */}
          <div className="about-hero-seal-card">
            <div className="about-seal-header">
              <div className="about-seal-logo-wrap">
                <img src="/official-logo.webp" alt="Mazdoor Sytu Official Logo" width="36" height="36" />
              </div>
              <div>
                <div className="about-seal-name">Mazdoor Sytu</div>
                <div className="about-seal-sub">Direct Workforce Ecosystem</div>
              </div>
            </div>

            <div className="about-seal-creed">
              &ldquo;Work that moves families forward with fair earnings and mutual respect.&rdquo;
            </div>

            <ul className="about-seal-features">
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>100% direct payment via UPI or Cash</span>
              </li>

              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Aadhaar-verified tradesmen with ratings</span>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>15-minute doorstep dispatch radar</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ====================================================================
          2. LIVE ANIMATED TRUST METRICS (COUNTING STATS)
          ==================================================================== */}
      <section className="about-stats-grid" aria-label="Community & Platform Stats">
        {/* Metric 1 */}
        <article className="about-stat-card">
          <div className="about-stat-icon-wrap stat-icon-orange">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <AnimatedStat value={10000} suffix="+" label="Verified Deliveries" />
          <div className="about-stat-label">Verified Deliveries</div>
          <div className="about-stat-sub">Completed repair, maintenance & construction tasks</div>
        </article>

        {/* Metric 2 */}
        <article className="about-stat-card">
          <div className="about-stat-icon-wrap">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <AnimatedStat value={5000} suffix="+" label="Verified Tradesmen" />
          <div className="about-stat-label">Verified Tradesmen</div>
          <div className="about-stat-sub">Skilled plumbers, electricians, masons & carpenters</div>
        </article>



        {/* Metric 4 */}
        <article className="about-stat-card">
          <div className="about-stat-icon-wrap stat-icon-purple">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <AnimatedStat value={15} suffix=" Mins" label="Average Arrival" isStatic />
          <div className="about-stat-label">15-Min Doorstep Dispatch</div>
          <div className="about-stat-sub">Hyperlocal matching based on real-time availability</div>
        </article>
      </section>

      {/* ====================================================================
          3. WHO WE EMPOWER — 3 AUDIENCE PILLARS
          ==================================================================== */}
      <section className="about-ecosystem-section" aria-label="Who Mazdoor Sytu Serves">
        <div className="about-section-header">
          <span className="about-section-kicker">Unified Platform</span>
          <h2 className="about-section-title">Built for Everyone in the Workforce Chain</h2>
          <p className="about-section-sub">
            Whether you offer your craft, need dependable help at home, or manage large
            construction sites, Mazdoor Sytu brings transparency and speed to every step.
          </p>
        </div>

        <div className="about-ecosystem-grid">
          {/* Card 1: Workers */}
          <article className="about-eco-card">
            <div className="about-eco-card-top">
              <div className="about-eco-icon eco-icon-orange">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                </svg>
              </div>
              <span className="about-eco-badge">For Artisans &amp; Laborers</span>
            </div>

            <h3>For Daily Workers &amp; Tradesmen</h3>
            <p>
              Showcase your skills, establish a verified reputation, and get direct booking calls
              without paying cuts or commissions to contractors.
            </p>

            <ul className="about-eco-perks">
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Direct cash or UPI payments from customers</span>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Aadhaar verified identity badge build trust</span>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Set your own daily or hourly wage rates</span>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Daily local booking alerts on your phone</span>
              </li>
            </ul>

            <button
              type="button"
              className="about-eco-link"
              onClick={() => onNavigate('/worker/profile')}
            >
              <span>Explore Worker Portal</span>
              <span className="arrow">→</span>
            </button>
          </article>

          {/* Card 2: Households */}
          <article className="about-eco-card">
            <div className="about-eco-card-top">
              <div className="about-eco-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <span className="about-eco-badge">For Homes &amp; Families</span>
            </div>

            <h3>For Households &amp; Residents</h3>
            <p>
              Instantly find nearby electricians, plumbers, carpenters, and helpers with clear
              pricing, customer ratings, and live arrival dispatch.
            </p>

            <ul className="about-eco-perks">
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Verified artisans with authentic user reviews</span>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Upfront transparent rate cards with no hidden fees</span>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Direct phone and WhatsApp communication</span>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>15-minute quick emergency repair response</span>
              </li>
            </ul>

            <button
              type="button"
              className="about-eco-link"
              onClick={() => onNavigate('/workers')}
            >
              <span>Find Nearby Workers</span>
              <span className="arrow">→</span>
            </button>
          </article>

          {/* Card 3: Contractors & Businesses */}
          <article className="about-eco-card">
            <div className="about-eco-card-top">
              <div className="about-eco-icon eco-icon-blue">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              </div>
              <span className="about-eco-badge">For Builders &amp; Contractors</span>
            </div>

            <h3>For Contractors &amp; Businesses</h3>
            <p>
              Post commercial project requirements, mobilize crews of 5 to 50+ workers, and manage
              on-site attendance and GST billing with ease.
            </p>

            <ul className="about-eco-perks">
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Bulk crew deployment for construction sites</span>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Centralized GST invoices &amp; commercial billing</span>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Skill-matched masons, welders, bar-benders &amp; crews</span>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Dedicated account manager for enterprise hiring</span>
              </li>
            </ul>

            <button
              type="button"
              className="about-eco-link"
              onClick={() => onNavigate('/business/requirements')}
            >
              <span>Post Site Requirement</span>
              <span className="arrow">→</span>
            </button>
          </article>
        </div>
      </section>

      {/* ====================================================================
          4. 4-STEP OPERATIONAL FLOW
          ==================================================================== */}
      <section className="about-workflow-section" aria-label="How Booking and Hiring Works">
        <div className="about-section-header">
          <span className="about-section-kicker">Transparent Process</span>
          <h2 className="about-section-title">How the Platform Works</h2>
          <p className="about-section-sub">
            From discovering available workers in your sector to safe job completion with zero friction.
          </p>
        </div>

        <div className="about-workflow-grid">
          <article className="about-step-card">
            <div className="about-step-top">
              <span className="about-step-number">01</span>
              <div className="about-step-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
            </div>
            <h4>Locate Nearby</h4>
            <p>Select your colony or colony pin to discover verified technicians available within 15 minutes.</p>
          </article>

          <article className="about-step-card">
            <div className="about-step-top">
              <span className="about-step-number">02</span>
              <div className="about-step-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
            </div>
            <h4>Inspect &amp; Verify</h4>
            <p>Check government Aadhaar verification, real customer ratings, past job photos, and transparent rates.</p>
          </article>

          <article className="about-step-card">
            <div className="about-step-top">
              <span className="about-step-number">03</span>
              <div className="about-step-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
            </div>
            <h4>Direct Connection</h4>
            <p>Connect instantly via direct phone call or WhatsApp message with zero intermediary delay.</p>
          </article>

          <article className="about-step-card">
            <div className="about-step-top">
              <span className="about-step-number">04</span>
              <div className="about-step-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </div>
            <h4>Complete &amp; Settle</h4>
            <p>Pay 100% directly to the worker via UPI or Cash upon task completion, then leave an authentic rating.</p>
          </article>
        </div>
      </section>

      {/* ====================================================================
          5. CORE OPERATING PRINCIPLES
          ==================================================================== */}
      <section className="about-principles-section" aria-label="Our Core Principles">
        <div className="about-section-header">
          <span className="about-section-kicker kicker-green">Our Code of Trust</span>
          <h2 className="about-section-title">Principles We Never Compromise On</h2>
          <p className="about-section-sub">
            Built from day one to protect unorganized workers from exploitation while guaranteeing
            dependable quality for customers.
          </p>
        </div>

        <div className="about-principles-grid">
          <article className="about-principle-card">
            <div className="about-principle-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
                <line x1="12" x2="12" y1="2" y2="22" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <h4>Zero Wage Deductions</h4>
            <p>100% of the wage agreed upon between customer and worker goes directly to the worker.</p>
          </article>

          <article className="about-principle-card">
            <div className="about-principle-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h4>Aadhaar Verified Identity</h4>
            <p>Strict phone number, identity, and trade background checks before worker profiles become active.</p>
          </article>

          <article className="about-principle-card">
            <div className="about-principle-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
            </div>
            <h4>Active Helpline Desk</h4>
            <p>Direct telephone &amp; WhatsApp support desk (+91 8004264176) to mediate inquiries promptly.</p>
          </article>

          <article className="about-principle-card">
            <div className="about-principle-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
                <circle cx="12" cy="12" r="10" />
                <path d="m4.93 4.93 4.24 4.24" />
                <path d="m14.83 9.17 4.24-4.24" />
                <path d="m14.83 14.83 4.24 4.24" />
                <path d="m9.17 14.83-4.24 4.24" />
                <circle cx="12" cy="12" r="4" />
              </svg>
            </div>
            <h4>Safety &amp; Long-term Growth</h4>
            <p>Artisan safety guidelines, tool guidance, and long-term career progression for grassroots workers.</p>
          </article>
        </div>
      </section>

      {/* ====================================================================
          6. BOTTOM CONVERSION CTA BANNER
          ==================================================================== */}
      <section className="about-cta-banner" aria-label="Get Started with Mazdoor Sytu">
        <div className="about-cta-copy">
          <h2>Let’s Get Good Work Moving.</h2>
          <p>
            Whether you need a verified technician at your doorstep in 15 minutes or want to find
            steady daily jobs in your area, Mazdoor Sytu is ready for you.
          </p>
        </div>

        <div className="about-cta-actions">
          <button
            type="button"
            className="about-cta-btn-orange"
            onClick={() => onNavigate('/workers')}
          >
            <span>Find Workers Now</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>

          <a
            href="https://wa.me/918004264176?text=Hello%20Mazdoor%20Sytu%20Team%2C%20I%20have%20an%20inquiry%20regarding%20your%20services."
            target="_blank"
            rel="noopener noreferrer"
            className="about-cta-btn-whatsapp"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
            </svg>
            <span>WhatsApp Support Desk</span>
          </a>
        </div>
      </section>
    </div>
  )
}
