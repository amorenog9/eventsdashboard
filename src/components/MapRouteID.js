import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import redIcon from '../images/gpsIcon.png';

function MapRouteID({ props }) {
  const { coordinatesTimestamp } = props;

  const mapRef = useRef(null);
  const map = useRef(null);
  const [showRoute, setShowRoute] = useState(false);
  const [showMarkers, setShowMarkers] = useState(false);

  useEffect(() => {
    if (!map.current) {
      // Si el mapa no se ha inicializado, inicializarlo
      map.current = L.map(mapRef.current, {
        center: [51.5124, 7.4632], // centro del mapa
        zoom: 4, // nivel de zoom inicial
      });

      // Agregar una capa base de OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map.current);
    }

    // Eliminar los marcadores anteriores
    map.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.current.removeLayer(layer);
      }
    });

    // Agregar los marcadores de los nuevos puntos
    coordinatesTimestamp.forEach((coordenada, index) => {
      const offset = index * 0.0001; // pequeño offset para evitar superposiciones
      const marker = L.marker([coordenada[0] + offset, coordenada[1] + offset], {
        icon: L.icon({
          iconUrl: redIcon,
          iconSize: [25, 25],
          iconAnchor: [12, 25],
          popupAnchor: [1, -34],
        })
      });
      marker.addTo(map.current);
      if (showMarkers) {
        marker.bindTooltip(`${index+1}`, {
          permanent: true,
          direction: 'center',
          className: 'map-label'
        });
      }
    });

    // Agregar la línea si el estado showRoute es true
    if (showRoute) {
      // Crear arreglo de coordenadas para la línea
      const lineCoords = coordinatesTimestamp.map(coordenada => [coordenada[0], coordenada[1]]);

      // Crear polilínea y agregarla al mapa
      L.polyline(lineCoords, {
        color: 'red',
        weight: 3,
        opacity: 0.5
      }).addTo(map.current);
    }

  }, [coordinatesTimestamp, showRoute, showMarkers]);

  const handleToggleRoute = () => {
    setShowRoute(!showRoute);
  }

  const handleToggleMarkers = () => {
    setShowMarkers(!showMarkers);
  }

  return (
    <div>
      <div ref={mapRef} style={{ width: '100%', height: '500px' }} />
      <button onClick={handleToggleRoute}>{showRoute ? 'Ocultar ruta' : 'Mostrar ruta'}</button>
      <button onClick={handleToggleMarkers}>{showMarkers ? 'Ocultar orden' : 'Mostrar orden'}</button>
    </div>
  );
}

export default MapRouteID;




