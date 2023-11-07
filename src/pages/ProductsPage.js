import { Helmet } from 'react-helmet-async';
// @mui
import { Container, Typography } from '@mui/material';
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

        {/* Feature filters */}
        {/* <Stack direction="row" flexWrap="wrap-reverse" alignItems="center" justifyContent="flex-end" sx={{ mb: 5 }}>
          <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
            <ProductFilterSidebar
              openFilter={openFilter}
              onOpenFilter={handleOpenFilter}
              onCloseFilter={handleCloseFilter}
            />
            <ProductSort />
          </Stack>
        </Stack> */}

        <ProductList products={todosInstrumentos} />
      </Container>
    </>
  );
}
