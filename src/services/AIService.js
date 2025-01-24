import OpenAI from 'openai';
import * as Speech from 'expo-speech';
import { config } from '../config';

class AIService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: config.OPENAI_API_KEY,
      dangerouslyAllowBrowser: true
    });
  }

  async analyzeTrafficAndSuggestRoute(origin, destination, trafficData) {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a traffic analysis AI that provides route suggestions based on user reports."
          },
          {
            role: "user",
            content: `Analyze these traffic reports and suggest alternative routes: ${JSON.stringify([origin, destination, trafficData])}`
          }
        ]
      });

      return {
        suggestion: response.choices[0].message.content,
        alternativeRoutes: this.processAIResponse(response.choices[0].message.content)
      };
    } catch (error) {
      console.error('Error analyzing traffic:', error);
      return null;
    }
  }

  async generateSafetyAlert(nearbyReports) {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful AI that generates relevant chat suggestions for traffic reports."
          },
          {
            role: "user",
            content: `Generate a chat suggestion for this report: ${JSON.stringify(nearbyReports)}`
          }
        ]
      });

      const alertMessage = response.choices[0].message.content;
      return alertMessage;
    } catch (error) {
      console.error('Error generating safety alert:', error);
      return null;
    }
  }

  async speakAlert(message) {
    try {
      const options = {
        language: 'es-ES',
        pitch: 1.0,
        rate: 0.9,
      };
      
      await Speech.speak(message, options);
    } catch (error) {
      console.error('Error speaking alert:', error);
    }
  }

  processAIResponse(response) {
    // Procesa la respuesta de la IA para extraer rutas alternativas
    // Este es un ejemplo simplificado
    const routes = [];
    const lines = response.split('\n');
    
    let currentRoute = null;
    for (const line of lines) {
      if (line.includes('Ruta alternativa')) {
        if (currentRoute) {
          routes.push(currentRoute);
        }
        currentRoute = {
          name: line,
          steps: [],
          estimatedTime: '',
          trafficLevel: ''
        };
      } else if (currentRoute && line.trim()) {
        currentRoute.steps.push(line.trim());
      }
    }
    
    if (currentRoute) {
      routes.push(currentRoute);
    }
    
    return routes;
  }

  async suggestChatResponse(userMessage, chatHistory) {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful AI that generates relevant chat suggestions for traffic reports."
          },
          ...chatHistory,
          {
            role: "user",
            content: userMessage
          }
        ]
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error suggesting chat response:', error);
      return null;
    }
  }

  calculateUserPoints(contributions) {
    // Sistema de puntos basado en contribuciones
    let points = 0;
    
    const pointsSystem = {
      report: 10,          // Puntos por crear un reporte
      verification: 5,     // Puntos por verificar un reporte
      helpfulChat: 3,      // Puntos por mensajes útiles en el chat
      routeSharing: 8,     // Puntos por compartir una ruta alternativa
      consecutive: 2,      // Puntos extra por días consecutivos de uso
    };

    contributions.forEach(contribution => {
      switch (contribution.type) {
        case 'report':
          points += pointsSystem.report;
          if (contribution.verified) {
            points += 5; // Bonus por reporte verificado
          }
          break;
        case 'verification':
          points += pointsSystem.verification;
          break;
        case 'chat':
          if (contribution.helpful) {
            points += pointsSystem.helpfulChat;
          }
          break;
        case 'route':
          points += pointsSystem.routeSharing;
          if (contribution.used) {
            points += 5; // Bonus si otros usuarios usaron la ruta
          }
          break;
      }
    });

    return points;
  }
}

export default new AIService();
