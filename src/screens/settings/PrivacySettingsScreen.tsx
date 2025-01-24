import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { SettingsStackParamList } from '../../types/navigation';
import { useSettings } from '../../context/SettingsContext';

type PrivacySettingsScreenNavigationProp = NativeStackNavigationProp<
  SettingsStackParamList,
  'ConfiguracionPrivacidad'
>;

const PrivacySettingsScreen = () => {
  const navigation = useNavigation<PrivacySettingsScreenNavigationProp>();
  const { settings, updateSettings } = useSettings();

  const handlePrivacyToggle = async (key: string, value: boolean) => {
    try {
      await updateSettings({ [key]: value });
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar la configuración de privacidad');
    }
  };

  const handleDataDeletion = () => {
    Alert.alert(
      'Eliminar Datos',
      '¿Estás seguro de que quieres eliminar todos tus datos? Esta acción no se puede deshacer.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            // Implementar eliminación de datos
            Alert.alert('Datos Eliminados', 'Todos tus datos han sido eliminados');
          },
        },
      ]
    );
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
        <Text style={styles.title}>Privacidad</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Visibilidad del Perfil</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Perfil Público</Text>
              <Text style={styles.settingDescription}>
                Permitir que otros usuarios vean tu perfil
              </Text>
            </View>
            <Switch
              value={settings.publicProfile}
              onValueChange={(value) => handlePrivacyToggle('publicProfile', value)}
              trackColor={{ false: '#ddd', true: '#007AFF' }}
              thumbColor={Platform.OS === 'ios' ? '#fff' : settings.publicProfile ? '#fff' : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Mostrar Ubicación</Text>
              <Text style={styles.settingDescription}>
                Mostrar tu ubicación en los reportes
              </Text>
            </View>
            <Switch
              value={settings.showLocation}
              onValueChange={(value) => handlePrivacyToggle('showLocation', value)}
              trackColor={{ false: '#ddd', true: '#007AFF' }}
              thumbColor={Platform.OS === 'ios' ? '#fff' : settings.showLocation ? '#fff' : '#f4f3f4'}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actividad</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Historial de Actividad</Text>
              <Text style={styles.settingDescription}>
                Guardar historial de reportes y verificaciones
              </Text>
            </View>
            <Switch
              value={settings.saveActivity}
              onValueChange={(value) => handlePrivacyToggle('saveActivity', value)}
              trackColor={{ false: '#ddd', true: '#007AFF' }}
              thumbColor={Platform.OS === 'ios' ? '#fff' : settings.saveActivity ? '#fff' : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Estadísticas Públicas</Text>
              <Text style={styles.settingDescription}>
                Mostrar tus estadísticas a otros usuarios
              </Text>
            </View>
            <Switch
              value={settings.publicStats}
              onValueChange={(value) => handlePrivacyToggle('publicStats', value)}
              trackColor={{ false: '#ddd', true: '#007AFF' }}
              thumbColor={Platform.OS === 'ios' ? '#fff' : settings.publicStats ? '#fff' : '#f4f3f4'}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Datos Personales</Text>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('ExportarDatos')}
          >
            <View style={styles.actionContent}>
              <Ionicons name="download-outline" size={24} color="#007AFF" />
              <View style={styles.actionInfo}>
                <Text style={styles.actionTitle}>Exportar Datos</Text>
                <Text style={styles.actionDescription}>
                  Descarga una copia de tus datos personales
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.dangerButton]}
            onPress={handleDataDeletion}
          >
            <View style={styles.actionContent}>
              <Ionicons name="trash-outline" size={24} color="#FF3B30" />
              <View style={styles.actionInfo}>
                <Text style={[styles.actionTitle, styles.dangerText]}>
                  Eliminar Datos
                </Text>
                <Text style={styles.actionDescription}>
                  Eliminar permanentemente todos tus datos
                </Text>
              </View>
            </View>
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
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actionInfo: {
    marginLeft: 12,
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    color: '#666',
  },
  dangerButton: {
    marginTop: 8,
  },
  dangerText: {
    color: '#FF3B30',
  },
});

export default PrivacySettingsScreen;
