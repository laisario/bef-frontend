import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
// @mui
import { Link, Box, Stack, IconButton, InputAdornment, TextField, Checkbox, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';
import { useAuth } from '../../../context/Auth';
import PasswordStrengthMeter from './PasswordStrengthMeter';

// ----------------------------------------------------------------------

export default function RegisterForm() {
  const navigate = useNavigate();
  const { login, loading } = useAuth()

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null)
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { error } = await login(email, password);
    if (error) {
      setError(error)
      return null
    };
    return navigate('/dashboard', { replace: true });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <TextField error={!!error} name="email" label="Email" value={email} onChange={(e) => { if (error) { setError(null) } setEmail(e.target.value) }} />
        <TextField
          fullWidth
          error={!!error}
          helperText={!!error && error}
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
      </Stack>

      <Box display="flex" alignItems="center" justifyContent="space-between" mt={4}>
          <Link to="/login" component={RouterLink} variant="subtitle2" sx={{ textDecoration: 'none', cursor: 'pointer' }}><Typography><Iconify icon={'eva:arrow-ios-back-fill'} />Voltar</Typography></Link>
        <LoadingButton endIcon={<Iconify icon={'eva:arrow-ios-forward-fill'} />} loading={loading} sx={{ maxWidth: '45%' }} type="submit" fullWidth size="large" variant="contained" onClick={handleSubmit}>
          Continuar
        </LoadingButton>
      </Box>

    </form>
  );
}
