/**
 * CalendarPicker.jsx
 * Beautiful interactive calendar for booking date & time selection
 * in the Mazdoor Sytu Customer Portal.
 */

import { useState, useMemo } from 'react'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const TIME_SLOTS = [
  { id: 'rt', label: 'Now (Real-Time)', icon: '⚡', desc: 'Worker dispatched within 30 mins', highlight: true },
  { id: 'am1', label: '9:00 AM – 11:00 AM', icon: '🌅', desc: 'Morning slot', highlight: false },
  { id: 'am2', label: '11:00 AM – 1:00 PM', icon: '☀️', desc: 'Late morning', highlight: false },
  { id: 'pm1', label: '1:00 PM – 3:00 PM', icon: '🌤', desc: 'Afternoon slot', highlight: false },
  { id: 'pm2', label: '3:00 PM – 5:00 PM', icon: '🌇', desc: 'Late afternoon', highlight: false },
  { id: 'pm3', label: '5:00 PM – 7:00 PM', icon: '🌆', desc: 'Evening slot', highlight: false },
]

function getCalendarDays(year, month) {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const days = []
  for (let i = 0; i < firstDay; i++) days.push(null)
  for (let d = 1; d <= daysInMonth; d++) days.push(d)
  return days
}

/**
 * @param {object} props
 * @param {string} props.selectedDate - ISO date string (YYYY-MM-DD)
 * @param {string} props.selectedTime - Time slot ID
 * @param {function} props.onDateChange - (dateStr: string) => void
 * @param {function} props.onTimeChange - (slotId: string, slotLabel: string) => void
 */
export default function CalendarPicker({ selectedDate, selectedTime, onDateChange, onTimeChange }) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  const calDays = useMemo(() => getCalendarDays(viewYear, viewMonth), [viewYear, viewMonth])

  const handlePrevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  const handleNextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  const handleSelectDay = (day) => {
    if (!day) return
    const dateObj = new Date(viewYear, viewMonth, day)
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    if (dateObj < todayMidnight) return // Can't select past dates
    const iso = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    onDateChange(iso)
  }

  const parsedSelected = selectedDate ? new Date(selectedDate + 'T00:00:00') : null
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate())

  const formatDisplay = (iso) => {
    if (!iso) return 'No date selected'
    const d = new Date(iso + 'T00:00:00')
    return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* -------- Calendar Grid -------- */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid var(--line,#d9d8cd)',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}
      >
        {/* Month Nav Header */}
        <div
          style={{
            background: 'linear-gradient(135deg,#16221d 0%,#2a3d34 100%)',
            color: '#ffffff',
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <button
            type="button"
            onClick={handlePrevMonth}
            style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', borderRadius: '8px', width: '32px', height: '32px', cursor: 'pointer', fontSize: '16px', fontWeight: '700' }}
          >
            ‹
          </button>
          <span style={{ fontWeight: '700', fontSize: '15px' }}>
            {MONTHS[viewMonth]} {viewYear}
          </span>
          <button
            type="button"
            onClick={handleNextMonth}
            style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', borderRadius: '8px', width: '32px', height: '32px', cursor: 'pointer', fontSize: '16px', fontWeight: '700' }}
          >
            ›
          </button>
        </div>

        {/* Day Names */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            background: '#faf8f3',
            borderBottom: '1px solid var(--line,#d9d8cd)'
          }}
        >
          {DAYS.map(d => (
            <div
              key={d}
              style={{
                textAlign: 'center',
                padding: '8px 4px',
                fontSize: '11px',
                fontWeight: '700',
                color: d === 'Sun' ? '#c53030' : 'var(--muted,#68736d)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Date Cells */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '2px',
            padding: '8px'
          }}
        >
          {calDays.map((day, idx) => {
            if (!day) return <div key={`empty-${idx}`} />

            const cellDate = new Date(viewYear, viewMonth, day)
            const isPast = cellDate < todayMidnight
            const isToday = cellDate.toDateString() === today.toDateString()
            const isoStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            const isSelected = selectedDate === isoStr
            const isSunday = cellDate.getDay() === 0

            return (
              <button
                key={day}
                type="button"
                onClick={() => handleSelectDay(day)}
                disabled={isPast}
                style={{
                  border: 'none',
                  borderRadius: '10px',
                  padding: '10px 4px',
                  fontSize: '13.5px',
                  fontWeight: isToday || isSelected ? '800' : '500',
                  cursor: isPast ? 'not-allowed' : 'pointer',
                  background: isSelected
                    ? 'var(--orange,#e97447)'
                    : isToday
                    ? '#fff5f0'
                    : 'transparent',
                  color: isSelected
                    ? '#ffffff'
                    : isPast
                    ? '#c8c5bd'
                    : isToday
                    ? 'var(--orange,#e97447)'
                    : isSunday
                    ? '#c53030'
                    : 'var(--ink,#16221d)',
                  border: isToday && !isSelected ? '1.5px solid var(--orange,#e97447)' : '1.5px solid transparent',
                  transition: 'all 0.15s ease',
                  position: 'relative'
                }}
              >
                {day}
                {isToday && !isSelected && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '2px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '4px',
                      height: '4px',
                      borderRadius: '50%',
                      background: 'var(--orange,#e97447)',
                      display: 'block'
                    }}
                  />
                )}
              </button>
            )
          })}
        </div>

        {/* Selected Date Display */}
        <div
          style={{
            borderTop: '1px solid var(--line,#d9d8cd)',
            padding: '10px 16px',
            background: selectedDate ? '#fff9f5' : '#faf8f3',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <span style={{ fontSize: '12.5px', color: 'var(--muted,#68736d)', fontWeight: '600' }}>
            📅 Selected:
          </span>
          <strong style={{ fontSize: '13px', color: selectedDate ? 'var(--orange,#e97447)' : 'var(--muted,#68736d)' }}>
            {formatDisplay(selectedDate)}
          </strong>
        </div>
      </div>

      {/* -------- Time Slots Grid -------- */}
      <div>
        <p style={{ margin: '0 0 10px', fontSize: '12.5px', fontWeight: '700', color: 'var(--ink,#16221d)' }}>
          Select Time Slot:
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
            gap: '8px'
          }}
        >
          {TIME_SLOTS.map(slot => {
            const isActive = selectedTime === slot.id
            return (
              <button
                key={slot.id}
                type="button"
                onClick={() => onTimeChange(slot.id, slot.label)}
                style={{
                  border: `2px solid ${isActive ? 'var(--orange,#e97447)' : slot.highlight ? '#ffd9c8' : 'var(--line,#d9d8cd)'}`,
                  borderRadius: '12px',
                  padding: '10px 12px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  background: isActive
                    ? '#fff5f0'
                    : slot.highlight
                    ? '#fffbf8'
                    : '#ffffff',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                  <span style={{ fontSize: '14px' }}>{slot.icon}</span>
                  <strong
                    style={{
                      fontSize: '12.5px',
                      color: isActive ? 'var(--orange,#e97447)' : 'var(--ink,#16221d)',
                      display: 'block'
                    }}
                  >
                    {slot.label}
                  </strong>
                </div>
                <small style={{ color: 'var(--muted,#68736d)', fontSize: '11px' }}>{slot.desc}</small>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
