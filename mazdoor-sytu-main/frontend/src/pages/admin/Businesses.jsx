import { useState, useEffect } from 'react'
import AdminLayout from './AdminLayout'
import { getAdminStore, toggleBusinessStatus } from '../../data/adminStore'
import { getStoredJobs } from '../../data/jobStore'

export default function AdminBusinesses({ onNavigate, onLogout }) {
  const [businesses, setBusinesses] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [selectedBiz, setSelectedBiz] = useState(null)
  const [jobs, setJobs] = useState([])

  useEffect(() => {
    const load = () => {
      const store = getAdminStore()
      setBusinesses(store.businesses)
      setJobs(getStoredJobs())
    }
    load()
    window.addEventListener('admin_store_updated', load)
    return () => window.removeEventListener('admin_store_updated', load)
  }, [])

  const handleToggleStatus = (bizId) => {
    toggleBusinessStatus(bizId)
    if (selectedBiz && selectedBiz.id === bizId) {
      setSelectedBiz((prev) => ({
        ...prev,
        status: prev.status === 'Active' ? 'Suspended' : 'Active'
      }))
    }
  }

  const filteredBusinesses = businesses.filter((b) => {
    const matchesSearch =
      b.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.gstNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.city.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === 'All' || b.status === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <AdminLayout
      title="Registered Employers & Businesses"
      subtitle="Corporate governance, GST validation, job posting oversight, and workforce hiring compliance"
      currentPath="/admin/businesses"
      onNavigate={onNavigate}
      onLogout={onLogout}
    >
      {/* ── Control Bar ── */}
      <div className="admin-control-bar">
        <div className="admin-search-wrapper">
          <span className="admin-search-icon">🔍</span>
          <input
            type="text"
            className="admin-search-input"
            placeholder="Search businesses by company name, contact, GSTIN, or city…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="admin-filter-group">
          {['All', 'Active', 'Suspended'].map((status) => (
            <button
              key={status}
              type="button"
              className={`admin-filter-pill ${filterStatus === status ? 'active' : ''}`}
              onClick={() => setFilterStatus(status)}
            >
              {status} ({status === 'All' ? businesses.length : businesses.filter((b) => b.status === status).length})
            </button>
          ))}
        </div>
      </div>

      {/* ── Business Table Card ── */}
      <div className="admin-table-card">
        <div className="admin-table-responsive">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>Company Entity</th>
                <th>Contact Representative</th>
                <th>GSTIN Registration</th>
                <th>Location</th>
                <th>Live Openings</th>
                <th>Workers Staffed</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBusinesses.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '36px', color: '#94a3b8' }}>
                    No business entities match the specified search parameters.
                  </td>
                </tr>
              ) : (
                filteredBusinesses.map((biz) => (
                  <tr key={biz.id}>
                    <td>
                      <div className="admin-entity-cell">
                        <div className="admin-entity-avatar" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#67e8f9' }}>
                          🏢
                        </div>
                        <div className="admin-entity-meta">
                          <strong>{biz.companyName}</strong>
                          <span>ID: {biz.id} • Registered {biz.joinedDate}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#fff' }}>{biz.contactPerson}</div>
                      <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>{biz.phone}</div>
                    </td>
                    <td>
                      <code style={{ background: 'rgba(255,255,255,0.06)', padding: '3px 6px', borderRadius: '4px', fontSize: '0.78rem', color: '#38bdf8' }}>
                        {biz.gstNo}
                      </code>
                    </td>
                    <td>{biz.city}</td>
                    <td>
                      <span style={{ fontWeight: 800, color: '#c4b5fd' }}>{biz.activeJobs} Active</span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 800, color: '#34d399' }}>{biz.totalHired} Staffed</span>
                    </td>
                    <td>
                      <span className={`admin-badge ${biz.status.toLowerCase()}`}>
                        {biz.status}
                      </span>
                    </td>
                    <td>
                      <div className="admin-action-row">
                        <button
                          type="button"
                          className="admin-btn secondary"
                          onClick={() => setSelectedBiz(biz)}
                        >
                          Company Audit
                        </button>
                        <button
                          type="button"
                          className={`admin-btn ${biz.status === 'Active' ? 'danger' : 'success'}`}
                          onClick={() => handleToggleStatus(biz.id)}
                        >
                          {biz.status === 'Active' ? 'Suspend' : 'Activate'}
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

      {/* ── Business Audit Modal ── */}
      {selectedBiz && (
        <div className="admin-modal-overlay" onClick={() => setSelectedBiz(null)}>
          <div className="admin-modal-window" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Corporate Entity Profile — {selectedBiz.companyName}</h3>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setSelectedBiz(null)}
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
                    background: 'rgba(6, 182, 212, 0.2)',
                    border: '1px solid rgba(6, 182, 212, 0.4)',
                    color: '#67e8f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.8rem'
                  }}
                >
                  🏢
                </div>
                <div>
                  <h4 style={{ margin: '0 0 4px', fontSize: '1.2rem', color: '#fff' }}>{selectedBiz.companyName}</h4>
                  <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                    Authorized Rep: <strong style={{ color: '#fff' }}>{selectedBiz.contactPerson}</strong> • Status:{' '}
                    <span className={`admin-badge ${selectedBiz.status.toLowerCase()}`}>{selectedBiz.status}</span>
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 14px', borderRadius: '8px' }}>
                  <small style={{ color: '#94a3b8', display: 'block', fontSize: '0.72rem' }}>GSTIN VERIFICATION</small>
                  <strong style={{ color: '#38bdf8' }}>{selectedBiz.gstNo}</strong>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 14px', borderRadius: '8px' }}>
                  <small style={{ color: '#94a3b8', display: 'block', fontSize: '0.72rem' }}>OFFICIAL EMAIL</small>
                  <strong style={{ color: '#fff' }}>{selectedBiz.email}</strong>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 14px', borderRadius: '8px' }}>
                  <small style={{ color: '#94a3b8', display: 'block', fontSize: '0.72rem' }}>PRIMARY WORK REGION</small>
                  <strong style={{ color: '#fff' }}>{selectedBiz.city}</strong>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 14px', borderRadius: '8px' }}>
                  <small style={{ color: '#94a3b8', display: 'block', fontSize: '0.72rem' }}>TOTAL WORKFORCE HIRED</small>
                  <strong style={{ color: '#34d399' }}>{selectedBiz.totalHired} Workers</strong>
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '16px' }}>
                <strong style={{ display: 'block', color: '#fff', fontSize: '0.88rem', marginBottom: '8px' }}>
                  Active Job Posts on Public Portal ({selectedBiz.activeJobs})
                </strong>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#94a3b8' }}>
                  All requirements posted by {selectedBiz.companyName} are synchronized with the public Jobs board.
                  Applicants require login and completed worker profiles before submitting bids.
                </p>
              </div>

              {selectedBiz.suspensionReason && (
                <div style={{ marginTop: '16px', background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)', padding: '12px 16px', borderRadius: '8px', color: '#fda4af', fontSize: '0.84rem' }}>
                  <strong>Compliance Flag:</strong> {selectedBiz.suspensionReason}
                </div>
              )}
            </div>
            <div className="admin-modal-footer">
              <button
                type="button"
                className="admin-btn secondary"
                onClick={() => setSelectedBiz(null)}
              >
                Close Audit
              </button>
              <button
                type="button"
                className={`admin-btn ${selectedBiz.status === 'Active' ? 'danger' : 'success'}`}
                onClick={() => handleToggleStatus(selectedBiz.id)}
              >
                {selectedBiz.status === 'Active' ? 'Suspend Business' : 'Reactivate Business'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
