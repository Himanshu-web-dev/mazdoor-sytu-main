// src/context/WorkerContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getActiveSession } from '../services/authService';
import { updateWorkerAvailability } from '../services/firestoreService';
import { submitJobApplication } from '../data/jobStore';

// Create the context
const WorkerContext = createContext(null);

// Hook for components to consume the context
export const useWorker = () => useContext(WorkerContext);

const WORKER_DATA_STORAGE_KEY = 'mazdoor_sytu_worker_state';

export const WorkerProvider = ({ children }) => {
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load worker data based on active session and local storage
  useEffect(() => {
    const session = getActiveSession();
    let savedWorkerState = null;
    try {
      const raw = localStorage.getItem(WORKER_DATA_STORAGE_KEY);
      if (raw) savedWorkerState = JSON.parse(raw);
    } catch {
      // ignore
    }

    const workerProfile = {
      uid: session?.uid || 'DEMO-WORKER',
      name: session?.name || 'Rahul Kumar',
      email: session?.email || 'rahul.kumar@mazdoorsytu.in',
      phone: session?.phone || '+91 98765 43210',
      trade: session?.trade || 'Electrician',
      experience: session?.experience || '5+ years',
      verified: true,
      availability: savedWorkerState?.availability || 'available',
      earnings: savedWorkerState?.earnings || { today: 1200, week: 5600, month: 24000, total: 124500 },
      rating: 4.8,
      pendingRequests: 2,
      wallet: savedWorkerState?.wallet || { balance: 8420 },
    };

    setWorker(workerProfile);
    setLoading(false);
  }, []);

  // Action to change availability status
  const setAvailability = async (status) => {
    setWorker((prev) => {
      const updated = { ...prev, availability: status };
      try {
        localStorage.setItem(WORKER_DATA_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });

    if (worker?.uid) {
      await updateWorkerAvailability(worker.uid, status);
    }
    return true;
  };

  // Real job application action
  const applyJob = async (jobId, notes = '') => {
    if (!worker) return { success: false, error: 'No active worker' };
    return submitJobApplication(jobId, {
      workerId: worker.uid,
      workerName: worker.name,
      workerPhone: worker.phone,
      workerTrade: worker.trade,
      experience: worker.experience,
      notes,
    });
  };

  const acceptJob = async (jobId) => {
    // Updates worker job log
    setWorker((prev) => ({
      ...prev,
      pendingRequests: Math.max(0, (prev?.pendingRequests || 1) - 1),
    }));
    return { success: true };
  };

  const rejectJob = async (jobId) => {
    setWorker((prev) => ({
      ...prev,
      pendingRequests: Math.max(0, (prev?.pendingRequests || 1) - 1),
    }));
    return { success: true };
  };

  const value = {
    worker,
    loading,
    setAvailability,
    applyJob,
    acceptJob,
    rejectJob,
  };

  return <WorkerContext.Provider value={value}>{children}</WorkerContext.Provider>;
};
