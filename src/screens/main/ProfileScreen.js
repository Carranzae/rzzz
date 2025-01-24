import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';

const ProfileOption = ({ icon, title, subtitle, onPress }) => (
  <TouchableOpacity style={styles.optionContainer} onPress={onPress}>
    <Ionicons name={icon} size={24} color="#007AFF" />
    <View style={styles.optionTextContainer}>
      <Text style={styles.optionTitle}>{title}</Text>
      {subtitle && <Text style={styles.optionSubtitle}>{subtitle}</Text>}
    </View>
    <Ionicons name="chevron-forward" size={20} color="#999" />
  </TouchableOpacity>
);

const ProfileScreen = () => {
  const { user, logout } = useAuth();
  
  const userInfo = {
    name: user?.name || 'Usuario',
    email: user?.email || 'usuario@email.com',
    phone: '+1 234 567 8900',
    bloodType: 'A+',
    emergencyContact: 'María Pérez',
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sí, cerrar sesión',
          onPress: () => logout(),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Perfil</Text>
        </View>

        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={40} color="#666" />
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Ionicons name="camera" size={20} color="#007AFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{userInfo.name}</Text>
          <Text style={styles.userEmail}>{userInfo.email}</Text>
        </View>

        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Personal</Text>
          <View style={styles.optionsContainer}>
            <ProfileOption
              icon="call"
              title="Teléfono"
              subtitle={userInfo.phone}
              onPress={() => {}}
            />
            <ProfileOption
              icon="water"
              title="Tipo de Sangre"
              subtitle={userInfo.bloodType}
              onPress={() => {}}
            />
            <ProfileOption
              icon="alert-circle"
              title="Contacto de Emergencia"
              subtitle={userInfo.emergencyContact}
              onPress={() => {}}
            />
          </View>
        </View>

        {/* Medical Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Médica</Text>
          <View style={styles.optionsContainer}>
            <ProfileOption
              icon="medical"
              title="Condiciones Médicas"
              onPress={() => {}}
            />
            <ProfileOption
              icon="fitness"
              title="Alergias"
              onPress={() => {}}
            />
            <ProfileOption
              icon="document-text"
              title="Historial Médico"
              onPress={() => {}}
            />
          </View>
        </View>

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cuenta</Text>
          <View style={styles.optionsContainer}>
            <ProfileOption
              icon="lock-closed"
              title="Cambiar Contraseña"
              onPress={() => {}}
            />
            <ProfileOption
              icon="notifications"
              title="Notificaciones"
              onPress={() => {}}
            />
            <ProfileOption
              icon="exit"
              title="Cerrar Sesión"
              onPress={handleLogout}
            />
          </View>
        </View>
      </ScrollView>
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
  profileSection: {
    alignItems: 'center',
    padding: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e1e1e1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
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
  optionsContainer: {
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
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  optionTitle: {
    fontSize: 16,
    color: '#333',
  },
  optionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
});

export default ProfileScreen;
