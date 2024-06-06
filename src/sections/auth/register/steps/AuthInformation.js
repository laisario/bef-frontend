import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
// @mui
import { Box, Stack, IconButton, InputAdornment, TextField, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../../components/iconify';
import { useAuth } from '../../../../context/Auth';
import PasswordStrengthMeter from './components/PasswordStrengthMeter';

// ----------------------------------------------------------------------

export default function AuthInformation() {
  const navigate = useNavigate();
  const { registerAuth, loading } = useAuth()
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null)
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault()
    await registerAuth({ email, password })
    navigate('/login');
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
        <Button variant="text" component={RouterLink} to="/register2" startIcon={<Iconify icon={'eva:arrow-ios-back-fill'} />}>Voltar</Button>
        <LoadingButton loading={loading} variant="contained" size="large" sx={{minWidth: '45%'}} onClick={handleSubmit} endIcon={<Iconify icon={'eva:arrow-ios-forward-fill'} />}>Continuar</LoadingButton>
      </Box>
    </form>
  );
}
