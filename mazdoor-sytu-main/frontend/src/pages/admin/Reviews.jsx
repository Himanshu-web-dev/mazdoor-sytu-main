import { useState, useEffect } from 'react'
import AdminLayout from './AdminLayout'
import { getAdminStore, toggleReviewStatus } from '../../data/adminStore'

export default function AdminReviews({ onNavigate, onLogout }) {
  const [reviews, setReviews] = useState([])
  const [filterStatus, setFilterStatus] = useState('All')

  useEffect(() => {
    const load = () => {
      const store = getAdminStore()
      setReviews(store.reviews)
    }
    load()
    window.addEventListener('admin_store_updated', load)
    return () => window.removeEventListener('admin_store_updated', load)
  }, [])

  const handleToggle = (reviewId) => {
    toggleReviewStatus(reviewId)
  }

  const filteredReviews = reviews.filter((r) => {
    if (filterStatus === 'All') return true
    if (filterStatus === 'Flagged') return r.flagged || r.status === 'Hidden'
    return r.status === filterStatus
  })

  return (
    <AdminLayout
      title="Platform Review & Content Moderation"
      subtitle="Ensure ratings authenticity, protect workers from abusive content, and maintain platform standards"
      currentPath="/admin/reviews"
      onNavigate={onNavigate}
      onLogout={onLogout}
    >
      {/* ── Filters ── */}
      <div className="admin-control-bar">
        <div className="admin-filter-group">
          {['All', 'Approved', 'Flagged'].map((status) => (
            <button
              key={status}
              type="button"
              className={`admin-filter-pill ${filterStatus === status ? 'active' : ''}`}
              onClick={() => setFilterStatus(status)}
            >
              {status} ({status === 'All' ? reviews.length : status === 'Flagged' ? reviews.filter((r) => r.flagged || r.status === 'Hidden').length : reviews.filter((r) => r.status === status).length})
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
                <th>Reviewer</th>
                <th>Reviewed Professional</th>
                <th>Rating</th>
                <th>Feedback Content</th>
                <th>Date</th>
                <th>Moderation Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '36px', color: '#94a3b8' }}>
                    No reviews in this category.
                  </td>
                </tr>
              ) : (
                filteredReviews.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <div className="admin-entity-cell">
                        <div className="admin-entity-avatar">
                          {r.author.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="admin-entity-meta">
                          <strong>{r.author}</strong>
                          <span>{r.role}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <strong style={{ color: '#fff', fontSize: '0.86rem' }}>{r.target}</strong>
                    </td>
                    <td>
                      <span style={{ color: '#f59e0b', fontWeight: 800, fontSize: '0.95rem' }}>
                        {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                      </span>
                    </td>
                    <td style={{ maxWidth: '320px', lineHeight: '1.4', color: '#cbd5e1' }}>
                      "{r.comment}"
                    </td>
                    <td style={{ fontSize: '0.82rem', color: '#94a3b8' }}>{r.date}</td>
                    <td>
                      <span className={`admin-badge ${r.status === 'Approved' ? 'approved' : 'hidden'}`}>
                        {r.status === 'Approved' ? '✓ Public' : '🚫 Hidden (Moderated)'}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className={`admin-btn ${r.status === 'Approved' ? 'danger' : 'success'}`}
                        onClick={() => handleToggle(r.id)}
                      >
                        {r.status === 'Approved' ? 'Hide Review' : 'Approve & Publish'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}
