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
import { useNotifications } from '../../context/NotificationContext';

type NotificationSettingsScreenNavigationProp = NativeStackNavigationProp<
  SettingsStackParamList,
  'ConfiguracionNotificaciones'
>;

const NotificationSettingsScreen = () => {
  const navigation = useNavigation<NotificationSettingsScreenNavigationProp>();
  const { notificationSettings, updateNotificationSettings } = useNotifications();

  const handleNotificationToggle = async (key: string, value: boolean) => {
    try {
      await updateNotificationSettings({ [key]: value });
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar la configuración de notificaciones');
    }
  };

  const renderSettingItem = (
    icon: string,
    title: string,
    description: string,
    settingKey: string
  ) => (
    <View style={styles.settingItem}>
      <View style={styles.settingContent}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon as any} size={24} color="#007AFF" />
        </View>
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>{title}</Text>
          <Text style={styles.settingDescription}>{description}</Text>
        </View>
      </View>
      <Switch
        value={notificationSettings[settingKey]}
        onValueChange={(value) => handleNotificationToggle(settingKey, value)}
        trackColor={{ false: '#ddd', true: '#007AFF' }}
        thumbColor={
          Platform.OS === 'ios'
            ? '#fff'
            : notificationSettings[settingKey]
            ? '#fff'
            : '#f4f3f4'
        }
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Notificaciones</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notificaciones Push</Text>
          {renderSettingItem(
            'notifications-outline',
            'Notificaciones Push',
            'Recibir notificaciones push en tu dispositivo',
            'pushEnabled'
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reportes</Text>
          {renderSettingItem(
            'document-text-outline',
            'Nuevos Reportes',
            'Notificaciones cuando se crean nuevos reportes en tu área',
            'newReports'
          )}
          {renderSettingItem(
            'checkmark-circle-outline',
            'Verificaciones',
            'Cuando alguien verifica tus reportes',
            'verifications'
          )}
          {renderSettingItem(
            'chatbubble-outline',
            'Comentarios',
            'Cuando alguien comenta en tus reportes',
            'comments'
          )}
          {renderSettingItem(
            'alert-circle-outline',
            'Actualizaciones de Estado',
            'Cambios en el estado de tus reportes',
            'statusUpdates'
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Comunidad</Text>
          {renderSettingItem(
            'people-outline',
            'Menciones',
            'Cuando alguien te menciona en un comentario',
            'mentions'
          )}
          {renderSettingItem(
            'star-outline',
            'Logros',
            'Cuando desbloqueas nuevos logros',
            'achievements'
          )}
          {renderSettingItem(
            'trophy-outline',
            'Ranking',
            'Actualizaciones sobre tu posición en el ranking',
            'ranking'
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Correo Electrónico</Text>
          {renderSettingItem(
            'mail-outline',
            'Resumen Diario',
            'Recibir un resumen diario de la actividad',
            'dailyDigest'
          )}
          {renderSettingItem(
            'newspaper-outline',
            'Boletín Semanal',
            'Noticias y actualizaciones semanales',
            'weeklyNewsletter'
          )}
        </View>

        <TouchableOpacity
          style={styles.resetButton}
          onPress={() => {
            Alert.alert(
              'Restablecer Configuración',
              '¿Estás seguro de que quieres restablecer todas las notificaciones a su configuración predeterminada?',
              [
                {
                  text: 'Cancelar',
                  style: 'cancel',
                },
                {
                  text: 'Restablecer',
                  style: 'destructive',
                  onPress: () => {
                    // Implementar restablecimiento de configuración
                  },
                },
              ]
            );
          }}
        >
          <Text style={styles.resetButtonText}>
            Restablecer Configuración Predeterminada
          </Text>
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
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
  },
  resetButton: {
    padding: 16,
    alignItems: 'center',
    marginVertical: 24,
  },
  resetButtonText: {
    color: '#FF3B30',
    fontSize: 16,
  },
});

export default NotificationSettingsScreen;
