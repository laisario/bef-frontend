import { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Container, Grid, Typography } from '@mui/material';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './styles.css'

import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import "@cyntler/react-doc-viewer/dist/index.css";

import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import useDocumentos from '../../hooks/useDocumentos';
import FormCreateRevision from '../../components/admin/documents/FormCreateRevision';
import InformationCard from '../../components/admin/documents/InformationCard';
import RevisionCard from '../../components/admin/documents/RevisionCard';

function DocumentsDetails() {
  const { id, idRevisao } = useParams();
  const [swiper, setSwiper] = useState(null)
  const { data, status, statusColor, openFormRevision, setOpenFormRevision, isLoading } = useDocumentos(id);
  const url = !!data?.arquivo && new URL(`${data?.arquivo}`);
  const splittedUrl = url?.pathname?.split('.');
  const fileType = !!splittedUrl?.length && splittedUrl[splittedUrl.length - 1];
  const revisoes = data?.revisoes;
  const navigate = useNavigate();

  useEffect(() => {
    if (idRevisao && swiper && !!revisoes?.length) {
      const ids = revisoes?.map(revisao => revisao?.id)
      const index = ids.indexOf(Number(idRevisao))
      swiper.slideTo(index)
    }
  }, [idRevisao, swiper, revisoes])

  return (
    <>
      <Helmet>
        <title>Documento | B&F</title>
      </Helmet>
      <Container>
        <Grid container spacing={4}>
          {isLoading ? <Grid item xs={12} md={8} display="flex" justifyContent="center" alignItems="center"><CircularProgress /></Grid> :
            <Grid style={{ height: '750px' }} item xs={12} md={8}>
              <DocViewer config={{ header: { disableFileName: true, disableHeader: true } }} style={{ maxWidth: '100%', overflow: 'scroll' }} documents={[{ uri: data?.arquivo, fileType }]} pluginRenderers={DocViewerRenderers} language='pt-br' />
            </Grid>
          }
          <Grid item xs={12} md={4}>
            <InformationCard data={data} status={status} statusColor={statusColor} setOpenFormRevision={setOpenFormRevision} />
            {!!revisoes?.length &&
              <Box>
                <Box display="flex" flexDirection="row" justifyContent="space-between">
                  <Typography variant="h5" margin={2}>
                    Revisões
                  </Typography>
                  {revisoes?.length > 1 && (
                    <Button size='small' onClick={() => navigate(`/admin/documento/${id}/revisoes`)}>Ver todas</Button>
                  )}
                </Box>
                <Swiper
                  modules={[Navigation, Pagination]}
                  navigation
                  pagination={
                    { dynamicBullets: true, }
                  }
                  style={{ width: '100%' }}
                  spaceBetween={50}
                  slidesPerView={1}
                  onSlideChange={(swiper) => navigate(`/admin/documento/${id}/${revisoes[swiper?.activeIndex]?.id}`)}
                  onSwiper={(swiper) => setSwiper(swiper)}
                >
                  {revisoes.map(revisao => (<SwiperSlide key={revisao.id}>
                    <RevisionCard revisao={revisao} />
                  </SwiperSlide>))}
                </Swiper>
              </Box>
            }
          </Grid>
        </Grid>
        {openFormRevision && <FormCreateRevision idCreator={data?.criador?.id} open={openFormRevision} setOpen={setOpenFormRevision} />}
      </Container>
    </>
  )
}

export default DocumentsDetails