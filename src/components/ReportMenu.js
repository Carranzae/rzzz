import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const reportTypes = [
  {
    id: 'police',
    icon: 'shield',
    label: 'Policía',
    color: '#4A90E2',
  },
  {
    id: 'accident',
    icon: 'warning',
    label: 'Accidente',
    color: '#E25B4A',
  },
  {
    id: 'danger',
    icon: 'alert-circle',
    label: 'Zona Peligrosa',
    color: '#FF3B30',
  },
  {
    id: 'traffic',
    icon: 'car',
    label: 'Tráfico',
    color: '#FF9500',
  },
  {
    id: 'construction',
    icon: 'construct',
    label: 'Obras',
    color: '#FF9500',
  },
  {
    id: 'flood',
    icon: 'water',
    label: 'Inundación',
    color: '#4A90E2',
  },
  {
    id: 'event',
    icon: 'calendar',
    label: 'Evento',
    color: '#5856D6',
  },
  {
    id: 'closure',
    icon: 'close-circle',
    label: 'Calle Cerrada',
    color: '#FF3B30',
  },
];

const ReportMenu = ({ visible, onClose, onSelectReport, currentLocation }) => {
  const handleReportSelect = (reportType) => {
    if (!currentLocation) {
      alert('No se puede obtener tu ubicación actual');
      return;
    }

    onSelectReport({
      type: reportType.id,
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
    });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Reportar Incidente</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.optionsContainer}>
            <View style={styles.optionsGrid}>
              {reportTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={styles.option}
                  onPress={() => handleReportSelect(type)}
                >
                  <View style={[styles.iconContainer, { backgroundColor: type.color }]}>
                    <Ionicons name={type.icon} size={24} color="white" />
                  </View>
                  <Text style={styles.optionLabel}>{type.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  optionsContainer: {
    maxHeight: '80%',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  option: {
    width: (width - 60) / 3,
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  optionLabel: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
});

export default ReportMenu;
