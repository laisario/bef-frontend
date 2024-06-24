import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Chip, Container, Grid, Paper, Stack, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import { Helmet } from 'react-helmet-async';
import { useTheme } from '@emotion/react';
import { fDate } from '../utils/formatTime';
import useInstrumentos from '../hooks/useInstrumentos';
import CalibracaoCard from '../components/instrumentos/CalibracaoCard';

const posicaoInstrumento = {
  U: 'Em uso',
  E: 'Em estoque',
  I: 'Inativo',
  F: 'Fora de uso',
};

const colorPosicaoInstrumento = {
  U: 'success',
  E: 'secondary',
  I: 'info',
  F: 'warning',
};

function InstrumentDetails() {
  const { id } = useParams();
  const { todosInstrumentos: instrumento } = useInstrumentos(id);
  const theme = useTheme();
  const unidades = instrumento?.instrumento?.unidades;
  return (
    <>
      <Helmet>
        <title> Instrumento | B&F </title>
      </Helmet>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Box direction="column">
            {!!instrumento?.tag &&
              <Typography variant="h4" gutterBottom>
                {instrumento?.tag}
              </Typography>
            }
            {!!instrumento?.numero_de_serie &&
              <Typography variant="h6" gutterBottom>
                {instrumento?.numero_de_serie}
              </Typography>
            }
          </Box>
        </Stack>
        <Paper sx={{ padding: 4, backgroundColor: theme.palette.background.neutral }}>
          <Grid container flexDirection="row" justifyContent="space-between">
            <Box>
              {!!instrumento?.instrumento?.tipo_de_instrumento?.descricao &&
                <Typography variant="h6">{instrumento?.instrumento.tipo_de_instrumento.descricao}</Typography>
              }
              {(instrumento?.instrumento?.minimo || instrumento?.instrumento?.maximo) && <Typography variant="OVERLINE TEXT" marginY="2px" fontWeight="500">
                Faixa de medição: {instrumento?.instrumento?.minimo} {!!instrumento?.instrumento?.maximo && `/ ${instrumento?.instrumento?.maximo}`}
              </Typography>}
              {!!unidades?.length && <Typography>{unidades?.length > 1 ? "Unidades: " : "Unidade: "} {unidades.map(({ unidade }) => `${unidade} `)}</Typography>}
              {!!instrumento?.data_ultima_calibracao && <Typography variant="subtitle1" fontWeight="500">
                Última calibração: {fDate(instrumento?.data_ultima_calibracao)}
              </Typography>}
              {!!instrumento?.instrumento?.tipo_de_instrumento?.modelo && <Typography variant="subtitle1" fontWeight="500">
                Modelo: {instrumento?.instrumento?.tipo_de_instrumento?.modelo}
              </Typography>}
              {!!instrumento?.instrumento?.tipo_de_instrumento?.fabricante && <Typography variant="subtitle1" fontWeight="500">
                Fabricante: {instrumento?.instrumento?.tipo_de_instrumento?.fabricante}
              </Typography>}
              {!!instrumento?.frequencia && <Typography variant="subtitle1" fontWeight="500">
                Frequência: {instrumento?.frequencia} {+(instrumento?.frequencia) > 1 ? 'meses' : 'mês'}
              </Typography>}
              {!!instrumento?.instrumento?.tipo_de_instrumento?.resolução && <Typography variant="subtitle1" fontWeight="500">
                Resolução: {instrumento?.instrumento?.tipo_de_instrumento?.resolução}
              </Typography>}
              {!!instrumento?.laboratorio && <Typography variant="subtitle1" fontWeight="500">
                Laboratório: {instrumento?.laboratorio}
              </Typography>}
              {!!instrumento?.instrumento?.procedimento_relacionado && <Typography variant="subtitle1" fontWeight="500">
                Procedimento relacionado: {instrumento?.instrumento?.procedimento_relacionado.codigo}
              </Typography>}
            </Box>
            <Box display="flex" gap={1} flexDirection="column">
              <Chip
                label={posicaoInstrumento[instrumento?.posicao]}
                color={colorPosicaoInstrumento[instrumento?.posicao]}
                variant="outlined"
                sx={{backgroundColor: theme.palette.background.default}}
              />
              <Chip
                label={instrumento?.instrumento?.tipo_de_servico === 'A' ? 'Acreditado' : 'Não acreditado'}
                variant="outlined"
                color={instrumento?.instrumento?.tipo_de_servico === 'A' ? 'info' : 'primary'}
                sx={{backgroundColor: theme.palette.background.default}}
              />
            </Box>
          </Grid>
          {!!instrumento?.calibracoes?.length && (
            <>
              <Typography variant="h6" my={2}>
                Calibrações
              </Typography>
              <Box display="flex" gap={3} sx={{ overflowX: 'auto' }} width="100%">
                {instrumento?.calibracoes?.map(
                  (
                    {
                      certificado,
                      criterio_de_aceitacao: criterioDeAceitacao,
                      incerteza,
                      local,
                      maior_erro: maiorErro,
                      numero_do_certificado: numeroDoCertificado,
                      observacoes,
                      ordem_de_servico: ordemDeServico,
                      referencia_do_criterio: referenciaDoCriterio,
                      status,
                      data,
                      id,
                      analise_critica: analiseCritica,
                      restricao_analise_critica: restricaoAnaliseCritica,
                    },
                    index
                  ) => (
                    <CalibracaoCard
                      calibracao={{
                        certificado,
                        criterioDeAceitacao,
                        incerteza,
                        local,
                        maiorErro,
                        numeroDoCertificado,
                        observacoes,
                        ordemDeServico,
                        referenciaDoCriterio,
                        status,
                        data,
                        id,
                        analiseCritica,
                        restricaoAnaliseCritica
                      }}
                      key={index}
                      specialCases={{
                        criterioDeAceitacao: 'Critério de aceitação',
                        maiorErro: 'Maior Erro',
                        numeroDoCertificado: 'Número do certificado',
                        observacoes: 'Observações',
                        ordemDeServico: 'Ordem de serviço',
                        referenciaDoCriterio: 'Referência do critério',
                      }}
                      titles={[
                        'criterioDeAceitacao',
                        'referenciaDoCriterio',
                        'incerteza',
                        'maiorErro',
                        'ordemDeServico',
                        'local',
                        'observacoes',
                        'numeroDoCertificado',
                      ]}
                    />
                  )
                )}
              </Box>
            </>
          )}
          {!!instrumento?.observacoes && (
            <>
              <Typography my={2} variant="h6">
                Observação
              </Typography>
              <Card sx={{ padding: 2, my: 2, backgroundColor: theme.palette.background.neutral }}>
                <Typography>{instrumento?.observacoes}</Typography>
              </Card>
            </>
          )}
        </Paper>
      </Container>
    </>
  );
}

export default InstrumentDetails;
