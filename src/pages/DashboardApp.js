import { Helmet } from 'react-helmet-async';
// @mui
import { Grid, Container, CircularProgress } from '@mui/material';
import useInstrumentos from '../hooks/useInstrumentos';
import useOrders from '../hooks/useOrders';
// sections
import { AppNewsInstruments, AppOrderTimeline, AppWidgetSummary } from '../sections/@dashboard/app';
import { isExpired } from '../utils/formatTime';
import useDocumentos from '../hooks/useDocumentos';

// ----------------------------------------------------------------------

export default function DashboardApp({admin}) {
  const { todosInstrumentos, instrumentosCalibrados, instrumentosVencidos, isLoading } = useInstrumentos();
  const { data, propostasEmAnalise } = useOrders();
  const { documentosVencidos } = useDocumentos()
  return (
    <>
      <Helmet>
        <title>B&F</title>
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

            {admin
              ? (<Grid item xs={12} sm={6} md={3}>
                <AppWidgetSummary
                  title="Documentos vencidos"
                  total={documentosVencidos?.length || 0}
                  color="info"
                  icon={'mdi:file-document-alert-outline'}
                />
              </Grid>)
              : (<Grid item xs={12} sm={6} md={3}>
                <AppWidgetSummary
                  title="Instrumentos cadastrados"
                  total={todosInstrumentos?.length || 0}
                  color="info"
                  icon={'fluent-mdl2:total'}
                />
              </Grid>
            )}


            <Grid item xs={12} sm={6} md={3}>
              <AppWidgetSummary
                title={admin ? "Pedidos esperando análise" : "Pedidos em analise"}
                total={propostasEmAnalise?.length}
                color="warning"
                icon={'ant-design:file-sync-outlined'}
              />
            </Grid>

            <Grid item xs={12} md={7} lg={8}>
              <AppNewsInstruments
                title={admin ? "Instrumentos clientes mais recentes" : "Instrumentos mais recentes"}
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
                admin
              />
            </Grid>

            <Grid item xs={12} md={5} lg={4}>
              <AppOrderTimeline
                title="Pedidos mais recentes"
                list={data?.results?.slice(0, 5)?.map((proposta) => ({
                  id: proposta?.id,
                  title: `Pedido ${proposta?.id}`,
                  status: proposta?.status,
                  time: new Date(proposta?.data_criacao),
                }))}
              />
            </Grid>

            <Grid item xs={12} md={5} lg={4}>
              <h1>Documentos para serem analisados</h1>
            </Grid>
          </Grid>
        )}
      </Container>
    </>
  );
}
