import { Box, Card, Chip, Divider, Stack, Typography } from '@mui/material';
import React from 'react';

function ProductCardAdmin({ product }) {
  return (
    <Card>
      <Box
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          backgroundColor: '#FF9E75',
        }}
      >
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
        }}>
          {!!product?.tipo_de_instrumento.descricao &&
            <Typography variant="subtitle1">{product?.tipo_de_instrumento.descricao}</Typography>
          }
          {!!product?.tipo_de_instrumento.modelo &&
            <Typography variant="body1" fontWeight={100}>{product?.tipo_de_instrumento.modelo}</Typography>
          }
          {!!product?.tipo_de_instrumento.fabricante &&
            <Typography variant="body2">{product?.tipo_de_instrumento.fabricante}</Typography>
          }
        </Box>
        <Box>
          <Chip
            label={product?.tipo_de_servico === 'A' ? 'Acreditado' : 'Não acreditado'}
            color={product?.tipo_de_servico === 'A' ? 'primary' : 'warning'}
            variant="filled"
            mb={2}
          />
        </Box>
      </Box>
      <Divider />
      <Stack sx={{ p: 2 }}>
        {(!!product?.maximo || !!product?.minimo) &&
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="body2"><strong>Faixa de medição:</strong></Typography>
            <Typography variant="body2">
              {product?.minimo} {!!product?.maximo && ` - ${product?.maximo}`}
            </Typography>
          </Box>
        }
        {!!product?.unidades?.length &&
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Typography variant="body2"><strong>{product?.unidades?.length > 1 ? 'Unidades atendidas:' : 'Unidade atendida:'}</strong></Typography>
            <Typography>
              {product?.unidades?.map(({ unidade }) => `${unidade} `)}
            </Typography>
          </Box>
        }
        {!!product?.capacidade_de_medicao?.valor &&
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="body2"><strong>Capacidade de medição:</strong></Typography>
            <Typography variant="body2">
              {product?.capacidade_de_medicao?.valor} {product?.capacidade_de_medicao?.unidade}
            </Typography>
          </Box>
        }
        {!!product?.procedimento}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="body2"><strong>Procedimento relacionado:</strong></Typography>
          <Typography variant="body2">{product?.procedimento_relacionado?.codigo}</Typography>
        </Box>
      </Stack>
      <Divider />
      <Stack sx={{ p: 2 }}>
        <Typography pb={1} variant="subtitle2">
          <strong>Preço calibração</strong>
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="body2">No cliente:</Typography>
          <Typography variant="body2">R${product?.preco_calibracao_no_cliente}</Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            mb: 2
          }}
        >
          <Typography variant="body2">No laboratorio:</Typography>
          <Typography variant="body2">R${product?.preco_calibracao_no_laboratorio}</Typography>
        </Box>
      </Stack>
    </Card>
  );
}

export default ProductCardAdmin;