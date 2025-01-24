import { LoginCredentials, RegisterData, User } from '../types/auth';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://api.example.com'; // Reemplazar con tu URL de API

class AuthService {
  private async setToken(token: string) {
    await AsyncStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  private async removeToken() {
    await AsyncStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  }

  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      const { user, token } = response.data;
      await this.setToken(token);
      return { user, token };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async register(data: RegisterData): Promise<{ user: User; token: string }> {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, data);
      const { user, token } = response.data;
      await this.setToken(token);
      return { user, token };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      await axios.post(`${API_URL}/auth/logout`);
      await this.removeToken();
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      await axios.post(`${API_URL}/auth/forgot-password`, { email });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      await axios.post(`${API_URL}/auth/reset-password`, {
        token,
        password: newPassword,
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async verifyEmail(token: string): Promise<void> {
    try {
      await axios.post(`${API_URL}/auth/verify-email`, { token });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return null;

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.get(`${API_URL}/auth/me`);
      return response.data;
    } catch (error) {
      await this.removeToken();
      return null;
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

export const authService = new AuthService();
