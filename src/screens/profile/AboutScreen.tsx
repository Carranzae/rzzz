import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { ProfileStackParamList } from '../../types/navigation';

type AboutScreenNavigationProp = NativeStackNavigationProp<ProfileStackParamList, 'AcercaDe'>;

const APP_VERSION = '1.0.0';

const AboutScreen = () => {
  const navigation = useNavigation<AboutScreenNavigationProp>();

  const handleSocialLink = (url: string) => {
    Linking.openURL(url);
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
        <Text style={styles.title}>Acerca de</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.appInfo}>
          <Image
            source={require('../../assets/icon.png')}
            style={styles.appIcon}
          />
          <Text style={styles.appName}>Mi App de Reportes</Text>
          <Text style={styles.version}>Versión {APP_VERSION}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nuestra Misión</Text>
          <Text style={styles.description}>
            Nuestra misión es empoderar a las comunidades proporcionando una
            plataforma confiable para reportar y verificar incidentes locales.
            Creemos en la importancia de la participación ciudadana y la
            transparencia para construir comunidades más seguras y mejor informadas.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Características Principales</Text>
          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <Ionicons name="document-text" size={24} color="#007AFF" />
              <View style={styles.featureInfo}>
                <Text style={styles.featureTitle}>Reportes Detallados</Text>
                <Text style={styles.featureDescription}>
                  Crea reportes completos con imágenes y ubicación
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={24} color="#007AFF" />
              <View style={styles.featureInfo}>
                <Text style={styles.featureTitle}>Verificación Comunitaria</Text>
                <Text style={styles.featureDescription}>
                  Sistema de verificación por usuarios confiables
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <Ionicons name="notifications" size={24} color="#007AFF" />
              <View style={styles.featureInfo}>
                <Text style={styles.featureTitle}>Notificaciones</Text>
                <Text style={styles.featureDescription}>
                  Mantente informado sobre reportes relevantes
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Equipo</Text>
          <Text style={styles.description}>
            Somos un equipo apasionado por la tecnología y el impacto social.
            Nuestro equipo está compuesto por desarrolladores, diseñadores y
            expertos en seguridad comprometidos con crear una diferencia positiva
            en nuestras comunidades.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Síguenos</Text>
          <View style={styles.socialLinks}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialLink('https://twitter.com/tuapp')}
            >
              <Ionicons name="logo-twitter" size={24} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialLink('https://facebook.com/tuapp')}
            >
              <Ionicons name="logo-facebook" size={24} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialLink('https://instagram.com/tuapp')}
            >
              <Ionicons name="logo-instagram" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contacto</Text>
          <TouchableOpacity
            style={styles.contactButton}
            onPress={() => Linking.openURL('mailto:contacto@tuapp.com')}
          >
            <Ionicons name="mail-outline" size={20} color="#007AFF" />
            <Text style={styles.contactButtonText}>contacto@tuapp.com</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.contactButton}
            onPress={() => Linking.openURL('https://tuapp.com')}
          >
            <Ionicons name="globe-outline" size={20} color="#007AFF" />
            <Text style={styles.contactButtonText}>www.tuapp.com</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.copyright}>
            © {new Date().getFullYear()} Mi App de Reportes. Todos los derechos reservados.
          </Text>
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
  appInfo: {
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  appIcon: {
    width: 100,
    height: 100,
    borderRadius: 20,
    marginBottom: 16,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  version: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  featureList: {
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureInfo: {
    marginLeft: 16,
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
  },
  socialLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  socialButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  contactButtonText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#007AFF',
  },
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  copyright: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default AboutScreen;
