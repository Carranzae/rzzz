import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Settings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: {
    enabled: boolean;
    alerts: boolean;
    reports: boolean;
    updates: boolean;
  };
  mapSettings: {
    showTraffic: boolean;
    showDangerZones: boolean;
    showIncidents: boolean;
    defaultZoom: number;
  };
  privacy: {
    shareLocation: boolean;
    anonymousReporting: boolean;
    dataCollection: boolean;
  };
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => Promise<void>;
  resetSettings: () => Promise<void>;
  isLoading: boolean;
}

const defaultSettings: Settings = {
  theme: 'system',
  language: 'es',
  notifications: {
    enabled: true,
    alerts: true,
    reports: true,
    updates: true,
  },
  mapSettings: {
    showTraffic: true,
    showDangerZones: true,
    showIncidents: true,
    defaultZoom: 15,
  },
  privacy: {
    shareLocation: true,
    anonymousReporting: false,
    dataCollection: true,
  },
};

const SETTINGS_STORAGE_KEY = '@app_settings';

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const storedSettings = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
      if (storedSettings) {
        setSettings(JSON.parse(storedSettings));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<Settings>) => {
    try {
      const updatedSettings = {
        ...settings,
        ...newSettings,
      };
      await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updatedSettings));
      setSettings(updatedSettings);
    } catch (error) {
      console.error('Error saving settings:', error);
      throw new Error('Failed to save settings');
    }
  };

  const resetSettings = async () => {
    try {
      await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(defaultSettings));
      setSettings(defaultSettings);
    } catch (error) {
      console.error('Error resetting settings:', error);
      throw new Error('Failed to reset settings');
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        resetSettings,
        isLoading,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
