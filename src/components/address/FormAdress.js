/* eslint-disable react/prop-types */
import { Box, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React from 'react';
import { useWatch } from 'react-hook-form';

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

function FormAdress({ form }) {
  const {
    estado,
  } = useWatch({ control: form?.control })
  return (
    <FormControl sx={{ width: '100%', gap: 3, mb: 4 }}>
      <TextField
        fullWidth
        name="CEP"
        label="CEP"
        placeholder="Digite o CEP da empresa"
        {...form.register("CEP", { minLength: 8 })}
      />
      {true && (
        <>
          <Box display="flex" gap={2}>
            <TextField
              fullWidth
              name="rua"
              label="Logradouro"
              InputLabelProps={{
                shrink: true
              }}
              {...form.register("rua")}
            />
            <TextField
              fullWidth
              name="complemento"
              label="complemento"
          
              {...form.register("complemento")}
            />
            <FormControl sx={{ minWidth: 120 }}>
              <TextField
                fullWidth
                name="numero"
                label="Numero"
                {...form.register("numeroEndereco")}
              />
            </FormControl>
          </Box>
          <Box display="flex" gap={2}>
            <TextField
              fullWidth
              name="bairro"
              label="Bairro"
              InputLabelProps={{
                shrink: true
              }}
              {...form.register("bairro")}
            />
            <TextField
              fullWidth
              name="cidade"
              label="Cidade"
              InputLabelProps={{
                shrink: true
              }}
              {...form.register("cidade")}
            />
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel id="label">Estado</InputLabel>
              <Select
                labelId="label"
                label="Estado"
                InputLabelProps={{
                  shrink: true
                }}
                {...form.register("estado")}
                value={estado}
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
