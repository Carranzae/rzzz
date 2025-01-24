import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { ReportStackParamList } from '../../types/navigation';
import { reportService } from '../../services/reportService';
import { useAuth } from '../../context/AuthContext';

type CreateReportScreenNavigationProp = NativeStackNavigationProp<ReportStackParamList, 'CrearReporte'>;

const CreateReportScreen = () => {
  const navigation = useNavigation<CreateReportScreenNavigationProp>();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitamos acceso a tu galería para subir imágenes');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0].uri) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || !location.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos requeridos');
      return;
    }

    try {
      setLoading(true);
      const report = {
        title,
        description,
        location,
        images,
        userId: user?.id,
        status: 'pending',
        createdAt: new Date(),
      };

      await reportService.createReport(report);
      Alert.alert(
        '¡Éxito!',
        'Tu reporte ha sido creado exitosamente',
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
        error instanceof Error ? error.message : 'Error al crear el reporte'
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
        <Text style={styles.title}>Crear Reporte</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Título</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Título del reporte"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Describe el incidente"
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Ubicación</Text>
          <TextInput
            style={styles.input}
            value={location}
            onChangeText={setLocation}
            placeholder="Dirección o ubicación"
          />
        </View>

        <View style={styles.imagesContainer}>
          <Text style={styles.label}>Imágenes</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {images.map((uri, index) => (
              <View key={index} style={styles.imagePreview}>
                <Image source={{ uri }} style={styles.image} />
                <TouchableOpacity
                  style={styles.removeImage}
                  onPress={() => setImages(images.filter((_, i) => i !== index))}
                >
                  <Ionicons name="close-circle" size={24} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={styles.addImageButton} onPress={pickImage}>
              <Ionicons name="camera" size={32} color="#666" />
              <Text style={styles.addImageText}>Agregar</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.submitButtonText}>Crear Reporte</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
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
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  imagesContainer: {
    marginBottom: 20,
  },
  imagePreview: {
    marginRight: 10,
    position: 'relative',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeImage: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageText: {
    marginTop: 4,
    fontSize: 14,
    color: '#666',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  disabledButton: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CreateReportScreen;
