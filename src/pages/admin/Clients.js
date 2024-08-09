import React, { useState } from 'react'
import { Card, Checkbox, CircularProgress, Container, Grid, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import useClients from '../../hooks/useClients';
import useResponsive from '../../hooks/useResponsive';
import TableToolbar from '../../components/clients/TableToolbar';
import TableHeader from '../../components/TableHeader';
import { useAuth } from '../../context/Auth';
import Scrollbar from '../../components/scrollbar/Scrollbar';

function Clients() {
  const [selectedClients, setSelectedClients] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();
  const isMobile = useResponsive('down', 'md');
  const {
    data,
    isLoading,
    formFilter,
    handleChangePage,
    handleChangeRowsPerPage,
    deleteClients,
    rowsPerPage,
    page
  } = useClients()
  const isSelected = (id) => selectedClients.indexOf(id) !== -1;

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = data?.results?.map((n) => n.id);
      setSelectedClients(newSelected);
      return;
    }
    setSelectedClients([]);
  };

  const handleClick = (event, id) => {
    event?.stopPropagation()
    setSelectedClients(selectedClients?.includes(id) ? selectedClients?.filter(clientId => clientId !== id) : [...selectedClients, id]);
  };
  return (
    <>
      <Helmet>
        <title> Clientes | Kometro  </title>
      </Helmet>
      <Container>
        <Grid container display="flex" flexDirection={isMobile ? "column" : "row"} alignItems={isMobile ? "flex-start" : "center"} justifyContent="space-between" mb={5}>
          <Grid item sm={6} xs={12}>
            <Typography variant="h4" gutterBottom>
              Clientes
            </Typography>
          </Grid>
        </Grid>

        <Card>
          <TableToolbar
            numSelected={selectedClients?.length}
            deleteClients={() => { deleteClients(selectedClients); setSelectedClients([]) }}
            form={formFilter}
            isLoading={isLoading}
          />
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table
                aria-labelledby="tabelaClientes"
              >
                <TableHeader
                  numSelected={selectedClients.length}
                  onSelectAllClick={handleSelectAllClick}
                  rowCount={data?.results?.length}
                  component="clients"
                  admin={user?.admin}
                />
                <TableBody>
                  {!isLoading ? data?.results?.map((row, index) => {
                    const isItemSelected = isSelected(row.id);
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.id}
                        onClick={() => { navigate(`/admin/cliente/${row?.id}`, { replace: true }) }}
                        sx={{ cursor: 'pointer' }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            onClick={(event) => handleClick(event, row.id)}
                            checked={isItemSelected}
                            inputProps={{
                              'aria-labelledby': index,
                            }}
                            />
                        </TableCell>
                        <TableCell>
                          {row?.empresa?.razao_social}
                        </TableCell>
                        <TableCell
                          component="th"
                          id={index}
                          scope="row"
                          padding="none"
                        >
                          {row?.usuario?.email}
                        </TableCell>
                        <TableCell>{row?.empresa?.filial}</TableCell>
                      </TableRow>
                    );
                  }) : <CircularProgress />}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            component="div"
            count={data?.count || 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Linhas por páginas"
          />
        </Card>
      </Container>
    </>
  );
}

export default Clients