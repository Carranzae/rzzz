export interface DangerZone {
  id: string;
  center: [number, number];
  radius: number;
  type: 'high' | 'medium' | 'low';
  description: string;
  reports: number;
}

export interface Incident {
  id: string;
  position: [number, number];
  type: 'robbery' | 'assault' | 'suspicious' | 'other';
  timestamp: number;
  description: string;
  verified: boolean;
}
