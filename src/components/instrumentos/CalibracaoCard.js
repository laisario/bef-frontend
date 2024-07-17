/* eslint-disable react/prop-types */
import { useTheme } from '@emotion/react';
import { Box, Button, Card, CardActions, CardContent, Chip, Link, Tooltip, Typography } from '@mui/material';
import React, { useState } from 'react';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import titleCase from '../../utils/formatTitle';
import { fDate } from '../../utils/formatTime';
import useInstrumentos from '../../hooks/useInstrumentos';
import CriticalAnalysisDialog from './CriticalAnalysisDialog';

function CalibracaoCard({ calibracao, titles, specialCases }) {
  const [open, setOpen] = useState(false);
  const [analiseCliente, setAnaliseCliete] = useState({});
  const theme = useTheme();
  const { mutate, refetch } = useInstrumentos();
  const handleConfirmationAnalysis = (analiseCritica) => {
    try {
      mutate({ idCalibration: calibracao.id, analiseCliente: analiseCritica })
      refetch()
    } catch (error) {
      console.log("Xi deu ruim", error)
    }
    handleClose();
  }

  const handleChange = (event) => {
    setAnaliseCliete((prevValue) => ({ ...prevValue, [event.target.name]: event.target.value }))
  }

  const handleClose = () => {
    setOpen(false);
    setAnaliseCliete({})
  }

  const analises = {
    "A": "Aprovado",
    "R": "Aprovado com restrições",
    "X": "Reprovado",
  }

  return (
    <Card sx={{ backgroundColor: theme.palette.background.default, minWidth: 400 }}>
      <CardContent>

        <Box display="flex" justifyContent="space-between" gap={2} mb={1}>
          <Typography fontWeight="900" color={'grey'} variant="body1">
            {fDate(calibracao?.data)}
          </Typography>
          <Chip
            label={calibracao?.status === 'A' ? 'Aprovado' : 'Reprovado'}
            color={calibracao?.status === 'A' ? 'success' : 'error'}
            size="small"
            variant="outlined"
          />
        </Box>
        <Box display="flex" flexDirection="column">
          {titles?.filter(title => !!calibracao[title])?.map((title, index) => (
            <Box key={index} display="flex" justifyContent="space-between" flexDirection="row">
              <Typography fontWeight="900" color={'grey'} variant="body1">
                {specialCases[title] || titleCase(title)}
              </Typography>
              <Typography fontWeight="400" color={'grey'} variant="body1">
                {calibracao[title]}
              </Typography>
            </Box>
          ))}
        </Box>
        {!!calibracao?.certificado && <Box display="flex" justifyContent="space-between" gap={2} mt={1}>
          <Typography fontWeight="900" color={'grey'} variant="body1">
            Certificado
          </Typography>
          <Link fontWeight="900" href={calibracao?.certificado} variant="body1">
            <ReceiptLongIcon /> Abrir
          </Link>
        </Box>}
      </CardContent>
      <CardActions sx={{ display: "flex", justifyContent: calibracao?.analiseCritica === "P" ? "flex-end" : "space-between", m: 1, }}>
        {calibracao?.analiseCritica === "P"
          ?
          <>
            <Button onClick={() => setOpen(true)}>Análise Crítica</Button>
            <CriticalAnalysisDialog
              open={open}
              handleClose={handleClose}
              handleConfirmationAnalysis={handleConfirmationAnalysis}
              analiseCliente={analiseCliente}
              setAnaliseCliete={setAnaliseCliete}
              handleChange={handleChange}
            />
          </>
          : <>
            <Typography fontWeight="900" color={'grey'} variant="body1">
              Sua análise crítica
            </Typography>
            <Tooltip title={calibracao?.analiseCritica === "R" && calibracao?.restricaoAnaliseCritica} placement="right-start">
              <Typography fontWeight="600" color={'black'} variant="body1">{analises[calibracao?.analiseCritica]}</Typography>
            </Tooltip>
          </>

        }
      </CardActions>
    </Card >
  );
}

export default CalibracaoCard;
