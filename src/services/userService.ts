import axios from 'axios';
import { User } from '../types/auth';

const API_URL = 'https://api.example.com'; // Reemplazar con tu URL de API

class UserService {
  async getUserProfile(): Promise<User> {
    try {
      const response = await axios.get(`${API_URL}/users/profile`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    try {
      const response = await axios.patch(`${API_URL}/users/profile`, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateAvatar(file: FormData): Promise<{ avatarUrl: string }> {
    try {
      const response = await axios.post(`${API_URL}/users/avatar`, file, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      await axios.post(`${API_URL}/users/change-password`, {
        currentPassword,
        newPassword,
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteAccount(): Promise<void> {
    try {
      await axios.delete(`${API_URL}/users/account`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getUserStats(): Promise<{
    totalReports: number;
    verifiedReports: number;
    helpfulReports: number;
  }> {
    try {
      const response = await axios.get(`${API_URL}/users/stats`);
      return response.data;
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

export const userService = new UserService();
