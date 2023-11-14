import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Modal,
  FormLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  Typography,
  CircularProgress,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

import React, { useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import useOrders from '../../hooks/useOrders';
import Iconify from '../iconify';
import FormAdress from '../adress/FormAdress';
import useCEP from '../../hooks/useCEP';
import Alert from '../Alert';

function FormEditProposta({ data, open, handleClose }) {
  const [form, setForm] = useState({
    local: data?.local || '',
    total: data?.total || '',
    prazo_de_entrega: data?.prazo_de_entrega || '',
    forma_de_pagamento: data?.condicao_de_pagamento || '',
    transporte: data?.transporte || '',
    numero: data?.numero || 0,
    validade: data?.validade || '',
    data_aprovacao: data?.data_aprovacao || '',
    certificado: data?.anexo || null,
  });
  const [CEP, setCEP] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [aprovado, setAprovado] = useState(null);
  const [enderecoEntrega, setEnderecoEntrega] = useState(null);
  const { isValid: cepValido, ...cepInfo } = useCEP(CEP);
  const { id } = useParams();
  const { edit, isLoading } = useOrders(id);
  const handleChange = (event) => {
    const { name, value, files } = event.target;
    if (name === 'certificado') {
      setForm((prevForm) => ({ ...prevForm, [name]: files[0] }));
    } else {
      setForm((prevForm) => ({ ...prevForm, [name]: value }));
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          minWidth: 600,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Box display="flex" gap={2}>
          <TextField
            id="numero"
            label="Número proposta"
            name="numero"
            value={form.numero}
            onChange={handleChange}
            variant="outlined"
            type="number"
            sx={{ width: '50%' }}
          />
          <TextField
            id="transporte"
            label="Transporte"
            name="transporte"
            value={form.transporte}
            onChange={handleChange}
            variant="outlined"
            sx={{ width: '50%' }}
          />
        </Box>
        <Box display="flex" gap={2}>
          <TextField
            label="Prazo de entrega"
            name="prazo_de_entrega"
            value={form.prazo_de_entrega}
            onChange={handleChange}
            variant="outlined"
            helperText="dd/mm/aaaa"
            sx={{ width: '50%' }}
          />
          <TextField
            label="Validade"
            name="validade"
            value={form.validade}
            onChange={handleChange}
            variant="outlined"
            sx={{ width: '50%' }}
            helperText="dd/mm/aaaa"
          />
        </Box>
        {data?.aprovacao && (
          <TextField
            label="Data aprovação"
            name="data_aprovacao"
            value={form.data_aprovacao}
            onChange={handleChange}
            variant="outlined"
            helperText="dd/mm/aaaa"
            fullWidth
          />
        )}
        <Box display="flex" gap={2}>
          <FormControl sx={{ width: '50%' }} margin="normal">
            <InputLabel id="demo-simple-select-label">Local</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={form.local}
              name="local"
              label="Local"
              onChange={handleChange}
            >
              <MenuItem value="L">Laboratório</MenuItem>
              <MenuItem value="C">Cliente</MenuItem>
            </Select>
          </FormControl>
          <FormControl margin="normal" sx={{ width: '50%' }}>
            <InputLabel id="select-pagamento">Forma de pagamento</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="select-pagamento"
              value={form.forma_de_pagamento}
              name="forma_de_pagamento"
              label="Forma de Pagamento"
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value="CD">Cartão débito</MenuItem>
              <MenuItem value="CC">Cartão crédito</MenuItem>
              <MenuItem value="P">Pix</MenuItem>
              <MenuItem value="D">Dinheiro</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <FormControl sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
          <FormLabel id="aprovacao">Endereço de entrega: </FormLabel>
          <RadioGroup row aria-labelledby="aprovacao">
            <FormControlLabel
              value="enderecoCadastrado"
              control={
                <Radio
                  checked={enderecoEntrega === 'enderecoCadastrado'}
                  onClick={() =>
                    setEnderecoEntrega(enderecoEntrega === 'enderecoCadastrado' ? null : 'enderecoCadastrado')
                  }
                />
              }
              label="Endereço cliente cadastrado"
            />
            <FormControlLabel
              value="novoEndereco"
              control={
                <Radio
                  checked={enderecoEntrega === 'novoEndereco'}
                  onClick={() => setEnderecoEntrega(enderecoEntrega === 'novoEndereco' ? null : 'novoEndereco')}
                />
              }
              label="Novo enderenço"
            />
          </RadioGroup>
        </FormControl>
        {enderecoEntrega === 'novoEndereco' && (
          <FormAdress
            valid={cepValido}
            cepInfo={cepInfo}
            form={{
              CEP,
              rua,
              numero,
              bairro,
              cidade,
              estado,
              setCEP,
              setRua,
              setNumero,
              setBairro,
              setCidade,
              setEstado,
            }}
          />
        )}
        {data?.status === 'F' && (
          <FormControl sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
            <FormLabel id="aprovacao">Situação: </FormLabel>
            <RadioGroup row aria-labelledby="aprovacao">
              <FormControlLabel
                value="true"
                control={
                  <Radio
                    checked={aprovado === 'true'}
                    onClick={() => setAprovado(aprovado === 'true' ? null : 'true')}
                  />
                }
                label="Aprovada"
              />
              <FormControlLabel
                value="false"
                control={
                  <Radio
                    checked={aprovado === 'false'}
                    onClick={() => setAprovado(aprovado === 'false' ? null : 'false')}
                  />
                }
                label="Reprovada"
              />
            </RadioGroup>
          </FormControl>
        )}
        <FormControl sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
          <FormLabel id="anexo">Anexo: </FormLabel>
          {form?.certificado ? (
            <>
              <Button component="label" color="info" variant="contained" startIcon={<CloudUploadIcon />}>
                Enviar arquivo
                <input
                  style={{ display: 'none' }}
                  id="upload-btn"
                  name="certificado"
                  onChange={handleChange}
                  type="file"
                />
              </Button>
              <Button
                component="a"
                href={
                  !!form?.certificado && form?.certificado instanceof File
                    ? URL.createObjectURL(form?.certificado)
                    : form?.certificado
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
                name="certificado"
                onChange={handleChange}
                type="file"
              />
            </Button>
          )}
        </FormControl>
        <FormControl sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2, mt: 1 }}>
          <FormLabel id="total">Total: </FormLabel>
          <Typography variant="subtitle1">R$ {data?.total}</Typography>
        </FormControl>
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
              edit({
                form,
                CEP: cepInfo?.cep || CEP,
                numero,
                rua: cepInfo?.rua || rua,
                bairro: cepInfo?.bairro || bairro,
                cidade: cepInfo?.cidade || cidade,
                estado: cepInfo?.estado || estado,
                enderecoEntrega,
                aprovado,
              });
              handleClose();
            }}
          >
            Salvar
          </LoadingButton>
        </Box>
      </Box>
    </Modal>
  );
}

export default FormEditProposta;