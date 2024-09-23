import { useEffect, useRef, useState } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Button,
  Select,
  TextField,
  FormLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  Typography,
  Paper,
  Link,
  CircularProgress
} from '@mui/material';
import 'dayjs/locale/pt-br';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import DescriptionIcon from '@mui/icons-material/Description';
import { useForm, useWatch } from 'react-hook-form';
import dayjs from 'dayjs';
import { LoadingButton } from '@mui/lab';
import CloseIcon from '@mui/icons-material/Close';
import { axiosForFiles } from '../../api';
import Iconify from '../iconify';
import useUsers from '../../hooks/useUsers';
import FormAdress from '../address/FormAdress';

function truncateString(str, num) {
  if (str.length > num) {
    return `${str.slice(0, num)}...`
  }
  return str;
}

function FormElaborate({ data, open, setElaborate, setResponseStatus, setOpenAlert, editProposol, elaborate, isLoading }) {
  const [anexos, setAnexos] = useState([])
  const [loading, setLoading] = useState(false)
  const form = useForm({
    defaultValues: {
      numeroProposta: data?.numero || 0,
      transporte: data?.transporte || '',
      total: data?.total || '',
      formaDePagamento: data?.condicao_de_pagamento || '',
      CEP: data?.endereco_de_entrega?.cep || "",
      rua: data?.endereco_de_entrega?.logradouro || "",
      numeroEndereco: data?.endereco_de_entrega?.numero || "",
      bairro: data?.endereco_de_entrega?.bairro?.nome || "",
      cidade: data?.endereco_de_entrega?.bairro?.cidade || "",
      estado: data?.endereco_de_entrega?.estado || "",
      complemento: data?.endereco_de_entrega?.complemento || "",
      status: data?.status || "",
      enderecoDeEntrega: data?.endereco_de_entrega ? "enderecoCadastrado" : null,
      validade: data?.validade || null,
      prazoDePagamento: data?.prazo_de_pagamento || null,
      responsavel: data?.responsavel?.id || null,
      diasUteis: data?.dias_uteis || null,
    },
  });

  const {
    enderecoDeEntrega,
    validade,
    prazoDePagamento,
    formaDePagamento,
    responsavel
  } = useWatch({ control: form.control })

  const { data: users } = useUsers();
  const ref = useRef(null)

  const handleChangeAnexo = (event) => {
    if (!event.target.files.length) return
    Array.from(event.target.files).forEach(async file => {
      const formData = new FormData()
      formData.append('anexo', file)
      setLoading(true)
      const { data, status } = await axiosForFiles.patch(`/propostas/${data?.id}/anexar/`, formData)
      setLoading(false)
      if (status === 201) {
        setAnexos(oldAnexos => [...oldAnexos, data])
      }
    })
  }

  const handleRemoveAttachment = async (anexo) => {
    const attachmentToRemove = anexos?.find(att => att.id === anexo?.id)
    const formData = new FormData()
    formData.append('anexo', attachmentToRemove?.id)
    setLoading(true)
    const { status } = await axiosForFiles.patch(`/propostas/${data?.id}/desanexar/`, formData)
    setLoading(false)
    if (status === 200) {
      setAnexos((oldAnexos) => oldAnexos.filter((an) => an?.id !== anexo?.id))
    }
  }

  const handleClose = () => {
    setElaborate(false)
    form.reset()
  }

  useEffect(() => {
    setAnexos(data?.anexos?.map((anexo) => anexo))
  }, [])

  return (
    <Dialog open={open} onClose={handleClose}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
        <DialogContent>
          <Box display="flex" gap={2}>
            <FormControl sx={{ width: '50%' }} size="small">
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
              size="small"
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
          <Box display="flex" gap={2}>
            <FormControl sx={{ width: '50%' }} size="small">
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
            {data?.show_business_days && (<TextField
              id="diasUteis"
              label="Dias Úteis"
              name="diasUteis"
              type="number"
              variant="outlined"
              sx={{ width: '50%' }}
              {...form.register("diasUteis")}
              size="small"
            />)}
          </Box>
          <FormControl sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2, my: 1 }}>
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
          <Box>
            <Typography>Anexos</Typography>
            <Box display="flex" gap={2} flexWrap="nowrap" overflow="auto" flexShrink={0}>
              <Paper onClick={() => ref?.current?.click()} sx={{ cursor: 'pointer', display: 'flex', flexShrink: 0, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: 100, width: 100 }} elevation={4}>
                {loading ? <CircularProgress /> : <Typography color="gray" fontSize={72} lineHeight={0.75} mb={0} fontWeight={300}>+</Typography>}
                <Typography color="gray" variant='caption'>Novo anexo</Typography>
                <input
                  style={{ display: 'none' }}
                  id="upload-btn"
                  name="anexos"
                  type="file"
                  ref={ref}
                  onChange={handleChangeAnexo}
                />
              </Paper>
              {anexos?.map((anexo, i) => <Paper key={i + 1} sx={{ textDecoration: "none", display: 'flex', flexShrink: 0, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: 100, width: 100 }} elevation={4}>
                <Link href={anexo?.anexo} target="_blank" rel='noreferrer' style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                  <DescriptionIcon color='gray' fontSize="large" />
                  <Typography color="gray" variant='caption'>{truncateString(new URL(anexo?.anexo).pathname?.split('/').reverse()[0], 12)}</Typography>
                </Link>
                <CloseIcon fontSize='small' color='gray' onClick={() => handleRemoveAttachment(anexo)} />
              </Paper>)}

            </Box>
          </Box>
          <Box display="flex" gap={1} >
            {+data?.total !== 0 && (<FormControl sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2, mt: 1 }}>
              <FormLabel id="total">Total: </FormLabel>
              <Typography variant="subtitle1">R$ {data?.total}</Typography>
            </FormControl>)}
          </Box>
          <Box display="flex" alignItems="center" justifyContent="space-between" mt={4}>
            <Button onClick={handleClose}>Cancelar</Button>
            <LoadingButton
              endIcon={<Iconify icon={'eva:arrow-ios-forward-fill'} />}
              loading={isLoading}
              sx={{ maxWidth: '45%' }}
              type="submit"
              fullWidth
              size="large"
              variant="contained"
              onClick={async () => {
                form.handleSubmit(elaborate(form, editProposol, setResponseStatus, setOpenAlert))
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
