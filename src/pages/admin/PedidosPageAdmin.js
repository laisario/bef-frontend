import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
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
  Modal,
  Box,
  Link,
  Alert,
  Snackbar,
} from '@mui/material';
import { styled } from '@mui/system';
import useOrders from '../../hooks/useOrders'
// components
import Label from '../../components/label';
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
// sections
import { UserListHead } from '../../sections/@dashboard/user';
// mock
import USERLIST from '../../_mock/user';

import { fDateTime } from '../../utils/formatTime';
import FormCreateOrder from '../../components/admin/FormCreateOrder';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'id', label: '', alignRight: false },
  { id: 'data', label: 'Data', alignRight: false },
  { id: 'cliente', label: 'Cliente', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
];

// ----------------------------------------------------------------------

const FormBox = styled(Box)({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
});

function PedidosPageAdmin() {
  const [open, setOpen] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ propostaEnviada: false, vertical: 'top', horizontal: 'right' });
  const { data } = useOrders();
  const { vertical, horizontal, propostaEnviada } = alert;
  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlert((prevAlert) => ({...prevAlert, propostaEnviada: false}));
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const statusProposta = {
    null: 'Proposta em análise',
    false: 'Proposta negada',
    true: 'Proposta aprovada',
  };

  const colorStatusProposta = {
    null: 'info',
    false: 'error',
    true: 'success',
  };
  return (
    <>
      <Helmet>
        <title> Pedidos | B&F </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Pedidos
          </Typography>
          <Button variant="contained" onClick={handleOpen} startIcon={<Iconify icon="eva:plus-fill" />}>
            Novo pedido
          </Button>
        </Stack>

        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead headLabel={TABLE_HEAD} rowCount={USERLIST.length} />
                <TableBody>
                  {data?.map((row, index) => {
                    const { id, total, data_criacao: dataCriacao, aprovacao: status, cliente } = row;
                    const data = new Date(dataCriacao);
                    return (
                      <TableRow
                        hover
                        key={id}
                        tabIndex={-1}
                        component={Link}
                        href={`/admin/pedido/${id}`}
                        underline="none"
                      >
                        <TableCell align="left">{index + 1}</TableCell>

                        <TableCell align="left">{fDateTime(data)}</TableCell>

                        <TableCell align="left">{cliente.empresa || cliente.nome}</TableCell>

                        <TableCell align="left">
                          <Label color={colorStatusProposta[status]}>{statusProposta[status]}</Label>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
        </Card>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <FormBox>
            <FormCreateOrder setOpen={setOpen} setAlert={setAlert}/>
          </FormBox>
        </Modal>

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

export default PedidosPageAdmin