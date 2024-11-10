import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Container,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import CloseIcon from '@mui/icons-material/Close';
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import useResponsive from '../hooks/useResponsive';
import useOrders from '../hooks/useOrders';
import Iconify from '../components/iconify';
import FormElaborate from '../components/orders/FormElaborate';
import { fDate } from '../utils/formatTime';
import { useAuth } from '../context/Auth';
import Instruments from '../components/orders/Instruments';
import AdditionalInformation from '../components/orders/AdditionalInformation';
import InformationProposol from '../components/orders/InformationProposol';


function OrderDetails() {
  const [edit, setEdit] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [response, setResponse] = useState({ status: 0, message: '' });
  const [elaborateOpen, setElaborateOpen] = useState(false);
  const { id, idClient } = useParams();
  const { user } = useAuth();
  const {
    data,
    refetch,
    deleteOrderAndNavigate,
    statusColor,
    aprove,
    refuse,
    statusString,
    sendProposolByEmail,
    removeInstrumentProposal,
    isRemoving,
    elaborate, 
    isLoading
  } = useOrders(id, idClient);
  const isMobile = useResponsive('down', 'md');

  const handleSendEmail = async () => {
    const response = await sendProposolByEmail()
    setResponse({ status: response?.status, message: response?.message })
    setOpenAlert(true)
  }
  return (
    <>
      <Helmet>
        <title>Proposta | Kometro </title>
      </Helmet>
      <Container>
        <Stack direction={isMobile ? "column" : "row"} alignItems={isMobile ? "flex-start" : "center"} justifyContent="space-between" mb={5}>
          <Box direction="column">
            {!!data?.numero &&
              <Typography variant="h4" gutterBottom>
                Proposta número: {data?.numero}
              </Typography>
            }
            {user?.admin ? (!!data?.cliente?.empresa?.razao_social || !!data?.cliente?.nome) &&
              <Typography variant="h6" gutterBottom>
                {data?.cliente?.nome && data?.cliente?.empresa?.razao_social ? `${data?.cliente?.empresa?.razao_social} - ${data?.cliente?.nome}` : data?.cliente?.empresa?.razao_social || data?.cliente?.nome}
              </Typography>
              : !!data?.data_criacao &&
              <Typography variant="h6" gutterBottom>
                {fDate(data?.data_criacao)}
              </Typography>
            }
          </Box>

          {user?.admin ? (
            <Box display="flex" gap={2} mt={isMobile ? 1 : 0} >
              <Tooltip title="Deletar proposta">
                <Button onClick={deleteOrderAndNavigate} color="secondary">
                  <Iconify icon="eva:trash-2-fill" />
                </Button>
              </Tooltip>
              {data?.status === 'E' ? (
                <Button color='secondary' variant="contained" onClick={() => setElaborateOpen(true)} endIcon={<Iconify icon="eva:checkmark-fill" />}>
                  Elaborar proposta
                </Button>
              ) : (
                <Button color='secondary' variant="contained" onClick={() => { setEdit(true); setElaborateOpen(true) }} endIcon={<Iconify icon="eva:edit-fill" />}>
                  Editar proposta
                </Button>
              )}
              <Tooltip title="Enviar proposta para email">
                <Button variant="contained" color="primary" disabled={data?.status === "E"} onClick={handleSendEmail} endIcon={<ForwardToInboxIcon />}>Enviar para cliente</Button>
              </Tooltip>
            </Box>
          ) : data?.status === "AA" && (
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
            open={elaborateOpen}
            data={data}
            setElaborate={setElaborateOpen}
            setResponseStatus={setResponse}
            setOpenAlert={setOpenAlert}
            editProposol={edit}
            elaborate={elaborate}
          />
        )}

        <Paper sx={{ padding: 4 }}>
          {data?.status === "E" ? <Typography variant='subtitle1'>As informações da proposta aparecerão aqui após a elaboração pela equipe</Typography> : (
            <InformationProposol
              data={data}
              isMobile={isMobile}
              admin={user?.admin}
              statusString={statusString}
              statusColor={statusColor}
            />
          )}
          <Instruments
            data={data}
            refetch={refetch}
            isLoading={isLoading}
            isMobile={isMobile}
            admin={user?.admin}
            removeInstrumentProposal={removeInstrumentProposal}
            isRemoving={isRemoving}
          />
          <AdditionalInformation data={data} />
        </Paper>
      </Container>
    </>
  );
}

export default OrderDetails;
