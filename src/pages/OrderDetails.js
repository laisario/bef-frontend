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
  Tooltip,
  Typography,
} from '@mui/material';
import Card from '@mui/material/Card';
import { Helmet } from 'react-helmet-async';
import DownloadIcon from '@mui/icons-material/Download';
import PreviewIcon from '@mui/icons-material/Preview';
import CloseIcon from '@mui/icons-material/Close';
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import { useTheme } from '@emotion/react';
import dayjs from 'dayjs';
import useResponsive from '../hooks/useResponsive';
import useOrders from '../hooks/useOrders';
import CardInformation from '../components/orders/CardInformation';
import Iconify from '../components/iconify';
import { capitalizeFirstLetter as CFL } from '../utils/formatString';
import FormElaborate from '../components/orders/FormElaborate';
import { fDate } from '../utils/formatTime';
import { useAuth } from '../context/Auth';
import titleCase from '../utils/formatTitle';


const formaPagamento = {
  CD: 'Débito',
  CC: 'Crédito',
  P: 'Pix',
  D: 'Dinheiro',
  B: 'Boleto',
};

function OrderDetails() {
  const [edit, setEdit] = useState(false);
  const [elaborate, setElaborate] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [response, setResponse] = useState({
    status: 0,
    message: '',
  });
  const { id } = useParams();
  const { user: { admin } } = useAuth();
  const {
    data,
    deleteOrderAndNavigate,
    statusColor,
    aprove,
    refuse,
    statusString,
    sendProposolByEmail,
    pdfFile,
  } = useOrders(id);
  const theme = useTheme();
  const isMobile = useResponsive('down', 'md');

  const handleSendEmail = async () => {
    const response = await sendProposolByEmail()
    setResponse({ status: response?.status, message: response?.message })
    setOpenAlert(true)
  }
  return (
    <>
      <Helmet>
        <title>Proposta | KOMETRO </title>
      </Helmet>
      <Container>
        <Stack direction={isMobile ? "column" : "row"} alignItems={isMobile ? "flex-start" : "center"} justifyContent="space-between" mb={5}>
          <Box direction="column">
            {!!data?.numero &&
              <Typography variant="h4" gutterBottom>
                Proposta número: {data?.numero}
              </Typography>
            }
            {admin ? (!!data?.cliente?.empresa || !!data?.cliente?.nome) &&
              <Typography variant="h6" gutterBottom>
                {data?.cliente?.nome && data?.cliente?.empresa?.razao_social ? `${data?.cliente?.empresa?.razao_social} - ${data?.cliente?.nome}` : data?.cliente?.empresa?.razao_social || data?.cliente?.nome}
              </Typography>
              : !!data?.data_criacao &&
              <Typography variant="h6" gutterBottom>
                {fDate(data?.data_criacao)}
              </Typography>
            }
          </Box>


          {admin ? (
            <Box display="flex" gap={2} mt={isMobile ? 1 : 0} >
              <Tooltip title="Deletar proposta">
                <Button onClick={deleteOrderAndNavigate} color="secondary">
                  <Iconify icon="eva:trash-2-fill" />
                </Button>
              </Tooltip>
              <Tooltip title="Enviar proposta para email">
                <Button variant="outlined" color="secondary" disabled={data?.status === "E"} onClick={handleSendEmail} endIcon={<ForwardToInboxIcon />}>Enviar para cliente</Button>
              </Tooltip>
              {data?.status === 'E' ? (
                <Button variant="contained" onClick={() => setElaborate(true)} endIcon={<Iconify icon="eva:checkmark-fill" />}>
                  Elaborar proposta
                </Button>
              ) : (
                <Button variant="contained" onClick={() => { setEdit(true); setElaborate(true) }} endIcon={<Iconify icon="eva:edit-fill" />}>
                  Editar proposta
                </Button>
              )}
            </Box>
          ) : (
            <Box display='flex'>
              <Tooltip title="Clique para aprovar a proposta">
                <Button
                  variant="contained"
                  disabled={data?.status !== "AA"}
                  sx={{ marginX: 2 }}
                  onClick={() => aprove()}
                  startIcon={<Iconify icon="eva:checkmark-fill" />}
                >
                  Aprovar proposta
                </Button>
              </Tooltip>
              <Tooltip title="Clique para reprovar a proposta">
                <Button
                  variant="contained"
                  color="error"
                  disabled={data?.status !== "AA"}
                  onClick={() => refuse()}
                  startIcon={<Iconify icon="ph:x-bold" />}
                >
                  Reprovar proposta
                </Button>
              </Tooltip>
            </Box>
          )}
        </Stack>
        {openAlert && (
          <Alert
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setOpenAlert((oldValue) => !oldValue);
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
            severity={response?.status === 200 ? "success" : "error"}
          >
            {response?.message}
          </Alert>
        )}
        {!!data && (
          <FormElaborate
            open={elaborate}
            data={data}
            setElaborate={setElaborate}
            setResponseStatus={setResponse}
            setOpenAlert={setOpenAlert}
            editProposol={edit}
          />
        )}
        <Paper sx={{ padding: 4 }}>
          <Grid container justifyContent="space-between">
            <Box>
              {isMobile && (<Chip
                label={statusString[data?.status]}
                color={statusColor[data?.status]}
                variant="filled"
                sx={{ color: '#fff', marginBottom: 1 }}
              />)}
              <div>
                {isMobile && !!pdfFile && <Tooltip placement="right-end" title="Clique para abrir pdf da proposta">
                  <Button
                    startIcon={<PreviewIcon />}
                    target="_blank"
                    href={pdfFile}
                    color='secondary'
                  >
                    Proposta
                  </Button>
                </Tooltip>}
                {isMobile && !!data?.anexo && (
                  <Tooltip placement="right-end" title="Clique para ver documento anexado">
                    <Button startIcon={<DownloadIcon />} href={data?.anexo} color='secondary'>
                      Anexo
                    </Button>
                  </Tooltip>
                )}
              </div>
              {+(data?.total) > 0 &&
                <Typography variant="h6">Total: R${data?.total}</Typography>
              }
              {!!data?.data_criacao &&
                <Typography variant="subtitle1" fontWeight="500">
                  Proposta criada: {dayjs(data?.data_criacao).locale('pt-BR').format('D [de] MMMM [de] YYYY')}
                </Typography>
              }
              {!!data?.data_aprovacao &&
                <Typography variant="subtitle1" fontWeight="500">
                  Data {data?.status === "A" ? 'aprovação' : 'recusada'}: {dayjs(data?.data_aprovacao).locale('pt-BR').format('D [de] MMMM [de] YYYY')}
                </Typography>
              }
              {!!data?.prazo_de_pagamento &&
                <Typography variant="subtitle1" fontWeight="500">
                  Prazo de pagamento: {dayjs(data?.prazo_de_pagamento).locale('pt-BR').format('D [de] MMMM [de] YYYY')}
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
              {!!data?.endereco_de_entrega &&
                <Typography variant="subtitle1" fontWeight="500">
                  Endereço de entrega: {data?.endereco_de_entrega?.logradouro}, {data?.endereco_de_entrega?.numero}
                  {' - '}
                  {!!data?.endereco_de_entrega?.complemento && data?.endereco_de_entrega?.complemento} -{' '}
                  {data?.endereco_de_entrega?.bairro?.nome} - {data?.endereco_de_entrega?.cep}
                </Typography>
              }
              {!!data?.responsavel?.username && (<Typography variant="subtitle1" fontWeight="500">Funcionário responsável: {titleCase(data?.responsavel?.username)}</Typography>)}
            </Box>
            <Box display="flex" flexDirection={isMobile ? "row" : "column"} gap={1}>
              {!isMobile && (<Chip
                label={statusString[data?.status]}
                color={statusColor[data?.status]}
                variant="filled"
                sx={{ color: '#fff' }}
              />)}

              {!isMobile && !!pdfFile && <Tooltip placement="right-end" title="Clique para abrir pdf da proposta">
                <Button
                  startIcon={<PreviewIcon />}
                  target="_blank"
                  href={pdfFile}
                  color='secondary'
                >
                  Proposta
                </Button>
              </Tooltip>}
              {!isMobile && !!data?.anexo && (
                <Tooltip placement="right-end" title="Clique para ver documento anexado">
                  <Button startIcon={<DownloadIcon/>} href={data?.anexo} target="_blank" color='secondary'>
                    Anexo
                  </Button>
                </Tooltip>
              )}
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
                    local,
                    prazo_de_entrega: prazoDeEntrega,
                    dias_uteis: diasUteis
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
                      local,
                      prazoDeEntrega,
                      diasUteis
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
