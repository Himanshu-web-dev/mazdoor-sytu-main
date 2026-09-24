// src/services/firestoreService.js
import {
  collection,
  doc,
  setDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'
import { db, isFirebaseConfigured } from '../config/firebase'
import { jobApi, workerApi } from './api'

// -----------------------------------------------------------------------------
// Jobs Collection
// -----------------------------------------------------------------------------

export async function fetchAllJobs() {
  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, 'jobs'), orderBy('createdAt', 'desc'))
      const snap = await getDocs(q)
      if (!snap.empty) {
        return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      }
      return []
    } catch (err) {
      console.warn('Firestore fetchAllJobs error, attempting backend API:', err)
    }
  }

  // Fallback to Backend REST API
  try {
    const res = await jobApi.listJobs()
    return Array.isArray(res?.data) ? res.data : []
  } catch (err) {
    console.error('Failed to fetch jobs from API:', err)
    return []
  }
}

export async function postNewJob(jobData) {
  if (isFirebaseConfigured && db) {
    try {
      const jobId = `JOB-${Date.now()}`
      const record = {
        ...jobData,
        id: jobId,
        status: 'Active',
        postedTimestamp: Date.now(),
        createdAt: serverTimestamp(),
      }
      await setDoc(doc(db, 'jobs', jobId), record)
      return record
    } catch (err) {
      console.warn('Firestore postNewJob error, attempting backend API:', err)
    }
  }

  // Fallback to Backend REST API
  try {
    const res = await jobApi.createJob(jobData)
    return res?.data || jobData
  } catch (err) {
    console.error('Failed to post job via API:', err)
    throw err
  }
}

export async function setJobStatus(jobId, status) {
  if (isFirebaseConfigured && db) {
    try {
      await updateDoc(doc(db, 'jobs', jobId), { status, updatedAt: serverTimestamp() })
      return { success: true }
    } catch (err) {
      console.warn('Firestore setJobStatus error:', err)
    }
  }
  return { success: true }
}

export async function removeJob(jobId) {
  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, 'jobs', jobId))
      return { success: true }
    } catch (err) {
      console.warn('Firestore removeJob error:', err)
    }
  }
  return { success: true }
}

// -----------------------------------------------------------------------------
// Applications Collection with Compound Uniqueness (jobId + workerIdentifier)
// -----------------------------------------------------------------------------

export async function submitApplication({ jobId, jobTitle, company, workerProfile, expectedRate, notes }) {
  const workerIdentifier = workerProfile?.uid || workerProfile?.id || workerProfile?.phone || workerProfile?.email || 'ANON'

  if (isFirebaseConfigured && db) {
    try {
      // Check duplicate application by this specific worker for this job
      const q = query(
        collection(db, 'applications'),
        where('jobId', '==', jobId),
        where('workerIdentifier', '==', workerIdentifier)
      )
      const existingSnap = await getDocs(q)
      if (!existingSnap.empty) {
        return {
          success: false,
          message: 'You have already submitted an application for this job opening.',
          application: { id: existingSnap.docs[0].id, ...existingSnap.docs[0].data() },
        }
      }

      const appId = `APP-${Date.now().toString().slice(-6)}`
      const newApp = {
        id: appId,
        jobId,
        jobTitle,
        company,
        workerIdentifier,
        workerName: workerProfile?.name || 'Worker',
        workerPhone: workerProfile?.phone || '',
        workerEmail: workerProfile?.email || '',
        service: workerProfile?.service || workerProfile?.trade || 'Skilled Worker',
        experience: workerProfile?.experience || '3+ years',
        expectedRate: expectedRate || 'Standard Rate',
        notes: notes || '',
        status: 'Under Review',
        appliedTimestamp: Date.now(),
        createdAt: serverTimestamp(),
      }

      await setDoc(doc(db, 'applications', appId), newApp)
      return { success: true, message: 'Application submitted successfully!', application: newApp }
    } catch (err) {
      console.warn('Firestore submitApplication error, attempting API:', err)
    }
  }

  // Fallback to Backend REST API
  try {
    const res = await jobApi.applyJob({
      jobId,
      workerId: workerIdentifier,
      workerName: workerProfile?.name || 'Worker',
      workerPhone: workerProfile?.phone || '',
      expectedRate,
      notes,
    })
    return { success: true, message: 'Application submitted successfully!', application: res?.data }
  } catch (err) {
    return { success: false, message: err.message || 'Failed to submit application.' }
  }
}

export async function fetchApplicationsForBusiness(businessId, companyName) {
  if (isFirebaseConfigured && db) {
    try {
      let q = query(collection(db, 'applications'))
      if (businessId) {
        q = query(collection(db, 'applications'), where('businessId', '==', businessId))
      }
      const snap = await getDocs(q)
      if (!snap.empty) {
        return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      }
      return []
    } catch (err) {
      console.warn('Firestore fetchApplicationsForBusiness error:', err)
    }
  }

  // Fallback to Backend API
  try {
    const res = await jobApi.getJobApplications(businessId || 'all')
    return Array.isArray(res?.data) ? res.data : []
  } catch {
    return []
  }
}

// -----------------------------------------------------------------------------
// Worker Operations
// -----------------------------------------------------------------------------

export async function updateWorkerAvailability(workerId, availability) {
  if (isFirebaseConfigured && db && workerId) {
    try {
      await updateDoc(doc(db, 'users', workerId), {
        availability,
        updatedAt: serverTimestamp(),
      })
      await updateDoc(doc(db, 'workers', workerId), {
        availability,
        updatedAt: serverTimestamp(),
      })
      return { success: true }
    } catch (err) {
      console.warn('Firestore updateWorkerAvailability error:', err)
    }
  }

  try {
    await workerApi.setAvailability(availability)
    return { success: true }
  } catch {
    return { success: true }
  }
}
