import { Helmet } from 'react-helmet-async';
// @mui
import { Grid, Container, CircularProgress } from '@mui/material';
import useInstrumentos from '../hooks/useInstrumentos';
import useOrders from '../hooks/useOrders';
// sections
import { AppOrderTimeline, AppWidgetSummary, AppListItems } from '../sections/@dashboard/app';
import { isExpired } from '../utils/formatTime';
import useDocumentos from '../hooks/useDocumentos';
import useRevision from '../hooks/useRevision';
import { useAuth } from '../context/Auth';

// ----------------------------------------------------------------------

export default function DashboardApp() {
  const { todosInstrumentos, instrumentosCalibrados, instrumentosVencidos, isLoading } = useInstrumentos();
  const { data, propostasEmAnalise, propostasAprovar } = useOrders();
  const { documentosVencidos } = useDocumentos();
  const { data: revisions } = useRevision();
  const { user: { admin } } = useAuth()
  const instrumentos = todosInstrumentos?.results?.slice(0, 5)?.map((instrumento) => ({
    id: instrumento?.id,
    isExpired: isExpired(
      instrumento?.data_ultima_calibracao,
      instrumento?.frequencia
    ),
    descricao: instrumento?.instrumento?.tipo_de_instrumento?.descricao,
    tag: instrumento?.tag,
    fabricante: instrumento?.instrumento.tipo_de_instrumento?.fabricante,
    modelo: instrumento?.instrumento?.tipo_de_instrumento?.modelo,
    faixaNominalMin: instrumento?.instrumento?.minimo,
    faixaNominalMax: instrumento?.instrumento?.maximo,
    unidade: instrumento?.instrumento?.unidades,
    data: isExpired(
      instrumento?.data_ultima_calibracao,
      instrumento?.frequencia
    )
      ? instrumento?.data_ultima_calibracao
      : instrumento?.data_proxima_calibracao,
  }))

  const documentos = revisions?.results

  return (
    <>
      <Helmet>
        <title>KOMETRO</title>
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
                title="Instrumentos calibrados em dia"
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

            {admin ? (
              <Grid item xs={12} sm={6} md={3}>
                <AppWidgetSummary
                  title="Propostas em elaboração"
                  total={propostasEmAnalise?.length}
                  color="warning"
                  icon={'ant-design:file-sync-outlined'}
                />
              </Grid>
            ) : (
              <Grid item xs={12} sm={6} md={3}>
                <AppWidgetSummary
                  title="Propostas aguardando aprovação"
                  total={propostasAprovar?.length}
                  color="warning"
                  icon={'ant-design:file-sync-outlined'}
                />
              </Grid>
            )}
            <Grid item xs={12} md={7} lg={8}>
              <AppListItems
                title={admin ? "Revisões a serem aprovadas" : "Instrumentos recentes"}
                list={admin ? documentos : instrumentos}
                document={admin}
              />
            </Grid>

            <Grid item xs={12} md={5} lg={4}>
              <AppOrderTimeline
                title="Últimas propostas"
                list={data?.results?.slice(0, 5)?.map((proposta) => ({
                  id: proposta?.id,
                  title: `Proposta ${proposta?.id}`,
                  status: proposta?.status,
                  time: new Date(proposta?.data_criacao),
                  url: admin ? `/admin/proposta/${proposta?.id}` : `/dashboard/proposta/${proposta?.id}`,
                  client: proposta?.cliente?.empresa?.razao_social || proposta?.cliente?.nome,
                }))}
              />
            </Grid>
          </Grid>
        )}
      </Container>
    </>
  );
}
