import { useState, useEffect } from 'react';
import './Home.css';

import DateTimePicker from 'react-datetime';
import 'react-datetime/css/react-datetime.css';


import * as React from 'react';

import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import TablePagination from '@mui/material/TablePagination';




const StyledTableCell = styled(TableCell)(({ theme }) => ({
  border: 'none',
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));


const columns = [
  { id: 'ID', label: 'ID', minWidth: 170 },
  { id: 'type', label: 'Tipo', minWidth: 170 },
  { id: 'date', label: 'Fecha', minWidth: 170 },
  { id: 'localization', label: 'Localización', minWidth: 170 },
];


function Home({ props }) {

  const { messages, messagesTimestamp } = props;


  //MUI
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [page2, setPage2] = React.useState(0);
  const [rowsPerPage2, setRowsPerPage2] = React.useState(10);


  const handleChangePageLeft = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPageLeft = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleChangePageRight = (event, newPage) => {
    setPage2(newPage);
  };

  const handleChangeRowsPerPageRight = (event) => {
    setRowsPerPage2(+event.target.value);
    setPage2(0);
  };

  //MUI


  // Deserializar el string JSON en un objeto JavaScript
  const parseMessage = (message) => {
    return JSON.parse(message);
  }

  /*
  // Fecha en UTC
  function millisToDate(millis) {
    let date = new Date(millis);
    let year = date.getUTCFullYear();
    let month = date.getUTCMonth() + 1;
    let day = date.getUTCDate();
    let hours = date.getUTCHours();
    let minutes = date.getUTCMinutes();
    let seconds = date.getUTCSeconds();
    return `${day < 10 ? '0' + day : day}-${month < 10 ? '0' + month : month}-${year} ${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
}
*/

  // Fecha local - España
  function millisToDate(millis) {
    let date = new Date(millis);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    return `${day < 10 ? '0' + day : day}-${month < 10 ? '0' + month : month}-${year} ${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  }




  // Envio de la fecha
  const [selectedDate, setSelectedDate] = useState(new Date());
  // Envio del ID
  const [selectedID, setSelectedID] = useState("");
  const [selectedIDSend, setSelectedIDSend] = useState("no-id");


  // Bloqueo del botón
  const [buttonDisabled, setButtonDisabled] = useState(false);


  // Seleccion de numero de inputs
  const [numIds, setnumIds] = useState(0);
  const [textInputs, setTextInputs] = useState([]);
  const [hasDuplicateValues, setHasDuplicateValues] = useState(false);




  const handleNumIds = (event) => {
    const num = parseInt(event.target.value);
    setnumIds(num);
    setTextInputs([]);
  }


  const handleTextChange = (event, index) => {
    const newTextInputValue = event.target.value;

    if (textInputs.includes(newTextInputValue)) {
      alert("Por favor, escriba un valor diferente a los introducidos.");
      setHasDuplicateValues(true); // no permitimos guardar si hay un valor igual
      return;
    }
 
    setTextInputs((prevTextInputs) => { //
      const newTextInputArray = [...prevTextInputs]; 
      newTextInputArray[index] = newTextInputValue; // almacenamos el nuevo valor del campo de texto introducido
      return newTextInputArray;
    });

    setHasDuplicateValues(false); // permitimos que se visualize el boton de guardar

  }

  const renderInputs = () => {
    const inputs = [];
    for (let i = 0; i < numIds; i++) {
      inputs.push(
        <input type="text" key={i} onChange={(event) => handleTextChange(event, i)} />
      );
    }
    return inputs;
  }

  const handleClean = () => {
    setnumIds(0)
    setTextInputs([])
    setHasDuplicateValues(false);  
  }



  const handleSubmit = async (event) => {

    event.preventDefault();
    // Comprobar si hay algún valor en el array textInputs es undefined o solo tiene espacios en blanco  
    var hasEmptyValue = false;
    for (let i = 0; i < textInputs.length; i++) {
      if (typeof textInputs[i] === 'undefined' || textInputs[i].trim() === '') {
        hasEmptyValue = true;
        break;
      }
    }
    if (hasEmptyValue) {
      alert('No se permiten valores vacíos o que contengan solo espacios en blanco');
      return;
    }

    setButtonDisabled(true);

    // Habilitar el botón después de 30 segundos
    setTimeout(() => {
      setButtonDisabled(false);
    }, 30000);

    var date = new Date(selectedDate);
    var options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    var formattedDate = date.toLocaleString("es-ES", options);
    console.log(formattedDate);

    var resultDate = formattedDate.split(',')[0];
    var resultDay = formattedDate.split(',')[1];

    //console.log(selectedIDSend);
    var listIds = textInputs; // 
    if (listIds.length === 0){
      listIds = ["no-id"]
    }


    console.log(resultDate);
    console.log(resultDay);
    console.log(listIds)

    try {
      const response = await fetch('http://localhost:3001/run-scala-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ resultDate, resultDay, listIds })
      });
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error(error);
    }

  };


  return (
    <div>
      <h1 style={{textAlign: "center"}}> Tablas stream kafka</h1>


      <div>
        <form onSubmit={handleSubmit}>
          <label style={{ fontSize: 'small' }}>Selecciona la fecha a filtrar:</label>
          <DateTimePicker
            value={selectedDate}
            onChange={setSelectedDate}
          />
          <label style={{ fontSize: 'small' }}>Selecciona el ID: </label>
          <br />

          <label>
            Número de ids que se van a filtrar:
            <input type="number" min="0" onChange={handleNumIds} />
          </label>

          <div>
            {renderInputs()}
            <button type="submit" disabled={hasDuplicateValues || buttonDisabled}>
              {buttonDisabled ? 'Submitting...' : 'Submit'}
            </button>
          </div>

        </form>
      </div>
      <button onClick={handleClean}>Limpiar</button>




      <div>
        <Paper sx={{ minWidth: 500, float: 'left', width: '47%', marginLeft: '20px' }}>
          <p style={{ textAlign: 'center' }}>Eventos en streaming</p>
          <p style={{ fontSize: 'x-small' }}><b>{messages.length > 0 ? `Fecha último evento: ${millisToDate(parseMessage(messages[0]).date_event)}` : ''}</b></p>

          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell
                    key="sticky-header"
                    align="center"
                    style={{ position: 'sticky', left: '0', zIndex: 1, backgroundColor: '#fff', minWidth: 50 }}
                  >
                    ID
                  </TableCell>
                  <TableCell
                    key="header-1"
                    align="center"
                    style={{ position: 'sticky', top: '0', backgroundColor: '#fff' }}
                  >
                    Tipo
                  </TableCell>
                  <TableCell
                    key="header-2"
                    align="center"
                    style={{ position: 'sticky', top: '0', backgroundColor: '#fff' }}
                  >
                    Fecha
                  </TableCell>
                  <TableCell
                    key="header-3"
                    align="center"
                    style={{ position: 'sticky', top: '0', backgroundColor: '#fff' }}
                  >
                    Localización
                  </TableCell>
                  {columns.slice(4).map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth, position: 'sticky', top: '0', backgroundColor: '#fff' }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {messages.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
                  <StyledTableRow hover role="checkbox" tabIndex={-1} key={index}>
                    <StyledTableCell align="right" style={{ backgroundColor: '#fff' }}>
                      {parseMessage(item)['id']}
                    </StyledTableCell>
                    <StyledTableCell align="right" style={{ backgroundColor: '#fff' }}>
                      {parseMessage(item)['event_type']}
                    </StyledTableCell>
                    <StyledTableCell align="right" style={{ backgroundColor: '#fff' }}>
                      {millisToDate(parseMessage(item)['date_event'])}
                    </StyledTableCell>
                    <StyledTableCell align="right" style={{ backgroundColor: '#fff' }}>
                      {parseMessage(item)['location']}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 100]}
            component="div"
            count={messages.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePageLeft}
            onRowsPerPageChange={handleChangeRowsPerPageLeft}
          />

        </Paper>
      </div>

      <div>
        <Paper sx={{ minWidth: 500, float: 'right', width: '47%', marginRight: '20px' }}>
          <p style={{ textAlign: 'center' }}>Eventos a partir de fecha seleccionada</p>
          <p style={{ fontSize: 'x-small' }}><b>{messagesTimestamp.length > 0 ? `Fecha último evento: ${millisToDate(parseMessage(messagesTimestamp[0]).date_event)}` : ''}</b></p>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell
                    key="sticky-header"
                    align="center"
                    style={{ position: 'sticky', left: '0', zIndex: 1, backgroundColor: '#fff', minWidth: 50 }}
                  >
                    ID
                  </TableCell>
                  <TableCell
                    key="header-1"
                    align="center"
                    style={{ position: 'sticky', top: '0', backgroundColor: '#fff' }}
                  >
                    Tipo
                  </TableCell>
                  <TableCell
                    key="header-2"
                    align="center"
                    style={{ position: 'sticky', top: '0', backgroundColor: '#fff' }}
                  >
                    Fecha
                  </TableCell>
                  <TableCell
                    key="header-3"
                    align="center"
                    style={{ position: 'sticky', top: '0', backgroundColor: '#fff' }}
                  >
                    Localización
                  </TableCell>
                  {columns.slice(4).map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth, position: 'sticky', top: '0', backgroundColor: '#fff' }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {messagesTimestamp.slice(page2 * rowsPerPage2, page2 * rowsPerPage2 + rowsPerPage2).map((item, index) => (
                  <StyledTableRow hover role="checkbox" tabIndex={-1} key={index}>
                    <StyledTableCell align="right" style={{ backgroundColor: '#fff' }}>

                      {parseMessage(item)['id']}
                    </StyledTableCell>
                    <StyledTableCell align="right" style={{ backgroundColor: '#fff' }}>
                      {parseMessage(item)['event_type']}
                    </StyledTableCell>
                    <StyledTableCell align="right" style={{ backgroundColor: '#fff' }}>
                      {millisToDate(parseMessage(item)['date_event'])}
                    </StyledTableCell>
                    <StyledTableCell align="right" style={{ backgroundColor: '#fff' }}>
                      {parseMessage(item)['location']}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 100]}
            component="div"
            count={messagesTimestamp.length}
            rowsPerPage={rowsPerPage2}
            page={page2}
            onPageChange={handleChangePageRight}
            onRowsPerPageChange={handleChangeRowsPerPageRight}
          />

        </Paper>
      
      </div>

    </div>
  );

}

export default Home;