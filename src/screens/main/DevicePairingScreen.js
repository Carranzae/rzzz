import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Animated,
  Easing,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const DeviceItem = ({ device, onPress, isConnecting }) => (
  <TouchableOpacity 
    style={styles.deviceItem}
    onPress={onPress}
    disabled={isConnecting}
  >
    <View style={styles.deviceInfo}>
      <Ionicons 
        name={device.connected ? "bluetooth" : "bluetooth-outline"} 
        size={24} 
        color={device.connected ? "#007AFF" : "#666"}
      />
      <View style={styles.deviceTexts}>
        <Text style={styles.deviceName}>{device.name}</Text>
        <Text style={styles.deviceStatus}>
          {device.connected ? 'Conectado' : 'Disponible'}
        </Text>
      </View>
    </View>
    {isConnecting ? (
      <ActivityIndicator color="#007AFF" />
    ) : (
      <Ionicons 
        name="chevron-forward" 
        size={20} 
        color="#999"
      />
    )}
  </TouchableOpacity>
);

const DevicePairingScreen = ({ navigation }) => {
  const [devices, setDevices] = useState([
    { id: '1', name: 'WITROX-001', connected: false },
    { id: '2', name: 'WITROX-002', connected: false },
    { id: '3', name: 'WITROX-003', connected: false },
  ]);
  const [connectingId, setConnectingId] = useState(null);
  const [pairingCode, setPairingCode] = useState('');
  
  // Animación para el modelo 3D
  const spinValue = new Animated.Value(0);
  
  useEffect(() => {
    // Generar código de emparejamiento aleatorio
    setPairingCode(Math.random().toString(36).substr(2, 6).toUpperCase());
    
    // Iniciar animación de rotación
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const handleDevicePress = async (deviceId) => {
    setConnectingId(deviceId);
    // Simular proceso de conexión
    setTimeout(() => {
      setDevices(prevDevices =>
        prevDevices.map(device =>
          device.id === deviceId
            ? { ...device, connected: true }
            : device
        )
      );
      setConnectingId(null);
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Vincular Dispositivo</Text>
      </View>

      <View style={styles.content}>
        {/* Sección superior con animación y código */}
        <View style={styles.animationSection}>
          <Animated.View
            style={[
              styles.deviceAnimation,
              { transform: [{ rotate: spin }] },
            ]}
          >
            <Ionicons name="watch" size={100} color="#007AFF" />
          </Animated.View>
          
          <View style={styles.pairingCodeContainer}>
            <Text style={styles.pairingCodeLabel}>
              Código de vinculación:
            </Text>
            <Text style={styles.pairingCode}>{pairingCode}</Text>
          </View>
          
          <Text style={styles.instructions}>
            Ingresa este código en tu dispositivo WITROX para completar la vinculación
          </Text>
        </View>

        {/* Lista de dispositivos */}
        <View style={styles.devicesSection}>
          <Text style={styles.sectionTitle}>Dispositivos Disponibles</Text>
          <FlatList
            data={devices}
            renderItem={({ item }) => (
              <DeviceItem
                device={item}
                onPress={() => handleDevicePress(item.id)}
                isConnecting={connectingId === item.id}
              />
            )}
            keyExtractor={item => item.id}
            style={styles.devicesList}
          />
        </View>

        {/* Ayuda */}
        <TouchableOpacity style={styles.helpButton}>
          <Ionicons name="help-circle" size={24} color="#007AFF" />
          <Text style={styles.helpText}>
            ¿Problemas con la vinculación?
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  backButton: {
    marginRight: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  animationSection: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  deviceAnimation: {
    width: 150,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  pairingCodeContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  pairingCodeLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  pairingCode: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
    letterSpacing: 5,
  },
  instructions: {
    textAlign: 'center',
    color: '#666',
    paddingHorizontal: 40,
    lineHeight: 20,
  },
  devicesSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  devicesList: {
    flex: 1,
  },
  deviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  deviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deviceTexts: {
    marginLeft: 15,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  deviceStatus: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    marginBottom: 20,
  },
  helpText: {
    marginLeft: 8,
    color: '#007AFF',
    fontSize: 16,
  },
});

export default DevicePairingScreen;
