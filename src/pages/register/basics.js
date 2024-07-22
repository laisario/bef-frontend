import { Helmet } from 'react-helmet-async';
// @mui
import { Container, Typography } from '@mui/material';
// components
import BasicInformation from '../../sections/auth/register/steps/BasicInformation';

// ----------------------------------------------------------------------

export default function RegisterBasicsPage() {
  return (
    <>
      <Helmet>
        <title> Criar conta | KOMETRO </title>
      </Helmet>

      <Container maxWidth="sm">
        <Typography variant="h3" gutterBottom>
          Criar conta
        </Typography>

        <Typography variant="body2" sx={{ mb: 5 }}>
          Calibre seus instrumentos conosco
        </Typography>

        <BasicInformation />
      </Container>
    </>
  );
}
