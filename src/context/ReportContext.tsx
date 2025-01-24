import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Report {
  id: string;
  type: 'robbery' | 'assault' | 'suspicious' | 'other';
  title: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
  };
  timestamp: string;
  verified: boolean;
}

interface ReportContextType {
  reports: Report[];
  addReport: (report: Omit<Report, 'id' | 'timestamp' | 'verified'>) => void;
  updateReport: (id: string, report: Partial<Report>) => void;
  deleteReport: (id: string) => void;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

export const ReportProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reports, setReports] = useState<Report[]>([]);

  // Aquí podrías cargar los reportes desde una API o almacenamiento local
  useEffect(() => {
    // TODO: Implementar carga de reportes
  }, []);

  const addReport = (newReport: Omit<Report, 'id' | 'timestamp' | 'verified'>) => {
    const report: Report = {
      ...newReport,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      verified: false,
    };
    setReports(prev => [...prev, report]);
  };

  const updateReport = (id: string, updatedReport: Partial<Report>) => {
    setReports(prev =>
      prev.map(report =>
        report.id === id ? { ...report, ...updatedReport } : report
      )
    );
  };

  const deleteReport = (id: string) => {
    setReports(prev => prev.filter(report => report.id !== id));
  };

  return (
    <ReportContext.Provider
      value={{
        reports,
        addReport,
        updateReport,
        deleteReport,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};

export const useReports = () => {
  const context = useContext(ReportContext);
  if (context === undefined) {
    throw new Error('useReports must be used within a ReportProvider');
  }
  return context;
};
