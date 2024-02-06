/* eslint-disable react/prop-types */
import { useTheme } from '@emotion/react';
import { Box, Button, Card, Chip, Grid, Link, Typography } from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { useLocation } from 'react-router-dom';
import React from 'react';
import titleCase from '../../utils/formatTitle';

const posicaoInstrumento = {
  U: 'Em uso',
  E: 'Em estoque',
  I: 'Inativo',
  F: 'Fora de uso',
};

function CardInformation({ instrumento, titles, specialCases, proposta }) {
  const { pathname } = useLocation();

  const theme = useTheme();
  return (
    <Card sx={{ padding: 2, backgroundColor: theme.palette.background.neutral, minWidth: 400 }}>
      <Box display="flex" justifyContent="space-between" gap={2} mb={1}>
        <Typography fontWeight="900" color={'grey'} variant="body1">
          {instrumento?.descricao}
        </Typography>
        <Chip label={posicaoInstrumento[instrumento?.posicao]} size="small" variant="outlined" />
      </Box>
      <Box display="flex" flexDirection="column">
        {titles?.map((title, index) => (
          <Box key={index} display="flex" justifyContent="space-between" flexDirection="row">
            <Typography fontWeight="900" color={'grey'} variant="body1">
              {specialCases[title] || titleCase(title)}
            </Typography>
            <Typography fontWeight="400" color={'grey'} variant="body1">
              {instrumento[title]}
            </Typography>
          </Box>
        ))}
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Typography fontWeight="900" color={'grey'} variant="body1">
          Local
        </Typography>
        <Typography fontWeight="400" color={'grey'} variant="body1">
          {instrumento?.local === 'L' ? 'Laboratório' : 'No cliente'}
        </Typography>
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Typography fontWeight="900" color={'grey'} variant="body1">
          Faixa atendida
        </Typography>
        <Typography fontWeight="400" color={'grey'} variant="body1">
          {instrumento?.minimo} - {instrumento?.maximo} {instrumento?.unidade}
        </Typography>
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Typography fontWeight="900" color={'grey'} variant="body1">
          Capacidade de medição
        </Typography>
        <Typography fontWeight="400" color={'grey'} variant="body1">
          {instrumento?.valor} {instrumento?.unidadeMedicao}
        </Typography>
      </Box>
      <Box display="flex" justifyContent="space-between" mt={2}>
        {pathname.includes('/admin') && proposta.status === 'F' && (
          <Button variant="outlined" size="small" startIcon={<ReceiptLongIcon />}>
            <Link target="_blank" href={`https://rkp2023.pythonanywhere.com/propostas-files/${proposta.id}?instrumento=${instrumento.id}`}>Ver proposta</Link>
          </Button>
        )}
        <Typography fontWeight="900" color={'black'} variant="body1">
          {instrumento?.instrumento?.tipo_de_servico === 'A' ? 'Acreditado' : 'Não acreditado'}
        </Typography>
      </Box>
    </Card>
  );
}

export default CardInformation;
