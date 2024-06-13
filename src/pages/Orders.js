import { Helmet } from 'react-helmet-async';
import React, { useState } from 'react';
// @mui
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
  Dialog,
} from '@mui/material';
// components
import Form from '../components/orders/Form';
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead } from '../sections/@dashboard/user';
// mock
import USERLIST from '../_mock/user';

// hooks
import useOrders from '../hooks/useOrders';
import { fDate } from '../utils/formatTime';
import TableToolbar from '../components/orders/TableToolbar';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'id', label: '', alignRight: false },
  { id: 'numero', label: 'Número', alignRight: false },
  { id: 'data', label: 'Data', alignRight: false },
  { id: 'total', label: 'Total', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
];

// ----------------------------------------------------------------------

export default function UserPage() {
  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState({ propostaEnviada: false, vertical: 'top', horizontal: 'right' });
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

  const colorAprovacaoProposta = {
    false: 'error',
    true: 'success',
  };

  const colorStatusProposta = {
    A: 'info',
    F: 'secondary',
  };

  return (
    <>
      <Helmet>
        <title> Propostas | B&F </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Minhas propostas
          </Typography>
          <Button variant="contained" onClick={handleOpen} startIcon={<Iconify icon="eva:plus-fill" />}>
            Nova proposta
          </Button>
        </Stack>

        <Card>
          <TableToolbar form={formFilter} />
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead headLabel={TABLE_HEAD} rowCount={USERLIST.length} />
                <TableBody>
                  {data?.results?.map((row, index) => {
                    const { id, total, data_criacao: dataCriacao, status, aprovacao, numero } = row;
                    const data = new Date(dataCriacao);
                    return (
                      <TableRow
                        hover
                        key={id}
                        tabIndex={-1}
                        component={Link}
                        href={`#/dashboard/proposta/${id}`}
                        underline="none"
                      >
                        <TableCell align="left">{index + 1}</TableCell>

                        <TableCell align="left">{numero}</TableCell>
                        
                        <TableCell align="left">{fDate(data)}</TableCell>

                        <TableCell align="left">{+total > 0 ? `R$ ${total}` : "Aguardando resposta"}</TableCell>

                        <TableCell align="left">
                          {status === 'F' && aprovacao !== null ? (
                            <Label color={colorAprovacaoProposta[aprovacao]}>
                              Proposta {aprovacao ? 'aprovada' : 'reprovada'}
                            </Label>
                          ) : (
                            <Label color={colorStatusProposta[status]}>
                              {aprovacao === null && status === 'F' ? 'Esperando sua análise' : 'Aguardando retorno B&f'}
                            </Label>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 100]}
              component="div"
              count={data?.results?.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Linhas por páginas"
            />
          </Scrollbar>
        </Card>
        <Dialog
          open={open}
          onClose={handleClose}
          PaperProps={{
            component: 'form',
          }}
        >
          <Form setOpen={setOpen} setAlert={setAlert} handleClose={handleClose} />
        </Dialog>

        <Stack spacing={2} sx={{ width: '100%' }}>
          <Snackbar
            open={propostaEnviada}
            anchorOrigin={{ vertical, horizontal }}
            key={vertical + horizontal}
            onClose={handleCloseAlert}
          >
            <Alert onClose={handleCloseAlert} severity="success" sx={{ width: '100%' }}>
              Sua proposta foi enviada com sucesso!
            </Alert>
          </Snackbar>
        </Stack>
      </Container>
    </>
  );
}
