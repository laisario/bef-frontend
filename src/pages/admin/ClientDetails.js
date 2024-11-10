import { Alert, Box, Button, CircularProgress, Container, InputAdornment, Paper, Snackbar, Stack, TablePagination, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useParams } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import useClients from '../../hooks/useClients';
import ClientInformation from '../../components/clients/ClientInformation';
import useInstrumentos from '../../hooks/useInstrumentos';
import ClientInstrumentInformation from '../../components/instrumentos/ClientInstrumentInformation';
import useResponsive from '../../hooks/useResponsive';
import EditInstrument from '../../components/EditInstrument';


function ClientDetails() {
  const [openFormCreate, setOpenFormCreate] = useState(false)
  const [openAlert, setOpenAlert] = useState({ open: false, msg: '', color: 'success' })
  const { id } = useParams();
  const { data } = useClients(id);
  const { todosInstrumentos,
    handleChangePage,
    page,
    isLoading,
    handleChangeRowsPerPage,
    rowsPerPage,
    search,
    setSearch,
    isDeleting,
    mutateDelete,
  } = useInstrumentos(null, data?.id, 5);
  const isMobile = useResponsive('down', 'md');

  const handleCloseFormCreate = () => setOpenFormCreate(false)
  const handleOpenFormCreate = () => setOpenFormCreate(true)

  const handleOpenAlert = (msg, color) => setOpenAlert({ open: true, msg, color, });
  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenAlert({ open: false, msg: '', color: 'success' })
  }
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
            {data?.empresa?.razao_social || data?.nome}
          </Typography>
        </Stack>
        <ClientInformation data={data} isMobile={isMobile} />
        <br />
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2} useFlexGap sx={{ flexWrap: 'wrap' }}>
          <Typography variant="h4" gutterBottom>
            Instrumentos
          </Typography>
          <Stack direction='row' gap={2}>
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
            <Button variant='contained' onClick={handleOpenFormCreate} size={isMobile ? 'small' : 'medium'} >Novo instrumento</Button>
            <EditInstrument create handleOpenAlert={handleOpenAlert} clientId={id} handleClose={handleCloseFormCreate} open={openFormCreate} isMobile={isMobile} />
          </Stack>
        </Stack>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {isLoading
            ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress />
              </Box>
            )
            : todosInstrumentos?.results?.length ? todosInstrumentos?.results?.map((instrument, index) => (
              <ClientInstrumentInformation handleOpenAlert={handleOpenAlert} key={index + instrument?.id} instrument={instrument} isMobile={isMobile} isDeleting={isDeleting} mutateDelete={mutateDelete} />
            ))
              : (
                <Paper square={false} variant='elevation' sx={{ backgroundColor: '#e5e5e5', p: 1, mt: 2, }}>
                  <Typography variant='h6' p={8} textAlign='center' >Nenhum instrumento cadastrado</Typography>
                </Paper>
              )
          }
        </Box>
        <Snackbar
          open={openAlert?.open}
          autoHideDuration={2000}
          onClose={handleCloseAlert}
        >
          <Alert onClose={handleCloseAlert} severity={openAlert?.color}>{openAlert?.msg}</Alert>
        </Snackbar>
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