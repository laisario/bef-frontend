/* eslint-disable react/prop-types */
import { useTheme } from '@emotion/react';
import { Box, Card, Chip, Grid, Link, Typography } from '@mui/material';
import React from 'react';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import titleCase from '../../utils/formatTitle';
import { fDateTime } from '../../utils/formatTime';

function CalibracaoCard({ calibracao, titles, specialCases }) {
  const theme = useTheme();
  return (
    <Card sx={{ padding: 2, backgroundColor: theme.palette.background.neutral, minWidth: 400 }}>
      <Box display="flex" justifyContent="space-between" gap={2} mb={1}>
        <Typography fontWeight="900" color={'grey'} variant="body1">
          {fDateTime(calibracao?.data)}
        </Typography>
        <Chip
          label={calibracao?.status === 'A' ? 'Aprovado' : 'Reprovado'}
          color={calibracao?.status === 'A' ? 'success' : 'erro'}
          size="small"
          variant="outlined"
        />
      </Box>
      <Box display="flex" flexDirection="column">
        {titles?.map((title, index) => (
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
      <Box display="flex" justifyContent="space-between" gap={2} mt={1}>
        <Typography fontWeight="900" color={'grey'} variant="body1">
          Certificado
        </Typography>
        <Link fontWeight="900" href={calibracao?.certificado} variant="body1">
          <ReceiptLongIcon />
        </Link>
      </Box>
    </Card>
  );
}

export default CalibracaoCard;
