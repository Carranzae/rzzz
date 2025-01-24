import { Report } from '../types';
import { getRecords, insertRecord, updateRecord, deleteRecord, executeQuery } from '../database/dbUtils';

class LocalReportService {
  async getReports(): Promise<Report[]> {
    try {
      return await getRecords('reports');
    } catch (error) {
      console.error('Error fetching reports:', error);
      throw error;
    }
  }

  async getReportById(id: string): Promise<Report | null> {
    try {
      const reports = await getRecords('reports', 'id = ?', [id]);
      return reports[0] || null;
    } catch (error) {
      console.error('Error fetching report:', error);
      throw error;
    }
  }

  async createReport(report: Omit<Report, 'id'>): Promise<Report> {
    try {
      const result = await insertRecord('reports', {
        ...report,
        created_at: new Date().toISOString()
      });
      return {
        id: result.insertId,
        ...report
      } as Report;
    } catch (error) {
      console.error('Error creating report:', error);
      throw error;
    }
  }

  async updateReport(id: string, updates: Partial<Report>): Promise<void> {
    try {
      await updateRecord('reports', updates, 'id = ?', [id]);
    } catch (error) {
      console.error('Error updating report:', error);
      throw error;
    }
  }

  async deleteReport(id: string): Promise<void> {
    try {
      await deleteRecord('reports', 'id = ?', [id]);
    } catch (error) {
      console.error('Error deleting report:', error);
      throw error;
    }
  }

  async verifyReport(id: string): Promise<void> {
    try {
      await updateRecord('reports', { verified: true, verified_at: new Date().toISOString() }, 'id = ?', [id]);
    } catch (error) {
      console.error('Error verifying report:', error);
      throw error;
    }
  }

  async getReportsByUser(userId: string): Promise<Report[]> {
    try {
      return await getRecords('reports', 'user_id = ?', [userId]);
    } catch (error) {
      console.error('Error fetching user reports:', error);
      throw error;
    }
  }
}

export const localReportService = new LocalReportService();
