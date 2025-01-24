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
import { Report, ReportStatus, ReportStatusStyles } from '../../types/report';
import { ProfileStackParamList } from '../../types/navigation';
import { reportService } from '../../services/reportService';
import { useAuth } from '../../context/AuthContext';

type MyReportsScreenNavigationProp = NativeStackNavigationProp<ProfileStackParamList, 'MisReportes'>;

const STATUS_STYLES: ReportStatusStyles = {
  PENDING: {
    backgroundColor: '#FFF3CD',
    color: '#856404',
  },
  ACTIVE: {
    backgroundColor: '#D4EDDA',
    color: '#155724',
  },
  VERIFIED: {
    backgroundColor: '#CCE5FF',
    color: '#004085',
  },
  RESOLVED: {
    backgroundColor: '#D1ECF1',
    color: '#0C5460',
  },
  ARCHIVED: {
    backgroundColor: '#E2E3E5',
    color: '#383D41',
  },
  REJECTED: {
    backgroundColor: '#FFA39E',
    color: '#721C24',
  },
};

const MyReportsScreen = () => {
  const navigation = useNavigation<MyReportsScreenNavigationProp>();
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      if (user?.id) {
        const data = await reportService.getUserReports(user.id);
        setReports(data);
      }
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadReports();
    setRefreshing(false);
  };

  const getStatusStyle = (status: ReportStatus) => {
    return STATUS_STYLES[status];
  };

  const renderReportItem = ({ item }: { item: Report }) => (
    <TouchableOpacity
      style={styles.reportCard}
      onPress={() => navigation.navigate('DetalleReporte', { reportId: item.id })}
    >
      <View style={styles.reportHeader}>
        <Text style={styles.reportTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusStyle(item.status).backgroundColor }]}>
          <Text style={[styles.statusText, { color: getStatusStyle(item.status).color }]}>
            {item.status}
          </Text>
        </View>
      </View>

      <View style={styles.reportInfo}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Fecha:</Text>
          <Text style={styles.infoValue}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Ubicación:</Text>
          <Text style={styles.infoValue}>
            {item.location.address || 'Sin dirección específica'}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Tipo:</Text>
          <Text style={styles.infoValue}>{item.type}</Text>
        </View>
      </View>
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
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Mis Reportes</Text>
      </View>

      <FlatList
        data={reports}
        renderItem={renderReportItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No tienes reportes</Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => navigation.navigate('CrearReporte')}
            >
              <Text style={styles.createButtonText}>Crear Reporte</Text>
            </TouchableOpacity>
          </View>
        }
      />
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
  reportCard: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginVertical: 8,
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  reportInfo: {
    marginTop: 5,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  infoLabel: {
    fontWeight: '600',
    marginRight: 5,
    color: '#666',
  },
  infoValue: {
    color: '#444',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  createButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MyReportsScreen;
