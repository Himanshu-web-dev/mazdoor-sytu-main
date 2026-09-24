import { useState } from 'react'

const initialProfile = {
  companyName: 'Nexa Infra Projects',
  ownerName: 'Aarav Singh',
  email: 'aarav@nexainfra.in',
  phone: '+91 98765 12345',
  gst: '27AABCN1234C1Z5',
  businessType: 'Construction & Facility Management',
  address: 'Plot 19, Okhla Industrial Area, New Delhi',
  city: 'Delhi NCR',
  requirements: ['Warehouse staffing', 'Electrical maintenance', 'Facility repair'],
}

export default function BusinessProfile({ _session, onNavigate, onLogout }) {
  const [profile, setProfile] = useState(initialProfile)
  const [saveState, setSaveState] = useState('idle')

  const handleChange = (field) => (event) => {
    setProfile((current) => ({
      ...current,
      [field]: event.target.value,
    }))
  }

  const handleSave = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setSaveState('success')
    window.setTimeout(() => setSaveState('idle'), 1800)
  }

  return (
    <section className="portal-page business-profile-page">
      <aside className="portal-sidebar">
        <div className="portal-brand">
          <img className="portal-logo" src="/official-logo.png" alt="Mazdoor Sytu" />
          <div>
            <strong>Mazdoor Sytu</strong>
            <small>Business portal</small>
          </div>
        </div>

        <nav className="portal-nav" aria-label="Business profile navigation">
          {[
            ['Overview', '/business/dashboard'],
            ['Business profile', '/business/profile'],
            ['Post requirement', '/business/post-requirement'],
            ['Requirements', '/business/requirements'],
            ['Workers', '/business/workers'],
            ['Bookings', '/business/bookings'],
            ['Payments', '/business/payments'],
          ].map(([label, path], index) => (
            <a className={path === '/business/profile' ? 'active' : ''} href={path} key={path} onClick={(event) => { event.preventDefault(); onNavigate(path) }}>
              <span className="nav-bullet">{String(index + 1).padStart(2, '0')}</span>
              {label}
            </a>
          ))}
        </nav>

        <div className="portal-help">
          <span>Need a hand?</span>
          <a href="/support" onClick={(event) => { event.preventDefault(); onNavigate('/support') }}>Visit support ↗</a>
        </div>
      </aside>

      <div className="portal-content">
        <header className="portal-header">
          <div>
            <p className="eyebrow">Business profile</p>
            <h1>Company profile</h1>
          </div>
          <div className="portal-user">
            <span className="user-avatar">NI</span>
            <div>
              <strong>{profile.companyName}</strong>
              <small>Verified business</small>
            </div>
            <span className="user-chevron">⌄</span>
            {onLogout && <button className="portal-logout" type="button" onClick={onLogout}>Logout</button>}
          </div>
        </header>

        {saveState === 'success' && (
          <div className="save-success-banner" role="status" aria-live="polite">
            <span className="save-success-icon">✓</span>
            Changes successfully saved
          </div>
        )}

        <div className="portal-welcome business-profile-welcome">
          <div>
            <span className="portal-date">ACCOUNT DETAILS</span>
            <h2>Manage your company profile</h2>
            <p>Keep your details current so workers can trust your requirements and service standards.</p>
          </div>
          <button className="portal-action" type="button" onClick={() => onNavigate('/business/requirements')}>
            View requirements <span>↗</span>
          </button>
        </div>

        <div className="profile-card-grid">
          <section className="dashboard-card profile-form-card">
            <div className="panel-heading">
              <div>
                <span className="panel-kicker">PROFILE</span>
                <h3>Business information</h3>
              </div>
            </div>

            <div className="profile-form">
              <label>
                <span>Company name</span>
                <input value={profile.companyName} onChange={handleChange('companyName')} />
              </label>
              <label>
                <span>Owner name</span>
                <input value={profile.ownerName} onChange={handleChange('ownerName')} />
              </label>
              <label>
                <span>Email</span>
                <input value={profile.email} onChange={handleChange('email')} />
              </label>
              <label>
                <span>Phone number</span>
                <input value={profile.phone} onChange={handleChange('phone')} />
              </label>
              <label>
                <span>GST number</span>
                <input value={profile.gst} onChange={handleChange('gst')} />
              </label>
              <label>
                <span>Business type</span>
                <input value={profile.businessType} onChange={handleChange('businessType')} />
              </label>
              <label className="wide-field">
                <span>Business address</span>
                <input value={profile.address} onChange={handleChange('address')} />
              </label>
              <label>
                <span>City / Region</span>
                <input value={profile.city} onChange={handleChange('city')} />
              </label>
              <div className="form-actions">
                <button type="button" className="secondary-action">Cancel</button>
                <button type="button" className="primary-action" onClick={handleSave}>Save changes</button>
              </div>
            </div>
          </section>

          <aside className="dashboard-card profile-side-card">
            <div className="panel-heading">
              <div>
                <span className="panel-kicker">PREFERENCES</span>
                <h3>Hiring focus</h3>
              </div>
            </div>

            <div className="preference-list">
              {profile.requirements.map((item) => (
                <label key={item}><input type="checkbox" checked readOnly /> {item}</label>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
