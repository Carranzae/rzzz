import React, { createContext, useContext, useState, useEffect, ReactElement, JSXElementConstructor } from 'react';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { Notification, NotificationSettings, NotificationType } from '../types/notification';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  notificationSettings: NotificationSettings;
  pushToken: string | null;
  loading: boolean;
  error: string | null;
  registerForPushNotifications: () => Promise<void>;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  clearAllNotifications: () => Promise<void>;
}

const defaultSettings: NotificationSettings = {
  enabled: true,
  pushNotifications: true,
  emailNotifications: true,
  notifyNewReports: true,
  notifyReportUpdates: true,
  notifyComments: true,
  notifyVerifications: true,
  quietHoursEnabled: false,
  quietHoursStart: '22:00',
  quietHoursEnd: '07:00',
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: React.ReactNode }): ReactElement<any, string | JSXElementConstructor<any>> => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(defaultSettings);
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadNotificationSettings();
    registerForPushNotifications();
    configureNotifications();
  }, []);

  const loadNotificationSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('@notification_settings');
      if (savedSettings) {
        setNotificationSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
      }
    } catch (err) {
      setError('Error loading notification settings');
    }
  };

  const configureNotifications = () => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });
  };

  const registerForPushNotifications = async () => {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        setError('Failed to get push token for push notification!');
        return;
      }

      const token = (await Notifications.getExpoPushTokenAsync()).data;
      setPushToken(token);

      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }
    } catch (err) {
      setError('Error registering for push notifications');
    }
  };

  const updateNotificationSettings = async (settings: Partial<NotificationSettings>) => {
    try {
      const newSettings = { ...notificationSettings, ...settings };
      setNotificationSettings(newSettings);
      await AsyncStorage.setItem('@notification_settings', JSON.stringify(newSettings));
    } catch (err) {
      setError('Error updating notification settings');
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      setNotifications(notifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      ));
    } catch (err) {
      setError('Error marking notification as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      setNotifications(notifications.map(notification => ({ ...notification, read: true })));
    } catch (err) {
      setError('Error marking all notifications as read');
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      setNotifications(notifications.filter(notification => notification.id !== notificationId));
    } catch (err) {
      setError('Error deleting notification');
    }
  };

  const clearAllNotifications = async () => {
    try {
      setNotifications([]);
    } catch (err) {
      setError('Error clearing notifications');
    }
  };

  const unreadCount = notifications.filter(notification => !notification.read).length;

  const value = {
    notifications,
    unreadCount,
    notificationSettings,
    pushToken,
    loading,
    error,
    registerForPushNotifications,
    updateNotificationSettings,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
