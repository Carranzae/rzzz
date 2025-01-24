import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { AuthStackParamList } from '../../types/navigation';
import { useAuth } from '../../context/AuthContext';

type ResetPasswordScreenRouteProp = RouteProp<AuthStackParamList, 'ResetPassword'>;
type ResetPasswordScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'ResetPassword'>;

const ResetPasswordScreen = () => {
  const navigation = useNavigation<ResetPasswordScreenNavigationProp>();
  const route = useRoute<ResetPasswordScreenRouteProp>();
  const { resetPassword } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (newPassword.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    try {
      setLoading(true);
      const token = route.params?.token;
      if (!token) {
        Alert.alert('Error', 'Token no válido');
        return;
      }

      await resetPassword(token, newPassword);
      Alert.alert(
        '¡Éxito!',
        'Tu contraseña ha sido restablecida correctamente',
        [
          {
            text: 'OK',
            onPress: () => navigation.replace('Login'),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Error al restablecer la contraseña'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Nueva Contraseña</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.description}>
          Ingresa tu nueva contraseña. Asegúrate de que sea segura y fácil de recordar.
        </Text>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={24} color="#666" style={styles.icon} />
          <TextInput
            style={[styles.input, styles.passwordInput]}
            placeholder="Nueva contraseña"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.showPasswordButton}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={24}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={24} color="#666" style={styles.icon} />
          <TextInput
            style={[styles.input, styles.passwordInput]}
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showPassword}
          />
        </View>

        <TouchableOpacity
          style={[styles.resetButton, loading && styles.disabledButton]}
          onPress={handleResetPassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.resetButtonText}>Restablecer Contraseña</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 16,
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
    paddingTop: 40,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  passwordInput: {
    paddingRight: 50,
  },
  showPasswordButton: {
    position: 'absolute',
    right: 12,
  },
  resetButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  disabledButton: {
    opacity: 0.7,
  },
  resetButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ResetPasswordScreen;
