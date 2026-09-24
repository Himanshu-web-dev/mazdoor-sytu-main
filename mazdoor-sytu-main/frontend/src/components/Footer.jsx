import { useLanguage } from '../context/LanguageContext'
import './Footer.css'

const PLAYSTORE_URL =
  'https://play.google.com/store/apps/details?id=com.mazdoorsetu.mazdoor_setu&pcampaignid=web_share'

function Footer({ onNavigate }) {
  const { t } = useLanguage()
  const currentYear = new Date().getFullYear()

  const socials = [
    { label: 'Facebook', href: 'https://www.facebook.com/mazdoorsetu', icon: 'facebook' },
    { label: 'Instagram', href: 'https://www.instagram.com/mazdoorsytu/', icon: 'instagram' },
    { label: 'X / Twitter', href: 'https://x.com/MazdoorSytu', icon: 'twitter' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/mazdoorsytu-technologies/', icon: 'linkedin' },
  ]

  const navColumns = [
    {
      title: t('footer_col_explore', 'Explore'),
      links: [
        { label: t('nav_jobs', 'Browse All Jobs'), path: '/jobs' },
        { label: t('nav_workers', 'Find Skilled Workers'), path: '/workers' },
        { label: t('nav_how_it_works', 'How It Works'), path: '/how-it-works' },
        { label: 'Verified Trade Directory', path: '/workers' },
        { label: 'Download Android App', href: PLAYSTORE_URL, isExternal: true },
      ],
    },
    {
      title: t('footer_col_customers', 'For Customers'),
      links: [
        { label: t('nav_dashboard', 'Customer Dashboard'), path: '/customer/dashboard' },
        { label: 'Active Bookings', path: '/customer/bookings' },
        { label: 'Direct Messages', path: '/customer/messages' },
        { label: 'Customer Help Desk', path: '/customer/support' },
        { label: 'Transparent Rate Cards', path: '/how-it-works' },
      ],
    },
    {
      title: t('footer_col_workers', 'For Workers'),
      links: [
        { label: 'Tradesperson Portal', path: '/worker/dashboard' },
        { label: 'Browse Local Jobs', path: '/worker/jobs' },
        { label: 'Earnings & Payouts', path: '/worker/earnings' },
        { label: 'Availability Calendar', path: '/worker/availability' },
        { label: 'Register as Worker', path: '/signup' },
      ],
    },
    {
      title: t('footer_col_company', 'Company & Legal'),
      links: [
        { label: t('nav_about', 'About Mazdoor Sytu'), path: '/about' },
        { label: 'Careers & Hiring', path: '/careers' },
        { label: 'Privacy Policy', path: '/privacy' },
        { label: 'Terms & Conditions', path: '/terms' },
        { label: 'Grievance & Support', path: '/support' },
      ],
    },
  ]

  const renderIcon = (icon) => {
    switch (icon) {
      case 'linkedin':
        return (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6.94 8.5A1.56 1.56 0 1 1 6.93 5.4A1.56 1.56 0 0 1 6.94 8.5ZM5.4 9.8h2.98v8.7H5.4zm4.9 0h2.85v1.19h.04c.4-.75 1.37-1.54 2.82-1.54 3.01 0 3.57 1.98 3.57 4.54v6.51h-2.98v-6.09c0-1.45-.03-3.31-2.02-3.31-2.02 0-2.33 1.58-2.33 3.2v6.2H10.3z" />
          </svg>
        )
      case 'instagram':
        return (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm5 3.2A4.8 4.8 0 1 1 7.2 12A4.8 4.8 0 0 1 12 7.2zm0 2A2.8 2.8 0 1 0 14.8 12A2.8 2.8 0 0 0 12 9.2zm5.1-3.2a1.2 1.2 0 1 1-1.2 1.2a1.2 1.2 0 0 1 1.2-1.2z" />
          </svg>
        )
      case 'twitter':
        return (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M18.9 2h3.5l-7.65 8.74L23 22h-6.9l-5.4-7.5L4.77 22H1.3l8.2-9.36L1 2h7.06l4.88 6.8L18.9 2zm-1.22 18h1.93L7.18 3.9H5.15z" />
          </svg>
        )
      case 'facebook':
        return (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M13.2 22v-8.1h2.7l.4-3.1h-3.1V7.7c0-.9.3-1.5 1.7-1.5H16V3.2c-.3 0-1.2-.1-2.2-.1c-2.2 0-3.7 1.4-3.7 3.9v2.3H7.8v3.1h2.3V22z" />
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="footer-container">
        {/* Pre-Footer Trust & Assurance Strip */}
        <div className="footer-trust-strip">
          <div className="footer-trust-item">
            <div className="trust-icon-badge" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <div className="trust-text">
              <strong>{t('footer_strip_aadhaar', '100% Aadhaar Verified')}</strong>
              <span>{t('footer_strip_aadhaar_sub', 'Biometric & background vetted')}</span>
            </div>
          </div>

          <div className="footer-trust-item">
            <div className="trust-icon-badge" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <div className="trust-text">
              <strong>{t('footer_strip_dispatch', '15–30 Min Rapid Dispatch')}</strong>
              <span>{t('footer_strip_dispatch_sub', 'Smart hyperlocal matching')}</span>
            </div>
          </div>

          <div className="footer-trust-item">
            <div className="trust-icon-badge" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <line x1="2" x2="22" y1="10" y2="10" />
              </svg>
            </div>
            <div className="trust-text">
              <strong>{t('footer_strip_rates', 'Standard Upfront Rates')}</strong>
              <span>{t('footer_strip_rates_sub', 'Fixed rate cards & zero surge')}</span>
            </div>
          </div>

          <div className="footer-trust-item">
            <div className="trust-icon-badge" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 21h18" />
                <path d="M5 21V7l7-4 7 4v14" />
                <path d="M9 10h1" />
                <path d="M14 10h1" />
                <path d="M9 14h1" />
                <path d="M14 14h1" />
              </svg>
            </div>
            <div className="trust-text">
              <strong>{t('footer_strip_govt', 'Govt. & MSME Recognized')}</strong>
              <span>{t('footer_strip_govt_sub', 'Supported by DST NIDHI & UP StartInUP')}</span>
            </div>
          </div>
        </div>

        {/* Main Footer Navigation Grid */}
        <div className="footer-main-grid">
          {/* Brand Info & Contact Column */}
          <div className="footer-brand-col">
            <button className="footer-brand-btn" type="button" onClick={() => onNavigate('/')}>
              <img
                className="footer-brand-logo"
                src="/official-logo.webp"
                width="44"
                height="44"
                alt="Mazdoor Sytu logo"
              />
              <div className="footer-brand-names">
                <span className="footer-brand-title">Mazdoor Sytu</span>
                <span className="footer-brand-sub">Mazdoorsytu Technologies Pvt. Ltd.</span>
              </div>
            </button>

            <p className="footer-tagline">
              {t('footer_tagline', 'Connecting verified tradespeople with households and businesses across India. Transparent, safe, and dignified work at your doorstep.')}
            </p>

            <div className="footer-contact-list">
              <a href="mailto:hello@mazdoorsytu.in" className="footer-contact-item">
                <svg className="footer-contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <span>hello@mazdoorsytu.in</span>
              </a>

              <a href="tel:+919588667046" className="footer-contact-item">
                <svg className="footer-contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span>+91 95886 67046</span>
              </a>

              <span className="footer-contact-item non-link">
                <svg className="footer-contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>Jhansi, Uttar Pradesh, India</span>
              </span>
            </div>

            <div className="footer-social-wrap">
              <span className="footer-social-label">Official Social Media</span>
              <div className="footer-social-icons">
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    className="footer-social-btn"
                  >
                    {renderIcon(social.icon)}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* 4 Structured Navigation Columns */}
          {navColumns.map((col) => (
            <div className="footer-nav-col" key={col.title}>
              <h3 className="footer-col-heading">{col.title}</h3>
              <nav className="footer-nav-list" aria-label={col.title}>
                {col.links.map((link) =>
                  link.isExternal ? (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="footer-nav-link"
                    >
                      <span>{link.label}</span>
                      <span className="footer-ext-arrow" aria-hidden="true">↗</span>
                    </a>
                  ) : (
                    <button
                      key={link.label}
                      type="button"
                      className="footer-nav-link"
                      onClick={() => onNavigate(link.path)}
                    >
                      <span>{link.label}</span>
                    </button>
                  )
                )}
              </nav>
            </div>
          ))}
        </div>

        {/* Bottom Bar: Legal, Copyright & Badges */}
        <div className="footer-bottom-bar">
          <div className="footer-copyright">
            <span>© {currentYear} Mazdoorsytu Technologies Private Limited. All rights reserved.</span>
          </div>

          <div className="footer-legal-links">
            <button type="button" className="footer-legal-btn" onClick={() => onNavigate('/privacy')}>
              Privacy Policy
            </button>
            <span className="footer-divider-dot">•</span>
            <button type="button" className="footer-legal-btn" onClick={() => onNavigate('/terms')}>
              Terms of Service
            </button>
            <span className="footer-divider-dot">•</span>
            <button type="button" className="footer-legal-btn" onClick={() => onNavigate('/support')}>
              Security & Trust
            </button>
            <span className="footer-divider-dot">•</span>
            <button type="button" className="footer-legal-btn" onClick={() => onNavigate('/about')}>
              Company Story
            </button>
          </div>

          <div className="footer-badge-flag">
            <span className="footer-live-status">
              <span className="live-green-pulse" aria-hidden="true" />
              <span>{t('footer_network_active', 'Network Active')}</span>
            </span>
            <span className="footer-bharat-tag">🇮🇳 {t('footer_bharat', 'Proudly Built for Bharat')}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
