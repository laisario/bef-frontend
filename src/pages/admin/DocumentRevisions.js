import React from 'react'
import { Helmet } from 'react-helmet-async';
import { Button, Container, Grid, Stack, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import Iconify from '../../components/iconify/Iconify';
import useDocumentos from '../../hooks/useDocumentos';
import RevisionCard from '../../components/admin/documents/RevisionCard';
import FormCreateRevision from '../../components/admin/documents/FormCreateRevision';

function DocumentRevisions() {
  const { id } = useParams();
  const { data, openFormRevision, setOpenFormRevision } = useDocumentos(id);
  const revisoes = data?.revisoes;
  return (
    <>
      <Helmet>
        <title>Revisões | B&F</title>
      </Helmet>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Revisões {!!data?.titulo && `do documento: ${data.titulo}`}
          </Typography>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => setOpenFormRevision(!openFormRevision)}>
            Nova revião
          </Button>
        </Stack>

        <Grid container spacing={2}>
          {revisoes?.map((revisao) => (
            <Grid item key={revisao?.id} xs={6}>
              <RevisionCard revisao={revisao} key={revisao.id} />
            </Grid>
          ))}
        </Grid>

        {openFormRevision && <FormCreateRevision open={openFormRevision} setOpen={setOpenFormRevision} />}
      </Container>
    </>
  )
}

export default DocumentRevisions
