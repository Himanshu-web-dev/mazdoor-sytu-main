import { useState } from 'react'
import WorkerLayout from './WorkerLayout'

const AV_OPTIONS = [
  {
    key: 'available',
    title: 'Available for Work',
    subtitle: 'Online & Ready',
    desc: 'Visible in customer search and map. Receive instant job requests in real-time.',
    color: '#16a34a',
    bg: '#ecfdf3',
    icon: '⚡',
  },
  {
    key: 'busy',
    title: 'On a Break',
    subtitle: 'Taking a Short Rest',
    desc: 'Taking lunch or tea break. Profile remains visible with a busy tag; no instant popups.',
    color: '#ea580c',
    bg: '#fff7ed',
    icon: '☕',
  },
  {
    key: 'onjob',
    title: 'On Active Job',
    subtitle: 'Service in Progress',
    desc: 'Currently working on site for a client. Automatically resets when job is marked completed.',
    color: '#2563eb',
    bg: '#eff6ff',
    icon: '🔧',
  },
  {
    key: 'temp',
    title: 'Away for a Few Hours',
    subtitle: 'Temporary Unavailable',
    desc: 'Out for material purchase or personal errands. Returning to duty later today.',
    color: '#7c3aed',
    bg: '#f5f3ff',
    icon: '⏳',
  },
  {
    key: 'offline',
    title: 'Offline / Off Duty',
    subtitle: 'Rest Mode',
    desc: 'Work day ended. Hidden from customer search; no new job alerts will be received.',
    color: '#64748b',
    bg: '#f1f5f9',
    icon: '🌙',
  },
]

const DAYS = [
  { key: 'Monday',    short: 'Mon', full: 'Monday' },
  { key: 'Tuesday',   short: 'Tue', full: 'Tuesday' },
  { key: 'Wednesday', short: 'Wed', full: 'Wednesday' },
  { key: 'Thursday',  short: 'Thu', full: 'Thursday' },
  { key: 'Friday',    short: 'Fri', full: 'Friday' },
  { key: 'Saturday',  short: 'Sat', full: 'Saturday' },
  { key: 'Sunday',    short: 'Sun', full: 'Sunday' },
]

const SHIFTS = [
  { label: 'Full Day (8 AM – 8 PM)', start: '08:00', end: '20:00' },
  { label: 'Morning Shift (7 AM – 2 PM)', start: '07:00', end: '14:00' },
  { label: 'Evening Shift (2 PM – 9 PM)', start: '14:00', end: '21:00' },
]

export default function Availability({ session, onNavigate, onLogout, workerData, onAvailabilityToggle }) {
  const [availability, setAvailability] = useState(workerData?.availability || 'available')
  const [radius, setRadius] = useState(12)
  const [hours, setHours] = useState({ start: '08:00', end: '20:00' })
  const [activeDays, setActiveDays] = useState(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'])
  const [saved, setSaved] = useState(false)

  const workerName = session?.name || workerData?.profile?.name || 'Rahul Kumar'
  const service = workerData?.profile?.service || session?.trade || 'Electrician'
  const initials = workerName.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()

  const handleSetAvailability = (key) => {
    setAvailability(key)
    if (onAvailabilityToggle) onAvailabilityToggle(key)
  }

  const toggleDay = (day) => {
    setActiveDays(prev => (prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]))
  }

  const setDayPreset = (type) => {
    if (type === 'all') setActiveDays(DAYS.map(d => d.key))
    if (type === 'mon-sat') setActiveDays(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'])
    if (type === 'weekdays') setActiveDays(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'])
  }

  const applyShiftPreset = (shift) => {
    setHours({ start: shift.start, end: shift.end })
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 4000)
  }

  const currentOpt = AV_OPTIONS.find(o => o.key === availability) || AV_OPTIONS[0]
  const coverageArea = Math.round(Math.PI * radius * radius)

  return (
    <WorkerLayout
      activePath="/worker/availability"
      session={session}
      workerData={{ ...workerData, availability }}
      onNavigate={onNavigate}
      onLogout={onLogout}
      title="Availability & Schedule"
      eyebrow="WORKER CONTROL CENTER"
      subtitle="Manage your real-time duty status, working hours, and service radius"
      headerActions={
        <button
          type="button"
          className="wk-btn-primary"
          style={{ padding: '8px 16px', fontSize: '13px' }}
          onClick={() => onNavigate('/worker/dashboard')}
        >
          ← Back to Dashboard
        </button>
      }
    >
      {/* ── 1. Hero Status Banner ── */}
      <section className="wk-status-hero" aria-label="Current Live Status">
        <div className="wk-status-hero-left">
          <div
            className="wk-radar-badge"
            style={{
              borderColor: currentOpt.color,
              background: currentOpt.bg,
              color: currentOpt.color,
            }}
          >
            {availability === 'available' && (
              <span className="wk-radar-ring" style={{ borderColor: currentOpt.color }} />
            )}
            <span>{currentOpt.icon}</span>
          </div>

          <div className="wk-status-hero-text">
            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.2px', color: '#4ade80', fontWeight: 800 }}>
              Live Duty Status
            </span>
            <h2>{currentOpt.title}</h2>
            <p>{currentOpt.desc}</p>
          </div>
        </div>

        <div className="wk-status-hero-right">
          <div
            className="wk-live-pill"
            style={{
              borderColor: currentOpt.color,
              color: '#ffffff',
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: currentOpt.color,
                boxShadow: `0 0 8px ${currentOpt.color}`,
              }}
            />
            <span>{availability.toUpperCase()}</span>
          </div>

          <button
            type="button"
            className="wk-btn-outline"
            style={{
              background: 'rgba(255,255,255,0.1)',
              borderColor: 'rgba(255,255,255,0.2)',
              color: '#ffffff',
              fontSize: '12px',
              padding: '7px 16px',
            }}
            onClick={() => handleSetAvailability(availability === 'available' ? 'offline' : 'available')}
          >
            {availability === 'available' ? '🌙 Switch to Offline' : '⚡ Go Online Now'}
          </button>
        </div>
      </section>

      {/* ── 2. Live Customer Search Preview ── */}
      <div className="wk-preview-panel">
        <div className="wk-preview-left">
          <div className="wk-preview-avatar">
            {initials}
            <span
              className="wk-preview-avatar-dot"
              style={{ backgroundColor: currentOpt.color }}
              title={`Status: ${availability}`}
            />
          </div>
          <div className="wk-preview-meta">
            <strong>{workerName} ({service})</strong>
            <p>Live preview of how customers see your profile on search & maps</p>
          </div>
        </div>

        <div className="wk-preview-chips">
          <span className="wk-chip">
            <span style={{ color: currentOpt.color }}>●</span>
            <strong>{currentOpt.subtitle}</strong>
          </span>
          <span className="wk-chip">📍 {radius} km Coverage</span>
          <span className="wk-chip">⏰ {hours.start} – {hours.end}</span>
          <span className="wk-chip" style={{ color: '#15803d' }}>✓ Aadhaar Verified</span>
        </div>
      </div>

      {/* ── 3. Choose Status Grid ── */}
      <div className="worker-card-panel">
        <div className="worker-panel-head">
          <div>
            <span className="worker-panel-kicker">STATUS SELECTOR</span>
            <h3>Update Your Availability</h3>
          </div>
          <span style={{ fontSize: '13px', color: '#5f7265', fontWeight: 600 }}>
            Click any status card to update immediately
          </span>
        </div>

        <div className="wk-status-cards-grid">
          {AV_OPTIONS.map((opt) => {
            const isSelected = availability === opt.key
            return (
              <button
                key={opt.key}
                type="button"
                className={`wk-status-card ${isSelected ? 'selected' : ''}`}
                style={{
                  '--card-color': opt.color,
                  '--card-bg-light': opt.bg,
                }}
                onClick={() => handleSetAvailability(opt.key)}
              >
                <div className="wk-status-card-header">
                  <div
                    className="wk-status-card-icon"
                    style={{
                      background: opt.bg,
                      color: opt.color,
                    }}
                  >
                    {opt.icon}
                  </div>
                  <div className="wk-status-card-radio">
                    {isSelected && '✓'}
                  </div>
                </div>

                <div className="wk-status-card-body">
                  <strong>{opt.title}</strong>
                  <span>{opt.desc}</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── 4. Service Area Radius ── */}
      <div className="worker-card-panel">
        <div className="worker-panel-head">
          <div>
            <span className="worker-panel-kicker">SERVICE RADIUS</span>
            <h3>Customer Search & Dispatch Area</h3>
          </div>
          <div className="wk-radius-display">
            <strong>{radius}</strong>
            <span>km</span>
          </div>
        </div>

        <div className="wk-radius-box">
          <p style={{ margin: 0, fontSize: '13.5px', color: '#5f7265', lineHeight: 1.5 }}>
            Jobs within <strong>{radius} km</strong> of your current location will appear on your feed.
            You are covering approximately <strong>{coverageArea} sq km</strong>.
          </p>

          <div className="wk-slider-track-wrap">
            <input
              type="range"
              min={3}
              max={40}
              step={1}
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="wk-slider-custom"
              aria-label="Service area radius in kilometers"
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#899b8f', marginTop: '6px', fontWeight: 600 }}>
              <span>3 km (Neighborhood)</span>
              <span style={{ color: '#16a34a', fontWeight: 800 }}>Selected: {radius} km</span>
              <span>40 km (Full City / Metro)</span>
            </div>
          </div>

          <div className="wk-radius-preset-pills">
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#5f7265', alignSelf: 'center', marginRight: '4px' }}>
              Quick Presets:
            </span>
            {[5, 10, 15, 20, 30].map((r) => (
              <button
                key={r}
                type="button"
                className={`wk-preset-pill ${radius === r ? 'active' : ''}`}
                onClick={() => setRadius(r)}
              >
                {r} km
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── 5. Working Hours & Shift Presets ── */}
      <div className="worker-card-panel">
        <div className="worker-panel-head">
          <div>
            <span className="worker-panel-kicker">WORKING HOURS</span>
            <h3>Daily Working Window & Shifts</h3>
          </div>
          <span style={{ fontSize: '13px', color: '#5f7265', fontWeight: 600 }}>
            {hours.start} to {hours.end}
          </span>
        </div>

        <div>
          <div className="wk-shifts-wrap">
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#5f7265', alignSelf: 'center', marginRight: '4px' }}>
              Shift Presets:
            </span>
            {SHIFTS.map((s) => {
              const isActive = hours.start === s.start && hours.end === s.end
              return (
                <button
                  key={s.label}
                  type="button"
                  className={`wk-shift-chip ${isActive ? 'active' : ''}`}
                  onClick={() => applyShiftPreset(s)}
                >
                  {s.label}
                </button>
              )
            })}
          </div>

          <div className="wk-time-inputs-grid">
            <div className="wk-time-field">
              <label htmlFor="start-time">Work Start Time</label>
              <div className="wk-time-input-wrap">
                <input
                  id="start-time"
                  type="time"
                  value={hours.start}
                  onChange={(e) => setHours(prev => ({ ...prev, start: e.target.value }))}
                  className="wk-time-input"
                />
              </div>
            </div>

            <div className="wk-time-field">
              <label htmlFor="end-time">Work End Time</label>
              <div className="wk-time-input-wrap">
                <input
                  id="end-time"
                  type="time"
                  value={hours.end}
                  onChange={(e) => setHours(prev => ({ ...prev, end: e.target.value }))}
                  className="wk-time-input"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 6. Working Days Grid ── */}
      <div className="worker-card-panel">
        <div className="worker-panel-head">
          <div>
            <span className="worker-panel-kicker">AVAILABLE DAYS</span>
            <h3>Select Available Days of the Week</h3>
          </div>
          <div className="wk-days-preset-bar">
            <button
              type="button"
              className="wk-preset-pill"
              onClick={() => setDayPreset('all')}
            >
              All 7 Days
            </button>
            <button
              type="button"
              className="wk-preset-pill"
              onClick={() => setDayPreset('mon-sat')}
            >
              Monday to Saturday
            </button>
            <button
              type="button"
              className="wk-preset-pill"
              onClick={() => setDayPreset('weekdays')}
            >
              Weekdays Only
            </button>
          </div>
        </div>

        <div className="wk-days-grid">
          {DAYS.map((day) => {
            const isActive = activeDays.includes(day.key)
            return (
              <button
                key={day.key}
                type="button"
                className={`wk-day-card ${isActive ? 'active' : ''}`}
                onClick={() => toggleDay(day.key)}
              >
                <span className="wk-day-short">{day.short}</span>
                <span className="wk-day-status">
                  {isActive ? '✓ Open' : '— Off'}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── 7. Action Footer Bar ── */}
      <footer className="wk-action-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {saved && (
            <div className="wk-toast-success" role="status">
              <span>✓</span>
              <span>Availability settings saved successfully!</span>
            </div>
          )}
          {!saved && (
            <span style={{ fontSize: '13px', color: '#5f7265', fontWeight: 600 }}>
              Click "Save Settings" to publish your schedule changes
            </span>
          )}
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="wk-btn-outline"
            onClick={() => onNavigate('/worker/dashboard')}
          >
            Cancel
          </button>
          <button
            type="button"
            className="wk-btn-success"
            style={{ padding: '12px 28px', fontSize: '14px' }}
            onClick={handleSave}
          >
            {saved ? '✓ Settings Saved' : 'Save Availability Settings'}
          </button>
        </div>
      </footer>
    </WorkerLayout>
  )
}
