import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const StatusCard = ({ title, value, icon, color }) => (
  <View style={[styles.card, { borderLeftColor: color }]}>
    <Ionicons name={icon} size={24} color={color} />
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={[styles.cardValue, { color }]}>{value}</Text>
  </View>
);

const EmergencyButton = () => (
  <TouchableOpacity style={styles.emergencyButton}>
    <Ionicons name="alert-circle" size={24} color="white" />
    <Text style={styles.emergencyButtonText}>Emergencia</Text>
  </TouchableOpacity>
);

const DashboardScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Panel de Control</Text>
          <View style={styles.deviceStatus}>
            <Ionicons name="bluetooth" size={20} color="#007AFF" />
            <Text style={styles.deviceStatusText}>Conectado</Text>
          </View>
        </View>

        {/* Status Cards */}
        <View style={styles.cardsContainer}>
          <StatusCard
            title="Ritmo Cardíaco"
            value="72 BPM"
            icon="heart"
            color="#FF2D55"
          />
          <StatusCard
            title="Pasos"
            value="8,234"
            icon="footsteps"
            color="#5856D6"
          />
          <StatusCard
            title="Calorías"
            value="350 kcal"
            icon="flame"
            color="#FF9500"
          />
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actividad Reciente</Text>
          <View style={styles.activityList}>
            {/* Activity items would go here */}
            <View style={styles.activityItem}>
              <Ionicons name="walk" size={24} color="#007AFF" />
              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle}>Caminata</Text>
                <Text style={styles.activityTime}>Hace 30 minutos</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <EmergencyButton />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  deviceStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deviceStatusText: {
    marginLeft: 5,
    color: '#007AFF',
  },
  cardsContainer: {
    padding: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: width / 2 - 20,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 15,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
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
  activityList: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  activityInfo: {
    marginLeft: 15,
  },
  activityTitle: {
    fontSize: 16,
    color: '#333',
  },
  activityTime: {
    fontSize: 14,
    color: '#666',
  },
  quickActions: {
    padding: 20,
  },
  emergencyButton: {
    backgroundColor: '#FF3B30',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  emergencyButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default DashboardScreen;
