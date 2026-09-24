import { useState, useEffect } from 'react'
import BusinessLayout from './BusinessLayout'
import './BusinessPortal.css'

export default function BusinessProfile({ session, onNavigate, onLogout, onProfileUpdate }) {
  const [profile, setProfile] = useState({
    companyName: session?.companyName || session?.name || 'Apex Infra Ltd.',
    directorName: session?.ownerName || 'Vikram Malhotra',
    email: session?.email || 'contact@apexinfra.com',
    phone: session?.phone || '+91 98110 55432',
    gst: '09AAICA1234F1Z5',
    businessType: 'Civil Infrastructure, MEP & Commercial Contracting',
    address: 'Plot 42, Partapur Industrial Area, Meerut, UP 250103',
    city: 'Meerut / Delhi NCR',
    workforceScale: '50–200 Tradesmen',
    kycStatus: 'Verified Enterprise Account'
  })

  const [toastMessage, setToastMessage] = useState(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (session) {
      setProfile((prev) => ({
        ...prev,
        companyName: session.companyName || session.name || prev.companyName,
        email: session.email || prev.email,
        phone: session.phone || prev.phone,
      }))
    }
  }, [session])

  const handleChange = (field) => (e) => {
    setProfile((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleSave = (e) => {
    e.preventDefault()
    setIsSaving(true)

    // Sync with session if callback exists
    if (onProfileUpdate) {
      onProfileUpdate({
        name: profile.companyName,
        companyName: profile.companyName,
        ownerName: profile.directorName,
        phone: profile.phone,
        email: profile.email,
      })
    }

    setTimeout(() => {
      setIsSaving(false)
      setToastMessage('Company profile & contractor credentials saved successfully!')
      setTimeout(() => setToastMessage(null), 3500)
    }, 400)
  }

  return (
    <BusinessLayout
      activePath="/business/profile"
      session={session}
      onNavigate={onNavigate}
      onLogout={onLogout}
      title="Company Profile & Contractor KYC"
      eyebrow="Enterprise Settings"
      subtitle="Manage your registered legal entity, GST details, verified contractor credentials and site locations"
      headerActions={
        <button
          type="button"
          className="biz-btn-secondary biz-btn-sm"
          onClick={() => onNavigate('/business/requirements')}
        >
          View Requirements ↗
        </button>
      }
    >
      {/* Toast */}
      {toastMessage && (
        <div className="biz-toast" role="status">
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="biz-form-grid">
        {/* Left Column: Form Fields */}
        <div className="biz-form-card">
          <div className="biz-form-section-title">
            <span>🏢</span> Registered Corporate Details
          </div>

          <div className="biz-field-row">
            <div className="biz-form-group">
              <label htmlFor="company-name">Company Legal Name</label>
              <input
                id="company-name"
                type="text"
                required
                value={profile.companyName}
                onChange={handleChange('companyName')}
              />
            </div>

            <div className="biz-form-group">
              <label htmlFor="director-name">Authorized Director / Manager</label>
              <input
                id="director-name"
                type="text"
                required
                value={profile.directorName}
                onChange={handleChange('directorName')}
              />
            </div>
          </div>

          <div className="biz-field-row">
            <div className="biz-form-group">
              <label htmlFor="biz-email">Official Business Email</label>
              <input
                id="biz-email"
                type="email"
                required
                value={profile.email}
                onChange={handleChange('email')}
              />
            </div>

            <div className="biz-form-group">
              <label htmlFor="biz-phone">Direct Phone / Hotline</label>
              <input
                id="biz-phone"
                type="text"
                required
                value={profile.phone}
                onChange={handleChange('phone')}
              />
            </div>
          </div>

          <div className="biz-field-row">
            <div className="biz-form-group">
              <label htmlFor="biz-gst">GSTIN Number</label>
              <input
                id="biz-gst"
                type="text"
                required
                value={profile.gst}
                onChange={handleChange('gst')}
              />
            </div>

            <div className="biz-form-group">
              <label htmlFor="workforce-scale">Workforce Deployment Scale</label>
              <select
                id="workforce-scale"
                value={profile.workforceScale}
                onChange={handleChange('workforceScale')}
              >
                <option value="10–50 Tradesmen">10–50 Tradesmen</option>
                <option value="50–200 Tradesmen">50–200 Tradesmen (Enterprise)</option>
                <option value="200+ Tradesmen">200+ Large Infrastructure</option>
              </select>
            </div>
          </div>

          <div className="biz-form-group">
            <label htmlFor="biz-type">Industry & Contracting Scope</label>
            <input
              id="biz-type"
              type="text"
              required
              value={profile.businessType}
              onChange={handleChange('businessType')}
            />
          </div>

          <div className="biz-form-group">
            <label htmlFor="biz-address">Registered Head Office Address</label>
            <input
              id="biz-address"
              type="text"
              required
              value={profile.address}
              onChange={handleChange('address')}
            />
          </div>

          <div className="biz-form-group">
            <label htmlFor="biz-city">Operating Regions & Hubs</label>
            <input
              id="biz-city"
              type="text"
              required
              value={profile.city}
              onChange={handleChange('city')}
            />
          </div>

          <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
            <button
              type="submit"
              className="biz-btn-primary"
              disabled={isSaving}
              style={{ padding: '12px 28px' }}
            >
              {isSaving ? 'Saving Changes…' : '✓ Save Company Profile'}
            </button>
          </div>
        </div>

        {/* Right Column: Verification Status & Credentials */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* KYC Status Card */}
          <div className="biz-panel">
            <span className="biz-eyebrow">CONTRACTOR VERIFICATION</span>
            <h3 style={{ margin: '4px 0 12px', fontSize: '17px', color: '#0f172a' }}>
              Compliance & Accreditation
            </h3>

            <div
              style={{
                background: '#ecfdf5',
                border: '1.5px solid #a7f3d0',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '16px',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: '#047857',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '18px',
                  flexShrink: 0,
                }}
              >
                ✓
              </div>
              <div>
                <strong style={{ color: '#065f46', fontSize: '14.5px', display: 'block' }}>
                  100% Verified Enterprise Contractor
                </strong>
                <small style={{ color: '#047857' }}>
                  All statutory registrations & tax filings authenticated.
                </small>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                ['GST Registration (09AAICA1234F1Z5)', 'Verified ✓'],
                ['Company Incorporation / PAN', 'Verified ✓'],
                ['Labour Dept. Contractor License', 'Verified ✓'],
                ['Workmen Compensation Insurance', 'Active • Valid 2027'],
              ].map(([doc, status]) => (
                <div
                  key={doc}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: 'var(--biz-slate-50)',
                    border: '1px solid var(--biz-slate-200)',
                    fontSize: '12.5px',
                  }}
                >
                  <span style={{ color: '#0f172a', fontWeight: 600 }}>{doc}</span>
                  <span className="biz-badge active">{status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* SLA Benefits */}
          <div
            style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              borderRadius: 'var(--biz-radius-md)',
              padding: '22px',
              color: '#ffffff',
            }}
          >
            <h4 style={{ margin: '0 0 10px', fontSize: '15px', color: '#34d399' }}>
              Enterprise SLA Benefits Active
            </h4>
            <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: '#cbd5e1', lineHeight: 1.6 }}>
              <li>Priority candidate matching within 2 hours of posting</li>
              <li>Dedicated Relationship Manager & on-site trade coordinator</li>
              <li>Automated GST compliance invoices & digital muster roll</li>
              <li>Free replacement guarantee within 48 hours for skill mismatch</li>
            </ul>
          </div>
        </div>
      </form>
    </BusinessLayout>
  )
}
