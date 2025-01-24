import axios from 'axios';
import { Notification, NotificationSettings } from '../types/notification';

const API_URL = 'https://api.example.com'; // Reemplazar con tu URL de API

class NotificationService {
  async getNotifications(): Promise<Notification[]> {
    try {
      const response = await axios.get(`${API_URL}/notifications`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getNotificationById(id: string): Promise<Notification> {
    try {
      const response = await axios.get(`${API_URL}/notifications/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async markAsRead(id: string): Promise<void> {
    try {
      await axios.patch(`${API_URL}/notifications/${id}/read`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async markAllAsRead(): Promise<void> {
    try {
      await axios.patch(`${API_URL}/notifications/read-all`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteNotification(id: string): Promise<void> {
    try {
      await axios.delete(`${API_URL}/notifications/${id}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getSettings(): Promise<NotificationSettings> {
    try {
      const response = await axios.get(`${API_URL}/notifications/settings`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateSettings(settings: Partial<NotificationSettings>): Promise<NotificationSettings> {
    try {
      const response = await axios.patch(`${API_URL}/notifications/settings`, settings);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async registerPushToken(token: string): Promise<void> {
    try {
      await axios.post(`${API_URL}/notifications/push-token`, { token });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async unregisterPushToken(token: string): Promise<void> {
    try {
      await axios.delete(`${API_URL}/notifications/push-token`, {
        data: { token },
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message;
      return new Error(message);
    }
    return error;
  }
}

export const notificationService = new NotificationService();
