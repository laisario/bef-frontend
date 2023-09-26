import { Helmet } from 'react-helmet-async';
// @mui
import { styled } from '@mui/material/styles';
import { Link, Container, Typography, Divider, Stack, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
// hooks
import BasicInformation from '../sections/auth/register/steps/BasicInformation';
import useResponsive from '../hooks/useResponsive';
// components
import Logo from '../components/logo';
import Iconify from '../components/iconify';
// sections
import { LoginForm } from '../sections/auth/login';
import { RegisterForm } from '../sections/auth/register';
import AddressInformation from '../sections/auth/register/steps/AddressInformation';

// ----------------------------------------------------------------------

const StyledRoot = styled(Container)(({ theme }) => ({
  display: 'flex',
  flex: 1,
  height: '100%',
  flexDirection: 'column',
  justifyContent: 'center',
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  }
}));

const LogoBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: theme.spacing(8),
  [theme.breakpoints.up('md')]: {
    marginBottom: 0,
  }
}))

// ----------------------------------------------------------------------

export default function RegisterPage2() {
  const mdUp = useResponsive('up', 'md');
  return (
    <>
      <Helmet>
        <title> Criar conta | B&F Metrologia </title>
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
