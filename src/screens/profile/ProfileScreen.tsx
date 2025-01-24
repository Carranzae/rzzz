import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { useNotifications } from '../../context/NotificationContext';
import { ProfileStackParamList } from '../../types/navigation';

type ProfileScreenNavigationProp = NativeStackNavigationProp<ProfileStackParamList>;

const ProfileScreen = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { user, logout } = useAuth();
  const { settings } = useSettings();
  const { unreadCount } = useNotifications();

  const menuItems = [
    {
      title: 'Mis Reportes',
      icon: 'document-text',
      screen: 'MisReportes' as const,
    },
    {
      title: 'Estadísticas',
      icon: 'stats-chart',
      screen: 'Estadisticas' as const,
    },
    {
      title: 'Configuración',
      icon: 'settings',
      screen: 'Configuracion' as const,
    },
    {
      title: 'Ayuda',
      icon: 'help-circle',
      screen: 'Ayuda' as const,
    },
    {
      title: 'Acerca de',
      icon: 'information-circle',
      screen: 'AcercaDe' as const,
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.profileInfo}
          onPress={() => navigation.navigate('EditarPerfil')}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name || 'Usuario'}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.menu}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => navigation.navigate(item.screen)}
          >
            <View style={styles.menuItemContent}>
              <Ionicons name={item.icon as any} size={24} color="#007AFF" />
              <Text style={styles.menuItemText}>{item.title}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
    marginLeft: 15,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  menu: {
    backgroundColor: '#fff',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 15,
    color: '#000',
  },
  logoutButton: {
    margin: 20,
    padding: 15,
    backgroundColor: '#ff3b30',
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
