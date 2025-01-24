export interface Settings {
  // Tema y apariencia
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  language: string;
  
  // Notificaciones
  notifications: NotificationSettings;
  
  // Ubicación y mapa
  defaultLocation: {
    latitude: number;
    longitude: number;
  };
  autoLocation: boolean;
  mapType: 'standard' | 'satellite' | 'hybrid';
  
  // Privacidad
  publicProfile: boolean;
  showLocation: boolean;
  saveActivity: boolean;
  publicStats: boolean;
  
  // Datos y almacenamiento
  autoSave: boolean;
  dataUsage: {
    saveImages: boolean;
    saveReports: boolean;
    maxStorageSize: number;
  };
}

export interface NotificationSettings {
  enabled: boolean;
  pushNotifications: boolean;
  emailNotifications: boolean;
  notifyNewReports: boolean;
  notifyReportUpdates: boolean;
  notifyComments: boolean;
  notifyVerifications: boolean;
  newVerifications: boolean;
  nearbyReports: boolean;
  statusUpdates: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
}

export interface SettingsContextType {
  settings: Settings;
  updateSettings: (settings: Partial<Settings>) => Promise<void>;
  resetSettings: () => Promise<void>;
  loading: boolean;
  error: string | null;
}
