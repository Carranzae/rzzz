import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  TextInput,
  Platform,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { ReportStackParamList } from '../../types/navigation';
import { reportService } from '../../services/reportService';

type VerifyReportScreenRouteProp = RouteProp<ReportStackParamList, 'VerificarReporte'>;
type VerifyReportScreenNavigationProp = NativeStackNavigationProp<ReportStackParamList, 'VerificarReporte'>;

const VerifyReportScreen = () => {
  const navigation = useNavigation<VerifyReportScreenNavigationProp>();
  const route = useRoute<VerifyReportScreenRouteProp>();
  const [report, setReport] = useState<any>(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    try {
      const data = await reportService.getReportById(route.params.reportId);
      setReport(data);
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Error al cargar el reporte'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (verified: boolean) => {
    try {
      setVerifying(true);
      await reportService.verifyReport(report.id);
      Alert.alert(
        '¡Éxito!',
        verified
          ? 'Has verificado este reporte como verdadero'
          : 'Has marcado este reporte como falso',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Error al verificar el reporte'
      );
    } finally {
      setVerifying(false);
    }
  };

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
        <Text style={styles.title}>Verificar Reporte</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.reportInfo}>
          <Text style={styles.reportTitle}>{report.title}</Text>
          <Text style={styles.reportLocation}>
            <Ionicons name="location-outline" size={16} color="#666" /> {report.location}
          </Text>
          <Text style={styles.reportDescription}>{report.description}</Text>
        </View>

        <View style={styles.verificationSection}>
          <Text style={styles.sectionTitle}>Verificación</Text>
          <Text style={styles.sectionDescription}>
            Por favor, verifica si este reporte es preciso y verdadero según tu conocimiento
            del área o situación.
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Comentario (opcional)</Text>
            <TextInput
              style={styles.input}
              value={comment}
              onChangeText={setComment}
              placeholder="Agrega un comentario sobre tu verificación"
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.verifyButton, styles.trueButton]}
              onPress={() => handleVerify(true)}
              disabled={verifying}
            >
              {verifying ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={24} color="white" />
                  <Text style={styles.buttonText}>Verificar como Verdadero</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.verifyButton, styles.falseButton]}
              onPress={() => handleVerify(false)}
              disabled={verifying}
            >
              {verifying ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Ionicons name="close-circle" size={24} color="white" />
                  <Text style={styles.buttonText}>Marcar como Falso</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
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
    padding: 20,
  },
  reportInfo: {
    marginBottom: 24,
  },
  reportTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  reportLocation: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  reportDescription: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  verificationSection: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
    height: 120,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    gap: 12,
  },
  verifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  trueButton: {
    backgroundColor: '#34C759',
  },
  falseButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default VerifyReportScreen;
