import { useState } from 'react'
import { loginAdmin } from '../../services/authService'
import './AdminLogin.css'

const FEATURES = [
  'Complete user, worker & business account oversight',
  'KYC verification queue management',
  'Job postings, bookings & dispute resolution',
  'Platform-wide analytics & revenue monitoring',
  'Review moderation & complaint handling',
]

export default function AdminLogin({ onAuthenticated }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email.trim() || !password) {
      setError('Please enter your Admin email and password.')
      return
    }

    setLoading(true)

    try {
      const res = await loginAdmin({ email: email.trim(), password })
      if (res.success) {
        setSuccess(true)
        setTimeout(() => {
          if (onAuthenticated) {
            onAuthenticated(res.session)
          }
        }, 800)
      } else {
        setLoading(false)
        setError(res.error || 'Invalid credentials. Access denied. This attempt has been logged.')
      }
    } catch (err) {
      setLoading(false)
      setError('Security verification failed. Please try again.')
    }
  }

  return (
    <div className="admin-login-root">
      {/* ── Left brand panel ── */}
      <div className="admin-login-brand">
        <div className="admin-brand-logo">
          <img src="/official-logo.png" alt="Mazdoor Sytu" />
          <div>
            <span>Mazdoor Sytu</span>
            <small>Admin Console</small>
          </div>
        </div>

        <h1 className="admin-brand-headline">
          Operations &<br />
          <em>Platform Control.</em>
        </h1>
        <p className="admin-brand-desc">
          Centralized administration for the Mazdoor Sytu workforce platform.
          This portal is private and not linked from any public-facing surface.
        </p>

        <div className="admin-brand-features">
          {FEATURES.map((f) => (
            <div key={f} className="admin-feature-row">
              <span className="admin-feature-dot" />
              {f}
            </div>
          ))}
        </div>

        <div className="admin-brand-warning">
          <span>⚠</span>
          <span>
            Unauthorized access attempts are logged and subject to legal action under the
            Information Technology Act, 2000.
          </span>
        </div>
      </div>

      {/* ── Right login panel ── */}
      <div className="admin-login-panel">
        <div className="admin-panel-badge">Restricted Access</div>

        {success ? (
          <div className="admin-success-state">
            <div className="admin-success-icon">🔐</div>
            <h3>Identity Verified</h3>
            <p>Entering Admin Console…</p>
          </div>
        ) : (
          <>
            <h2 className="admin-panel-title">Admin Sign In</h2>
            <p className="admin-panel-sub">
              Authorized personnel only. Your session will be monitored and logged.
            </p>

            <form className="admin-form" onSubmit={handleSubmit}>
              <div className="admin-field-group">
                <label className="admin-field-label">Admin Email</label>
                <input
                  type="email"
                  className="admin-field-input"
                  placeholder="admin@mazdoorsytu.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
                  disabled={loading}
                  required
                />
              </div>

              <div className="admin-field-group">
                <label className="admin-field-label">Password</label>
                <div className="admin-field-input-wrap">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="admin-field-input"
                    placeholder="Enter secure password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    disabled={loading}
                    required
                  />
                  <button
                    type="button"
                    className="admin-eye-btn"
                    onClick={() => setShowPassword((p) => !p)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? '🙈' : '👁'}
                  </button>
                </div>
              </div>

              {error && (
                <div className="admin-error-box">
                  <span>🚫</span>
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                className={`admin-submit-btn ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? 'Verifying identity…' : 'Access Admin Console →'}
              </button>
            </form>

            <p className="admin-footer-note">
              This is a private administrative portal. Not affiliated with the public
              registration or login pages. All access is logged.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
