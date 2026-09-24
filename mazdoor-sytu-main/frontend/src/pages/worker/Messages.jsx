import { useState } from 'react'
import WorkerLayout from './WorkerLayout'

export default function WorkerMessages({ session, onNavigate, onLogout, workerData }) {
  const conversations = workerData?.messages?.conversations || []
  const thread        = workerData?.messages?.thread        || []
  const [activeConv, setActiveConv]   = useState(conversations[0]?.name || null)
  const [msg, setMsg]                 = useState('')
  const [localThread, setLocalThread] = useState(thread)

  const sendMsg = () => {
    if (!msg.trim()) return
    setLocalThread(prev => [...prev, {
      from: 'worker', text: msg,
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    }])
    setMsg('')
  }

  return (
    <WorkerLayout
      activePath="/worker/messages"
      session={session}
      workerData={workerData}
      onNavigate={onNavigate}
      onLogout={onLogout}
      title="Messages"
      eyebrow="Worker Portal"
      subtitle="Secure platform chat with customers"
    >
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '20px', height: '600px' }}>
        {/* Conversation list */}
        <div className="worker-card-panel" style={{ overflow: 'hidden', padding: '16px' }}>
          <div style={{ marginBottom: '12px' }}>
            <span className="worker-panel-kicker">CHATS</span>
            <h3 style={{ fontSize: '15px', margin: '2px 0 0' }}>Conversations</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', overflowY: 'auto', maxHeight: '480px' }}>
            {conversations.length === 0 && (
              <p style={{ color: '#6b7c6f', fontSize: '13px', textAlign: 'center', padding: '20px 0' }}>No conversations yet.</p>
            )}
            {conversations.map((conv, i) => (
              <button
                key={i}
                onClick={() => setActiveConv(conv.name)}
                style={{
                  display: 'flex', gap: '10px', alignItems: 'center',
                  padding: '12px 10px', borderRadius: '10px', border: 'none',
                  background: activeConv === conv.name ? 'rgba(22,163,74,0.1)' : '#fafbfa',
                  cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                  outline: activeConv === conv.name ? '2px solid #16a34a' : '1px solid #d4dbd6',
                  width: '100%',
                }}
              >
                <div style={{
                  width: '38px', height: '38px', borderRadius: '50%',
                  background: '#0f1c14', color: '#fff', fontSize: '12px', fontWeight: 800,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  {conv.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong style={{ fontSize: '13px' }}>{conv.name}</strong>
                    {conv.unread > 0 && (
                      <span style={{ background: '#ea580c', color: '#fff', fontSize: '10px', fontWeight: 800, padding: '2px 7px', borderRadius: '999px' }}>
                        {conv.unread}
                      </span>
                    )}
                  </div>
                  <p style={{ margin: '2px 0 0', fontSize: '11.5px', color: '#6b7c6f', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {conv.last}
                  </p>
                  <span style={{ fontSize: '10.5px', color: '#94a3b8' }}>{conv.time}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat thread */}
        <div className="worker-card-panel" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '20px' }}>
          {activeConv ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', paddingBottom: '14px', borderBottom: '1px solid #d4dbd6' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  background: '#0f1c14', color: '#fff', fontSize: '13px', fontWeight: 800,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {activeConv.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <strong style={{ fontSize: '14px' }}>{activeConv}</strong>
                  <div style={{ fontSize: '11.5px', color: '#22c55e', fontWeight: 600 }}>● Online</div>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
                  <button className="wk-btn-outline" style={{ fontSize: '12px', padding: '6px 12px' }}>📞 Call</button>
                </div>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                {localThread.map((m, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: m.from === 'worker' ? 'flex-end' : 'flex-start' }}>
                    <div style={{
                      maxWidth: '72%', padding: '10px 14px',
                      borderRadius: m.from === 'worker' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                      background: m.from === 'worker' ? '#0f1c14' : '#f4f6f4',
                      color: m.from === 'worker' ? '#fff' : '#0f1c14',
                      fontSize: '13.5px', lineHeight: 1.5,
                    }}>
                      <div>{m.text}</div>
                      <div style={{ fontSize: '10px', opacity: 0.55, marginTop: '4px', textAlign: 'right' }}>{m.time}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  value={msg}
                  onChange={e => setMsg(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMsg()}
                  placeholder={`Message ${activeConv}...`}
                  style={{ flex: 1, padding: '11px 16px', borderRadius: '12px', border: '1.5px solid #d4dbd6', fontSize: '13.5px' }}
                />
                <button className="wk-btn-success" onClick={sendMsg} style={{ padding: '11px 20px' }}>Send</button>
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#6b7c6f' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>💬</div>
              <strong>Select a conversation</strong>
              <p style={{ fontSize: '13px', margin: '6px 0 0' }}>Pick a chat from the left panel.</p>
            </div>
          )}
        </div>
      </div>
    </WorkerLayout>
  )
}
