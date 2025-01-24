import axios from 'axios';
import { Report } from '../types';

const API_URL = 'https://api.example.com'; // Reemplazar con tu URL de API

class ReportService {
  async getReports(): Promise<Report[]> {
    try {
      const response = await axios.get(`${API_URL}/reports`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getReportById(id: string): Promise<Report> {
    try {
      const response = await axios.get(`${API_URL}/reports/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createReport(report: Omit<Report, 'id'>): Promise<Report> {
    try {
      const response = await axios.post(`${API_URL}/reports`, report);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateReport(id: string, updates: Partial<Report>): Promise<Report> {
    try {
      const response = await axios.patch(`${API_URL}/reports/${id}`, updates);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteReport(id: string): Promise<void> {
    try {
      await axios.delete(`${API_URL}/reports/${id}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async verifyReport(id: string): Promise<Report> {
    try {
      const response = await axios.post(`${API_URL}/reports/${id}/verify`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getNearbyReports(latitude: number, longitude: number, radius: number): Promise<Report[]> {
    try {
      const response = await axios.get(`${API_URL}/reports/nearby`, {
        params: { latitude, longitude, radius },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getUserReports(userId: string): Promise<Report[]> {
    try {
      const response = await axios.get(`${API_URL}/reports/user/${userId}`);
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

export const reportService = new ReportService();
