import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
// @mui
import { Grid, Container, CircularProgress } from '@mui/material';
// sections
import { AppOrderTimeline, AppWidgetSummary, AppListItems } from '../sections/@dashboard/app';
import { useAuth } from '../context/Auth';
import { axios } from '../api';

// ----------------------------------------------------------------------

export default function DashboardApp() {
  const [data, setData] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    (async () => {
      const response = await axios.get('/dashboard')
      setData(response?.data)
    })()
  }, [])

  const instrumentos = data?.instrumentos_recentes?.map((instrumento) => ({
    id: instrumento?.id,
    isExpired: instrumento.expirado,
    descricao: instrumento?.instrumento?.tipo_de_instrumento?.descricao,
    tag: instrumento?.tag,
    fabricante: instrumento?.instrumento.tipo_de_instrumento?.fabricante,
    modelo: instrumento?.instrumento?.tipo_de_instrumento?.modelo,
    faixaNominalMin: instrumento?.instrumento?.minimo,
    faixaNominalMax: instrumento?.instrumento?.maximo,
    unidade: instrumento?.instrumento?.unidade,
    data: instrumento.expirado
      ? instrumento?.data_ultima_calibracao
      : instrumento?.data_proxima_calibracao,
  }))

  const documentos = data?.revisoes_a_serem_aprovadas

  return (
    <>
      <Helmet>
        <title>Kometro</title>
      </Helmet>

      <Container maxWidth="xl">
        {!data ? (
          <Grid container item height="70vh" justifyContent="center" alignItems="center" spacing={3}>
            <CircularProgress size="96px" />
          </Grid>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <AppWidgetSummary
                title="Instrumentos vencidos"
                color="error"
                total={data?.instrumentos_vencidos || 0}
                icon={'ant-design:close-outlined'}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <AppWidgetSummary
                title="Instrumentos calibrados em dia"
                color="success"
                total={data?.instrumentos_em_dia || 0}
                icon={'ant-design:check-outlined'}
              />
            </Grid>

            {user?.admin
              ? (<Grid item xs={12} sm={6} md={3}>
                <AppWidgetSummary
                  title="Documentos vencidos"
                  total={data?.documentos_vencidos || 0}
                  color="info"
                  icon={'mdi:file-document-alert-outline'}
                />
              </Grid>)
              : (<Grid item xs={12} sm={6} md={3}>
                <AppWidgetSummary
                  title="Instrumentos cadastrados"
                  total={data?.instrumentos_cadastrados || 0}
                  color="info"
                  icon={'fluent-mdl2:total'}
                />
              </Grid>
              )}

            {user?.admin ? (
              <Grid item xs={12} sm={6} md={3}>
                <AppWidgetSummary
                  title="Propostas em elaboração"
                  total={data?.propostas_em_elaboracao || 0}
                  color="warning"
                  icon={'ant-design:file-sync-outlined'}
                />
              </Grid>
            ) : (
              <Grid item xs={12} sm={6} md={3}>
                <AppWidgetSummary
                  title="Propostas aguardando aprovação"
                  total={data?.propostas_aguardando_aprovacao || 0}
                  color="warning"
                  icon={'ant-design:file-sync-outlined'}
                />
              </Grid>
            )}

            <Grid item xs={12} md={7} lg={8}>
              <AppListItems
                title={user?.admin ? "Revisões a serem aprovadas" : "Instrumentos recentes"}
                list={user?.admin ? documentos : instrumentos}
                document={user?.admin}
              />
            </Grid>

            <Grid item xs={12} md={5} lg={4}>
              <AppOrderTimeline
                title="Últimas propostas"
                list={data?.ultimas_propostas?.map((proposta) => ({
                  id: proposta?.id,
                  title: `Proposta ${proposta?.numero}`,
                  status: proposta?.status,
                  time: new Date(proposta?.data_criacao),
                  url: user?.admin ? `/admin/proposta/${proposta?.id}` : `/dashboard/proposta/${proposta?.id}`,
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
