import { Box, Card, Chip, Divider, Link, Stack, Typography } from '@mui/material';
import React from 'react';

function ProductCardAdmin({ product }) {
  return (
    <Card>
      <Box
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          backgroundColor: '#FF9E75',
        }}
      >
        <Typography variant="subtitle1">{product?.tipo_de_instrumento.descricao}</Typography>
        <Typography variant="body1" fontWeight={100}>{product?.tipo_de_instrumento.modelo}</Typography>
        <Typography variant="body2">{product?.tipo_de_instrumento.fabricante}</Typography>
      </Box>
      <Divider />
      <Stack sx={{ p: 2 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="body2">Faixa de medição:</Typography>
          <Typography variant="body2">
            {product?.minimo} - {product?.maximo} {product?.unidade}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="body2">Capacidade de medição:</Typography>
          <Typography variant="body2">
            {product?.capacidade_de_medicao.valor} {product?.capacidade_de_medicao.unidade}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="body2">Procedimento relacionado:</Typography>
          <Typography variant="body2">{product?.procedimento_relacionado.procedimento}</Typography>
        </Box>
      </Stack>
      <Divider />
      <Stack sx={{ p: 2 }}>
        <Typography pb={1} variant="subtitle2">
          Preço calibração
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
        <Chip
          label={product.tipo_de_servico === 'A' ? 'Acreditado' : 'Não acreditado'}
          color={product.tipo_de_servico === 'A' ? 'primary' : 'warning'}
          variant="outlined"
          mb={2}
        />
      </Stack>
    </Card>
  );
}

export default ProductCardAdmin;
