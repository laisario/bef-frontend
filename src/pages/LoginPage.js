import { Helmet } from 'react-helmet-async';
import { Link, Container, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { LoginForm } from '../sections/auth/login';

export default function LoginPage() {
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
