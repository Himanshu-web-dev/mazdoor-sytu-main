import { useEffect, useMemo, useRef, useState } from 'react'
import WorkerLayout from './WorkerLayout'

const defaultProfile = {
  name: 'Rahul Kumar',
  phone: '+91 8004264176',
  email: 'mazdoorsetu.support@gmail.com',
  service: 'Electrician',
  experience: '5 years',
  serviceArea: 'Meerut city and nearby areas (15 km)',
  pricing: 'Ã¢â€šÂ¹250 onwards',
  verification: 'Verified by Mazdoor Sytu',
  bankAccount: 'HDFC Bank Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢ 7591',
  ifsc: 'HDFC0001234',
  upi: 'rahul@hdfcbank',
  emergencyPhone: '+91 8004264176',
  bio: 'Experienced electrician with 5+ years of expertise in residential and commercial electrical work.',
}

const INITIAL_SKILLS = ['Electrical wiring', 'Fan installation', 'MCB repair', 'Switch & socket fitting', 'Inverter setup']
const QUICK_SKILLS   = ['AC repair', 'CCTV wiring', 'Solar panel', 'Generator', 'UPS setup', 'LED fitting']

const SERVICE_OPTIONS = [
  'Electrician', 'Plumber', 'Carpenter', 'Painter', 'AC Technician',
  'Welder', 'Mason', 'Cleaner', 'Security Guard', 'Driver', 'Cook',
  'Gardener', 'Mechanic', 'Tailor', 'Other',
]

const EXPERIENCE_OPTIONS = [
  'Less than 1 year', '1 year', '2 years', '3 years', '4 years', '5 years',
  '6 years', '7 years', '8 years', '9 years', '10+ years', '15+ years',
]

function FieldGroup({ label, hint, children }) {
  return (
    <div className="worker-form-group">
      <label className="worker-form-label">
        <span>{label}</span>
        {hint && <span className="worker-form-hint">{hint}</span>}
      </label>
      {children}
    </div>
  )
}

export default function WorkerProfile({ session, onNavigate, onProfileUpdate, onLogout, workerData }) {
  const initialProfile = useMemo(() => ({
    ...defaultProfile,
    name:           session?.name           || workerData?.profile?.name           || defaultProfile.name,
    phone:          session?.phone          || workerData?.profile?.phone          || defaultProfile.phone,
    email:          session?.email          || workerData?.profile?.email          || defaultProfile.email,
    service:        session?.service        || workerData?.profile?.service        || defaultProfile.service,
    experience:     session?.experience     || workerData?.profile?.experience     || defaultProfile.experience,
    serviceArea:    session?.serviceArea    || workerData?.profile?.serviceArea    || defaultProfile.serviceArea,
    pricing:        session?.pricing        || workerData?.profile?.pricing        || defaultProfile.pricing,
    bio:            workerData?.profile?.bio            || defaultProfile.bio,
    emergencyPhone: workerData?.profile?.emergencyPhone || defaultProfile.emergencyPhone,
  }), [session, workerData])

  const [profile, setProfile]     = useState(initialProfile)
  const [skills, setSkills]       = useState(
    workerData?.profile?.skills?.length ? workerData.profile.skills : INITIAL_SKILLS
  )
  const [newSkill, setNewSkill]   = useState('')
  const [saveState, setSaveState] = useState('idle')
  const [dirty, setDirty]         = useState(false)
  const skillInputRef = useRef(null)

  useEffect(() => { setProfile(initialProfile) }, [initialProfile])

  const handleChange = (field) => (e) => {
    setProfile(cur => ({ ...cur, [field]: e.target.value }))
    setDirty(true)
  }

  const handleAddSkill = () => {
    const trimmed = newSkill.trim()
    if (trimmed && !skills.includes(trimmed)) {
      setSkills(prev => [...prev, trimmed])
      setNewSkill('')
      setDirty(true)
    }
  }

  const handleRemoveSkill = (s) => {
    setSkills(prev => prev.filter(x => x !== s))
    setDirty(true)
  }

  const handleQuickSkill = (s) => {
    if (!skills.includes(s)) {
      setSkills(prev => [...prev, s])
      setDirty(true)
    }
  }

  const handleSave = async () => {
    setSaveState('saving')
    if (onProfileUpdate) onProfileUpdate({ ...profile, skills })
    await new Promise(r => setTimeout(r, 600))
    setSaveState('success')
    setDirty(false)
    setTimeout(() => setSaveState('idle'), 3500)
  }

  const initials = profile.name
    ? profile.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : 'RK'

  const completionFields = [profile.name, profile.phone, profile.email, profile.service, profile.experience, profile.serviceArea, profile.pricing, profile.bio]
  const completionPct = Math.round((completionFields.filter(Boolean).length / completionFields.length) * 100)

  const renderSaveBtn = (large = false) => (
    <button
      type="button"
      className="wk-btn-success"
      style={{
        padding: large ? '10px 28px' : '9px 22px',
        fontSize: large ? '14px' : '13.5px',
        display: 'inline-flex', alignItems: 'center', gap: '8px'
      }}
      onClick={handleSave}
      disabled={saveState === 'saving'}
    >
      {saveState === 'saving' ? 'Saving\u2026' : saveState === 'success' ? '\u2713 Saved!' : 'Save Changes'}
    </button>
  )

  return (
    <WorkerLayout
      activePath="/worker/profile"
      session={session}
      workerData={workerData}
      onNavigate={onNavigate}
      onLogout={onLogout}
      title="My Profile"
      eyebrow="Worker Portal"
      subtitle="Manage your identity, professional qualifications and service settings"
      headerActions={
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {dirty && <span style={{ fontSize: '12px', color: '#ea580c', fontWeight: 700 }}>Unsaved changes</span>}
          {renderSaveBtn()}
        </div>
      }
    >
      {/* Save Success Toast */}
      {saveState === 'success' && (
        <div style={{
          background: 'rgba(22,163,74,0.1)', border: '1.5px solid #16a34a',
          borderRadius: '12px', padding: '13px 18px', color: '#15803d',
          fontWeight: 700, fontSize: '13.5px', display: 'flex', alignItems: 'center', gap: '10px',
        }}>
          <span style={{ width: 22, height: 22, borderRadius: '50%', background: '#16a34a', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800 }}>Ã¢Å“â€œ</span>
          Profile updated and saved successfully Ã¢â‚¬â€ now visible to customers!
        </div>
      )}

      {/* Ã¢â€â‚¬Ã¢â€â‚¬ Profile Hero Card Ã¢â€â‚¬Ã¢â€â‚¬ */}
      <div className="worker-card-panel">
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          {/* Avatar */}
          <div className="worker-profile-avatar-wrap" title="Profile photo">
            <div className="worker-profile-avatar-initials">{initials}</div>
            <span className="worker-avatar-camera-badge">
              <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 12, height: 12 }}>
                <path d="M20 5h-2.586l-2.707-2.707A1 1 0 0 0 14 2h-4a1 1 0 0 0-.707.293L6.586 5H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z" opacity="0.5"/>
                <circle cx="12" cy="13" r="3.5"/>
              </svg>
            </span>
          </div>

          {/* Identity */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <h2 style={{ margin: 0, fontSize: '21px', fontWeight: 800, color: '#0f1c14', letterSpacing: '-0.02em' }}>
                {profile.name}
              </h2>
              <span style={{
                background: 'rgba(22,163,74,0.1)', color: '#16a34a', fontSize: '10.5px',
                fontWeight: 800, padding: '3px 9px', borderRadius: '5px', letterSpacing: '0.4px',
                border: '1px solid rgba(22,163,74,0.2)',
              }}>
                Ã¢Å“â€œ VERIFIED WORKER
              </span>
            </div>
            <p style={{ margin: '5px 0 0', fontSize: '13.5px', color: '#6b7c6f', lineHeight: 1.45 }}>
              {profile.service} &nbsp;Ã¢â‚¬Â¢&nbsp; {profile.experience} experience &nbsp;Ã¢â‚¬Â¢&nbsp; {profile.serviceArea}
            </p>
          </div>

          {/* Quick Actions */}
          <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
            <button className="wk-btn-secondary" onClick={() => onNavigate('/worker/documents')} type="button">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 14, height: 14 }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              KYC Docs
            </button>
            <button className="wk-btn-secondary" onClick={() => onNavigate('/worker/availability')} type="button">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 14, height: 14 }}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              Availability
            </button>
          </div>
        </div>

        {/* Completion Bar */}
        <div style={{ paddingTop: '18px', borderTop: '1px solid #eef2ef' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700, marginBottom: '8px' }}>
            <span style={{ color: '#475569' }}>Profile Completion</span>
            <span style={{ color: completionPct >= 80 ? '#16a34a' : '#ea580c' }}>{completionPct}%</span>
          </div>
          <div style={{ height: '6px', background: '#e9f0ea', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{
              width: `${completionPct}%`, height: '100%', borderRadius: '999px',
              background: completionPct >= 80 ? 'linear-gradient(90deg, #16a34a, #22c55e)' : 'linear-gradient(90deg, #ea580c, #f97316)',
              transition: 'width 0.5s ease',
            }} />
          </div>
          {completionPct < 100 && (
            <p style={{ margin: '6px 0 0', fontSize: '11.5px', color: '#94a3b8' }}>
              Verified profiles get 3Ãƒâ€” more job requests. Fill all fields to reach 100%.
            </p>
          )}
        </div>
      </div>

      {/* Ã¢â€â‚¬Ã¢â€â‚¬ 2-column Form Grid Ã¢â€â‚¬Ã¢â€â‚¬ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(330px, 1fr))', gap: '20px' }}>

        {/* Card 1: Personal & Contact */}
        <div className="worker-card-panel">
          <div className="worker-panel-head">
            <div>
              <span className="worker-panel-kicker">PERSONAL DETAILS</span>
              <h3>Identity &amp; Contact</h3>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <FieldGroup label="Full Name" hint="as on Aadhaar">
              <input className="worker-input" value={profile.name} onChange={handleChange('name')} placeholder="Enter your full name" />
            </FieldGroup>
            <FieldGroup label="Registered Phone" hint="OTP verified">
              <input className="worker-input" value={profile.phone} onChange={handleChange('phone')} placeholder="+91 98765 43210" type="tel" />
            </FieldGroup>
            <FieldGroup label="Email Address" hint="for booking updates">
              <input className="worker-input" value={profile.email} onChange={handleChange('email')} placeholder="you@email.com" type="email" />
            </FieldGroup>
            <FieldGroup label="Emergency Contact" hint="in case of incident">
              <input className="worker-input" value={profile.emergencyPhone || defaultProfile.emergencyPhone} onChange={handleChange('emergencyPhone')} placeholder="+91 98765 00000" type="tel" />
            </FieldGroup>
            <FieldGroup label="Short Bio" hint="shown to customers">
              <textarea className="worker-textarea" value={profile.bio || ''} onChange={handleChange('bio')} placeholder="Describe your experience, specialties and work ethicÃ¢â‚¬Â¦" rows={3} />
            </FieldGroup>
          </div>
        </div>

        {/* Card 2: Service & Pricing */}
        <div className="worker-card-panel">
          <div className="worker-panel-head">
            <div>
              <span className="worker-panel-kicker">WORK PREFERENCES</span>
              <h3>Service &amp; Pricing</h3>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <FieldGroup label="Primary Trade / Service">
              <select className="worker-input" value={profile.service} onChange={handleChange('service')}>
                {SERVICE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </FieldGroup>
            <FieldGroup label="Years of Experience">
              <select className="worker-input" value={profile.experience} onChange={handleChange('experience')}>
                {EXPERIENCE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </FieldGroup>
            <FieldGroup label="Service Coverage Area" hint="city / locality">
              <input className="worker-input" value={profile.serviceArea} onChange={handleChange('serviceArea')} placeholder="e.g. Meerut city, 15 km radius" />
            </FieldGroup>
            <FieldGroup label="Starting Rate / Visiting Fee">
              <input className="worker-input" value={profile.pricing} onChange={handleChange('pricing')} placeholder="e.g. Ã¢â€šÂ¹250 onwards" />
            </FieldGroup>
            {/* Rate preview */}
            <div style={{
              background: 'rgba(22,163,74,0.06)', border: '1px solid rgba(22,163,74,0.18)',
              borderRadius: '10px', padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ fontSize: '12.5px', color: '#475569', fontWeight: 600 }}>Customer sees this as:</span>
              <strong style={{ fontSize: '15px', color: '#16a34a', fontWeight: 800 }}>{profile.pricing || 'Ã¢â‚¬â€'}</strong>
            </div>
          </div>
        </div>

        {/* Card 3: Skills */}
        <div className="worker-card-panel">
          <div className="worker-panel-head">
            <div>
              <span className="worker-panel-kicker">SKILLS & EXPERTISE</span>
              <h3>Specializations</h3>
            </div>
            <span style={{ fontSize: '11.5px', color: '#94a3b8', fontWeight: 600 }}>{skills.length} added</span>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', minHeight: '36px' }}>
            {skills.length === 0 && <span style={{ fontSize: '13px', color: '#94a3b8' }}>Add your skills below.</span>}
            {skills.map(skill => (
              <span key={skill} className="worker-skill-tag">
                {skill}
                <button type="button" className="worker-skill-del" onClick={() => handleRemoveSkill(skill)} title={`Remove ${skill}`}>Ã¢Å“â€¢</button>
              </span>
            ))}
          </div>

          <div>
            <p style={{ fontSize: '11.5px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 8px' }}>Quick add</p>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {QUICK_SKILLS.filter(s => !skills.includes(s)).map(s => (
                <button key={s} type="button" className="worker-quick-chip" onClick={() => handleQuickSkill(s)}>+ {s}</button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              ref={skillInputRef}
              className="worker-input"
              placeholder="Type a skill and press EnterÃ¢â‚¬Â¦"
              value={newSkill}
              onChange={e => setNewSkill(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill() } }}
              style={{ flex: 1 }}
            />
            <button type="button" className="wk-btn-secondary" onClick={handleAddSkill} style={{ flexShrink: 0 }}>+ Add</button>
          </div>
        </div>

        {/* Card 4: Bank & Payout */}
        <div className="worker-card-panel">
          <div className="worker-panel-head">
            <div>
              <span className="worker-panel-kicker">PAYMENT RECEIVING</span>
              <h3>Bank &amp; UPI Info</h3>
            </div>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '4px',
              fontSize: '11.5px', color: '#16a34a', fontWeight: 800,
              background: 'rgba(22,163,74,0.1)', padding: '3px 10px', borderRadius: '999px', border: '1px solid rgba(22,163,74,0.2)',
            }}>Ã¢Å“â€œ Verified</span>
          </div>

          <div>
            {[
              { label: 'Primary Bank Account', value: defaultProfile.bankAccount },
              { label: 'IFSC Code',           value: defaultProfile.ifsc },
              { label: 'UPI ID',              value: defaultProfile.upi },
            ].map(({ label, value }, i, arr) => (
              <div key={label} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px 0', fontSize: '13.5px',
                borderBottom: i < arr.length - 1 ? '1px solid #eef2ef' : 'none',
              }}>
                <span style={{ color: '#6b7c6f', fontWeight: 600 }}>{label}</span>
                <strong style={{ color: '#0f1c14', fontWeight: 800 }}>{value}</strong>
              </div>
            ))}

            <div style={{
              marginTop: '12px', padding: '12px 14px',
              background: 'rgba(22,163,74,0.06)', borderRadius: '10px', border: '1px solid rgba(22,163,74,0.15)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ fontSize: '12.5px', color: '#475569', fontWeight: 600 }}>Payout Schedule</span>
              <strong style={{ fontSize: '13px', color: '#16a34a', fontWeight: 800 }}>Daily Auto-Sweep</strong>
            </div>
          </div>

          <button type="button" className="wk-btn-secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => onNavigate('/worker/wallet')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 14, height: 14 }}><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4z"/></svg>
            Manage Wallet &amp; Payout Methods
          </button>
        </div>
      </div>

      {/* Ã¢â€â‚¬Ã¢â€â‚¬ Floating Save Footer Ã¢â€â‚¬Ã¢â€â‚¬ */}
      <div className="wk-action-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {saveState === 'success' && (
            <span className="wk-toast-success">Ã¢Å“â€œ Profile saved Ã¢â‚¬â€ visible to customers!</span>
          )}
          {dirty && saveState === 'idle' && (
            <span style={{ fontSize: '13px', color: '#ea580c', fontWeight: 700 }}>You have unsaved changes</span>
          )}
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            type="button"
            className="wk-btn-outline"
            onClick={() => { setProfile(initialProfile); setDirty(false) }}
          >
            Discard
          </button>
          {renderSaveBtn(true)}
        </div>
      </div>
    </WorkerLayout>
  )
}

