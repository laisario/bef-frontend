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
  Dialog,
  Autocomplete,
} from '@mui/material';
import { useForm, useWatch } from 'react-hook-form';
import Chip from '@mui/material/Chip';
import { useState } from 'react';
import { axios } from '../../api';
import useInstrumentos from '../../hooks/useInstrumentos';
import useOrders from '../../hooks/useOrders';
import useClients from '../../hooks/useClients';

function FormCreateOrder({ setOpen, setAlert, onClose, open, admin }) {
  const form = useForm({defaultValues: {
    cliente: '',
    informacoesAdicionais: '',
    instrumentos: [],
  }})
  const [errMsg, setErrMsg] = useState('');
  const [loading, setIsLoading] = useState(false);
  const { todosInstrumentos } = useInstrumentos();
  const { refetch } = useOrders();
  const { clientes } = useClients();
  const { 
    cliente,
    instrumentos,
  } = useWatch({ control: form.control })
  
  const instrumentosPorCliente = todosInstrumentos?.filter((instrumento) => instrumento.cliente.id === cliente)
  const { handleSubmit, setValue } = form;
  const submit = async () => {
    try {
      setIsLoading(true);
      await axios.post('/propostas/', form);
      setIsLoading(false);
      setAlert((prevAlert) => ({ ...prevAlert, propostaEnviada: true }));
      setOpen(false);
      form.reset()
      await refetch();
      return { error: false };
    } catch (err) {
      setIsLoading(false);
      setErrMsg(err.message);
      return { error: true };
    }
  };
  
  return (
    <Dialog
      open={open}
      onClose={onClose}
    >
      <DialogTitle>Criar novo pedido de calibração</DialogTitle>
      <DialogContent>
        {admin && (
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="cliente-select">Cliente</InputLabel>
            <Select
              labelId="cliente-select"
              name="cliente"
              id="cliente-select"
              value={cliente}
              label="Cliente"
              {...form.register("cliente")}
            >
              {clientes?.map((cliente) => (
                <MenuItem key={cliente.id} value={cliente.id}>
                  {cliente.empresa || cliente.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        <Autocomplete
          multiple
          id="instruments-select-input"
          options={instrumentosPorCliente || []}
          filterSelectedOptions
          // isOptionEqualToValue={instrumentosPorCliente || []}
          getOptionLabel={
            (instrumento) => `${instrumento.tag}: ${instrumento.numero_de_serie} - ${instrumento.instrumento.tipo_de_instrumento.descricao} - ${instrumento.instrumento.minimo}
          - ${instrumento.instrumento.maximo}`
          }
          name="instrumentos"
          value={instrumentos}
          onChange={(event, newValue) => setValue('instrumentos', newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Instrumentos do cliente"
              placeholder="Instrumentos"
            />
          )}
          sx={{my: 2}}
        />

        <TextField
          type="text"
          multiline
          name="informacoesAdicionais"
          label="Informações adicionais"
          placeholder="Informações adicionais"
          fullWidth
          {...form.register("informacoesAdicionais")}
          error={errMsg}
          helperText={errMsg}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => { onClose(); form.reset() }}>Cancelar</Button>
        <Button onClick={handleSubmit(submit)} type="submit" contained sx={{ mt: 3, mb: 2 }} color="primary">
          Enviar proposta
        </Button>
        {loading && <CircularProgress />}
      </DialogActions>
    </Dialog>
  );
}

export default FormCreateOrder;
