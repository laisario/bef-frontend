import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Stack, IconButton, InputAdornment, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Iconify from '../../../components/iconify';

import { useAuth } from '../../../context/Auth';


export default function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation()
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
    if (location?.state?.redirect) {
      return navigate(location?.state?.redirect, { replace: true });
    }
    return navigate('/dashboard', { replace: true });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <TextField error={!!error} name="email" label="Email" value={email} onChange={(e) => { if (error) { setError(null) } setEmail(e.target.value) }} />

        <TextField
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
        />
      </Stack>

      <LoadingButton disabled={!email || !password} loading={loading} sx={{ mt: 4 }} type="submit" fullWidth size="large" variant="contained" onClick={handleSubmit}>
        Entrar
      </LoadingButton>
    </form>
  );
}
