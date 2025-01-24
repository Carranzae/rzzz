import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { NotificationStackParamList } from '../../types/navigation';
import { notificationService } from '../../services/notificationService';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

type NotificationDetailScreenRouteProp = RouteProp<
  NotificationStackParamList,
  'DetalleNotificacion'
>;

type NotificationDetailScreenNavigationProp = NativeStackNavigationProp<
  NotificationStackParamList,
  'DetalleNotificacion'
>;

const NotificationDetailScreen = () => {
  const navigation = useNavigation<NotificationDetailScreenNavigationProp>();
  const route = useRoute<NotificationDetailScreenRouteProp>();
  const [notification, setNotification] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotification();
  }, []);

  const loadNotification = async () => {
    try {
      const data = await notificationService.getNotificationById(
        route.params.notificationId
      );
      setNotification(data);
      if (!data.read) {
        await notificationService.markAsRead(data.id);
      }
    } catch (error) {
      console.error('Error loading notification:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = () => {
    if (!notification?.action) return;

    switch (notification.action.type) {
      case 'viewReport':
        navigation.navigate('DetalleReporte', {
          reportId: notification.action.reportId,
        });
        break;
      case 'viewProfile':
        navigation.navigate('PerfilUsuario', {
          userId: notification.action.userId,
        });
        break;
      case 'viewVerification':
        navigation.navigate('VerificarReporte', {
          reportId: notification.action.reportId,
        });
        break;
      default:
        console.log('Acción no soportada');
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'verification':
        return 'checkmark-circle';
      case 'comment':
        return 'chatbubble';
      case 'report':
        return 'document-text';
      default:
        return 'notifications';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!notification) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No se encontró la notificación</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Notificación</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.notificationHeader}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: notification.color || '#007AFF' },
            ]}
          >
            <Ionicons
              name={getNotificationIcon(notification.type)}
              size={32}
              color="white"
            />
          </View>
          <Text style={styles.timestamp}>
            {format(new Date(notification.createdAt), "d 'de' MMMM 'de' yyyy, HH:mm", {
              locale: es,
            })}
          </Text>
        </View>

        <View style={styles.notificationContent}>
          <Text style={styles.notificationTitle}>{notification.title}</Text>
          <Text style={styles.notificationMessage}>{notification.message}</Text>

          {notification.additionalInfo && (
            <View style={styles.additionalInfo}>
              {Object.entries(notification.additionalInfo).map(([key, value]) => (
                <View key={key} style={styles.infoRow}>
                  <Text style={styles.infoLabel}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}:
                  </Text>
                  <Text style={styles.infoValue}>{String(value)}</Text>
                </View>
              ))}
            </View>
          )}

          {notification.action && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleAction}
            >
              <Text style={styles.actionButtonText}>
                {notification.action.label || 'Ver más detalles'}
              </Text>
              <Ionicons name="arrow-forward" size={20} color="white" />
            </TouchableOpacity>
          )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
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
  notificationHeader: {
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  timestamp: {
    fontSize: 14,
    color: '#666',
  },
  notificationContent: {
    padding: 24,
  },
  notificationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  notificationMessage: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 24,
  },
  additionalInfo: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    width: 120,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    flex: 1,
    color: '#333',
  },
  actionButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default NotificationDetailScreen;
