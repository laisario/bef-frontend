/* eslint-disable react/prop-types */
import { useTheme } from '@emotion/react';
import { Box, Card, Chip, FormControl, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useForm } from 'react-hook-form';
import useInstrumentos from '../../hooks/useInstrumentos';
import { fDate } from '../../utils/formatTime';

const posicaoInstrumento = {
  U: 'Em uso',
  E: 'Em estoque',
  I: 'Inativo',
  F: 'Fora de uso',
};

const localLabel = {
  P: "Instalação permanente",
  C: "Instalação do cliente",
  T: "Terceirizado"
}



function CardInformation({ instrumento, proposta }) {
  const [editPrice, setEditPrice] = useState(false)
  const { pathname } = useLocation();
  const theme = useTheme();
  const form = useForm({
    defaultValues: {
      precoAlternativoCalibracao: ""
    }
  })
  const { mutatePrice } = useInstrumentos(instrumento.id)
  const priceOptions = {
    "C": instrumento?.precoCalibracaoNoCliente,
    "L": instrumento?.precoCalibracaoNoLaboratorio,
  }
  const updatePrice = async () => {
    try {
      mutatePrice({ id: instrumento.id, price: form.watch("precoAlternativoCalibracao") })
    } catch (error) {
      console.log("Xi deu ruim", error)
    }
    setEditPrice(false)
    form.setValue("precoAlternativoCalibracao", "")
  }

  return (
    <Card sx={{ padding: 2, backgroundColor: theme.palette.background.neutral, minWidth: 400 }}>
      <Box display="flex" justifyContent="space-between" gap={2} mb={1}>
        {!!instrumento?.descricao &&
          <Typography fontWeight="900" color={'grey'} variant="body1">
            {instrumento?.descricao}
          </Typography>
        }
        {!!instrumento?.posicao &&
          <Chip label={posicaoInstrumento[instrumento?.posicao]} size="small" variant="outlined" />
        }
      </Box>
      {!!instrumento?.tag &&
        <Box display="flex" justifyContent="space-between">
          <Typography fontWeight="900" color={'grey'} variant="body1">
            Tag
          </Typography>
          <Typography fontWeight="400" color={'grey'} variant="body1">
            {instrumento?.tag}
          </Typography>
        </Box>
      }
      {!!instrumento?.numeroDeSerie &&
        <Box display="flex" justifyContent="space-between">
          <Typography fontWeight="900" color={'grey'} variant="body1">
            Número de série
          </Typography>
          <Typography fontWeight="400" color={'grey'} variant="body1">
            {instrumento?.numeroDeSerie}
          </Typography>
        </Box>
      }
      {!!instrumento?.dataUltimaCalibracao &&
        <Box display="flex" justifyContent="space-between">
          <Typography fontWeight="900" color={'grey'} variant="body1">
            Data última calibração
          </Typography>
          <Typography fontWeight="400" color={'grey'} variant="body1">
            {fDate(instrumento?.dataUltimaCalibracao)}
          </Typography>
        </Box>
      }
      {(!!instrumento?.minimo || !!instrumento?.maximo) &&
        <Box display="flex" justifyContent="space-between">
          <Typography fontWeight="900" color={'grey'} variant="body1">
            Faixa atendida
          </Typography>
          <Typography fontWeight="400" color={'grey'} variant="body1">
            {instrumento?.minimo} {!!instrumento?.maximo && `- ${instrumento?.maximo}`} {instrumento?.unidade}
          </Typography>
        </Box>
      }
      {!!instrumento?.capacidadeDeMedicao?.valor && !!instrumento?.capacidadeDeMedicao?.unidade && (<Box display="flex" justifyContent="space-between">
        <Typography fontWeight="900" color={'grey'} variant="body1">
          Capacidade de medição
        </Typography>
        <Typography fontWeight="400" color={'grey'} variant="body1">
          {instrumento?.valor} {instrumento?.unidadeMedicao}
        </Typography>
      </Box>)}
      {!!instrumento?.local && (<Box display="flex" justifyContent="space-between">
        <Typography fontWeight="900" color={'grey'} variant="body1">
          Local
        </Typography>
        <Typography fontWeight="400" color={'grey'} variant="body1">
          {localLabel[instrumento?.local]}
        </Typography>
      </Box>)}
      {!!instrumento?.prazoDeEntrega && (<Box display="flex" justifyContent="space-between">
        <Typography fontWeight="900" color={'grey'} variant="body1">
          Prazo de entrega
        </Typography>
        <Typography fontWeight="400" color={'grey'} variant="body1">
          {fDate(instrumento?.prazoDeEntrega)}
        </Typography>
      </Box>)}
      {!!instrumento?.diasUteis && (<Box display="flex" justifyContent="space-between">
        <Typography fontWeight="900" color={'grey'} variant="body1">
          Dias úteis
        </Typography>
        <Typography fontWeight="400" color={'grey'} variant="body1">
          {instrumento.diasUteis}
        </Typography>
      </Box>)}
      {(!!instrumento?.precoCalibracaoNoCliente || !!instrumento?.precoCalibracaoNoLaboratorio) &&
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography fontWeight="900" color={'grey'} variant="body1">
            Preço calibração
          </Typography>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            {editPrice
              ?
              <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}>
                <FormControl variant="outlined" sx={{ width: '50%' }}>
                  <TextField
                    type="number"
                    name="precoAlternativoCalibracao"
                    label="Editar preço"
                    size="small"
                    autoFocus
                    InputProps={{
                      startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                    }}
                    {...form.register("precoAlternativoCalibracao")}
                  />
                </FormControl>
                <IconButton size="small" onClick={() => { setEditPrice(false); form.setValue("precoAlternativoCalibracao", "") }}>
                  <CloseIcon fontSize='small' />
                </IconButton>
                <IconButton
                  onClick={updatePrice}
                >
                  <CheckIcon fontSize='small' />
                </IconButton>
              </Box>
              : <Typography fontWeight="400" color={'grey'} variant="body1">
                R$ {!!instrumento?.precoAlternativoCalibracao ? instrumento?.precoAlternativoCalibracao : priceOptions[proposta?.local]}
              </Typography>
            }
            {pathname.includes('/admin') && !editPrice && (
              <IconButton size="small" onClick={() => setEditPrice(true)}>
                <EditIcon fontSize='small' />
              </IconButton>
            )}
          </Box>
        </Box>
      }
      <Box display="flex" justifyContent="space-between" mt={2}>
        {!!instrumento?.tipoDeServico &&
          <Typography fontWeight="900" color={'black'} variant="body1">
            {instrumento?.tipoDeServico === 'A' ? 'Acreditado' : 'Não acreditado'}
          </Typography>
        }
      </Box>
    </Card >
  );
}

export default CardInformation;
