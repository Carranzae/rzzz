import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';

const SettingItem = ({ icon, title, type = 'toggle', value, onPress, onValueChange, subtitle }) => (
  <View style={styles.settingItem}>
    <View style={styles.settingLeft}>
      <Ionicons name={icon} size={24} color="#007AFF" />
      <Text style={styles.settingTitle}>{title}</Text>
      {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
    </View>
    {type === 'toggle' ? (
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={value ? '#007AFF' : '#f4f3f4'}
      />
    ) : (
      <Ionicons name="chevron-forward" size={20} color="#999" />
    )}
  </View>
);

const SettingsScreen = ({ navigation }) => {
  const { logout } = useAuth();
  const [settings, setSettings] = useState({
    notifications: true,
    locationTracking: true,
    darkMode: false,
    emergencyAlerts: true,
    autoSync: true,
    biometricAuth: false,
    soundEffects: true,
  });

  const [selectedLanguage, setSelectedLanguage] = useState('Español');

  const updateSetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleUnlinkAccount = () => {
    Alert.alert(
      'Desvincular Cuenta',
      '¿Estás seguro que deseas desvincular tu cuenta? Esta acción no se puede deshacer.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Desvincular',
          style: 'destructive',
          onPress: () => {
            // Aquí iría la lógica para desvincular la cuenta
            logout();
          },
        },
      ]
    );
  };

  const languages = ['Español', 'English', 'Português'];

  const showLanguageSelector = () => {
    Alert.alert(
      'Seleccionar Idioma',
      '',
      languages.map(lang => ({
        text: lang,
        onPress: () => setSelectedLanguage(lang),
      }))
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Configuración</Text>
        </View>

        {/* Device Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dispositivo</Text>
          <View style={styles.settingsContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('DevicePairing')}>
              <SettingItem
                icon="bluetooth"
                title="Administrar Dispositivos"
                type="link"
              />
            </TouchableOpacity>
            <SettingItem
              icon="sync"
              title="Sincronización Automática"
              value={settings.autoSync}
              onValueChange={(value) => updateSetting('autoSync', value)}
            />
            <SettingItem
              icon="finger-print"
              title="Autenticación Biométrica"
              value={settings.biometricAuth}
              onValueChange={(value) => updateSetting('biometricAuth', value)}
            />
          </View>
        </View>

        {/* Language and Region */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Idioma y Región</Text>
          <View style={styles.settingsContainer}>
            <TouchableOpacity onPress={showLanguageSelector}>
              <SettingItem
                icon="language"
                title="Idioma"
                type="link"
                subtitle={selectedLanguage}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notificaciones</Text>
          <View style={styles.settingsContainer}>
            <SettingItem
              icon="notifications"
              title="Notificaciones Push"
              value={settings.notifications}
              onValueChange={(value) => updateSetting('notifications', value)}
            />
            <SettingItem
              icon="warning"
              title="Alertas de Emergencia"
              value={settings.emergencyAlerts}
              onValueChange={(value) => updateSetting('emergencyAlerts', value)}
            />
            <SettingItem
              icon="volume-high"
              title="Efectos de Sonido"
              value={settings.soundEffects}
              onValueChange={(value) => updateSetting('soundEffects', value)}
            />
          </View>
        </View>

        {/* Privacy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacidad</Text>
          <View style={styles.settingsContainer}>
            <SettingItem
              icon="location"
              title="Rastreo de Ubicación"
              value={settings.locationTracking}
              onValueChange={(value) => updateSetting('locationTracking', value)}
            />
            <TouchableOpacity>
              <SettingItem
                icon="shield-checkmark"
                title="Permisos"
                type="link"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Legal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>
          <View style={styles.settingsContainer}>
            <TouchableOpacity>
              <SettingItem
                icon="document-text"
                title="Términos y Condiciones"
                type="link"
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <SettingItem
                icon="shield"
                title="Política de Privacidad"
                type="link"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Account Actions */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.unlinkButton}
            onPress={handleUnlinkAccount}
          >
            <Text style={styles.unlinkButtonText}>Desvincular Cuenta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Floating Home Button */}
      <TouchableOpacity 
        style={styles.floatingButton}
        onPress={() => navigation.navigate('Dashboard')}
      >
        <Ionicons name="home" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  settingsContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingTitle: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#666',
    marginLeft: 15,
  },
  unlinkButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  unlinkButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default SettingsScreen;
