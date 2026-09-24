import { useState } from 'react'
import { loginAdmin } from '../../services/authService'
import { saveActiveSession } from '../../services/authService'
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
          if (onAuthenticated) onAuthenticated(res.session)
        }, 800)
      } else {
        setLoading(false)
        setError(res.error || 'Invalid credentials. Access denied.')
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
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:16,height:16,flexShrink:0,marginTop:1}}>
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
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
            <div className="admin-success-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2.5" style={{width:30,height:30}}>
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <polyline points="9 12 11 14 15 10"/>
              </svg>
            </div>
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
                <div className="admin-field-input-wrap">
                  <span className="admin-input-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:15,height:15}}>
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </span>
                  <input
                    type="email"
                    className="admin-field-input has-icon"
                    placeholder="mazdoorsetu.support@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="username"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div className="admin-field-group">
                <label className="admin-field-label">Password</label>
                <div className="admin-field-input-wrap">
                  <span className="admin-input-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:15,height:15}}>
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="admin-field-input has-icon"
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
                    {showPassword ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:16,height:16}}><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:16,height:16}}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="admin-error-box">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:15,height:15,flexShrink:0}}>
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
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

