import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import redIcon from '../images/gpsIcon.png'
import TableID from './TableID';

function MapRouteID({ props }) {
  const { messagesTimestamp } = props;

  const mapRef = useRef(null);
  const map = useRef(null);
  const polyline = useRef(null);

  const [showRoute, setShowRoute] = useState(false); // para mostrar las polilineas
  const [showMarkers, setShowMarkers] = useState(false); // para mostrar los numeros encima de la coordenada
  const [showPoints, setShowPoints] = useState(true); // para mostrar los puntos (coordenadas) en el mapa

  const [messagesArray, setMessagesArray] = useState([]); // mensajes de los ids seleccionados en el dashboard (array de arrays donde cada array tiene dentro los mensajes referentes a cada ID)

  const [arraySubmitsDic, setArraySubmitsDic] = useState({}); // diccionario con los ids seleccionados {0: [0.0, 2.5], [...], 1: [0.0, 2.5], [...]}


  // Saber cuantos ids hay, para hacer las tablas, y ordenar en cada tabla las diferentes filas de ese ID.
  useEffect(() => {

    const idValues = {};
    for (let i = 0; i < messagesTimestamp.length; i++) {
      const object = JSON.parse(messagesTimestamp[i]);
      const id = object.id;
      if (!idValues[id]) {
        idValues[id] = [];
      }
      idValues[id].push(object);
    }
    const messagesOrderedByID = Object.values(idValues).map(messagesArray => messagesArray.map(message => JSON.stringify(message)));

    setMessagesArray(messagesOrderedByID.reverse()); // array de arrays con los mensajes almacenados dentro de cada array (ordenados por ID)


  }, [messagesTimestamp]); // Se actualiza con cada nuevo mensaje del consumer messages_from_timestamp_out



  // Visualizacion del mapa
  useEffect(() => {

    // Inicializacion
    // Si el mapa no se ha inicializado, agregamos el mapa a la referencia
    if (!map.current) {
      map.current = L.map(mapRef.current, {
        center: [50.3, 22.5],
        zoom: 4,
      });
      // Agregar una capa base de OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map.current); // Agregamos al mapa la capa base
    }


    // Limpieza
    // Eliminar los marcadores (puntos en el mapa) anteriores
    map.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.current.removeLayer(layer);
      }
    });

    if (showPoints) { 

      for (let key in arraySubmitsDic) {
        const arrayCoordinatesID = arraySubmitsDic[key];
        for (let i = arrayCoordinatesID.length - 1; i >= 0; i--) { // Recordar el orden, el evento más reciente está en la posición más baja del array [0], para cada par de coordendas
          const coordenada = arrayCoordinatesID[i]; // Se trata de un array [latitud, longitud]
          const index = arrayCoordinatesID.length - i; // Ejemplo: Array con 8 valores. Estamos analizando el primer evento => index= 8-8 = 0
          const offset = index * 0.0001; // offset para evitar superposiciones
          // Creamos el marcador con las coordenadas y la imagen seleccionada
          const marker = L.marker([coordenada[0] + offset, coordenada[1] + offset], {
            icon: L.icon({
              iconUrl: redIcon,
              iconSize: [25, 25],
              iconAnchor: [12, 25],
              popupAnchor: [1, -34],
            })
          });
          marker.addTo(map.current); // Añadimos el marcador al mapa

          // Si presionamos en el boton que nos permite ver enumerados los macadores
          if (showMarkers) {
            marker.bindTooltip(`${index}`, {
              permanent: true,
              direction: 'center',
              className: 'map-label'
            });
          }
        }
      }
    }

    const colors = ['red', 'purple', 'blue', 'green', 'black', 'yellow', 'grey', 'pink', 'brown', 'magenta']; // Conjunto de colores a utilizar
    const colorIndexMap = {}; // asignamos un color fijo a cada array dentro de arraySubmitsDict
    let colorIndex = 0; // Se utilizara para entrar en colors[colorIndex] => dar nuevos colores a cada nuevo array

    if (showRoute && showPoints) { 
      // Elimino las polineas existentes, util por si desactivo "Mostrar coordenas" en un array
      if (polyline.current) {
        map.current.eachLayer(function (layer) {
          if (layer instanceof L.Polyline) {
            map.current.removeLayer(layer);
          }
        });
      }

      Object.values(arraySubmitsDic).forEach(array => {

        const lineCoords = array.map(coordenada => [coordenada[0], coordenada[1]]);
        let color = colorIndexMap[array] || colors[colorIndex]; // aignamos un color a cada array (si ya existe, colorIndexMap) sino, el siguiente en colors

        if (!colorIndexMap[array]) {
          colorIndexMap[array] = color; //asginamos en colorIndexMap el nuevo color para este array
          colorIndex = (colorIndex + 1) % colors.length; // sumo 1 a colorIndex 
        }
        // Creo una nueva polilinea
        polyline.current = L.polyline(lineCoords, { // hago al polilinea
          color: color,
          weight: 3,
          opacity: 0.5
        }).addTo(map.current);
      });
    }

    // Elimino las polinea existente
    else {
      if (polyline.current) {
        map.current.eachLayer(function (layer) {
          if (layer instanceof L.Polyline) {
            map.current.removeLayer(layer);
          }
        });
      }
    }

  }, [showRoute, showMarkers, arraySubmitsDic]);

  // Cambiar el estado de los botones
  const handleToggleRoute = () => {
    setShowRoute(!showRoute);
  }
  const handleToggleMarkers = () => {
    setShowMarkers(!showMarkers);
  }

  const handleTogglePoints = () => {
    setShowPoints(!showPoints);
    
  }


  // Recibir datos de componentes TableID hijos y lo almaceno en arraySubmitsDict
  function recibirDatos(datos, i) {
    setArraySubmitsDic(prevState => {
      return {
        ...prevState,
        [i]: datos
      };
    });
  }

  // Eliminar datos de componentes TableID hijos
  function eliminarDatos(i) {
    setArraySubmitsDic(prevArraySubmitsDic => {
      const updatedArraySubmitsDic = { ...prevArraySubmitsDic };
      delete updatedArraySubmitsDic[i];
      return updatedArraySubmitsDic;
    });
  }


  const lengths = Object.values(arraySubmitsDic).map(value => value.length);

  return (
    <div>
      <div ref={mapRef} style={{ width: '100%', height: '500px' }} />

      <button onClick={handleToggleRoute}>{showRoute ? 'Ocultar ruta Ids' : 'Mostrar ruta Ids'}</button>
      <button onClick={handleToggleMarkers}>
        {showMarkers ? 'Ocultar orden Ids' : 'Mostrar orden Ids'}
      </button>

      <button onClick={handleTogglePoints}>
        {showPoints ? 'Eliminar puntos Mapa' : 'Incluir puntos en mapa'}
      </button>

      <h1 style={{ textAlign: "center" }}>Streaming de eventos filtrados por ID</h1>
      <div class="tablas" style={{ padding: "20px 0" }}>
        {messagesArray.map((array, index) => (
          <TableID key={index} props={{ index: index, messages: array, arraySubmitsDic: arraySubmitsDic, showPoints: showPoints , enviarDatos: recibirDatos, eliminarDatos: eliminarDatos }} />
        ))}

      </div>

      <h3>Numero de claves: {Object.keys(arraySubmitsDic).length}</h3>
      {Object.keys(arraySubmitsDic).map((key, i) => (
        <p key={i}>
          {key}: {lengths[i]}
        </p>
      ))}

    </div>

  );
}

export default MapRouteID;




