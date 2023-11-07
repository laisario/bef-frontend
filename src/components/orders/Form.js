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
import axios from '../../api';
import useInstrumentos from '../../hooks/useInstrumentos';
import useOrders from '../../hooks/useOrders';

function Form({ setOpen, setAlert}) {
  const [informacoesAdicionais, setInformacoesAdicionais] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [loading, setIsLoading] = useState(false);
  const [instrumentosSelecionados, setInstrumentosSelecionados] = useState([]);
  const { todosInstrumentos } = useInstrumentos();
  const { refetch } = useOrders()
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setInstrumentosSelecionados(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      await axios.post('/propostas/', {
        instrumentos: instrumentosSelecionados,
        informacoes_adicionais: informacoesAdicionais,
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
              value={instrumentosSelecionados}
              onChange={handleChange}
              input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
            >
              {todosInstrumentos?.map((instrumento) => (
                <MenuItem key={instrumento.id} value={instrumento.tag}>
                  {instrumento.tag} - {instrumento.numero_de_serie} -{' '}
                  {instrumento.instrumento.tipo_de_instrumento.descricao} {instrumento.instrumento.minimo}{' '}
                  {instrumento.instrumento.maximo} {instrumento.instrumento.unidade} -
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

/* <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
          margin="normal"
          name="instrumentoName"
          value={formValues.instrumentoName}
            label="Identificação instrumento"
            onChange={(e) => handleChange(e)}
            placeholder="Identificação instrumento"
            onBlur={(e) => validateNotEmpty(e, setErrMsg)}
            error={!!errMsg.instrumentoName}
            helperText={errMsg?.instrumentoName}
            required
            fullWidth
            />
          <Grid container spacing={2}>
          <Grid item xs={4} sm={4}>
              <TextField
              margin="normal"
                type="number"
                name="faixaDeMedicaoMax"
                value={formValues.faixaDeMedicaoMax}
                label="Faixa de medição"
                onChange={(e) => handleChange(e)}
                placeholder="Máxima"
                onBlur={(e) => validateNotEmpty(e, setErrMsg)}
                error={!!errMsg.faixaDeMedicaoMax}
                helperText={errMsg?.faixaDeMedicaoMax}
                required
                />
                </Grid>
            <Grid item xs={4} sm={4}>
            <TextField
                margin="normal"
                type="number"
                name="faixaDeMedicaoMin"
                value={formValues.faixaDeMedicaoMin}
                label="Faixa de medição"
                onChange={(e) => handleChange(e)}
                placeholder="Mínima"
                onBlur={(e) => validateNotEmpty(e, setErrMsg)}
                error={!!errMsg.faixaDeMedicaoMin}
                helperText={errMsg?.faixaDeMedicaoMin}
                required
                />
                </Grid>
                <Grid item xs={4} sm={4}>
                <TextField
                margin="normal"
                type="number"
                name="quantidade"
                value={formValues.quantidade}
                label="Quantidade"
                onChange={(e) => handleChange(e)}
                placeholder="Quantidade"
                required
                onBlur={(e) => validateNotEmpty(e, setErrMsg)}
                error={!!errMsg.quantidade}
                helperText={errMsg?.quantidade}
                />
            </Grid>
          </Grid>
            <Grid container spacing={2} flexDirection="row" alignItems="center">
            <Grid item xs={12} sm={12}>
            <Autocomplete
            multiple
                id="tags-outlined"
                freeSolo
                options={[]}
                renderTags={(value, getTagProps) =>
                  value.map((ponto, index) => (
                    <Chip
                    key={index}
                    label={ponto}
                      variant="outlined"
                      deleteIcon={<DeleteIcon onMouseDown={() => deleteValue(ponto)} />}
                      {...getTagProps({ index })}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    margin="normal"
                    label="Pontos calibração"
                    placeholder="Pontos calibração"
                    name="pontoCalibracao"
                    helperText="Para adicionar um ponto aperte Enter"
                    onChange={(e) => setPontoCalibracao(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        addValue();
                      }
                    }}
                    {...params}
                    />
                    )}
                    clearIcon={<DeleteIcon onClick={deleteAllPoints} />}
                    />
                    </Grid>
                    </Grid> */

/* </Box> */

// const addValue = () => {
//   setFormValues((oldFormValues) => ({
//     ...oldFormValues,
//     pontosCalibracao: [...oldFormValues.pontosCalibracao, { id, ponto: Number(pontoCalibracao) }],
//   }));
//   setId((oldId) => oldId + 1);
// };

// const deleteValue = (idDelete) => {
//   setFormValues((oldFormValues) => ({
//     ...oldFormValues,
//     pontosCalibracao: formValues.pontosCalibracao.filter(({ ponto }) => ponto !== Number(idDelete)),
//   }));
// };

// const deleteAllPoints = () => {
//   setFormValues((oldFormValues) => ({
//     ...oldFormValues,
//     pontosCalibracao: [],
//   }));
// };

// const [id, setId] = useState(1);
