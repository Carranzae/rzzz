import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Text,
  Platform,
  useColorScheme,
} from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import HereMap from '../components/HereMap';
import { useReports } from '../context/ReportContext';
import { DangerZone, Incident } from '../types/map';
import { calculateDangerZones } from '../utils/mapUtils';

type RootStackParamList = {
  NuevoReporte: { latitude: number; longitude: number };
  DetalleReporte: { reportId: string };
  ListaReportes: { latitude: number; longitude: number };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const MapScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const colorScheme = useColorScheme();
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [heading, setHeading] = useState<number>(0);
  const [showTraffic, setShowTraffic] = useState(true);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [dangerZones, setDangerZones] = useState<DangerZone[]>([]);
  const { reports } = useReports();

  // Obtener ubicación y permisos
  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Se requiere permiso para acceder a la ubicación');
          return;
        }

        // Iniciar seguimiento de ubicación
        await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 1000,
            distanceInterval: 10,
          },
          (newLocation) => {
            setLocation({
              latitude: newLocation.coords.latitude,
              longitude: newLocation.coords.longitude,
            });
            setHeading(newLocation.coords.heading || 0);
          }
        );
      } catch (error) {
        setErrorMsg('Error al obtener la ubicación');
        Alert.alert('Error', 'No se pudo obtener tu ubicación actual');
      }
    })();
  }, []);

  // Convertir reportes a incidentes
  useEffect(() => {
    const newIncidents: Incident[] = reports.map(report => ({
      id: report.id,
      position: [report.location.latitude, report.location.longitude],
      type: report.type,
      timestamp: new Date(report.timestamp).getTime(),
      description: report.description,
      verified: report.verified
    }));
    setIncidents(newIncidents);

    // Calcular zonas de peligro basadas en la densidad de incidentes
    const zones = calculateDangerZones(newIncidents);
    setDangerZones(zones);
  }, [reports]);

  const handleMapClick = useCallback((coords: { lat: number; lng: number }) => {
    navigation.navigate('NuevoReporte', {
      latitude: coords.lat,
      longitude: coords.lng
    });
  }, [navigation]);

  const handleIncidentClick = useCallback((incident: Incident) => {
    navigation.navigate('DetalleReporte', {
      reportId: incident.id
    });
  }, [navigation]);

  const handleZoneClick = useCallback((zone: DangerZone) => {
    Alert.alert(
      'Zona de Riesgo',
      `Nivel de riesgo: ${zone.type}\nReportes: ${zone.reports}\n${zone.description}`,
      [{ text: 'OK' }]
    );
  }, []);

  if (errorMsg) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{errorMsg}</Text>
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HereMap
        center={[location.latitude, location.longitude]}
        zoom={15}
        incidents={incidents}
        dangerZones={dangerZones}
        onMapClick={handleMapClick}
        onIncidentClick={handleIncidentClick}
        onZoneClick={handleZoneClick}
        showTraffic={showTraffic}
        mapStyle={colorScheme === 'dark' ? 'night' : 'day'}
        userHeading={heading}
      />

      {/* Controles del mapa */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => setShowTraffic(!showTraffic)}
        >
          <Ionicons
            name={showTraffic ? 'car' : 'car-outline'}
            size={24}
            color="#007AFF"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => navigation.navigate('NuevoReporte', {
            latitude: location.latitude,
            longitude: location.longitude
          })}
        >
          <Ionicons name="warning" size={24} color="#FF3B30" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => {
            navigation.navigate('ListaReportes', {
              latitude: location.latitude,
              longitude: location.longitude
            });
          }}
        >
          <Ionicons name="list" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Leyenda del mapa */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#FF0000', opacity: 0.3 }]} />
          <Text style={styles.legendText}>Alto Riesgo</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#FFA500', opacity: 0.3 }]} />
          <Text style={styles.legendText}>Riesgo Medio</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#FFFF00', opacity: 0.3 }]} />
          <Text style={styles.legendText}>Bajo Riesgo</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    margin: 20,
  },
  controls: {
    position: 'absolute',
    right: 16,
    top: Platform.OS === 'ios' ? 60 : 16,
    backgroundColor: 'transparent',
  },
  controlButton: {
    backgroundColor: 'white',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  legend: {
    position: 'absolute',
    left: 16,
    bottom: 16,
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#000',
  },
  legendText: {
    fontSize: 12,
    color: '#333',
  },
});

export default MapScreen;
