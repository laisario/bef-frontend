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
        <title> Localizacao | KOMETRO </title>
      </Helmet>

      <Container maxWidth="sm">
        <Typography variant="h3" gutterBottom>
          Localizacao
        </Typography>

        <AddressInformation />
      </Container>
    </>
  );
}
