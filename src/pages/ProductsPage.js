import { Helmet } from 'react-helmet-async';
// @mui
import { Box, CircularProgress, Container, InputAdornment, TextField, Typography } from '@mui/material';
import { Search } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
// components
import { ProductList } from '../sections/@dashboard/products';
// mock
import useInstrumentos from '../hooks/useInstrumentos';

// ----------------------------------------------------------------------

export default function ProductsPage() {
  const { todosInstrumentos, search, setSearch, isLoading } = useInstrumentos()
  return (
    <>
      <Helmet>
        <title> Instrumentos | B&F </title>
      </Helmet>

      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Meus Instrumentos
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <TextField
            label='Procure um instrumento'
            id='search-bar'
            value={search}
            sx={{ width: '100%', mb: 4 }}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          {isLoading ? <CircularProgress /> : <ProductList products={todosInstrumentos} />}
        </Box>
      </Container>
    </>
  );
}
