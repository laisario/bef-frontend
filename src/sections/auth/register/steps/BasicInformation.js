import { useEffect, useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
// @mui
import { Link, Box, Stack, IconButton, InputAdornment, TextField, Checkbox, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

import Iconify from '../../../../components/iconify';
import { useAuth } from '../../../../context/Auth';
import useCNPJ from '../../../../hooks/useCNPJ';
import useCPF from '../../../../hooks/useCPF';

// ----------------------------------------------------------------------

export default function BasicInformation() {
  const navigate = useNavigate();
  const [tipo, setTipo] = useState('E');
  const [CNPJ, setCNPJ] = useState('');
  const [razaoSocial, setRazaoSocial] = useState('');
  const [IE, setIE] = useState('');
  const [CPF, setCPF] = useState('');
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const { loading, registerBasics } = useAuth();

  const [error, setError] = useState(null);
  const {
    razaoSocial: razaoSocialFromApi,
    inscricaoEstadual,
    cnpj: cnpjFormatado,
    isValid: cnpjValido,
  } = useCNPJ(CNPJ);
  const { cpf: cpfFormatado, isValid: cpfValido } = useCPF(CPF);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await registerBasics({
      nome,
      telefone,
      cpf: cpfFormatado || CPF,
      empresa: tipo === 'E',
      razaoSocial: razaoSocialFromApi || razaoSocial,
      cnpj: cnpjFormatado || CNPJ,
      ie: inscricaoEstadual || IE || null,
    });
    navigate('/register/location')
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormControl sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2, mb: 4 }}>
        <FormLabel id="pessoa">Quero criar minha conta como: </FormLabel>
        <RadioGroup row aria-labelledby="pessoa">
          <FormControlLabel
            value="E"
            control={<Radio checked={tipo === 'E'} onChange={(e) => setTipo(e.target.checked ? 'E' : 'P')} />}
            label="Pessoa juridica"
          />
          <FormControlLabel
            value="P"
            control={<Radio checked={tipo === 'P'} onChange={(e) => setTipo(e.target.checked ? 'P' : 'E')} />}
            label="Pessoa fisica"
          />
        </RadioGroup>
      </FormControl>

      {tipo === 'E' && (
        <FormControl sx={{ width: '100%', gap: 3, mb: 4 }}>
          <TextField
            fullWidth
            helperText={!cnpjValido && CNPJ?.length >= 14 && 'Por favor, digite um CNPJ valido'}
            error={!cnpjValido && CNPJ?.length >= 14}
            name="CNPJ"
            label="CNPJ"
            placeholder="Digite o CNPJ da empresa"
            value={cnpjFormatado || CNPJ}
            onChange={(e) => {
              if (error) {
                setError(null);
              }
              setCNPJ(e.target.value);
            }}
          />
          {cnpjValido && (
            <>
              <TextField
                fullWidth
                name="razaoSocial"
                label="Razao Social"
                disabled={!!razaoSocialFromApi}
                value={razaoSocialFromApi || razaoSocial}
                onChange={(e) => {
                  if (error) {
                    setError(null);
                  }
                  setRazaoSocial(e.target.value);
                }}
              />
              <TextField
                fullWidth
                name="IE"
                label="Inscricao Estadual"
                disabled={!!inscricaoEstadual}
                value={inscricaoEstadual || IE}
                onChange={(e) => {
                  if (error) {
                    setError(null);
                  }
                  setIE(e.target.value);
                }}
              />
            </>
          )}
        </FormControl>
      )}

      {tipo === 'P' && (
        <FormControl sx={{ width: '100%', gap: 3, mb: 4 }}>
          <TextField
            fullWidth
            error={!cpfValido && CPF?.length >= 11}
            name="CPF"
            label="CPF"
            placeholder="Digite o seu CPF"
            value={cpfFormatado || CPF}
            onChange={(e) => {
              if (error) {
                setError(null);
              }
              setCPF(e.target.value);
            }}
          />
          {cpfValido && (
            <>
              <TextField
                fullWidth
                name="nome"
                label="Nome Completo"
                value={nome}
                onChange={(e) => {
                  if (error) {
                    setError(null);
                  }
                  setNome(e.target.value);
                }}
              />
              <TextField
                fullWidth
                name="telefone"
                label="Telefone"
                value={telefone}
                onChange={(e) => {
                  if (error) {
                    setError(null);
                  }
                  setTelefone(e.target.value);
                }}
              />
            </>
          )}
        </FormControl>
      )}

      <Box display="flex" alignItems="center" justifyContent="space-between" mt={4}>
        <Typography variant="body2">
          Ja tem uma conta? {''}
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
