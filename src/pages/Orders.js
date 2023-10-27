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
  Modal,
  Box,
  Link,
} from '@mui/material';
import { styled } from '@mui/system';

// components
import useInstrumentos from '../hooks/useInstrumentos';
import Form from '../components/orders/Form';
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead } from '../sections/@dashboard/user';
// mock
import USERLIST from '../_mock/user';

// hooks
import usePropostas from '../hooks/usePropostas';
import { fDateTime } from '../utils/formatTime';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'id', label: '', alignRight: false },
  { id: 'data', label: 'Data', alignRight: false },
  { id: 'total', label: 'Total', alignRight: false },
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

export default function UserPage() {
  const [open, setOpen] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const { todasPropostas } = usePropostas();
  const { todosInstrumentos } = useInstrumentos();
  console.log(todosInstrumentos);
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
            Meus pedidos
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
                  {todasPropostas?.map((row, index) => {
                    const { id, total, data_criacao: dataCriacao, aprovacao: status } = row;
                    const data = new Date(dataCriacao);
                    return (
                      <TableRow hover key={id} tabIndex={-1} component={Link} href={`/dashboard/pedido/${id}`} underline="none">
                        <TableCell align="left">{index + 1}</TableCell>

                        <TableCell align="left">
                          {fDateTime(data)}
                        </TableCell>

                        <TableCell align="left">R$ {total}</TableCell>

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
            <Form setOpen={setOpen} />
          </FormBox>
        </Modal>
      </Container>
    </>
  );
}
