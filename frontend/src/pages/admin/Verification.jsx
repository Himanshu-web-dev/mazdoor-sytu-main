import { useState, useEffect } from 'react'
import AdminLayout from './AdminLayout'
import { getAdminStore, approveWorkerKyc, rejectWorkerKyc } from '../../data/adminStore'

export default function AdminVerification({ onNavigate, onLogout }) {
  const [kycQueue, setKycQueue] = useState([])
  const [filterStatus, setFilterStatus] = useState('Pending')
  const [selectedKyc, setSelectedKyc] = useState(null)
  const [rejectReason, setRejectReason] = useState('')
  const [showRejectForm, setShowRejectForm] = useState(false)

  useEffect(() => {
    const load = () => {
      const store = getAdminStore()
      setKycQueue(store.kycQueue)
    }
    load()
    window.addEventListener('admin_store_updated', load)
    return () => window.removeEventListener('admin_store_updated', load)
  }, [])

  const handleApprove = (workerId) => {
    approveWorkerKyc(workerId)
    setSelectedKyc(null)
    setShowRejectForm(false)
  }

  const handleReject = (workerId) => {
    if (!rejectReason.trim()) {
      alert('Please specify an official reason for document rejection.')
      return
    }
    rejectWorkerKyc(workerId, rejectReason.trim())
    setSelectedKyc(null)
    setShowRejectForm(false)
    setRejectReason('')
  }

  const filteredQueue = kycQueue.filter((item) => {
    if (filterStatus === 'All') return true
    return item.status === filterStatus
  })

  return (
    <AdminLayout
      title="Worker KYC & Identity Verification Queue"
      subtitle="Government Aadhaar validation, skill certification inspection, and worker trust credentialing"
      currentPath="/admin/verification"
      onNavigate={onNavigate}
      onLogout={onLogout}
    >
      {/* ── Filter Bar ── */}
      <div className="admin-control-bar">
        <div className="admin-filter-group">
          {['Pending', 'Approved', 'Rejected', 'All'].map((status) => (
            <button
              key={status}
              type="button"
              className={`admin-filter-pill ${filterStatus === status ? 'active' : ''}`}
              onClick={() => setFilterStatus(status)}
            >
              {status} ({status === 'All' ? kycQueue.length : kycQueue.filter((k) => k.status === status).length})
            </button>
          ))}
        </div>
      </div>

      {/* ── Queue Table ── */}
      <div className="admin-table-card">
        <div className="admin-table-responsive">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>Applicant Worker</th>
                <th>Trade & Contact</th>
                <th>Government Document</th>
                <th>Submitted On</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredQueue.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '36px', color: '#94a3b8' }}>
                    No verification applications in this queue.
                  </td>
                </tr>
              ) : (
                filteredQueue.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="admin-entity-cell">
                        <div className="admin-entity-avatar" style={{ background: 'rgba(124, 58, 237, 0.15)', color: '#c4b5fd' }}>
                          🪪
                        </div>
                        <div className="admin-entity-meta">
                          <strong>{item.name}</strong>
                          <span style={{ color: '#a78bfa' }}>Worker ID: {item.workerId}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#fff' }}>{item.trade}</div>
                      <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>{item.phone}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#38bdf8' }}>{item.docType}</div>
                      <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Aadhaar: {item.aadhaarNo}</div>
                    </td>
                    <td style={{ fontSize: '0.84rem', color: '#cbd5e1' }}>
                      {item.submittedDate}
                    </td>
                    <td>
                      <span className={`admin-badge ${item.status.toLowerCase()}`}>
                        {item.status === 'Pending' ? '⏳ Needs Verification' : item.status}
                      </span>
                    </td>
                    <td>
                      <div className="admin-action-row">
                        <button
                          type="button"
                          className="admin-btn primary"
                          onClick={() => {
                            setSelectedKyc(item)
                            setShowRejectForm(false)
                            setRejectReason('')
                          }}
                        >
                          Inspect Documents
                        </button>
                        {item.status === 'Pending' && (
                          <button
                            type="button"
                            className="admin-btn success"
                            onClick={() => handleApprove(item.workerId)}
                          >
                            Approve
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Document Inspection Modal ── */}
      {selectedKyc && (
        <div className="admin-modal-overlay" onClick={() => setSelectedKyc(null)}>
          <div className="admin-modal-window" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>KYC Document Review — {selectedKyc.name}</h3>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setSelectedKyc(null)}
              >
                ✕
              </button>
            </div>
            <div className="admin-modal-body">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.15rem', color: '#fff' }}>{selectedKyc.name}</h4>
                  <span style={{ fontSize: '0.82rem', color: '#a78bfa', fontWeight: 600 }}>
                    {selectedKyc.trade} • Worker #{selectedKyc.workerId}
                  </span>
                </div>
                <span className={`admin-badge ${selectedKyc.status.toLowerCase()}`}>
                  {selectedKyc.status}
                </span>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '16px', marginBottom: '18px' }}>
                <strong style={{ display: 'block', color: '#fff', fontSize: '0.84rem', marginBottom: '4px' }}>
                  Aadhaar Government Number
                </strong>
                <code style={{ fontSize: '1.1rem', color: '#38bdf8', letterSpacing: '0.08em' }}>
                  {selectedKyc.aadhaarNo}
                </code>
                <p style={{ margin: '8px 0 0', fontSize: '0.82rem', color: '#94a3b8' }}>
                  Note: {selectedKyc.notes}
                </p>
              </div>

              <h5 style={{ margin: '0 0 10px', fontSize: '0.88rem', color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Verified Document Attachments
              </h5>

              <div className="admin-doc-preview-card">
                <div className="admin-doc-icon">🪪</div>
                <div style={{ flex: 1 }}>
                  <strong style={{ display: 'block', fontSize: '0.88rem', color: '#fff' }}>
                    Aadhaar Card (Front + Back)
                  </strong>
                  <span style={{ fontSize: '0.78rem', color: '#34d399' }}>
                    {selectedKyc.docFront} • {selectedKyc.docBack}
                  </span>
                </div>
                <span style={{ fontSize: '0.78rem', color: '#a78bfa', background: 'rgba(124,58,237,0.15)', padding: '4px 8px', borderRadius: '6px' }}>
                  High Resolution
                </span>
              </div>

              <div className="admin-doc-preview-card">
                <div className="admin-doc-icon">📜</div>
                <div style={{ flex: 1 }}>
                  <strong style={{ display: 'block', fontSize: '0.88rem', color: '#fff' }}>
                    Skill / Trade Certification
                  </strong>
                  <span style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
                    {selectedKyc.tradeCert}
                  </span>
                </div>
                <span style={{ fontSize: '0.78rem', color: '#34d399', background: 'rgba(16,185,129,0.15)', padding: '4px 8px', borderRadius: '6px' }}>
                  Accredited
                </span>
              </div>

              {/* Rejection form input */}
              {showRejectForm && (
                <div style={{ marginTop: '18px', background: 'rgba(244, 63, 94, 0.08)', border: '1px solid rgba(244, 63, 94, 0.3)', borderRadius: '10px', padding: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#fda4af', marginBottom: '6px' }}>
                    Reason for Rejecting KYC Submission:
                  </label>
                  <textarea
                    rows={2}
                    style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(244, 63, 94, 0.4)', borderRadius: '8px', color: '#fff', padding: '8px 10px', fontSize: '0.84rem', fontFamily: 'inherit' }}
                    placeholder="e.g. Unclear document photograph, name on Aadhaar does not match registered profile..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                    <button
                      type="button"
                      className="admin-btn secondary"
                      onClick={() => setShowRejectForm(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="admin-btn danger"
                      onClick={() => handleReject(selectedKyc.workerId)}
                    >
                      Confirm Rejection
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="admin-modal-footer">
              <button
                type="button"
                className="admin-btn secondary"
                onClick={() => setSelectedKyc(null)}
              >
                Close
              </button>
              {selectedKyc.status === 'Pending' && !showRejectForm && (
                <>
                  <button
                    type="button"
                    className="admin-btn danger"
                    onClick={() => setShowRejectForm(true)}
                  >
                    Reject Submission
                  </button>
                  <button
                    type="button"
                    className="admin-btn success"
                    onClick={() => handleApprove(selectedKyc.workerId)}
                  >
                    Verify & Grant Badge
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
