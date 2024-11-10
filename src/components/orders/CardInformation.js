/* eslint-disable react/prop-types */
import { useTheme } from '@emotion/react';
import { Box, Card, CardActions, CardContent, Chip, Typography } from '@mui/material';
import { useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { fDate } from '../../utils/formatTime';
import EditInstrument from '../EditInstrument';
import ButtonTooltip from '../ButtonTooltip';
import { localLabels, positionLabels } from '../../utils/instruments'
import ContentRow from '../ContentRowCard';


function CardInformation({ instrument, isMobile, admin, removeInstrumentProposal }) {
  const [edit, setEdit] = useState(false)
  const [openAlert, setOpenAlert] = useState({ open: false, msg: '', color: 'success' })
  const theme = useTheme();

  const priceOptions = {
    "C": instrument?.instrumento?.preco_calibracao_no_cliente,
    "T": instrument?.instrumento?.preco_calibracao_no_cliente,
    "P": instrument?.instrumento?.preco_calibracao_no_laboratorio,
  }
  const handleClose = () => {
    setEdit(false)
  }

  const handleOpenAlert = (msg, color) => setOpenAlert({ open: true, msg, color, });
  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenAlert({ open: false, msg: '', color: 'success' })
  }
  console.log(instrument)
  return (
    <Card sx={{
      backgroundColor: theme.palette.background.neutral,
      minWidth: isMobile ? '100%' : '40%',
      display: 'flex',
      justifyContent: 'space-between',
      flexDirection: 'column',
      scroll: "auto",
      mb: 2,
    }}>
      {edit && <EditInstrument handleOpenAlert={handleOpenAlert} handleClose={handleClose} open={edit} instrument={instrument} isMobile={isMobile} />}
      <CardContent p={2} sx={{
        padding: 2,
        height: '250px',
        overflow: 'auto',
      }}>
        <Box display="flex" justifyContent="space-between" gap={2} mb={1}>
          {!!instrument?.instrumento?.tipo_de_instrumento?.descricao &&
            <Typography fontWeight="900" color={'grey'} variant="body1">
              {instrument?.instrumento?.tipo_de_instrumento?.descricao}
            </Typography>}

          {!!instrument?.posicao &&
            <Chip label={positionLabels[instrument?.posicao]} size="small" variant="outlined" />}
        </Box>

        {!!instrument?.instrumento?.tipo_de_instrumento?.fabricante
          && (<ContentRow colorValue={"black"} title="Fabricante" value={instrument?.instrumento?.tipo_de_instrumento?.fabricante} />)}

        {!!instrument?.instrumento?.tipo_de_instrumento?.modelo
          && (<ContentRow colorValue={"black"} title="Modelo" value={instrument?.instrumento?.tipo_de_instrumento?.modelo} />)}

        {!!instrument?.instrumento?.tipo_de_instrumento?.resolucao
          && (<ContentRow colorValue={"black"} title="Resolução" value={instrument?.instrumento?.tipo_de_instrumento?.resolucao} />)}


        {!!instrument?.instrumento?.procedimento_relacionado?.codigo
          && (<ContentRow colorValue={"black"} title="Procedimento relacionado" value={instrument?.instrumento?.procedimento_relacionado?.codigo} />)}



        {!!instrument?.tag
          && (<ContentRow colorValue={"black"} title="Tag" value={instrument?.tag} />)}

        {!!instrument?.numero_de_serie
          && (<ContentRow colorValue={"black"} title="Número de série" value={instrument?.numero_de_serie} />)}

        {!!instrument?.data_ultima_calibracao &&
          (<ContentRow colorValue={"black"} title="Última calibração" value={fDate(instrument?.data_ultima_calibracao, "dd/MM/yyyy")} />)}

        {!!instrument?.data_proxima_calibracao &&
          (<ContentRow colorValue={"black"} title="Próxima calibração" value={fDate(instrument?.data_proxima_calibracao, "dd/MM/yyyy")} />)}

        {!!instrument?.data_proxima_checagem &&
          (<ContentRow colorValue={"black"} title="Próxima checagem" value={fDate(instrument?.data_proxima_checagem, "dd/MM/yyyy")} />)}


        {!!instrument?.frequencia && (
          <ContentRow colorValue={"black"} title="Frequência" value={instrument?.frequencia > 1 ? `${instrument?.frequencia} meses` : `$${instrument?.frequencia} mês`} />)}



        {(!!instrument?.instrumento?.minimo || !!instrument?.instrumento?.maximo) &&
          (<ContentRow colorValue={"black"} title="Faixa atendida" isMobile={isMobile} value={`${instrument?.instrumento?.minimo} ${!!instrument?.instrumento?.maximo && `- ${instrument?.instrumento?.maximo}`} ${!!instrument?.instrumento?.unidade && `- ${instrument?.instrumento?.unidade}`}`} />)}
        {!!instrument?.instrumento?.capacidade_de_medicao?.valor && !!instrument?.instrumento?.capacidade_de_medicao?.unidade &&
          (<ContentRow colorValue={"black"} title="Capacidade de medição" isMobile={isMobile} value={`${instrument?.instrumento?.capacidade_de_medicao?.valor} ${instrument?.instrumento?.capacidade_de_medicao?.unidade}`} />)}

        {!!instrument?.local && (
          <ContentRow colorValue={"black"} title="Local" value={localLabels[instrument?.local]} />)}

        {!!instrument?.laboratorio && (
          <ContentRow colorValue={"black"} title="Laboratório" value={instrument?.laboratorio} />)}

        {!!instrument?.dias_uteis
          && instrument?.show_business_days
          && <ContentRow colorValue={"black"} title="Dias úteis" value={instrument?.dias_uteis} />}

        {(!!instrument?.instrumento?.preco_calibracao_no_cliente || !!instrument?.instrumento?.preco_calibracao_no_laboratorio || !!instrument?.preco_alternativo_calibracao) &&
          <ContentRow colorValue={"black"} title="Preço calibração" value={`R$ ${instrument?.preco_alternativo_calibracao ? instrument?.preco_alternativo_calibracao : (priceOptions[instrument?.local] || '')}`} />}

        {!!instrument?.pontos_de_calibracao?.length && (
          <ContentRow colorValue={"black"} title="Pontos de calibração" isMobile={isMobile} value={instrument?.pontos_de_calibracao?.map(({ nome }) => nome).join(", ")} />)}

        {!!instrument?.observacoes && (
          <ContentRow colorValue={"black"} title="Observações" isMobile={isMobile} value={instrument?.observacoes} />)}

      </CardContent>
      <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {!!instrument?.instrumento?.tipo_de_servico &&
          <Typography fontWeight="900" color={'black'} variant="body1">
            {instrument?.instrumento?.tipo_de_servico === 'A' ? 'Acreditado' : 'Não acreditado'}
          </Typography>}
        {admin &&
          <Box display="flex">
            <ButtonTooltip title="Editar conteudo" action={() => setEdit((oldValue) => !oldValue)} icon={<EditIcon />} />
            <ButtonTooltip title="Remover instrumento da proposta" action={() => removeInstrumentProposal(instrument.id)} icon={<DeleteIcon />} />
          </Box>
        }
      </CardActions>
    </Card >
  );
}

export default CardInformation;
