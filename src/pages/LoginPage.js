import { Helmet } from 'react-helmet-async';
// @mui
import { styled } from '@mui/material/styles';
import { Link, Container, Typography, Divider, Stack, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
// hooks
import useResponsive from '../hooks/useResponsive';
// components
import Logo from '../components/logo';
import Iconify from '../components/iconify';
// sections
import { LoginForm } from '../sections/auth/login';

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
  }
}));

const LogoBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: theme.spacing(8),
  [theme.breakpoints.up('md')]: {
    flex: 1,
    marginBottom: 0,
  }
}))

// ----------------------------------------------------------------------

export default function LoginPage() {
  const mdUp = useResponsive('up', 'md');
  return (
    <>
      <Helmet>
        <title> Login </title>
      </Helmet>

      <Container maxWidth="xs">
          <Typography variant="h3" gutterBottom>
            Entrar
          </Typography>

          <Typography variant="body2" sx={{ mb: 5 }}>
            Não tem uma conta? {''}
            <Link to="/register" component={RouterLink} variant="subtitle2" sx={{ textDecoration: 'none', cursor: 'pointer' }}>Criar conta</Link>
          </Typography>

          <LoginForm />
        </Container>
    </>
  );
}
