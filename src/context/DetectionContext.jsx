import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchHistory, fetchStats } from '../services/api';

const DetectionContext = createContext();

export const DetectionProvider = ({ children }) => {
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({ total_scans: 0, ai_count: 0, real_count: 0, avg_ai_score: 0 });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [historyRes, statsRes] = await Promise.all([
        fetchHistory().catch(() => ({ history: [] })),
        fetchStats().catch(() => ({ total_scans: 0, ai_count: 0, real_count: 0, avg_ai_score: 0 }))
      ]);
      setHistory(historyRes.history || []);
      setStats(statsRes);
    } catch (err) {
      console.error('Failed to load detection state', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const addDetectionRecord = (record) => {
    setHistory((prev) => [record, ...prev]);
    setStats((prev) => {
      const newTotal = prev.total_scans + 1;
      const isAi = record.result === 'AI Generated Content';
      const newAi = prev.ai_count + (isAi ? 1 : 0);
      const newReal = prev.real_count + (isAi ? 0 : 1);
      const newAvg = Math.round(((prev.avg_ai_score * prev.total_scans + record.ai_percent) / newTotal) * 10) / 10;
      return {
        total_scans: newTotal,
        ai_count: newAi,
        real_count: newReal,
        avg_ai_score: newAvg
      };
    });
  };

  return (
    <DetectionContext.Provider value={{ history, stats, loading, loadData, addDetectionRecord, toast, showToast }}>
      {children}
    </DetectionContext.Provider>
  );
};

export const useDetection = () => useContext(DetectionContext);
