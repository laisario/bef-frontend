import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Chip, Container, Grid, Paper, Stack, TextField, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import { Helmet } from 'react-helmet-async';

import { useTheme } from '@emotion/react';
import TitleCard from '../components/orders/titleCard';
import usePropostas from '../hooks/usePropostas';
import CardInformation from '../components/orders/CardInformation';
import Iconify from '../components/iconify';
import { capitalizeFirstLetter as CFL } from '../utils/formatString';
import { fDateTime } from '../utils/formatTime';

const formaPagamento = {
  CD: 'Débito',
  CC: 'Crédito',
  P: 'Pix',
  D: 'Dinheiro',
};

const aprovacaoProposta = {
  null: 'Proposta em análise',
  false: 'Proposta negada',
  true: 'Proposta aprovada',
};

const colorAprovacaoProposta = {
  null: 'info',
  false: 'error',
  true: 'success',
};

function OrderDetails() {
  const [order, setOrder] = useState();
  const { id } = useParams();
  const { getOrder, deleteOrder, refetch } = usePropostas();
  const navigate = useNavigate();
  const theme = useTheme();

  const deleteProposta = async () => {
    deleteOrder(id);
    await refetch();
    navigate('/dashboard/pedidos');
  };

  useEffect(() => {
    (async () => {
      const response = await getOrder(id);
      console.log(response)
      setOrder(response);
    })();
  }, []);

  return (
    <>
      <Helmet>
        <title> Pedido | B&F </title>
      </Helmet>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Box direction="column">
            <Typography variant="h4" gutterBottom>
              Pedido número: {order?.numero}
            </Typography>
            <Typography variant="h6" gutterBottom>
              {fDateTime(order?.data_criacao)}
            </Typography>
          </Box>
          <Box>
            <Button onClick={deleteProposta} color="info">
              <Iconify icon="eva:trash-2-fill" />
            </Button>
            {/* <Button color="info">
              <Iconify icon="eva:edit-2-fill" />
            </Button> */}
            <Button variant="contained" startIcon={<Iconify icon="eva:checkmark-fill" />}>
              Aprovar pedido
            </Button>
          </Box>
        </Stack>
        <Paper sx={{ padding: 4 }}>
          <Grid container flexDirection="row" justifyContent="space-between">
            <Box>
              <Typography variant="h6">Total: R${order?.total}</Typography>
              <Typography variant="OVERLINE TEXT" marginY="2px" fontWeight="500">
                {order?.local === 'L' ? 'Laboratório B&F' : 'Local'}
              </Typography>
              <Typography variant="subtitle1" fontWeight="500">
                Forma de pagamento: {formaPagamento[order?.condicao_de_pagamento]}
              </Typography>
              <Typography variant="subtitle1" fontWeight="500">
                Transporte: {CFL(order?.transporte)}
              </Typography>
              <Typography variant="subtitle1" fontWeight="500">
                Endereço de entrega: {order?.endereco_de_entrega}
              </Typography>
            </Box>
            <Chip label={aprovacaoProposta[order?.aprovacao]} color={colorAprovacaoProposta[order?.aprovacao]} variant="outlined" />
          </Grid>
          <Typography variant="h6" my={2}>
            Instrumentos
          </Typography>
          <Box display="flex" gap={3} sx={{overflowX: 'auto'}} width="100%">
            {order?.instrumentos?.map((instrumento) => (
              <CardInformation instrumento={instrumento} key={instrumento.id} />
            ))}
          </Box>
          <Typography my={2} variant="h6">
            Informações Adicionais
          </Typography>
          <Card sx={{ padding: 2, my: 2, backgroundColor: theme.palette.background.neutral }}>
            <Typography>{order?.informacoes_adicionais}</Typography>
          </Card>
        </Paper>
      </Container>
    </>
  );
}

export default OrderDetails;
