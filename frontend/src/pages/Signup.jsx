import { useState } from 'react'
import { registerUser, loginWithGoogle } from '../services/authService'
import './Auth.css'

const SIGNUP_ROLE_INFO = {
  customer: {
    tagline: 'Get Verified Local Help at Your Doorstep',
    description: 'Book background-checked electricians, plumbers, appliance technicians, and carpenters near you in minutes.',
    stats: [
      { label: 'Verified Pros', value: '45,000+' },
      { label: 'Avg Arrival', value: '12 Min' },
      { label: 'Warranty', value: '30 Days' },
    ],

    perks: [
      '100% Aadhaar & Police verified technicians',
      'Real-time GPS tracking with security start OTP',
      'Transparent flat-rate pricing with no hidden charges',
      'Complete safety guarantee and damage protection',
    ],
    quote: 'Booking an electrician was effortless. The technician arrived in 15 minutes and fixed the wiring cleanly.',
    author: 'Neha Sharma, Verified Customer',
  },
  worker: {
    tagline: 'Join India’s Highest-Paying Artisan Network',
    description: 'Receive direct customer service requests on your phone, daily instant UPI bank settlements, and verified genuine local bookings.',
    stats: [
      { label: 'Settlement', value: 'Instant' },
      { label: 'Payout Speed', value: 'Same Day' },
      { label: 'Insurance', value: '₹2 Lakh' },
    ],
    perks: [
      'Daily instant withdrawals to your bank account or UPI',
      'Direct customer bookings with zero middleman deductions',
      'Complimentary accident and medical insurance coverage',
      'Government verified trade ID card and digital trust badge',
    ],
    quote: 'My income increased by 50% within two weeks of registration. Payments are instant and honest.',
    author: 'Dinesh Yadav, Master Mason & Plumber',
  },
  business: {
    tagline: 'Scale Your Enterprise & Project Workforce',
    description: 'Deploy certified technicians, masons, and facility crews for commercial, infrastructure, and warehouse projects.',
    stats: [
      { label: 'Deployment', value: 'Within 24h' },
      { label: 'Tax Billing', value: '100% GST' },
      { label: 'Crew Scale', value: '5 to 500' },
    ],
    perks: [
      'Pre-vetted skilled & semi-skilled labor deployment',
      'Single consolidated monthly GST tax invoices',
      'Automated daily shift logs and attendance reports',
      'Dedicated enterprise account manager with instant replacements',
    ],
    quote: 'We sourced 24 verified electricians for our warehouse project on 24 hours notice. Flawless execution.',
    author: 'Sanjay Aggarwal, BuildWell Infra Ltd.',
  },
}

export default function Signup({ onAuthenticated, onNavigate }) {
  const [role, setRole] = useState('customer')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [trade, setTrade] = useState('Electrician')
  const [experience, setExperience] = useState('3-5 years')
  const [companyName, setCompanyName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const activeContent = SIGNUP_ROLE_INFO[role] || SIGNUP_ROLE_INFO.customer

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')

    if (!firstName.trim()) {
      setErrorMessage('Please enter your first name.')
      return
    }

    if (!email.trim() || !password) {
      setErrorMessage('Please enter your email and a secure password.')
      return
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.')
      return
    }

    if (!agreeTerms) {
      setErrorMessage('Please agree to the Terms of Service to create your account.')
      return
    }

    setLoading(true)

    try {
      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim()
      const res = await registerUser({
        email: email.trim(),
        password,
        name: fullName,
        phone: phone.trim(),
        role,
        trade: role === 'worker' ? trade : undefined,
        experience: role === 'worker' ? experience : undefined,
        companyName: role === 'business' ? companyName : undefined,
      })

      setLoading(false)
      if (res.success) {
        if (onAuthenticated) {
          onAuthenticated(res.session)
        }
      } else {
        setErrorMessage(res.error || 'Failed to create account. Please check your details.')
      }
    } catch (err) {
      setLoading(false)
      setErrorMessage('Account registration encountered an error. Please try again.')
    }
  }

  const handleGoogleSignUp = async () => {
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
        setErrorMessage(res.error || 'Google Sign-Up failed.')
      }
    } catch (err) {
      setLoading(false)
      setErrorMessage('Google Sign-Up was cancelled or failed.')
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
              Free Registration
            </div>
          </div>

          <div className="auth-brand-middle">
            <span className="auth-role-pill-indicator">
              {role.toUpperCase()} ONBOARDING
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

            {/* Perks List */}
            <div className="auth-perk-list">
              {activeContent.perks.map((perk, idx) => (
                <div key={idx} className="auth-perk-row">
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

        {/* ── Right Interactive Sign Up Form ── */}
        <main className="auth-form-canvas">
          <div className="auth-form-header">
            <h3>Create Your Account</h3>
            <p>Join thousands of verified customers, skilled artisans, and businesses</p>
          </div>

          {/* Role Selector */}
          <div className="auth-role-section">
            <label className="auth-section-label">I am joining as:</label>
            <div className="auth-segmented-roles">
              <button
                type="button"
                className={`auth-role-option ${role === 'customer' ? 'selected' : ''}`}
                onClick={() => setRole('customer')}
              >
                <span className="auth-role-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:18,height:18}}>
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                </span>
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
                <span className="auth-role-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:18,height:18}}>
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                  </svg>
                </span>
                <div className="auth-role-text">
                  <strong>Worker</strong>
                  <small>Find Jobs &amp; Earn</small>
                </div>
              </button>

              <button
                type="button"
                className={`auth-role-option ${role === 'business' ? 'selected' : ''}`}
                onClick={() => setRole('business')}
              >
                <span className="auth-role-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:18,height:18}}>
                    <rect x="2" y="7" width="20" height="14" rx="2"/>
                    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                    <line x1="12" y1="12" x2="12" y2="16"/>
                    <line x1="10" y1="14" x2="14" y2="14"/>
                  </svg>
                </span>
                <div className="auth-role-text">
                  <strong>Business</strong>
                  <small>Hire Teams</small>
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

          {/* Signup Form */}
          <form className="auth-input-form" onSubmit={handleSubmit}>
            <div className="auth-row-2col">
              <div className="auth-field">
                <label>First Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rahul"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="auth-field">
                <label>Last Name</label>
                <input
                  type="text"
                  placeholder="e.g. Sharma"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

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

            <div className="auth-field">
              <label>Mobile Number (for booking alerts & OTP)</label>
              <div className="auth-input-adornment">
                <span className="auth-input-icon">📱</span>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Worker Special Fields */}
            {role === 'worker' && (
              <div className="auth-row-2col">
                <div className="auth-field">
                  <label>Primary Trade</label>
                  <select value={trade} onChange={(e) => setTrade(e.target.value)}>
                    <option value="Electrician">⚡ Electrician</option>
                    <option value="Plumber">🔧 Plumber</option>
                    <option value="Carpenter">🪚 Carpenter</option>
                    <option value="AC Technician">❄️ AC Technician</option>
                    <option value="Mason (Rajmistri)">🧱 Mason (Rajmistri)</option>
                    <option value="Painter">🎨 Painter</option>
                    <option value="Welder">🔥 Welder</option>
                  </select>
                </div>
                <div className="auth-field">
                  <label>Experience</label>
                  <select value={experience} onChange={(e) => setExperience(e.target.value)}>
                    <option value="1-2 years">1–2 Years</option>
                    <option value="3-5 years">3–5 Years</option>
                    <option value="5-8 years">5–8 Years</option>
                    <option value="8+ years">8+ Years Expert</option>
                  </select>
                </div>
              </div>
            )}

            {/* Business Special Fields */}
            {role === 'business' && (
              <div className="auth-field">
                <label>Company / Contractor Legal Name</label>
                <div className="auth-input-adornment">
                  <span className="auth-input-icon">🏢</span>
                  <input
                    type="text"
                    placeholder="e.g. Apex Infrastructure Pvt. Ltd."
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <div className="auth-field">
              <label>Create Secure Password</label>
              <div className="auth-input-adornment">
                <span className="auth-input-icon">🔒</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 6 characters with numbers"
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

            <button
              type="submit"
              className={`auth-action-button ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? 'Creating Account…' : 'Create Account & Continue →'}
            </button>
          </form>

          {/* Social Divider */}
          <div className="auth-divider">
            <span>or sign up with</span>
          </div>

          {/* Google SSO Button */}
          <button
            type="button"
            className="auth-google-btn"
            onClick={handleGoogleSignUp}
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

          {/* Switch to Login */}
          <div className="auth-switch-row">
            Already have an account?{' '}
            <button
              type="button"
              className="auth-switch-link"
              onClick={() => onNavigate?.('/login')}
            >
              Log In →
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}
