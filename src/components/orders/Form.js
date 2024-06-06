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

function Form({ setOpen, setAlert, handleClose }) {
  const [informacoesAdicionais, setInformacoesAdicionais] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [loading, setIsLoading] = useState(false);
  const [instrumentos, setInstrumentos] = useState([]);
  const { todosInstrumentos } = useInstrumentos();
  const { refetch } = useOrders();

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setInstrumentos(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      await axios.post('/propostas/', {
        instrumentos,
        informacoesAdicionais,
      });
      setIsLoading(false);
      setAlert((prevAlert) => ({ ...prevAlert, propostaEnviada: true }));
      setOpen(false);
      await refetch()
      return { error: false };
    } catch (err) {
      setIsLoading(false);
      setErrMsg(err.message);
      console.log(err);
      return { error: true };
    }
  };

  return (
    <>
      <DialogTitle>Criar novo pedido de calibração</DialogTitle>
      <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="input-select">Instrumentos</InputLabel>
            <Select
              labelId="input-select"
              id="input-select"
              multiple
              label="Instrumentos"
              placeholder='Instrumentos'
              value={instrumentos}
              onChange={handleChange}
              input={<OutlinedInput id="input-select" label="Instrumentos" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={todosInstrumentos?.find(instrumento => instrumento.id === value)?.tag} />
                  ))}
                </Box>
              )}
            >
              {todosInstrumentos?.map((instrumento) => (
                <MenuItem key={instrumento.id} value={instrumento.id}>
                  {instrumento.tag} - {instrumento.numero_de_serie} -{' '}
                  {instrumento.instrumento.tipo_de_instrumento.descricao} {instrumento.instrumento.minimo}{' - '}
                  {instrumento.instrumento.maximo} {instrumento.instrumento.unidades.map((u) => `${u.unidade} `)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="normal"
            type="text"
            multiline
            name="informacoesAdicionais"
            value={informacoesAdicionais}
            label="Informações adicionais"
            onChange={(e) => setInformacoesAdicionais(e.target.value)}
            placeholder="Informações adicionais"
            fullWidth
            error={errMsg}
            helperText={errMsg}
          />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained"  color="primary">
          Enviar proposta
        </Button>
        {loading && <CircularProgress />}
      </DialogActions>
    </>
  );
}

export default Form;