import { getDBConnection } from './database';
import { initDatabase } from './database';
import { localUserService } from '../services/localUserService';
import { localReportService } from '../services/localReportService';
import { User } from '../types/auth';
import { Report } from '../types/report';
import * as SQLite from 'expo-sqlite';

export const seedDatabase = async () => {
  try {
    console.log('Seeding database...');

    // Create sample users
    const user1 = await localUserService.createUser({
      username: 'admin',
      email: 'admin@example.com',
      password: 'admin123', // In production, use hashed passwords
      role: 'admin',
      avatar_url: 'https://example.com/avatar1.jpg',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    const user2 = await localUserService.createUser({
      username: 'user',
      email: 'user@example.com',
      password: 'user123',
      role: 'user',
      avatar_url: 'https://example.com/avatar2.jpg',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    // Create sample reports
    await localReportService.createReport({
      title: 'Primer Reporte',
      description: 'Este es un reporte de prueba',
      status: 'pending',
      priority: 'high',
      user_id: user1.id,
      assigned_to: user2.id,
      verified: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    await localReportService.createReport({
      title: 'Segundo Reporte',
      description: 'Este es otro reporte de prueba',
      status: 'active',
      priority: 'medium',
      user_id: user2.id,
      assigned_to: user1.id,
      verified: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};

// Call this function to reset and re-seed the database
export const resetAndSeedDatabase = async () => {
  const db = getDBConnection();
  
  try {
    // Drop existing tables
    await new Promise<void>((resolve, reject) => {
      db.transaction((tx: SQLite.SQLTransaction) => {
        tx.executeSql('DROP TABLE IF EXISTS reports');
        tx.executeSql('DROP TABLE IF EXISTS users', [], 
          (_: any, __: any) => resolve(),
          (_: any, error: any) => {
            reject(error);
            return false;
          }
        );
      });
    });

    // Reinitialize database
    await initDatabase();

    // Seed with sample data
    await seedDatabase();
    
    console.log('Database reset and seeded successfully');
  } catch (error) {
    console.error('Error resetting database:', error);
    throw error;
  }
};
