import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AIService from '../services/AIService';

const MapContext = createContext();

export const useMap = () => useContext(MapContext);

export const MapProvider = ({ children }) => {
  const [reports, setReports] = useState([]);
  const [places, setPlaces] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [alternativeRoutes, setAlternativeRoutes] = useState([]);
  const [userPoints, setUserPoints] = useState(0);
  const [chatMessages, setChatMessages] = useState({});
  const [userContributions, setUserContributions] = useState([]);

  // Cargar datos guardados
  useEffect(() => {
    loadSavedData();
  }, []);

  const loadSavedData = async () => {
    try {
      const savedReports = await AsyncStorage.getItem('reports');
      const savedPoints = await AsyncStorage.getItem('userPoints');
      const savedContributions = await AsyncStorage.getItem('userContributions');

      if (savedReports) setReports(JSON.parse(savedReports));
      if (savedPoints) setUserPoints(parseInt(savedPoints));
      if (savedContributions) setUserContributions(JSON.parse(savedContributions));
    } catch (error) {
      console.error('Error al cargar datos guardados:', error);
    }
  };

  // Guardar datos cuando cambien
  useEffect(() => {
    saveData();
  }, [reports, userPoints, userContributions]);

  const saveData = async () => {
    try {
      await AsyncStorage.setItem('reports', JSON.stringify(reports));
      await AsyncStorage.setItem('userPoints', userPoints.toString());
      await AsyncStorage.setItem('userContributions', JSON.stringify(userContributions));
    } catch (error) {
      console.error('Error al guardar datos:', error);
    }
  };

  const addReport = async (report) => {
    const newReport = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      ...report,
    };

    setReports(prev => [newReport, ...prev]);
    
    // Agregar contribución y puntos
    addContribution({
      type: 'report',
      timestamp: Date.now(),
      reportId: newReport.id,
    });

    // Generar y reproducir alerta de voz
    const nearbyReports = reports.filter(r => 
      calculateDistance(r.latitude, r.longitude, report.latitude, report.longitude) < 1
    );
    if (nearbyReports.length > 0) {
      const alertMessage = await AIService.generateSafetyAlert(nearbyReports);
      if (alertMessage) {
        AIService.speakAlert(alertMessage);
      }
    }
  };

  const verifyReport = (reportId) => {
    setReports(prev =>
      prev.map(report =>
        report.id === reportId
          ? { ...report, verified: true, verifications: (report.verifications || 0) + 1 }
          : report
      )
    );

    // Agregar contribución y puntos
    addContribution({
      type: 'verification',
      timestamp: Date.now(),
      reportId,
    });
  };

  const addChatMessage = async (reportId, message) => {
    const newMessage = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      ...message,
    };

    setChatMessages(prev => ({
      ...prev,
      [reportId]: [...(prev[reportId] || []), newMessage],
    }));

    // Agregar contribución si el mensaje es útil
    if (message.helpful) {
      addContribution({
        type: 'chat',
        timestamp: Date.now(),
        messageId: newMessage.id,
        reportId,
        helpful: true,
      });
    }

    return newMessage;
  };

  const findAlternativeRoutes = async (origin, destination) => {
    const trafficData = reports.filter(r => 
      r.type === 'traffic' || r.type === 'accident' || r.type === 'construction'
    );

    const result = await AIService.analyzeTrafficAndSuggestRoute(
      origin,
      destination,
      trafficData
    );

    if (result) {
      setAlternativeRoutes(result.alternativeRoutes);
      
      // Agregar contribución si se comparte una ruta alternativa
      if (result.alternativeRoutes.length > 0) {
        addContribution({
          type: 'route',
          timestamp: Date.now(),
          routeId: Date.now().toString(),
        });
      }
    }

    return result;
  };

  const addContribution = (contribution) => {
    setUserContributions(prev => [...prev, contribution]);
    
    // Actualizar puntos
    const newPoints = AIService.calculateUserPoints([...userContributions, contribution]);
    setUserPoints(newPoints);
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Limpiar reportes antiguos
  useEffect(() => {
    const interval = setInterval(() => {
      const twoHoursAgo = Date.now() - 1000 * 60 * 120;
      setReports(prev => prev.filter(report => report.timestamp > twoHoursAgo));
    }, 1000 * 60 * 5);

    return () => clearInterval(interval);
  }, []);

  return (
    <MapContext.Provider
      value={{
        reports,
        places,
        favorites,
        alternativeRoutes,
        userPoints,
        chatMessages,
        userContributions,
        addReport,
        verifyReport,
        addChatMessage,
        findAlternativeRoutes,
        addContribution,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};
