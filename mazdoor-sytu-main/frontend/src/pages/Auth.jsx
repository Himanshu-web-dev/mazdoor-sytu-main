import { useState, useEffect } from 'react'
import './Auth.css'

const ROLE_DETAILS = {
  customer: {
    tagline: 'Hire Verified Tradespeople',
    description: 'Book trusted electricians, plumbers, appliance technicians, and carpenters near you in minutes.',
    stats: [
      { label: 'Verified Pros', value: '45,000+' },
      { label: 'Avg. Response', value: '12 Min' },
      { label: 'Safety Rating', value: '4.9 ★' },
    ],
    perks: [
      '100% Aadhaar & Police verified professionals',
      'Real-time technician arrival with start OTP',
      'Transparent pricing with zero hidden surcharges',
      '30-day Mazdoor Sytu service guarantee',
    ],
    quote: 'Found an expert plumber in Shastri Nagar within 10 minutes. The pricing was clear and the repair work was flawless.',
    author: 'Anita Sharma, Homeowner',
  },
  worker: {
    tagline: 'Earn Daily & Grow Your Business',
    description: 'Direct customer bookings, zero commissions on first 20 orders, and same-day UPI bank transfers.',
    stats: [
      { label: 'Daily Jobs', value: '3,200+' },
      { label: 'Payout Speed', value: 'Instant' },
      { label: 'Avg. Rating', value: '4.8 ★' },
    ],
    perks: [
      'Direct customer bookings sent right to your phone',
      'Same-day instant withdrawals to Bank / UPI',
      'Free accident & medical insurance coverage',
      'Official verified trade badge & identity card',
    ],
    quote: 'Since getting verified on Mazdoor Sytu, my monthly income doubled and daily payments arrive without fail.',
    author: 'Rahul Kumar, Licensed Electrician',
  },
  business: {
    tagline: 'Scale Your Enterprise Workforce',
    description: 'Deploy certified technicians, masons, and facility crews for commercial and infrastructure projects.',
    stats: [
      { label: 'Deploy Speed', value: '24 Hours' },
      { label: 'Compliance', value: '100% GST' },
      { label: 'Crew Size', value: 'Up to 500' },
    ],
    perks: [
      'Pre-vetted skilled & semi-skilled labor deployment',
      'Single consolidated monthly GST tax invoice',
      'Real-time attendance & biometric shift tracking',
      'Dedicated enterprise account manager & SLA guarantee',
    ],
    quote: 'We staffed 18 qualified electricians for our industrial project on 24 hours notice. Outstanding platform.',
    author: 'Vikram Malhotra, Apex Infra Projects',
  },
}

export default function Auth({ mode = 'signup', onAuthenticated, onNavigate }) {
  const [isLogin, setIsLogin] = useState(mode === 'login')
  const [role, setRole] = useState('customer')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [trade, setTrade] = useState('Electrician')
  const [companyName, setCompanyName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setIsLogin(mode === 'login')
  }, [mode])

  const activeContent = ROLE_DETAILS[role] || ROLE_DETAILS.customer

  const handleSubmit = (e) => {
    e.preventDefault()
    setErrorMessage('')

    if (!email.trim() || !password) {
      setErrorMessage('Please provide both your email address and password.')
      return
    }

    if (!isLogin) {
      if (!firstName.trim()) {
        setErrorMessage('Please enter your full name to set up your account.')
        return
      }
      if (!agreeTerms) {
        setErrorMessage('You must accept the Terms of Service to proceed.')
        return
      }
    }

    setLoading(true)

    setTimeout(() => {
      const resolvedName = isLogin
        ? (role === 'worker' ? 'Rahul Kumar' : role === 'business' ? 'Apex Infra' : 'Riya Kapoor')
        : `${firstName.trim()} ${lastName.trim()}`.trim()

      const userSession = {
        name: resolvedName || 'User',
        email: email.trim().toLowerCase(),
        phone: phone.trim() || '+91 98765 43210',
        role,
        trade: role === 'worker' ? trade : undefined,
        companyName: role === 'business' ? companyName : undefined,
        authenticated: true,
      }

      setLoading(false)
      if (onAuthenticated) {
        onAuthenticated(userSession)
      }
    }, 450)
  }

  const handleQuickDemo = (targetRole) => {
    setRole(targetRole)
    const demoAccounts = {
      customer: { name: 'Riya Kapoor', email: 'riya@mazdoorsytu.in', role: 'customer', phone: '+91 98101 22334', authenticated: true },
      worker: { name: 'Rahul Kumar', email: 'rahul.kumar@mazdoorsytu.in', role: 'worker', phone: '+91 98765 43210', service: 'Electrician', authenticated: true },
      business: { name: 'Apex Infrastructure', email: 'contact@apexinfra.com', role: 'business', phone: '+91 98110 55432', companyName: 'Apex Infra Ltd.', authenticated: true },
    }
    if (onAuthenticated) {
      onAuthenticated(demoAccounts[targetRole])
    }
  }

  const handleGoogleSignIn = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      if (onAuthenticated) {
        onAuthenticated({
          name: role === 'worker' ? 'Rahul Kumar (Google)' : role === 'business' ? 'Apex Infra' : 'Riya Kapoor (Google)',
          email: 'user@google.com',
          role,
          authenticated: true,
        })
      }
    }, 400)
  }

  const switchTab = (targetIsLogin) => {
    setIsLogin(targetIsLogin)
    setErrorMessage('')
    if (onNavigate) {
      onNavigate(targetIsLogin ? '/login' : '/signup')
    }
  }

  return (
    <div className="auth-stage-root">
      <div className="auth-card-container">
        {/* ── Left Editorial Brand Canvas ── */}
        <aside className="auth-brand-canvas">
          <div className="auth-brand-head">
            <div className="auth-brand-identity">
              <img className="auth-brand-logo" src="/official-logo.png" alt="Mazdoor Sytu" />
              <div>
                <span className="auth-brand-name">Mazdoor Sytu</span>
                <span className="auth-brand-kicker">Skill & Workforce Network</span>
              </div>
            </div>
            <div className="auth-verified-badge">
              <span className="auth-badge-dot" />
              ISO Certified Platform
            </div>
          </div>

          <div className="auth-brand-middle">
            <span className="auth-role-pill-indicator">
              {role.toUpperCase()} PORTAL
            </span>
            <h2 className="auth-headline">{activeContent.tagline}</h2>
            <p className="auth-subtext">{activeContent.description}</p>

            {/* Quick Stats Strip */}
            <div className="auth-stat-strip">
              {activeContent.stats.map((st) => (
                <div key={st.label} className="auth-stat-box">
                  <strong>{st.value}</strong>
                  <small>{st.label}</small>
                </div>
              ))}
            </div>

            {/* Trust Perks List */}
            <div className="auth-perk-list">
              {activeContent.perks.map((perk, i) => (
                <div key={i} className="auth-perk-row">
                  <span className="auth-perk-check">✓</span>
                  <span>{perk}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Social Proof Quote Card */}
          <div className="auth-testimonial-box">
            <p className="auth-quote-text">“{activeContent.quote}”</p>
            <span className="auth-quote-author">— {activeContent.author}</span>
          </div>
        </aside>

        {/* ── Right Interactive Authentication Form ── */}
        <main className="auth-form-canvas">
          {/* Top Switcher Tabs (Sign In vs Create Account) */}
          <div className="auth-mode-switch">
            <button
              type="button"
              className={`auth-mode-tab ${isLogin ? 'active' : ''}`}
              onClick={() => switchTab(true)}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`auth-mode-tab ${!isLogin ? 'active' : ''}`}
              onClick={() => switchTab(false)}
            >
              Create Account
            </button>
          </div>

          <div className="auth-form-header">
            <h3>{isLogin ? 'Welcome Back' : 'Create Your Account'}</h3>
            <p>
              {isLogin
                ? 'Sign in with your registered credentials to access your portal'
                : 'Join thousands of verified customers, professionals, and companies'}
            </p>
          </div>

          {/* Segmented Role Switcher */}
          <div className="auth-role-section">
            <label className="auth-section-label">Select Account Type</label>
            <div className="auth-segmented-roles">
              <button
                type="button"
                className={`auth-role-option ${role === 'customer' ? 'selected' : ''}`}
                onClick={() => setRole('customer')}
              >
                <span className="auth-role-icon">🏠</span>
                <div className="auth-role-text">
                  <strong>Customer</strong>
                  <small>Book Services</small>
                </div>
              </button>

              <button
                type="button"
                className={`auth-role-option ${role === 'worker' ? 'selected' : ''}`}
                onClick={() => setRole('worker')}
              >
                <span className="auth-role-icon">⚡</span>
                <div className="auth-role-text">
                  <strong>Worker</strong>
                  <small>Find Jobs</small>
                </div>
              </button>

              <button
                type="button"
                className={`auth-role-option ${role === 'business' ? 'selected' : ''}`}
                onClick={() => setRole('business')}
              >
                <span className="auth-role-icon">🏢</span>
                <div className="auth-role-text">
                  <strong>Business</strong>
                  <small>Hire Crews</small>
                </div>
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="auth-error-pill">
              <span>⚠️</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Core Credentials Form */}
          <form className="auth-input-form" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="auth-row-2col">
                <div className="auth-field">
                  <label>First Name</label>
                  <input
                    type="text"
                    placeholder="Rahul"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="auth-field">
                  <label>Last Name</label>
                  <input
                    type="text"
                    placeholder="Sharma"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="auth-field">
              <label>Email Address</label>
              <div className="auth-input-adornment">
                <span className="auth-input-icon">✉️</span>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {!isLogin && (
              <div className="auth-field">
                <label>Mobile Number (for SMS updates & OTP)</label>
                <div className="auth-input-adornment">
                  <span className="auth-input-icon">📱</span>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
            )}

            {!isLogin && role === 'worker' && (
              <div className="auth-field">
                <label>Select Primary Trade</label>
                <select value={trade} onChange={(e) => setTrade(e.target.value)}>
                  <option value="Electrician">⚡ Electrician & Wiring</option>
                  <option value="Plumber">🔧 Plumber & Pipe Fitting</option>
                  <option value="Carpenter">🪚 Carpenter & Woodwork</option>
                  <option value="AC Technician">❄️ AC & Appliance Technician</option>
                  <option value="Mason (Rajmistri)">🧱 Mason & Civil Construction</option>
                  <option value="Painter">🎨 Painter & Wall Finisher</option>
                  <option value="Welder">🔥 Welder & Metal Fabricator</option>
                </select>
              </div>
            )}

            {!isLogin && role === 'business' && (
              <div className="auth-field">
                <label>Company / Organization Name</label>
                <div className="auth-input-adornment">
                  <span className="auth-input-icon">🏢</span>
                  <input
                    type="text"
                    placeholder="Apex Infrastructure Pvt. Ltd."
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <div className="auth-field">
              <div className="auth-label-row">
                <label>Password</label>
                {isLogin && (
                  <button
                    type="button"
                    className="auth-forgot-link"
                    onClick={() => alert('Password reset verification link has been sent to your registered email.')}
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="auth-input-adornment">
                <span className="auth-input-icon">🔒</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={isLogin ? 'Enter your secure password' : 'Minimum 6 characters'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="auth-eye-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {!isLogin && (
              <label className="auth-terms-clause">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                />
                <span>
                  I agree to the Mazdoor Sytu{' '}
                  <a href="/terms" onClick={(e) => { e.preventDefault(); onNavigate?.('/terms') }}>
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="/privacy" onClick={(e) => { e.preventDefault(); onNavigate?.('/privacy') }}>
                    Privacy Policy
                  </a>.
                </span>
              </label>
            )}

            <button
              type="submit"
              className={`auth-action-button ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading
                ? 'Validating Credentials…'
                : isLogin
                ? 'Sign In to Portal →'
                : 'Create Account & Continue →'}
            </button>
          </form>

          {/* Social Divider */}
          <div className="auth-divider">
            <span>or continue with</span>
          </div>

          {/* Google SSO Button */}
          <button
            type="button"
            className="auth-google-btn"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.26 21.36 7.33 24 12 24z" />
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.02-3.15z" />
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
            </svg>
            <span>Google Account</span>
          </button>

          {/* Quick Demo Access Pills */}
          <div className="auth-fast-demo-wrap">
            <span className="auth-demo-label">⚡ Fast 1-Click Demo Testing</span>
            <div className="auth-demo-pills">
              <button
                type="button"
                className="auth-demo-pill"
                onClick={() => handleQuickDemo('customer')}
              >
                🏠 Customer Portal
              </button>
              <button
                type="button"
                className="auth-demo-pill"
                onClick={() => handleQuickDemo('worker')}
              >
                ⚡ Worker Portal
              </button>
              <button
                type="button"
                className="auth-demo-pill"
                onClick={() => handleQuickDemo('business')}
              >
                🏢 Business Portal
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
