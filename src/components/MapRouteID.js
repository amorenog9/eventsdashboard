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
  const [showRoute, setShowRoute] = useState(false);
  const [showMarkers, setShowMarkers] = useState(false);
  const [messagesArray, setMessagesArray] = useState([]); // mensajes de los ids seleccionados en el dashboard
  
  const [arraySubmits, setArraySubmits] = useState([]); // conjunto de arrays de los que hemos hecho click en las tablas (ids)

  useEffect(() => { // Use effect para saber cuantos ids hay, para hacer las tablas, y ordenar en cada tabla las diferentes filas de ese ID. También almacenaramos las coordenadas en otro array de arrays
    
    // Creacion de un array de arrays donde dentro de cada array estan los valores para cada ID
    const objects = messagesTimestamp.map(item => JSON.parse(item));
    // Creamos un objeto para almacenar los valores únicos de los campos id
    const idValues = {};
    // Recorremos el array para obtener los valores únicos de los campos id
    for (let i = 0; i < objects.length; i++) {
      const id = objects[i].id;
      idValues[id] = true;
    }
    // Obtenemos el número total de campos id diferentes
    const numIds = Object.keys(idValues).length;
    // Creamos tantos arrays como campos id diferentes haya
    let messagesOrderedByID = []
    for (const id in idValues) {
      const idArray = [];
      for (let i = 0; i < objects.length; i++) {
        if (objects[i].id === id) {
          idArray.push(objects[i]);
        }
      }
      //console.log(idArray);
      let idArrayString = idArray.map(item => JSON.stringify(item));
      messagesOrderedByID.push(idArrayString);
    }
    setMessagesArray(messagesOrderedByID); // array de arrays con los mensajes almacenados dentro de cada array


  }, [messagesTimestamp]); // Se actualiza con cada nuevo mensaje del consumer messages_from_timestamp_out







  useEffect(() => {
    // Fase de Inicializacion
    if (!map.current) {
      // Si el mapa no se ha inicializado,
      map.current = L.map(mapRef.current, { // Agregamos el mapa a la referencia
        center: [50.3, 22.5], // centro del mapa
        zoom: 4, // nivel de zoom inicial
      });

      // Agregar una capa base de OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map.current); // Agregamos al mapa la capa base
    }


    // Fase de limpieza
    // Eliminar los marcadores (puntos en el mapa) anteriores
    map.current.eachLayer((layer) => { // Iteramos sobre cada capa
      if (layer instanceof L.Marker) { // L.Marker es la clase que utiliza la libreria para representar markers
        map.current.removeLayer(layer); // Si la capa es un marker => Eliminalo
      }
    });

    // // Agregar los marcadores de los nuevos puntos - Para cada valor dentro del array
    // for (let i = coordinatesTimestamp.length - 1; i >= 0; i--) { // Recordar el orden, el evento más reciente está en la posición más baja del array [0] 
    //   const coordenada = coordinatesTimestamp[i]; // Se trata de un array [latitud, longitud]
    //   const index = coordinatesTimestamp.length - i; // Ejemplo: Array con 8 valores. Estamos analizando el primer evento => index= 8-8 = 0
    //   const offset = index * 0.0001; // offset para evitar superposiciones
    //   const marker = L.marker([coordenada[0] + offset, coordenada[1] + offset], { // Creamos el marcador con las coordenadas y la imagen seleccionada
    //     icon: L.icon({
    //       iconUrl: redIcon,
    //       iconSize: [25, 25],
    //       iconAnchor: [12, 25],
    //       popupAnchor: [1, -34],
    //     })
    //   });
    //   marker.addTo(map.current); // Añadimos el marcador al mapa

    //    // Si presionamos en el boton que nos permite ver enumerados los macadores
    //   if (showMarkers) {
    //     marker.bindTooltip(`${index}`, { // Incluimos el numero de evento que corresponde. Para ello hacemos uso de la variable index (que crea un mensaje emergente (tooltip))
    //       permanent: true,
    //       direction: 'center',
    //       className: 'map-label'
    //     });
    //   }
    // }


    // Arreglamos la variable arraySubmits para que no tenga el indice dentro de cada subarray
    const arraySubmitsNoID = arraySubmits.map((array) => {
      return array.slice(1); //eliminamos de cada subarray la primera posicion (el indice)
    });


    // Agregar los marcadores de los nuevos puntos - Para cada valor dentro del array


    // for(let j = 0; j < messagesArrayCoordinates.length; j++ ){
    //   for (let i = messagesArrayCoordinates[j].length - 1; i >= 0; i--) { // Recordar el orden, el evento más reciente está en la posición más baja del array [0] 
    //     const coordenada = messagesArrayCoordinates[j][i]; // Se trata de un array [latitud, longitud]
    //     const index = messagesArrayCoordinates[j].length - i; // Ejemplo: Array con 8 valores. Estamos analizando el primer evento => index= 8-8 = 0
    //     const offset = index * 0.0001; // offset para evitar superposiciones
    //     const marker = L.marker([coordenada[0] + offset, coordenada[1] + offset], { // Creamos el marcador con las coordenadas y la imagen seleccionada
    //       icon: L.icon({
    //         iconUrl: redIcon,
    //         iconSize: [25, 25],
    //         iconAnchor: [12, 25],
    //         popupAnchor: [1, -34],
    //       })
    //     });
    //     marker.addTo(map.current); // Añadimos el marcador al mapa

    //     // Si presionamos en el boton que nos permite ver enumerados los macadores
    //     if (showMarkers) {
    //       marker.bindTooltip(`${index}`, { // Incluimos el numero de evento que corresponde. Para ello hacemos uso de la variable index (que crea un mensaje emergente (tooltip))
    //         permanent: true,
    //         direction: 'center',
    //         className: 'map-label'
    //       });
    //     }
    // }}



    for(let j = 0; j < arraySubmitsNoID.length; j++ ){
      for (let i = arraySubmitsNoID[j].length - 1; i >= 0; i--) { // Recordar el orden, el evento más reciente está en la posición más baja del array [0] 
        const coordenada = arraySubmitsNoID[j][i]; // Se trata de un array [latitud, longitud]
        const index = arraySubmitsNoID[j].length - i; // Ejemplo: Array con 8 valores. Estamos analizando el primer evento => index= 8-8 = 0
        const offset = index * 0.0001; // offset para evitar superposiciones
        const marker = L.marker([coordenada[0] + offset, coordenada[1] + offset], { // Creamos el marcador con las coordenadas y la imagen seleccionada
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
          marker.bindTooltip(`${index}`, { // Incluimos el numero de evento que corresponde. Para ello hacemos uso de la variable index (que crea un mensaje emergente (tooltip))
            permanent: true,
            direction: 'center',
            className: 'map-label'
          });
        }
    }}


    const colors = ['red', 'blue', 'green', 'yellow', 'orange'];
    let colorIndex = 0;
    
    if (showRoute) {
      arraySubmitsNoID.forEach(array => {
        const lineCoords = array.map(coordenada => [coordenada[0], coordenada[1]]);
        const color = colors[colorIndex];
      
        polyline.current = L.polyline(lineCoords, {
          color: color,
          weight: 3,
          opacity: 0.5
        }).addTo(map.current);
      
        colorIndex = (colorIndex + 1) % colors.length;
      });
    } 
    
    else {
      if (polyline.current) {
        map.current.eachLayer(function(layer) {
          if (layer instanceof L.Polyline) {
            map.current.removeLayer(layer);
          }
        });
      }
    }



    // // Agregar la línea si el estado showRoute es true
    // if (showRoute) {
    //   // Array que toma [latitud, longitud] de coordinatesTimestamp
    //   const lineCoords = coordinatesTimestamp.map(coordenada => [coordenada[0], coordenada[1]]);

    //   // Crear polilínea (linea que une varios puntos en el mapa) 
    //   if (polyline.current) {
    //     map.current.removeLayer(polyline.current); // Eliminar la polilínea anterior si ya existe, para que no se superponga
    //   }
    //   polyline.current = L.polyline(lineCoords, { // Creamos la polilinea a partir del array de coordendas lineCoords con ciertas caracteristicas
    //     color: 'red',
    //     weight: 3,
    //     opacity: 0.5
    //   }).addTo(map.current); // Añadimos la polilinea al mapa
    // } 
    
    // else {
    //   if (polyline.current) {
    //     map.current.removeLayer(polyline.current); // Eliminar la polilínea si el estado showRoute es false
    //   }
    // }
  }, [showRoute, showMarkers, arraySubmits]); // Use effect que saltara con la actualización de estas variables


  // Cambiar el estado de los botones
  const handleToggleRoute = () => {
    setShowRoute(!showRoute);
  }

  const handleToggleMarkers = () => {
    setShowMarkers(!showMarkers);
  }


  function recibirDatos(datos) {
    setArraySubmits([...arraySubmits, datos]); //añadimos los datos al array arraySubmits
  }

  function eliminarDatos(i) {

    const newArray = [...arraySubmits];
    const nuevoArray = newArray.filter((elemento) => {
      return elemento[0] !== i;
    });

    setArraySubmits(nuevoArray);

  }



  return (
    <div>
      <div ref={mapRef} style={{ width: '100%', height: '500px' }} />

      <button onClick={handleToggleRoute}>{showRoute ? 'Ocultar ruta Ids' : 'Mostrar ruta Ids'}</button>
      <button onClick={handleToggleMarkers}>
        {showMarkers ? 'Ocultar orden Ids' : 'Mostrar orden Ids'}
      </button>


      <h1 style={{textAlign: "center"}}>Streaming de eventos filtrados por ID</h1>
      <div class="tablas" style={{padding: "20px 0"}}>
        {messagesArray.map((array, index) => (
          <TableID key={index} props={{index: index, messages: array, arraySubmits: arraySubmits,enviarDatos: recibirDatos, eliminarDatos: eliminarDatos}}/>
        ))}

      </div>
    
    </div>


  );
}

export default MapRouteID;




