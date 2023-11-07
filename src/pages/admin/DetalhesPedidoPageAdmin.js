import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Chip, Container, Grid, Paper, Stack, TextField, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import { Helmet } from 'react-helmet-async';

import { useTheme } from '@emotion/react';
import useOrders from '../../hooks/useOrders';
import CardInformation from '../../components/orders/CardInformation';
import Iconify from '../../components/iconify';
import { capitalizeFirstLetter as CFL } from '../../utils/formatString';
import { fDateTime } from '../../utils/formatTime';
import FormEditProposta from '../../components/admin/FormEditProposta';

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

function DetalhesPedidoPageAdmin() {
  const [edit, setEdit] = useState(false);
  const { id } = useParams();
  const { order, deleteOrder, aprovar, recusar, finalizar } = useOrders(id);
  console.log('order', order);
  const navigate = useNavigate();
  const theme = useTheme();
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
            <Button onClick={deleteOrder} color="info">
              <Iconify icon="eva:trash-2-fill" />
            </Button>
            {!edit && (
              <Button onClick={() => setEdit(true)} color="info">
                <Iconify icon="eva:edit-2-fill" />
              </Button>
            )}
          </Box>
        </Stack>
        {edit ? (
          <FormEditProposta setEdit={setEdit} />
        ) : (
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
              <Box display="flex" flexDirection="column" gap={1}>
                <Chip
                  label={aprovacaoProposta[order?.aprovacao]}
                  color={colorAprovacaoProposta[order?.aprovacao]}
                  variant="outlined"
                />
                {order?.status === "F" && <Chip label="Proposta finalizada" color="error" variant="contained" />}
              </Box>
            </Grid>
            <Typography variant="h6" my={2}>
              Instrumentos
            </Typography>
            <Box display="flex" gap={3} sx={{ overflowX: 'auto' }} width="100%">
            {order?.instrumentos?.map(
              (
                {
                  tag,
                  numero_de_serie: numeroDeSerie,
                  posicao,
                  data_ultima_calibracao: dataUltimaCalibracao,
                  status: { nome },
                  instrumento: {
                    maximo,
                    minimo,
                    unidade,
                    capacidade_de_medicao: { valor, unidade: unidadeMedicao },
                    tipo_de_instrumento: {descricao}
                  },
                },
                index
              ) => (
                <CardInformation
                  instrumento={{
                    tag,
                    numero_de_serie: numeroDeSerie,
                    data_ultima_calibracao: dataUltimaCalibracao,
                    status: nome,
                    informacoes_adicionais: order.informacoes_adicionais,
                    local: order.local,
                    maximo,
                    minimo,
                    unidade,
                    valor,
                    unidadeMedicao,
                    posicao,
                    descricao
                  }}
                  key={index}
                  specialCases={{ numero_de_serie: 'Número de série', data_ultima_calibracao: 'Última Calibração' }}
                  titles={[
                    'tag',
                    'numero_de_serie',
                    'data_ultima_calibracao',
                    'status',
                    'informacoes_adicionais',
                  ]}
                />
              )
            )}
          </Box>
            <Typography my={2} variant="h6">
              Informações Adicionais
            </Typography>
            <Card sx={{ padding: 2, my: 2, backgroundColor: theme.palette.background.neutral }}>
              <Typography>{order?.informacoes_adicionais}</Typography>
            </Card>
            <Box display="flex" sx={{ justifyContent: 'flex-end' }} width="100%">
              <Button
                variant="contained"
                sx={{ my: 2 }}
                onClick={finalizar}
                startIcon={<Iconify icon="eva:checkmark-fill" />}
              >
                Finalizar proposta
              </Button>
            </Box>
          </Paper>
        )}
      </Container>
    </>
  );
}

export default DetalhesPedidoPageAdmin;
