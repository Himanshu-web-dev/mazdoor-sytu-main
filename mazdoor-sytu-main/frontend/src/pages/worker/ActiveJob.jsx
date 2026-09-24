import { useState } from 'react'
import WorkerLayout from './WorkerLayout'

const JOB_STAGES = [
  { key: 'accepted',   label: 'Accepted',     icon: '✅', desc: 'Job confirmed. Get ready.' },
  { key: 'ontheway',   label: 'On The Way',   icon: '🛵', desc: 'Heading to customer location.' },
  { key: 'arrived',    label: 'Arrived',      icon: '📍', desc: 'At the site. Ring the bell.' },
  { key: 'started',    label: 'Work Started', icon: '⚙️', desc: 'Work in progress.' },
  { key: 'completed',  label: 'Completed',    icon: '🏁', desc: 'Work done. Collect payment.' },
]

const CHAT_MSGS = [
  { from: 'customer', text: 'Hi Rahul, I have left the main door open for you.', time: '5:12 PM' },
  { from: 'worker',   text: 'Perfect. I am almost there.', time: '5:13 PM' },
  { from: 'customer', text: 'Please ring the bell when you arrive.', time: '5:15 PM' },
]

export default function ActiveJob({ session, onNavigate, onLogout, workerData, onCompleteJob }) {
  const job = workerData?.activeJob
  const [stage, setStage] = useState(0) // index in JOB_STAGES
  const [chatMsg, setChatMsg] = useState('')
  const [messages, setMessages] = useState(CHAT_MSGS)
  const [beforePhotos, setBeforePhotos] = useState([])
  const [afterPhotos,  setAfterPhotos]  = useState([])
  const [notes, setNotes] = useState('')
  const [completed, setCompleted] = useState(false)
  const [locationSharing, setLocationSharing] = useState(true)

  if (!job) {
    return (
      <WorkerLayout
        activePath="/worker/active-job"
        session={session}
        workerData={workerData}
        onNavigate={onNavigate}
        onLogout={onLogout}
        title="Live Job"
        eyebrow="Worker Portal"
        subtitle="No active job right now"
      >
        <div className="worker-card-panel" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚡</div>
          <h3 style={{ margin: '0 0 8px', fontSize: '18px' }}>No Active Job</h3>
          <p style={{ color: '#6b7c6f', margin: '0 0 20px', fontSize: '14px' }}>
            Accept a job request to start tracking it live here.
          </p>
          <button className="wk-btn-success" onClick={() => onNavigate('/worker/jobs')}>
            Browse Jobs →
          </button>
        </div>
      </WorkerLayout>
    )
  }

  const currentStage = JOB_STAGES[stage]
  const isCompleted  = stage >= JOB_STAGES.length - 1 || completed

  const advanceStage = () => {
    if (stage < JOB_STAGES.length - 1) {
      setStage(s => s + 1)
    } else {
      setCompleted(true)
      if (onCompleteJob) onCompleteJob()
    }
  }

  const sendMessage = () => {
    if (!chatMsg.trim()) return
    setMessages(prev => [...prev, { from: 'worker', text: chatMsg, time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) }])
    setChatMsg('')
  }

  const handlePhoto = (e, type) => {
    const files = Array.from(e.target.files || [])
    const urls = files.map(f => URL.createObjectURL(f))
    if (type === 'before') setBeforePhotos(p => [...p, ...urls])
    else setAfterPhotos(p => [...p, ...urls])
  }

  return (
    <WorkerLayout
      activePath="/worker/active-job"
      session={session}
      workerData={workerData}
      onNavigate={onNavigate}
      onLogout={onLogout}
      title="Live Job"
      eyebrow="Worker Portal"
      subtitle={`${job.title} • ${job.customer}`}
    >
      {completed && (
        <div style={{ background: 'rgba(22,163,74,0.12)', border: '1.5px solid rgba(22,163,74,0.3)', borderRadius: '14px', padding: '20px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🏁</div>
          <strong style={{ fontSize: '18px', display: 'block', color: '#15803d' }}>Job Completed!</strong>
          <p style={{ color: '#6b7c6f', margin: '6px 0 16px', fontSize: '14px' }}>Payment of {job.price} will be credited to your wallet within 24 hrs.</p>
          <button className="wk-btn-success" onClick={() => onNavigate('/worker/earnings')}>View Earnings →</button>
        </div>
      )}

      {/* Job Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0f1c14, #1a3320)',
        borderRadius: '16px', padding: '24px 28px', color: '#fff',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontWeight: 700, letterSpacing: '0.8px', marginBottom: '4px' }}>
              JOB ID: {job.id}
            </div>
            <h2 style={{ margin: '0 0 6px', fontSize: '22px', fontWeight: 900 }}>{job.title}</h2>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.65)', fontSize: '14px' }}>
              👤 {job.customer} &nbsp;•&nbsp; {job.service} &nbsp;•&nbsp; 💵 {job.price}
            </p>
            <p style={{ margin: '6px 0 0', color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>
              📍 {job.address} &nbsp;•&nbsp; 🕒 {job.time}
            </p>
          </div>
          <div style={{
            background: 'rgba(34,197,94,0.15)', border: '2px solid #22c55e',
            borderRadius: '12px', padding: '12px 16px', textAlign: 'center', flexShrink: 0,
          }}>
            <div style={{ fontSize: '20px' }}>{currentStage.icon}</div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#22c55e', marginTop: '4px' }}>{currentStage.label}</div>
          </div>
        </div>
      </div>

      {/* Progress Stepper */}
      <div className="worker-card-panel">
        <div>
          <span className="worker-panel-kicker">JOB PROGRESS</span>
          <h3>Step {stage + 1} of {JOB_STAGES.length}: {currentStage.label}</h3>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', overflowX: 'auto', paddingBottom: '4px' }}>
          {JOB_STAGES.map((s, i) => (
            <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
              }}>
                <div style={{
                  width: '42px', height: '42px', borderRadius: '50%',
                  background: i < stage ? '#16a34a' : i === stage ? '#22c55e' : '#d4dbd6',
                  color: i <= stage ? '#fff' : '#94a3b8',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '18px', fontWeight: 800,
                  border: i === stage ? '3px solid #16a34a' : '2px solid transparent',
                  boxShadow: i === stage ? '0 0 0 4px rgba(22,163,74,0.2)' : 'none',
                  transition: 'all 0.3s',
                }}>
                  {i < stage ? '✓' : s.icon}
                </div>
                <span style={{ fontSize: '10px', fontWeight: 700, color: i === stage ? '#16a34a' : '#94a3b8', textAlign: 'center', maxWidth: '60px' }}>
                  {s.label}
                </span>
              </div>
              {i < JOB_STAGES.length - 1 && (
                <div style={{ width: '32px', height: '3px', background: i < stage ? '#16a34a' : '#d4dbd6', borderRadius: '2px', flexShrink: 0, transition: 'all 0.3s' }} />
              )}
            </div>
          ))}
        </div>
        <p style={{ margin: 0, fontSize: '13.5px', color: '#6b7c6f', background: '#f4f6f4', padding: '10px 14px', borderRadius: '8px' }}>
          {currentStage.desc}
        </p>
        {!completed && (
          <button className="wk-btn-success" style={{ width: '100%', padding: '14px', fontSize: '15px' }} onClick={advanceStage}>
            {stage < JOB_STAGES.length - 1 ? `Mark as "${JOB_STAGES[stage + 1].label}" →` : '🏁 Mark Job Complete'}
          </button>
        )}
      </div>

      {/* Map + Location */}
      <div className="worker-card-panel">
        <div className="worker-panel-head">
          <div>
            <span className="worker-panel-kicker">LIVE LOCATION</span>
            <h3>Navigation & ETA</h3>
          </div>
          <button
            className={locationSharing ? 'wk-btn-success' : 'wk-btn-outline'}
            style={{ fontSize: '12px', padding: '6px 14px' }}
            onClick={() => setLocationSharing(l => !l)}
          >
            {locationSharing ? '📍 Sharing Live' : '📍 Start Sharing'}
          </button>
        </div>
        <div style={{
          height: '220px', borderRadius: '12px', overflow: 'hidden',
          background: '#e8f0e9', position: 'relative',
        }}>
          <iframe
            title="Worker Live Map"
            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d28048.5!2d77.7064!3d28.9845!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1695000000000!5m2!1sen!2sin"
            width="100%" height="100%" style={{ border: 0 }} loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          {/* ETA overlay */}
          <div style={{
            position: 'absolute', bottom: '10px', left: '10px', right: '10px',
            background: 'rgba(15,28,20,0.92)', borderRadius: '10px', padding: '10px 14px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div style={{ color: '#fff' }}>
              <strong style={{ fontSize: '13px' }}>🛵 {job.address}</strong>
              <div style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.6)' }}>Traffic: Clear</div>
            </div>
            <div style={{ textAlign: 'right', color: '#22c55e' }}>
              <strong style={{ fontSize: '15px' }}>~12 min</strong>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>ETA</div>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <a href={`https://maps.google.com/?q=${encodeURIComponent(job.address)}`} target="_blank" rel="noreferrer" className="wk-btn-primary" style={{ flex: 1, textAlign: 'center', padding: '10px', textDecoration: 'none', display: 'block' }}>
            🧭 Open in Maps
          </a>
          <button className="wk-btn-outline" style={{ flex: 1 }}>📞 Call (via Platform)</button>
        </div>
      </div>

      {/* Work Notes + Photos */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Work Notes */}
        <div className="worker-card-panel">
          <div>
            <span className="worker-panel-kicker">WORK NOTES</span>
            <h3>On-site instructions</h3>
          </div>
          <p style={{ margin: 0, fontSize: '13.5px', color: '#2d3a30', lineHeight: 1.6, background: '#f4f6f4', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #16a34a' }}>
            {job.description}
          </p>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Add your own site notes here..."
            rows={4}
            style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #d4dbd6', fontSize: '13px', resize: 'vertical', fontFamily: 'Inter, sans-serif' }}
          />
        </div>

        {/* Before/After Photos */}
        <div className="worker-card-panel">
          <div>
            <span className="worker-panel-kicker">WORK PROOF</span>
            <h3>Before & After Photos</h3>
          </div>
          {['before', 'after'].map(type => (
            <div key={type}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#6b7c6f', marginBottom: '8px', textTransform: 'capitalize' }}>
                {type === 'before' ? '📷 Before Photos' : '📸 After Photos'}
              </div>
              <label style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                padding: '12px', borderRadius: '10px', border: '2px dashed #d4dbd6',
                cursor: 'pointer', fontSize: '13px', color: '#6b7c6f', background: '#fafbfa',
                marginBottom: '8px',
              }}>
                + Add {type} photos
                <input type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={e => handlePhoto(e, type)} />
              </label>
              {(type === 'before' ? beforePhotos : afterPhotos).length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                  {(type === 'before' ? beforePhotos : afterPhotos).map((url, i) => (
                    <img key={i} src={url} alt={`${type} ${i+1}`} style={{ width: '100%', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Platform Chat */}
      <div className="worker-card-panel">
        <div className="worker-panel-head">
          <div>
            <span className="worker-panel-kicker">PLATFORM CHAT</span>
            <h3>Chat with {job.customer}</h3>
          </div>
          <span style={{ fontSize: '11px', color: '#6b7c6f', fontWeight: 600 }}>🔒 End-to-end secure</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '220px', overflowY: 'auto', padding: '4px 0' }}>
          {messages.map((msg, i) => (
            <div key={i} style={{
              display: 'flex',
              justifyContent: msg.from === 'worker' ? 'flex-end' : 'flex-start',
            }}>
              <div style={{
                maxWidth: '75%', padding: '10px 14px', borderRadius: msg.from === 'worker' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                background: msg.from === 'worker' ? '#16a34a' : '#f4f6f4',
                color: msg.from === 'worker' ? '#fff' : '#0f1c14',
                fontSize: '13.5px', lineHeight: 1.5,
              }}>
                <div>{msg.text}</div>
                <div style={{ fontSize: '10px', marginTop: '4px', opacity: 0.65, textAlign: 'right' }}>{msg.time}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={chatMsg}
            onChange={e => setChatMsg(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
            style={{ flex: 1, padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #d4dbd6', fontSize: '13.5px' }}
          />
          <button className="wk-btn-success" onClick={sendMessage} style={{ padding: '10px 18px' }}>Send</button>
        </div>
      </div>

    </WorkerLayout>
  )
}
