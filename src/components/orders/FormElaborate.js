import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  FormLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  Typography,
  Dialog,
  DialogContent,
} from '@mui/material';
import { useForm, useWatch } from "react-hook-form";
import { LoadingButton } from '@mui/lab';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { useParams } from 'react-router-dom';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import useOrders from '../../hooks/useOrders';
import Iconify from '../iconify';
import FormAdress from '../address/FormAdress';
import useUsers from '../../hooks/useUsers';

function FormElaborate({ data, open, setElaborate, setResponseStatus, setOpenAlert, editProposol }) {
  const form = useForm({
    defaultValues: {
      numeroProposta: data?.numero || 0,
      transporte: data?.transporte || '',
      total: data?.total || '',
      formaDePagamento: data?.condicao_de_pagamento || '',
      anexo: data?.anexo || null,
      CEP: data?.endereco_de_entrega?.cep || "",
      rua: data?.endereco_de_entrega?.logradouro || "",
      numeroEndereco: data?.endereco_de_entrega?.numero || "",
      bairro: data?.endereco_de_entrega?.bairro?.nome || "",
      cidade: data?.endereco_de_entrega?.bairro?.cidade || "",
      estado: data?.endereco_de_entrega?.estado || "",
      complemento: data?.endereco_de_entrega?.complemento || "",
      status: data?.status || "",
      enderecoDeEntrega: data?.endereco_de_entrega ? "enderecoCadastrado" : null,
      validade: data?.validade,
      prazoDePagamento: data?.prazo_de_pagamento,
      responsavel: data?.responsavel || '',
    },
  });
  const {
    enderecoDeEntrega,
    anexo,
    validade,
    prazoDePagamento,
    formaDePagamento,
    responsavel
  } = useWatch({ control: form.control })
  const { data: users } = useUsers();
  const { id } = useParams();
  const { elaborate, isLoading } = useOrders(id);

  const handleClose = () => {
    setElaborate((oldValue) => !oldValue)
    form.reset()
  }

  const handleChangeAnexo = (event) => {
    const { name, files } = event.target;
    if (name === 'anexo') {
      form.setValue("anexo", files[0]);
    }
  }
  return (
    <Dialog open={open} onClose={handleClose}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
        <DialogContent>
          <Box display="flex" gap={2}>
            <FormControl sx={{ width: '50%' }}>
              <InputLabel id="select-pagamento">Forma de pagamento</InputLabel>
              <Select
                labelId="select-pagamento"
                id="select-pagamento"
                name="formaDePagamento"
                label="Forma de Pagamento"
                fullWidth
                {...form.register("formaDePagamento")}
                value={formaDePagamento}
              >
                <MenuItem value="CD">Cartão débito</MenuItem>
                <MenuItem value="CC">Cartão crédito</MenuItem>
                <MenuItem value="P">Pix</MenuItem>
                <MenuItem value="D">Dinheiro</MenuItem>
                <MenuItem value="B">Boleto</MenuItem>
              </Select>
            </FormControl>
            <TextField
              id="transporte"
              label="Transporte"
              name="transporte"
              variant="outlined"
              sx={{ width: '50%' }}
              {...form.register("transporte")}
            />
          </Box>
          <Box display="flex" gap={2} sx={{ my: 2 }}>
            <DatePicker
              label="Validade"
              {...form.register("validade")}
              value={validade ? dayjs(validade) : null}
              onChange={newValue => form.setValue("validade", newValue)}
              sx={{ width: '50%' }}
            />
            <DatePicker
              label="Prazo de pagamento"
              sx={{ width: '50%' }}
              {...form.register("prazoDePagamento")}
              value={prazoDePagamento ? dayjs(prazoDePagamento) : null}
              onChange={newValue => form.setValue("prazoDePagamento", newValue)}

            />
          </Box>
          <FormControl sx={{ width: '50%' }}>
            <InputLabel id="select-responsible">Responsável</InputLabel>
            <Select
              labelId="select-responsible"
              id="select-responsible"
              name="responsavel"
              label="Responsável"
              fullWidth
              {...form.register("responsavel")}
              value={responsavel}
            >
              {users?.map((user) => <MenuItem key={user?.id} value={user?.id}>{user?.username}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2, my: 2 }}>
            <FormLabel id="aprovacao">Endereço de entrega: </FormLabel>
            <RadioGroup row aria-labelledby="aprovacao">
              <FormControlLabel
                value="enderecoCadastrado"
                control={
                  <Radio
                    checked={enderecoDeEntrega === 'enderecoCadastrado'}
                    {...form.register("enderecoDeEntrega")}
                  />
                }
                label="Endereço cliente cadastrado"
              />
              <FormControlLabel
                value="novoEndereco"
                control={
                  <Radio
                    checked={enderecoDeEntrega === 'novoEndereco'}
                    {...form.register("enderecoDeEntrega")}
                  />
                }
                label="Novo enderenço"
              />
            </RadioGroup>
          </FormControl>
          {enderecoDeEntrega === 'novoEndereco' && <FormAdress form={form} />}
          <Box display="flex" gap={1}>
            <FormControl sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
              <FormLabel id="anexo">Anexo: </FormLabel>
              <Button component="label" color="info" variant="contained" startIcon={<CloudUploadIcon />}>
                anexo
                <input
                  style={{ display: 'none' }}
                  id="upload-btn"
                  name="anexo"
                  type="file"
                  {...form.register("anexo")}
                  onChange={handleChangeAnexo}
                />
              </Button>
              {!!anexo && (
                <Button
                  size="small"
                  href={
                    !!anexo && anexo instanceof File
                      ? URL.createObjectURL(anexo)
                      : anexo
                  }
                  target="_blank"
                  variant="outlined"
                  component="a"
                >
                  Ver anexo
                </Button>
              )}
            </FormControl>
            {+data?.total !== 0 && (<FormControl sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2, mt: 1 }}>
              <FormLabel id="total">Total: </FormLabel>
              <Typography variant="subtitle1">R$ {data?.total}</Typography>
            </FormControl>)}
          </Box>
          <Box display="flex" alignItems="center" justifyContent="space-between" mt={4}>
            <Button variant="text" onClick={handleClose}>
              Cancelar
            </Button>
            <LoadingButton
              endIcon={<Iconify icon={'eva:arrow-ios-forward-fill'} />}
              loading={isLoading}
              sx={{ maxWidth: '45%' }}
              type="submit"
              fullWidth
              size="large"
              variant="contained"
              onClick={async () => {
                form.handleSubmit(elaborate(form, setResponseStatus, setOpenAlert, editProposol))
                handleClose();
              }}
            >
              Salvar
            </LoadingButton>
          </Box>
        </DialogContent>
      </LocalizationProvider>
    </Dialog>
  );
}

export default FormElaborate;
