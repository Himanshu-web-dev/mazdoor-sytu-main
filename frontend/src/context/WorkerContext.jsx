// src/context/WorkerContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getActiveSession } from '../services/authService';
import { workerApi, jobApi, walletApi, bookingApi } from '../services/api';

const WorkerContext = createContext(null);

export const useWorker = () => useContext(WorkerContext);

export const WorkerProvider = ({ children }) => {
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load worker data based on active session
  useEffect(() => {
    const loadWorker = async () => {
      const session = getActiveSession();
      if (!session || session.role !== 'worker') {
        setWorker(null);
        setLoading(false);
        return;
      }

      try {
        // Fetch worker profile from API
        let profile = null;
        try {
          const res = await workerApi.getProfile(session.uid);
          if (res?.data) profile = res.data;
        } catch {
          // If network / API error, construct from active session
        }

        let walletBalance = 0;
        try {
          const wRes = await walletApi.getWallet(session.uid);
          if (wRes?.data) walletBalance = wRes.data.balance || 0;
        } catch {
          // ignore
        }

        let pendingCount = 0;
        try {
          const bRes = await bookingApi.getMyBookings('worker');
          if (Array.isArray(bRes?.data)) {
            pendingCount = bRes.data.filter((b) => b.status === 'pending' || b.status === 'confirmed').length;
          }
        } catch {
          // ignore
        }

        setWorker({
          uid: session.uid,
          name: profile?.name || session.name || 'Worker',
          email: session.email || '',
          phone: profile?.phone || session.phone || '',
          trade: profile?.trade || session.trade || 'General Technician',
          experience: profile?.experience || session.experience || 'Experienced',
          verified: profile?.kycStatus === 'Verified' || false,
          availability: profile?.availability || 'available',
          earnings: profile?.earnings || { today: 0, week: 0, month: 0, total: 0 },
          rating: profile?.rating || 5.0,
          pendingRequests: pendingCount,
          wallet: { balance: walletBalance },
        });
      } catch (err) {
        console.error('Failed to load worker profile:', err);
      } finally {
        setLoading(false);
      }
    };

    loadWorker();
  }, []);

  // Action to change availability status
  const setAvailability = async (status) => {
    setWorker((prev) => (prev ? { ...prev, availability: status } : null));

    if (worker?.uid) {
      try {
        await workerApi.setAvailability(status);
      } catch (err) {
        console.warn('Could not sync availability status to backend:', err);
      }
    }
    return true;
  };

  // Job application action
  const applyJob = async (jobId, notes = '') => {
    if (!worker) return { success: false, error: 'No active worker session' };
    try {
      const res = await jobApi.applyJob({
        jobId,
        workerId: worker.uid,
        workerName: worker.name,
        workerPhone: worker.phone,
        workerTrade: worker.trade,
        experience: worker.experience,
        notes,
      });
      return { success: true, application: res?.data };
    } catch (err) {
      return { success: false, error: err.message || 'Failed to submit application' };
    }
  };

  const acceptJob = async (jobId) => {
    setWorker((prev) => (prev ? {
      ...prev,
      pendingRequests: Math.max(0, (prev?.pendingRequests || 1) - 1),
    } : null));
    return { success: true };
  };

  const rejectJob = async (jobId) => {
    setWorker((prev) => (prev ? {
      ...prev,
      pendingRequests: Math.max(0, (prev?.pendingRequests || 1) - 1),
    } : null));
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
