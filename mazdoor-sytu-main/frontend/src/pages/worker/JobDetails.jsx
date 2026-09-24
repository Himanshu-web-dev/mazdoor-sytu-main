import { useState } from 'react'
import WorkerLayout from './WorkerLayout'

export default function JobDetails({ session, onNavigate, onLogout, workerData, onJobDecision }) {
  const [selectedJobId, setSelectedJobId] = useState(
    workerData?.jobRequests?.[0]?.id || workerData?.acceptedJobs?.[0]?.id || 'MS-2084'
  )
  const [actionDone, setActionDone] = useState(null)

  // Merge available jobs to view
  const allJobs = [
    ...(workerData?.jobRequests || []).map(j => ({ ...j, group: 'New Request' })),
    ...(workerData?.acceptedJobs || []).map(j => ({ ...j, group: 'Accepted' })),
    ...(workerData?.upcomingJobs || []).map(j => ({ ...j, group: 'Upcoming' })),
    ...(workerData?.completedJobs || []).map(j => ({ ...j, group: 'Completed' })),
  ]

  const fallbackJob = {
    id: 'MS-2084',
    title: 'Ceiling fan repair & switch wiring',
    customer: 'Anita Sharma',
    customerType: 'Homeowner / Individual',
    phone: '+91 98765 •••••',
    fullPhone: '+91 98765 43210',
    area: 'Modi Nagar, Meerut (1.8 km away)',
    exactAddress: 'Flat 302, Green Valley Apartments, Modi Nagar (unlocked on arrival)',
    service: 'Electrical Service',
    date: '23 September 2026',
    time: '5:30 PM',
    duration: '1.5 – 2 Hours',
    price: '₹560',
    workersRequired: 1,
    skills: ['Ceiling Fan', 'Wiring Repair', 'Switch Board', 'Safety Testing'],
    status: 'New Request',
    description:
      'One ceiling fan in the master bedroom is wobbling and making a humming sound. Also, one 16A modular switch on the main board is sparking when turned on. Please inspect the ceiling hook, regulator, and replace the switch mechanism safely.',
    instructions:
      'Please wear safety shoes and bring your own test pen and multimeters. Ring bell #302 on arrival. Parking available in basement.',
  }

  const currentJob = allJobs.find(j => j.id === selectedJobId) || fallbackJob
  const isAccepted = currentJob.status?.toLowerCase() === 'accepted' || actionDone === 'accepted'
  const isCompleted = currentJob.status?.toLowerCase() === 'completed'

  const handleDecision = (decision) => {
    if (onJobDecision) {
      onJobDecision(currentJob.id, decision)
    }
    setActionDone(decision === 'accept' ? 'accepted' : 'rejected')
  }

  const steps = [
    { key: 'req', label: '1. Request', sub: 'Customer sent' },
    { key: 'acc', label: '2. Accepted', sub: 'Worker confirmed' },
    { key: 'otw', label: '3. On The Way', sub: 'In transit' },
    { key: 'arr', label: '4. Arrived', sub: 'At location' },
    { key: 'wrk', label: '5. In Progress', sub: 'Work started' },
    { key: 'done', label: '6. Completed', sub: 'Payment credited' },
  ]

  return (
    <WorkerLayout
      activePath="/worker/job-details"
      session={session}
      workerData={workerData}
      onNavigate={onNavigate}
      onLogout={onLogout}
      title="Job Details"
      eyebrow="Worker Portal"
      subtitle={`Complete requirement & customer specifications • Booking #${currentJob.id}`}
      headerActions={
        <button
          type="button"
          className="wk-btn-primary"
          style={{ padding: '8px 16px', fontSize: '13px' }}
          onClick={() => onNavigate('/worker/jobs')}
        >
          ← Browse Jobs
        </button>
      }
    >
      {/* Job selector tabs */}
      {allJobs.length > 1 && (
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '6px', marginBottom: '16px' }}>
          {allJobs.map(job => (
            <button
              key={job.id}
              type="button"
              onClick={() => { setSelectedJobId(job.id); setActionDone(null) }}
              style={{
                padding: '7px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                border: selectedJobId === job.id ? '2px solid #16a34a' : '1.5px solid #d4dbd6',
                background: selectedJobId === job.id ? 'rgba(22,163,74,0.1)' : '#fff',
                color: selectedJobId === job.id ? '#16a34a' : '#475569',
              }}
            >
              #{job.id} • {job.title?.slice(0, 20)}...
            </button>
          ))}
        </div>
      )}

      {/* Privacy Notice Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: 'rgba(37,99,235,0.06)',
          border: '1.5px solid rgba(37,99,235,0.2)',
          borderRadius: '12px',
          padding: '12px 18px',
          marginBottom: '20px',
        }}
      >
        <span style={{ fontSize: '20px' }}>🛡️</span>
        <div style={{ fontSize: '12.5px', color: '#1e40af', lineHeight: 1.4 }}>
          <strong>Privacy & Safety Guard:</strong> Exact house address and customer phone number are masked until the job is accepted and in transit. Platform messaging and mediated calling are available.
        </div>
      </div>

      {/* Action feedback */}
      {actionDone === 'accepted' && (
        <div
          style={{
            background: 'rgba(22,163,74,0.1)',
            border: '1.5px solid #16a34a',
            borderRadius: '12px',
            padding: '14px 18px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <strong style={{ color: '#16a34a', fontSize: '14px' }}>✓ Job Accepted!</strong>
            <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#14532d' }}>
              You are assigned to this booking. Ready to start travel?
            </p>
          </div>
          <button
            className="wk-btn-primary"
            style={{ padding: '8px 18px', fontSize: '13px' }}
            onClick={() => onNavigate('/worker/active-job')}
          >
            ⚡ Open Live Job Tracker →
          </button>
        </div>
      )}

      {/* Hero Header */}
      <div className="worker-card-panel" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span style={{ background: '#0f1c14', color: '#fff', padding: '3px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 800 }}>
                #{currentJob.id}
              </span>
              <span className={`worker-status-pill ${isCompleted ? 'pill-completed' : isAccepted ? 'pill-active' : 'pill-pending'}`}>
                {actionDone === 'accepted' ? 'Accepted' : currentJob.status || 'New Request'}
              </span>
              <span style={{ fontSize: '12.5px', color: '#6b7c6f' }}>
                Posted for {currentJob.date || 'Today'}
              </span>
            </div>
            <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: '#0f1c14' }}>
              {currentJob.title}
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: '13.5px', color: '#6b7c6f' }}>
              Category: <strong>{currentJob.service || 'Service'}</strong> &nbsp;•&nbsp; Area: <strong>{currentJob.address || currentJob.area || 'Meerut'}</strong>
            </p>
          </div>

          {/* Pricing & CTA */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6b7c6f', fontWeight: 700 }}>Total Payout</span>
              <div style={{ fontSize: '28px', fontWeight: 900, color: '#16a34a' }}>
                {currentJob.price || '₹500'}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              {!isAccepted && !isCompleted && actionDone !== 'rejected' && (
                <>
                  <button
                    className="wk-btn-success"
                    style={{ padding: '9px 18px', fontSize: '13px' }}
                    onClick={() => handleDecision('accept')}
                  >
                    ✓ Accept Job
                  </button>
                  <button
                    className="wk-btn-danger"
                    style={{ padding: '9px 16px', fontSize: '13px' }}
                    onClick={() => handleDecision('reject')}
                  >
                    ✕ Reject
                  </button>
                </>
              )}
              {isAccepted && (
                <button
                  className="wk-btn-primary"
                  style={{ padding: '9px 18px', fontSize: '13px' }}
                  onClick={() => onNavigate('/worker/active-job')}
                >
                  ⚡ Go to Live Job
                </button>
              )}
              <button
                className="wk-btn-secondary"
                style={{ padding: '9px 14px', fontSize: '13px' }}
                onClick={() => onNavigate('/worker/messages')}
              >
                💬 Chat
              </button>
            </div>
          </div>
        </div>

        {/* 6-step progress bar */}
        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #eef2ef' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em', color: '#6b7c6f', textTransform: 'uppercase' }}>
            Workflow Stage
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '8px', marginTop: '8px' }}>
            {steps.map((st, idx) => {
              const activeStep = isCompleted ? 5 : isAccepted ? 1 : 0
              const isPast = idx < activeStep
              const isCurr = idx === activeStep
              return (
                <div
                  key={st.key}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '8px',
                    background: isCurr ? 'rgba(22,163,74,0.12)' : isPast ? 'rgba(22,163,74,0.05)' : '#f8faf9',
                    border: isCurr ? '1.5px solid #16a34a' : '1px solid #e2e8e4',
                  }}
                >
                  <strong style={{ fontSize: '11.5px', display: 'block', color: isCurr ? '#16a34a' : isPast ? '#0f1c14' : '#94a3b8' }}>
                    {st.label}
                  </strong>
                  <span style={{ fontSize: '10.5px', color: '#6b7c6f' }}>{st.sub}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Grid: 2 Columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Left Column: Requirements & Instructions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Work Description */}
          <div className="worker-card-panel">
            <div className="worker-panel-head">
              <div>
                <span className="worker-panel-kicker">TASK DESCRIPTION</span>
                <h3>Work Details & Scope</h3>
              </div>
            </div>
            <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#334155', margin: 0 }}>
              {currentJob.description || fallbackJob.description}
            </p>

            {/* Scope specifications table */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px', background: '#f8faf9', padding: '14px', borderRadius: '10px' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#6b7c6f', textTransform: 'uppercase', fontWeight: 700 }}>Service Type</span>
                <strong style={{ display: 'block', fontSize: '13px', color: '#0f1c14', marginTop: '2px' }}>{currentJob.service || 'Electrical'}</strong>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: '#6b7c6f', textTransform: 'uppercase', fontWeight: 700 }}>Estimated Duration</span>
                <strong style={{ display: 'block', fontSize: '13px', color: '#0f1c14', marginTop: '2px' }}>{currentJob.duration || '1.5 – 2 Hours'}</strong>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: '#6b7c6f', textTransform: 'uppercase', fontWeight: 700 }}>Workers Needed</span>
                <strong style={{ display: 'block', fontSize: '13px', color: '#0f1c14', marginTop: '2px' }}>{currentJob.workersRequired || 1} Worker</strong>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: '#6b7c6f', textTransform: 'uppercase', fontWeight: 700 }}>Payout Mode</span>
                <strong style={{ display: 'block', fontSize: '13px', color: '#16a34a', marginTop: '2px' }}>Direct Wallet Credit / Cash</strong>
              </div>
            </div>
          </div>

          {/* Required Skills */}
          <div className="worker-card-panel">
            <div className="worker-panel-head">
              <div>
                <span className="worker-panel-kicker">QUALIFICATIONS</span>
                <h3>Required Skills</h3>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {(currentJob.skills || fallbackJob.skills).map((skill) => (
                <span
                  key={skill}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    background: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    color: '#334155',
                  }}
                >
                  ⚡ {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Special Instructions */}
          <div className="worker-card-panel">
            <div className="worker-panel-head">
              <div>
                <span className="worker-panel-kicker">GUIDELINES</span>
                <h3>Special Instructions</h3>
              </div>
            </div>
            <div style={{ background: '#fffbeb', border: '1.5px solid #fde68a', borderRadius: '10px', padding: '14px' }}>
              <p style={{ margin: 0, fontSize: '13px', color: '#92400e', lineHeight: 1.5 }}>
                📝 {currentJob.instructions || fallbackJob.instructions}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Customer & Location */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Customer / Business Information */}
          <div className="worker-card-panel">
            <div className="worker-panel-head">
              <div>
                <span className="worker-panel-kicker">CUSTOMER PROFILE</span>
                <h3>Client Information</h3>
              </div>
              <span style={{ background: 'rgba(22,163,74,0.1)', color: '#16a34a', fontSize: '11.5px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px' }}>
                ✓ Verified Customer
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 0' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #16a34a, #15803d)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '18px',
                }}
              >
                {(currentJob.customer || 'AS').slice(0, 2).toUpperCase()}
              </div>
              <div>
                <strong style={{ fontSize: '16px', display: 'block', color: '#0f1c14' }}>
                  {currentJob.customer || 'Anita Sharma'}
                </strong>
                <span style={{ fontSize: '12.5px', color: '#6b7c6f' }}>
                  {currentJob.customerType || 'Individual Customer • Meerut'}
                </span>
              </div>
            </div>

            {/* Contact row with masking info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px', borderTop: '1px solid #eef2ef', paddingTop: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                <span style={{ color: '#6b7c6f' }}>Phone:</span>
                <strong>{isAccepted ? currentJob.fullPhone || currentJob.phone : (currentJob.phone || '+91 98765 •••••')}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                <span style={{ color: '#6b7c6f' }}>Contact privacy:</span>
                <span style={{ color: '#2563eb', fontSize: '12px', fontWeight: 600 }}>In-app voice call enabled</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              <button
                className="wk-btn-secondary"
                style={{ flex: 1, padding: '8px', fontSize: '12.5px' }}
                onClick={() => onNavigate('/worker/messages')}
              >
                💬 Send Message
              </button>
              <button
                className="wk-btn-secondary"
                style={{ flex: 1, padding: '8px', fontSize: '12.5px' }}
                onClick={() => alert(`Calling customer via Mazdoor Sytu masked proxy for privacy.`)}
              >
                📞 Call Proxy
              </button>
            </div>
          </div>

          {/* Location Area & Map */}
          <div className="worker-card-panel">
            <div className="worker-panel-head">
              <div>
                <span className="worker-panel-kicker">SERVICE LOCATION</span>
                <h3>Area & Navigation</h3>
              </div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <strong style={{ fontSize: '14px', display: 'block', color: '#0f1c14' }}>
                📍 {currentJob.address || currentJob.area || 'Modi Nagar, Meerut'}
              </strong>
              <small style={{ color: '#6b7c6f', fontSize: '12px' }}>
                {isAccepted
                  ? (currentJob.exactAddress || 'Flat 302, Green Valley Apartments, Modi Nagar')
                  : 'Approx. 1.8 km from your current location • Exact flat number shared on accept'}
              </small>
            </div>

            {/* Embedded map preview */}
            <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1.5px solid #d4dbd6', height: '170px' }}>
              <iframe
                title="Job Location Area"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d111812.87158913926!2d77.63945952131922!3d28.987309999676796!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390c64f457b66325%3A0x42fed8beecd2120!2sMeerut%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000"
              />
            </div>

            <button
              className="wk-btn-secondary"
              style={{ width: '100%', marginTop: '12px', fontSize: '13px', padding: '8px' }}
              onClick={() => window.open('https://maps.google.com/?q=Meerut+Uttar+Pradesh', '_blank')}
            >
              🗺️ Open in Google Maps Navigation ↗
            </button>
          </div>
        </div>
      </div>
    </WorkerLayout>
  )
}
