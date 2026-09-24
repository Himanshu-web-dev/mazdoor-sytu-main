import { useState } from 'react'
import CustomerLayout from './CustomerLayout'
import { loadCustomerStore, saveCustomerStore, addAddress, updateProfileDetails } from '../../data/customerStore'
import './CustomerPortal.css'

export default function Profile({ session, onNavigate, onProfileUpdate, onLogout }) {
  const [store, setStore] = useState(() => loadCustomerStore())

  // Personal details state
  const [name, setName] = useState(session?.name || store.profile?.name || 'Riya Kapoor')
  const [phone, setPhone] = useState(store.profile?.phone || '+91 8004264176')
  const [email, setEmail] = useState(store.profile?.email || 'mazdoorsetu.support@gmail.com')
  const [city, setCity] = useState(store.profile?.city || 'Meerut, Uttar Pradesh')
  const [savedSuccess, setSavedSuccess] = useState(null)

  // Address Modal
  const [addAddressModalOpen, setAddAddressModalOpen] = useState(false)
  const [addrLabel, setAddrLabel] = useState('Home')
  const [addrStreet, setAddrStreet] = useState('')
  const [addrArea, setAddrArea] = useState('')
  const [addrLandmark, setAddrLandmark] = useState('')
  const [addrPincode, setAddrPincode] = useState('250004')
  const [addrIsDefault, setAddrIsDefault] = useState(false)

  // Emergency contact state
  const [emergencyName, setEmergencyName] = useState(store.profile?.emergencyContact?.name || 'Suresh Kapoor')
  const [emergencyPhone, setEmergencyPhone] = useState(store.profile?.emergencyContact?.phone || '+91 8004264176')
  const [emergencyRelation, setEmergencyRelation] = useState(store.profile?.emergencyContact?.relation || 'Brother')
  const [shareLiveGPS, setShareLiveGPS] = useState(store.profile?.emergencyContact?.shareLiveBooking ?? true)

  // Preferences
  const [appLang, setAppLang] = useState(store.profile?.preferences?.language || 'English')
  const [prefWhatsapp, setPrefWhatsapp] = useState(store.profile?.preferences?.whatsappUpdates ?? true)
  const [prefSms, setPrefSms] = useState(store.profile?.preferences?.smsAlerts ?? true)

  const handleSaveProfile = (e) => {
    e.preventDefault()
    const updatedStore = updateProfileDetails({
      name,
      phone,
      email,
      city
    })
    setStore(updatedStore)

    if (onProfileUpdate) {
      onProfileUpdate({ name, phone, email, city })
    }

    setSavedSuccess('✓ Profile details saved successfully!')
    setTimeout(() => setSavedSuccess(null), 4000)
  }

  const handleAddAddress = (e) => {
    e.preventDefault()
    if (!addrStreet || !addrArea) return

    const updated = addAddress({
      label: addrLabel,
      street: addrStreet,
      area: addrArea,
      landmark: addrLandmark,
      city: 'Meerut',
      pincode: addrPincode,
      isDefault: addrIsDefault
    })

    setStore(updated)
    setAddAddressModalOpen(false)
    setAddrStreet('')
    setAddrArea('')
    setAddrLandmark('')
    setSavedSuccess('✓ New address added to your address book!')
    setTimeout(() => setSavedSuccess(null), 4000)
  }

  const handleDeleteAddress = (id) => {
    const nextAddresses = store.profile.addresses.filter((a) => a.id !== id)
    const updatedStore = {
      ...store,
      profile: { ...store.profile, addresses: nextAddresses }
    }
    saveCustomerStore(updatedStore)
    setStore(updatedStore)
  }

  const handleSaveEmergency = (e) => {
    e.preventDefault()
    const updatedStore = updateProfileDetails({
      emergencyContact: {
        name: emergencyName,
        phone: emergencyPhone,
        relation: emergencyRelation,
        shareLiveBooking: shareLiveGPS
      }
    })
    setStore(updatedStore)
    setSavedSuccess('✓ Emergency contact preferences updated!')
    setTimeout(() => setSavedSuccess(null), 4000)
  }

  const handleSavePreferences = () => {
    const updatedStore = updateProfileDetails({
      preferences: {
        ...store.profile.preferences,
        language: appLang,
        whatsappUpdates: prefWhatsapp,
        smsAlerts: prefSms
      }
    })
    setStore(updatedStore)
    setSavedSuccess('✓ App preferences saved!')
    setTimeout(() => setSavedSuccess(null), 4000)
  }

  return (
    <CustomerLayout
      activePath="/customer/profile"
      session={session}
      onNavigate={onNavigate}
      onLogout={onLogout}
      title="Profile & Settings"
      eyebrow="Customer Portal"
      subtitle="Manage your personal details, saved delivery addresses and doorstep safety preferences"
    >
      {savedSuccess && (
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
          {savedSuccess}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        {/* ---------------- 1. Personal Information ---------------- */}
        <section
          style={{
            background: '#ffffff',
            border: '1px solid var(--line, #d9d8cd)',
            borderRadius: '18px',
            padding: '24px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.02)'
          }}
        >
          <span className="eyebrow" style={{ fontSize: '11px', color: 'var(--orange, #e97447)' }}>
            ACCOUNT DETAILS
          </span>
          <h3 style={{ margin: '4px 0 18px', fontSize: '18px', color: 'var(--ink, #16221d)' }}>
            Personal Information
          </h3>

          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '4px' }}>
                Full Name:
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '10px',
                  border: '1px solid var(--line, #d9d8cd)',
                  fontSize: '13.5px'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '4px' }}>
                Phone Number (for OTP & Masked Calls):
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '10px',
                  border: '1px solid var(--line, #d9d8cd)',
                  fontSize: '13.5px'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '4px' }}>
                Email Address (for Invoices):
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '10px',
                  border: '1px solid var(--line, #d9d8cd)',
                  fontSize: '13.5px'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '4px' }}>
                Default Service City:
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '10px',
                  border: '1px solid var(--line, #d9d8cd)',
                  fontSize: '13.5px'
                }}
              />
            </div>

            <button type="submit" className="btn-primary-action" style={{ marginTop: '8px' }}>
              Save Profile Changes ↗
            </button>
          </form>
        </section>

        {/* ---------------- 2. Saved Addresses Manager ---------------- */}
        <section
          style={{
            background: '#ffffff',
            border: '1px solid var(--line, #d9d8cd)',
            borderRadius: '18px',
            padding: '24px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.02)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <span className="eyebrow" style={{ fontSize: '11px', color: 'var(--orange, #e97447)' }}>
                DOORSTEP LOCATIONS
              </span>
              <h3 style={{ margin: '4px 0 0', fontSize: '18px', color: 'var(--ink, #16221d)' }}>
                Saved Addresses
              </h3>
            </div>
            <button
              type="button"
              className="btn-secondary-action"
              style={{ fontSize: '12px', padding: '6px 12px' }}
              onClick={() => setAddAddressModalOpen(true)}
            >
              + Add Address
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {store.profile?.addresses?.map((addr) => (
              <div
                key={addr.id}
                style={{
                  background: '#faf8f3',
                  border: '1px solid var(--line, #d9d8cd)',
                  borderRadius: '12px',
                  padding: '12px 14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '13.5px', color: 'var(--ink, #16221d)' }}>
                      {addr.label}
                    </strong>
                    {addr.isDefault && (
                      <span className="status-pill active" style={{ fontSize: '10px', padding: '1px 6px' }}>
                        Default
                      </span>
                    )}
                  </div>
                  <p style={{ margin: 0, fontSize: '12.5px', color: '#4a5568', lineHeight: 1.4 }}>
                    {addr.street}, {addr.area}, {addr.city} - {addr.pincode}
                  </p>
                  {addr.landmark && (
                    <small style={{ color: 'var(--muted, #68736d)', fontSize: '11.5px', display: 'block', marginTop: '2px' }}>
                      Landmark: {addr.landmark}
                    </small>
                  )}
                </div>

                <button
                  type="button"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#e53e3e',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleDeleteAddress(addr.id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* ---------------- 3. Emergency & Safety Contacts ---------------- */}
        <section
          style={{
            background: '#ffffff',
            border: '1px solid var(--line, #d9d8cd)',
            borderRadius: '18px',
            padding: '24px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.02)'
          }}
        >
          <span className="eyebrow" style={{ fontSize: '11px', color: 'var(--orange, #e97447)' }}>
            SAFETY PROTOCOLS
          </span>
          <h3 style={{ margin: '4px 0 16px', fontSize: '18px', color: 'var(--ink, #16221d)' }}>
            Emergency Contact & SOS
          </h3>

          <form onSubmit={handleSaveEmergency} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '4px' }}>
                Contact Person Name:
              </label>
              <input
                type="text"
                value={emergencyName}
                onChange={(e) => setEmergencyName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '10px',
                  border: '1px solid var(--line, #d9d8cd)',
                  fontSize: '13px'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '4px' }}>
                  Relationship:
                </label>
                <input
                  type="text"
                  value={emergencyRelation}
                  onChange={(e) => setEmergencyRelation(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '10px',
                    border: '1px solid var(--line, #d9d8cd)',
                    fontSize: '13px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '4px' }}>
                  Emergency Phone:
                </label>
                <input
                  type="text"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '10px',
                    border: '1px solid var(--line, #d9d8cd)',
                    fontSize: '13px'
                  }}
                />
              </div>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', cursor: 'pointer', marginTop: '6px' }}>
              <input
                type="checkbox"
                checked={shareLiveGPS}
                onChange={(e) => setShareLiveGPS(e.target.checked)}
              />
              <span>Automatically share live worker GPS tracking with this contact</span>
            </label>

            <button type="submit" className="btn-secondary-action" style={{ marginTop: '8px' }}>
              Update Emergency Settings
            </button>
          </form>
        </section>

        {/* ---------------- 4. App Preferences ---------------- */}
        <section
          style={{
            background: '#ffffff',
            border: '1px solid var(--line, #d9d8cd)',
            borderRadius: '18px',
            padding: '24px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.02)'
          }}
        >
          <span className="eyebrow" style={{ fontSize: '11px', color: 'var(--orange, #e97447)' }}>
            APP CONFIGURATION
          </span>
          <h3 style={{ margin: '4px 0 16px', fontSize: '18px', color: 'var(--ink, #16221d)' }}>
            Language & Notification Channels
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '6px' }}>
                Preferred Portal Language:
              </label>
              <select
                value={appLang}
                onChange={(e) => setAppLang(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '10px',
                  border: '1px solid var(--line, #d9d8cd)',
                  fontSize: '13px'
                }}
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={prefWhatsapp}
                  onChange={(e) => setPrefWhatsapp(e.target.checked)}
                />
                <span>WhatsApp arrival notifications & invoice receipts</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={prefSms}
                  onChange={(e) => setPrefSms(e.target.checked)}
                />
                <span>SMS security OTP & critical booking updates</span>
              </label>
            </div>

            <button
              type="button"
              className="btn-secondary-action"
              style={{ marginTop: '8px' }}
              onClick={handleSavePreferences}
            >
              Save Preferences
            </button>
          </div>
        </section>
      </div>

      {/* ---------------- Add Address Modal ---------------- */}
      {addAddressModalOpen && (
        <div className="portal-modal-backdrop">
          <div className="portal-modal-card">
            <div className="portal-modal-header">
              <h3>Add New Service Address</h3>
              <button
                type="button"
                className="portal-modal-close"
                onClick={() => setAddAddressModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddAddress}>
              <div className="portal-modal-body">
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '6px' }}>
                    Address Label:
                  </label>
                  <select
                    value={addrLabel}
                    onChange={(e) => setAddrLabel(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '10px',
                      border: '1px solid var(--line, #d9d8cd)',
                      fontSize: '13px'
                    }}
                  >
                    <option value="Home">Home</option>
                    <option value="Office">Office</option>
                    <option value="Parents House">Parents House</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '6px' }}>
                    House / Flat / Street Name:
                  </label>
                  <input
                    type="text"
                    required
                    value={addrStreet}
                    onChange={(e) => setAddrStreet(e.target.value)}
                    placeholder="e.g. Flat C-102, Royal Palms"
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '10px',
                      border: '1px solid var(--line, #d9d8cd)',
                      fontSize: '13px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '6px' }}>
                    Area / Locality:
                  </label>
                  <input
                    type="text"
                    required
                    value={addrArea}
                    onChange={(e) => setAddrArea(e.target.value)}
                    placeholder="e.g. Shastri Nagar"
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '10px',
                      border: '1px solid var(--line, #d9d8cd)',
                      fontSize: '13px'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '6px' }}>
                      Landmark:
                    </label>
                    <input
                      type="text"
                      value={addrLandmark}
                      onChange={(e) => setAddrLandmark(e.target.value)}
                      placeholder="Near City Park"
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '10px',
                        border: '1px solid var(--line, #d9d8cd)',
                        fontSize: '13px'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '6px' }}>
                      Pincode:
                    </label>
                    <input
                      type="text"
                      value={addrPincode}
                      onChange={(e) => setAddrPincode(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '10px',
                        border: '1px solid var(--line, #d9d8cd)',
                        fontSize: '13px'
                      }}
                    />
                  </div>
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={addrIsDefault}
                    onChange={(e) => setAddrIsDefault(e.target.checked)}
                  />
                  <span>Set as default doorstep address</span>
                </label>
              </div>

              <div className="portal-modal-footer">
                <button
                  type="button"
                  className="btn-secondary-action"
                  onClick={() => setAddAddressModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary-action">
                  Save Address ↗
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </CustomerLayout>
  )
}
