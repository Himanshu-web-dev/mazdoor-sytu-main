import { useEffect, useMemo, useState } from 'react'
import WorkerLayout from './WorkerLayout'

const defaultProfile = {
  name: 'Rahul Kumar',
  phone: '+91 98765 43210',
  email: 'rahul.kumar@example.com',
  service: 'Electrician',
  experience: '5 years',
  serviceArea: 'Meerut city and nearby areas (15 km)',
  pricing: '₹250 onwards',
  verification: 'Verified by Mazdoor Sytu',
  bankAccount: 'HDFC Bank •••• 7591',
  ifsc: 'HDFC0001234',
  emergencyPhone: '+91 98111 22334',
}

const INITIAL_SKILLS = ['Electrical wiring', 'Fan installation', 'MCB repair', 'Switch & socket fitting', 'Inverter setup']

export default function WorkerProfile({ session, onNavigate, onProfileUpdate, onLogout, workerData }) {
  const initialProfile = useMemo(() => ({
    ...defaultProfile,
    name: session?.name || workerData?.profile?.name || defaultProfile.name,
    phone: session?.phone || workerData?.profile?.phone || defaultProfile.phone,
    email: session?.email || workerData?.profile?.email || defaultProfile.email,
    service: session?.service || workerData?.profile?.service || defaultProfile.service,
    experience: session?.experience || workerData?.profile?.experience || defaultProfile.experience,
    serviceArea: session?.serviceArea || workerData?.profile?.serviceArea || defaultProfile.serviceArea,
    pricing: session?.pricing || workerData?.profile?.pricing || defaultProfile.pricing,
    verification: session?.verification || workerData?.profile?.verification || defaultProfile.verification,
  }), [session, workerData])

  const [profile, setProfile] = useState(initialProfile)
  const [skills, setSkills] = useState(INITIAL_SKILLS)
  const [newSkill, setNewSkill] = useState('')
  const [saveState, setSaveState] = useState('idle')

  useEffect(() => {
    setProfile(initialProfile)
  }, [initialProfile])

  const handleChange = (field) => (event) => {
    setProfile(cur => ({ ...cur, [field]: event.target.value }))
  }

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills(prev => [...prev, newSkill.trim()])
      setNewSkill('')
    }
  }

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(prev => prev.filter(s => s !== skillToRemove))
  }

  const handleSave = () => {
    if (onProfileUpdate) {
      onProfileUpdate(profile)
    }
    setSaveState('success')
    setTimeout(() => setSaveState('idle'), 3000)
  }

  return (
    <WorkerLayout
      activePath="/worker/profile"
      session={session}
      workerData={workerData}
      onNavigate={onNavigate}
      onLogout={onLogout}
      title="Profile & KYC"
      eyebrow="Worker Portal"
      subtitle="Manage your identity, professional qualifications and service settings"
      headerActions={
        <button
          type="button"
          className="wk-btn-primary"
          style={{ padding: '8px 18px', fontSize: '13px' }}
          onClick={handleSave}
        >
          💾 Save Changes
        </button>
      }
    >
      {/* Save Success Alert */}
      {saveState === 'success' && (
        <div
          style={{
            background: 'rgba(22,163,74,0.12)',
            border: '1.5px solid #16a34a',
            borderRadius: '10px',
            padding: '12px 16px',
            marginBottom: '20px',
            color: '#15803d',
            fontWeight: 700,
            fontSize: '13.5px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>✓</span> Profile and qualifications updated successfully!
        </div>
      )}

      {/* Profile Overview Card */}
      <div className="worker-card-panel" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #16a34a, #15803d)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '26px',
              fontWeight: 900,
              boxShadow: '0 4px 12px rgba(22,163,74,0.25)',
            }}
          >
            {profile.name.slice(0, 2).toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#0f1c14' }}>
                {profile.name}
              </h2>
              <span style={{ background: 'rgba(22,163,74,0.1)', color: '#16a34a', fontSize: '11px', fontWeight: 800, padding: '3px 8px', borderRadius: '4px' }}>
                ✓ VERIFIED WORKER
              </span>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: '13.5px', color: '#6b7c6f' }}>
              {profile.service} • {profile.experience} experience • {profile.serviceArea}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="wk-btn-secondary" onClick={() => onNavigate('/worker/documents')}>
              📄 KYC Documents
            </button>
            <button className="wk-btn-secondary" onClick={() => onNavigate('/worker/availability')}>
              🟢 Availability
            </button>
          </div>
        </div>

        {/* Profile Completion Bar */}
        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #eef2ef' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
            <span style={{ color: '#0f1c14' }}>Profile Completion</span>
            <span style={{ color: '#16a34a' }}>90%</span>
          </div>
          <div style={{ height: '8px', background: '#e2e8e4', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{ width: '90%', height: '100%', background: 'linear-gradient(90deg, #16a34a, #22c55e)' }} />
          </div>
        </div>
      </div>

      {/* 2-Column Form Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Personal & Contact Details */}
        <div className="worker-card-panel">
          <div className="worker-panel-head">
            <div>
              <span className="worker-panel-kicker">PERSONAL DETAILS</span>
              <h3>Identity & Contact</h3>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                Full Name
              </label>
              <input
                className="worker-input"
                value={profile.name}
                onChange={handleChange('name')}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #d4dbd6', fontSize: '14px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                Registered Phone Number
              </label>
              <input
                className="worker-input"
                value={profile.phone}
                onChange={handleChange('phone')}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #d4dbd6', fontSize: '14px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                Email Address
              </label>
              <input
                className="worker-input"
                value={profile.email}
                onChange={handleChange('email')}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #d4dbd6', fontSize: '14px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                Emergency Contact Number
              </label>
              <input
                className="worker-input"
                defaultValue={defaultProfile.emergencyPhone}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #d4dbd6', fontSize: '14px' }}
              />
            </div>
          </div>
        </div>

        {/* Service & Work Settings */}
        <div className="worker-card-panel">
          <div className="worker-panel-head">
            <div>
              <span className="worker-panel-kicker">WORK PREFERENCES</span>
              <h3>Service & Pricing</h3>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                Primary Trade / Service
              </label>
              <input
                className="worker-input"
                value={profile.service}
                onChange={handleChange('service')}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #d4dbd6', fontSize: '14px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                Total Experience
              </label>
              <input
                className="worker-input"
                value={profile.experience}
                onChange={handleChange('experience')}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #d4dbd6', fontSize: '14px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                Service Area / Coverage Radius
              </label>
              <input
                className="worker-input"
                value={profile.serviceArea}
                onChange={handleChange('serviceArea')}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #d4dbd6', fontSize: '14px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                Base Visiting / Starting Rate
              </label>
              <input
                className="worker-input"
                value={profile.pricing}
                onChange={handleChange('pricing')}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #d4dbd6', fontSize: '14px' }}
              />
            </div>
          </div>
        </div>

        {/* Skills & Specializations */}
        <div className="worker-card-panel">
          <div className="worker-panel-head">
            <div>
              <span className="worker-panel-kicker">SKILLS LIST</span>
              <h3>Specializations</h3>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
            {skills.map((skill) => (
              <span
                key={skill}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '999px',
                  background: 'rgba(22,163,74,0.1)',
                  border: '1.5px solid #16a34a',
                  color: '#15803d',
                  fontSize: '12.5px',
                  fontWeight: 700,
                }}
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#15803d', fontWeight: 800, padding: 0 }}
                >
                  ✕
                </button>
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              placeholder="Add skill (e.g. Inverter Wiring)..."
              value={newSkill}
              onChange={e => setNewSkill(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill() } }}
              style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1.5px solid #d4dbd6', fontSize: '13px' }}
            />
            <button
              type="button"
              className="wk-btn-secondary"
              onClick={handleAddSkill}
              style={{ padding: '8px 16px', fontSize: '13px' }}
            >
              + Add
            </button>
          </div>
        </div>

        {/* Bank & Payout Information */}
        <div className="worker-card-panel">
          <div className="worker-panel-head">
            <div>
              <span className="worker-panel-kicker">PAYMENT RECEIVING</span>
              <h3>Bank & UPI Info</h3>
            </div>
            <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: 700 }}>✓ Verified</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #eef2ef', fontSize: '13px' }}>
              <span style={{ color: '#6b7c6f' }}>Primary Bank:</span>
              <strong>{defaultProfile.bankAccount}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #eef2ef', fontSize: '13px' }}>
              <span style={{ color: '#6b7c6f' }}>IFSC Code:</span>
              <strong>{defaultProfile.ifsc}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontSize: '13px' }}>
              <span style={{ color: '#6b7c6f' }}>Payout Schedule:</span>
              <strong style={{ color: '#16a34a' }}>Every 24 Hours / Daily Auto-Sweep</strong>
            </div>
          </div>

          <button
            type="button"
            className="wk-btn-secondary"
            style={{ width: '100%', marginTop: '8px', fontSize: '13px' }}
            onClick={() => onNavigate('/worker/wallet')}
          >
            Manage Wallet & Payout Methods →
          </button>
        </div>
      </div>
    </WorkerLayout>
  )
}
