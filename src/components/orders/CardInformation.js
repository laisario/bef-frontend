/* eslint-disable react/prop-types */
import { useTheme } from '@emotion/react';
import { Box, Button, Card, Chip, Link, Typography } from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { useLocation } from 'react-router-dom';
import React from 'react';
import { fDate } from '../../utils/formatTime';

const posicaoInstrumento = {
  U: 'Em uso',
  E: 'Em estoque',
  I: 'Inativo',
  F: 'Fora de uso',
};

function CardInformation({ instrumento, proposta }) {
  const { pathname } = useLocation();
  const theme = useTheme();
  return (
    <Card sx={{ padding: 2, backgroundColor: theme.palette.background.neutral, minWidth: 400 }}>
      <Box display="flex" justifyContent="space-between" gap={2} mb={1}>
        {!!instrumento?.descricao &&
          <Typography fontWeight="900" color={'grey'} variant="body1">
            {instrumento?.descricao}
          </Typography>
        }
        {!!instrumento?.posicao &&
          <Chip label={posicaoInstrumento[instrumento?.posicao]} size="small" variant="outlined" />
        }
      </Box>
      {!!instrumento?.tag &&
        <Box display="flex" justifyContent="space-between">
          <Typography fontWeight="900" color={'grey'} variant="body1">
            Tag
          </Typography>
          <Typography fontWeight="400" color={'grey'} variant="body1">
            {instrumento?.tag}
          </Typography>
        </Box>
      }
      {!!instrumento?.numeroDeSerie &&
        <Box display="flex" justifyContent="space-between">
          <Typography fontWeight="900" color={'grey'} variant="body1">
            Número de série
          </Typography>
          <Typography fontWeight="400" color={'grey'} variant="body1">
            {instrumento?.numeroDeSerie}
          </Typography>
        </Box>
      }
      {!!instrumento?.dataUltimaCalibracao &&
        <Box display="flex" justifyContent="space-between">
          <Typography fontWeight="900" color={'grey'} variant="body1">
            Data última calibração
          </Typography>
          <Typography fontWeight="400" color={'grey'} variant="body1">
            {fDate(instrumento?.dataUltimaCalibracao)}
          </Typography>
        </Box>
      }
      {!!instrumento?.informacoesAdicionais &&
        <Box display="flex" justifyContent="space-between">
          <Typography fontWeight="900" color={'grey'} variant="body1">
            Informações adicionais
          </Typography>
          <Typography fontWeight="400" color={'grey'} variant="body1">
            {instrumento?.numeroDeSerie}
          </Typography>
        </Box>
      }
      {!!instrumento?.local &&
        <Box display="flex" justifyContent="space-between">
          <Typography fontWeight="900" color={'grey'} variant="body1">
            Local
          </Typography>
          <Typography fontWeight="400" color={'grey'} variant="body1">
            {instrumento?.local === 'L' ? 'Laboratório' : 'No cliente'}
          </Typography>
        </Box>
      }
      {(!!instrumento?.minimo || !!instrumento?.maximo) &&
        <Box display="flex" justifyContent="space-between">
          <Typography fontWeight="900" color={'grey'} variant="body1">
            Faixa atendida
          </Typography>
          <Typography fontWeight="400" color={'grey'} variant="body1">
            {instrumento?.minimo} {!!instrumento?.maximo && `- ${instrumento?.maximo}`} {instrumento?.unidade}
          </Typography>
        </Box>
      }
      {!!instrumento?.valor && !!instrumento?.unidadeMedicao && (<Box display="flex" justifyContent="space-between">
        <Typography fontWeight="900" color={'grey'} variant="body1">
          Capacidade de medição
        </Typography>
        <Typography fontWeight="400" color={'grey'} variant="body1">
          {instrumento?.valor} {instrumento?.unidadeMedicao}
        </Typography>
      </Box>)}
      <Box display="flex" justifyContent="space-between" mt={2}>
        {pathname.includes('/admin') && proposta.status === 'F' && (
          <Button variant="outlined" size="small" startIcon={<ReceiptLongIcon />}>
            <Link target="_blank" href={`https://rkp2023.pythonanywhere.com/propostas-files/${proposta.id}?instrumento=${instrumento.id}`}>Ver proposta</Link>
          </Button>
        )}
        {!!instrumento?.tipoDeServico &&
          <Typography fontWeight="900" color={'black'} variant="body1">
            {instrumento?.tipoDeServico === 'A' ? 'Acreditado' : 'Não acreditado'}
          </Typography>
        }
      </Box>
    </Card>
  );
}

export default CardInformation;
