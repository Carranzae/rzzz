import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  ActivityIndicator,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
  // Animated value for logo scaling
  const logoScale = new Animated.Value(0.3);
  
  useEffect(() => {
    // Animation for logo
    Animated.spring(logoScale, {
      toValue: 1,
      tension: 10,
      friction: 2,
      useNativeDriver: true,
    }).start();

    // Navigate to Login screen after 3 seconds
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Gradient background would be implemented here */}
      <Animated.View
        style={[
          styles.logoContainer,
          { transform: [{ scale: logoScale }] },
        ]}
      >
        <Text style={styles.logoText}>WITROX</Text>
      </Animated.View>

      <Text style={styles.slogan}>Tu seguridad, nuestra prioridad</Text>

      <ActivityIndicator
        style={styles.loader}
        size="large"
        color="#007AFF"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff', // Light blue background
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    width: 150,
    height: 150,
    backgroundColor: '#007AFF',
    borderRadius: 75,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  logoText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  slogan: {
    fontSize: 18,
    color: '#333',
    marginBottom: 50,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  loader: {
    position: 'absolute',
    bottom: 50,
  },
});

export default WelcomeScreen;
