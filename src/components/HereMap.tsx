import React, { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { HERE_CONFIG } from '../config/hereConfig';

interface DangerZone {
  id: string;
  center: [number, number];
  radius: number;
  type: 'high' | 'medium' | 'low';
  description: string;
  reports: number;
}

interface Incident {
  id: string;
  position: [number, number];
  type: 'robbery' | 'assault' | 'suspicious' | 'other';
  timestamp: number;
  description: string;
  verified: boolean;
}

interface HereMapProps {
  center: [number, number];
  zoom: number;
  incidents?: Incident[];
  dangerZones?: DangerZone[];
  onMapClick?: (coords: { lat: number; lng: number }) => void;
  onIncidentClick?: (incident: Incident) => void;
  onZoneClick?: (zone: DangerZone) => void;
  showTraffic?: boolean;
  mapStyle?: 'day' | 'night';
  userHeading?: number;
}

const HereMap: React.FC<HereMapProps> = ({
  center,
  zoom,
  incidents = [],
  dangerZones = [],
  onMapClick,
  onIncidentClick,
  onZoneClick,
  showTraffic = true,
  mapStyle = 'day',
  userHeading = 0
}) => {
  const webViewRef = useRef<WebView>(null);

  const getIncidentIcon = (type: string) => {
    switch (type) {
      case 'robbery': return '🚨';
      case 'assault': return '⚠️';
      case 'suspicious': return '👁️';
      default: return '❗';
    }
  };

  const getDangerZoneColor = (type: string) => {
    switch (type) {
      case 'high': return '#FF0000';
      case 'medium': return '#FFA500';
      case 'low': return '#FFFF00';
      default: return '#FF0000';
    }
  };

  const generateMapHTML = () => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://js.api.here.com/v3/3.1/mapsjs-core.js"></script>
        <script src="https://js.api.here.com/v3/3.1/mapsjs-service.js"></script>
        <script src="https://js.api.here.com/v3/3.1/mapsjs-ui.js"></script>
        <script src="https://js.api.here.com/v3/3.1/mapsjs-mapevents.js"></script>
        <link rel="stylesheet" type="text/css" href="https://js.api.here.com/v3/3.1/mapsjs-ui.css" />
        <style>
          body, html, #mapContainer { 
            margin: 0; 
            padding: 0;
            width: 100%;
            height: 100%;
          }
          .H_ib_body {
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 10px;
            border-radius: 8px;
          }
          .danger-zone-info {
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 12px;
            border-radius: 8px;
            max-width: 200px;
          }
          .incident-marker {
            font-size: 24px;
            text-shadow: 2px 2px 2px rgba(0,0,0,0.5);
            cursor: pointer;
          }
          .verified-badge {
            position: absolute;
            bottom: -5px;
            right: -5px;
            background: #4CAF50;
            border-radius: 50%;
            width: 12px;
            height: 12px;
            border: 2px solid white;
          }
        </style>
      </head>
      <body>
        <div id="mapContainer"></div>
        <script>
          const platform = new H.service.Platform({
            apikey: '${HERE_CONFIG.API_KEY}'
          });

          const defaultLayers = platform.createDefaultLayers();
          const map = new H.Map(
            document.getElementById('mapContainer'),
            defaultLayers.vector.normal.map,
            {
              center: { lat: ${center[0]}, lng: ${center[1]} },
              zoom: ${zoom},
              pixelRatio: window.devicePixelRatio || 1
            }
          );

          // Configurar estilo del mapa
          const mapStyle = '${mapStyle}';
          const provider = platform.getMapTileService({
            type: 'base'
          });
          const layer = provider.createTileLayer(
            'maptile',
            mapStyle === 'night' ? 'normal.night' : 'normal.day',
            256,
            'png8'
          );
          map.setBaseLayer(layer);

          window.addEventListener('resize', () => map.getViewPort().resize());

          const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
          const ui = H.ui.UI.createDefault(map, defaultLayers);

          // Agregar zonas de peligro
          const dangerZones = ${JSON.stringify(dangerZones)};
          dangerZones.forEach(zone => {
            const circle = new H.map.Circle(
              { lat: zone.center[0], lng: zone.center[1] },
              zone.radius,
              {
                style: {
                  strokeColor: '${getDangerZoneColor("high")}',
                  lineWidth: 2,
                  fillColor: '${getDangerZoneColor("high")}',
                  fillOpacity: 0.3
                }
              }
            );

            circle.setData({
              type: 'dangerZone',
              data: zone
            });
            
            map.addObject(circle);
          });

          // Agregar incidentes
          const incidents = ${JSON.stringify(incidents)};
          incidents.forEach(inc => {
            const html = \`
              <div class="incident-marker">
                ${getIncidentIcon('robbery')}
                \${inc.verified ? '<div class="verified-badge"></div>' : ''}
              </div>
            \`;
            
            const icon = new H.map.DomIcon(html);
            const marker = new H.map.DomMarker(
              { lat: inc.position[0], lng: inc.position[1] },
              { icon }
            );

            marker.setData({
              type: 'incident',
              data: inc
            });
            
            map.addObject(marker);
          });

          // Mostrar tráfico si está habilitado
          if (${showTraffic}) {
            const traffic = platform.getTrafficService();
            const trafficLayer = traffic.createTileLayer({ max: 15 });
            map.addLayer(trafficLayer);
          }

          // Agregar flecha de dirección del usuario
          const userHeading = ${userHeading};
          if (userHeading !== 0) {
            const userMarker = new H.map.Marker(
              { lat: ${center[0]}, lng: ${center[1]} },
              {
                icon: new H.map.Icon(\`
                  <svg width="32" height="32" viewBox="0 0 32 32">
                    <path
                      transform="rotate(\${userHeading} 16 16)"
                      d="M16 0 L32 32 L16 24 L0 32 Z"
                      fill="#007AFF"
                      stroke="white"
                      stroke-width="1"
                    />
                  </svg>
                \`)
              }
            );
            map.addObject(userMarker);
          }

          // Manejar clics
          map.addEventListener('tap', (evt) => {
            const target = evt.target;
            if (target instanceof H.map.Circle) {
              const data = target.getData();
              if (data && data.type === 'dangerZone') {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'zoneClick',
                  zone: data.data
                }));
              }
            } else if (target instanceof H.map.DomMarker) {
              const data = target.getData();
              if (data && data.type === 'incident') {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'incidentClick',
                  incident: data.data
                }));
              }
            } else {
              const coords = map.screenToGeo(
                evt.currentPointer.viewportX,
                evt.currentPointer.viewportY
              );
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'mapClick',
                lat: coords.lat,
                lng: coords.lng
              }));
            }
          });

          window.mapInstance = map;
        </script>
      </body>
    </html>
  `;

  const onMessage = (event: { nativeEvent: { data: string } }) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      switch (data.type) {
        case 'mapClick':
          onMapClick?.({ lat: data.lat, lng: data.lng });
          break;
        case 'incidentClick':
          onIncidentClick?.(data.incident);
          break;
        case 'zoneClick':
          onZoneClick?.(data.zone);
          break;
      }
    } catch (error) {
      console.error('Error parsing message from map:', error);
    }
  };

  const injectScript = (script: string) => {
    webViewRef.current?.injectJavaScript(`
      try {
        ${script}
        true;
      } catch (error) {
        console.error(error);
        false;
      }
    `);
  };

  useEffect(() => {
    const updateIncidents = () => {
      const script = `
        if (window.mapInstance) {
          const markers = window.mapInstance.getObjects().filter(obj => obj instanceof H.map.DomMarker);
          window.mapInstance.removeObjects(markers);
          ${JSON.stringify(incidents)}.forEach(inc => {
            const html = \`
              <div class="incident-marker">
                ${getIncidentIcon('robbery')}
                \${inc.verified ? '<div class="verified-badge"></div>' : ''}
              </div>
            \`;
            const icon = new H.map.DomIcon(html);
            const marker = new H.map.DomMarker(
              { lat: inc.position[0], lng: inc.position[1] },
              { icon }
            );
            marker.setData({
              type: 'incident',
              data: inc
            });
            window.mapInstance.addObject(marker);
          });
        }
      `;
      injectScript(script);
    };
    updateIncidents();
  }, [incidents]);

  useEffect(() => {
    const updateZones = () => {
      const script = `
        if (window.mapInstance) {
          const circles = window.mapInstance.getObjects().filter(obj => obj instanceof H.map.Circle);
          window.mapInstance.removeObjects(circles);
          ${JSON.stringify(dangerZones)}.forEach(zone => {
            const circle = new H.map.Circle(
              { lat: zone.center[0], lng: zone.center[1] },
              zone.radius,
              {
                style: {
                  strokeColor: '${getDangerZoneColor("high")}',
                  lineWidth: 2,
                  fillColor: '${getDangerZoneColor("high")}',
                  fillOpacity: 0.3
                }
              }
            );
            circle.setData({
              type: 'dangerZone',
              data: zone
            });
            window.mapInstance.addObject(circle);
          });
        }
      `;
      injectScript(script);
    };
    updateZones();
  }, [dangerZones]);

  useEffect(() => {
    const updateCenter = () => {
      const script = `
        if (window.mapInstance) {
          window.mapInstance.setCenter({ lat: ${center[0]}, lng: ${center[1]} });
          window.mapInstance.setZoom(${zoom});
        }
      `;
      injectScript(script);
    };
    updateCenter();
  }, [center, zoom]);

  useEffect(() => {
    const updateStyle = () => {
      const script = `
        if (window.mapInstance) {
          const provider = platform.getMapTileService({
            type: 'base'
          });
          const layer = provider.createTileLayer(
            'maptile',
            '${mapStyle}' === 'night' ? 'normal.night' : 'normal.day',
            256,
            'png8'
          );
          window.mapInstance.setBaseLayer(layer);
        }
      `;
      injectScript(script);
    };
    updateStyle();
  }, [mapStyle]);

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ html: generateMapHTML() }}
        style={styles.map}
        onMessage={onMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        mixedContentMode="compatibility"
        allowFileAccess={true}
        geolocationEnabled={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    flex: 1,
  },
});

export default HereMap;
