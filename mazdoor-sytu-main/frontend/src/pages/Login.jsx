import { useState } from 'react'
import { loginUser, loginWithGoogle } from '../services/authService'
import './Auth.css'

const LOGIN_ROLE_INFO = {
  customer: {
    tagline: 'Welcome Back to Fast, Reliable Service',
    description: 'Book trusted electricians, plumbers, appliance technicians, and carpenters near you in minutes.',
    stats: [
      { label: 'Active Pros', value: '45,000+' },
      { label: 'Avg Arrival', value: '12 Min' },
      { label: 'Satisfaction', value: '99.4%' },
    ],
    quote: 'Found an expert plumber in Shastri Nagar within 10 minutes. The pricing was transparent and repair was instant.',
    author: 'Anita Sharma, Homeowner',
  },
  worker: {
    tagline: 'Your Daily Earnings & Jobs Dashboard',
    description: 'Direct customer bookings, daily instant UPI bank transfers, and verified job orders.',
    stats: [
      { label: 'Daily Jobs', value: '3,200+' },
      { label: 'Payout Speed', value: 'Instant' },
      { label: 'Workforce', value: 'Verified' },
    ],
    quote: 'Since getting verified on Mazdoor Sytu, my monthly income doubled and daily payments arrive directly to my bank.',
    author: 'Rahul Kumar, Licensed Electrician',
  },
  business: {
    tagline: 'Enterprise Workforce & Labor Command',
    description: 'Deploy certified technicians, masons, and facility crews for commercial and infrastructure projects.',
    stats: [
      { label: 'Deploy Speed', value: '24 Hours' },
      { label: 'Tax Compliant', value: '100% GST' },
      { label: 'Support', value: '24×7 SLA' },
    ],
    quote: 'We staffed 18 qualified electricians for our industrial project on 24 hours notice. Outstanding platform.',
    author: 'Vikram Malhotra, Apex Infra Projects',
  },
}

export default function Login({ onAuthenticated, onNavigate }) {
  const [role, setRole] = useState('customer')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const activeContent = LOGIN_ROLE_INFO[role] || LOGIN_ROLE_INFO.customer

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both your email address and password.')
      return
    }

    setLoading(true)

    try {
      const res = await loginUser({ email: email.trim(), password, role })
      setLoading(false)
      if (res.success) {
        if (onAuthenticated) {
          onAuthenticated(res.session)
        }
      } else {
        setErrorMessage(res.error || 'Invalid credentials. Please verify your email and password.')
      }
    } catch (err) {
      setLoading(false)
      setErrorMessage('Authentication request failed. Please try again.')
    }
  }

  const handleQuickDemo = (targetRole) => {
    setRole(targetRole)
    const demoAccounts = {
      customer: { uid: 'DEMO-CUST', name: 'Riya Kapoor', email: 'riya@mazdoorsytu.in', role: 'customer', phone: '+91 98101 22334', authenticated: true },
      worker: { uid: 'DEMO-WORKER', name: 'Rahul Kumar', email: 'rahul.kumar@mazdoorsytu.in', role: 'worker', phone: '+91 98765 43210', service: 'Electrician', authenticated: true },
      business: { uid: 'DEMO-BIZ', name: 'Apex Infrastructure', email: 'contact@apexinfra.com', role: 'business', phone: '+91 98110 55432', companyName: 'Apex Infra Ltd.', authenticated: true },
    }
    if (onAuthenticated) {
      onAuthenticated(demoAccounts[targetRole])
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setErrorMessage('')
    try {
      const res = await loginWithGoogle(role)
      setLoading(false)
      if (res.success) {
        if (onAuthenticated) {
          onAuthenticated(res.session)
        }
      } else {
        setErrorMessage(res.error || 'Google Sign-In failed.')
      }
    } catch (err) {
      setLoading(false)
      setErrorMessage('Google Sign-In was cancelled or failed.')
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
                <span className="auth-brand-kicker">Unified Labor & Service Grid</span>
              </div>
            </div>
            <div className="auth-verified-badge">
              <span className="auth-badge-dot" />
              Secure Sign In
            </div>
          </div>

          <div className="auth-brand-middle">
            <span className="auth-role-pill-indicator">
              {role.toUpperCase()} SIGN IN
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

            {/* Trust Perks */}
            <div className="auth-perk-list">
              <div className="auth-perk-row">
                <span className="auth-perk-check">✓</span>
                <span>End-to-end encrypted session & credential storage</span>
              </div>
              <div className="auth-perk-row">
                <span className="auth-perk-check">✓</span>
                <span>Fast automatic redirect to your dedicated portal</span>
              </div>
              <div className="auth-perk-row">
                <span className="auth-perk-check">✓</span>
                <span>Real-time booking tracking and order history</span>
              </div>
            </div>
          </div>

          {/* Testimonial Box */}
          <div className="auth-testimonial-box">
            <p className="auth-quote-text">“{activeContent.quote}”</p>
            <span className="auth-quote-author">— {activeContent.author}</span>
          </div>
        </aside>

        {/* ── Right Interactive Sign In Form ── */}
        <main className="auth-form-canvas">
          <div className="auth-form-header">
            <h3>Sign In to Your Account</h3>
            <p>Enter your verified credentials to access your dashboard</p>
          </div>

          {/* Role Selector */}
          <div className="auth-role-section">
            <label className="auth-section-label">Sign in as:</label>
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
                  <small>Jobs & Payouts</small>
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
                  <small>Enterprise Hire</small>
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

          {/* Login Form */}
          <form className="auth-input-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label>Email Address or Registered Mobile</label>
              <div className="auth-input-adornment">
                <span className="auth-input-icon">✉️</span>
                <input
                  type="text"
                  placeholder="name@example.com or 9876543210"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <div className="auth-label-row">
                <label>Password</label>
                <button
                  type="button"
                  className="auth-forgot-link"
                  onClick={() => alert('Password reset verification link has been sent to your registered email.')}
                >
                  Forgot Password?
                </button>
              </div>
              <div className="auth-input-adornment">
                <span className="auth-input-icon">🔒</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your account password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
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

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '2px 0 6px' }}>
              <label className="auth-terms-clause" style={{ margin: 0 }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember this device</span>
              </label>
            </div>

            <button
              type="submit"
              className={`auth-action-button ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? 'Authenticating…' : 'Sign In to Portal →'}
            </button>
          </form>

          {/* Social Divider */}
          <div className="auth-divider">
            <span>or sign in with</span>
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

          {/* Quick Demo Access */}
          <div className="auth-fast-demo-wrap">
            <span className="auth-demo-label">⚡ 1-Click Fast Demo Login</span>
            <div className="auth-demo-pills">
              <button
                type="button"
                className="auth-demo-pill"
                onClick={() => handleQuickDemo('customer')}
              >
                🏠 Customer
              </button>
              <button
                type="button"
                className="auth-demo-pill"
                onClick={() => handleQuickDemo('worker')}
              >
                ⚡ Worker
              </button>
              <button
                type="button"
                className="auth-demo-pill"
                onClick={() => handleQuickDemo('business')}
              >
                🏢 Business
              </button>
            </div>
          </div>

          {/* Switch to Signup */}
          <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.86rem', color: '#64748b' }}>
            Don't have an account yet?{' '}
            <button
              type="button"
              onClick={() => onNavigate?.('/signup')}
              style={{
                background: 'none',
                border: 'none',
                color: '#0d9488',
                fontWeight: 800,
                cursor: 'pointer',
                textDecoration: 'underline',
                padding: 0,
                fontFamily: 'inherit'
              }}
            >
              Create Account ➔
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}
