import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Share,
  Platform,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Report, ReportStatus, ReportStatusStyles } from '../../types/report';
import { ReportStackParamList } from '../../types/navigation';
import { localReportService } from '../../services/localReportService';
import { useAuth } from '../../context/AuthContext';
import { localUserService } from '../../services/localUserService';

type ReportDetailScreenNavigationProp = NativeStackNavigationProp<ReportStackParamList>;
type ReportDetailScreenRouteProp = RouteProp<ReportStackParamList, 'DetalleReporte'>;

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

const ReportDetailScreen = () => {
  const navigation = useNavigation<ReportDetailScreenNavigationProp>();
  const route = useRoute<ReportDetailScreenRouteProp>();
  const { user } = useAuth();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [reportUser, setReportUser] = useState<{ username: string } | null>(null);

  useEffect(() => {
    loadReport();
  }, [route.params?.reportId]);

  const loadReport = async () => {
    try {
      setLoading(true);
      const reportData = await localReportService.getReportById(route.params?.reportId);
      if (reportData) {
        setReport(reportData);
        // Load user data
        const userData = await localUserService.getUserProfile(reportData.user_id);
        setReportUser(userData);
      }
    } catch (error) {
      console.error('Error loading report:', error);
      Alert.alert('Error', 'No se pudo cargar el reporte');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyReport = async () => {
    try {
      if (!report) return;
      await localReportService.verifyReport(report.id);
      await loadReport(); // Reload report data
      Alert.alert('Éxito', 'Reporte verificado correctamente');
    } catch (error) {
      console.error('Error verifying report:', error);
      Alert.alert('Error', 'No se pudo verificar el reporte');
    }
  };

  const handleDeleteReport = async () => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que quieres eliminar este reporte?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              if (!report) return;
              await localReportService.deleteReport(report.id);
              navigation.goBack();
            } catch (error) {
              console.error('Error deleting report:', error);
              Alert.alert('Error', 'No se pudo eliminar el reporte');
            }
          },
        },
      ]
    );
  };

  const handleEdit = () => {
    if (report) {
      navigation.navigate('EditarReporte', { reportId: report.id });
    }
  };

  const getStatusStyle = (status: ReportStatus) => {
    return STATUS_STYLES[status.toUpperCase() as keyof ReportStatusStyles];
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!report) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No se encontró el reporte</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{report.title}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusStyle(report.status).backgroundColor }]}>
          <Text style={[styles.statusText, { color: getStatusStyle(report.status).color }]}>
            {report.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Descripción:</Text>
        <Text style={styles.description}>{report.description}</Text>

        <Text style={styles.label}>Creado por:</Text>
        <Text style={styles.text}>{reportUser?.username || 'Usuario desconocido'}</Text>

        <Text style={styles.label}>Fecha de creación:</Text>
        <Text style={styles.text}>{new Date(report.created_at).toLocaleDateString()}</Text>

        <Text style={styles.label}>Prioridad:</Text>
        <Text style={styles.text}>{report.priority.toUpperCase()}</Text>
      </View>

      <View style={styles.actionsContainer}>
        {user?.id === report.user_id && (
          <View style={styles.userActions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.editButton]}
              onPress={handleEdit}
            >
              <Ionicons name="pencil-outline" size={20} color="white" />
              <Text style={styles.actionButtonText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={handleDeleteReport}
            >
              <Ionicons name="trash-outline" size={20} color="white" />
              <Text style={styles.actionButtonText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}

        {user?.id !== report.user_id && (
          <TouchableOpacity
            style={[styles.actionButton, styles.verifyButton]}
            onPress={handleVerifyReport}
          >
            <Ionicons name="checkmark-circle-outline" size={20} color="white" />
            <Text style={styles.actionButtonText}>Verificar Reporte</Text>
          </TouchableOpacity>
        )}
      </View>

      {report.verified && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.verifyButton}
            onPress={handleVerifyReport}
          >
            <Text style={styles.verifyButtonText}>Verificar Reporte</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#721c24',
    marginBottom: 20,
  },
  header: {
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  infoContainer: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
    marginTop: 15,
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    color: '#212529',
    marginBottom: 15,
  },
  text: {
    fontSize: 16,
    color: '#212529',
    marginBottom: 10,
  },
  actionsContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#dee2e6',
  },
  userActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    minWidth: 120,
  },
  editButton: {
    backgroundColor: '#007bff',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  },
  verifyButton: {
    backgroundColor: '#28a745',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 8,
  },
  backButton: {
    backgroundColor: '#6c757d',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#dee2e6',
  },
  verifyButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ReportDetailScreen;
