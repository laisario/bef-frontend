/* eslint-disable react/prop-types */
import { useTheme } from '@emotion/react';
import { Box, Card, CardActions, CardContent, Chip, Typography } from '@mui/material';
import { useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { fDate } from '../../utils/formatTime';
import EditInstrument from './EditInstrument';
import Button from '../ButtonTooltip';
import { localLabels, positionLabels } from '../../utils/instruments'


function ContentRow({ title, value, isMobile }) {
  return (
    <Box display="flex" flexDirection={isMobile ? 'column' : 'row'} justifyContent={isMobile ? "flex-start" : "space-between"}>
      <Typography fontWeight="900" color={'grey'} variant="body1">
        {title}
      </Typography>
      <Typography fontWeight="400" color={'grey'} variant="body1">
        {value}
      </Typography>
    </Box>
  )
}


function CardInformation({ instrument, isMobile, admin, removeInstrumentProposal }) {
  const [edit, setEdit] = useState(false)
  const theme = useTheme();

  const priceOptions = {
    "C": instrument?.instrumento?.preco_calibracao_no_cliente,
    "T": instrument?.instrumento?.preco_calibracao_no_cliente,
    "P": instrument?.instrumento?.preco_calibracao_no_laboratorio,
  }
  const handleClose = () => {
    setEdit(false)
  }

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
      {edit && <EditInstrument handleClose={handleClose} open={edit} instrument={instrument} isMobile={isMobile} />}
      <CardContent p={2} sx={{ padding: 2 }}>
        <Box display="flex" justifyContent="space-between" gap={2} mb={1}>
          {!!instrument?.instrumento?.tipo_de_instrumento?.descricao &&
            <Typography fontWeight="900" color={'grey'} variant="body1">
              {instrument?.instrumento?.tipo_de_instrumento?.descricao}
            </Typography>}

          {!!instrument?.posicao &&
            <Chip label={positionLabels[instrument?.posicao]} size="small" variant="outlined" />}
        </Box>

        {!!instrument?.tag
          && (<ContentRow title="Tag" value={instrument?.tag} isMobile={isMobile} />)}

        {!!instrument?.numero_de_serie
          && (<ContentRow title="Número de série" isMobile={isMobile} value={instrument?.numero_de_serie} />)}

        {!!instrument?.data_ultima_calibracao &&
          (<ContentRow title="Última calibração" isMobile={isMobile} value={fDate(instrument?.data_ultima_calibracao, "dd /MM/yyyy")} />)}

        {(!!instrument?.instrumento?.minimo || !!instrument?.instrumento?.maximo) &&
          (<ContentRow title="Faixa atendida" isMobile={isMobile} value={`${instrument?.instrumento?.minimo} ${!!instrument?.instrumento?.maximo && `- ${instrument?.instrumento?.maximo}`} ${!!instrument?.instrumento?.unidade && `- ${instrument?.instrumento?.unidade}`}`} />)}
        {!!instrument?.instrumento?.capacidade_de_medicao?.valor && !!instrument?.instrumento?.capacidade_de_medicao?.unidade &&
          (<ContentRow title="Capacidade de medição" isMobile={isMobile} value={`${instrument?.instrumento?.capacidade_de_medicao?.valor} ${instrument?.instrumento?.capacidade_de_medicao?.unidade}`} />)}

        {!!instrument?.local && (
          <ContentRow title="Local" isMobile={isMobile} value={localLabels[instrument?.local]} />)}

        {!!instrument?.dias_uteis
          && instrument?.show_business_days
          && <ContentRow title="Dias uteis" isMobile={isMobile} value={instrument?.dias_uteis} />}

        {(!!instrument?.instrumento?.preco_calibracao_no_cliente || !!instrument?.instrumento?.preco_calibracao_no_laboratorio) &&
          <ContentRow title="Preço calibração" isMobile={isMobile} value={`R$ ${instrument?.preco_alternativo_calibracao ? instrument?.preco_alternativo_calibracao : (priceOptions[instrument?.local] || '')}`} />}

        {!!instrument?.pontos_de_calibracao?.length && (
          <ContentRow title="Pontos de calibração" isMobile={isMobile} value={instrument?.pontos_de_calibracao?.map(({ nome }) => nome).join(", ")} />)}

      </CardContent>
      <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {!!instrument?.instrumento?.tipo_de_servico &&
          <Typography fontWeight="900" color={'black'} variant="body1">
            {instrument?.instrumento?.tipo_de_servico === 'A' ? 'Acreditado' : 'Não acreditado'}
          </Typography>}
        {admin &&
          <Box display="flex">
            <Button title="Editar conteudo" action={() => setEdit((oldValue) => !oldValue)} icon={<EditIcon />} />
            <Button title="Remover instrumento da proposta" action={() => removeInstrumentProposal(instrument.id)} icon={<DeleteIcon />} />
          </Box>
        }
      </CardActions>
    </Card >
  );
}

export default CardInformation;
