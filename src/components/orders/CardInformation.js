/* eslint-disable react/prop-types */
import { useTheme } from '@emotion/react';
import { Box, Card, Chip, Grid, Typography } from '@mui/material';
import React from 'react';
import { fDateTime } from '../../utils/formatTime';
import { capitalizeFirstLetter as CFL } from '../../utils/formatString';

const posicaoInstrumento = {
  U: 'Em uso',
  E: 'Em estoque',
  I: 'Inativo',
  F: 'Fora de uso',
};

function CardInformation({ instrumento, colorText = 'grey' }) {
  const theme = useTheme();
  return (
    <Card sx={{ padding: 2, backgroundColor: theme.palette.background.neutral }}>
      <Box display="flex" justifyContent="space-between" mb={1}>
        <Typography fontWeight="900" color={'grey'} variant="body1">
          {instrumento?.instrumento?.tipo_de_instrumento?.descricao}
        </Typography>
        <Chip label={posicaoInstrumento[instrumento?.posicao]} size="small" variant="outlined" />
      </Box>
      <Typography fontWeight="900" color={'grey'} variant="body1">
        Tag: <span style={{ fontWeight: '400' }}>{instrumento?.tag}</span>
      </Typography>
      <Typography fontWeight="900" color={'grey'} variant="body1">
        Número de série: <span style={{ fontWeight: '400' }}>{instrumento?.numero_de_serie}</span>
      </Typography>
      <Typography fontWeight="900" color={'grey'} variant="body1">
        Faixa atendida:{' '}
        <span style={{ fontWeight: '400' }}>
          {Number(instrumento?.instrumento?.minimo).toFixed()}-{Number(instrumento?.instrumento?.maximo).toFixed()}{' '}
          {instrumento.instrumento.unidade}
        </span>
      </Typography>
      <Typography variant="body1" color={colorText} fontWeight={colorText !== 'grey' ? null : '900'}>
        Capacidade de Medição: <span style={{ fontWeight: '400' }}>{Number(instrumento?.instrumento?.capacidade_de_medicao.valor).toFixed()}{' '}
        {instrumento?.instrumento?.capacidade_de_medicao.unidade}</span>
      </Typography>
      <Typography variant="body1" color={colorText} fontWeight={colorText !== 'grey' ? null : '900'}>
        Última calibração: <span style={{ fontWeight: '400' }}>{fDateTime(instrumento?.data_ultima_calibracao)}</span>
      </Typography>
      <Typography fontWeight="900" color={'grey'} variant="body1">
        {instrumento?.instrumento?.tipo_de_servico === 'A' ? 'Acreditado' : 'Não acreditado'}
      </Typography>
      <Typography variant="body1" color={colorText} fontWeight={colorText !== 'grey' ? null : '900'}>
        Status: <span style={{ fontWeight: '400' }}>{instrumento?.status.nome}</span>
      </Typography>
      <Typography variant="body1" color={colorText} fontWeight={colorText !== 'grey' ? null : '900'}>
        Laboratorio: <span style={{ fontWeight: '400' }}>{CFL(instrumento?.laboratorio)}</span>
      </Typography>
      <Typography variant="body1" color={colorText} fontWeight={colorText !== 'grey' ? null : '900'}>
        Observação: <span style={{ fontWeight: '400' }}>{CFL(instrumento?.observacoes)}</span>
      </Typography>
    </Card>
  );
}

export default CardInformation;
