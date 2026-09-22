import { useState, useMemo } from 'react'
import CustomerLayout from './CustomerLayout'
import { loadCustomerStore, sendChatMessage, setSelectedBooking } from '../../data/customerStore'
import './CustomerPortal.css'

const QUICK_REPLIES = [
  'Are you nearby?',
  'I am at the colony gate.',
  'Please call when you reach.',
  'Do you need any specific tools from here?',
  'Thank you, looks great!'
]

export default function Messages({ session, onNavigate, onLogout }) {
  const [store, setStore] = useState(() => loadCustomerStore())
  const [selectedConvId, setSelectedConvId] = useState(
    store.messages?.conversations?.[0]?.id || 'conv-amit'
  )
  const [searchContact, setSearchContact] = useState('')
  const [inputText, setInputText] = useState('')
  const [isReplying, setIsReplying] = useState(false)

  const activeConv = store.messages?.conversations?.find((c) => c.id === selectedConvId)
  const activeThread = store.messages?.threads?.[selectedConvId] || []

  // Filter contacts
  const filteredContacts = useMemo(() => {
    const q = searchContact.trim().toLowerCase()
    return store.messages?.conversations?.filter((c) => {
      return (
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.service.toLowerCase().includes(q) ||
        c.lastMessage?.toLowerCase().includes(q)
      )
    }) || []
  }, [store.messages?.conversations, searchContact])

  const handleSendMessage = (textToSend) => {
    const msg = (textToSend || inputText).trim()
    if (!msg || !selectedConvId) return

    const updated = sendChatMessage(selectedConvId, msg)
    setStore(updated)
    setInputText('')

    // Simulate realistic worker response after 1.2s
    setIsReplying(true)
    setTimeout(() => {
      const replies = [
        'Got it! Taking care of this right away.',
        'Understood. Reaching your location shortly.',
        'Sure, I have the required replacement parts in my bag.',
        'Thank you! Please keep the area clear.',
        'Almost there, arriving in 5 minutes.'
      ]
      const randomReply = replies[Math.floor(Math.random() * replies.length)]

      const autoUpdated = loadCustomerStore()
      const thread = autoUpdated.messages.threads[selectedConvId] || []
      thread.push({
        id: `m-auto-${Date.now()}`,
        from: activeConv?.id === 'conv-support' ? 'support' : 'worker',
        text: randomReply,
        time: 'Just now'
      })
      autoUpdated.messages.threads[selectedConvId] = thread

      const conv = autoUpdated.messages.conversations.find((c) => c.id === selectedConvId)
      if (conv) {
        conv.lastMessage = randomReply
        conv.time = 'Just now'
      }

      setStore({ ...autoUpdated })
      setIsReplying(false)
    }, 1200)
  }

  const handleOpenBooking = (bookingId) => {
    if (bookingId) {
      setSelectedBooking(bookingId)
      onNavigate('/customer/booking-details')
    }
  }

  return (
    <CustomerLayout
      activePath="/customer/messages"
      session={session}
      onNavigate={onNavigate}
      onLogout={onLogout}
      title="Direct Messages"
      eyebrow="Customer Portal"
      subtitle="Coordinate with active workers, share arrival instructions and get support"
    >
      <div className="chat-page-layout">
        {/* ---------------- 1. Contacts Sidebar ---------------- */}
        <aside className="chat-contacts-col">
          <div className="chat-contacts-header">
            <input
              type="text"
              value={searchContact}
              onChange={(e) => setSearchContact(e.target.value)}
              placeholder="Search conversations..."
            />
          </div>

          <div className="chat-contacts-list">
            {filteredContacts.map((conv) => {
              const isActive = conv.id === selectedConvId
              return (
                <button
                  key={conv.id}
                  type="button"
                  className={`chat-contact-item ${isActive ? 'active' : ''}`}
                  onClick={() => setSelectedConvId(conv.id)}
                >
                  <div className="chat-avatar">
                    {conv.avatar || conv.name.slice(0, 2).toUpperCase()}
                    {conv.status === 'Online' && <span className="chat-online-dot" />}
                  </div>

                  <div className="chat-contact-details">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong>{conv.name}</strong>
                      <time style={{ fontSize: '10px', color: 'var(--muted, #68736d)' }}>
                        {conv.time}
                      </time>
                    </div>
                    <p style={{ fontSize: '11.5px', color: 'var(--orange, #e97447)', fontWeight: '600' }}>
                      {conv.service}
                    </p>
                    <p>{conv.lastMessage}</p>
                  </div>

                  {conv.unread > 0 && (
                    <span
                      style={{
                        background: 'var(--orange, #e97447)',
                        color: '#ffffff',
                        fontSize: '10px',
                        fontWeight: '700',
                        borderRadius: '999px',
                        padding: '2px 6px',
                        flexShrink: 0
                      }}
                    >
                      {conv.unread}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </aside>

        {/* ---------------- 2. Active Chat Window ---------------- */}
        <section className="chat-active-window">
          {activeConv ? (
            <>
              {/* Window Header */}
              <div className="chat-window-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className="chat-avatar">
                    {activeConv.avatar}
                    {activeConv.status === 'Online' && <span className="chat-online-dot" />}
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '15px', color: 'var(--ink, #16221d)' }}>
                      {activeConv.name}
                    </h4>
                    <small style={{ color: '#2a7c3d', fontWeight: '600' }}>
                      ● {activeConv.service} • {activeConv.status}
                    </small>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  {activeConv.bookingId && (
                    <button
                      type="button"
                      className="btn-secondary-action"
                      style={{ fontSize: '12px', padding: '6px 12px' }}
                      onClick={() => handleOpenBooking(activeConv.bookingId)}
                    >
                      Booking #{activeConv.bookingId} ↗
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn-secondary-action"
                    style={{ fontSize: '12px', padding: '6px 10px' }}
                    onClick={() => alert(`Connecting masked call to ${activeConv.name}...`)}
                  >
                    📞 Call
                  </button>
                </div>
              </div>

              {/* Messages Stream */}
              <div className="chat-window-messages">
                <div
                  style={{
                    textAlign: 'center',
                    fontSize: '11px',
                    color: 'var(--muted, #68736d)',
                    background: '#f0eee5',
                    padding: '4px 12px',
                    borderRadius: '999px',
                    margin: '0 auto 10px',
                    width: 'fit-content'
                  }}
                >
                  🔒 Messages are encrypted & monitored for safety
                </div>

                {activeThread.map((msg) => {
                  const isOutbound = msg.from === 'customer'
                  return (
                    <div
                      key={msg.id}
                      className={`chat-bubble ${isOutbound ? 'outbound' : 'inbound'}`}
                    >
                      <p style={{ margin: 0 }}>{msg.text}</p>
                      <time>{msg.time}</time>
                    </div>
                  )
                })}

                {isReplying && (
                  <div className="chat-bubble inbound" style={{ fontStyle: 'italic', opacity: 0.8 }}>
                    <span className="pulse-dot" /> {activeConv.name} is typing...
                  </div>
                )}
              </div>

              {/* Quick Replies */}
              <div className="chat-quick-replies">
                <span style={{ fontSize: '11px', color: 'var(--muted, #68736d)', fontWeight: '700' }}>
                  Quick:
                </span>
                {QUICK_REPLIES.map((qr) => (
                  <button
                    key={qr}
                    type="button"
                    className="quick-reply-pill"
                    onClick={() => handleSendMessage(qr)}
                  >
                    {qr}
                  </button>
                ))}
              </div>

              {/* Composer */}
              <form
                className="chat-composer-row"
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSendMessage()
                }}
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Reply to ${activeConv.name}...`}
                />
                <button
                  type="submit"
                  className="btn-primary-action"
                  style={{ flex: 'none', padding: '10px 20px' }}
                >
                  Send ↗
                </button>
              </form>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px', margin: 'auto' }}>
              <h3>Select a conversation to start chatting</h3>
            </div>
          )}
        </section>
      </div>
    </CustomerLayout>
  )
}
