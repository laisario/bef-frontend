import { Container, Typography } from '@mui/material';
import React from 'react'
import { Helmet } from 'react-helmet-async';
import useInstrumentos from '../../hooks/useInstrumentos';
import ProductsCompanyList from '../../sections/admin/products/ProductsCompanyList';

function ProductsPageAdmin() {
  const { instrumentosEmpresa } = useInstrumentos();
  return (
    <>
      <Helmet>
        <title> Instrumentos | B&F </title>
      </Helmet>

      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Instrumentos
        </Typography>
        <ProductsCompanyList products={instrumentosEmpresa} />
      </Container>
    </>
  );
}

export default ProductsPageAdmin