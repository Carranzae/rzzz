export type NotificationType = 
  | 'NEW_REPORT'
  | 'REPORT_UPDATE'
  | 'REPORT_VERIFIED'
  | 'REPORT_COMMENT'
  | 'SYSTEM_MESSAGE';

export interface NotificationData {
  reportId?: string;
  userId?: string;
  commentId?: string;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: NotificationData;
  read: boolean;
  createdAt: Date;
  userId: string;
}

export interface NotificationSettings {
  enabled: boolean;
  pushNotifications: boolean;
  emailNotifications: boolean;
  notifyNewReports: boolean;
  notifyReportUpdates: boolean;
  notifyComments: boolean;
  notifyVerifications: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
}

export interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  settings: NotificationSettings;
  loading: boolean;
  error: string | null;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  updateSettings: (settings: Partial<NotificationSettings>) => Promise<void>;
  refreshNotifications: () => Promise<void>;
}
