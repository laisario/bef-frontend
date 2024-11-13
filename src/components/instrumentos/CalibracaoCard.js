/* eslint-disable react/prop-types */
import { Box, Button, Card, CardActions, CardContent, CircularProgress, Divider } from '@mui/material';
import React, { useEffect, useState } from 'react';
import AttachmentIcon from '@mui/icons-material/Attachment';
import { fDate } from '../../utils/formatTime';
import CriticalAnalysisDialog from './CriticalAnalysisDialog';
import ContentRow from '../ContentRowCard';
import Label from '../label';
import { statusColor, statusLabel, analiseCriticaColor, analiseCriticaLabel } from '../../utils/calibration';
import { truncateString } from '../../utils/formatString';
import Attachment from '../Attachment';
import Certificates from '../calibration/Certificates';
import Alert from '../Alert';

function CalibracaoCard({ calibracao, theme, isMobile, mutateCriticalAnalisys, isLoadingCriticalAnalisys, isSuccessCriticalAnalisys }) {
  const [open, setOpen] = useState(false);
  const [analiseCliente, setAnaliseCliete] = useState({
    criticalAnalysis: "A",
    restriction: ''
  });
  const [readMore, setReadMore] = useState({
    readMoreObservation: {
      readMore: false,
      readUntil: 15,
    },
    readMoreCriticalAnalisys: {
      readMore: false,
      readUntil: 15,
    },
    readMoreCertificate: false
  })
  const [openAlert, setOpenAlert] = useState(false)
  const [alert, setAlert] = useState({
    msg: '',
    severity: 'success'
  })

  const handleConfirmationAnalysis = (analiseCritica) => {
    try {
      mutateCriticalAnalisys({ idCalibration: calibracao?.id, analiseCliente: analiseCritica })
      setOpenAlert(true)
    } catch (error) {
      console.log(error)
      setAlert({ msg: 'Ocorreu um erro ao criar sua ánalise. Tente mais tarde!', severity: 'error' })
    }
    handleClose();
  }

  useEffect(() => {
    if (isSuccessCriticalAnalisys) {
      setAlert({ msg: 'Ánalise criada com sucesso!', severity: 'success' })
    } else {
      setAlert({ msg: 'Ocorreu um erro ao criar sua ánalise. Tente novamente!', severity: 'error' })
    }
  }, [openAlert])

  const handleChange = (event) => {
    setAnaliseCliete((prevValue) => ({ ...prevValue, [event.target.name]: event.target.value }))
  }

  const handleClose = () => {
    setOpen(false);
    setAnaliseCliete({})
  }

  const readMoreObservation = () => setReadMore((oldValues) => ({ ...oldValues, readMoreObservation: { readMore: true, readUntil: null } }))
  const readLessObservation = () => setReadMore((oldValues) => ({ ...oldValues, readMoreObservation: { readMore: false, readUntil: 15 } }))

  const readMoreCriticalAnalisys = () => setReadMore((oldValues) => ({ ...oldValues, readMoreCriticalAnalisys: { readMore: true, readUntil: null } }))
  const readLessCriticalAnalisys = () => setReadMore((oldValues) => ({ ...oldValues, readMoreCriticalAnalisys: { readMore: false, readUntil: 15 } }))

  const readMoreCertificates = () => setReadMore((oldValues) => ({ ...oldValues, readMoreCertificate: true }))
  const readLessCertificates = () => setReadMore((oldValues) => ({ ...oldValues, readMoreCertificate: false }))

  const certificado = calibracao?.certificados[0]

  return (
    <Card sx={{ backgroundColor: theme.palette.background.neutral, minWidth: isMobile ? '100%' : '35%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <CardContent>
        {(!!calibracao?.data || !!calibracao?.status) &&
          <ContentRow title={calibracao?.ordem_de_servico} value={fDate(calibracao?.data, "dd/MM/yy")} />}
        {calibracao?.local && (
          <ContentRow title="Local" value={calibracao?.local} />
        )}
        {calibracao?.observacoes && (
          <ContentRow title="Observações:" isMobile={readMore?.readMoreObservation?.readMore} value={truncateString(calibracao?.observacoes, readMore?.readMoreObservation?.readUntil)} />
        )}
        {(calibracao?.observacoes?.length > 15)
          && <Box sx={{ m: 0, display: 'flex', justifyContent: 'flex-end' }}>
            <Button sx={{ color: 'black', p: 0 }} onClick={readMore?.readMoreObservation?.readMore ? readLessObservation : readMoreObservation}>{readMore?.readMoreObservation?.readMore ? 'Ler menos' : 'Ler mais'}</Button>
          </Box>}
        {(calibracao?.status)
          && <ContentRow title="Resultado" colorTitle='black' my={1} value={<Label color={statusColor[calibracao?.status]}>{statusLabel[calibracao?.status]}</Label>} />
        }
        {calibracao?.maior_erro && (
          <ContentRow title="Maior erro" value={calibracao?.maior_erro} />
        )}
        {calibracao?.incerteza && (
          <ContentRow title="Incerteza" value={calibracao?.incerteza} />
        )}
        {calibracao?.criterio_de_aceitacao && (
          <ContentRow title="Critério de aceitação" value={calibracao?.criterio_de_aceitacao} />
        )}
        {calibracao?.referencia_do_criterio && (
          <ContentRow title="Referência do critério" value={calibracao?.referencia_do_criterio} />
        )}
        {(calibracao?.analise_critica)
          && <ContentRow title={calibracao?.analiseCritica !== "P" ? "Sua análise crítica" : "Análise critica"} colorTitle='black' my={1} value={<Label color={analiseCriticaColor[calibracao?.analise_critica]}>{analiseCriticaLabel[calibracao?.analise_critica]}</Label>} />}
        {calibracao?.restricao_analise_critica && (
          <>
            <ContentRow title="Restrição:" isMobile={readMore?.readMoreCriticalAnalisys?.readMore} value={truncateString(calibracao?.restricao_analise_critica, readMore?.readMoreCriticalAnalisys?.readUntil)} />
            {(calibracao?.restricao_analise_critica?.length > 15)
              && <Box sx={{ m: 0, display: 'flex', justifyContent: 'flex-end' }}>
                <Button sx={{ color: 'black', p: 0 }} onClick={readMore?.readMoreCriticalAnalisys?.readMore ? readLessCriticalAnalisys : readMoreCriticalAnalisys}>{readMore?.readMoreCriticalAnalisys?.readMore ? 'Ler menos' : 'Ler mais'}</Button>
              </Box>}
          </>

        )}
        {!!calibracao?.certificados?.length && <Divider orientation={"horizontal"} flexItem sx={{ my: 1 }} />}
        {!!calibracao?.certificados?.length && (
          <Box>
            <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 2 }}>
              {certificado?.numero && <ContentRow colorTitle='black' title="Certificado:" value={<Attachment url={certificado?.arquivo} content={certificado?.numero} />} />}
              {(certificado?.anexos?.map(({ anexo, id }, index) => (
                <ContentRow key={id + index} my={0} title={`Anexo ${index + 1}`} value={<Attachment url={anexo} content={<AttachmentIcon fontSize='small' />} />} />
              )))}
            </Box>
            {(calibracao?.certificados?.length > 1)
              && <Box sx={{ m: 0, display: 'flex', justifyContent: 'flex-end' }}>
                <Button sx={{ color: 'black' }} onClick={readMoreCertificates}>Ver todos</Button>
              </Box>}
          </Box>)}
        <Certificates
          certificados={calibracao?.certificados || []}
          open={readMore?.readMoreCertificate}
          handleClose={readLessCertificates}
          isMobile={isMobile}
        />
      </CardContent>
      {openAlert && <Alert open={openAlert} setOpen={setOpen} texto={alert?.msg} severity={alert?.severity} />}
      {calibracao?.analise_critica === "P" && (
        <CardActions sx={{ display: "flex", justifyContent: calibracao?.analise_critica === "P" ? "flex-end" : "space-between", m: 1 }}>
          {isLoadingCriticalAnalisys ? <CircularProgress /> : <Button onClick={() => setOpen(true)}>Análise Crítica</Button>}
          <CriticalAnalysisDialog
            open={open}
            handleClose={handleClose}
            handleConfirmationAnalysis={handleConfirmationAnalysis}
            analiseCliente={analiseCliente}
            setAnaliseCliete={setAnaliseCliete}
            handleChange={handleChange}
          />
        </CardActions>
      )}
    </Card>
  );
}

export default CalibracaoCard;
