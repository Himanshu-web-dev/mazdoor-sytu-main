import { useState } from 'react'
import './Services.css'

const SERVICES_CATALOG = [
  {
    id: 'svc-elec',
    category: 'Electrical',
    icon: '⚡',
    title: 'Electrical Repair & Installation',
    desc: 'Complete household & commercial electrical troubleshooting, wiring overhaul, switchboard repair, and appliance setup.',
    startingPrice: '₹250',
    eta: '10–15 Min Arrival',
    features: [
      'Switch, Socket & MCB Distribution Repairs',
      'Ceiling Fan & Chandelier Fitting',
      'Short Circuit & Concealed Wire Tracing',
      'Inverter & Home UPS Installation',
    ],
  },
  {
    id: 'svc-plumb',
    category: 'Plumbing',
    icon: '🔧',
    title: 'Plumbing Solutions & Pipe Leakage',
    desc: 'Expert plumbers for fast active leak fixes, bathroom sanitary fittings, drain unclogging, and overhead tank pipelines.',
    startingPrice: '₹280',
    eta: '15–20 Min Arrival',
    features: [
      'High-Pressure Pipe Leakage & Joint Repair',
      'Taps, Faucets & Shower Mixer Replacements',
      'Kitchen Sink & Floor Trap Blockage Clearing',
      'Overhead & Underground Water Tank Cleaning',
    ],
  },
  {
    id: 'svc-ac',
    category: 'Appliance Repair',
    icon: '❄️',
    title: 'AC Servicing & Gas Refill',
    desc: 'Certified HVAC technicians for split/window AC servicing, refrigerant pressure refill, deep jet cleaning, and PCB repair.',
    startingPrice: '₹450',
    eta: 'Same Day / Scheduled',
    features: [
      'Foam Jet & Water Pressure Coil Washing',
      'R32 & R410A Eco Gas Top-Up',
      'Compressor Capacitor & Sensor Replacement',
      'Uninstallation & Relocation Mounting',
    ],
  },
  {
    id: 'svc-carp',
    category: 'Carpentry',
    icon: '🪚',
    title: 'Carpentry & Modular Woodwork',
    desc: 'Skilled carpenters for furniture assembly, door locks, modular kitchen adjustments, and custom wood repairs.',
    startingPrice: '₹300',
    eta: '30–45 Min / Scheduled',
    features: [
      'Bed, Wardrobe & Office Table Assembly',
      'Main Door Mortise Lock & Handle Repair',
      'Modular Kitchen Hinge & Drawer Channel Fix',
      'Wood Polishing & Termite Damage Restoration',
    ],
  },
  {
    id: 'svc-mason',
    category: 'Masonry & Civil',
    icon: '🧱',
    title: 'Masonry (Rajmistri) & Civil Repair',
    desc: 'Experienced civil masons for wall plastering, tile laying, floor grouting, brickwork, and terrace damp proofing.',
    startingPrice: '₹350',
    eta: 'Scheduled / Daily',
    features: [
      'Bathroom & Kitchen Tile Repair / Grouting',
      'Wall Plaster Touch-Up & Crack Sealing',
      'Terrace & Balcony Waterproofing Coating',
      'Boundary Wall & Doorframe Cementing',
    ],
  },
  {
    id: 'svc-paint',
    category: 'Painting',
    icon: '🎨',
    title: 'Home & Office Painting',
    desc: 'Professional wall painting services with authentic Asian Paints/Berger supplies, surface putty, and anti-fungal primers.',
    startingPrice: '₹260',
    eta: 'Free Site Estimate',
    features: [
      'Interior Plastic Emulsion & Royale Luxury Finishes',
      'Exterior Weathercoat & Damp Proofing',
      'Texture Feature Wall Application',
      'Wood & Metal Door Enamel Paint Coating',
    ],
  },
  {
    id: 'svc-weld',
    category: 'Fabrication',
    icon: '🔥',
    title: 'Welding & Metal Fabrication',
    desc: 'On-site welding for main iron gates, safety window grilles, balcony railings, and industrial shed truss repairs.',
    startingPrice: '₹320',
    eta: 'Same Day Service',
    features: [
      'Iron Gate Hinge Repair & Wheel Replacement',
      'MS Window Grille & Railing Welding',
      'Roof Shed Sheet Fixing & Truss Reinforcement',
      'Gas Cutting & Heavy Plate Fabrication',
    ],
  },
  {
    id: 'svc-clean',
    category: 'Cleaning',
    icon: '🧹',
    title: 'Deep Cleaning & Sanitization',
    desc: 'Complete home deep cleaning with industrial single-disc scrubbing machines and hospital-grade sanitizing agents.',
    startingPrice: '₹499',
    eta: 'Scheduled Slot',
    features: [
      'Bathroom Acid-Free Stain Removal & Tile Descaling',
      'Kitchen Chimney & Cabinet Degreasing',
      'Sofa, Mattress & Carpet Shampoo Scrubbing',
      'Full Home Move-In / Move-Out Deep Clean',
    ],
  },
]

const CATEGORY_TABS = [
  'All Services',
  'Electrical',
  'Plumbing',
  'Appliance Repair',
  'Carpentry',
  'Masonry & Civil',
  'Painting',
  'Fabrication',
  'Cleaning',
]

export default function Services({ onNavigate, session }) {
  const [activeTab, setActiveTab] = useState('All Services')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredServices = SERVICES_CATALOG.filter((svc) => {
    const matchesTab = activeTab === 'All Services' || svc.category === activeTab
    const matchesSearch =
      svc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      svc.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      svc.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      svc.features.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()))

    return matchesTab && matchesSearch
  })

  const handleBookService = (svc) => {
    if (!session || !session.authenticated) {
      if (onNavigate) onNavigate('/login')
      return
    }
    if (session.role === 'customer') {
      if (onNavigate) onNavigate('/customer/search-workers')
      return
    }
    if (onNavigate) onNavigate(`/${session.role}/dashboard`)
  }

  return (
    <div className="services-page-root">
      {/* ── Hero Banner ── */}
      <section className="services-hero-banner">
        <div className="services-hero-inner">
          <div className="services-hero-badge">
            ⚡ 100% Background Verified Tradespeople
          </div>
          <h1 className="services-hero-title">
            Skilled Home &amp; Enterprise Services,<br />
            On Demand.
          </h1>
          <p className="services-hero-desc">
            Book licensed electricians, plumbers, carpenters, and appliance experts with transparent pricing, instant GPS arrival, and 30-day service warranty.
          </p>

          <div className="services-search-box">
            <span className="services-search-icon">🔍</span>
            <input
              type="text"
              className="services-search-input"
              placeholder="Search for repair, electrician, pipe leak, AC service…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="button"
              className="services-search-btn"
              onClick={() => {}}
            >
              Search
            </button>
          </div>
        </div>
      </section>

      {/* ── Filter Strip ── */}
      <div className="services-filter-strip">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            className={`services-filter-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Services Grid ── */}
      <main className="services-container">
        <div className="services-grid">
          {filteredServices.map((svc) => (
            <article key={svc.id} className="service-card">
              <div>
                <div className="service-card-header">
                  <div className="service-icon-box">{svc.icon}</div>
                  <div className="service-card-title">
                    <span>{svc.category}</span>
                    <h3>{svc.title}</h3>
                  </div>
                </div>

                <p className="service-card-desc">{svc.desc}</p>

                <div className="service-feature-list">
                  {svc.features.map((feat, idx) => (
                    <div key={idx} className="service-feature-item">
                      <span className="service-feature-dot" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="service-card-footer">
                <div className="service-price-block">
                  <small>Standard Fare</small>
                  <strong>{svc.startingPrice} onwards</strong>
                </div>

                <button
                  type="button"
                  className="service-book-btn"
                  onClick={() => handleBookService(svc)}
                >
                  Book Service ➔
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* ── Guarantee & Trust Badges ── */}
        <section className="services-trust-strip">
          <div className="services-trust-item">
            <span className="services-trust-icon">🛡️</span>
            <div>
              <strong>30-Day Service Guarantee</strong>
              <p>Any rework or defect addressed free of charge with complete customer protection.</p>
            </div>
          </div>

          <div className="services-trust-item">
            <span className="services-trust-icon">🪪</span>
            <div>
              <strong>Police &amp; Aadhaar Verified</strong>
              <p>Every professional undergoes rigorous 4-step identity and trade assessment.</p>
            </div>
          </div>

          <div className="services-trust-item">
            <span className="services-trust-icon">⚡</span>
            <div>
              <strong>Instant Real-Time Arrival</strong>
              <p>Live GPS tracking and security start OTP for reliable and safe doorstep service.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
