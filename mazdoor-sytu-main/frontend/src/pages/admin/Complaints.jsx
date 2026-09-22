import { useState, useEffect } from 'react'
import AdminLayout from './AdminLayout'
import { getAdminStore, updateComplaintStatus } from '../../data/adminStore'

export default function AdminComplaints({ onNavigate, onLogout }) {
  const [complaints, setComplaints] = useState([])
  const [filterStatus, setFilterStatus] = useState('All')
  const [selectedComplaint, setSelectedComplaint] = useState(null)
  const [resolutionText, setResolutionText] = useState('')

  useEffect(() => {
    const load = () => {
      const store = getAdminStore()
      setComplaints(store.complaints)
    }
    load()
    window.addEventListener('admin_store_updated', load)
    return () => window.removeEventListener('admin_store_updated', load)
  }, [])

  const handleStatusChange = (id, newStatus) => {
    updateComplaintStatus(id, newStatus, resolutionText.trim())
    if (selectedComplaint && selectedComplaint.id === id) {
      setSelectedComplaint((prev) => ({
        ...prev,
        status: newStatus,
        resolutionNote: resolutionText.trim() || prev.resolutionNote
      }))
    }
    setResolutionText('')
  }

  const filtered = complaints.filter((c) => {
    if (filterStatus === 'All') return true
    return c.status === filterStatus
  })

  return (
    <AdminLayout
      title="Disputes & Grievance Resolution"
      subtitle="Mediate conflicts between customers, workers, and businesses with transparent audit notes"
      currentPath="/admin/complaints"
      onNavigate={onNavigate}
      onLogout={onLogout}
    >
      {/* ── Filters ── */}
      <div className="admin-control-bar">
        <div className="admin-filter-group">
          {['All', 'Open', 'Under Review', 'Resolved'].map((st) => (
            <button
              key={st}
              type="button"
              className={`admin-filter-pill ${filterStatus === st ? 'active' : ''}`}
              onClick={() => setFilterStatus(st)}
            >
              {st} ({st === 'All' ? complaints.length : complaints.filter((c) => c.status === st).length})
            </button>
          ))}
        </div>
      </div>

      {/* ── Complaints Table ── */}
      <div className="admin-table-card">
        <div className="admin-table-responsive">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>Dispute ID & Subject</th>
                <th>Parties Involved</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Filing Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '36px', color: '#94a3b8' }}>
                    No disputes match the selected status filter.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div className="admin-entity-cell">
                        <div className="admin-entity-avatar" style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#fda4af' }}>
                          ⚖️
                        </div>
                        <div className="admin-entity-meta">
                          <strong>{c.subject}</strong>
                          <span style={{ color: '#a78bfa' }}>ID: {c.id}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.84rem' }}>{c.raisedBy}</div>
                      <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Against: {c.against}</div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>{c.category}</span>
                    </td>
                    <td>
                      <span className={`admin-badge ${c.priority === 'High' ? 'high' : 'pending'}`}>
                        {c.priority} Priority
                      </span>
                    </td>
                    <td style={{ fontSize: '0.84rem', color: '#94a3b8' }}>{c.date}</td>
                    <td>
                      <span className={`admin-badge ${c.status.toLowerCase().replace(' ', '_')}`}>
                        {c.status}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="admin-btn primary"
                        onClick={() => {
                          setSelectedComplaint(c)
                          setResolutionText(c.resolutionNote || '')
                        }}
                      >
                        Mediate Dispute
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Mediation Modal ── */}
      {selectedComplaint && (
        <div className="admin-modal-overlay" onClick={() => setSelectedComplaint(null)}>
          <div className="admin-modal-window" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Mediation Case File — #{selectedComplaint.id}</h3>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setSelectedComplaint(null)}
              >
                ✕
              </button>
            </div>
            <div className="admin-modal-body">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h4 style={{ margin: 0, fontSize: '1.15rem', color: '#fff' }}>{selectedComplaint.subject}</h4>
                <span className={`admin-badge ${selectedComplaint.status.toLowerCase().replace(' ', '_')}`}>
                  {selectedComplaint.status}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '18px' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 14px', borderRadius: '8px' }}>
                  <small style={{ color: '#94a3b8', display: 'block', fontSize: '0.72rem' }}>COMPLAINANT</small>
                  <strong style={{ color: '#fff' }}>{selectedComplaint.raisedBy}</strong>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 14px', borderRadius: '8px' }}>
                  <small style={{ color: '#94a3b8', display: 'block', fontSize: '0.72rem' }}>AGAINST</small>
                  <strong style={{ color: '#fff' }}>{selectedComplaint.against}</strong>
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '16px', marginBottom: '18px' }}>
                <strong style={{ display: 'block', color: '#fff', fontSize: '0.84rem', marginBottom: '6px' }}>
                  DISPUTE STATEMENT
                </strong>
                <p style={{ margin: 0, fontSize: '0.84rem', color: '#cbd5e1', lineHeight: '1.5' }}>
                  {selectedComplaint.description}
                </p>
              </div>

              {/* Admin Resolution Input */}
              <div style={{ background: 'rgba(124, 58, 237, 0.08)', border: '1px solid rgba(124, 58, 237, 0.25)', borderRadius: '10px', padding: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#c4b5fd', marginBottom: '6px' }}>
                  Administrator Resolution Finding & Mediation Notes:
                </label>
                <textarea
                  rows={3}
                  style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(124, 58, 237, 0.3)', borderRadius: '8px', color: '#fff', padding: '10px', fontSize: '0.84rem', fontFamily: 'inherit' }}
                  placeholder="Record formal mediation outcome, payout adjustments, or user warnings..."
                  value={resolutionText}
                  onChange={(e) => setResolutionText(e.target.value)}
                />
              </div>
            </div>
            <div className="admin-modal-footer">
              <button
                type="button"
                className="admin-btn secondary"
                onClick={() => setSelectedComplaint(null)}
              >
                Close
              </button>
              {selectedComplaint.status !== 'Under Review' && selectedComplaint.status !== 'Resolved' && (
                <button
                  type="button"
                  className="admin-btn secondary"
                  style={{ color: '#fcd34d', borderColor: 'rgba(245, 158, 11, 0.4)' }}
                  onClick={() => handleStatusChange(selectedComplaint.id, 'Under Review')}
                >
                  Mark Under Review
                </button>
              )}
              {selectedComplaint.status !== 'Resolved' && (
                <button
                  type="button"
                  className="admin-btn success"
                  onClick={() => handleStatusChange(selectedComplaint.id, 'Resolved')}
                >
                  Resolve Dispute & Save Notes
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
