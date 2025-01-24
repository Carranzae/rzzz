import { User } from '../types/auth';
import { getRecords, insertRecord, updateRecord, deleteRecord } from '../database/dbUtils';

class LocalUserService {
  async getUserProfile(userId: string): Promise<User | null> {
    try {
      const users = await getRecords('users', 'id = ?', [userId]);
      return users[0] || null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }

  async updateProfile(userId: string, data: Partial<User>): Promise<void> {
    try {
      await updateRecord('users', data, 'id = ?', [userId]);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  async createUser(userData: Omit<User, 'id'>): Promise<User> {
    try {
      const result = await insertRecord('users', {
        ...userData,
        created_at: new Date().toISOString()
      });
      return {
        id: result.insertId,
        ...userData
      } as User;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      // First delete all related reports
      await deleteRecord('reports', 'user_id = ?', [userId]);
      // Then delete the user
      await deleteRecord('users', 'id = ?', [userId]);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  async updatePassword(userId: string, hashedPassword: string): Promise<void> {
    try {
      await updateRecord('users', { password: hashedPassword }, 'id = ?', [userId]);
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const users = await getRecords('users', 'email = ?', [email]);
      return users[0] || null;
    } catch (error) {
      console.error('Error fetching user by email:', error);
      throw error;
    }
  }
}

export const localUserService = new LocalUserService();
