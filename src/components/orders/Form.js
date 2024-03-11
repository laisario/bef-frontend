/* eslint-disable react/prop-types */
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  MenuItem,
} from '@mui/material';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import Chip from '@mui/material/Chip';
import { useState } from 'react';
import {axios} from '../../api';
import useInstrumentos from '../../hooks/useInstrumentos';
import useOrders from '../../hooks/useOrders';

function Form({ setOpen, setAlert}) {
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
      setAlert((prevAlert) => ({...prevAlert, propostaEnviada: true}));
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
    <Paper
      sx={{
        marginTop: 2,
        padding: 3,
        width: '50',
      }}
    >
      <Grid container justifyContent="center" alignItems="center">
        <SquareFootIcon fontSize="large" color="primary" />
      </Grid>
      <Grid item>
        <Typography variant="h5" textAlign="center" sx={{ margin: 2 }}>
          Criar novo pedido de calibração
        </Typography>
      </Grid>
      <Grid item>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <FormControl fullWidth>
            <InputLabel id="demo-multiple-chip-label">Instrumentos</InputLabel>
            <Select
              labelId="demo-multiple-chip-label"
              id="demo-multiple-chip"
              multiple
              value={instrumentos}
              onChange={handleChange}
              input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
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
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} color="primary">
            Enviar proposta
          </Button>
        </Box>
        {loading && <CircularProgress />}
      </Grid>
    </Paper>
  );
}

export default Form;