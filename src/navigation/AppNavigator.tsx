import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';

// Auth Screens
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

// Main Screens
import MapScreen from '../screens/MapScreen';
import ReportsScreen from '../screens/ReportsScreen';
import NotificationsScreen from '../screens/notifications/NotificationsScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

// Types
import { RootStackParamList } from '../types/navigation';

export type MainTabParamList = {
  Mapa: undefined;
  Reportes: undefined;
  Notificaciones: undefined;
  Perfil: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }: {
          focused: boolean;
          color: string;
          size: number;
        }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Mapa':
              iconName = focused ? 'map' : 'map-outline';
              break;
            case 'Reportes':
              iconName = focused ? 'warning' : 'warning-outline';
              break;
            case 'Notificaciones':
              iconName = focused ? 'notifications' : 'notifications-outline';
              break;
            case 'Perfil':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 88 : 60,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          paddingTop: 8,
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e2e2e2',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Mapa" 
        component={MapScreen}
        options={{
          title: 'Mapa',
        }}
      />
      <Tab.Screen 
        name="Reportes" 
        component={ReportsScreen}
        options={{
          title: 'Reportes',
        }}
      />
      <Tab.Screen 
        name="Notificaciones" 
        component={NotificationsScreen}
        options={{
          title: 'Notificaciones',
        }}
      />
      <Tab.Screen 
        name="Perfil" 
        component={ProfileScreen}
        options={{
          title: 'Perfil',
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const isAuthenticated = false; // Aquí implementaremos la lógica de autenticación

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          // Auth Stack
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          </>
        ) : (
          // Main App Stack
          <Stack.Screen name="MainApp" component={MainTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
