import React from 'react'
import { Helmet } from 'react-helmet-async';
import { Container, Grid, Stack, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import RevisionCard from '../../components/admin/documents/RevisionCard';

function DocumentRevisions() {
  const { state } = useLocation()
  const revisoes = state?.data?.revisoes
  const user = state?.data?.user
  const titulo = state?.data?.titulo
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
        </Stack>
        <Grid container spacing={2}>
          {revisoes?.map((revisao) => (
            <Grid item key={revisao?.id} xs={12} sm={6}>
              <RevisionCard revisao={revisao} key={revisao.id} user={user} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  )
}

export default DocumentRevisions
