import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { NotificationStackParamList } from '../../types/navigation';
import { notificationService } from '../../services/notificationService';
import { useNotifications } from '../../context/NotificationContext';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

type NotificationsScreenNavigationProp = NativeStackNavigationProp<
  NotificationStackParamList,
  'Notificaciones'
>;

const NotificationsScreen = () => {
  const navigation = useNavigation<NotificationsScreenNavigationProp>();
  const { markAllAsRead } = useNotifications();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      await loadNotifications();
    } catch (error) {
      console.error('Error marking notifications as read:', error);
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

  const renderNotificationItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[styles.notificationItem, !item.read && styles.unreadItem]}
      onPress={() =>
        navigation.navigate('DetalleNotificacion', {
          notificationId: item.id,
        })
      }
    >
      <View style={[styles.iconContainer, { backgroundColor: item.color || '#007AFF' }]}>
        <Ionicons
          name={getNotificationIcon(item.type)}
          size={24}
          color="white"
        />
      </View>
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationMessage} numberOfLines={2}>
          {item.message}
        </Text>
        <Text style={styles.notificationTime}>
          {formatDistanceToNow(new Date(item.createdAt), {
            addSuffix: true,
            locale: es,
          })}
        </Text>
      </View>
      {!item.read && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notificaciones</Text>
        {notifications.some(n => !n.read) && (
          <TouchableOpacity
            style={styles.markAllButton}
            onPress={handleMarkAllAsRead}
          >
            <Text style={styles.markAllText}>Marcar todo como leído</Text>
          </TouchableOpacity>
        )}
      </View>

      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="notifications-off-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No tienes notificaciones</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotificationItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  markAllButton: {
    padding: 8,
  },
  markAllText: {
    color: '#007AFF',
    fontSize: 14,
  },
  listContainer: {
    padding: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  unreadItem: {
    backgroundColor: '#f8f9fa',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#007AFF',
    position: 'absolute',
    top: 16,
    right: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
});

export default NotificationsScreen;
