import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Platform,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { ProfileStackParamList } from '../../types/navigation';
import { userService } from '../../services/userService';

type HelpScreenNavigationProp = NativeStackNavigationProp<ProfileStackParamList, 'Ayuda'>;

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: '¿Cómo crear un reporte?',
    answer: 'Para crear un reporte, pulsa el botón "+" en la pantalla principal. Completa el formulario con el título, descripción, ubicación y opcionalmente agrega imágenes. Finalmente, pulsa "Publicar Reporte".',
  },
  {
    question: '¿Cómo verificar un reporte?',
    answer: 'Puedes verificar un reporte visitando su página de detalles y pulsando el botón "Verificar Reporte". Deberás confirmar si el reporte es verdadero o falso según tu conocimiento del área o situación.',
  },
  {
    question: '¿Cómo cambiar mi foto de perfil?',
    answer: 'Ve a tu perfil, pulsa "Editar Perfil" y toca el ícono de la cámara sobre tu foto actual. Podrás seleccionar una nueva imagen de tu galería.',
  },
  {
    question: '¿Cómo activar/desactivar notificaciones?',
    answer: 'Ve a Configuración > Notificaciones y ajusta los interruptores según tus preferencias. Puedes configurar notificaciones para nuevas verificaciones, reportes cercanos y actualizaciones de estado.',
  },
  {
    question: '¿Cómo eliminar mi cuenta?',
    answer: 'Por razones de seguridad, para eliminar tu cuenta debes contactar con nuestro equipo de soporte a través del formulario de contacto en esta pantalla.',
  },
];

const HelpScreen = () => {
  const navigation = useNavigation<HelpScreenNavigationProp>();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const toggleFAQ = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleContact = async () => {
    if (!subject.trim() || !message.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    try {
      setSending(true);
      await userService.sendSupportMessage({
        subject: subject.trim(),
        message: message.trim(),
      });
      Alert.alert(
        '¡Mensaje Enviado!',
        'Nos pondremos en contacto contigo pronto',
        [
          {
            text: 'OK',
            onPress: () => {
              setSubject('');
              setMessage('');
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        'Error',
        'No se pudo enviar el mensaje. Por favor intenta más tarde.'
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Ayuda</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preguntas Frecuentes</Text>
          {faqs.map((faq, index) => (
            <TouchableOpacity
              key={index}
              style={styles.faqItem}
              onPress={() => toggleFAQ(index)}
            >
              <View style={styles.faqHeader}>
                <Text style={styles.faqQuestion}>{faq.question}</Text>
                <Ionicons
                  name={expandedIndex === index ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color="#666"
                />
              </View>
              {expandedIndex === index && (
                <Text style={styles.faqAnswer}>{faq.answer}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contáctanos</Text>
          <View style={styles.contactForm}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Asunto</Text>
              <TextInput
                style={styles.input}
                value={subject}
                onChangeText={setSubject}
                placeholder="¿En qué podemos ayudarte?"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Mensaje</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={message}
                onChangeText={setMessage}
                placeholder="Describe tu problema o pregunta"
                multiline
                numberOfLines={4}
              />
            </View>

            <TouchableOpacity
              style={[styles.sendButton, sending && styles.disabledButton]}
              onPress={handleContact}
              disabled={sending}
            >
              {sending ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.sendButtonText}>Enviar Mensaje</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Enlaces Útiles</Text>
          <TouchableOpacity
            style={styles.link}
            onPress={() => Linking.openURL('https://tuapp.com/guia')}
          >
            <Text style={styles.linkText}>Guía de Usuario</Text>
            <Ionicons name="open-outline" size={20} color="#007AFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.link}
            onPress={() => Linking.openURL('https://tuapp.com/privacidad')}
          >
            <Text style={styles.linkText}>Política de Privacidad</Text>
            <Ionicons name="open-outline" size={20} color="#007AFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.link}
            onPress={() => Linking.openURL('https://tuapp.com/terminos')}
          >
            <Text style={styles.linkText}>Términos de Servicio</Text>
            <Ionicons name="open-outline" size={20} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
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
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  faqItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 16,
  },
  faqAnswer: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  contactForm: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
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
  sendButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.7,
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginBottom: 8,
  },
  linkText: {
    fontSize: 16,
    color: '#007AFF',
  },
});

export default HelpScreen;
