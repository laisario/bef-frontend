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
  Link,
  Alert,
  Snackbar,
  TablePagination,
  Checkbox,
} from '@mui/material';
import Label from '../../components/label';
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import useOrders from '../../hooks/useOrders'
import { fDate } from '../../utils/formatTime';
import FormCreateOrder from '../../components/admin/FormCreateOrder';
import TableHeader from '../../components/admin/order/TableHeader';
import TableToolbar from '../../components/orders/TableToolbar';



function Orders() {
  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState({ propostaEnviada: false, vertical: 'top', horizontal: 'right' });
  const [selectedOrders, setSelectedOrders] = useState([]);
  const { data, page, rowsPerPage, handleChangePage, handleChangeRowsPerPage, formFilter } = useOrders();
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
        <title> Propostas | B&F </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Propostas
          </Typography>

          <Button variant="contained" onClick={handleOpen} startIcon={<Iconify icon="eva:plus-fill" />}>
            Nova proposta
          </Button>
        </Stack>
        <Card>
        <TableToolbar form={formFilter} numSelected={selectedOrders.length} selectedOrders={selectedOrders} admin />
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <TableHeader
                  numSelected={selectedOrders.length}
                  onSelectAllClick={handleSelectAllClick}
                  rowCount={data?.results?.length} />
                <TableBody>
                  {data?.results?.map((row, index) => {
                    const { id, data_criacao: dataCriacao, status, cliente, numero, aprovacao } = row;
                    const data = new Date(dataCriacao);
                    const isItemSelected = isSelected(row.id);
                    return (
                      <TableRow
                        hover
                        key={id}
                        tabIndex={-1}
                        component={Link}
                        href={`#/admin/proposta/${id}`}
                        underline="none"
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
                        <TableCell align="left">{numero}</TableCell>

                        <TableCell align="left">{fDate(data)}</TableCell>

                        <TableCell align="left">{cliente.empresa || cliente.nome}</TableCell>

                        <TableCell align="left">
                          <Label color={status === 'F' ? 'primary' : 'info'}>{status === 'F' ? aprovacao === null ? "Finalizada e Aguardando análise cliente" : `Finalizada e 
                          ${aprovacao ? "aprovada" : "reprovada"}` : 'Aguardando análise'}</Label>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 100]}
                component="div"
                count={data?.count}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Linhas por páginas"
              />
            </TableContainer>
          </Scrollbar>
        </Card>
        <FormCreateOrder open={open} setOpen={setOpen} setAlert={setAlert} onClose={handleClose} admin/>

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