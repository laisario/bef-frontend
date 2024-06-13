import PropTypes from 'prop-types';
// @mui
import { Box, Card, Link, Typography, Stack, Chip, Divider, Radio } from '@mui/material';
import { useMemo } from 'react';

// ----------------------------------------------------------------------

const posicaoInstrumento = {
  U: 'Em uso',
  E: 'Em estoque',
  I: 'Inativo',
  F: 'Fora de uso',
};

// ----------------------------------------------------------------------

ProductCard.propTypes = {
  product: PropTypes.object,
};

export default function ProductCard({ product, setSelecionados, selecionados }) {
  const isSelected = useMemo(() => selecionados.includes(product.id), [selecionados, product])
  return (
    <Card sx={{ border: isSelected ? "3px solid #FF9E75" : 0, cursor: "pointer" }} onClick={() => setSelecionados((selecionados) => isSelected ? selecionados.filter(selecionado => selecionado !== product.id) : [...selecionados, product.id])}>
      <Link href={`#/dashboard/produto/${product.id}`} color="inherit" underline="none">

        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: "center", backgroundColor: '#FF9E75' }}>
          {!!product?.tag &&
            <Typography color="white" variant='subtitle1'>{product.tag}</Typography>
          }
          <Radio sx={{ backgroundColor: "white", p: 0, border: 0, color: "white" }} checked={isSelected} />
        </Box>
        <Divider />
        <Stack sx={{ p: 3 }} gap={1}>
          {!!product?.instrumento?.tipo_de_instrumento.descricao &&
            <Typography variant="subtitle1">
              {product?.instrumento?.tipo_de_instrumento.descricao}
            </Typography>
          }
          {!!product?.instrumento.tipo_de_instrumento.modelo &&
            <Typography variant="subtitle2" fontWeight={300}>
              {product?.instrumento.tipo_de_instrumento.modelo}
            </Typography>
          }
          {!!product?.instrumento.tipo_de_instrumento.fabricante &&
            <Typography variant="caption text">
              {product?.instrumento.tipo_de_instrumento.fabricante}
            </Typography>
          }
        </Stack>
        {!!product?.posicao &&
          <Box sx={{ pr: 5, pb: 5, display: 'flex', justifyContent: 'flex-end' }}>
            <Chip label={posicaoInstrumento[product?.posicao]} />
          </Box>
        }
      </Link>
    </Card>
  );
}
