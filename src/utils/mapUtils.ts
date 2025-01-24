import { DangerZone, Incident } from '../types/map';

// Radio mínimo y máximo para las zonas de peligro (en metros)
const MIN_ZONE_RADIUS = 100;
const MAX_ZONE_RADIUS = 1000;

// Umbral de incidentes para determinar el nivel de riesgo
const RISK_THRESHOLDS = {
  HIGH: 5,    // 5 o más incidentes en la zona
  MEDIUM: 3,  // 3-4 incidentes en la zona
  LOW: 1      // 1-2 incidentes en la zona
};

// Función para calcular la distancia entre dos puntos (Haversine)
function getDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Radio de la Tierra en metros
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

// Función para determinar el tipo de zona basado en el número de incidentes
function getZoneType(incidentCount: number): DangerZone['type'] {
  if (incidentCount >= RISK_THRESHOLDS.HIGH) return 'high';
  if (incidentCount >= RISK_THRESHOLDS.MEDIUM) return 'medium';
  return 'low';
}

// Función para generar una descripción de la zona
function generateZoneDescription(
  incidentCount: number,
  incidents: Incident[],
  type: DangerZone['type']
): string {
  const timeRange = 24 * 60 * 60 * 1000; // 24 horas en milisegundos
  const recentIncidents = incidents.filter(
    inc => Date.now() - inc.timestamp < timeRange
  );

  const typeText = {
    high: 'Alta concentración',
    medium: 'Concentración moderada',
    low: 'Baja concentración'
  }[type];

  return `${typeText} de incidentes en esta zona.\n${incidentCount} incidentes totales.\n${recentIncidents.length} en las últimas 24 horas.`;
}

// Función principal para calcular las zonas de peligro
export function calculateDangerZones(incidents: Incident[]): DangerZone[] {
  if (incidents.length === 0) return [];

  const zones: DangerZone[] = [];
  const processedIncidents = new Set<string>();

  // Ordenar incidentes por timestamp (más recientes primero)
  const sortedIncidents = [...incidents].sort((a, b) => b.timestamp - a.timestamp);

  for (const incident of sortedIncidents) {
    if (processedIncidents.has(incident.id)) continue;

    // Encontrar incidentes cercanos
    const nearbyIncidents = incidents.filter(inc => {
      if (processedIncidents.has(inc.id)) return false;
      const distance = getDistance(
        incident.position[0],
        incident.position[1],
        inc.position[0],
        inc.position[1]
      );
      return distance <= MAX_ZONE_RADIUS;
    });

    if (nearbyIncidents.length >= RISK_THRESHOLDS.LOW) {
      // Calcular el centro de la zona
      const center: [number, number] = [
        nearbyIncidents.reduce((sum, inc) => sum + inc.position[0], 0) / nearbyIncidents.length,
        nearbyIncidents.reduce((sum, inc) => sum + inc.position[1], 0) / nearbyIncidents.length
      ];

      // Calcular el radio basado en la distribución de incidentes
      const radius = Math.min(
        Math.max(
          ...nearbyIncidents.map(inc =>
            getDistance(center[0], center[1], inc.position[0], inc.position[1])
          )
        ) + 50, // Añadir 50 metros de margen
        MAX_ZONE_RADIUS
      );

      const type = getZoneType(nearbyIncidents.length);
      const description = generateZoneDescription(nearbyIncidents.length, nearbyIncidents, type);

      zones.push({
        id: `zone-${zones.length + 1}`,
        center,
        radius: Math.max(radius, MIN_ZONE_RADIUS),
        type,
        description,
        reports: nearbyIncidents.length
      });

      // Marcar los incidentes como procesados
      nearbyIncidents.forEach(inc => processedIncidents.add(inc.id));
    }
  }

  return zones;
}
