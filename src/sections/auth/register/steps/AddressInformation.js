import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Alert, Box, Link, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useForm, useWatch } from 'react-hook-form';
import Iconify from '../../../../components/iconify';
import { useAuth } from '../../../../context/Auth';
import useCEP from '../../../../hooks/useCEP';
import FormAdress from '../../../../components/address/FormAdress';

// ----------------------------------------------------------------------

export default function AddressInformation() {
  const [error, setError] = useState({});
  const navigate = useNavigate();
  const { registerLocation, loading } = useAuth();
  const form = useForm({
    defaultValues: {
      CEP: "",
      rua: "",
      numero: 0,
      bairro: "",
      cidade: "",
      estado: "",
      complemento: "",
    }
  })
  const {
    CEP,
    rua,
    numero,
    bairro,
    cidade,
    estado,
    complemento
  } = useWatch({ control: form.control })
  const { isValid, ...cepInfo } = useCEP(CEP, form);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await registerLocation({
      uf: cepInfo?.estado || estado,
      cidade: cepInfo?.cidade || cidade,
      bairro: cepInfo?.bairro || bairro,
      logradouro: cepInfo?.rua || rua,
      numero,
      cep: cepInfo?.cep || CEP,
      complemento,
    });
    if (response?.status === 400) {
      setError({ ...response?.response?.data })
      return null
    };
    return navigate('/register/auth');
  };
  const erros = !!error && Object.keys(error)
  return (
    <form onSubmit={handleSubmit}>
      <FormAdress
        valid={isValid}
        form={form}
      />
      {!!erros?.length && erros?.map((key, i) => (<Alert key={key + i} severity="error">{`${error[key]}: ${key}`}</Alert>))}
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
        <LoadingButton
          endIcon={<Iconify icon={'eva:arrow-ios-forward-fill'} />}
          loading={loading}
          sx={{ maxWidth: '45%' }}
          type="submit"
          fullWidth
          size="large"
          variant="contained"
          onClick={handleSubmit}
        >
          Continuar
        </LoadingButton>
      </Box>
    </form>
  );
}
