import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = () => {
  const [points, setPoints] = useState(0);
  const [reportCount, setReportCount] = useState(0);
  const [verifiedCount, setVerifiedCount] = useState(0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={60} color="#666" />
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Ionicons name="pencil" size={20} color="white" />
          </TouchableOpacity>
        </View>
        <Text style={styles.username}>Usuario</Text>
        <Text style={styles.points}>{points} puntos</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Ionicons name="warning" size={24} color="#FF3B30" />
          <Text style={styles.statNumber}>{reportCount}</Text>
          <Text style={styles.statLabel}>Reportes</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="checkmark-circle" size={24} color="#34C759" />
          <Text style={styles.statNumber}>{verifiedCount}</Text>
          <Text style={styles.statLabel}>Verificados</Text>
        </View>
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="settings-outline" size={24} color="#666" />
          <Text style={styles.menuText}>Configuración</Text>
          <Ionicons name="chevron-forward" size={24} color="#999" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="notifications-outline" size={24} color="#666" />
          <Text style={styles.menuText}>Notificaciones</Text>
          <Ionicons name="chevron-forward" size={24} color="#999" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="help-circle-outline" size={24} color="#666" />
          <Text style={styles.menuText}>Ayuda</Text>
          <Ionicons name="chevron-forward" size={24} color="#999" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#007AFF',
    padding: 8,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  points: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: 'white',
    marginTop: 1,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  menuContainer: {
    backgroundColor: 'white',
    marginTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuText: {
    flex: 1,
    marginLeft: 16,
    fontSize: 16,
    color: '#333',
  },
});

export default ProfileScreen;
