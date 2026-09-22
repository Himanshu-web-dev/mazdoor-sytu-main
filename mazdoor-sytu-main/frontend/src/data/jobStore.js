// Mazdoor Sytu - Centralized Job & Workforce Requirements Store
// Manages active requirements posted by businesses, worker applications, and status sync

const INITIAL_JOBS = [
  {
    id: 'JOB-2026-GS-01',
    title: 'Sanitary Plumbers & Pipe Fitters — Villa Project — Ganga Sagar, Meerut',
    company: 'Sharma & Sons Luxury Builders',
    isVerifiedBusiness: true,
    category: 'Plumber',
    location: 'Ganga Sagar, Meerut',
    city: 'Meerut',
    workersNeeded: 4,
    workersFilled: 2,
    rate: '₹950/day',
    rateAmount: 950,
    rateType: 'daily',
    workType: 'Project-Based',
    experience: '3+ Years Experience',
    minExperienceYears: 3,
    startDate: 'Tomorrow',
    duration: '24 Sept to 08 Oct (14 Days)',
    workingHours: '9:00 AM – 6:00 PM (1 hr lunch)',
    postedDate: 'Just now',
    postedTimestamp: Date.now() - 30 * 60 * 1000,
    deadline: '24 Sept 2026',
    status: 'Active',
    urgency: 'Immediate',
    skills: ['CPVC / UPVC Piping', 'Concealed Diverters', 'Pressure Testing', 'Sanitaryware Fitting'],
    facilities: ['Daily Cash / UPI Settlement', 'Lunch & Chai Provided', 'Overtime Bonus @ 1.5x', 'Tool Kit on Site'],
    description: 'Urgent requirement for 4 experienced plumbing mistris for premium residential duplex project in Ganga Sagar, Meerut. Work includes concealed pipeline routing, drainage layout, overhead PVC tank connections, and sanitaryware fitting.',
    responsibilities: [
      'Complete concealed water supply line fitting in 4 designer washrooms',
      'Mount and test overhead water tank connections and pressure pump',
      'Follow site hygiene and safety practices',
      'Daily wage clearance and progress verification with site supervisor'
    ],
    requirements: [
      'Minimum 3 years hands-on field experience in domestic or villa plumbing',
      'Must know CPVC heat sealing / solvent welding and pressure testing',
      'Aadhaar verification required'
    ],
    contactPolicy: 'Platform-mediated direct contractor calling after application'
  },
  {
    id: 'JOB-2026-GS-02',
    title: 'Electricians for Domestic Wiring & Inverter Panels — Ganga Nagar, Meerut',
    company: 'Ganga Enclave Electricals',
    isVerifiedBusiness: true,
    category: 'Electrician',
    location: 'Ganga Nagar, Meerut',
    city: 'Meerut',
    workersNeeded: 3,
    workersFilled: 1,
    rate: '₹850/day',
    rateAmount: 850,
    rateType: 'daily',
    workType: 'Daily Contract',
    experience: '2+ Years Experience',
    minExperienceYears: 2,
    startDate: '24 Sept 2026',
    duration: '24 Sept to 30 Sept (7 Days)',
    workingHours: '9:30 AM – 6:30 PM',
    postedDate: '1 hour ago',
    postedTimestamp: Date.now() - 60 * 60 * 1000,
    deadline: '24 Sept 2026',
    status: 'Active',
    urgency: 'Immediate',
    skills: ['House Wiring', 'MCB Box Dressing', 'Inverter Setup', 'Modular Switch Boards'],
    facilities: ['Lunch & Afternoon Tea Provided', 'Direct Daily Bank/Cash Payout', 'Safety Gloves & Helmet'],
    description: 'Looking for 3 skilled electricians for complete internal wiring, distribution board dressing, modular switch fitting and solar hybrid inverter integration in 3-storey bungalow.',
    responsibilities: [
      'Pull multi-strand copper cables through PVC conduits',
      'Dress and label single-phase & three-phase MCB distribution boxes',
      'Mount decorative LED profile lights and modular switch plates',
      'Ensure zero earth leakage and test all socket polarities'
    ],
    requirements: [
      '2+ years residential wiring experience',
      'Own basic tools (tester, pliers, wire stripper)',
      'Aadhaar verified'
    ],
    contactPolicy: 'Direct contact via Mazdoor Sytu'
  },
  {
    id: 'JOB-2026-GS-03',
    title: 'Modular Kitchen Carpenters & Plywood Assembly — Ganga Sagar, Meerut',
    company: 'Craftsman Woods & Interiors',
    isVerifiedBusiness: true,
    category: 'Carpenter',
    location: 'Ganga Sagar, Meerut',
    city: 'Meerut',
    workersNeeded: 4,
    workersFilled: 2,
    rate: '₹900/day',
    rateAmount: 900,
    rateType: 'daily',
    workType: 'Project-Based',
    experience: '3+ Years Experience',
    minExperienceYears: 3,
    startDate: '25 Sept 2026',
    duration: '25 Sept to 05 Oct (10 Days)',
    workingHours: '9:00 AM – 6:00 PM',
    postedDate: '3 hours ago',
    postedTimestamp: Date.now() - 3 * 60 * 60 * 1000,
    deadline: '25 Sept 2026',
    status: 'Active',
    urgency: 'Immediate',
    skills: ['Modular Kitchen Carcass', 'Mica Laminate Pasting', 'Soft-close Hinges', 'Tandem Drawers'],
    facilities: ['Daily Chai & Snacks', 'Power Cutting Tools on Site', 'Timely Payout Guaranteed'],
    description: 'We require 4 skilled furniture carpenters for high-end acrylic and laminating shutter work, modular kitchen tandem box fitting, and TV unit framing.',
    responsibilities: [
      'Assemble factory-cut HDHMR carcasses with precision',
      'Paste laminate sheets cleanly without air bubbles',
      'Install soft-close telescopic drawer channels and lift-up shutters'
    ],
    requirements: [
      '3+ years experience in interior woodwork or modular kitchens',
      'Precision measurement skills'
    ],
    contactPolicy: 'Platform verified'
  },
  {
    id: 'JOB-2026-01',
    title: 'Electrician Required — ABC Construction — Meerut',
    company: 'ABC Construction Ltd.',
    isVerifiedBusiness: true,
    category: 'Electrician',
    location: 'Shastri Nagar, Meerut',
    city: 'Meerut',
    workersNeeded: 5,
    workersFilled: 2,
    rate: '₹800/day',
    rateAmount: 800,
    rateType: 'daily',
    workType: 'Daily Contract',
    experience: '2+ Years Experience',
    minExperienceYears: 2,
    startDate: '25 Sept 2026',
    duration: '25 Sept to 30 Sept (6 Days)',
    workingHours: '9:00 AM – 6:00 PM (1 hr lunch)',
    postedDate: '2 hours ago',
    postedTimestamp: Date.now() - 2 * 60 * 60 * 1000,
    deadline: '24 Sept 2026',
    status: 'Active',
    urgency: 'Immediate',
    skills: ['Industrial Wiring', 'Conduit Pipe Fitting', 'DB Dressing', 'Safety Compliance', 'Power Sockets'],
    facilities: ['Lunch & Tea Provided', 'Safety Helmet & Gloves Supplied', 'Site Transport from Meerut City Station'],
    description: 'Looking for 5 qualified, safety-conscious electricians for multi-floor commercial complex electrification. Work involves running conduits, pulling cables, distribution box dressing, testing circuit continuity and mounting panel accessories.',
    responsibilities: [
      'Complete conduit pipe layout and wire pulling across 3 designated commercial floors',
      'Mount and connect 3-phase Distribution Boards (DBs) per architectural drawings',
      'Follow site safety protocols, wearing PPE gear provided at all times',
      'Coordinate with the site electrical supervisor for daily progress sign-offs'
    ],
    requirements: [
      'Minimum 2 years proven hands-on field experience in domestic or commercial wiring',
      'Must bring standard personal hand tools (pliers, tester, wire stripper, multimeter)',
      'Aadhaar card and basic trade qualification or verification'
    ],
    contactPolicy: 'Platform-mediated chat and calling available after application shortlisting'
  },
  {
    id: 'JOB-2026-02',
    title: 'Senior Plumbers for High-Rise Plumbing — Apex Infra',
    company: 'Apex Infra Projects',
    isVerifiedBusiness: true,
    category: 'Plumber',
    location: 'Sector 62, Noida',
    city: 'Noida',
    workersNeeded: 4,
    workersFilled: 1,
    rate: '₹950/day',
    rateAmount: 950,
    rateType: 'daily',
    workType: 'Project-Based',
    experience: '3+ Years Experience',
    minExperienceYears: 3,
    startDate: '27 Sept 2026',
    duration: '27 Sept to 15 Oct (19 Days)',
    workingHours: '8:30 AM – 5:30 PM',
    postedDate: '5 hours ago',
    postedTimestamp: Date.now() - 5 * 60 * 60 * 1000,
    deadline: '26 Sept 2026',
    status: 'Active',
    urgency: 'Normal',
    skills: ['CPVC / UPVC Piping', 'Sanitaryware Fitting', 'Pressure Testing', 'Drainage Slope Layout'],
    facilities: ['Accommodation at Site Camp', 'Subsidized Canteen', 'Safety Boots & Harness'],
    description: 'Require 4 skilled plumbing mistris for vertical stack pipeline connections, overhead tank installation, and premium bathroom sanitary fixtures for a residential tower.',
    responsibilities: [
      'Install CPVC and UPVC vertical supply risers and drainage stacks',
      'Fit concealed wall diverters, cisterns, and bathroom fixtures',
      'Conduct hydraulic pressure tests up to 8 bar without leakage',
      'Inspect seal joints and maintain proper drainage slope angles'
    ],
    requirements: [
      '3+ years experience with high-rise or multi-unit residential plumbing',
      'Ability to read simple plumbing schematics and measurement tags'
    ],
    contactPolicy: 'Platform-mediated communication only'
  },
  {
    id: 'JOB-2026-03',
    title: 'Experienced Carpenters for Modular Interiors — Elegant Woods',
    company: 'Elegant Woods & Decors',
    isVerifiedBusiness: true,
    category: 'Carpenter',
    location: 'Raj Nagar Extension, Ghaziabad',
    city: 'Ghaziabad',
    workersNeeded: 6,
    workersFilled: 3,
    rate: '₹850/day',
    rateAmount: 850,
    rateType: 'daily',
    workType: 'Project-Based',
    experience: '3+ Years Experience',
    minExperienceYears: 3,
    startDate: '28 Sept 2026',
    duration: '28 Sept to 10 Oct (12 Days)',
    workingHours: '9:30 AM – 6:30 PM',
    postedDate: '1 day ago',
    postedTimestamp: Date.now() - 24 * 60 * 60 * 1000,
    deadline: '27 Sept 2026',
    status: 'Active',
    urgency: 'Normal',
    skills: ['Modular Kitchen Assembly', 'Laminate Pasting', 'Hinges & Hardware Tuning', 'Wardrobe Framing'],
    facilities: ['Daily Chai & Refreshments', 'Power Tool Supply on Site', 'Overtime Bonus @ 1.5x'],
    description: 'We are furnishing 8 model apartments. Seeking 6 skilled carpenters for precision modular kitchen installation, wardrobe carcasses, and door frame alignment.',
    responsibilities: [
      'Assemble pre-cut modular plywood and HDHMR carcasses with minifix and screws',
      'Apply laminate edge-banding and surface finishing',
      'Hang doors with soft-close hydraulic hinges and drawer slide channels',
      'Ensure zero-gap alignment and smooth operation of all shutter units'
    ],
    requirements: [
      'Prior experience with modular interior systems and modern fittings (Hettich, Hafele)',
      'Attention to detail, clean finish, and respectful site conduct'
    ],
    contactPolicy: 'Communication via Mazdoor Sytu Portal'
  },
  {
    id: 'JOB-2026-04',
    title: 'Civil Construction Masons (Raj Mistri) — Kashi Developers',
    company: 'Kashi Developers & Builders',
    isVerifiedBusiness: true,
    category: 'Mason',
    location: 'Delhi Road, Meerut',
    city: 'Meerut',
    workersNeeded: 8,
    workersFilled: 5,
    rate: '₹900/day',
    rateAmount: 900,
    rateType: 'daily',
    workType: 'Daily Contract',
    experience: '4+ Years Experience',
    minExperienceYears: 4,
    startDate: 'Tomorrow',
    duration: '21 Sept to 05 Oct (15 Days)',
    workingHours: '8:00 AM – 5:00 PM',
    postedDate: '3 hours ago',
    postedTimestamp: Date.now() - 3 * 60 * 60 * 1000,
    deadline: '22 Sept 2026',
    status: 'Active',
    urgency: 'Immediate',
    skills: ['Red Brickwork', 'Fly Ash Block Masonry', 'Smooth Plastering', 'Leveling & Plumb Line'],
    facilities: ['Clean Drinking Water', 'Safety Gear', 'Daily Cash/Bank Payouts every Saturday'],
    description: 'Urgent requirement for 8 seasoned brick and plaster masons for outer boundary wall and ground floor partition masonry at warehouse development.',
    responsibilities: [
      'Construct 9-inch load-bearing and 4.5-inch partition brick walls using 1:4 mortar',
      'Maintain exact plumb, water level and horizontal line strings',
      'Execute neat cement plaster with sponge float finish',
      'Lead helper laborers efficiently on mortar mixing ratios'
    ],
    requirements: [
      'Minimum 4 years verifiable experience as lead mason (Raj Mistri)',
      'Own plumb bob, trowel (karni), spirit level and line dori'
    ],
    contactPolicy: 'Platform-mediated chat and calling'
  },
  {
    id: 'JOB-2026-05',
    title: 'Commercial Wall Painters — Rangoli Paints & Contracting',
    company: 'Rangoli Contracting Services',
    isVerifiedBusiness: true,
    category: 'Painter',
    location: 'Indirapuram, Ghaziabad',
    city: 'Ghaziabad',
    workersNeeded: 5,
    workersFilled: 4,
    rate: '₹750/day',
    rateAmount: 750,
    rateType: 'daily',
    workType: 'Project-Based',
    experience: '2+ Years Experience',
    minExperienceYears: 2,
    startDate: '26 Sept 2026',
    duration: '26 Sept to 02 Oct (7 Days)',
    workingHours: '9:00 AM – 6:00 PM',
    postedDate: '6 hours ago',
    postedTimestamp: Date.now() - 6 * 60 * 60 * 1000,
    deadline: '25 Sept 2026',
    status: 'Closing Soon',
    urgency: 'Normal',
    skills: ['Putty Application', 'Roller Painting', 'Primer Coating', 'Texture Finish', 'Surface Sanding'],
    facilities: ['Ladders & Rollers Provided', 'Masks & Gloves Provided', 'Chai & Snacks'],
    description: 'Interior repainting of a 3-storey office building. Needs 5 painters experienced in smooth putty sanding, 2 coats of premium emulsion, and crisp border tape lines.',
    responsibilities: [
      'Surface prep: scrap loose flakes, apply wall putty and sand with 220-grit paper',
      'Apply 1 coat water-based primer followed by 2 uniform coats of interior emulsion',
      'Mask switchboards, windows, and floors to prevent paint splatter',
      'Leave premises clean after completing each floor'
    ],
    requirements: [
      '2+ years experience with roller painting and putty application',
      'Must work safely at heights up to 10 feet using scaffolding/ladders'
    ],
    contactPolicy: 'Direct chat via Mazdoor Sytu'
  },
  {
    id: 'JOB-2026-06',
    title: 'Heavy Structural Welders & Fabricators — Shiv Shakti Steel',
    company: 'Shiv Shakti Heavy Fab Works',
    isVerifiedBusiness: true,
    category: 'Welder',
    location: 'Partapur Industrial Area, Meerut',
    city: 'Meerut',
    workersNeeded: 3,
    workersFilled: 0,
    rate: '₹1,000/day',
    rateAmount: 1000,
    rateType: 'daily',
    workType: 'Full-Time',
    experience: '3+ Years Experience',
    minExperienceYears: 3,
    startDate: 'Immediate',
    duration: '3 Months Ongoing Contract',
    workingHours: '9:00 AM – 7:00 PM',
    postedDate: '1 hour ago',
    postedTimestamp: Date.now() - 1 * 60 * 60 * 1000,
    deadline: '25 Sept 2026',
    status: 'Active',
    urgency: 'Immediate',
    skills: ['MIG Welding', 'Arc Welding', 'Gas Cutting', 'Structural Truss Assembly', 'Grinding'],
    facilities: ['Welding Face Shield Provided', 'Leather Apron & Gloves', 'Monthly Incentive Bonus'],
    description: 'Fabrication of heavy industrial shed roof trusses, I-beam joints, and purlins. 3 certified or experienced MIG/Arc welders required urgently.',
    responsibilities: [
      'Execute continuous MIG and stick arc welds on 6mm to 16mm MS plates',
      'Operate oxy-acetylene torch for bevel cutting and plate preparation',
      'Grind weld beads flat and inspect for porosity or pinholes',
      'Adhere to all industrial workshop safety regulations strictly'
    ],
    requirements: [
      '3+ years in structural steel fabrication or pressure vessel welding',
      'Ability to pass a sample welding bead test at the shop before joining'
    ],
    contactPolicy: 'Platform-mediated chat and calling'
  },
  {
    id: 'JOB-2026-07',
    title: 'Warehouse Loading & Unloading Team — SwiftLogistics',
    company: 'SwiftLogistics Hub Meerut',
    isVerifiedBusiness: true,
    category: 'Loading & Unloading',
    location: 'Transport Nagar, Meerut',
    city: 'Meerut',
    workersNeeded: 12,
    workersFilled: 7,
    rate: '₹700/day',
    rateAmount: 700,
    rateType: 'daily',
    workType: 'Daily Contract',
    experience: '1+ Years Experience',
    minExperienceYears: 1,
    startDate: 'Today Night / Tomorrow',
    duration: 'Ongoing Seasonal Requirement',
    workingHours: 'Day Shift (8 AM - 5 PM) / Night Shift (8 PM - 5 AM)',
    postedDate: '4 hours ago',
    postedTimestamp: Date.now() - 4 * 60 * 60 * 1000,
    deadline: '24 Sept 2026',
    status: 'Active',
    urgency: 'Immediate',
    skills: ['Carton Handling', 'Pallet Loading', 'Hand Truck Operation', 'Damage-Free Stacking'],
    facilities: ['Weekly Cash/Bank Payments', 'Tea & Refreshment Breaks', 'Overtime Pay ₹100/hr'],
    description: 'Looking for 12 energetic and reliable loading/unloading workers for FMCG goods unloading from container trucks onto warehouse staging pallets.',
    responsibilities: [
      'Unload FMCG packed cartons from 32-foot trailers onto wooden pallets',
      'Count incoming packages against delivery challans with tally clerk',
      'Handle fragile items with due caution to ensure zero damage',
      'Keep warehouse bays clean and unobstructed'
    ],
    requirements: [
      'Good physical stamina, reliable attendance, and punctuality',
      'Aadhaar card mandatory for warehouse gate entry pass'
    ],
    contactPolicy: 'Mazdoor Sytu verified dispatch'
  },
  {
    id: 'JOB-2026-08',
    title: 'Deep Cleaning Crew for Commercial Showroom — CleanPro',
    company: 'CleanPro Facility Management',
    isVerifiedBusiness: true,
    category: 'Cleaning Worker',
    location: 'Connaught Place / South Ex, Delhi NCR',
    city: 'Delhi NCR',
    workersNeeded: 6,
    workersFilled: 2,
    rate: '₹650/day',
    rateAmount: 650,
    rateType: 'daily',
    workType: 'Daily Contract',
    experience: '1+ Years Experience',
    minExperienceYears: 1,
    startDate: '26 Sept 2026',
    duration: '26 Sept to 28 Sept (3 Days)',
    workingHours: '9:00 AM – 6:00 PM',
    postedDate: '8 hours ago',
    postedTimestamp: Date.now() - 8 * 60 * 60 * 1000,
    deadline: '25 Sept 2026',
    status: 'Active',
    urgency: 'Normal',
    skills: ['Single Disc Floor Scrubber', 'Glass Squeegee Cleaning', 'Carpet Vacuuming', 'Sanitization'],
    facilities: ['Uniform & Apron Provided', 'Lunch Provided', 'Metro Conveyance Allowance ₹100/day'],
    description: 'Pre-opening deep scrubbing and sanitization of a 10,000 sq ft automobile showroom. Requires 6 cleaning workers experienced with commercial equipment.',
    responsibilities: [
      'Machine buff and scrub large format vitrified tile flooring',
      'Streak-free cleaning of floor-to-ceiling exterior glass facade panels',
      'Vacuum and wipe clean executive lounge upholstery and desks',
      'Disinfect washrooms, pantry counters and common staircases'
    ],
    requirements: [
      'Prior commercial cleaning experience or facility housekeeping background',
      'Well-groomed and respectful behavior on client premises'
    ],
    contactPolicy: 'Platform-mediated calling'
  },
  {
    id: 'JOB-2026-09',
    title: 'Earthmoving JCB & Excavator Operator — Bundelkhand Infra',
    company: 'Bundelkhand Infra Corp',
    isVerifiedBusiness: true,
    category: 'Machine Operator',
    location: 'Sipri Bazar, Jhansi',
    city: 'Jhansi',
    workersNeeded: 2,
    workersFilled: 1,
    rate: '₹1,200/day',
    rateAmount: 1200,
    rateType: 'daily',
    workType: 'Project-Based',
    experience: '3+ Years Experience',
    minExperienceYears: 3,
    startDate: '01 Oct 2026',
    duration: '1 Month Contract',
    workingHours: '7:30 AM – 5:30 PM',
    postedDate: '12 hours ago',
    postedTimestamp: Date.now() - 12 * 60 * 60 * 1000,
    deadline: '29 Sept 2026',
    status: 'Active',
    urgency: 'Normal',
    skills: ['JCB 3DX Operation', 'Trench Digging', 'Grading & Leveling', 'Routine Machine Greasing'],
    facilities: ['Site Accommodation', 'Food Allowance ₹200/day', 'Prompt Monthly Settlement'],
    description: 'Requires 2 skilled, licensed JCB 3DX operators for canal excavation and subgrade soil compaction project.',
    responsibilities: [
      'Operate JCB backhoe loader for 2.5m canal trenching with slope precision',
      'Conduct daily pre-start checks (engine oil, hydraulic pressure, grease pins)',
      'Safely coordinate with tipper dumper drivers during soil loading',
      'Maintain machine logbook with fuel consumption and operating hours'
    ],
    requirements: [
      'Valid Commercial Heavy Motor Vehicle / Machinery Driving License',
      'At least 3 years documented JCB operator experience on civil infrastructure sites'
    ],
    contactPolicy: 'Mazdoor Sytu verified direct interview'
  }
]

const JOBS_STORAGE_KEY = 'mazdoor_setu_jobs_v2'
const APPS_STORAGE_KEY = 'mazdoor_setu_job_applications_v2'

export function getStoredJobs() {
  try {
    const data = localStorage.getItem(JOBS_STORAGE_KEY)
    if (data) {
      const parsed = JSON.parse(data)
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Merge any new initial jobs that aren't present yet
        const existingIds = new Set(parsed.map((j) => j.id))
        const missingDefaults = INITIAL_JOBS.filter((j) => !existingIds.has(j.id))
        if (missingDefaults.length > 0) {
          const merged = [...missingDefaults, ...parsed]
          try {
            localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(merged))
          } catch {}
          return merged
        }
        return parsed
      }
    }
  } catch (err) {
    console.error('Error reading stored jobs:', err)
  }
  // Initialize with default verified jobs
  try {
    localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(INITIAL_JOBS))
  } catch {}
  return INITIAL_JOBS
}

export function saveJobRequirement(newJob) {
  const current = getStoredJobs()
  const companyName = newJob.company || 'Apex Infra Projects'
  const jobRecord = {
    id: `JOB-${Date.now().toString().slice(-6)}`,
    title: newJob.title || `${newJob.service || 'Worker'} Required — ${companyName}`,
    company: companyName,
    companyId: newJob.companyId || 'BUS-101',
    businessId: newJob.businessId || newJob.companyId || 'BUS-101',
    isVerifiedBusiness: true,
    category: newJob.service || newJob.category || 'Construction Worker',
    location: newJob.location || 'Meerut, Uttar Pradesh',
    city: newJob.city || (newJob.location ? newJob.location.split(',').pop().trim() : 'Meerut'),
    workersNeeded: parseInt(newJob.workersNeeded || newJob.workers || 4, 10),
    workersFilled: 0,
    rate: newJob.budget || '₹850/day',
    rateAmount: parseInt(String(newJob.budget || '850').replace(/[^0-9]/g, '') || '850', 10),
    rateType: newJob.rateType || 'daily',
    workType: newJob.workType || 'Daily Contract',
    experience: newJob.experience || '2+ Years Experience',
    minExperienceYears: parseInt(newJob.minExperienceYears || 2, 10),
    startDate: newJob.timeline || newJob.startDate || 'Within 48 hours',
    duration: newJob.duration || 'Short-term Project',
    workingHours: newJob.workingHours || '9:00 AM – 6:00 PM',
    postedDate: 'Just now',
    postedTimestamp: Date.now(),
    deadline: newJob.deadline || 'In 7 days',
    status: 'Active',
    urgency: newJob.urgency || 'Normal',
    skills: Array.isArray(newJob.skills)
      ? newJob.skills
      : String(newJob.skills || `${newJob.service || 'Skilled Labor'}, Safety Compliance, Quality Work`)
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
    facilities: Array.isArray(newJob.facilities)
      ? newJob.facilities
      : ['Safety Helmet & Gear Provided', 'Tea & Drinking Water on Site'],
    description: newJob.description || newJob.details || 'Workforce requirement posted via Mazdoor Sytu Business Portal.',
    responsibilities: newJob.responsibilities || [
      'Execute assigned trade work to quality and safety standards',
      'Follow site safety protocols and wear required PPE gear at all times',
      'Coordinate with site project coordinator for daily progress sign-offs'
    ],
    requirements: newJob.requirements || [
      'Relevant hands-on field experience with required trade tools',
      'Aadhaar card verification'
    ],
    contactPolicy: 'Platform-mediated verified communication via Mazdoor Sytu'
  }

  const updated = [jobRecord, ...current]
  try {
    localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(updated))
  } catch (err) {
    console.error('Error saving job requirement:', err)
  }
  return jobRecord
}

export function updateJobStatus(jobId, newStatus) {
  const current = getStoredJobs()
  const updated = current.map((job) => {
    if (job.id === jobId) {
      return { ...job, status: newStatus }
    }
    return job
  })
  try {
    localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(updated))
  } catch (err) {
    console.error('Error updating job status:', err)
  }
  return updated
}

export function deleteJobRequirement(jobId) {
  const current = getStoredJobs()
  const updated = current.filter((job) => job.id !== jobId)
  try {
    localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(updated))
  } catch (err) {
    console.error('Error deleting job requirement:', err)
  }
  return updated
}

export function getStoredApplications() {
  try {
    const data = localStorage.getItem(APPS_STORAGE_KEY)
    if (data) return JSON.parse(data)
  } catch (err) {
    console.error('Error reading applications:', err)
  }
  return [
    {
      id: 'APP-1001',
      jobId: 'JOB-2026-01',
      jobTitle: 'Electrician Required — ABC Construction — Meerut',
      company: 'ABC Construction Ltd.',
      workerName: 'Rahul Kumar',
      workerPhone: '+91 98765 43210',
      workerEmail: 'rahul.kumar@example.com',
      service: 'Electrician',
      experience: '5 years',
      skills: ['Industrial Wiring', 'DB Dressing', 'Conduit Pipe', 'Multimeter'],
      serviceArea: 'Meerut and nearby areas',
      rating: '4.9 ★ (48 reviews)',
      rateOffered: '₹800/day',
      expectedRate: '₹800/day',
      status: 'Under Review',
      appliedAt: 'Yesterday, 4:20 PM',
      appliedTimestamp: Date.now() - 24 * 60 * 60 * 1000,
      notes: 'Available to start from 25 Sept. Have 5 years experience in commercial DB wiring and pipe conduits.'
    }
  ]
}

export function submitJobApplication({ jobId, jobTitle, company, workerProfile, expectedRate, notes }) {
  const currentApps = getStoredApplications()
  
  const workerIdentifier = workerProfile?.uid || workerProfile?.id || workerProfile?.phone || workerProfile?.email || 'worker'

  // Check if THIS SPECIFIC worker has already applied for this job
  const existing = currentApps.find(
    (app) =>
      app.jobId === jobId &&
      ((app.workerIdentifier && app.workerIdentifier === workerIdentifier) ||
        (app.workerPhone && workerProfile?.phone && app.workerPhone === workerProfile.phone) ||
        (app.workerEmail && workerProfile?.email && app.workerEmail.toLowerCase() === workerProfile.email.toLowerCase()))
  )

  if (existing) {
    return { success: false, message: 'You have already applied for this job opportunity.', application: existing }
  }

  const newApp = {
    id: `APP-${Date.now().toString().slice(-6)}`,
    jobId,
    jobTitle,
    company,
    workerIdentifier,
    workerName: workerProfile?.name || 'Rahul Kumar',
    workerPhone: workerProfile?.phone || '+91 98765 43210',
    workerEmail: workerProfile?.email || 'worker@mazdoorsytu.in',
    service: workerProfile?.service || workerProfile?.trade || 'Skilled Worker',
    experience: workerProfile?.experience || '3+ years',
    skills: workerProfile?.skills || [workerProfile?.service || 'Trade Specialist', 'Quality Work', 'Safety Verified'],
    serviceArea: workerProfile?.serviceArea || 'Meerut and nearby areas',
    rating: workerProfile?.rating || '4.9 ★',
    verification: workerProfile?.verification || 'Aadhaar Verified',
    rateOffered: expectedRate || '₹800/day',
    expectedRate: expectedRate || '₹800/day',
    status: 'Applied',
    appliedAt: 'Just now',
    appliedTimestamp: Date.now(),
    notes: notes || 'I am ready to join and have matching skills for this requirement.'
  }

  const updated = [newApp, ...currentApps]
  try {
    localStorage.setItem(APPS_STORAGE_KEY, JSON.stringify(updated))
  } catch (err) {
    console.error('Error saving application:', err)
  }

  return { success: true, message: 'Application submitted successfully!', application: newApp }
}

export function updateApplicationStatus(appId, newStatus) {
  const currentApps = getStoredApplications()
  let targetApp = null

  const updatedApps = currentApps.map((app) => {
    if (app.id === appId) {
      targetApp = { ...app, status: newStatus }
      return targetApp
    }
    return app
  })

  try {
    localStorage.setItem(APPS_STORAGE_KEY, JSON.stringify(updatedApps))
  } catch (err) {
    console.error('Error saving updated application status:', err)
  }

  // When a worker application is Accepted / Hired, increment workersFilled on the job
  if (targetApp && newStatus === 'Accepted') {
    const allJobs = getStoredJobs()
    const updatedJobs = allJobs.map((job) => {
      if (job.id === targetApp.jobId) {
        const currentFilled = job.workersFilled || 0
        const needed = job.workersNeeded || 1
        const nextFilled = Math.min(currentFilled + 1, needed)
        const nextStatus = nextFilled >= needed ? 'Filled' : job.status
        return { ...job, workersFilled: nextFilled, status: nextStatus }
      }
      return job
    })

    try {
      localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(updatedJobs))
    } catch (err) {
      console.error('Error updating job workersFilled:', err)
    }
  }

  return updatedApps
}
