import { useState, useEffect } from 'react'
import AdminLayout from './AdminLayout'
import { getAdminStore, toggleUserStatus } from '../../data/adminStore'

export default function AdminUsers({ onNavigate, onLogout }) {
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [selectedUser, setSelectedUser] = useState(null)

  useEffect(() => {
    const load = () => {
      const store = getAdminStore()
      setUsers(store.users)
    }
    load()
    window.addEventListener('admin_store_updated', load)
    return () => window.removeEventListener('admin_store_updated', load)
  }, [])

  const handleToggleStatus = (userId) => {
    toggleUserStatus(userId)
    if (selectedUser && selectedUser.id === userId) {
      setSelectedUser((prev) => ({
        ...prev,
        status: prev.status === 'Active' ? 'Suspended' : 'Active'
      }))
    }
  }

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone.includes(searchTerm) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.city.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === 'All' || u.status === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <AdminLayout
      title="Customer Oversight"
      subtitle="Directory of all registered customers with spending, booking history, and security controls"
      currentPath="/admin/users"
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
            placeholder="Search customers by name, phone, email, or city…"
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
              {status} ({status === 'All' ? users.length : users.filter((u) => u.status === status).length})
            </button>
          ))}
        </div>
      </div>

      {/* ── Customer Table Card ── */}
      <div className="admin-table-card">
        <div className="admin-table-responsive">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Contact</th>
                <th>Location</th>
                <th>Bookings</th>
                <th>Total Spent</th>
                <th>Wallet Balance</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '36px', color: '#94a3b8' }}>
                    No customer accounts match your search query.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="admin-entity-cell">
                        <div className="admin-entity-avatar">
                          {user.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="admin-entity-meta">
                          <strong>{user.name}</strong>
                          <span>ID: {user.id} • Joined {user.joinedDate}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.84rem' }}>{user.phone}</div>
                      <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>{user.email}</div>
                    </td>
                    <td>{user.city}</td>
                    <td style={{ fontWeight: 700, color: '#fff' }}>{user.totalBookings} orders</td>
                    <td style={{ fontWeight: 800, color: '#34d399' }}>{user.totalSpent}</td>
                    <td style={{ fontWeight: 700, color: '#c4b5fd' }}>{user.walletBalance}</td>
                    <td>
                      <span className={`admin-badge ${user.status.toLowerCase()}`}>
                        {user.status}
                      </span>
                    </td>
                    <td>
                      <div className="admin-action-row">
                        <button
                          type="button"
                          className="admin-btn secondary"
                          onClick={() => setSelectedUser(user)}
                        >
                          View Details
                        </button>
                        <button
                          type="button"
                          className={`admin-btn ${user.status === 'Active' ? 'danger' : 'success'}`}
                          onClick={() => handleToggleStatus(user.id)}
                        >
                          {user.status === 'Active' ? 'Suspend' : 'Activate'}
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

      {/* ── Customer Detail Modal ── */}
      {selectedUser && (
        <div className="admin-modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="admin-modal-window" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Customer Account Profile — {selectedUser.name}</h3>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setSelectedUser(null)}
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
                    background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '1.4rem'
                  }}
                >
                  {selectedUser.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 style={{ margin: '0 0 4px', fontSize: '1.15rem', color: '#fff' }}>{selectedUser.name}</h4>
                  <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                    Member since {selectedUser.joinedDate} • Status:{' '}
                    <span className={`admin-badge ${selectedUser.status.toLowerCase()}`}>
                      {selectedUser.status}
                    </span>
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 14px', borderRadius: '8px' }}>
                  <small style={{ color: '#94a3b8', display: 'block', fontSize: '0.72rem' }}>PHONE NUMBER</small>
                  <strong style={{ color: '#fff' }}>{selectedUser.phone}</strong>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 14px', borderRadius: '8px' }}>
                  <small style={{ color: '#94a3b8', display: 'block', fontSize: '0.72rem' }}>EMAIL ADDRESS</small>
                  <strong style={{ color: '#fff' }}>{selectedUser.email}</strong>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 14px', borderRadius: '8px' }}>
                  <small style={{ color: '#94a3b8', display: 'block', fontSize: '0.72rem' }}>LIFETIME BOOKINGS</small>
                  <strong style={{ color: '#fff' }}>{selectedUser.totalBookings} Orders</strong>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 14px', borderRadius: '8px' }}>
                  <small style={{ color: '#94a3b8', display: 'block', fontSize: '0.72rem' }}>TOTAL SPENT</small>
                  <strong style={{ color: '#34d399' }}>{selectedUser.totalSpent}</strong>
                </div>
              </div>

              {selectedUser.suspensionReason && (
                <div style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)', padding: '12px 16px', borderRadius: '8px', color: '#fda4af', fontSize: '0.84rem' }}>
                  <strong>Suspension Reason:</strong> {selectedUser.suspensionReason}
                </div>
              )}
            </div>
            <div className="admin-modal-footer">
              <button
                type="button"
                className="admin-btn secondary"
                onClick={() => setSelectedUser(null)}
              >
                Close
              </button>
              <button
                type="button"
                className={`admin-btn ${selectedUser.status === 'Active' ? 'danger' : 'success'}`}
                onClick={() => handleToggleStatus(selectedUser.id)}
              >
                {selectedUser.status === 'Active' ? 'Suspend Account' : 'Reactivate Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
