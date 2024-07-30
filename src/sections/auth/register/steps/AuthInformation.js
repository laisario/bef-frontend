import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
// @mui
import { Box, Stack, IconButton, InputAdornment, TextField, Alert, Link, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../../components/iconify';
import { useAuth } from '../../../../context/Auth';
import PasswordStrengthMeter from './components/PasswordStrengthMeter';

// ----------------------------------------------------------------------

export default function AuthInformation() {
  const navigate = useNavigate();
  const { registerAuth, loading } = useAuth()
  const [username, setUser] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null)
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault()
    const response = await registerAuth({ email, password, username })
    if (response?.status !== 201) {
      setError({ ...response?.response?.data })
      return null
    };
    return navigate('/login', { replace: true });
  };

  const erros = !!error && Object.keys(error)
  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <TextField error={!!error} name="username" label="Usuario" value={username} onChange={(e) => { if (error) { setError(null) } setUser(e.target.value) }} />
        <TextField error={!!error} name="email" label="Email" value={email} onChange={(e) => { if (error) { setError(null) } setEmail(e.target.value) }} />
        <TextField
          fullWidth
          error={!!error}
          name="password"
          label="Senha"
          value={password}
          onChange={(e) => { if (error) { setError(null) } setPassword(e.target.value) }}
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ marginBottom: 0 }}
        />
        <PasswordStrengthMeter password={password} />
        {!!erros?.length && erros?.map((key, i) => (<Alert key={key + i} severity="error">{`${error[key]}: ${key}`}</Alert>))}
      </Stack>

      <Box display="flex" alignItems="center" justifyContent="space-between" mt={4}>
        <Typography variant="body2">
          Já tem uma conta? {''}
          <Link
            to="/login"
            component={RouterLink}
            variant="subtitle2"
            sx={{ textDecoration: 'none', cursor: 'pointer' }}
          >
            Entrar
          </Link>
        </Typography>
        <LoadingButton loading={loading} variant="contained" size="large" sx={{ minWidth: '45%' }} onClick={handleSubmit} endIcon={<Iconify icon={'eva:arrow-ios-forward-fill'} />}>Continuar</LoadingButton>
      </Box>
    </form>
  );
}
