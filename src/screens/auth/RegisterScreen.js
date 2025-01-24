import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    dateOfBirth: '',
    password: '',
    confirmPassword: '',
  });

  const handleRegister = () => {
    // Aquí iría la lógica de registro local
    console.log('Register attempt with:', formData);
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Crear Cuenta</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Nombre completo"
              value={formData.fullName}
              onChangeText={(value) => updateFormData('fullName', value)}
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Número de teléfono"
              value={formData.phone}
              onChangeText={(value) => updateFormData('phone', value)}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              value={formData.email}
              onChangeText={(value) => updateFormData('email', value)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Fecha de nacimiento (DD/MM/AAAA)"
              value={formData.dateOfBirth}
              onChangeText={(value) => updateFormData('dateOfBirth', value)}
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              value={formData.password}
              onChangeText={(value) => updateFormData('password', value)}
              secureTextEntry
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Confirmar contraseña"
              value={formData.confirmPassword}
              onChangeText={(value) => updateFormData('confirmPassword', value)}
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
            <Text style={styles.registerButtonText}>Registrarse</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginText}>
              ¿Ya tienes cuenta? Inicia sesión
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#f0f8ff',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 30,
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
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
  },
  registerButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginText: {
    color: '#666',
    textAlign: 'center',
  },
});

export default RegisterScreen;
