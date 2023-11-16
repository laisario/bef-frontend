import PropTypes from 'prop-types';
// @mui
import { Box, Card, Link, Typography, Stack, Chip, Divider, useTheme } from '@mui/material';

// ----------------------------------------------------------------------

const posicaoInstrumento = {
  U: 'Em uso',
  E: 'Em estoque',
  I: 'Inativo',
  F: 'Fora de uso',
};

// ----------------------------------------------------------------------

ShopProductCard.propTypes = {
  product: PropTypes.object,
};

export default function ShopProductCard({ product }) {
  return (
    <Card>
      <Link href={`#/dashboard/produto/${product.id}`} color="inherit" underline="hover">
        <Box sx={{ p: 5, display: 'flex', justifyContent: 'center', backgroundColor: '#FF9E75' }}>
          <Typography color="white" border="solid" px={5} mx={1} py={2} borderRadius={4} variant='subtitle1'>{product.tag}</Typography>
        </Box>
        <Divider />
        <Stack sx={{ p: 3 }}>
          <Typography variant="subtitle1" noWrap>
            {product?.instrumento?.tipo_de_instrumento.descricao}
          </Typography>
          <Typography variant="subtitle2" noWrap>
            {product?.instrumento.tipo_de_instrumento.modelo}
          </Typography>
          <Typography variant="caption text" noWrap>
            {product?.instrumento.tipo_de_instrumento.fabricante}
          </Typography>
        </Stack>
        <Box sx={{ pr: 5, pb: 5, display: 'flex', justifyContent: 'flex-end' }}>
          <Chip label={posicaoInstrumento[product?.posicao]}/>
        </Box>
      </Link>
    </Card>
  );
}
