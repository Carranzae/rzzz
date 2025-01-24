export type ReportType = 
  'INCIDENT'
  | 'HAZARD'
  | 'EMERGENCY'
  | 'INFO'
  | 'MAINTENANCE'
  | 'SUGGESTION'
  | 'OTHER';

export type ReportStatus = 
  'pending'
  | 'active'
  | 'verified'
  | 'resolved'
  | 'archived'
  | 'rejected';

export type ReportPriority = 'low' | 'medium' | 'high';

export interface Report {
  id: number;
  title: string;
  description: string;
  type: ReportType;
  status: ReportStatus;
  priority: ReportPriority;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  images?: string[];
  user_id: number;
  assigned_to?: number;
  verified: boolean;
  verified_at?: string;
  created_at: string;
  updated_at: string;
  comments: number;
}

export interface Verification {
  id: string;
  userId: string;
  reportId: string;
  status: 'CONFIRMED' | 'DISPUTED';
  comment?: string;
  timestamp: Date;
}

export interface ReportStatusStyles {
  PENDING: { backgroundColor: string; color: string };
  ACTIVE: { backgroundColor: string; color: string };
  VERIFIED: { backgroundColor: string; color: string };
  RESOLVED: { backgroundColor: string; color: string };
  ARCHIVED: { backgroundColor: string; color: string };
  REJECTED: { backgroundColor: string; color: string };
}
