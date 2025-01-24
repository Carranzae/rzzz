import React, { createContext, useContext, useState, useCallback } from 'react';
import { Report, MapContextType } from '../types';

const MapContext = createContext<MapContextType | undefined>(undefined);

export const MapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reports, setReports] = useState<Report[]>([]);

  const addReport = useCallback((report: Report) => {
    setReports(prev => [...prev, report]);
  }, []);

  const updateReport = useCallback((reportId: string, updates: Partial<Report>) => {
    setReports(prev => prev.map(report => 
      report.id === reportId ? { ...report, ...updates } : report
    ));
  }, []);

  const deleteReport = useCallback((reportId: string) => {
    setReports(prev => prev.filter(report => report.id !== reportId));
  }, []);

  const verifyReport = useCallback((reportId: string) => {
    setReports(prev => prev.map(report => 
      report.id === reportId 
        ? { 
            ...report, 
            verified: true, 
            verifications: (report.verifications || 0) + 1 
          } 
        : report
    ));
  }, []);

  const value = {
    reports,
    addReport,
    updateReport,
    deleteReport,
    verifyReport,
  };

  return (
    <MapContext.Provider value={value}>
      {children}
    </MapContext.Provider>
  );
};

export const useMapContext = () => {
  const context = useContext(MapContext);
  if (context === undefined) {
    throw new Error('useMapContext must be used within a MapProvider');
  }
  return context;
};
