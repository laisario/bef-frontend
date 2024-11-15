import PropTypes from 'prop-types';
import { Box, Card, Link, Typography, Stack, Chip, Divider, Radio } from '@mui/material';
import { useMemo } from 'react';
import palette from '../../../theme/palette';
import { positionLabels, colorPositionInstrument } from '../../../utils/instruments';

ProductCard.propTypes = {
  product: PropTypes.object,
};

export default function ProductCard({ product, setSelecionados, selecionados }) {
  const isSelected = useMemo(() => selecionados.includes(product.id), [selecionados, product])
  return (
    <Card sx={{ border: isSelected ? "3px solid #555555" : 0, cursor: "pointer", minHeight: '250px'  }} onClick={() => setSelecionados((selecionados) => isSelected ? selecionados.filter(selecionado => selecionado !== product.id) : [...selecionados, product.id])}>
      <Box sx={{
        p: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: "center",
        backgroundColor: palette.secondary.lighter,
        color: palette.secondary.contrastText
      }}>
        {!!product?.tag &&
          <Typography color="white" variant='subtitle1'>{product?.tag}</Typography>
        }
        <Radio color="secondary" sx={{ backgroundColor: "white", p: 0, border: 0, color: "white" }} checked={isSelected} />
      </Box>
      <Divider />
      <Stack sx={{ p: 3 }} gap={1}>
        {!!product?.instrumento?.tipo_de_instrumento?.descricao &&
          <Link href={`#/dashboard/instrumento/${product?.id}`} color="inherit" underline="hover">
            <Typography variant="subtitle1">
              {product?.instrumento?.tipo_de_instrumento?.descricao}
            </Typography>
          </Link>
        }
        {!!product?.instrumento.tipo_de_instrumento.modelo &&
          <Typography variant="subtitle2" fontWeight={300}>
            {product?.instrumento?.tipo_de_instrumento?.modelo}
          </Typography>
        }
        {!!product?.instrumento?.tipo_de_instrumento?.fabricante &&
          <Typography variant="caption text">
            {product?.instrumento?.tipo_de_instrumento?.fabricante}
          </Typography>
        }
      </Stack>
      {!!product?.posicao &&
        <Box sx={{ pr: 5, pb: 5, display: 'flex', justifyContent: 'flex-end' }}>
          <Chip sx={{ color: palette?.common?.white }} color={colorPositionInstrument[product?.posicao]} label={positionLabels[product?.posicao]} />
        </Box>
      }
    </Card>
  );
}
