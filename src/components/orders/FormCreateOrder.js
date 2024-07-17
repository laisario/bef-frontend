/* eslint-disable react/prop-types */
import {
  TextField,
  Button,
  CircularProgress,
  Chip,
  Checkbox,
  DialogTitle,
  DialogContent,
  DialogActions,
  Dialog,
  Autocomplete,
} from '@mui/material';
import { useForm, useWatch } from 'react-hook-form';
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
  const { refetch } = useOrders();
  const { clientes, isLoading: isLoadingClients } = useClients();
  const { 
    cliente,
    instrumentos,
  } = useWatch({ control: form.control })
  const { todosInstrumentos, isLoading } = useInstrumentos(null, cliente);
  
  const { handleSubmit, setValue } = form;
  const submit = async () => {
    try {
      setIsLoading(true);
      const {instrumentos, cliente, ...rest} = form.watch()
      await axios.post('/propostas/', {instrumentos: instrumentos?.map(instrumento => instrumento?.id), cliente: cliente?.id, ...rest});
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
      fullWidth
    >
      <DialogTitle>Criar novo pedido de calibração</DialogTitle>
      <DialogContent>
        {admin && (
          <Autocomplete
            autoHighlight
            options={clientes || []}
            isOptionEqualToValue={(option, value) => option?.id === value?.id}
            getOptionLabel={
              (cliente) => cliente?.empresa || cliente?.nome
            }
            loading={isLoadingClients}
            name="cliente"
            value={cliente || null}
            loadingText="Carregando..."
            noOptionsText="Sem resultados"
            onChange={(event, newValue) => setValue('cliente', newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Cliente"
                placeholder="Pesquisar cliente"
              />
            )}
            sx={{my: 2}}
          />
        )}
        <Autocomplete
          multiple
          autoHighlight
          options={todosInstrumentos || []}
          isOptionEqualToValue={(option, value) => option?.id === value?.id}
          getOptionLabel={(instrumento) => `${instrumento.tag}: ${instrumento.numero_de_serie} - ${instrumento.instrumento.tipo_de_instrumento.descricao} - ${instrumento.instrumento.minimo} - ${instrumento.instrumento.maximo}`}
          disableCloseOnSelect
          loading={isLoading}
          renderTags={(value, getTagProps) => value.map((tag, index)=> <Chip {...getTagProps({index})} key={tag.tag} label={tag.tag} />)}
          name="instrumentos"
          value={instrumentos}
          loadingText="Carregando..."
          noOptionsText="Sem resultados"
          onChange={(event, newValue) => setValue('instrumentos', newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              label={admin ? "Instrumentos do cliente" : "Instrumentos"}
              placeholder="Pesquisar instrumento"
            />
          )}
          renderOption={(props, instrumento, { selected }) => {
            const { ...optionProps } = props;
            return (
              <li key={instrumento?.id} {...optionProps}>
                <Checkbox
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
                {instrumento.tag}: {instrumento.numero_de_serie} - {instrumento.instrumento.tipo_de_instrumento.descricao} - {instrumento.instrumento.minimo} - {instrumento.instrumento.maximo}
              </li>
            );
          }}
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
      <DialogActions sx={{ mt: 3, mb: 2 }} >
        <Button onClick={() => { onClose(); form.reset() }}>Cancelar</Button>
        <Button onClick={handleSubmit(submit)} type="submit" contained color="primary">
          Enviar proposta
        </Button>
        {loading && <CircularProgress />}
      </DialogActions>
    </Dialog>
  );
}

export default FormCreateOrder;
