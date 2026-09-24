import { useState, useEffect } from 'react'
import AdminLayout from './AdminLayout'
import { getAdminStore, toggleWorkerStatus, approveWorkerKyc, rejectWorkerKyc } from '../../data/adminStore'

export default function AdminWorkers({ onNavigate, onLogout }) {
  const [workers, setWorkers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterKyc, setFilterKyc] = useState('All')
  const [selectedWorker, setSelectedWorker] = useState(null)

  useEffect(() => {
    const load = () => {
      const store = getAdminStore()
      setWorkers(store.workers)
    }
    load()
    window.addEventListener('admin_store_updated', load)
    return () => window.removeEventListener('admin_store_updated', load)
  }, [])

  const handleToggleStatus = (workerId) => {
    toggleWorkerStatus(workerId)
    if (selectedWorker && selectedWorker.id === workerId) {
      setSelectedWorker((prev) => ({
        ...prev,
        status: prev.status === 'Active' ? 'Suspended' : 'Active'
      }))
    }
  }

  const handleQuickApprove = (workerId) => {
    approveWorkerKyc(workerId)
    if (selectedWorker && selectedWorker.id === workerId) {
      setSelectedWorker((prev) => ({ ...prev, kycStatus: 'Verified', badge: 'Verified' }))
    }
  }

  const filteredWorkers = workers.filter((w) => {
    const matchesSearch =
      w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.trade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.phone.includes(searchTerm) ||
      w.city.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesKyc = filterKyc === 'All' || w.kycStatus === filterKyc || (filterKyc === 'Suspended' && w.status === 'Suspended')
    return matchesSearch && matchesKyc
  })

  return (
    <AdminLayout
      title="Worker Workforce Oversight"
      subtitle="Verify credentials, govern worker account statuses, and monitor performance across all trades"
      currentPath="/admin/workers"
      onNavigate={onNavigate}
      onLogout={onLogout}
    >
      {/* ── Controls ── */}
      <div className="admin-control-bar">
        <div className="admin-search-wrapper">
          <span className="admin-search-icon">🔍</span>
          <input
            type="text"
            className="admin-search-input"
            placeholder="Search workers by name, trade, phone, or city…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="admin-filter-group">
          {['All', 'Verified', 'Pending', 'Rejected', 'Suspended'].map((status) => (
            <button
              key={status}
              type="button"
              className={`admin-filter-pill ${filterKyc === status ? 'active' : ''}`}
              onClick={() => setFilterKyc(status)}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table Card ── */}
      <div className="admin-table-card">
        <div className="admin-table-responsive">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>Worker Name & Trade</th>
                <th>Contact</th>
                <th>Experience & Jobs</th>
                <th>Rating</th>
                <th>KYC Verification</th>
                <th>Account Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredWorkers.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '36px', color: '#94a3b8' }}>
                    No worker accounts match the chosen filters.
                  </td>
                </tr>
              ) : (
                filteredWorkers.map((worker) => (
                  <tr key={worker.id}>
                    <td>
                      <div className="admin-entity-cell">
                        <div className="admin-entity-avatar" style={{ background: 'rgba(124, 58, 237, 0.15)', color: '#c4b5fd' }}>
                          👷
                        </div>
                        <div className="admin-entity-meta">
                          <strong>{worker.name}</strong>
                          <span style={{ color: '#a78bfa', fontWeight: 600 }}>{worker.trade}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.84rem' }}>{worker.phone}</div>
                      <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>{worker.city}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: '#fff' }}>{worker.jobsCompleted} completed</div>
                      <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>{worker.experience} exp</div>
                    </td>
                    <td>
                      <span style={{ color: '#f59e0b', fontWeight: 800 }}>★ {worker.rating}</span>
                    </td>
                    <td>
                      <span className={`admin-badge ${worker.kycStatus.toLowerCase()}`}>
                        {worker.kycStatus === 'Verified' ? '✓ KYC Verified' : worker.kycStatus === 'Pending' ? '⏳ KYC In Review' : '✗ KYC Flagged'}
                      </span>
                    </td>
                    <td>
                      <span className={`admin-badge ${worker.status.toLowerCase()}`}>
                        {worker.status}
                      </span>
                    </td>
                    <td>
                      <div className="admin-action-row">
                        <button
                          type="button"
                          className="admin-btn secondary"
                          onClick={() => setSelectedWorker(worker)}
                        >
                          Audit Profile
                        </button>
                        {worker.kycStatus === 'Pending' && (
                          <button
                            type="button"
                            className="admin-btn success"
                            onClick={() => handleQuickApprove(worker.id)}
                            title="Approve Government ID"
                          >
                            Approve KYC
                          </button>
                        )}
                        <button
                          type="button"
                          className={`admin-btn ${worker.status === 'Active' ? 'danger' : 'success'}`}
                          onClick={() => handleToggleStatus(worker.id)}
                        >
                          {worker.status === 'Active' ? 'Suspend' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Worker Audit Modal ── */}
      {selectedWorker && (
        <div className="admin-modal-overlay" onClick={() => setSelectedWorker(null)}>
          <div className="admin-modal-window" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Worker Identity & Compliance Audit</h3>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setSelectedWorker(null)}
              >
                ✕
              </button>
            </div>
            <div className="admin-modal-body">
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '12px',
                    background: 'rgba(124, 58, 237, 0.2)',
                    border: '1px solid rgba(124, 58, 237, 0.4)',
                    color: '#c4b5fd',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.8rem'
                  }}
                >
                  👷
                </div>
                <div>
                  <h4 style={{ margin: '0 0 4px', fontSize: '1.2rem', color: '#fff' }}>{selectedWorker.name}</h4>
                  <span style={{ fontSize: '0.84rem', color: '#a78bfa', fontWeight: 600 }}>
                    {selectedWorker.trade} • {selectedWorker.experience} Field Experience
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 14px', borderRadius: '8px' }}>
                  <small style={{ color: '#94a3b8', display: 'block', fontSize: '0.72rem' }}>PHONE / WHATSAPP</small>
                  <strong style={{ color: '#fff' }}>{selectedWorker.phone}</strong>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 14px', borderRadius: '8px' }}>
                  <small style={{ color: '#94a3b8', display: 'block', fontSize: '0.72rem' }}>GOVERNMENT ID RECORD</small>
                  <strong style={{ color: '#fff' }}>Aadhaar: {selectedWorker.aadhaarNo}</strong>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 14px', borderRadius: '8px' }}>
                  <small style={{ color: '#94a3b8', display: 'block', fontSize: '0.72rem' }}>STANDARD HOURLY RATE</small>
                  <strong style={{ color: '#34d399' }}>{selectedWorker.hourlyRate}</strong>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 14px', borderRadius: '8px' }}>
                  <small style={{ color: '#94a3b8', display: 'block', fontSize: '0.72rem' }}>COMPLETED JOBS / ORDERS</small>
                  <strong style={{ color: '#fff' }}>{selectedWorker.jobsCompleted} Verified Services</strong>
                </div>
              </div>

              <div className="admin-doc-preview-card">
                <div className="admin-doc-icon">🪪</div>
                <div style={{ flex: 1 }}>
                  <strong style={{ display: 'block', fontSize: '0.9rem', color: '#fff' }}>
                    Government Identity Verification Status
                  </strong>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    Status: <span className={`admin-badge ${selectedWorker.kycStatus.toLowerCase()}`}>{selectedWorker.kycStatus}</span>
                  </span>
                </div>
                {selectedWorker.kycStatus === 'Pending' && (
                  <button
                    type="button"
                    className="admin-btn success"
                    onClick={() => handleQuickApprove(selectedWorker.id)}
                  >
                    Confirm & Verify
                  </button>
                )}
              </div>
            </div>
            <div className="admin-modal-footer">
              <button
                type="button"
                className="admin-btn secondary"
                onClick={() => setSelectedWorker(null)}
              >
                Done
              </button>
              <button
                type="button"
                className={`admin-btn ${selectedWorker.status === 'Active' ? 'danger' : 'success'}`}
                onClick={() => handleToggleStatus(selectedWorker.id)}
              >
                {selectedWorker.status === 'Active' ? 'Suspend Worker Account' : 'Reactivate Worker'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
