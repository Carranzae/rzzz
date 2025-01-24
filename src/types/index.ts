export interface Location {
  latitude: number;
  longitude: number;
}

export interface Report {
  user_id: string;
  id: string;
  title: string;
  description: string;
  location: Location;
  type: 'police' | 'accident' | 'traffic' | 'construction' | 'flood' | 'danger' | 'event';
  timestamp: number;
  userId: string;
  verified: boolean;
  verifications: number;
}

export interface MapContextType {
  reports: Report[];
  addReport: (report: Report) => void;
  updateReport: (reportId: string, updates: Partial<Report>) => void;
  deleteReport: (reportId: string) => void;
  verifyReport: (reportId: string) => void;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Main: undefined;
};
