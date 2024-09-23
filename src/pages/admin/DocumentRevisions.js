import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async';
import { Button, Container, Grid, Stack, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import Iconify from '../../components/iconify/Iconify';
import RevisionCard from '../../components/admin/documents/RevisionCard';
import FormCreateRevision from '../../components/admin/documents/FormCreateRevision';

function DocumentRevisions() {
  const { state } = useLocation()
  const revisoes = state?.data?.revisoes
  const user = state?.data?.user
  const titulo = state?.data?.titulo
  const [revisions, setRevisions] = useState([...revisoes])
  const [open, setOpen] = useState(false)
  return (
    <>
      <Helmet>
        <title>Revisões | Kometro</title>
      </Helmet>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Revisões {!!titulo && `do documento: ${titulo}`}
          </Typography>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => setOpen(!open)}>
            Nova revisão
          </Button>
        </Stack>

        <Grid container spacing={2}>
          {revisions?.map((revisao) => (
            <Grid item key={revisao?.id} xs={12} sm={6}>
              <RevisionCard revisao={revisao} key={revisao.id} user={user} />
            </Grid>
          ))}
        </Grid>

        {open && <FormCreateRevision open={open} setOpen={setOpen} setRevisions={setRevisions} />}
      </Container>
    </>
  )
}

export default DocumentRevisions
