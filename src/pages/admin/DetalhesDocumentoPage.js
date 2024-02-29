import React, { useState } from 'react'
import { Box, Button, Card, CardActions, CardContent, Chip, Container, Grid, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import FileViewer from 'react-file-viewer'
import './styles.css'
import { useParams } from 'react-router-dom';
import useDocumentos from '../../hooks/useDocumentos';
import ExcelViewer from '../../components/drivers/ExcelViewer';
import FormCreateRevision from '../../components/admin/FormCreateRevision';
import DocInformationCard from '../../components/admin/DocInformationCard';
import RevisionCard from '../../components/admin/RevisionCard';

function DetalhesDocumentoPage() {
  const { id } = useParams();
  const { data, status, statusColor } = useDocumentos(id);
  const [openFormRevision, setOpenFormRevision] = useState(false);
  const fileType = data?.arquivo?.split('.')[1];
  const revisoes = data?.revisoes;
  return (
    <>
      <Helmet>
        <title>Pedido | B&F</title>
      </Helmet>
      <Container>
        <Grid container spacing={4}>
          <Grid style={{ height: '750px' }} item xs={12} md={8}>
            {fileType === 'xlsx' || fileType === 'xlsm'
              ? <ExcelViewer />
              : <FileViewer className="pg-viewer" filePath={data?.arquivo} fileType={fileType} onError={(e) => console.log("erro:", e)} />
            }
          </Grid>
          <Grid item xs={12} md={4}>
            <DocInformationCard data={data} status={status} statusColor={statusColor} setOpenFormRevision={setOpenFormRevision} />
            {!!revisoes?.length &&
              <Box>
                <Typography variant="h5" margin={2}>
                  Revisões
                </Typography>
                {revisoes?.map((revisao) => <RevisionCard revisao={revisao} />)}
              </Box>
            }
          </Grid>
        </Grid>
        {openFormRevision && <FormCreateRevision open={openFormRevision} setOpen={setOpenFormRevision} />}
      </Container>
    </>
  )
}

export default DetalhesDocumentoPage