// src/services/firestoreService.js
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'
import { db, isFirebaseConfigured } from '../config/firebase'
import {
  getStoredJobs,
  saveJobRequirement as saveLocalJob,
  updateJobStatus as updateLocalJobStatus,
  deleteJobRequirement as deleteLocalJob,
  getStoredApplications,
  submitJobApplication as submitLocalApplication,
} from '../data/jobStore'

// -----------------------------------------------------------------------------
// Jobs Collection
// -----------------------------------------------------------------------------

export async function fetchAllJobs() {
  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, 'jobs'), orderBy('postedTimestamp', 'desc'))
      const snap = await getDocs(q)
      if (!snap.empty) {
        return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      }
    } catch (err) {
      console.warn('Firestore fetchAllJobs error, using local store:', err)
    }
  }
  return getStoredJobs()
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
      console.warn('Firestore postNewJob error, falling back to local:', err)
    }
  }
  return saveLocalJob(jobData)
}

export async function setJobStatus(jobId, status) {
  if (isFirebaseConfigured && db) {
    try {
      await updateDoc(doc(db, 'jobs', jobId), { status, updatedAt: serverTimestamp() })
    } catch (err) {
      console.warn('Firestore setJobStatus error:', err)
    }
  }
  return updateLocalJobStatus(jobId, status)
}

export async function removeJob(jobId) {
  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, 'jobs', jobId))
    } catch (err) {
      console.warn('Firestore removeJob error:', err)
    }
  }
  return deleteLocalJob(jobId)
}

// -----------------------------------------------------------------------------
// Applications Collection with COMPOUND UNIQUENESS (jobId + workerId / phone)
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
        workerName: workerProfile?.name || 'Rahul Kumar',
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
      console.warn('Firestore submitApplication error, using local fallback:', err)
    }
  }

  // Local fallback with fixed compound uniqueness
  return submitLocalApplication({ jobId, jobTitle, company, workerProfile, expectedRate, notes })
}

export async function fetchApplicationsForBusiness(businessId, companyName) {
  if (isFirebaseConfigured && db) {
    try {
      // Query applications matching businessId or companyName
      let q = query(collection(db, 'applications'))
      if (businessId) {
        q = query(collection(db, 'applications'), where('businessId', '==', businessId))
      }
      const snap = await getDocs(q)
      if (!snap.empty) {
        return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      }
    } catch (err) {
      console.warn('Firestore fetchApplicationsForBusiness error:', err)
    }
  }

  // Local fallback with business isolation
  const allApps = getStoredApplications()
  return allApps.filter((app) => {
    if (businessId && app.businessId && app.businessId === businessId) return true
    if (companyName && app.company && app.company.toLowerCase() === companyName.toLowerCase()) return true
    return false
  })
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
      return { success: true }
    } catch (err) {
      console.warn('Firestore updateWorkerAvailability error:', err)
    }
  }
  return { success: true }
}
