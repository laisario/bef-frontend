import { Helmet } from 'react-helmet-async';
// @mui
import { Grid, Container, CircularProgress } from '@mui/material';
import useInstrumentos from '../hooks/useInstrumentos';
import useOrders from '../hooks/useOrders';
// sections
import { AppNewsUpdate, AppOrderTimeline, AppWidgetSummary } from '../sections/@dashboard/app';
import { isExpired } from '../utils/formatTime';

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const { todosInstrumentos, instrumentosCalibrados, instrumentosVencidos, isLoading } = useInstrumentos();
  const { data, pedidosEmAnalise } = useOrders();

  return (
    <>
      <Helmet>
        <title> B&F </title>
      </Helmet>

      <Container maxWidth="xl">
        {isLoading ? (
          <Grid container item height="70vh" justifyContent="center" alignItems="center" spacing={3}>
            <CircularProgress size="96px" />
          </Grid>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <AppWidgetSummary
                title="Instrumentos vencidos"
                color="error"
                total={instrumentosVencidos?.length}
                icon={'ant-design:close-outlined'}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <AppWidgetSummary
                title="Instrumentos calibrados"
                color="success"
                total={instrumentosCalibrados?.length || 0}
                icon={'ant-design:check-outlined'}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <AppWidgetSummary
                title="Instrumentos cadastrados"
                total={todosInstrumentos?.length || 0}
                color="info"
                icon={'fluent-mdl2:total'}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <AppWidgetSummary
                title="Pedidos em analise"
                total={pedidosEmAnalise?.length}
                color="warning"
                icon={'ant-design:file-sync-outlined'}
              />
            </Grid>

            <Grid item xs={12} md={7} lg={8}>
              <AppNewsUpdate
                title="Instrumentos"
                list={todosInstrumentos?.slice(0, 5)?.map((instrumento) => ({
                  isExpired: isExpired(
                    instrumento?.data_ultima_calibracao,
                    instrumento?.instrumento?.tipo_de_instrumento?.frequencia
                  ),
                  tag: instrumento?.tag,
                  fabricante: instrumento?.instrumento.tipo_de_instrumento?.fabricante,
                  modelo: instrumento?.instrumento?.tipo_de_instrumento?.modelo,
                  faixaNominalMin: instrumento?.instrumento?.minimo,
                  faixaNominalMax: instrumento?.instrumento?.maximo,
                  unidade: instrumento?.instrumento?.unidade,
                  data: isExpired(
                    instrumento?.data_ultima_calibracao,
                    instrumento?.instrumento?.tipo_de_instrumento?.frequencia
                  )
                    ? instrumento?.data_ultima_calibracao
                    : instrumento?.data_proxima_calibracao,
                }))}
              />
            </Grid>

            <Grid item xs={12} md={5} lg={4}>
              <AppOrderTimeline
                title="Pedidos"
                list={data?.slice(0, 5)?.map((proposta) => ({
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
