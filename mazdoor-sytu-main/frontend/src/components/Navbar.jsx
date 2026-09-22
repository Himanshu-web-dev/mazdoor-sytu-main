import { useState, useEffect, useRef, useMemo } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { getSavedLocation } from '../utils/locationService'
import './Navbar.css'

const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English', region: 'All India' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी', region: 'उत्तर भारत' },
  { code: 'bho', label: 'Bhojpuri', native: 'भोजपुरी', region: 'UP / Bihar' },
  { code: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ', region: 'Punjab / NCR' },
  { code: 'hr', label: 'Haryanvi', native: 'हरियाणवी', region: 'Haryana / NCR' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা', region: 'West Bengal' },
  { code: 'mr', label: 'Marathi', native: 'मराठी', region: 'Maharashtra' },
  { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી', region: 'Gujarat' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்', region: 'Tamil Nadu' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు', region: 'AP / Telangana' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ', region: 'Karnataka' },
  { code: 'ml', label: 'Malayalam', native: 'മലയാളം', region: 'Kerala' },
  { code: 'or', label: 'Odia', native: 'ଓଡ଼ିଆ', region: 'Odisha' },
  { code: 'as', label: 'Assamese', native: 'অসমীয়া', region: 'Assam' },
  { code: 'mai', label: 'Maithili', native: 'मैथिली', region: 'Bihar / Mithila' },
  { code: 'ur', label: 'Urdu', native: 'اردو', region: 'National' },
]

function Navbar({ onNavigate, session, onLogout }) {
  const { language, changeLanguage, t } = useLanguage()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLangOpen, setIsLangOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const langPickerRef = useRef(null)

  const isLoggedIn = Boolean(session?.authenticated)
  const profilePath =
    session?.role === 'worker'
      ? '/worker/profile'
      : session?.role === 'business'
        ? '/business/profile'
        : '/customer/profile'
  const dashboardPath =
    session?.role === 'worker'
      ? '/worker/dashboard'
      : session?.role === 'business'
        ? '/business/dashboard'
        : '/customer/dashboard'

  // Filter languages based on search query
  const filteredLanguages = useMemo(() => {
    if (!searchQuery.trim()) return LANGUAGES
    const q = searchQuery.toLowerCase().trim()
    return LANGUAGES.filter(
      (l) =>
        l.label.toLowerCase().includes(q) ||
        l.native.toLowerCase().includes(q) ||
        l.code.toLowerCase().includes(q) ||
        l.region.toLowerCase().includes(q)
    )
  }, [searchQuery])

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langPickerRef.current && !langPickerRef.current.contains(event.target)) {
        setIsLangOpen(false)
        setSearchQuery('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false)
        setIsLangOpen(false)
        setSearchQuery('')
      }
    }
    if (isMobileMenuOpen) {
      window.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  const handleNavClick = (path) => {
    setIsMobileMenuOpen(false)
    setIsLangOpen(false)
    if (onNavigate) onNavigate(path)
  }

  const handleLogoutClick = () => {
    setIsMobileMenuOpen(false)
    setIsLangOpen(false)
    if (onLogout) onLogout()
  }

  const handleLanguageSelect = (code) => {
    changeLanguage(code)
    setIsLangOpen(false)
    setSearchQuery('')
  }

  const [userLoc, setUserLoc] = useState(() => {
    const saved = getSavedLocation()
    return saved.area && saved.city ? `${saved.area}, ${saved.city}` : (saved.city || 'Meerut')
  })

  useEffect(() => {
    const handleLocUpdate = (e) => {
      if (e.detail) {
        const { area, city, location } = e.detail
        setUserLoc(area && city ? `${area}, ${city}` : (location || city || 'Meerut'))
      }
    }
    window.addEventListener('mazdoor_location_updated', handleLocUpdate)
    return () => window.removeEventListener('mazdoor_location_updated', handleLocUpdate)
  }, [])

  const currentLangObj = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0]

  return (
    <>
      <header className="site-header">
        <div className="site-nav">
          <button className="brand" type="button" onClick={() => handleNavClick('/')}>
            <img className="brand-logo" src="/official-logo.png" width="92" height="68" alt="Mazdoor Sytu logo" />
            <div className="brand-title-wrap">
            <span className="brand-name">Mazdoor Sytu</span>
            {userLoc && (
              <span className="brand-loc-badge" title={`Detected Service Area: ${userLoc}`}>
                <span className="loc-dot-pulse" />
                <span className="brand-loc-city">{userLoc}</span>
              </span>
            )}
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="site-nav-links" aria-label="Main navigation">
          <button type="button" onClick={() => handleNavClick('/jobs')}>{t('nav_jobs', 'Jobs')}</button>
          <button type="button" onClick={() => handleNavClick('/workers')}>{t('nav_workers', 'Find workers')}</button>
          <button type="button" onClick={() => handleNavClick('/how-it-works')}>{t('nav_how_it_works', 'How it works')}</button>
          <button type="button" onClick={() => handleNavClick('/about')}>{t('nav_about', 'About')}</button>
          <button type="button" onClick={() => handleNavClick('/support')}>{t('nav_contact', 'Contact')}</button>
        </nav>

        {/* Desktop Navigation Controls */}
        <div className="nav-auth-wrap">
          <span className="nav-divider" aria-hidden="true" />
          <div className="nav-auth">
            {/* Professional Language Selector Dropdown */}
            <div className="nav-lang-picker" ref={langPickerRef}>
              <button
                type="button"
                className={`nav-lang-btn ${isLangOpen ? 'active' : ''}`}
                onClick={() => {
                  setIsLangOpen(!isLangOpen)
                  if (isLangOpen) setSearchQuery('')
                }}
                aria-expanded={isLangOpen}
                aria-haspopup="listbox"
                aria-label="Select language"
              >
                <svg
                  className="lang-globe-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                  <path d="M2 12h20" />
                </svg>
                <span className="lang-current-label">{currentLangObj.native}</span>
                <svg
                  className={`lang-chevron ${isLangOpen ? 'open' : ''}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              {isLangOpen && (
                <div className="nav-lang-dropdown" role="listbox" aria-label="Available languages">
                  <div className="lang-dropdown-header">
                    <span>Choose Language / भाषा</span>
                    <span className="lang-count-badge">{LANGUAGES.length} Languages</span>
                  </div>

                  {/* Search box for 16 languages */}
                  <div className="lang-search-wrap">
                    <svg
                      className="lang-search-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.3-4.3" />
                    </svg>
                    <input
                      type="text"
                      className="lang-search-input"
                      placeholder="Search language / खोजें..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                    />
                  </div>

                  <ul className="lang-options-list">
                    {filteredLanguages.length > 0 ? (
                      filteredLanguages.map((lang) => {
                        const isSelected = lang.code === language
                        return (
                          <li key={lang.code}>
                            <button
                              type="button"
                              className={`lang-option-btn ${isSelected ? 'selected' : ''}`}
                              onClick={() => handleLanguageSelect(lang.code)}
                              role="option"
                              aria-selected={isSelected}
                            >
                              <div className="lang-names-wrap">
                                <span className="lang-native-name">{lang.native}</span>
                                <span className="lang-sub-name">({lang.label})</span>
                              </div>
                              {isSelected && (
                                <svg
                                  className="lang-check-icon"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  aria-hidden="true"
                                >
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              )}
                            </button>
                          </li>
                        )
                      })
                    ) : (
                      <li className="lang-no-results">No language found</li>
                    )}
                  </ul>
                </div>
              )}
            </div>

            {!isLoggedIn && (
              <>
                <button className="nav-signin" type="button" onClick={() => handleNavClick('/login')}>
                  {t('nav_login', 'Login')}
                </button>
                <button className="nav-signup" type="button" onClick={() => handleNavClick('/signup')}>
                  {t('nav_signup', 'Signup')} <span>↗</span>
                </button>
              </>
            )}

            {isLoggedIn && (
              <>
                {dashboardPath && (
                  <button className="nav-signin" type="button" onClick={() => handleNavClick(dashboardPath)}>
                    {t('nav_dashboard', 'Dashboard')}
                  </button>
                )}
                <button className="nav-signin" type="button" onClick={() => handleNavClick(profilePath)}>
                  {t('nav_profile', 'My profile')}
                </button>
                <button className="nav-signup" type="button" onClick={handleLogoutClick}>
                  {t('nav_logout', 'Logout')}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className={`mobile-nav-toggle ${isMobileMenuOpen ? 'active' : ''}`}
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMobileMenuOpen}
        >
          <span className="hamburger-bar" />
          <span className="hamburger-bar" />
          <span className="hamburger-bar" />
        </button>
      </div>
    </header>

      {/* Mobile Drawer Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="mobile-nav-backdrop"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Navigation Drawer */}
      <div
        className={`mobile-nav-drawer ${isMobileMenuOpen ? 'open' : ''}`}
        aria-label="Mobile navigation drawer"
        role="dialog"
        aria-modal="true"
      >
        <div className="mobile-drawer-header">
          <div className="mobile-brand-row">
            <img src="/official-logo.webp" width="32" height="32" alt="Mazdoor Sytu logo" />
            <span>Mazdoor Sytu</span>
          </div>
          <button
            className="mobile-drawer-close"
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            ×
          </button>
        </div>

        <nav className="mobile-drawer-links" aria-label="Mobile navigation">
          <button type="button" onClick={() => handleNavClick('/jobs')}>
            <span>💼</span> Browse All Jobs
          </button>
          <button type="button" onClick={() => handleNavClick('/workers')}>
            <span>👷</span> Find Skilled Workers
          </button>
          <button type="button" onClick={() => handleNavClick('/how-it-works')}>
            <span>⚡</span> How It Works
          </button>
          <button type="button" onClick={() => handleNavClick('/about')}>
            <span>🏛</span> About Mazdoor Sytu
          </button>
          <button type="button" onClick={() => handleNavClick('/support')}>
            <span>💬</span> Contact & Support
          </button>
        </nav>

        <div className="mobile-drawer-footer">
          {/* Mobile Language Selector */}
          <div className="mobile-lang-section">
            <div className="mobile-lang-title">
              <div className="mobile-lang-title-left">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                  <path d="M2 12h20" />
                </svg>
                <span>Language / भाषा चुनें:</span>
              </div>
              <span className="lang-count-badge">{LANGUAGES.length}</span>
            </div>
            <div className="mobile-lang-chips">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  className={`mobile-lang-chip ${language === lang.code ? 'selected' : ''}`}
                  onClick={() => handleLanguageSelect(lang.code)}
                >
                  {lang.native}
                </button>
              ))}
            </div>
          </div>

          {!isLoggedIn ? (
            <div className="mobile-auth-grid">
              <button className="mobile-btn-signin" type="button" onClick={() => handleNavClick('/login')}>
                Login
              </button>
              <button className="mobile-btn-signup" type="button" onClick={() => handleNavClick('/signup')}>
                Sign Up ↗
              </button>
            </div>
          ) : (
            <div className="mobile-auth-grid">
              {dashboardPath && (
                <button className="mobile-btn-signin" type="button" onClick={() => handleNavClick(dashboardPath)}>
                  Dashboard
                </button>
              )}
              <button className="mobile-btn-signin" type="button" onClick={() => handleNavClick(profilePath)}>
                Profile
              </button>
              <button className="mobile-btn-logout" type="button" onClick={handleLogoutClick}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Navbar
