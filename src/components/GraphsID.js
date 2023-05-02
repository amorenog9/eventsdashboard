import React, { useEffect, useRef, useState } from 'react';



import './../css/GraphsID.css';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';


import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import { getYear, getMonth, format } from 'date-fns'



ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);



function GraphsID(props) {

  const messagesTimestamp  = props.messagesTimestamp;
  
  function range(start, end) {
    return Array(end - start + 1)
      .fill()
      .map((_, index) => start + index);
  }

    // Deserializar el string JSON en un objeto JavaScript
    const parseMessage = (message) => {
      return JSON.parse(message);
    }


  const [startDate, setStartDate] = useState(new Date());
  const [startDay, setStartDay] = useState(0); // dia seleccionado en el input
  const [startMonth, setStartMonth] = useState(0); // mes seleccionado en el input
  const [startYear, setStartYear] = useState(0); // Año seleccionado en el input
  const [data, setData] = useState([]); // Año seleccionado en el input


  // Parametros DatePicker
  const years = range(1990, getYear(new Date()) + 1, 1);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  // Parametros DatePicker



  // Envio de datos utilizando el formulario
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(`La fecha seleccionada es: ${format(startDate, 'dd/MM/yyyy')}`);
    const yearMonthDate = format(startDate, 'dd/MM/yyyy').split("/");

    const year = parseInt(yearMonthDate[2]); // 19**- 20**
    const month = parseInt(yearMonthDate[1]); // 1-12
    const day = parseInt(yearMonthDate[0]); // 1-31

    setStartDay(day);
    setStartMonth(month);
    setStartYear(year);

  };



  const events = [
    { "id": "492472017-01-10", "event_type": "LLEGADA DE VAGONES", "date_event": 1483939500000, "lat": 49.4308861, "lng": 7.6620206, "location": "EINSIEDLERHOF" },
    { "id": "492472017-01-10", "event_type": "LLEGADA DE VAGONES", "date_event": 1483939500000, "lat": 49.4308861, "lng": 7.6620206, "location": "EINSIEDLERHOF" },
    { "id": "492472017-01-10", "date_event": 1483812000000, "event_type": "PASO DE VAGONES", "location": "SCHIRNDING GRENZE", "lat": 50.077295, "lng": 12.2294735 },
    { "id": "492472017-01-10", "date_event": 1493639200000, "event_type": "SALIDA DE VAGONES", "location": "MLADA BOLESLAV MESTO", "lat": 50.419207, "lng": 14.9162087 }
  ];



  // Quiero hacer una grafica que me permita en funcion de si esta activado, mes/semana/dia
  // Me imprima, por horas, dias o semanas
  // {2017: {…}}
  // groupedEvents = {2017: 5: 31: 40}
  function groupEvents(events) {

    //console.log(events)
    const groupedEvents = {};


    events.forEach(event => {
      const parsedEvent = parseMessage(event); //añadido con useEffect
      const date = new Date(parsedEvent.date_event);
      const yearMonthDate = date.toLocaleDateString().split("/");
      const year = parseInt(yearMonthDate[2]); // 19**- 20**
      const month = parseInt(yearMonthDate[1]); // 1-12
      const day = parseInt(yearMonthDate[0]); // 1-31

      const hour = date.getHours(); // hora del dia

      console.log(hour)


      if (!groupedEvents[year]) {
        groupedEvents[year] = {}; // si no existe creamos un diccionario para ese dia
      }

      if (!groupedEvents[year][month]) { // cada dia va a tener 0-23 valores el diccionario
        groupedEvents[year][month] = {};
      }

      if (!groupedEvents[year][month][day]) { // cada dia va a tener 0-23 valores el diccionario
        groupedEvents[year][month][day] = {};
      }
      if (!groupedEvents[year][month][day][hour]) { // cada dia va a tener 0-23 valores el diccionario
        groupedEvents[year][month][day][hour] = 0;
      }

      groupedEvents[year][month][day][hour] = groupedEvents[year][month][day][hour] + 1; //sumo 1 en la casilla que sea

    });

    return groupedEvents;


  }




  function createDay(groupedEvents, year, month, day) {
    if (groupedEvents && groupedEvents[year] && groupedEvents[year][month] && groupedEvents[year][month][day]) { // si no hay diccionario año-mes-dia-hora, entonces devuelves un [0,0..., 0]
      const hourArray = Array(24).fill(0); // Creamos un array con 24 índices y los inicializamos a 0
      const hours = groupedEvents[year][month][day]
      for (let hour in hours) {
        hourArray[parseInt(hour)] = hours[hour]; // Establecemos el valor correspondiente en el array
      }
      return hourArray
    } else {
      return Array(24).fill(0);
    }
  }

  // let groupedEvents = groupEvents(events)
  // //console.log(groupedEvents)
  // //let dayEvents = createDay(groupedEvents, 2017, 1, 5)
  // let dayEvents = createDay(groupedEvents, startYear, startMonth, startDay) // parametros que estoy modificando
  // //console.log(dayEvents)

  const dayLabelArray = ["00:00-01:00", "01:00-02:00", "02:00-03:00", "03:00-04:00", "04:00-05:00", "05:00-06:00", "06:00-07:00", "07:00-08:00", "08:00-09:00", "09:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-13:00", "13:00-14:00", "14:00-15:00", "15:00-16:00", "16:00-17:00", "17:00-18:00", "18:00-19:00", "19:00-20:00", "20:00-21:00", "21:00-22:00", "22:00-23:00", "23:00-00:00"];

  
  // const data = {
  //   labels: dayLabelArray,
  //   datasets: [
  //     {
  //       label: 'Eventos',
  //       data: dayEvents,
  //       backgroundColor: 'rgba(75,192,192,0.4)',
  //       borderColor: 'rgba(75,192,192,1)',
  //       borderWidth: 1,
  //     },
  //   ],
  // };


  const options = {
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Número de eventos',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Hora del día',
        },
      },
    },
  };

  useEffect(() => {
    console.log(messagesTimestamp)

    let groupedEvents = groupEvents(messagesTimestamp);
    //console.log(groupedEvents)
    //let dayEvents = createDay(groupedEvents, 2017, 1, 5)
    let dayEvents = createDay(groupedEvents, startYear, startMonth, startDay) // parametros que estoy modificando

    const dataEvents = {
      labels: dayLabelArray,
      datasets: [
        {
          label: 'Eventos',
          data: dayEvents,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          borderWidth: 1,
        },
      ],
    };

    setData(dataEvents)

    console.log(data)


  }, [messagesTimestamp]); // Se actualiza con cada nuevo mensaje del consumer messages_from_timestamp_out




// https://reactdatepicker.com/
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Fecha a filtrar:</label>
          <DatePicker
            renderCustomHeader={({
              date,
              changeYear,
              changeMonth,
              decreaseMonth,
              increaseMonth,
              prevMonthButtonDisabled,
              nextMonthButtonDisabled,
            }) => (
              <div
                style={{
                  margin: 10,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
                  {"<"}
                </button>
                <select
                  value={getYear(date)}
                  onChange={({ target: { value } }) => changeYear(value)}
                >
                  {years.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>

                <select
                  value={months[getMonth(date)]}
                  onChange={({ target: { value } }) =>
                    changeMonth(months.indexOf(value))
                  }
                >
                  {months.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>

                <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
                  {">"}
                </button>
              </div>
            )}
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="yyyy/MM/dd"

          />      
          
          </div>

        <div>
          <button type="submit">Filtrar</button>
        </div>
      </form>

     <p>{data}</p>

      <Line data={data} options={options} />





    </div>

  );
}

export default GraphsID;




