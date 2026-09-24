import { useState } from 'react'
import WorkerLayout from './WorkerLayout'

const INITIAL_DOCS = [
  { id: 'doc-1', title: 'Aadhaar Card (Front & Back)', type: 'Government ID', status: 'Verified', date: 'Uploaded 12 Jan 2026', number: '•••• •••• 4892', icon: '🪪' },
  { id: 'doc-2', title: 'PAN Card', type: 'Tax ID', status: 'Verified', date: 'Uploaded 12 Jan 2026', number: 'ABCDE••••F', icon: '💳' },
  { id: 'doc-3', title: 'ITI Electrician Trade Certificate', type: 'Skill Certification', status: 'Verified', date: 'Uploaded 14 Jan 2026', number: 'ITI/UP/2021/771', icon: '📜' },
  { id: 'doc-4', title: 'Police Clearance Certificate (PCC)', type: 'Background Check', status: 'Verified', date: 'Valid till Jan 2027', number: 'PCC-MRT-9082', icon: '🛡️' },
  { id: 'doc-5', title: 'Bank Passbook / Cancelled Cheque', type: 'Payout Verification', status: 'Verified', date: 'Uploaded 12 Jan 2026', number: 'HDFC •••• 7591', icon: '🏦' },
]

export default function WorkerDocuments({ session, onNavigate, onLogout, workerData }) {
  const [docs, setDocs] = useState(INITIAL_DOCS)
  const [uploadDocType, setUploadDocType] = useState('Skill Certificate')
  const [docFile, setDocFile] = useState(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)

  const handleUpload = (e) => {
    e.preventDefault()
    if (!docFile) return
    const newDoc = {
      id: `doc-${Date.now()}`,
      title: uploadDocType,
      type: 'Additional Document',
      status: 'Under Review',
      date: 'Uploaded Just now',
      number: 'Pending verification',
      icon: '📁',
    }
    setDocs(prev => [newDoc, ...prev])
    setUploadSuccess(true)
    setDocFile(null)
    setTimeout(() => setUploadSuccess(false), 3500)
  }

  return (
    <WorkerLayout
      activePath="/worker/documents"
      session={session}
      workerData={workerData}
      onNavigate={onNavigate}
      onLogout={onLogout}
      title="KYC & Documents"
      eyebrow="Worker Portal"
      subtitle="Government identity, trade certificates and background verification records"
      headerActions={
        <button
          type="button"
          className="wk-btn-primary"
          style={{ padding: '8px 16px', fontSize: '13px' }}
          onClick={() => onNavigate('/worker/profile')}
        >
          ← Edit Profile
        </button>
      }
    >
      {/* Verification Status Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          background: 'linear-gradient(135deg, rgba(22,163,74,0.1), rgba(34,197,94,0.05))',
          border: '1.5px solid #16a34a',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span style={{ fontSize: '32px' }}>🛡️</span>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#14532d' }}>
                100% KYC & Background Verified Worker
              </h3>
              <span style={{ background: '#16a34a', color: '#fff', fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: '4px' }}>
                LEVEL 3
              </span>
            </div>
            <p style={{ margin: '3px 0 0', fontSize: '13px', color: '#166534' }}>
              All 5 mandatory documents have been authenticated. You receive high-priority customer booking requests.
            </p>
          </div>
        </div>
        <div style={{ fontSize: '12px', color: '#15803d', fontWeight: 700 }}>
          Renewal: January 2027
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Document List */}
        <div className="worker-card-panel">
          <div className="worker-panel-head">
            <div>
              <span className="worker-panel-kicker">VERIFIED RECORDS</span>
              <h3>Your Uploaded Documents</h3>
            </div>
            <span style={{ fontSize: '12px', color: '#6b7c6f', fontWeight: 700 }}>
              {docs.length} Documents
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {docs.map(doc => {
              const isVerified = doc.status === 'Verified'
              return (
                <div
                  key={doc.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 16px',
                    borderRadius: '10px',
                    border: '1.5px solid #d4dbd6',
                    background: '#fafbfa',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '24px' }}>{doc.icon}</span>
                    <div>
                      <strong style={{ fontSize: '13.5px', color: '#0f1c14', display: 'block' }}>
                        {doc.title}
                      </strong>
                      <span style={{ fontSize: '12px', color: '#6b7c6f' }}>
                        {doc.type} • {doc.number}
                      </span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '3px 10px',
                        borderRadius: '999px',
                        fontSize: '11px',
                        fontWeight: 800,
                        background: isVerified ? 'rgba(22,163,74,0.1)' : 'rgba(217,119,6,0.1)',
                        color: isVerified ? '#16a34a' : '#d97706',
                        border: isVerified ? '1px solid #16a34a' : '1px solid #d97706',
                      }}
                    >
                      {isVerified ? '✓ ' : '⏳ '}{doc.status}
                    </span>
                    <small style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                      {doc.date}
                    </small>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Upload New Document */}
        <div className="worker-card-panel">
          <div className="worker-panel-head">
            <div>
              <span className="worker-panel-kicker">ADDITIONAL CREDENTIALS</span>
              <h3>Upload New Certificate</h3>
            </div>
          </div>

          {uploadSuccess ? (
            <div style={{ background: 'rgba(22,163,74,0.1)', border: '1.5px solid #16a34a', borderRadius: '10px', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', marginBottom: '6px' }}>🎉</div>
              <strong style={{ color: '#15803d', fontSize: '14px' }}>Document Uploaded Successfully!</strong>
              <p style={{ margin: '4px 0 0', fontSize: '12.5px', color: '#166534' }}>
                Our verification team reviews new submissions within 24-48 business hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                  Document Category
                </label>
                <select
                  value={uploadDocType}
                  onChange={(e) => setUploadDocType(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #d4dbd6', fontSize: '13.5px', background: '#fff' }}
                >
                  <option value="Skill Certificate">Skill / Trade Certificate (ITI, Diploma)</option>
                  <option value="Driving License">Commercial Driving License</option>
                  <option value="GST Certificate">GST Registration Certificate</option>
                  <option value="Insurance Policy">Accidental / Health Insurance Policy</option>
                  <option value="Other Certification">Other Training Certificate</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                  Select File (PDF, JPG, PNG up to 10MB)
                </label>
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={(e) => setDocFile(e.target.files[0])}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px dashed #16a34a', background: 'rgba(22,163,74,0.03)', fontSize: '13px' }}
                  required
                />
              </div>

              <div style={{ background: '#f8faf9', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8e4', fontSize: '12px', color: '#6b7c6f' }}>
                🔒 <strong>Privacy Assurance:</strong> Uploaded documents are encrypted and only accessible to verified Mazdoor Sytu trust &amp; safety officers. Customers never see your personal ID numbers.
              </div>

              <button
                type="submit"
                className="wk-btn-primary"
                style={{ padding: '12px', fontSize: '13.5px' }}
              >
                📤 Submit for Verification
              </button>
            </form>
          )}
        </div>
      </div>
    </WorkerLayout>
  )
}
