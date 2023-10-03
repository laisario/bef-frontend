/* eslint-disable react/prop-types */
import { Box, Grid, TextField, Button, Typography, Paper, CircularProgress } from '@mui/material';
import StraightenIcon from '@mui/icons-material/Straighten';
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';
import axios from '../../api'

const validateNotEmpty = (event, setErrMsg) => {
  setErrMsg((errMsg) => ({
    ...errMsg,
    [event.target.name]: !event.target.value?.length
      ? `O campo ${event.target.name} é obrigatório`
      : null,
  }));
  return true;
};

function Form({ setOpen }) {
  const [pontoCalibracao, setPontoCalibracao] = useState(0);
  const [errMsg, setErrMsg] = useState({});
  const [id, setId] = useState(1);
  const [loading, setIsLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    instrumentoName: '',
    faixaDeMedicaoMax: null,
    faixaDeMedicaoMin: null,
    quantidade: null,
    informacoesAdicionais: '',
    pontosCalibracao: [],
  });
 
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      setIsLoading(true)
      await axios.post('/propostas/', {
        identificacao_instrumento: formValues.instrumentoName,
        faixa_medicao_max: formValues.faixaDeMedicaoMax,
        faixa_medicao_min: formValues.faixaDeMedicaoMin,
        quantidade: formValues.quantidade,
        informacoes_adicionais: formValues.informacoesAdicionais,
        pontos_de_calibracao: formValues.pontosCalibracao.map(({ponto}) => ponto),
      });
      setIsLoading(false)
      setOpen(false);
      return { error: false };
    } catch (err) {
      setIsLoading(false)
      console.log(err);
      return { error: true };
    }
  };

  const handleChange = ({ target }) => {
    if (target.name === 'faixaDeMedicao') {
      setFormValues((oldFormValues) => ({
        ...oldFormValues,
        faixaDeMedicao: target.value,
      }));
    } else {
      setFormValues((oldFormValues) => ({
        ...oldFormValues,
        [target.name]: target.value,
      }));
    }
  };

  const addValue = () => {
    setFormValues((oldFormValues) => ({
      ...oldFormValues,
      pontosCalibracao: [
        ...oldFormValues.pontosCalibracao,
        { id, ponto: Number(pontoCalibracao) },
      ],
    }));
    setId((oldId) => oldId + 1);
  };

  const deleteValue = (idDelete) => {
    setFormValues((oldFormValues) => ({
      ...oldFormValues,
      pontosCalibracao: formValues.pontosCalibracao.filter(
        ({ ponto }) => ponto !== Number(idDelete)
      ),
    }));
  };

  const deleteAllPoints = () => {
    setFormValues((oldFormValues) => ({
      ...oldFormValues,
      pontosCalibracao: [],
    }));
  };

  return (
    <Paper
      sx={{
        marginTop: 2,
        padding: 3,
        width: '600px',
      }}
    >
      <Grid container justifyContent="center" alignItems="center">
        <StraightenIcon fontSize="large" color="primary" />
      </Grid>
      <Grid item>
        <Typography variant="h5" textAlign="center" sx={{ margin: 2 }}>
          Criar novo pedido de calibração
        </Typography>
      </Grid>
      <Grid item>
        <Box component="form" onSubmit={handleSubmit} noValidate>
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
          <TextField
            margin="normal"
            type="text"
            multiline
            name="informacoesAdicionais"
            value={formValues.informacoesAdicionais}
            label="Informações adicionais"
            onChange={(e) => handleChange(e)}
            placeholder="Informações adicionais"
            fullWidth
          />
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
                      deleteIcon={
                        <DeleteIcon onMouseDown={() => deleteValue(ponto)} />
                      }
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
          </Grid>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            color="primary"
          >
            Enviar proposta
          </Button>
          {loading && <CircularProgress />}
        </Box>
      </Grid>
    </Paper>
  );
}

export default Form;
