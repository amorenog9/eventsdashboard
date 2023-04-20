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
  { id: 'order', label: 'Orden', minWidth: 170 },
  { id: 'type', label: 'Tipo', minWidth: 170 },
  { id: 'date', label: 'Fecha', minWidth: 170 },
  { id: 'localization', label: 'Localización', minWidth: 170 },
];


function TableID({ props }) {

  const { messages } = props;


  //MUI
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);


  const handleChangePage= (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };


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

  return (
    <div>
        <Paper sx={{ minWidth: 500, float: 'left', width: '24%', marginLeft: '20px', marginTop: '20px' }}>
          <p style={{ textAlign: 'center' }}>ID del evento: {parseMessage(messages[0]).id}</p>
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
                    Orden
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
                      {messages.length - index}
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
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />

        </Paper>

    </div>
  );

}

export default TableID;