import React, { useEffect, useRef, useState } from 'react';



import './../css/GraphsID.css';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';


import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import { getYear, getMonth, format } from 'date-fns'



ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);



function GraphsID(props) {

  const messagesTimestamp = props.messagesTimestamp;

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
  const [hourButton, setHourButton] = useState(true); // Boton para hacer grafica por horas
  const [dayButton, setDayButton] = useState(false); // Boton para hacer grafica por dias
  const [monthButton, setMonthButton] = useState(false); // Boton para hacer grafica por meses



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


  // Cambio de estados botones
  const handleDay = async (event) => {
    event.preventDefault();
    setHourButton(true);
    setDayButton(false);
    setMonthButton(false);
  };

  // Cambio de estados botones
  const handleWeek = async (event) => {
    event.preventDefault();
    setDayButton(true);
    setHourButton(false);
    setMonthButton(false);
  };

  // Cambio de estados botones
  const handleMonth = async (event) => {
    event.preventDefault();
    setMonthButton(true);
    setHourButton(false);
    setDayButton(false);
  };

  function groupEvents(events) {

    const groupedEvents = {};


    events.forEach(event => {
      const parsedEvent = parseMessage(event); //añadido con useEffect
      const date = new Date(parsedEvent.date_event);
      const yearMonthDate = date.toLocaleDateString().split("/");
      const year = parseInt(yearMonthDate[2]); // 19**- 20**
      const month = parseInt(yearMonthDate[1]); // 1-12
      const day = parseInt(yearMonthDate[0]); // 1-31

      //console.log(date)

      const hour = date.getHours(); // hora del dia

      //console.log(hour)


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

    //console.log(groupedEvents)

    return groupedEvents;


  }

  // Sumar valores dentro del diccionario
  function sumValues(obj) {
    let sum = 0;
    for (let key in obj) {
      if (typeof obj[key] === 'object') {
        sum += sumValues(obj[key]);
      } else {
        sum += obj[key];
      }
    }
    return sum;
  }

  function createHours(groupedEvents, year, month, day) {
    if (groupedEvents && groupedEvents[year] && groupedEvents[year][month] && groupedEvents[year][month][day]) { // si no hay diccionario año-mes-dia-hora, entonces devuelves un [0,0..., 0]
      const hourArray = Array(24).fill(0); // Creamos un array con 24 índices y los inicializamos a 0
      const hours = groupedEvents[year][month][day]
      for (let hour in hours) {
        hourArray[parseInt(hour)] = hours[hour]; // Establecemos el valor correspondiente en el array
      }
      return hourArray;
    } else {
      return Array(24).fill(0);
    }
  }


  function createDays(groupedEvents, year, month, day) {
    if (groupedEvents && groupedEvents[year] && groupedEvents[year][month]) { // si no hay diccionario año-mes-dia-hora, entonces devuelves un [0,0..., 0]
      const daysArray = Array(31).fill(0); // Creamos un array con 31 índices y los inicializamos a 0
      const days = groupedEvents[year][month]
      for (let day in days) {
        daysArray[parseInt(day - 1)] = sumValues(days[day]); //sumamos el numero de valores que tiene cada clave mes, le restamos 1 porque el dia 1 empieza en 1 en el diccionario
      }
      return daysArray;
    } else {
      return Array(31).fill(0);
    }
  }

  function createMonth(groupedEvents, year, month, day) {
    if (groupedEvents && groupedEvents[year]) { // si no hay diccionario año-mes-dia-hora, entonces devuelves un [0,0..., 0]
      const monthArray = Array(12).fill(0); // Creamos un array con 12 índices y los inicializamos a 0
      const months = groupedEvents[year]

      for (let month in months) {
        monthArray[parseInt(month - 1)] = sumValues(months[month]); // sumamos el numero de valores que tiene cada clave mes, le restamos 1 porque el mes enero empieza en 1 en el diccionario
      }
      return monthArray;

    } else {
      return Array(12).fill(0);
    }
  }


  const hourLabelArray = ["00:00-01:00", "01:00-02:00", "02:00-03:00", "03:00-04:00", "04:00-05:00", "05:00-06:00", "06:00-07:00", "07:00-08:00", "08:00-09:00", "09:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-13:00", "13:00-14:00", "14:00-15:00", "15:00-16:00", "16:00-17:00", "17:00-18:00", "18:00-19:00", "19:00-20:00", "20:00-21:00", "21:00-22:00", "22:00-23:00", "23:00-00:00"];

  const hourLabelColors = ['rgba(255, 99, 132, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(255, 206, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(153, 102, 255, 0.2)',
    'rgba(255, 150, 64, 0.2)',
    'rgba(255, 170, 64, 0.2)',
    'rgba(255, 199, 64, 0.2)',
    'rgba(23, 159, 87, 0.2)',
    'rgba(255, 159, 34, 0.2)',
    'rgba(23, 159, 2, 0.2)',
    'rgba(24, 159, 20, 0.2)',
    'rgba(102, 102, 255, 0.2)',
    'rgba(255, 51, 51, 0.2)',
    'rgba(255, 153, 51, 0.2)',
    'rgba(51, 153, 255, 0.2)',
    'rgba(255, 102, 102, 0.2)',
    'rgba(255, 204, 51, 0.2)',
    'rgba(51, 255, 51, 0.2)',
    'rgba(204, 255, 51, 0.2)',
    'rgba(51, 204, 255, 0.2)',
    'rgba(255, 51, 153, 0.2)',
    'rgba(153, 255, 51, 0.2)',
    'rgba(255, 102, 178, 0.2)',
  ]
  const dayLabelArray = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];
  const dayLabelColors = ['rgba(255, 99, 132, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(255, 206, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(153, 102, 255, 0.2)',
    'rgba(255, 150, 64, 0.2)',
    'rgba(255, 170, 64, 0.2)',
    'rgba(255, 199, 64, 0.2)',
    'rgba(23, 159, 87, 0.2)',
    'rgba(255, 159, 34, 0.2)',
    'rgba(23, 159, 2, 0.2)',
    'rgba(24, 159, 20, 0.2)',
    'rgba(102, 102, 255, 0.2)',
    'rgba(255, 51, 51, 0.2)',
    'rgba(255, 153, 51, 0.2)',
    'rgba(51, 153, 255, 0.2)',
    'rgba(255, 102, 102, 0.2)',
    'rgba(255, 204, 51, 0.2)',
    'rgba(51, 255, 51, 0.2)',
    'rgba(204, 255, 51, 0.2)',
    'rgba(51, 204, 255, 0.2)',
    'rgba(255, 51, 153, 0.2)',
    'rgba(153, 255, 51, 0.2)',
    'rgba(255, 102, 178, 0.2)',
    'rgba(255, 102, 178, 0.2)',
    'rgba(102, 255, 255, 0.2)',
    'rgba(255, 204, 204, 0.2)',
    'rgba(204, 255, 204, 0.2)',
    'rgba(255, 255, 102, 0.2)',
    'rgba(255, 102, 255, 0.2)',
    'rgba(102, 255, 102, 0.2)',
    'rgba(204, 204, 255, 0.2)'
  ]
  const monthLabelArray = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const monthLabelColors = ['rgba(255, 99, 132, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(255, 206, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(153, 102, 255, 0.2)',
    'rgba(255, 150, 64, 0.2)',
    'rgba(255, 170, 64, 0.2)',
    'rgba(255, 199, 64, 0.2)']
    
  // Inicializamos parametros iniciales para pintar el mapa por primera vez
  const options = {
    plugins: {
      legend: {
        display: true,
        labels: {
          color: 'black',
          font: {
            size: 15
          }
        }
      },
      title: { 
        display: true,
        text: 'Gráfico lineal',
        font: {
          size: 20
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Número de eventos',
          font: {
            size: 20
          }
        },
        ticks: {
          color: 'black',
          font: {
            size: 14
          }
        }
      },
      x: {
        title: {
          display: true,
          text: 'Hora del día',
          font: {
            size: 20
          }
        },
        ticks: {
          color: 'black',
          font: {
            size: 20
          }
        }
      },
    },
  };

  const dataEvents = {
    labels: hourLabelArray,
    datasets: [
      {
        label: 'Eventos',
        data: [],
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
      },
    ],
  };

  const dataEvents2 = {
    labels: hourLabelArray,
    datasets: [
      {
        label: "Eventos",
        data: [],
        backgroundColor: hourLabelColors,
        borderColor: hourLabelColors,
        borderWidth: 1,
      },
    ],
  };

  const options2 = {
    plugins: {
      title: {
        display: true,
        text: 'Gráfico Circular',
        font: {
          size: 20
        }
      },
      legend: {
        display: true,
        labels: {
          color: 'black',
          font: {
            size: 18
          }
        }
      },
      tooltip: {
        callbacks: { // añadir porcentajes
          label: function (context) {
            const label = context.label || "";
            const value = context.parsed || 0;
            const percentage = Math.round((value / context.dataset.data.reduce((a, b) => a + b) * 100));
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
      
    },
  };




  const [data, setData] = useState(dataEvents);
  const [pieData, setPieData] = useState(dataEvents2);
  const [optionsMap, setOptionsMap] = useState(options); // Boton para hacer grafica por mes
  const [pieOptions, setPieOptions] = useState(options2); // Boton para hacer grafica por mes



  useEffect(() => {
    let groupedEvents = groupEvents(messagesTimestamp);

    let labelArray = [];
    let labelColors = [];
    let textLabel = "";
    let events = [];

    if (hourButton) {
      labelArray = hourLabelArray;
      textLabel = "Hora del día";
      labelColors = hourLabelColors;
      events = createHours(groupedEvents, startYear, startMonth, startDay) // parametros que estoy modificando;
    } else if (dayButton) {
      labelArray = dayLabelArray;
      textLabel = "Día del mes";
      labelColors = dayLabelColors;
      events = createDays(groupedEvents, startYear, startMonth, startDay) // parametros que estoy modificando;

    } else if (monthButton) {
      labelArray = monthLabelArray;
      textLabel = "Mes del año";
      labelColors = monthLabelColors;
      events = createMonth(groupedEvents, startYear, startMonth, startDay) // parametros que estoy modificando;
    }

    const dataEvents = {
      labels: labelArray,
      datasets: [
        {
          label: 'Eventos',
          data: events,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          borderWidth: 1,
        },
      ],
    };


    const optionsEvent = {
      plugins: {
        legend: {
          display: true,
          labels: {
            color: 'black',
            font: {
              size: 18
            }
          }
        },
        title: {
          display: true,
          text: 'Gráfico lineal',
          font: {
            size: 20
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Número de eventos',
            font: {
              size: 20
            }
          },
          ticks: {
            color: 'black',
            font: {
              size: 14
            }
          }
        },
        x: {
          title: {
            display: true,
            text: textLabel,
            font: {
              size: 20
            }
          },
          ticks: {
            color: 'black',
            font: {
              size: 20,
            }
          }
        },
      },
    };

    setData(dataEvents);
    setOptionsMap(optionsEvent);

    const dataEvents2 = {
      labels: labelArray,
      datasets: [
        {
          label: "Eventos",
          data: events,
          backgroundColor: labelColors,
          borderColor: labelColors,
          borderWidth: 1,
        },
      ],
    };

    const options2 = {
      plugins: {
        title: { 
          display: true,
          text: 'Gráfico Circular',
          font: {
            size: 20
          }
        },
        legend: {
          display: true,
          labels: {
            color: 'black',
            font: {
              size: 18
            }
          }
        },
        tooltip: {
          callbacks: { // añadir porcentajes
            label: function (context) {
              const label = context.label || "";
              const value = context.parsed || 0;
              const percentage = Math.round((value / context.dataset.data.reduce((a, b) => a + b) * 100));
              return `${label}: ${value} (${percentage}%)`;
            },
          },
        },
      },
    };


    setPieData(dataEvents2);
    setPieOptions(options2);


  }, [messagesTimestamp]); // Se actualiza con cada nuevo mensaje del consumer messages_from_timestamp_out




  // https://reactdatepicker.com/
  return (
    <div>
      <h1 class="texts">Parámetros de selección</h1>

      <form onSubmit={handleSubmit}>
        <div class="container">
          <div class="fecha">
            <label style={{ fontWeight: 'bold', marginBottom: '15px' }}>Fecha a filtrar:</label>
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
              dateFormat="dd/MM/yyyy"

            />

          </div>
        </div>

        <div>
          <button class="buttonTouch" type="submit">Filtrar</button>
        </div>

      </form>
      <div class="containerButton">
        <button class="buttonTouch" onClick={handleDay} disabled={hourButton} >
          Horas
        </button>
        <button class="buttonTouch" onClick={handleWeek} disabled={dayButton}>
          Dias
        </button>
        <button class="buttonTouch" onClick={handleMonth} disabled={monthButton} >
          Meses
        </button>
      </div>

      <h1 class="texts">Gráficos de los eventos seleccionados en el filtro</h1>
      <div class="contenedor-graficas">
        <div class="grafico" >
          <Line data={data} options={optionsMap} />
        </div>
        <div class="grafico-pie">
          <Pie data={pieData} options={pieOptions} />
        </div>
      </div>
    </div>

  );
}

export default GraphsID;




