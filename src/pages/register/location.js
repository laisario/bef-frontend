import { Helmet } from 'react-helmet-async';
// @mui
import { Container, Typography } from '@mui/material';
// components
import AddressInformation from '../../sections/auth/register/steps/AddressInformation';

// ----------------------------------------------------------------------

export default function RegisterLocationPage() {
  return (
    <>
      <Helmet>
        <title> Localizacao | B&F Metrologia </title>
      </Helmet>

      <Container maxWidth="sm">
        <Typography variant="h3" gutterBottom>
          Localizacao
        </Typography>

        <Typography variant="body2" sx={{ mb: 5 }}>
          Fala pra gente onde voce se encontra
        </Typography>

        <AddressInformation />
      </Container>
    </>
  );
}
