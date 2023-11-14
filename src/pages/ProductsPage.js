import { Helmet } from 'react-helmet-async';
// @mui
import { Container, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
// components
import { ProductList } from '../sections/@dashboard/products';
// mock
import useInstrumentos from '../hooks/useInstrumentos';

// ----------------------------------------------------------------------

export default function ProductsPage() {
  const { todosInstrumentos } = useInstrumentos()
  return (
    <>
      <Helmet>
        <title> Instrumentos | B&F </title>
      </Helmet>

      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Meus Instrumentos
        </Typography>

        <ProductList products={todosInstrumentos} />
      </Container>
    </>
  );
}
