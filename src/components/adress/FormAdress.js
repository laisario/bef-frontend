/* eslint-disable react/prop-types */
import { Box, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React, { useState } from 'react';


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

function FormAdress({ form, valid, cepInfo }) {
  const {
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
  } = form;
  const [error, setError] = useState(null);

  return (
    <FormControl sx={{ width: '100%', gap: 3, mb: 4 }}>
      <TextField
        fullWidth
        error={!!CEP?.length >= 8 && !valid}
        name="CEP"
        label="CEP"
        placeholder="Digite o CEP da empresa"
        value={cepInfo?.cep || CEP}
        onChange={(e) => {
          if (error) {
            setError(null);
          }
          setCEP(e.target.value);
        }}
      />
      {valid && (
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
            <TextField
              fullWidth
              name="complemento"
              label="complemento"
              value={complemento}
              onChange={(e) => {
                if (error) {
                  setError(null);
                }
                setComplemento(e.target.value);
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
          <Box display="flex" gap={2}>
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
  );
}

export default FormAdress;
