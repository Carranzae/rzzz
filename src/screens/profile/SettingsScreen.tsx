import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { ProfileStackParamList } from '../../types/navigation';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { useNotifications } from '../../context/NotificationContext';

type SettingsScreenNavigationProp = NativeStackNavigationProp<ProfileStackParamList, 'Configuracion'>;

const SettingsScreen = () => {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const { logout } = useAuth();
  const { settings, updateSettings } = useSettings();
  const { notificationSettings, updateNotificationSettings } = useNotifications();

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: () => logout(),
        },
      ]
    );
  };

  const toggleSetting = async (key: string, value: boolean) => {
    try {
      await updateSettings({ [key]: value });
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar la configuración');
    }
  };

  const toggleNotification = async (key: string, value: boolean) => {
    try {
      await updateNotificationSettings({ [key]: value });
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar la configuración de notificaciones');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Configuración</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Tema Oscuro</Text>
              <Text style={styles.settingDescription}>
                Cambiar al tema oscuro de la aplicación
              </Text>
            </View>
            <Switch
              value={settings.darkMode}
              onValueChange={(value) => toggleSetting('darkMode', value)}
              trackColor={{ false: '#ddd', true: '#007AFF' }}
              thumbColor={Platform.OS === 'ios' ? '#fff' : settings.darkMode ? '#fff' : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Ubicación Automática</Text>
              <Text style={styles.settingDescription}>
                Detectar ubicación al crear reportes
              </Text>
            </View>
            <Switch
              value={settings.autoLocation}
              onValueChange={(value) => toggleSetting('autoLocation', value)}
              trackColor={{ false: '#ddd', true: '#007AFF' }}
              thumbColor={Platform.OS === 'ios' ? '#fff' : settings.autoLocation ? '#fff' : '#f4f3f4'}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notificaciones</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Nuevas Verificaciones</Text>
              <Text style={styles.settingDescription}>
                Cuando alguien verifica tus reportes
              </Text>
            </View>
            <Switch
              value={notificationSettings.newVerifications}
              onValueChange={(value) => toggleNotification('newVerifications', value)}
              trackColor={{ false: '#ddd', true: '#007AFF' }}
              thumbColor={Platform.OS === 'ios' ? '#fff' : notificationSettings.newVerifications ? '#fff' : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Reportes Cercanos</Text>
              <Text style={styles.settingDescription}>
                Nuevos reportes en tu área
              </Text>
            </View>
            <Switch
              value={notificationSettings.nearbyReports}
              onValueChange={(value) => toggleNotification('nearbyReports', value)}
              trackColor={{ false: '#ddd', true: '#007AFF' }}
              thumbColor={Platform.OS === 'ios' ? '#fff' : notificationSettings.nearbyReports ? '#fff' : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Actualizaciones de Estado</Text>
              <Text style={styles.settingDescription}>
                Cambios en el estado de tus reportes
              </Text>
            </View>
            <Switch
              value={notificationSettings.statusUpdates}
              onValueChange={(value) => toggleNotification('statusUpdates', value)}
              trackColor={{ false: '#ddd', true: '#007AFF' }}
              thumbColor={Platform.OS === 'ios' ? '#fff' : notificationSettings.statusUpdates ? '#fff' : '#f4f3f4'}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacidad</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Perfil Público</Text>
              <Text style={styles.settingDescription}>
                Permitir que otros vean tu perfil
              </Text>
            </View>
            <Switch
              value={settings.publicProfile}
              onValueChange={(value) => toggleSetting('publicProfile', value)}
              trackColor={{ false: '#ddd', true: '#007AFF' }}
              thumbColor={Platform.OS === 'ios' ? '#fff' : settings.publicProfile ? '#fff' : '#f4f3f4'}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cuenta</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('EditarPerfil')}
          >
            <Text style={styles.buttonText}>Editar Perfil</Text>
            <Ionicons name="chevron-forward" size={20} color="#007AFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.dangerButton]}
            onPress={handleLogout}
          >
            <Text style={[styles.buttonText, styles.dangerText]}>Cerrar Sesión</Text>
            <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginRight: 40,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginBottom: 8,
  },
  buttonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  dangerButton: {
    marginTop: 8,
  },
  dangerText: {
    color: '#FF3B30',
  },
});

export default SettingsScreen;
