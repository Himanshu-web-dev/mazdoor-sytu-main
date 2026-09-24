import WorkerLayout from './WorkerLayout'

const CATEGORIES = ['Work Quality', 'Professionalism', 'Punctuality', 'Behaviour', 'Communication']

export default function Reviews({ session, onNavigate, onLogout, workerData }) {
  const reviews = workerData?.reviews || []
  const avgRating = reviews.length
    ? (reviews.reduce((a, r) => a + parseFloat(r.rating?.replace(/[★☆]/g,'')?.trim()?.length || 5), 0) / reviews.length).toFixed(1)
    : '4.8'

  const starCount = (n) => reviews.filter(r => (r.rating?.match(/★/g) || []).length >= n).length

  return (
    <WorkerLayout
      activePath="/worker/reviews"
      session={session}
      workerData={workerData}
      onNavigate={onNavigate}
      onLogout={onLogout}
      title="Reviews & Ratings"
      eyebrow="Worker Portal"
      subtitle="Customer feedback and your overall rating history"
    >
      {/* Rating Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '20px' }}>
        <div className="worker-card-panel" style={{ textAlign: 'center', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ fontSize: '56px', fontWeight: 900, color: '#0f1c14', lineHeight: 1 }}>{avgRating}</div>
          <div style={{ fontSize: '22px', color: '#d97706', margin: '6px 0' }}>★★★★★</div>
          <div style={{ fontSize: '13px', color: '#6b7c6f' }}>{reviews.length} total reviews</div>
        </div>
        <div className="worker-card-panel">
          <div>
            <span className="worker-panel-kicker">BREAKDOWN</span>
            <h3>Rating distribution</h3>
          </div>
          {[5, 4, 3, 2, 1].map(n => {
            const count = starCount(n)
            const pct = reviews.length ? Math.round((count / reviews.length) * 100) : 0
            return (
              <div key={n} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, minWidth: '24px' }}>{n}★</span>
                <div style={{ flex: 1, height: '8px', background: '#f4f6f4', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: '#d97706', borderRadius: '4px', transition: 'width 0.5s' }} />
                </div>
                <span style={{ fontSize: '11.5px', color: '#6b7c6f', minWidth: '28px' }}>{count}</span>
              </div>
            )
          })}
          <div style={{ marginTop: '8px' }}>
            {CATEGORIES.map(cat => (
              <span key={cat} style={{
                display: 'inline-block', margin: '3px 4px 3px 0',
                background: 'rgba(22,163,74,0.1)', color: '#16a34a',
                padding: '4px 10px', borderRadius: '999px', fontSize: '11.5px', fontWeight: 600
              }}>
                ✓ {cat}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Review List */}
      <div className="worker-card-panel">
        <div>
          <span className="worker-panel-kicker">ALL REVIEWS</span>
          <h3>Customer feedback</h3>
        </div>
        <div className="worker-review-list">
          {reviews.length === 0 && (
            <div style={{ textAlign: 'center', padding: '28px', color: '#6b7c6f' }}>
              <div style={{ fontSize: '36px', marginBottom: '10px' }}>⭐</div>
              <strong>No reviews yet</strong>
              <p style={{ fontSize: '13px', margin: '6px 0 0' }}>Complete jobs and deliver great service to earn reviews.</p>
            </div>
          )}
          {reviews.map((rev, i) => (
            <div key={i} className="worker-review-item">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div>
                  <strong style={{ fontSize: '14px', display: 'block' }}>{rev.customer}</strong>
                  <span style={{ fontSize: '11px', color: '#6b7c6f' }}>{rev.date}</span>
                </div>
                <span className="worker-review-stars">{rev.rating}</span>
              </div>
              <p className="worker-review-text">"{rev.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </WorkerLayout>
  )
}
