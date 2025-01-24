import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';

const { width } = Dimensions.get('window');

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const handleResetPassword = () => {
    if (!email) {
      Alert.alert('Error', 'Por favor ingresa tu correo electrónico');
      return;
    }
    
    // Aquí iría la lógica de recuperación de contraseña
    Alert.alert(
      'Correo enviado',
      'Se ha enviado un enlace de recuperación a tu correo electrónico',
      [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Login'),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Recuperar Contraseña</Text>
        
        <Text style={styles.description}>
          Ingresa tu correo electrónico y te enviaremos las instrucciones para recuperar tu contraseña.
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity 
          style={styles.resetButton}
          onPress={handleResetPassword}
        >
          <Text style={styles.resetButtonText}>Enviar instrucciones</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Volver al inicio de sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formContainer: {
    width: width * 0.85,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: 25,
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
  },
  resetButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  resetButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default ForgotPasswordScreen;
