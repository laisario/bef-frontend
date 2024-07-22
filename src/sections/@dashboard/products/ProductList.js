import PropTypes from 'prop-types';
// @mui
import { Grid } from '@mui/material';
import ProductCard from './ProductCard';

// ----------------------------------------------------------------------

ProductList.propTypes = {
  products: PropTypes.array.isRequired,
};

export default function ProductList({ products, setSelecionados, selecionados, ...other }) {
  return (
    <Grid container spacing={3} {...other}>
      {products?.results?.map((product) => (
        <Grid key={product.id} item xs={12} sm={6} md={3}>
          <ProductCard product={product} setSelecionados={setSelecionados} selecionados={selecionados} />
        </Grid>
      ))}
    </Grid>
  );
}
