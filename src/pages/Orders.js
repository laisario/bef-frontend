import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import {
  Card,
  Table,
  Stack,
  Button,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  Alert,
  Snackbar,
  TablePagination,
  Checkbox,
  CircularProgress,
  Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
import useOrders from '../hooks/useOrders'
import { fDate } from '../utils/formatTime';
import FormCreateOrder from '../components/orders/FormCreateOrder';
import TableHeader from '../components/TableHeader';
import TableToolbar from '../components/orders/TableToolbar';
import { useAuth } from '../context/Auth';
import EmptyYet from '../components/EmptyYet';
import useResponsive from '../hooks/useResponsive';
// -------------------------------------------------------------------------------------------

const headCellsAdmin = [
  {
    id: 'numero',
    label: 'Número',
  },
  {
    id: 'data',
    label: 'Data',
  },
  {
    id: 'cliente',
    label: 'Cliente',
  },
  {
    id: 'status',
    label: 'Status',
  },
];

const headCells = [
  {
    id: 'numero',
    label: 'Número',
  },
  {
    id: 'data',
    label: 'Data',
  },
  {
    id: 'total',
    label: 'Total',
  },
  {
    id: 'status',
    label: 'Status',
  },
];


function Orders() {
  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState({ propostaEnviada: false, vertical: 'top', horizontal: 'right' });
  const [selectedOrders, setSelectedOrders] = useState([]);
  const isMobile = useResponsive('down', 'md');
  const { user: { admin } } = useAuth();

  const { data,
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    formFilter,
    statusColor,
    statusString,
    refetch,
    deleteOrder,
    isLoading
  } = useOrders();

  const navigate = useNavigate()

  const { vertical, horizontal, propostaEnviada } = alert;

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlert((prevAlert) => ({ ...prevAlert, propostaEnviada: false }));
  };

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = data?.results?.map((n) => n.id);
      setSelectedOrders(newSelected);
      return;
    }
    setSelectedOrders([]);
  };

  const handleClick = (event, id) => {
    event?.stopPropagation()
    setSelectedOrders(selectedOrders?.includes(id) ? selectedOrders?.filter(documentId => documentId !== id) : [...selectedOrders, id]);
  };

  const isSelected = (id) => selectedOrders.indexOf(id) !== -1;

  return (
    <>
      <Helmet>
        <title> Propostas | Kometro </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            {admin ? 'Propostas' : 'Minhas propostas'}
          </Typography>

          <Button variant="contained" onClick={handleOpen} startIcon={<Iconify icon="eva:plus-fill" />}>
            Nova proposta
          </Button>
        </Stack>
        {isLoading
          ? (<Box display="flex" height="70vh" justifyContent="center" alignItems="center" spacing={3}>
            <CircularProgress size="96px" />
          </Box>)
          : !data?.results?.length ? <EmptyYet content="proposta" isMobile={isMobile} /> :(<Card>
            <TableToolbar form={formFilter} numSelected={selectedOrders.length} selectedOrders={selectedOrders} setSelectedOrders={setSelectedOrders} admin={admin} deleteOrder={deleteOrder} />
            <Scrollbar>
              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <TableHeader
                    numSelected={selectedOrders?.length}
                    onSelectAllClick={handleSelectAllClick}
                    rowCount={data?.results?.length}
                    checkbox={admin}
                    headCells={admin ? headCellsAdmin : headCells}
                  />
                  <TableBody>
                    {data?.results?.map((row, index) => {
                      const { id, data_criacao: dataCriacao, status, cliente, numero, total } = row;
                      const data = dataCriacao;
                      const isItemSelected = isSelected(row.id);
                      return (
                        <TableRow
                          hover
                          key={id}
                          tabIndex={-1}
                          onClick={() => { navigate(admin ? `/admin/proposta/${id}/${cliente?.id}` : `/dashboard/proposta/${id}`, { replace: true }) }}
                        >
                          {admin &&
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
                          }
                          <TableCell align="left">{numero}</TableCell>

                          <TableCell align="left">{fDate(data)}</TableCell>
                          {admin ? (<TableCell align="left">{cliente?.empresa?.razao_social || cliente?.nome}</TableCell>) : (<TableCell align="left">{+total > 0 ? `R$ ${total}` : "Aguardando resposta"}</TableCell>)}

                          <TableCell align="left">
                            <Label color={statusColor[status]}>{statusString[status]}</Label>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, 100]}
                  component="div"
                  count={data?.count || 0}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  labelRowsPerPage="Linhas por páginas"
                />
              </TableContainer>
            </Scrollbar>
          </Card>)
        }

        <FormCreateOrder open={open} setOpen={setOpen} setAlert={setAlert} onClose={handleClose} admin={admin} refetch={refetch} />

        <Stack spacing={2} sx={{ width: '100%' }}>
          <Snackbar
            open={propostaEnviada}
            anchorOrigin={{ vertical, horizontal }}
            key={vertical + horizontal}
            onClose={handleCloseAlert}
          >
            <Alert
              onClose={handleCloseAlert}
              severity="success"
              sx={{ width: '100%' }}
            >
              Sua proposta foi enviada com sucesso!
            </Alert>
          </Snackbar>
        </Stack>
      </Container>
    </>
  );
}

export default Orders