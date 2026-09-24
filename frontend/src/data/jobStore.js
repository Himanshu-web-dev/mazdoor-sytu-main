// Mazdoor Sytu - Centralized Job & Workforce Requirements Store
// Manages active requirements posted by businesses, worker applications, and status sync

const JOBS_STORAGE_KEY = 'mazdoor_setu_jobs_v2'
const APPS_STORAGE_KEY = 'mazdoor_setu_job_applications_v2'

const INITIAL_JOBS = []
const INITIAL_APPLICATIONS = []

export function getStoredJobs() {
  try {
    const data = localStorage.getItem(JOBS_STORAGE_KEY)
    if (data) {
      const parsed = JSON.parse(data)
      if (Array.isArray(parsed)) {
        return parsed
      }
    }
  } catch (err) {
    console.error('Error reading stored jobs:', err)
  }
  return INITIAL_JOBS
}

export function saveJobRequirement(newJob) {
  const current = getStoredJobs()
  const jobId = newJob.id || `JOB-${Date.now()}`

  const jobRecord = {
    id: jobId,
    title: newJob.title || 'Workforce Requirement',
    company: newJob.company || newJob.companyName || 'Verified Enterprise',
    companyId: newJob.companyId || newJob.companyEmail || '',
    businessId: newJob.businessId || '',
    isVerifiedBusiness: true,
    category: newJob.category || newJob.trade || newJob.service || 'General',
    location: newJob.location || 'Local Site',
    city: newJob.city || 'Meerut',
    workersNeeded: parseInt(newJob.workersNeeded || 1, 10),
    workersFilled: parseInt(newJob.workersFilled || 0, 10),
    rate: newJob.rate || (newJob.dailyWage ? `₹${newJob.dailyWage}/day` : '₹800/day'),
    rateAmount: parseInt(newJob.rateAmount || newJob.dailyWage || 800, 10),
    rateType: newJob.rateType || 'daily',
    workType: newJob.workType || 'Project-Based',
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
    if (data) {
      const parsed = JSON.parse(data)
      if (Array.isArray(parsed)) {
        return parsed
      }
    }
  } catch (err) {
    console.error('Error reading applications:', err)
  }
  return INITIAL_APPLICATIONS
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
    workerName: workerProfile?.name || 'Worker',
    workerPhone: workerProfile?.phone || '',
    workerEmail: workerProfile?.email || '',
    service: workerProfile?.service || workerProfile?.trade || 'Skilled Worker',
    experience: workerProfile?.experience || '3+ years',
    skills: workerProfile?.skills || ['Trade Specialist', 'Quality Work', 'Safety Verified'],
    serviceArea: workerProfile?.serviceArea || 'Local site area',
    rating: workerProfile?.rating || '5.0 ★',
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
