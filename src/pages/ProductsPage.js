import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
// @mui
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import { AppBar, Box, Button, CircularProgress, Container, IconButton, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import GetAppIcon from '@mui/icons-material/GetApp';
import InfoIcon from '@mui/icons-material/Info';
import ExportFilter from '../components/instrumentos/ExportFilter';
// components
import { ProductList } from '../sections/@dashboard/products';
// mock
import useInstrumentos from '../hooks/useInstrumentos';

// ----------------------------------------------------------------------


const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.grey[300], 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.grey[400], 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));


export default function ProductsPage() {
  const { todosInstrumentos, search, setSearch, isLoading } = useInstrumentos();
  const navigate = useNavigate()
  const [open, setOpen] = useState(false);
  const [valueCheckbox, setValueCheckbox] = useState({
    tag: true,
    numeroDeSerie: true,
    observacoes: true,
    laboratorio: true,
    posicaoDoInstrumento: true,
    dataUltimaCalibracao: true,
    frequenciaDeCalibracao: true,
    dataDaProximaCalibracao: true,
    dataDaProximaChecagem: true,
  });
  const [error, setError] = useState(false);
  const [selecionados, setSelecionados] = useState([])

  const handleChangeCheckbox = (event) => {
    const { name, checked } = event.target;
    setValueCheckbox({ ...valueCheckbox, [name]: checked });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setValueCheckbox({
      tag: true,
      numeroDeSerie: true,
      observacoes: true,
      laboratorio: true,
      posicaoDoInstrumento: true,
      dataUltimaCalibracao: true,
      frequenciaDeCalibracao: true,
      dataDaProximaCalibracao: true,
      dataDaProximaChecagem: true,
    });
    setError(false);
  };

  return (
    <>
      <Helmet>
        <title> Instrumentos | B&F </title>
      </Helmet>

      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
          flexWrap="wrap"
         >

          <Typography variant="h4" gutterBottom>
            Meus Instrumentos
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Procure um instrumento"
                inputProps={{ 'aria-label': 'Procure um instrumento' }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Search>
            <Button variant="contained" disabled={selecionados?.length === 0} sx={{ ml: 1 }} onClick={handleClickOpen} endIcon={<GetAppIcon />}>Exportar</Button>
          </Box>
        </Stack>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <ExportFilter
            handleClose={handleClose}
            open={open}
            selecionados={selecionados}
            handleChangeCheckbox={handleChangeCheckbox}
            valueCheckbox={valueCheckbox}
            error={error}
            setError={setError}
          />
          {isLoading ? <CircularProgress /> : <ProductList products={todosInstrumentos} setSelecionados={setSelecionados} selecionados={selecionados} />}
        </Box>
      </Container>
    </>
  );
}
