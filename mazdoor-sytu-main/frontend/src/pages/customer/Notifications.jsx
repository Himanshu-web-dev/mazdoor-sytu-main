import { useState, useMemo } from 'react'
import CustomerLayout from './CustomerLayout'
import { loadCustomerStore, saveCustomerStore, setSelectedBooking } from '../../data/customerStore'
import './CustomerPortal.css'

export default function Notifications({ session, onNavigate, onLogout }) {
  const [store, setStore] = useState(() => loadCustomerStore())
  const [activeCategory, setActiveCategory] = useState('All')

  const notifications = store.notifications || []

  // Filtered
  const filteredNotifications = useMemo(() => {
    if (activeCategory === 'All') return notifications
    return notifications.filter((n) => n.category === activeCategory)
  }, [notifications, activeCategory])

  const unreadCount = notifications.filter((n) => n.unread).length

  const handleMarkAllRead = () => {
    const updatedNotifications = notifications.map((n) => ({ ...n, unread: false }))
    const updatedStore = { ...store, notifications: updatedNotifications }
    saveCustomerStore(updatedStore)
    setStore(updatedStore)
  }

  const handleClearAll = () => {
    const updatedStore = { ...store, notifications: [] }
    saveCustomerStore(updatedStore)
    setStore(updatedStore)
  }

  const handleItemClick = (notification) => {
    // Mark as read
    const updatedNotifications = notifications.map((n) =>
      n.id === notification.id ? { ...n, unread: false } : n
    )
    const updatedStore = { ...store, notifications: updatedNotifications }
    saveCustomerStore(updatedStore)
    setStore(updatedStore)

    // Navigate
    if (notification.bookingId) {
      setSelectedBooking(notification.bookingId)
    }
    if (notification.targetPath) {
      onNavigate(notification.targetPath)
    }
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Bookings':
        return '⚡'
      case 'Payments':
        return '💳'
      case 'System':
        return '🛡️'
      default:
        return '🔔'
    }
  }

  return (
    <CustomerLayout
      activePath="/customer/notifications"
      session={session}
      onNavigate={onNavigate}
      onLogout={onLogout}
      title="Notifications & Alerts"
      eyebrow="Customer Portal"
      subtitle="Stay updated with live technician movements, scheduled bookings and payment receipts"
      headerActions={
        <div style={{ display: 'flex', gap: '8px' }}>
          {unreadCount > 0 && (
            <button
              type="button"
              className="btn-secondary-action"
              onClick={handleMarkAllRead}
            >
              Mark all as read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              type="button"
              className="btn-secondary-action"
              style={{ color: '#c53030' }}
              onClick={handleClearAll}
            >
              Clear all
            </button>
          )}
        </div>
      }
    >
      {/* ---------------- Filter Pills ---------------- */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {['All', 'Bookings', 'Payments', 'System'].map((cat) => (
          <button
            key={cat}
            type="button"
            className={`tag-btn ${activeCategory === cat ? 'selected' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat} {cat === 'All' && unreadCount > 0 ? `(${unreadCount} new)` : ''}
          </button>
        ))}
      </div>

      {/* ---------------- Notifications Feed ---------------- */}
      {filteredNotifications.length > 0 ? (
        <div
          style={{
            background: '#ffffff',
            border: '1px solid var(--line, #d9d8cd)',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
            maxWidth: '820px'
          }}
        >
          {filteredNotifications.map((item) => (
            <div
              key={item.id}
              onClick={() => handleItemClick(item)}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px',
                padding: '16px 20px',
                borderBottom: '1px solid #f0eee5',
                background: item.unread ? '#fffdfa' : '#ffffff',
                cursor: 'pointer',
                transition: 'background 0.15s ease'
              }}
            >
              {/* Category Icon */}
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  background: item.unread ? '#fff5ea' : '#faf8f3',
                  border: '1px solid var(--line, #d9d8cd)',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: '18px',
                  flexShrink: 0
                }}
              >
                {getCategoryIcon(item.category)}
              </div>

              {/* Text */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                  <strong style={{ fontSize: '14px', color: 'var(--ink, #16221d)' }}>
                    {item.title}
                  </strong>
                  <time style={{ fontSize: '11px', color: 'var(--muted, #68736d)', whiteSpace: 'nowrap' }}>
                    {item.time}
                  </time>
                </div>
                <p style={{ margin: '3px 0 0', fontSize: '13px', color: '#4a5568', lineHeight: 1.45 }}>
                  {item.detail}
                </p>
                <span
                  style={{
                    display: 'inline-block',
                    marginTop: '6px',
                    fontSize: '11px',
                    fontWeight: '700',
                    color: 'var(--orange, #e97447)'
                  }}
                >
                  View Details →
                </span>
              </div>

              {/* Unread Dot */}
              {item.unread && (
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'var(--orange, #e97447)',
                    marginTop: '6px',
                    flexShrink: 0
                  }}
                />
              )}
            </div>
          ))}
        </div>
      ) : (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: '#ffffff',
            border: '1px dashed var(--line, #d9d8cd)',
            borderRadius: '16px'
          }}
        >
          <div style={{ fontSize: '42px', marginBottom: '12px' }}>🔕</div>
          <h3 style={{ margin: '0 0 6px', color: 'var(--ink, #16221d)' }}>No notifications found</h3>
          <p style={{ color: 'var(--muted, #68736d)', fontSize: '13.5px', margin: 0 }}>
            You are all caught up! New updates regarding your bookings will appear here.
          </p>
        </div>
      )}
    </CustomerLayout>
  )
}
