import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../../types/navigation';

type WelcomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;

const WelcomeScreen = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: 'https://picsum.photos/1200/2400' }}
        style={styles.background}
      >
        <View style={styles.overlay}>
          <View style={styles.iconContainer}>
            <Ionicons name="warning" size={80} color="white" />
          </View>
          <Text style={styles.title}>Bienvenido a SafetyApp</Text>
          <Text style={styles.subtitle}>
            Tu plataforma de reportes y alertas comunitarias
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.loginButton]}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.buttonText}>Iniciar Sesión</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.registerButton]}
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={[styles.buttonText, styles.registerButtonText]}>
                Registrarse
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    marginBottom: 40,
    opacity: 0.9,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
  },
  button: {
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 3,
  },
  loginButton: {
    backgroundColor: '#007AFF',
  },
  registerButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'white',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerButtonText: {
    color: 'white',
  },
});

export default WelcomeScreen;
