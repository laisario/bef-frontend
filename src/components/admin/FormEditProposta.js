import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from '@mui/material';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import styled from '@emotion/styled';
import useOrders from '../../hooks/useOrders';
import Iconify from '../iconify';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

function FormEditProposta({ setEdit }) {
  const [form, setForm] = useState({
    local: 'laboratorio',
    total: 0,
    prazo_de_entrega: '',
    forma_de_pagamento: 'D',
    transporte: '',
    numero: 0,
    endereco_de_entrega: '',
    validade: '',
    data_aprovacao: '',
  });
  const { id } = useParams();
  const { edit, aprovar, recusar } = useOrders(id);
  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  return (
    <Paper sx={{ padding: 4, display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
      <Box
        component="form"
        noValidate
        width="50%"
        sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 2 }}
      >
        <TextField
          id="numero"
          label="Número proposta"
          name="numero"
          value={form.numero}
          onChange={handleChange}
          variant="outlined"
          type="number"
        />
        <TextField
          id="outlined-basic"
          label="Total"
          name="total"
          value={form.total}
          onChange={handleChange}
          variant="outlined"
          InputProps={{
            startAdornment: <InputAdornment position="start">R$</InputAdornment>,
          }}
          type="number"
        />
        <TextField
          // fullWidth
          label="Endereço de entrega"
          name="endereco_de_entrega"
          value={form.endereco_de_entrega}
          onChange={handleChange}
          variant="outlined"
        />
        <TextField
          id="transporte"
          label="Transporte"
          name="transporte"
          value={form.transporte}
          onChange={handleChange}
          variant="outlined"
        />
        <TextField
          label="Prazo de entrega"
          name="prazo_de_entrega"
          value={form.prazo_de_entrega}
          onChange={handleChange}
          variant="outlined"
          helperText="dd/mm/aaaa"
        />
        <TextField
          label="Validade"
          name="validade"
          value={form.validade}
          onChange={handleChange}
          variant="outlined"
          helperText="dd/mm/aaaa"
        />
        <TextField
          label="Data aprovação"
          name="data_aprovacao"
          value={form.data_aprovacao}
          onChange={handleChange}
          variant="outlined"
          helperText="dd/mm/aaaa"
        />
        <FormControl margin="normal">
          <InputLabel id="demo-simple-select-label">Local</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={form.local}
            name="local"
            label="Local"
            onChange={handleChange}
          >
            <MenuItem value="laboratorio">Laboratório</MenuItem>
            <MenuItem value="cliente">Cliente</MenuItem>
          </Select>
        </FormControl>
        <FormControl margin="normal">
          <InputLabel id="select-pagamento">Forma de pagamento</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="select-pagamento"
            value={form.forma_de_pagamento}
            name="forma_de_pagamento"
            label="Forma de Pagamento"
            onChange={handleChange}
          >
            <MenuItem value="CD">Cartão débito</MenuItem>
            <MenuItem value="CC">Cartão crédito</MenuItem>
            <MenuItem value="P">Pix</MenuItem>
            <MenuItem value="D">Dinheiro</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" color="error" onClick={() => setEdit(false)}>
          Cancelar alterações
        </Button>
        <Button variant="contained" onClick={() => edit(form)} sx={{ mx: 2 }} color="success">
          Salvar alterações
        </Button>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Button component="label" color="info" variant="contained" startIcon={<CloudUploadIcon />}>
          Upload file
          <VisuallyHiddenInput type="file" />
        </Button>
        <Button
          variant="contained"
          sx={{ my: 2 }}
          onClick={() => aprovar()}
          startIcon={<Iconify icon="eva:checkmark-fill" />}
        >
          Aprovar pedido
        </Button>
        <Button variant="contained" color="error" onClick={() => recusar()} startIcon={<Iconify icon="ph:x-bold" />}>
          Recusar pedido
        </Button>
      </Box>
    </Paper>
  );
}

export default FormEditProposta;
