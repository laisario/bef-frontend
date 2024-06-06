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

function FormEditProposta({ data, open, handleClose, setResponseStatus, setOpen }) {
  const form = useForm({
    defaultValues: {
      numeroProposta: data?.numero || 0,
      transporte: data?.transporte || '',
      local: data?.local || '',
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
      aprovado: data?.aprovacao?.toString(),
      enderecoDeEntrega: data?.endereco_de_entrega ? "novoEndereco" : null,
      prazoDeEntrega: data?.prazo_de_entrega,
      validade: data?.validade,
      dataAprovacao: data?.data_aprovacao,
      prazoDePagamento: data?.prazo_de_pagamento,
    },
  });

  const {
    enderecoDeEntrega,
    aprovado,
    anexo,
    prazoDeEntrega,
    validade,
    prazoDePagamento,
    dataAprovacao,
    local,
    formaDePagamento,
  } = useWatch({ control: form.control })

  const { id } = useParams();
  const { edit, isLoading } = useOrders(id);

  return (
    <Dialog open={open} onClose={handleClose}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
        <DialogContent>
          <Box display="flex" gap={2}>
            <TextField
              id="numero"
              label="Número proposta"
              name="numeroProposta"
              variant="outlined"
              type="text"
              sx={{ width: '50%' }}
              {...form.register("numeroProposta")}
            />
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
              label="Prazo de entrega"
              {...form.register("prazoDeEntrega")}
              value={prazoDeEntrega ? dayjs(prazoDeEntrega) : null}
              onChange={newValue => form.setValue("prazoDeEntrega", newValue)}
              sx={{ width: '50%' }}
            />
            <DatePicker
              label="Validade"
              {...form.register("validade")}
              value={validade ? dayjs(validade) : null}
              onChange={newValue => form.setValue("validade", newValue)}
              sx={{ width: '50%' }}
            />
          </Box>
          <Box display="flex" gap={2} sx={{ my: 2 }}>
            <DatePicker
              label="Prazo de pagamento"
              sx={{ width: data?.aprovacao ? '50%' : '100%' }}
              {...form.register("prazoDePagamento")}
              value={prazoDePagamento ? dayjs(prazoDePagamento) : null}
              onChange={newValue => form.setValue("prazoDePagamento", newValue)}

            />
            {data?.aprovacao && (
              <DatePicker
                label="Data aprovação"
                {...form.register("dataAprovacao")}
                value={dataAprovacao ? dayjs(dataAprovacao) : null}
                onChange={newValue => form.setValue("dataAprovacao", newValue)}
                sx={{ width: '50%' }}
              />
            )}
          </Box>
          <Box display="flex" gap={2}>
            <FormControl sx={{ width: '50%' }} margin="normal">
              <InputLabel id="label-local">Local</InputLabel>
              <Select
                labelId="label-local"
                id="label-local"
                name="local"
                label="Local"
                {...form.register("local")}
                value={local}
              >
                <MenuItem value="L">Laboratório</MenuItem>
                <MenuItem value="C">Cliente</MenuItem>
              </Select>
            </FormControl>
            <FormControl margin="normal" sx={{ width: '50%' }}>
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
          </Box>
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
          {data?.status === 'F' && (
            <FormControl sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
              <FormLabel id="aprovacao">Situação: </FormLabel>
              <RadioGroup row aria-labelledby="aprovacao">
                <FormControlLabel
                  value="true"
                  control={
                    <Radio
                      checked={aprovado === 'true'}
                      {...form.register("aprovado")}
                    />
                  }
                  label="Aprovada"
                />
                <FormControlLabel
                  value="false"
                  control={
                    <Radio
                      checked={aprovado === 'false'}
                      {...form.register("aprovado")}
                    />
                  }
                  label="Reprovada"
                />
              </RadioGroup>
            </FormControl>
          )}
          <Box display="flex" gap={1}>
            <FormControl sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
              <FormLabel id="anexo">Anexo: </FormLabel>
              {anexo ? (
                <>
                  <Button component="label" color="info" variant="contained" startIcon={<CloudUploadIcon />}>
                    Enviar arquivo
                    <input
                      style={{ display: 'none' }}
                      id="upload-btn"
                      name="anexo"
                      {...form.register("anexo")}
                      type="file"
                    />
                  </Button>
                  <Button
                    component="a"
                    href={
                      !!anexo && anexo instanceof File
                        ? URL.createObjectURL(anexo)
                        : anexo
                    }
                    target="_blank"
                    color="info"
                    variant="contained"
                  >
                    Ver arquivo
                  </Button>
                </>
              ) : (
                <Button component="label" color="info" variant="contained" startIcon={<CloudUploadIcon />}>
                  Enviar arquivo
                  <input
                    style={{ display: 'none' }}
                    id="upload-btn"
                    name="anexo"
                    type="file"
                    {...form.register("anexo")}
                  />
                </Button>
              )}
            </FormControl>
            <FormControl sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2, mt: 1 }}>
              <FormLabel id="total">Total: </FormLabel>
              <Typography variant="subtitle1">R$ {data?.total}</Typography>
            </FormControl>
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
                form.handleSubmit(edit(form, setResponseStatus, setOpen))
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

export default FormEditProposta;
