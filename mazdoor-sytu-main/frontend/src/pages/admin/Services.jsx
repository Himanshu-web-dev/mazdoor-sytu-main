import { useState } from 'react'
import AdminLayout from './AdminLayout'

const INITIAL_SERVICES = [
  { id: 'SVC-01', title: 'Electrical Repair & Wiring', category: 'Electrician', basePrice: '₹250', commission: '10%', activeWorkers: 42, status: 'Active' },
  { id: 'SVC-02', title: 'Plumbing & Pipe Leakage Fix', category: 'Plumber', basePrice: '₹280', commission: '10%', activeWorkers: 38, status: 'Active' },
  { id: 'SVC-03', title: 'Air Conditioner Servicing & Gas', category: 'Appliance Tech', basePrice: '₹450', commission: '12%', activeWorkers: 24, status: 'Active' },
  { id: 'SVC-04', title: 'Masonry & Concrete Works', category: 'Mason', basePrice: '₹350', commission: '8%', activeWorkers: 19, status: 'Active' },
  { id: 'SVC-05', title: 'Carpentry & Furniture Assembly', category: 'Carpenter', basePrice: '₹300', commission: '10%', activeWorkers: 15, status: 'Active' },
  { id: 'SVC-06', title: 'Wall Painting & Waterproofing', category: 'Painter', basePrice: '₹260', commission: '8%', activeWorkers: 21, status: 'Active' },
  { id: 'SVC-07', title: 'Steel Welding & Gate Fabrication', category: 'Welder', basePrice: '₹320', commission: '10%', activeWorkers: 11, status: 'Active' },
]

export default function AdminServices({ onNavigate, onLogout }) {
  const [services, setServices] = useState(INITIAL_SERVICES)
  const [filterCategory, setFilterCategory] = useState('All')

  const toggleStatus = (id) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: s.status === 'Active' ? 'Paused' : 'Active' } : s))
    )
  }

  return (
    <AdminLayout
      title="Platform Trade & Service Catalog"
      subtitle="Configure standardized pricing baselines, platform commissions, and skill categories"
      currentPath="/admin/services"
      onNavigate={onNavigate}
      onLogout={onLogout}
    >
      <div className="admin-table-card">
        <div className="admin-table-responsive">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>Service Offering</th>
                <th>Category</th>
                <th>Base Fare</th>
                <th>Platform Commission</th>
                <th>Active Workforce</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((svc) => (
                <tr key={svc.id}>
                  <td>
                    <div className="admin-entity-cell">
                      <div className="admin-entity-avatar" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
                        🛠️
                      </div>
                      <div className="admin-entity-meta">
                        <strong>{svc.title}</strong>
                        <span style={{ color: '#a78bfa' }}>ID: {svc.id}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <strong style={{ color: '#fff', fontSize: '0.86rem' }}>{svc.category}</strong>
                  </td>
                  <td>
                    <span style={{ color: '#34d399', fontWeight: 800 }}>{svc.basePrice}</span>
                  </td>
                  <td>
                    <span style={{ color: '#c4b5fd', fontWeight: 700 }}>{svc.commission}</span>
                  </td>
                  <td>
                    <span style={{ color: '#fff', fontWeight: 700 }}>{svc.activeWorkers} Pros</span>
                  </td>
                  <td>
                    <span className={`admin-badge ${svc.status.toLowerCase()}`}>
                      {svc.status}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className={`admin-btn ${svc.status === 'Active' ? 'danger' : 'success'}`}
                      onClick={() => toggleStatus(svc.id)}
                    >
                      {svc.status === 'Active' ? 'Pause Service' : 'Activate Service'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}
