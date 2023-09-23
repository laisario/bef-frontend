import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography, CircularProgress } from '@mui/material';
import useInstrumentos from '../hooks/useInstrumentos';
import usePropostas from '../hooks/usePropostas';
// components
// sections
import {
  AppTasks,
  AppNewsUpdate,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppWidgetSummary,
  AppCurrentSubject,
  AppConversionRates,
} from '../sections/@dashboard/app';
import { isExpired } from '../utils/formatTime';
import { useAuth } from '../context/Auth';

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const { todosInstrumentos, instrumentosCalibrados, instrumentosVencidos, isLoading } = useInstrumentos()
  const { todasPropostas } = usePropostas()

  return (
    <>
      <Helmet>
        <title> Dashboard | Minimal UI </title>
      </Helmet>

      <Container maxWidth="xl">
        {isLoading ? (
          <Grid container item height="70vh" justifyContent="center" alignItems="center" spacing={3}>
            <CircularProgress size="96px" />
          </Grid>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <AppWidgetSummary title="Instrumentos vencidos" color="error" total={instrumentosVencidos?.length} icon={'ant-design:close-outlined'} />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <AppWidgetSummary title="Instrumentos calibrados" color="success" total={instrumentosCalibrados?.length || 0} icon={'ant-design:check-outlined'} />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <AppWidgetSummary title="Instrumentos cadastrados" total={todosInstrumentos?.length || 0} color="info" icon={'fluent-mdl2:total'} />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <AppWidgetSummary title="Pedidos em analise" total={0} color="warning" icon={'ant-design:file-sync-outlined'} />
            </Grid>

            <Grid item xs={12} md={7} lg={8}>
              <AppNewsUpdate
                title="Instrumentos"
                list={todosInstrumentos?.slice(0, 5)?.map((instrumento, index) => ({
                  isExpired: isExpired(instrumento.data_ultima_calibracao, instrumento.frequencia),
                  tag: instrumento?.tag,
                  fabricante: instrumento?.fabricante,
                  modelo: instrumento?.modelo,
                  faixaNominalMin: instrumento?.faixa_nominal,
                  faixaNominalMax: instrumento?.faixa_nominal,
                  unidade: instrumento?.unidade,
                  data: isExpired(instrumento.data_ultima_calibracao, instrumento.frequencia) ? instrumento?.data_ultima_calibracao : instrumento?.data_proxima_calibracao
                }))}
              />
            </Grid>

            <Grid item xs={12} md={5} lg={4}>
              <AppOrderTimeline
                title="Pedidos"
                list={todasPropostas?.slice(0, 5)?.map((proposta, index) => ({
                  id: proposta?.id,
                  title: `Pedido ${proposta?.id}`,
                  status: proposta?.status,
                  time: new Date(proposta?.data_criacao),
                }))}
              />
            </Grid>
          </Grid>
        )}
      </Container>
    </>
  );
}
