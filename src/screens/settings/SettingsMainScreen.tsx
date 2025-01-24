import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Switch,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { SettingsStackParamList } from '../../types/navigation';
import { useSettings } from '../../context/SettingsContext';
import { useAuth } from '../../context/AuthContext';

type SettingsMainScreenNavigationProp = NativeStackNavigationProp<
  SettingsStackParamList,
  'ConfiguracionPrincipal'
>;

const SettingsMainScreen = () => {
  const navigation = useNavigation<SettingsMainScreenNavigationProp>();
  const { settings, updateSettings } = useSettings();
  const { logout } = useAuth();

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

  const renderSettingItem = (
    icon: string,
    title: string,
    onPress: () => void,
    showArrow = true
  ) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingContent}>
        <Ionicons name={icon as any} size={24} color="#007AFF" />
        <Text style={styles.settingText}>{title}</Text>
      </View>
      {showArrow && <Ionicons name="chevron-forward" size={20} color="#666" />}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Configuración</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cuenta</Text>
          {renderSettingItem(
            'person-outline',
            'Editar Perfil',
            () => navigation.navigate('EditarPerfil')
          )}
          {renderSettingItem(
            'shield-outline',
            'Privacidad',
            () => navigation.navigate('ConfiguracionPrivacidad')
          )}
          {renderSettingItem(
            'notifications-outline',
            'Notificaciones',
            () => navigation.navigate('ConfiguracionNotificaciones')
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Apariencia</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Ionicons name="moon-outline" size={24} color="#007AFF" />
              <Text style={styles.settingText}>Tema Oscuro</Text>
            </View>
            <Switch
              value={settings.darkMode}
              onValueChange={(value) => updateSettings({ darkMode: value })}
              trackColor={{ false: '#ddd', true: '#007AFF' }}
              thumbColor={Platform.OS === 'ios' ? '#fff' : settings.darkMode ? '#fff' : '#f4f3f4'}
            />
          </View>
          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Ionicons name="text-outline" size={24} color="#007AFF" />
              <Text style={styles.settingText}>Tamaño de Fuente</Text>
            </View>
            <Text style={styles.settingValue}>{settings.fontSize || 'Normal'}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Datos y Almacenamiento</Text>
          {renderSettingItem(
            'cloud-download-outline',
            'Descargar Datos',
            () => Alert.alert('Próximamente', 'Esta función estará disponible pronto')
          )}
          {renderSettingItem(
            'trash-outline',
            'Limpiar Caché',
            () =>
              Alert.alert(
                'Limpiar Caché',
                '¿Estás seguro de que quieres limpiar la caché de la aplicación?',
                [
                  {
                    text: 'Cancelar',
                    style: 'cancel',
                  },
                  {
                    text: 'Limpiar',
                    style: 'destructive',
                    onPress: () => {
                      // Implementar limpieza de caché
                    },
                  },
                ]
              )
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ayuda y Soporte</Text>
          {renderSettingItem(
            'help-circle-outline',
            'Centro de Ayuda',
            () => navigation.navigate('Ayuda')
          )}
          {renderSettingItem(
            'document-text-outline',
            'Términos y Condiciones',
            () => navigation.navigate('Terminos')
          )}
          {renderSettingItem(
            'shield-checkmark-outline',
            'Política de Privacidad',
            () => navigation.navigate('Privacidad')
          )}
          {renderSettingItem(
            'information-circle-outline',
            'Acerca de',
            () => navigation.navigate('AcercaDe')
          )}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
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
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  section: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    fontSize: 16,
    marginLeft: 12,
  },
  settingValue: {
    fontSize: 16,
    color: '#666',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginVertical: 24,
  },
  logoutText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default SettingsMainScreen;
