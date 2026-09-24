import { useState } from 'react'
import CustomerLayout from './CustomerLayout'
import { loadCustomerStore, submitReview } from '../../data/customerStore'
import './CustomerPortal.css'

const PRAISE_TAGS = [
  'Punctual & On-Time',
  'Expert Craftsmanship',
  'Cleaned Up Afterward',
  'Polite & Respectful',
  'Transparent Pricing',
  'Safety Conscious'
]

export default function Reviews({ session, onNavigate, onLogout }) {
  const [store, setStore] = useState(() => loadCustomerStore())
  const [activeTab, setActiveTab] = useState('pending') // 'pending' or 'submitted'

  // Rating form state for first pending job
  const pendingJobs = store.bookings.filter((b) => b.status === 'Completed' && !b.rated)
  const submittedReviews = store.reviews || []

  const [selectedJobId, setSelectedJobId] = useState(pendingJobs[0]?.id || '')
  const [ratingStars, setRatingStars] = useState(5)
  const [hoverStars, setHoverStars] = useState(0)
  const [selectedTags, setSelectedTags] = useState(['Punctual & On-Time', 'Expert Craftsmanship'])
  const [commentText, setCommentText] = useState('')
  const [submittedAlert, setSubmittedAlert] = useState(null)

  const activeJobToRate = pendingJobs.find((b) => b.id === selectedJobId) || pendingJobs[0]

  const handleToggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!activeJobToRate) return

    const updated = submitReview({
      workerId: activeJobToRate.workerPhone || 'WKR-GEN',
      workerName: activeJobToRate.worker,
      service: activeJobToRate.service,
      bookingId: activeJobToRate.id,
      rating: ratingStars,
      comment: commentText || 'Prompt, professional and solved the issue quickly.',
      tags: selectedTags
    })

    setStore(updated)
    setCommentText('')
    setSubmittedAlert(`✓ Your 5-star review for ${activeJobToRate.worker} has been submitted!`)
    setActiveTab('submitted')
    setTimeout(() => setSubmittedAlert(null), 5000)
  }

  return (
    <CustomerLayout
      activePath="/customer/reviews"
      session={session}
      onNavigate={onNavigate}
      onLogout={onLogout}
      title="Ratings & Reviews"
      eyebrow="Customer Portal"
      subtitle="Rate your completed services and manage verified worker feedback"
    >
      {submittedAlert && (
        <div
          style={{
            background: '#f0fff4',
            border: '1px solid #9ae6b4',
            color: '#22543d',
            padding: '12px 18px',
            borderRadius: '12px',
            marginBottom: '20px',
            fontSize: '13.5px',
            fontWeight: '600'
          }}
        >
          {submittedAlert}
        </div>
      )}

      {/* ---------------- 1. Tabs Bar ---------------- */}
      <div className="booking-tabs-bar" style={{ marginBottom: '24px' }}>
        <button
          type="button"
          className={`tab-pill ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          <span>Pending Reviews</span>
          <span className="tab-count">{pendingJobs.length}</span>
        </button>

        <button
          type="button"
          className={`tab-pill ${activeTab === 'submitted' ? 'active' : ''}`}
          onClick={() => setActiveTab('submitted')}
        >
          <span>Submitted Reviews</span>
          <span className="tab-count">{submittedReviews.length}</span>
        </button>
      </div>

      {/* ---------------- 2. Pending Reviews Tab ---------------- */}
      {activeTab === 'pending' && (
        <div>
          {pendingJobs.length > 0 && activeJobToRate ? (
            <div
              style={{
                background: '#ffffff',
                border: '1px solid var(--line, #d9d8cd)',
                borderRadius: '18px',
                padding: '24px 28px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                maxWidth: '680px'
              }}
            >
              <span className="eyebrow" style={{ fontSize: '11px', color: 'var(--orange, #e97447)' }}>
                RATE COMPLETED SERVICE
              </span>
              <h3 style={{ margin: '4px 0 16px', fontSize: '20px', color: 'var(--ink, #16221d)' }}>
                How was your experience with {activeJobToRate.worker}?
              </h3>

              {/* Booking Selector if multiple */}
              {pendingJobs.length > 1 && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '6px' }}>
                    Select Service to Rate:
                  </label>
                  <select
                    value={selectedJobId}
                    onChange={(e) => setSelectedJobId(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '10px',
                      border: '1px solid var(--line, #d9d8cd)',
                      fontSize: '13px'
                    }}
                  >
                    {pendingJobs.map((job) => (
                      <option key={job.id} value={job.id}>
                        {job.service} with {job.worker} ({job.date})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Worker Card Snippet */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  background: '#faf8f3',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1px solid var(--line, #d9d8cd)',
                  marginBottom: '20px'
                }}
              >
                <div className="customer-avatar" style={{ width: '42px', height: '42px' }}>
                  {activeJobToRate.worker.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                </div>
                <div>
                  <strong style={{ fontSize: '14px', color: 'var(--ink, #16221d)' }}>
                    {activeJobToRate.worker}
                  </strong>
                  <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--muted, #68736d)' }}>
                    {activeJobToRate.service} • Completed on {activeJobToRate.date}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {/* 5-Star Interactive Rating */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>
                    Overall Rating (Tap to select):
                  </label>
                  <div className="star-rating-picker">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={star <= (hoverStars || ratingStars) ? 'filled' : ''}
                        onMouseEnter={() => setHoverStars(star)}
                        onMouseLeave={() => setHoverStars(0)}
                        onClick={() => setRatingStars(star)}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>

                {/* Praise Tags */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '8px' }}>
                    What did you like about the worker?
                  </label>
                  <div className="tag-selector-grid">
                    {PRAISE_TAGS.map((tag) => {
                      const isSelected = selectedTags.includes(tag)
                      return (
                        <button
                          key={tag}
                          type="button"
                          className={`tag-btn ${isSelected ? 'selected' : ''}`}
                          onClick={() => handleToggleTag(tag)}
                        >
                          {isSelected ? '✓ ' : '+ '} {tag}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Comment Textarea */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>
                    Detailed Feedback:
                  </label>
                  <textarea
                    rows={4}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Describe worker punctuality, skill quality, cleanliness and fair behavior..."
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '12px',
                      border: '1px solid var(--line, #d9d8cd)',
                      fontSize: '13.5px',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary-action"
                  style={{ padding: '12px', fontSize: '14px' }}
                >
                  Submit Verified Review ↗
                </button>
              </form>
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
              <div style={{ fontSize: '42px', marginBottom: '12px' }}>✨</div>
              <h3 style={{ margin: '0 0 6px', color: 'var(--ink, #16221d)' }}>All completed jobs are rated!</h3>
              <p style={{ color: 'var(--muted, #68736d)', fontSize: '13.5px', margin: '0 0 16px' }}>
                You have no pending ratings. Thank you for keeping the worker community honest & verified.
              </p>
              <button
                type="button"
                className="btn-secondary-action"
                onClick={() => setActiveTab('submitted')}
              >
                View Submitted Reviews ({submittedReviews.length})
              </button>
            </div>
          )}
        </div>
      )}

      {/* ---------------- 3. Submitted Reviews Tab ---------------- */}
      {activeTab === 'submitted' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '780px' }}>
          {submittedReviews.map((rev) => (
            <article
              key={rev.id}
              style={{
                background: '#ffffff',
                border: '1px solid var(--line, #d9d8cd)',
                borderRadius: '16px',
                padding: '20px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div>
                  <strong style={{ fontSize: '15px', color: 'var(--ink, #16221d)', display: 'block' }}>
                    {rev.workerName} ({rev.service})
                  </strong>
                  <span style={{ fontSize: '12px', color: 'var(--muted, #68736d)' }}>
                    Reviewed on {rev.date} • Booking #{rev.bookingId || 'COMPLETED'}
                  </span>
                </div>

                <div style={{ color: '#ecc94b', fontSize: '18px' }}>
                  {'★'.repeat(rev.rating)}
                  {'☆'.repeat(5 - rev.rating)}
                </div>
              </div>

              <p style={{ margin: '0 0 12px', fontSize: '13.5px', color: '#4a5568', lineHeight: 1.5 }}>
                "{rev.comment}"
              </p>

              {/* Tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                {rev.tags?.map((t) => (
                  <span
                    key={t}
                    style={{
                      background: '#faf8f3',
                      border: '1px solid var(--line, #d9d8cd)',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      color: 'var(--ink, #16221d)'
                    }}
                  >
                    ✓ {t}
                  </span>
                ))}
              </div>

              {/* Worker Reply */}
              {rev.workerResponse && (
                <div
                  style={{
                    background: '#f8fafc',
                    borderLeft: '3px solid var(--orange, #e97447)',
                    padding: '10px 14px',
                    borderRadius: '0 8px 8px 0',
                    fontSize: '12.5px'
                  }}
                >
                  <strong style={{ color: 'var(--ink, #16221d)', display: 'block' }}>
                    Response from {rev.workerName}:
                  </strong>
                  <span style={{ color: 'var(--muted, #68736d)' }}>
                    "{rev.workerResponse}"
                  </span>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </CustomerLayout>
  )
}
