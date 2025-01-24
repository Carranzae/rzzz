import React, { createContext, useState, useContext, useEffect, ReactElement, JSXElementConstructor } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types/auth';
import { localUserService } from '../services/localUserService';

interface AuthContextData {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({
  user: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
  updateUser: async () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredUser();
  }, []);

  const loadStoredUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('@AuthData:user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        const currentUser = await localUserService.getUserProfile(userData.id);
        if (currentUser) {
          setUser(currentUser);
        }
      }
    } catch (error) {
      console.error('Error loading stored user:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const user = await localUserService.getUserByEmail(email);
      
      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      // In a real app, you should hash the password and compare with the stored hash
      if (user.password !== password) {
        throw new Error('Contraseña incorrecta');
      }

      // Update last login
      await localUserService.updateProfile(user.id, {
        last_login: new Date().toISOString()
      });

      setUser(user);
      await AsyncStorage.setItem('@AuthData:user', JSON.stringify(user));
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('@AuthData:user');
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      if (!user) throw new Error('No user logged in');
      await localUserService.updateProfile(user.id, userData);
      const updatedUser = await localUserService.getUserProfile(user.id);
      if (updatedUser) {
        setUser(updatedUser);
        await AsyncStorage.setItem('@AuthData:user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
