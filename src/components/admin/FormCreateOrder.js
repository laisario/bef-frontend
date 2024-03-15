/* eslint-disable react/prop-types */
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  MenuItem,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import Chip from '@mui/material/Chip';
import { useState } from 'react';
import { axios } from '../../api';
import useInstrumentos from '../../hooks/useInstrumentos';
import useOrders from '../../hooks/useOrders';
import useClients from '../../hooks/useClients';

function FormCreateOrder({ setOpen, setAlert, handleClose }) {
  const [form, setForm] = useState({
    cliente: '',
    informacoesAdicionais: '',
    instrumentos: [],
  });
  const [errMsg, setErrMsg] = useState('');
  const [loading, setIsLoading] = useState(false);
  const { todosInstrumentos } = useInstrumentos();
  const { refetch } = useOrders();
  const { clientes } = useClients();
  const handleChange = (event) => {
    const {
      target: { value, name },
    } = event;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const instrumentosPorCliente = todosInstrumentos?.filter((instrumento) => instrumento.cliente.id === form.cliente)


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      await axios.post('/propostas/', form);
      setIsLoading(false);
      setAlert((prevAlert) => ({ ...prevAlert, propostaEnviada: true }));
      setOpen(false);
      await refetch();
      return { error: false };
    } catch (err) {
      setIsLoading(false);
      setErrMsg(err.message);
      return { error: true };
    }
  };

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <DialogTitle>Criar novo pedido de calibração</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel id="cliente-select">Cliente</InputLabel>
            <Select
              labelId="cliente-select"
              name="cliente"
              id="cliente-select"
              value={form.cliente}
              label="Cliente"
              onChange={handleChange}
            >
              {clientes?.map((cliente) => (
                <MenuItem key={cliente.id} value={cliente.id}>
                  {cliente.empresa} - {cliente.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{my: 2}}>
            <InputLabel id="instrumental-select-input">Instrumentos</InputLabel>
            <Select
              labelId="instrumental-select-input"
              id="demo-multiple-chip"
              multiple
              name="instrumentos"
              value={form.instrumentos}
              onChange={handleChange}
              input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={instrumentosPorCliente?.find(instrumento => instrumento.id === value)?.tag} />
                  ))}
                </Box>
              )}
            >
              {instrumentosPorCliente?.map((instrumento) => (
                <MenuItem key={instrumento.id} value={instrumento.id}>
                  <strong>{instrumento.tag}</strong>: {instrumento.numero_de_serie} -{' '}
                  {instrumento.instrumento.tipo_de_instrumento.descricao} {instrumento.instrumento.minimo}{' '}
                  {instrumento.instrumento.maximo} {instrumento.instrumento.unidade}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            type="text"
            multiline
            name="informacoesAdicionais"
            value={form.informacoesAdicionais}
            label="Informações adicionais"
            onChange={handleChange}
            placeholder="Informações adicionais"
            fullWidth
            error={errMsg}
            helperText={errMsg}
          />
        </DialogContent>
      </Box>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" sx={{ mt: 3, mb: 2 }} color="primary">
          Enviar proposta
        </Button>
        {loading && <CircularProgress />}
      </DialogActions>
    </>
  );
}

export default FormCreateOrder;
