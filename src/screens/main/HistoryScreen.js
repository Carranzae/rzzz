import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const MetricCard = ({ title, value, icon, color, change }) => (
  <View style={[styles.metricCard, { borderLeftColor: color }]}>
    <View style={styles.metricHeader}>
      <Ionicons name={icon} size={24} color={color} />
      <Text style={styles.metricTitle}>{title}</Text>
    </View>
    <Text style={[styles.metricValue, { color }]}>{value}</Text>
    <Text style={[styles.metricChange, { color: change >= 0 ? '#34C759' : '#FF3B30' }]}>
      {change >= 0 ? '+' : ''}{change}% vs ayer
    </Text>
  </View>
);

const AlertItem = ({ title, time, type, description }) => (
  <View style={styles.alertItem}>
    <Ionicons 
      name={type === 'warning' ? 'warning' : 'information-circle'} 
      size={24} 
      color={type === 'warning' ? '#FF9500' : '#007AFF'} 
    />
    <View style={styles.alertInfo}>
      <Text style={styles.alertTitle}>{title}</Text>
      <Text style={styles.alertDescription}>{description}</Text>
      <Text style={styles.alertTime}>{time}</Text>
    </View>
  </View>
);

const HistoryScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Historial Médico</Text>
        </View>

        {/* Metrics Overview */}
        <View style={styles.metricsContainer}>
          <MetricCard
            title="Ritmo Cardíaco"
            value="72 BPM"
            icon="heart"
            color="#FF2D55"
            change={5}
          />
          <MetricCard
            title="Nivel de Estrés"
            value="Bajo"
            icon="pulse"
            color="#5856D6"
            change={-10}
          />
          <MetricCard
            title="Actividad"
            value="8,234 pasos"
            icon="footsteps"
            color="#34C759"
            change={15}
          />
        </View>

        {/* Recent Alerts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Alertas Recientes</Text>
          <View style={styles.alertsContainer}>
            <AlertItem
              title="Ritmo cardíaco elevado"
              time="Hace 2 horas"
              type="warning"
              description="Se detectó un aumento significativo en tu ritmo cardíaco"
            />
            <AlertItem
              title="Objetivo de pasos alcanzado"
              time="Hace 4 horas"
              type="info"
              description="¡Felicitaciones! Has alcanzado tu objetivo diario"
            />
          </View>
        </View>

        {/* Daily Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen Diario</Text>
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryText}>
              Hoy has tenido un día activo con niveles normales de estrés. 
              Tu ritmo cardíaco se ha mantenido dentro de los rangos saludables 
              la mayor parte del día.
            </Text>
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
  metricsContainer: {
    padding: 10,
  },
  metricCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
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
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricTitle: {
    fontSize: 16,
    color: '#666',
    marginLeft: 10,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  metricChange: {
    fontSize: 14,
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
  alertsContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
  },
  alertItem: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  alertInfo: {
    marginLeft: 15,
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  alertDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  alertTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  summaryContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
  },
  summaryText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
});

export default HistoryScreen;
