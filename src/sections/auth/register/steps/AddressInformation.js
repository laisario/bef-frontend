import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Iconify from '../../../../components/iconify';
import { useAuth } from '../../../../context/Auth';
import useCEP from '../../../../hooks/useCEP';
import FormAdress from '../../../../components/adress/FormAdress';

// ----------------------------------------------------------------------

export default function AddressInformation() {
  const navigate = useNavigate();
  const [CEP, setCEP] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [complemento, setComplemento] = useState('');
  const { registerLocation, loading } = useAuth();

  const { isValid, ...cepInfo } = useCEP(CEP);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await registerLocation({
      uf: cepInfo?.estado || estado,
      cidade: cepInfo?.cidade || cidade,
      bairro: cepInfo?.bairro || bairro,
      logradouro: cepInfo?.rua || rua,
      numero,
      cep: cepInfo?.cep || CEP,
      complemento,
    });
    navigate('/register/auth');
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormAdress
        valid={isValid}
        form={{
          CEP,
          rua,
          numero,
          bairro,
          cidade,
          estado,
          setCEP,
          setRua,
          setNumero,
          setBairro,
          setCidade,
          setEstado,
          complemento,
          setComplemento,
        }}
        cepInfo={cepInfo}
      />
      <Box display="flex" alignItems="center" justifyContent="space-between" mt={4}>
        <Button
          variant="text"
          onClick={() => navigate(-1)}
          startIcon={<Iconify icon={'eva:arrow-ios-back-fill'} />}
        >
          Voltar
        </Button>

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
