import React from 'react'
import { Box, Button, CircularProgress, Container, Grid, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import FileViewer from 'react-file-viewer'
import { useNavigate, useParams } from 'react-router-dom';
import useDocumentos from '../../hooks/useDocumentos';
import ExcelViewer from '../../components/drivers/ExcelViewer';
import FormCreateRevision from '../../components/admin/documents/FormCreateRevision';
import InformationCard from '../../components/admin/documents/InformationCard';
import RevisionCard from '../../components/admin/documents/RevisionCard';

function DocumentsDetails() {
  const { id } = useParams();
  const { data, status, statusColor, openFormRevision, setOpenFormRevision, isLoading } = useDocumentos(id);
  const url = !!data?.arquivo && new URL(`${data?.arquivo}`);
  const splittedUrl = url?.pathname?.split('.');
  const fileType = !!splittedUrl?.length && splittedUrl[splittedUrl.length - 1];
  const revisoes = data?.revisoes;
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Pedido | B&F</title>
      </Helmet>
      <Container>
        <Grid container spacing={4}>
          {isLoading ? <Grid item xs={12} md={8} display="flex" justifyContent="center" alignItems="center"><CircularProgress /></Grid> :
            <Grid style={{ height: '750px' }} item xs={12} md={8}>
              {fileType === 'xlsx' || fileType === 'xlsm'
                ? <ExcelViewer />
                : <FileViewer className="pg-viewer" filePath={data?.arquivo} fileType={fileType} onError={(e) => console.log("erro:", e)} />
              }
            </Grid>
          }
          <Grid item xs={12} md={4}>
            <InformationCard data={data} status={status} statusColor={statusColor} setOpenFormRevision={setOpenFormRevision} />
            {!!revisoes?.length &&
              <Box>
                <Box display="flex" flexDirection="row" justifyContent="space-between">
                  <Typography variant="h5" margin={2}>
                    Última revisão
                  </Typography>
                  <Button size='small' onClick={() => navigate(`/admin/documento/${id}/revisoes`)}>Ver todas</Button>
                </Box>
                <RevisionCard revisao={revisoes[revisoes.length - 1]} />
              </Box>
            }
          </Grid>
        </Grid>
        {openFormRevision && <FormCreateRevision idCreator={data?.criador}  open={openFormRevision} setOpen={setOpenFormRevision} />}
      </Container>
    </>
  )
}

export default DocumentsDetails