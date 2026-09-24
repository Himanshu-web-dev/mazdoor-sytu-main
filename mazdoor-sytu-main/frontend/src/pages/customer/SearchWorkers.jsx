import { useState, useMemo } from 'react'
import CustomerLayout from './CustomerLayout'
import { loadCustomerStore, createBooking, setSelectedBooking } from '../../data/customerStore'
import MapEmbed from '../../components/MapEmbed'
import CalendarPicker from '../../components/CalendarPicker'
import PaymentGateway from '../../components/PaymentGateway'
import './CustomerPortal.css'

const CATEGORIES = [
  'All services',
  'Electrician',
  'Plumber',
  'Painter',
  'Carpenter',
  'Cleaner',
  'Mason',
  'Appliance Tech',
  'Mechanic'
]

export default function SearchWorkers({ session, onNavigate, onLogout }) {
  const [store, setStore] = useState(() => loadCustomerStore())
  const [selectedCategory, setSelectedCategory] = useState('All services')
  const [searchQuery, setSearchQuery] = useState('')
  const [radiusFilter, setRadiusFilter] = useState('10 km radius')
  const [availabilityFilter, setAvailabilityFilter] = useState('Available now')

  // Modals state
  const [bookingModalWorker, setBookingModalWorker] = useState(null)
  const [profileModalWorker, setProfileModalWorker] = useState(null)
  const [mapModalWorker, setMapModalWorker] = useState(null)

  // Booking Form State
  const today = new Date()
  const todayIso = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`
  const [bookDate, setBookDate] = useState(todayIso)
  const [bookTimeId, setBookTimeId] = useState('rt')
  const [bookTimeLabel, setBookTimeLabel] = useState('Now (Real-Time)')
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0)
  const [taskDescription, setTaskDescription] = useState('')
  const [bookingSuccess, setBookingSuccess] = useState(null)
  const [bookingStep, setBookingStep] = useState('details') // 'details' | 'payment'

  // Filtered workers
  const visibleWorkers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()

    return store.workers.filter((worker) => {
      const matchesCategory =
        selectedCategory === 'All services' ||
        worker.service.toLowerCase() === selectedCategory.toLowerCase()

      const matchesAvailability =
        availabilityFilter === 'All' || worker.status === availabilityFilter

      const matchesQuery =
        !q ||
        worker.name.toLowerCase().includes(q) ||
        worker.service.toLowerCase().includes(q) ||
        worker.skills?.some((s) => s.toLowerCase().includes(q)) ||
        worker.bio?.toLowerCase().includes(q)

      return matchesCategory && matchesAvailability && matchesQuery
    })
  }, [store.workers, selectedCategory, availabilityFilter, searchQuery])

  const handleOpenBookingModal = (worker) => {
    setBookingModalWorker(worker)
    setTaskDescription(`Need assistance for ${worker.service} inspection and repair.`)
    setBookDate(todayIso)
    setBookTimeId('rt')
    setBookTimeLabel('Now (Real-Time)')
    setBookingStep('details')
  }

  const handleProceedToPayment = (e) => {
    e.preventDefault()
    setBookingStep('payment')
  }

  const handlePaymentConfirm = (payMethod, payDetail) => {
    if (!bookingModalWorker) return

    const chosenAddr = store.profile?.addresses?.[selectedAddressIndex] || {
      street: 'Flat B-42, Shastri Nagar',
      area: 'Meerut',
      city: 'Meerut'
    }

    const { store: updatedStore, newBooking } = createBooking({
      worker: bookingModalWorker,
      service: `${bookingModalWorker.service} Service`,
      date: bookDate,
      time: bookTimeLabel,
      address: chosenAddr,
      note: taskDescription,
      amount: bookingModalWorker.priceNum || 350,
      paymentMethod: payMethod
    })

    setStore(updatedStore)
    setBookingModalWorker(null)
    setBookingSuccess(newBooking)
    setBookingStep('details')
  }

  const handleTrackNewBooking = () => {
    if (bookingSuccess) {
      setSelectedBooking(bookingSuccess.id)
      onNavigate('/customer/booking-details')
    }
  }

  return (
    <CustomerLayout
      activePath="/customer/search-workers"
      session={session}
      onNavigate={onNavigate}
      onLogout={onLogout}
      title="Find Skilled Workers"
      eyebrow="Customer Portal"
      subtitle="Search and book verified local tradespeople in Meerut with upfront pricing"
      headerActions={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12.5px', color: 'var(--muted, #68736d)', fontWeight: '600' }}>
            📍 Location:
          </span>
          <span style={{ background: '#ffffff', border: '1px solid var(--line, #d9d8cd)', padding: '6px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: '700' }}>
            Meerut, Uttar Pradesh
          </span>
        </div>
      }
    >
      {/* ---------------- Booking Success Banner ---------------- */}
      {bookingSuccess && (
        <div
          style={{
            background: '#ebfbee',
            border: '1px solid #b2f2bb',
            color: '#2b8a3e',
            padding: '16px 20px',
            borderRadius: '16px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap'
          }}
        >
          <div>
            <strong style={{ display: 'block', fontSize: '15px' }}>
              ✓ Booking Confirmed Successfully! (ID: {bookingSuccess.id})
            </strong>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#2f9e44' }}>
              Worker <strong>{bookingSuccess.worker}</strong> has been assigned. Your 4-digit security OTP is{' '}
              <strong style={{ fontFamily: 'monospace', letterSpacing: '0.1em' }}>{bookingSuccess.otp}</strong>.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              className="btn-primary-action"
              style={{ flex: 'none' }}
              onClick={handleTrackNewBooking}
            >
              Track Live Booking →
            </button>
            <button
              type="button"
              className="btn-secondary-action"
              onClick={() => setBookingSuccess(null)}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* ---------------- Search Bar & Filters ---------------- */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid var(--line, #d9d8cd)',
          borderRadius: '16px',
          padding: '16px 20px',
          marginBottom: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.02)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#a0aec0' }}>
              ⌕
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by worker name, skill (e.g. AC, wiring, leak) or bio..."
              style={{
                width: '100%',
                padding: '10px 14px 10px 34px',
                borderRadius: '10px',
                border: '1px solid var(--line, #d9d8cd)',
                fontSize: '13.5px'
              }}
            />
          </div>

          <select
            value={radiusFilter}
            onChange={(e) => setRadiusFilter(e.target.value)}
            style={{
              padding: '10px 14px',
              borderRadius: '10px',
              border: '1px solid var(--line, #d9d8cd)',
              fontSize: '13px',
              fontWeight: '600',
              background: '#faf8f3'
            }}
          >
            <option>5 km radius</option>
            <option>10 km radius</option>
            <option>25 km radius</option>
          </select>

          <select
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
            style={{
              padding: '10px 14px',
              borderRadius: '10px',
              border: '1px solid var(--line, #d9d8cd)',
              fontSize: '13px',
              fontWeight: '600',
              background: '#faf8f3'
            }}
          >
            <option value="Available now">Available Now</option>
            <option value="All">All Workers</option>
          </select>
        </div>

        {/* Categories Pills */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat
            return (
              <button
                key={cat}
                type="button"
                className={`tag-btn ${isActive ? 'selected' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            )
          })}
        </div>
      </div>

      {/* ---------------- Results Header ---------------- */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <span className="eyebrow" style={{ fontSize: '11px', color: 'var(--orange, #e97447)' }}>
            VERIFIED LOCAL TRADESPEOPLE
          </span>
          <h2 style={{ fontSize: '20px', margin: '2px 0 0', color: 'var(--ink, #16221d)' }}>
            Matched Workers in Meerut
          </h2>
        </div>
        <span style={{ fontSize: '13px', color: 'var(--muted, #68736d)', fontWeight: '600' }}>
          <strong>{visibleWorkers.length}</strong> available
        </span>
      </div>

      {/* ---------------- Workers Grid ---------------- */}
      {visibleWorkers.length > 0 ? (
        <div className="booking-card-grid">
          {visibleWorkers.map((worker) => (
            <article className="booking-item-card" key={worker.id}>
              {/* Header */}
              <div className="booking-card-header">
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div className="customer-avatar" style={{ width: '44px', height: '44px', fontSize: '15px' }}>
                    {worker.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                  </div>
                  <div>
                    <span className="status-pill live" style={{ fontSize: '10px', padding: '2px 8px', marginBottom: '4px' }}>
                      {worker.badge}
                    </span>
                    <h3 style={{ fontSize: '17px' }}>{worker.name}</h3>
                    <div style={{ fontSize: '12.5px', color: 'var(--muted, #68736d)', marginTop: '2px' }}>
                      <strong>{worker.service}</strong> • {worker.experience} exp
                    </div>
                  </div>
                </div>

                <span className={`status-pill ${worker.status === 'Available now' ? 'active' : 'cancelled'}`}>
                  {worker.status === 'Available now' && <span className="pulse-dot" />}
                  {worker.status}
                </span>
              </div>

              {/* Bio */}
              <p style={{ margin: 0, fontSize: '12.5px', color: '#4a5568', lineHeight: 1.45 }}>
                {worker.bio}
              </p>

              {/* Skills Tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {worker.skills?.map((skill) => (
                  <span
                    key={skill}
                    style={{
                      background: '#faf8f3',
                      border: '1px solid var(--line, #d9d8cd)',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      color: 'var(--ink, #16221d)'
                    }}
                  >
                    ✓ {skill}
                  </span>
                ))}
              </div>

              {/* Meta Grid */}
              <div className="booking-meta-table">
                <div>
                  <span>Rating & Reviews</span>
                  <strong>⭐ {worker.rating} ({worker.reviewsCount} reviews)</strong>
                </div>
                <div>
                  <span>Distance & Arrival</span>
                  <strong>📍 {worker.distance} ({worker.eta})</strong>
                </div>
                <div>
                  <span>Pricing Structure</span>
                  <strong style={{ color: 'var(--orange, #e97447)' }}>{worker.price}</strong>
                </div>
                <div>
                  <span>KYC Clearance</span>
                  <strong style={{ color: '#2a7c3d' }}>Verified Aadhaar & Police</strong>
                </div>
              </div>

              {/* Mini Map showing distance */}
              <button
                type="button"
                onClick={() => setMapModalWorker(worker)}
                style={{
                  width: '100%',
                  background: '#f0f4f8',
                  border: '1px dashed #cbd5e0',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '12.5px',
                  color: '#2d3748',
                  fontWeight: '600'
                }}
              >
                <span style={{ fontSize: '20px' }}>🗺️</span>
                <span>View on Map — {worker.name} is <strong style={{ color: 'var(--orange,#e97447)' }}>{worker.distance}</strong> from you ({worker.eta} ETA)</span>
                <span style={{ marginLeft: 'auto', color: 'var(--orange,#e97447)' }}>→</span>
              </button>

              {/* Action Buttons */}
              <div className="booking-card-actions">
                <button
                  type="button"
                  className="btn-secondary-action"
                  onClick={() => setProfileModalWorker(worker)}
                >
                  View Profile
                </button>
                <button
                  type="button"
                  className="btn-primary-action"
                  onClick={() => handleOpenBookingModal(worker)}
                >
                  Book Now ↗
                </button>
              </div>
            </article>
          ))}
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
          <div style={{ fontSize: '42px', marginBottom: '12px' }}>🔍</div>
          <h3 style={{ margin: '0 0 6px', color: 'var(--ink, #16221d)' }}>No matching workers found</h3>
          <p style={{ color: 'var(--muted, #68736d)', fontSize: '13.5px', margin: '0 0 16px' }}>
            Try clearing filters or changing the category filter to "All services".
          </p>
          <button
            type="button"
            className="btn-secondary-action"
            onClick={() => {
              setSelectedCategory('All services')
              setSearchQuery('')
              setAvailabilityFilter('All')
            }}
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* ---------------- 1. Book Worker Modal ---------------- */}
      {bookingModalWorker && (
        <div className="portal-modal-backdrop">
          <div className="portal-modal-card">
            <div className="portal-modal-header">
              <h3>Book {bookingModalWorker.service} Service</h3>
              <button
                type="button"
                className="portal-modal-close"
                onClick={() => setBookingModalWorker(null)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={bookingStep === 'details' ? handleProceedToPayment : undefined}>
              <div className="portal-modal-body">
                {/* Worker Summary Pill */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 14px',
                    background: '#faf8f3',
                    border: '1px solid var(--line, #d9d8cd)',
                    borderRadius: '12px'
                  }}
                >
                  <div className="customer-avatar" style={{ width: '38px', height: '38px' }}>
                    {bookingModalWorker.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                  </div>
                  <div style={{ flex: 1 }}>
                    <strong style={{ display: 'block', fontSize: '14px' }}>
                      {bookingModalWorker.name} ({bookingModalWorker.service})
                    </strong>
                    <small style={{ color: 'var(--muted, #68736d)' }}>
                      ⭐ {bookingModalWorker.rating} • {bookingModalWorker.distance} • {bookingModalWorker.price}
                    </small>
                  </div>
                  {/* Step indicator */}
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <span style={{ width: '20px', height: '4px', borderRadius: '2px', background: 'var(--orange,#e97447)' }} />
                    <span style={{ width: '20px', height: '4px', borderRadius: '2px', background: bookingStep === 'payment' ? 'var(--orange,#e97447)' : 'var(--line,#d9d8cd)' }} />
                  </div>
                </div>

                {bookingStep === 'details' ? (
                  <>
                    {/* Calendar Date + Time Picker */}
                    <div>
                      <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '10px' }}>
                        📅 Select Service Date & Time:
                      </label>
                      <CalendarPicker
                        selectedDate={bookDate}
                        selectedTime={bookTimeId}
                        onDateChange={setBookDate}
                        onTimeChange={(id, label) => { setBookTimeId(id); setBookTimeLabel(label) }}
                      />
                    </div>

                    {/* Address Selection */}
                    <div>
                      <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '6px' }}>
                        Service Address:
                      </label>
                      <select
                        value={selectedAddressIndex}
                        onChange={(e) => setSelectedAddressIndex(Number(e.target.value))}
                        style={{
                          width: '100%',
                          padding: '10px',
                          borderRadius: '10px',
                          border: '1px solid var(--line, #d9d8cd)',
                          fontSize: '13px'
                        }}
                      >
                        {store.profile?.addresses?.map((addr, idx) => (
                          <option key={addr.id} value={idx}>
                            {addr.label}: {addr.street}, {addr.area}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Problem Description */}
                    <div>
                      <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '6px' }}>
                        Specific Issue or Instructions for Worker:
                      </label>
                      <textarea
                        rows={3}
                        value={taskDescription}
                        onChange={(e) => setTaskDescription(e.target.value)}
                        placeholder="Describe the issue, required spare parts or entry instructions..."
                        style={{
                          width: '100%',
                          padding: '10px',
                          borderRadius: '10px',
                          border: '1px solid var(--line, #d9d8cd)',
                          fontSize: '13px',
                          resize: 'vertical'
                        }}
                      />
                    </div>

                    {/* Summary row */}
                    <div style={{ background: '#f0fff4', border: '1px solid #c6f6d5', borderRadius: '10px', padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong style={{ color: '#22543d', fontSize: '13.5px' }}>Estimated Fare</strong>
                        <small style={{ display: 'block', color: '#276749' }}>Select payment method in next step</small>
                      </div>
                      <strong style={{ fontSize: '18px', color: '#22543d' }}>{bookingModalWorker.price}</strong>
                    </div>
                  </>
                ) : (
                  /* ---- Payment Step ---- */
                  <PaymentGateway
                    amount={bookingModalWorker.priceNum || 350}
                    walletBalance={store.wallet?.balance || 2850}
                    onConfirm={handlePaymentConfirm}
                    onCancel={() => setBookingStep('details')}
                  />
                )}
              </div>

              {bookingStep === 'details' && (
                <div className="portal-modal-footer">
                  <button
                    type="button"
                    className="btn-secondary-action"
                    onClick={() => setBookingModalWorker(null)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary-action">
                    Next: Choose Payment →
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* ---------------- 2. Worker Profile Preview Modal ---------------- */}
      {profileModalWorker && (
        <div className="portal-modal-backdrop">
          <div className="portal-modal-card">
            <div className="portal-modal-header">
              <h3>Worker Profile & Credentials</h3>
              <button
                type="button"
                className="portal-modal-close"
                onClick={() => setProfileModalWorker(null)}
              >
                ✕
              </button>
            </div>

            <div className="portal-modal-body">
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                <div className="customer-avatar" style={{ width: '56px', height: '56px', fontSize: '20px' }}>
                  {profileModalWorker.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px' }}>{profileModalWorker.name}</h3>
                  <p style={{ margin: '2px 0 0', color: 'var(--muted, #68736d)', fontSize: '13px' }}>
                    {profileModalWorker.service} • {profileModalWorker.experience} experience
                  </p>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                    <span className="status-pill confirmed" style={{ fontSize: '10.5px' }}>
                      ⭐ {profileModalWorker.rating} ({profileModalWorker.reviewsCount} ratings)
                    </span>
                    <span className="status-pill active" style={{ fontSize: '10.5px' }}>
                      ✓ Background Verified
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <strong style={{ fontSize: '13px', display: 'block', marginBottom: '4px' }}>
                  Professional Bio
                </strong>
                <p style={{ margin: 0, fontSize: '13px', color: '#4a5568', lineHeight: 1.5 }}>
                  {profileModalWorker.bio}
                </p>
              </div>

              <div>
                <strong style={{ fontSize: '13px', display: 'block', marginBottom: '6px' }}>
                  Verified Skills & Equipment
                </strong>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {profileModalWorker.skills?.map((s) => (
                    <span
                      key={s}
                      style={{
                        background: '#faf8f3',
                        border: '1px solid var(--line, #d9d8cd)',
                        padding: '4px 10px',
                        borderRadius: '999px',
                        fontSize: '11.5px'
                      }}
                    >
                      ✓ {s}
                    </span>
                  ))}
                </div>
              </div>

              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  fontSize: '12.5px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>Total Jobs Completed:</span>
                  <strong>{profileModalWorker.completedJobs || 120} jobs</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>Average Response Time:</span>
                  <strong>10–15 minutes</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Safety Insurance Cover:</span>
                  <strong style={{ color: '#2a7c3d' }}>Included (up to ₹10,000)</strong>
                </div>
              </div>
            </div>

            <div className="portal-modal-footer">
              <button
                type="button"
                className="btn-secondary-action"
                onClick={() => setProfileModalWorker(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="btn-primary-action"
                onClick={() => {
                  const target = profileModalWorker
                  setProfileModalWorker(null)
                  handleOpenBookingModal(target)
                }}
              >
                Book {profileModalWorker.name} ↗
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- 3. Map Modal (Worker Location) ---------------- */}
      {mapModalWorker && (
        <div className="portal-modal-backdrop">
          <div className="portal-modal-card" style={{ maxWidth: '700px' }}>
            <div className="portal-modal-header">
              <div>
                <h3>📍 {mapModalWorker.name}'s Live Location</h3>
                <p style={{ margin: '2px 0 0', fontSize: '13px', color: 'var(--muted,#68736d)' }}>
                  {mapModalWorker.service} • {mapModalWorker.distance} from your location • ETA {mapModalWorker.eta}
                </p>
              </div>
              <button
                type="button"
                className="portal-modal-close"
                onClick={() => setMapModalWorker(null)}
              >
                ✕
              </button>
            </div>

            <div className="portal-modal-body" style={{ padding: '0' }}>
              <MapEmbed
                workerName={mapModalWorker.name}
                workerDistance={mapModalWorker.distance}
                workerEta={mapModalWorker.eta}
                workerArea="Shastri Nagar"
                customerLocation="Your Home"
                height={380}
                showRoute={true}
                compact={false}
              />
            </div>

            <div className="portal-modal-footer">
              <button
                type="button"
                className="btn-secondary-action"
                onClick={() => setMapModalWorker(null)}
              >
                Close Map
              </button>
              <button
                type="button"
                className="btn-primary-action"
                onClick={() => {
                  const target = mapModalWorker
                  setMapModalWorker(null)
                  handleOpenBookingModal(target)
                }}
              >
                Book {mapModalWorker.name} ↗
              </button>
            </div>
          </div>
        </div>
      )}
    </CustomerLayout>
  )
}
