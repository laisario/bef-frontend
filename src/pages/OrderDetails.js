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
import { fDate, fDateTime } from '../utils/formatTime';

const formaPagamento = {
  CD: 'Débito',
  CC: 'Crédito',
  P: 'Pix',
  D: 'Dinheiro',
};

const aprovacaoProposta = {
  null: 'Aguardando sua análise',
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
            {!!data?.numero &&
              <Typography variant="h4" gutterBottom>
                Pedido número: {data?.numero}
              </Typography>
            }
            {!!data?.data_criacao &&
              <Typography variant="h6" gutterBottom>
                {fDateTime(data?.data_criacao)}
              </Typography>
            }
          </Box>
          <Box>
            {data?.status === "F" && data?.aprovacao === null && (
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
              {!!data?.total && +(data?.total) > 0 &&
                <Typography variant="h6">Total: R${data?.total}</Typography>
              }
              {!!data?.local &&
                <Typography variant="OVERLINE TEXT" marginY="2px" fontWeight="500">
                  Local calibração: {data?.local === 'L' ? 'Laboratório B&F' : 'Local'}
                </Typography>
              }
              {!!data?.condicao_de_pagamento &&
                <Typography variant="subtitle1" fontWeight="500">
                  Forma de pagamento: {formaPagamento[data?.condicao_de_pagamento]}
                </Typography>
              }
              {!!data?.transporte &&
                <Typography variant="subtitle1" fontWeight="500">
                  Transporte: {CFL(data?.transporte)}
                </Typography>
              }
              {!!data?.prazo_de_entrega &&
                <Typography variant="subtitle1" fontWeight="500">
                  Prazo de entrega: {fDate(data?.prazo_de_entrega)}
                </Typography>
              }
              {!!data?.endereco_de_entrega &&
                <Typography variant="subtitle1" fontWeight="500">
                  Endereço de entrega: {data?.endereco_de_entrega?.logradouro || ''}{' '}
                  {!!data?.endereco_de_entrega?.numero && ', '} {data?.endereco_de_entrega?.numero || ''}
                  {!!data?.endereco_de_entrega?.complemento && ' - '}
                  {!data?.endereco_de_entrega?.complemento ? data?.endereco_de_entrega?.complemento : ''}{' '}
                  {!!data?.endereco_de_entrega?.bairro?.nome && ' - '}
                  {data?.endereco_de_entrega?.bairro?.nome || ''}
                  {!!data?.endereco_de_entrega?.cep && ' - '} {data?.endereco_de_entrega?.cep || ''}
                </Typography>
              }
            </Box>
            <Box display="flex" gap={1} flexDirection="column">
              {data?.status === 'A' ? (
                <Chip
                  label="Aguardando resposta"
                  color={colorAprovacaoProposta[data?.aprovacao]}
                  variant="outlined"
                />
              ) : (
                <Chip
                  label={aprovacaoProposta[data?.aprovacao]}
                  color={colorAprovacaoProposta[data?.aprovacao]}
                  variant="outlined"
                />
              )}
              {!!data?.anexo && (
                <Button startIcon={<ReceiptLongIcon />}>
                  <Link href={data?.anexo} target="_blank">Anexo</Link>
                </Button>
              )}
            </Box>
          </Grid>
          {!!data?.instrumentos.length && (
            <>
              <Typography variant="h6" my={2}>
                {data?.instrumentos.length > 1 ? "Instrumentos" : "Instrumento"}
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
                        tipo_de_servico: tipoDeServico
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
                        tipoDeServico
                      }}
                      proposta={data}
                      key={index}
                    />
                  )
                )}
              </Box>
            </>
          )}
          {!!data?.informacoes_adicionais && (
            <>
              <Typography my={2} variant="h6">
                Informações Adicionais
              </Typography>
              <Card sx={{ padding: 2, my: 2, backgroundColor: theme.palette.background.neutral }}>
                <Typography>{data?.informacoes_adicionais}</Typography>
              </Card>
            </>
          )}
        </Paper>
      </Container>
    </>
  );
}

export default OrderDetails;
