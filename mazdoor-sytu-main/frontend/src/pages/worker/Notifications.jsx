import { useState } from 'react'
import WorkerLayout from './WorkerLayout'

const NOTIFS = [
  { id: 1,  icon: '💼', title: 'New Job Request', text: 'Ceiling fan repair – Anita Sharma – 1.8 km', time: '2 min ago',   color: 'rgba(234,88,12,0.1)',  unread: true  },
  { id: 2,  icon: '✅', title: 'Job Accepted',    text: 'Switch wiring fix confirmed by you.',       time: '18 min ago',  color: 'rgba(22,163,74,0.1)',  unread: true  },
  { id: 3,  icon: '💰', title: 'Payment Received',text: '₹1,240 credited to your wallet.',           time: '1 hr ago',    color: 'rgba(37,99,235,0.1)',  unread: false },
  { id: 4,  icon: '⭐', title: 'New Review',      text: 'Neha Gupta gave you 5 stars.',              time: '2 hrs ago',   color: 'rgba(217,119,6,0.1)',  unread: false },
  { id: 5,  icon: '📅', title: 'Upcoming Job',    text: 'Kitchen sink repair tomorrow at 10:30 AM.', time: '3 hrs ago',   color: 'rgba(22,163,74,0.08)', unread: false },
  { id: 6,  icon: '❌', title: 'Job Cancelled',   text: 'Pipe fitting by Aman has been cancelled.',  time: 'Yesterday',   color: 'rgba(239,68,68,0.08)', unread: false },
  { id: 7,  icon: '🔔', title: 'Reminder',        text: 'Job MS-2048 is in 2 hours. Get ready!',    time: 'Yesterday',   color: 'rgba(168,85,247,0.1)', unread: false },
]

export default function WorkerNotifications({ session, onNavigate, onLogout, workerData }) {
  const [notifs, setNotifs] = useState(NOTIFS)
  const unreadCount = notifs.filter(n => n.unread).length

  const markAllRead = () => setNotifs(n => n.map(x => ({ ...x, unread: false })))
  const dismiss     = (id) => setNotifs(n => n.filter(x => x.id !== id))

  return (
    <WorkerLayout
      activePath="/worker/notifications"
      session={session}
      workerData={workerData}
      onNavigate={onNavigate}
      onLogout={onLogout}
      title="Notifications"
      eyebrow="Worker Portal"
      subtitle="Job alerts, payment updates and important reminders"
    >
      <div className="worker-card-panel">
        <div className="worker-panel-head">
          <div>
            <span className="worker-panel-kicker">ALERTS</span>
            <h3>All notifications {unreadCount > 0 && <span style={{ fontSize: '13px', color: '#ea580c', fontWeight: 700 }}>({unreadCount} unread)</span>}</h3>
          </div>
          {unreadCount > 0 && (
            <button className="worker-panel-link" onClick={markAllRead}>Mark all read</button>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {notifs.map(n => (
            <div key={n.id} className="worker-notif-item" style={{
              position: 'relative',
              borderLeft: n.unread ? '3px solid #ea580c' : '3px solid transparent',
              background: n.unread ? '#fffaf8' : '#fafbfa',
            }}>
              <div className="worker-notif-icon" style={{ background: n.color, fontSize: '18px' }}>{n.icon}</div>
              <div className="worker-notif-text" style={{ flex: 1 }}>
                <strong style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {n.title}
                  {n.unread && <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#ea580c', display: 'inline-block' }} />}
                </strong>
                <span style={{ display: 'block', fontSize: '13px', color: '#2d3a30', marginTop: '2px' }}>{n.text}</span>
                <span style={{ display: 'block', fontSize: '10.5px', color: '#94a3b8', marginTop: '4px' }}>{n.time}</span>
              </div>
              <button
                onClick={() => dismiss(n.id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '16px', padding: '4px', flexShrink: 0 }}
              >
                ✕
              </button>
            </div>
          ))}
          {notifs.length === 0 && (
            <div style={{ textAlign: 'center', padding: '32px', color: '#6b7c6f' }}>
              <div style={{ fontSize: '36px', marginBottom: '10px' }}>🔔</div>
              <strong>All caught up!</strong>
              <p style={{ fontSize: '13px', margin: '6px 0 0' }}>No new notifications right now.</p>
            </div>
          )}
        </div>
      </div>
    </WorkerLayout>
  )
}
