import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import Card from '@mui/material/Card';
import { Helmet } from 'react-helmet-async';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@emotion/react';
import dayjs from 'dayjs';
import useOrders from '../../hooks/useOrders';
import CardInformation from '../../components/orders/CardInformation';
import Iconify from '../../components/iconify';
import { capitalizeFirstLetter as CFL } from '../../utils/formatString';
import FormEditProposta from '../../components/admin/FormEditOrder';

const formaPagamento = {
  CD: 'Débito',
  CC: 'Crédito',
  P: 'Pix',
  D: 'Dinheiro',
  B: 'Boleto',
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
  const [edit, setEdit] = useState(false);
  const [open, setOpen] = useState(false);
  const [response, setResponse] = useState(null);
  const { id } = useParams();
  const { data, deleteOrderAndNavigate } = useOrders(id);
  const theme = useTheme();
  const responseMesages = {
    200: 'Pedido editado com sucesso',
    400: 'Endereço é obrigatório',
    500: 'Aconteceu um erro no servidor.',
  };
  return (
    <>
      <Helmet>
        <title>Proposta | B&F</title>
      </Helmet>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Box direction="column">
            {!!data?.numero &&
              <Typography variant="h4" gutterBottom>
                Proposta número: {data?.numero}
              </Typography>
            }
            {!!data?.cliente?.empresa &&
              <Typography variant="h6" gutterBottom>
                {!!data?.cliente?.nome?.length ? `${data.cliente.empresa} - ${data.cliente.nome}` : data.cliente.empresa}
              </Typography>
            }
          </Box>
          <Box display="flex" gap={2}>
            <Button onClick={deleteOrderAndNavigate} color="secondary">
              <Iconify icon="eva:trash-2-fill" />
            </Button>
            {data?.status !== 'F' ? (
              <Button variant="contained" onClick={() => setEdit(true)} endIcon={<Iconify icon="eva:checkmark-fill" />}>
                Finalizar proposta
              </Button>
            ) : (
              <Button variant="contained" onClick={() => setEdit(true)} endIcon={<Iconify icon="eva:edit-fill" />}>
                Editar proposta
              </Button>
            )}
          </Box>
        </Stack>
        {open && (
          <Alert
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setOpen(false);
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
            severity={response.status === 200 ? "success" : "error"}
          >
            {responseMesages[response?.status] || response.statusText}
          </Alert>
        )}
        {!!data && (
          <FormEditProposta
            open={edit}
            data={data}
            handleClose={() => setEdit(false)}
            setResponseStatus={setResponse}
            setOpen={setOpen}
          />
        )}
        <Paper sx={{ padding: 4 }}>
          <Grid container flexDirection="row" justifyContent="space-between">
            <Box>
              {+(data?.total) > 0 &&
                <Typography variant="h6">Total: R${data?.total}</Typography>
              }
              {!!data?.data_criacao &&
                <Typography variant="subtitle1" fontWeight="500">
                  Proposta criada: {dayjs(data?.data_criacao).locale('pt-BR').format('D [de] MMMM [de] YYYY')}
                </Typography>
              }
              {!!data?.local &&
                <Typography variant="subtitle1" fontWeight="500">
                  Local calibração: {data?.local === 'L' ? 'Laboratório B&F' : 'Cliente'}
                </Typography>
              }
              {!!data?.condicao_de_pagamento &&
                <Typography variant="subtitle1" fontWeight="500">
                  Forma de pagamento: {formaPagamento[data?.condicao_de_pagamento]}
                </Typography>
              }
              {!!data?.prazo_de_pagamento &&
                <Typography variant="subtitle1" fontWeight="500">
                  Prazo de pagamento: {dayjs(data?.prazo_de_pagamento).locale('pt-BR').format('D [de] MMMM [de] YYYY')}
                </Typography>
              }
              {!!data?.transporte &&
                <Typography variant="subtitle1" fontWeight="500">
                  Transporte: {CFL(data?.transporte)}
                </Typography>
              }
              {!!data?.prazo_de_entrega &&
                <Typography variant="subtitle1" fontWeight="500">
                  Prazo de entrega: {dayjs(data?.prazo_de_entrega).locale('pt-BR').format('D [de] MMMM [de] YYYY')}
                </Typography>
              }
              {!!data?.endereco_de_entrega &&
                <Typography variant="subtitle1" fontWeight="500">
                  Endereço de entrega: {data?.endereco_de_entrega?.logradouro}, {data?.endereco_de_entrega?.numero}
                  {' - '}
                  {!!data?.endereco_de_entrega?.complemento && data?.endereco_de_entrega?.complemento} -{' '}
                  {data?.endereco_de_entrega?.bairro?.nome} - {data?.endereco_de_entrega?.cep}
                </Typography>
              }
            </Box>
            <Box display="flex" flexDirection="column" gap={1}>
              <Chip
                label={aprovacaoProposta[data?.aprovacao]}
                color={colorAprovacaoProposta[data?.aprovacao]}
                variant="outlined"
              />
            </Box>
          </Grid>
          {!!data?.instrumentos.length && <>
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
                      capacidade_de_medicao: capacidadeDeMedicao,
                      tipo_de_instrumento: { descricao },
                      tipo_de_servico: tipoDeServico,
                      preco_calibracao_no_cliente: precoCalibracaoNoCliente,
                      preco_calibracao_no_laboratorio: precoCalibracaoNoLaboratorio,
                    },
                    preco_alternativo_calibracao: precoAlternativoCalibracao,
                    id,
                  },
                  index
                ) => (
                  <CardInformation
                    instrumento={{
                      tag,
                      numeroDeSerie,
                      dataUltimaCalibracao,
                      maximo,
                      minimo,
                      unidade,
                      capacidadeDeMedicao,
                      posicao,
                      descricao,
                      id,
                      tipoDeServico,
                      precoAlternativoCalibracao,
                      precoCalibracaoNoCliente,
                      precoCalibracaoNoLaboratorio,
                    }}
                    key={index}
                    proposta={data}
                  />
                )
              )}
            </Box>
          </>}
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
