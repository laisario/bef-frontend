import React from 'react';
import { useParams } from 'react-router-dom';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { Box, Button, Chip, Container, Grid, Link, Paper, Stack, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import { Helmet } from 'react-helmet-async';

import { useTheme } from '@emotion/react';
import useOrders from '../hooks/useOrders';
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
  null: 'Aguardando análise',
  false: 'Proposta negada',
  true: 'Proposta aprovada',
};

const colorAprovacaoProposta = {
  null: 'info',
  false: 'error',
  true: 'success',
};

function OrderDetails() {
  const { id } = useParams();
  const { data, aprovar, recusar } = useOrders(id);
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
              Pedido número: {data?.numero}
            </Typography>
            <Typography variant="h6" gutterBottom>
              {fDateTime(data?.data_criacao)}
            </Typography>
          </Box>
          <Box>
            {data?.status === "F" && (
              <>
                <Button
                  variant="contained"
                  sx={{ marginX: 2 }}
                  onClick={() => aprovar()}
                  startIcon={<Iconify icon="eva:checkmark-fill" />}
                >
                  Aprovar pedido
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => recusar()}
                  startIcon={<Iconify icon="ph:x-bold" />}
                >
                  Reprovar pedido
                </Button>
              </>
            )}
          </Box>
        </Stack>
        <Paper sx={{ padding: 4 }}>
          <Grid container flexDirection="row" justifyContent="space-between">
            <Box>
              <Typography variant="h6">Total: R${data?.total}</Typography>
              <Typography variant="OVERLINE TEXT" marginY="2px" fontWeight="500">
                Local calibração: {data?.local === 'L' ? 'Laboratório B&F' : 'Local'}
              </Typography>
              <Typography variant="subtitle1" fontWeight="500">
                Forma de pagamento: {formaPagamento[data?.condicao_de_pagamento]}
              </Typography>
              <Typography variant="subtitle1" fontWeight="500">
                Transporte: {CFL(data?.transporte)}
              </Typography>
              <Typography variant="subtitle1" fontWeight="500">
                Endereço de entrega: {data?.endereco_de_entrega?.logradouro} {data?.endereco_de_entrega?.numero} {data?.endereco_de_entrega?.bairro}
              </Typography>
            </Box>
            <Box display="flex" gap={1} flexDirection="column">
              <Chip
                label={aprovacaoProposta[data?.aprovacao]}
                color={colorAprovacaoProposta[data?.aprovacao]}
                variant="outlined"
              />
              <Button startIcon={<ReceiptLongIcon />}>
                <Link href={data?.anexo}>
                  Certificado
                </Link>
              </Button>
            </Box>
          </Grid>
          <Typography variant="h6" my={2}>
            Instrumentos
          </Typography>
          <Box display="flex" gap={3} sx={{ overflowX: 'auto' }} width="100%">
            {data?.instrumentos?.map(
              (
                {
                  tag,
                  numero_de_serie: numeroDeSerie,
                  posicao,
                  data_ultima_calibracao: dataUltimaCalibracao,
                  instrumento: {
                    maximo,
                    minimo,
                    unidade,
                    capacidade_de_medicao: { valor, unidade: unidadeMedicao },
                    tipo_de_instrumento: { descricao },
                  },
                },
                index
              ) => (
                <CardInformation
                  instrumento={{
                    tag,
                    numeroDeSerie,
                    dataUltimaCalibracao,
                    informacoesAdicionais: data.informacoes_adicionais,
                    local: data.local,
                    maximo,
                    minimo,
                    unidade,
                    valor,
                    unidadeMedicao,
                    posicao,
                    descricao,
                  }}
                  key={index}
                  specialCases={{
                    numero_de_serie: 'Número de série',
                    data_ultima_calibracao: 'Última Calibração',
                    informacoesAdicionais: 'Informações adicionais',
                  }}
                  titles={['tag', 'numero_de_serie', 'data_ultima_calibracao', 'status', 'informacoesAdicionais']}
                />
              )
            )}
          </Box>
          <Typography my={2} variant="h6">
            Informações Adicionais
          </Typography>
          <Card sx={{ padding: 2, my: 2, backgroundColor: theme.palette.background.neutral }}>
            <Typography>{data?.informacoes_adicionais}</Typography>
          </Card>
        </Paper>
      </Container>
    </>
  );
}

export default OrderDetails;
