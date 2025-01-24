import { NavigatorScreenParams } from '@react-navigation/native';
import { Report } from './report';
import { Notification } from './notification';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Modal: undefined;
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  MainApp: undefined;
};

export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ResetPassword: { token: string };
  VerifyEmail: { token: string };
};

export type MainTabParamList = {
  Mapa: undefined;
  Reportes: NavigatorScreenParams<ReportStackParamList>;
  Notificaciones: NavigatorScreenParams<NotificationStackParamList>;
  Perfil: NavigatorScreenParams<ProfileStackParamList>;
  Configuracion: NavigatorScreenParams<SettingsStackParamList>;
};

export type ReportStackParamList = {
  ListaReportes: undefined;
  CrearReporte: undefined;
  DetalleReporte: { reportId: string };
  EditarReporte: { reportId: string };
  VerificarReporte: { reportId: string };
};

export type NotificationStackParamList = {
  ListaNotificaciones: undefined;
  DetalleNotificacion: { notificationId: string };
  DetalleReporte: { reportId: string };
  PerfilUsuario: { userId: string };
  VerificarReporte: { reportId: string };
};

export type ProfileStackParamList = {
  PerfilUsuario: { userId?: string };
  EditarPerfil: undefined;
  MisReportes: undefined;
  Configuracion: undefined;
  Estadisticas: undefined;
  Ayuda: undefined;
  AcercaDe: undefined;
  CrearReporte: undefined;
  DetalleReporte: { reportId: string };
};

export type SettingsStackParamList = {
  ConfiguracionPrincipal: undefined;
  ConfiguracionNotificaciones: undefined;
  ConfiguracionPrivacidad: undefined;
  ConfiguracionCuenta: undefined;
  Terminos: undefined;
  Privacidad: undefined;
  AcercaDe: undefined;
  Ayuda: undefined;
  ExportarDatos: undefined;
  EditarPerfil: undefined;
};
