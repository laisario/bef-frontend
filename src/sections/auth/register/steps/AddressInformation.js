import { useEffect, useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
// @mui
import { Link, Box, Button, IconButton, InputLabel, TextField, Select, MenuItem } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

import Iconify from '../../../../components/iconify';
import { useAuth } from '../../../../context/Auth';
import useCNPJ, { validarCNPJ, formatCNPJ } from '../../../../hooks/useCNPJ';
import { validarCPF, formatCPF } from '../../../../hooks/useCPF';
import useCEP from '../../../../hooks/useCEP';

// ----------------------------------------------------------------------

const estados = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MS',
  'MT',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO',
];

export default function AddressInformation() {
  const navigate = useNavigate();
  const [CEP, setCEP] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const { registerLocation, loading } = useAuth();

  const { isValid: cepValido, cep: cepFormatado, ...cepInfo } = useCEP(CEP);

  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await registerLocation({
      uf: cepInfo?.estado || estado,
      cidade: cepInfo?.cidade || cidade,
      bairro: cepInfo?.bairro || bairro,
      logradouro: cepInfo?.rua || rua,
      numero,
      cep: cepFormatado || CEP,
    });
    navigate("/register/auth")
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormControl sx={{ width: '100%', gap: 3, mb: 4 }}>
        <TextField
          fullWidth
          error={!!CEP?.length >= 8 && !cepValido}
          name="CEP"
          label="CEP"
          placeholder="Digite o CEP da empresa"
          value={cepFormatado || CEP}
          onChange={(e) => {
            if (error) {
              setError(null);
            }
            setCEP(e.target.value);
          }}
        />
        {cepValido && (
          <>
            <Box display="flex" gap={2}>
              <TextField
                fullWidth
                name="rua"
                label="Logradouro"
                disabled={!!cepInfo?.rua}
                value={cepInfo?.rua || rua}
                onChange={(e) => {
                  if (error) {
                    setError(null);
                  }
                  setRua(e.target.value);
                }}
              />
              <FormControl sx={{ minWidth: 120 }}>
                <TextField
                  fullWidth
                  name="numero"
                  label="Numero"
                  value={numero}
                  onChange={(e) => {
                    if (error) {
                      setError(null);
                    }
                    setNumero(e.target.value);
                  }}
                />
              </FormControl>
            </Box>
            <TextField
              fullWidth
              name="bairro"
              label="Bairro"
              disabled={!!cepInfo?.bairro}
              value={cepInfo?.bairro || bairro}
              onChange={(e) => {
                if (error) {
                  setError(null);
                }
                setBairro(e.target.value);
              }}
            />
            <Box display="flex" gap={2}>
              <TextField
                fullWidth
                name="cidade"
                label="Cidade"
                disabled={!!cepInfo?.cidade}
                value={cepInfo?.cidade || cidade}
                onChange={(e) => {
                  if (error) {
                    setError(null);
                  }
                  setCidade(e.target.value);
                }}
              />
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel id="label">Estado</InputLabel>
                <Select
                  disabled={!!cepInfo?.estado}
                  labelId="label"
                  value={cepInfo?.estado || estado}
                  label="Estado"
                  onChange={(e) => setEstado(e.target.value)}
                >
                  {estados.map((sigla) => (
                    <MenuItem key={sigla} value={sigla}>
                      {sigla}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </>
        )}
      </FormControl>

      <Box display="flex" alignItems="center" justifyContent="space-between" mt={4}>
        <Button
          variant="text"
          component={RouterLink}
          to="/register/basics"
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
