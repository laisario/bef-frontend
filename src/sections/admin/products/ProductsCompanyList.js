/* eslint-disable react/prop-types */
import { Grid } from '@mui/material';
import React from 'react'
import ProductCardAdmin from './ProductCardAdmin';

function ProductsCompanyList({ products, ...other }) {
  return (
    <Grid container spacing={3} {...other}>
      {products?.map((product) => (
        <Grid key={product.id} item xs={12} sm={6} md={6}>
          <ProductCardAdmin product={product} />
        </Grid>
      ))}
    </Grid>
  );
}

export default ProductsCompanyList