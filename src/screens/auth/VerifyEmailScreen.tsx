import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { AuthStackParamList } from '../../types/navigation';
import { useAuth } from '../../context/AuthContext';

type VerifyEmailScreenRouteProp = RouteProp<AuthStackParamList, 'VerifyEmail'>;
type VerifyEmailScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'VerifyEmail'>;

const VerifyEmailScreen = () => {
  const navigation = useNavigation<VerifyEmailScreenNavigationProp>();
  const route = useRoute<VerifyEmailScreenRouteProp>();
  const { verifyEmail } = useAuth();
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    verifyEmailToken();
  }, []);

  const verifyEmailToken = async () => {
    try {
      const token = route.params?.token;
      if (!token) {
        Alert.alert('Error', 'Token de verificación no válido');
        return;
      }

      await verifyEmail(token);
      setVerified(true);
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Error al verificar el correo'
      );
    } finally {
      setVerifying(false);
    }
  };

  const handleContinue = () => {
    navigation.replace('Login');
  };

  if (verifying) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Verificando tu correo electrónico...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Ionicons
        name={verified ? 'checkmark-circle' : 'close-circle'}
        size={80}
        color={verified ? '#4CAF50' : '#F44336'}
      />
      <Text style={styles.title}>
        {verified ? '¡Correo Verificado!' : 'Error de Verificación'}
      </Text>
      <Text style={styles.message}>
        {verified
          ? 'Tu correo electrónico ha sido verificado exitosamente. Ya puedes iniciar sesión.'
          : 'No pudimos verificar tu correo electrónico. Por favor, intenta nuevamente.'}
      </Text>
      <TouchableOpacity
        style={[styles.button, verified ? styles.successButton : styles.errorButton]}
        onPress={verified ? handleContinue : verifyEmailToken}
      >
        <Text style={styles.buttonText}>
          {verified ? 'Continuar' : 'Reintentar'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    minWidth: 200,
    alignItems: 'center',
  },
  successButton: {
    backgroundColor: '#4CAF50',
  },
  errorButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default VerifyEmailScreen;
