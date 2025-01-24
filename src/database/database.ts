import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

let db: SQLite.WebSQLDatabase;

export const getDBConnection = () => {
  if (!db) {
    if (Platform.OS === "web") {
      db = {
        transaction: () => {
          throw new Error("WebSQL is not supported on web platform");
        },
        closeAsync: async () => {},
        deleteAsync: async () => {},
        exec: async () => [],
        readTransaction: () => {
          throw new Error("WebSQL is not supported on web platform");
        },
        version: "1.0"
      } as SQLite.WebSQLDatabase;
    } else {
      db = SQLite.openDatabase('mobile_app.db');
    }
  }
  return db;
};

export const closeDatabase = async () => {
  if (db) {
    try {
      await db.closeAsync();
      db = undefined as unknown as SQLite.WebSQLDatabase;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error closing database:', error.message);
      }
    }
  }
};

export const initDatabase = async () => {
  return new Promise<void>((resolve, reject) => {
    const db = getDBConnection();
    
    db.transaction(
      (tx: SQLite.SQLTransaction) => {
        // Create users table
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            role TEXT NOT NULL,
            avatar_url TEXT,
            last_login TEXT,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
          );`
        );

        // Create reports table
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS reports (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            status TEXT NOT NULL,
            priority TEXT NOT NULL,
            user_id INTEGER NOT NULL,
            assigned_to INTEGER,
            verified BOOLEAN DEFAULT 0,
            verified_at TEXT,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (assigned_to) REFERENCES users (id)
          );`
        );
      },
      (error: SQLite.SQLError) => {
        console.error('Error creating tables:', error);
        reject(error);
      },
      () => {
        console.log('Database initialized successfully');
        resolve();
      }
    );
  });
};
