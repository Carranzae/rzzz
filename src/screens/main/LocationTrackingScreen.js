import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { Ionicons } from '@expo/vector-icons';
import { useMap } from '../../context/MapContext';
import ReportMenu from '../../components/ReportMenu';

const LOCATION_TRACKING = 'location-tracking';
const { width, height } = Dimensions.get('window');

const customMapStyle = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ffffff"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dadada"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#c9c9c9"
      }
    ]
  }
];

TaskManager.defineTask(LOCATION_TRACKING, async ({ data, error }) => {
  if (error) {
    console.error(error);
    return;
  }
  if (data) {
    const { locations } = data;
    const lat = locations[0].coords.latitude;
    const long = locations[0].coords.longitude;
    console.log(`${new Date(Date.now()).toLocaleString()}: ${lat},${long}`);
  }
});

const LocationTrackingScreen = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [showReportMenu, setShowReportMenu] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const mapRef = useRef(null);
  
  const { reports, addReport, verifyReport, removeReport } = useMap();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Se requiere permiso para acceder a la ubicación');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      
      if (mapRef.current) {
        mapRef.current.animateToRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }
    })();
  }, []);

  const getReportIcon = (type) => {
    switch (type) {
      case 'police':
        return 'shield';
      case 'accident':
        return 'warning';
      case 'danger':
        return 'alert-circle';
      case 'traffic':
        return 'car';
      case 'construction':
        return 'construct';
      case 'flood':
        return 'water';
      case 'event':
        return 'calendar';
      case 'closure':
        return 'close-circle';
      default:
        return 'warning';
    }
  };

  const getReportColor = (type) => {
    switch (type) {
      case 'police':
        return '#4A90E2';
      case 'accident':
      case 'danger':
        return '#FF3B30';
      case 'traffic':
      case 'construction':
        return '#FF9500';
      case 'flood':
        return '#4A90E2';
      case 'event':
        return '#5856D6';
      default:
        return '#FF3B30';
    }
  };

  const handleReportPress = (report) => {
    setSelectedReport(report);
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: report.latitude,
        longitude: report.longitude,
        latitudeDelta: 0.0122,
        longitudeDelta: 0.0121,
      });
    }
  };

  const handleAddReport = (reportData) => {
    addReport(reportData);
  };

  const renderReportMarker = (report) => (
    <Marker
      key={report.id}
      coordinate={{
        latitude: report.latitude,
        longitude: report.longitude,
      }}
      onPress={() => handleReportPress(report)}
    >
      <View style={[styles.reportMarker, { backgroundColor: getReportColor(report.type) }]}>
        <Ionicons name={getReportIcon(report.type)} size={20} color="white" />
      </View>
      <Callout>
        <View style={styles.callout}>
          <Text style={styles.calloutTitle}>
            {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
          </Text>
          <Text style={styles.calloutText}>
            Reportado hace {Math.round((Date.now() - report.timestamp) / 1000 / 60)} minutos
          </Text>
          {report.description && (
            <Text style={styles.calloutDescription}>{report.description}</Text>
          )}
          <TouchableOpacity
            style={styles.verifyButton}
            onPress={() => verifyReport(report.id)}
          >
            <Text style={styles.verifyButtonText}>Confirmar</Text>
          </TouchableOpacity>
        </View>
      </Callout>
    </Marker>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          customMapStyle={customMapStyle}
          showsUserLocation
          showsMyLocationButton={false}
          showsCompass
          showsScale
        >
          {reports.map(renderReportMarker)}
          {routeCoordinates.length > 0 && (
            <Polyline
              coordinates={routeCoordinates}
              strokeColor="#007AFF"
              strokeWidth={3}
            />
          )}
        </MapView>

        {/* Controles del mapa */}
        <View style={styles.mapControls}>
          <TouchableOpacity
            style={styles.mapButton}
            onPress={() => setShowReportMenu(true)}
          >
            <Ionicons name="add-circle" size={24} color="#007AFF" />
            <Text style={styles.mapButtonText}>Reportar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.mapButton}
            onPress={() => {
              if (location) {
                mapRef.current?.animateToRegion({
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                });
              }
            }}
          >
            <Ionicons name="locate" size={24} color="#007AFF" />
            <Text style={styles.mapButtonText}>Mi Ubicación</Text>
          </TouchableOpacity>
        </View>

        {/* Panel de información */}
        {location && (
          <View style={styles.speedPanel}>
            <Text style={styles.speedText}>
              {location.coords.speed
                ? `${Math.round(location.coords.speed * 3.6)} km/h`
                : 'Detenido'}
            </Text>
          </View>
        )}
      </View>

      <ReportMenu
        visible={showReportMenu}
        onClose={() => setShowReportMenu(false)}
        onSelectReport={handleAddReport}
        currentLocation={location}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  mapControls: {
    position: 'absolute',
    right: 16,
    top: 16,
    backgroundColor: 'white',
    borderRadius: 12,
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
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginVertical: 4,
  },
  mapButtonText: {
    marginLeft: 8,
    color: '#007AFF',
    fontSize: 16,
  },
  reportMarker: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  callout: {
    width: 200,
    padding: 12,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  calloutText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  calloutDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  verifyButton: {
    backgroundColor: '#007AFF',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  verifyButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  speedPanel: {
    position: 'absolute',
    left: 16,
    bottom: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  speedText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
});

export default LocationTrackingScreen;
