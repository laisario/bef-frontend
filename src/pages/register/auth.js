import { Helmet } from 'react-helmet-async';
// @mui
import { Container, Typography } from '@mui/material';
// components
import AuthInformation from '../../sections/auth/register/steps/AuthInformation';

// ----------------------------------------------------------------------

export default function RegisterAuthPage() {
  return (
    <>
      <Helmet>
        <title> Configurar acesso | B&F Metrologia </title>
      </Helmet>

      <Container maxWidth="sm">
        <Typography variant="h3" gutterBottom>
          Configurar acesso
        </Typography>

        <Typography variant="body2" sx={{ mb: 5 }}>
          Deixe sua conta bem segura
        </Typography>

        <AuthInformation />
      </Container>
    </>
  );
}
