import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Button, Chip, Container, Grid, Paper, Stack, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import { Helmet } from 'react-helmet-async';

import { useTheme } from '@emotion/react';
import Iconify from '../components/iconify';
import { fDateTime } from '../utils/formatTime';
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

function ProductDetailPage() {
  const { id } = useParams();
  const { todosInstrumentos: instrument, deleteInstrument } = useInstrumentos(id);
  const theme = useTheme();
  return (
    <>
      <Helmet>
        <title> Instrumento | B&F </title>
      </Helmet>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Box direction="column">
            <Typography variant="h4" gutterBottom>
              {instrument?.tag}
            </Typography>
            <Typography variant="h6" gutterBottom>
              {instrument?.numero_de_serie}
            </Typography>
          </Box>
          <Box>
            <Button color="info" onClick={() => deleteInstrument()}>
              <Iconify icon="eva:trash-2-fill" />
            </Button>
          </Box>
        </Stack>
        <Paper sx={{ padding: 4 }}>
          <Grid container flexDirection="row" justifyContent="space-between">
            <Box>
              <Typography variant="h6">{instrument?.instrumento.tipo_de_instrumento.descricao}</Typography>
              <Typography variant="OVERLINE TEXT" marginY="2px" fontWeight="500">
                Faixa de medição: {instrument?.instrumento.minimo} -{' '}
                {instrument?.instrumento.maximo}
                {instrument?.instrumento.unidade}
              </Typography>
              <Typography variant="subtitle1" fontWeight="500">
                Última calibração: {fDateTime(instrument?.data_ultima_calibracao)}
              </Typography>
              <Typography variant="subtitle1" fontWeight="500">
                Modelo: {instrument?.instrumento.tipo_de_instrumento.modelo}
              </Typography>
              <Typography variant="subtitle1" fontWeight="500">
                Fabricante: {instrument?.instrumento.tipo_de_instrumento.fabricante}
              </Typography>
              <Typography variant="subtitle1" fontWeight="500">
                Frequência: {instrument?.instrumento.tipo_de_instrumento.frequencia} dias
              </Typography>
              <Typography variant="subtitle1" fontWeight="500">
                Resolução: {instrument?.instrumento.tipo_de_instrumento.resolução}
              </Typography>
              <Typography variant="subtitle1" fontWeight="500">
                Laboratório: {instrument?.laboratorio}
              </Typography>
              <Typography variant="subtitle1" fontWeight="500">
                Procedimento relacionado: {instrument?.instrumento.procedimento_relacionado.procedimento}
              </Typography>
            </Box>
            <Box display="flex" gap={1} flexDirection="column">
              <Chip
                label={posicaoInstrumento[instrument?.posicao]}
                color={colorPosicaoInstrumento[instrument?.posicao]}
                variant="outlined"
              />
              <Chip
                label={instrument?.status?.nome}
                color={instrument?.status?.cor}
                variant="outlined"
              />
              <Chip
                label={instrument?.instrumento?.tipo_de_servico === 'A' ? 'Acreditado' : 'Não acreditado'}
                variant="outlined"
                color={instrument?.instrumento?.tipo_de_servico === 'A' ? 'info' : 'primary'}
              />
            </Box>
          </Grid>
          <Typography variant="h6" my={2}>
            Calibrações
          </Typography>
          <Box display="flex" gap={3} sx={{ overflowX: 'auto' }} width="100%">
            {instrument?.calibracoes?.map(
              (
                {
                  certificado,
                  criterio_de_aceitacao: criterioDeAceitacao,
                  incerteza,
                  local,
                  maior_erro: maiorErro,
                  numero_do_certificado: numeroDoCertificado,
                  observacoes,
                  orde_de_servico: ordemDeServico,
                  referencia_do_criterio: referenciaDoCriterio,
                  status,
                  data
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
                    data
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
          <Typography my={2} variant="h6">
            Observação
          </Typography>
          <Card sx={{ padding: 2, my: 2, backgroundColor: theme.palette.background.neutral }}>
            <Typography>{instrument?.observacoes}</Typography>
          </Card>
        </Paper>
      </Container>
    </>
  );
}

export default ProductDetailPage;