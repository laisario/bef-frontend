import { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Container, Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './styles.css'
import DocViewer, { PDFRenderer } from "@cyntler/react-doc-viewer";
import "@cyntler/react-doc-viewer/dist/index.css";
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import useDocumentos from '../../hooks/useDocumentos';
import FormCreateRevision from '../../components/admin/documents/FormCreateRevision';
import InformationCard from '../../components/admin/documents/InformationCard';
import RevisionCard from '../../components/admin/documents/RevisionCard';
import MSDocRenderer from '../renderers/MSDocRenderer';
import GoogleRenderer from '../renderers/GoogleRenderer';
import { useAuth } from '../../context/Auth';

const StyledDocViewer = styled(DocViewer)(() => ({
  overflow: 'auto',
  '#pdf-controls': {
    backgroundColor: "rgba(255, 217, 194, 0.8)",
    width: '160px',
    zIndex: 3,
    justifyContent: 'center',
    borderRadius: '0 0 8px 0'
  },
}))

const StyledSwiper = styled(Swiper)`
  width: 100%;
  .swiper-button-next {
    color: #FD7622;
  };
  .swiper-button-prev {
    color: #FD7622;
  };
  .swiper-pagination-bullet-active {
    background: #FD7622;
  }
`;

function DocumentsDetails() {
  const { id, idRevisao } = useParams();
  const [swiper, setSwiper] = useState(null)
  const {
    data,
    status,
    statusColor,
    openFormRevision,
    setOpenFormRevision,
    isLoading,
    mutateCreateRevision,
    isCreatingRevision,
    isSuccessCreateRevision,
    isErrorCreateRevision,
    errorCreateRevision,
  } = useDocumentos(id);
  const { user } = useAuth()
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
        <title>Documento | Kometro</title>
      </Helmet>
      <Container>
        <Grid container spacing={4}>
          {isLoading ? <Grid item xs={12} md={8} display="flex" justifyContent="center" alignItems="center"><CircularProgress /></Grid> :
            <Grid style={{ height: '800px' }} item xs={12} md={8}>
              <StyledDocViewer
                config={{ header: { disableFileName: true, disableHeader: true } }}
                documents={[{ uri: data?.arquivo, fileType }]}
                pluginRenderers={[PDFRenderer, MSDocRenderer, GoogleRenderer]}
                language='pt-br'
              />
            </Grid>
          }
          <Grid item xs={12} md={4}>
            <InformationCard data={data} status={status} statusColor={statusColor} setOpenFormRevision={setOpenFormRevision} user={user} />
            {!!revisoes?.length &&
              <Box>
                <Box display="flex" flexDirection="row" justifyContent="space-between">
                  <Typography variant="h5" margin={2}>
                    Revisões
                  </Typography>
                  {revisoes?.length > 1 && (
                    <Button size='small' onClick={() => navigate(`/admin/documento/${id}/revisoes`, { state: { data: { revisoes, user, titulo: data?.titulo } } })}>Ver todas</Button>
                  )}
                </Box>
                <StyledSwiper
                  modules={[Navigation, Pagination]}
                  navigation
                  pagination={
                    { dynamicBullets: true, }
                  }
                  spaceBetween={50}
                  slidesPerView={1}
                  onSlideChange={(swiper) => navigate(`/admin/documento/${id}/${revisoes[swiper?.activeIndex]?.id}`)}
                  onSwiper={(swiper) => setSwiper(swiper)}
                >
                  {revisoes.map(revisao => (<SwiperSlide key={revisao.id}>
                    <RevisionCard revisao={revisao} user={user} />
                  </SwiperSlide>))}
                </StyledSwiper>
              </Box>
            }
          </Grid>
        </Grid>
        <FormCreateRevision
          idCreator={data?.criador?.id}
          open={openFormRevision}
          mutateCreateRevision={mutateCreateRevision}
          setOpen={setOpenFormRevision}
          isSuccessCreateRevision={isSuccessCreateRevision}
          isErrorCreateRevision={isErrorCreateRevision}
          errorCreateRevision={errorCreateRevision}
          isCreatingRevision={isCreatingRevision}
        />
      </Container>
    </>
  )
}

export default DocumentsDetails