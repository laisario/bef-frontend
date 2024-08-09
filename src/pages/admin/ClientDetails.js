import { Box, CircularProgress, Container, InputAdornment, Stack, TablePagination, TextField, Typography } from '@mui/material'
import React from 'react'
import { Helmet } from 'react-helmet-async'
import { useParams } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import useClients from '../../hooks/useClients';
import ClientInformation from '../../components/clients/ClientInformation';
import useInstrumentos from '../../hooks/useInstrumentos';
import ClientInstrumentInformation from '../../components/instrumentos/ClientInstrumentInformation';

function ClientDetails() {
  const { id } = useParams();
  const { data } = useClients(id);
  const { todosInstrumentos, handleChangePage, page, isLoading, handleChangeRowsPerPage, rowsPerPage, search, setSearch, localLabels, positionLabels } = useInstrumentos(null, data?.id, 5);
  return (
    <>
      <Helmet>
        <title>Cliente | Kometro </title>
      </Helmet>
      <Container>
        <Stack direction="column" alignItems="flex-start" justifyContent="center" mb={5}>
          <Typography variant="h4" gutterBottom>
            Informações cliente
          </Typography>
          <Typography variant="h6" gutterBottom>
            {data?.empresa?.nome_fantasia}
          </Typography>
        </Stack>
        <ClientInformation data={data} />
        <br />
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h4" gutterBottom>
            Instrumentos
          </Typography>
          <TextField
            id="search-instrument"
            size='small'
            label="Busque um instrumento"
            variant="outlined"
            sx={{ width: '60%' }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Stack>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {isLoading ? <CircularProgress /> : todosInstrumentos?.results?.map((instrument, index) => (
            <ClientInstrumentInformation key={index + instrument?.id} instrument={instrument} localLabels={localLabels} positionLabels={positionLabels} />
          ))}
        </Box>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          component="div"
          count={todosInstrumentos?.count || 0}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Instrumentos por página"
        />

      </Container>
    </>
  )
}

export default ClientDetails