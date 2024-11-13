import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Chip, Container, Divider, Paper, Stack, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import { Helmet } from 'react-helmet-async';
import { useTheme } from '@emotion/react';
import { fDate } from '../utils/formatTime';
import useInstrumentos from '../hooks/useInstrumentos';
import CalibracaoCard from '../components/instrumentos/CalibracaoCard';
import useResponsive from '../hooks/useResponsive';
import { positionLabels, colorPositionInstrument, localLabels } from '../utils/instruments';
import ContentRow from '../components/ContentRowCard';

function InstrumentDetails() {
  const { id } = useParams();
  const theme = useTheme();
  const { todosInstrumentos: instrumento, mutateCriticalAnalisys, isLoadingCriticalAnalisys, isSuccessCriticalAnalisys } = useInstrumentos(id);
  const isMobile = useResponsive('down', 'md');

  const modelo = instrumento?.instrumento?.tipo_de_instrumento?.modelo
  const fabricante = instrumento?.instrumento?.tipo_de_instrumento?.fabricante
  
  return (
    <>
      <Helmet>
        <title> Instrumento | Kometro </title>
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
        <Paper sx={{ padding: 4 }}>
          <Stack flexDirection={isMobile ? 'column' : 'row'} gap={2} divider={<Divider orientation={isMobile ? "horizontal" : "vertical"} flexItem />} justifyContent='space-between'>
            <Box width="100%">
              {(!!instrumento?.instrumento?.tipo_de_instrumento?.descricao || !!modelo) && <ContentRow title={instrumento?.instrumento.tipo_de_instrumento.descricao} value={!!modelo && modelo} />}
              {!!fabricante && <ContentRow title="Fabricante" value={fabricante} />}
              {(instrumento?.instrumento?.minimo || instrumento?.instrumento?.maximo)
                && <ContentRow title="Faixa de medição" value={`${instrumento?.instrumento?.minimo} ${!!instrumento?.instrumento?.maximo && `- ${instrumento?.instrumento?.maximo}`} ${instrumento?.instrumento?.unidade}`} />}
              {!!instrumento?.instrumento?.tipo_de_instrumento?.resolucao && <ContentRow title="Resolução" value={instrumento?.instrumento?.tipo_de_instrumento?.resolucao} />}
              {!!instrumento?.laboratorio && <ContentRow title="Laboratório" value={instrumento?.laboratorio} />}
              {instrumento?.local && <ContentRow title="Local" value={localLabels[instrumento?.local]} />}
              {instrumento?.dias_uteis && <ContentRow title="Dias úteis" value={instrumento?.dias_uteis} />}
            </Box>
            <Box width="100%">
              {!!instrumento?.instrumento?.procedimento_relacionado?.codigo && <ContentRow title="Procedimento relacionado" value={instrumento?.instrumento?.procedimento_relacionado?.codigo} />}
              {!!instrumento?.instrumento?.capacidade_de_medicao?.valor && <ContentRow title="Capacidade de medição" value={`${instrumento?.instrumento?.capacidade_de_medicao?.valor} ${instrumento?.instrumento?.capacidade_de_medicao?.unidade}`} />}
              {!!instrumento?.data_ultima_calibracao && <ContentRow title="Última calibração" value={fDate(instrumento?.data_ultima_calibracao, "dd/MM/yy")} />}
              {!!instrumento?.data_proxima_calibracao && <ContentRow title="Próxima calibração" value={fDate(instrumento?.data_proxima_calibracao, "dd/MM/yy")} />}
              {!!instrumento?.data_proxima_checagem && <ContentRow title="Próxima checagem" value={fDate(instrumento?.data_proxima_checagem, "dd/MM/yy")} />}
              {!!instrumento?.frequencia && <ContentRow title="Frequência" value={`${instrumento?.frequencia} ${+(instrumento?.frequencia) > 1 ? 'meses' : 'mês'}`} />}
              {!!instrumento?.pontos_de_calibracao?.length && <ContentRow title="Pontos de calibração:" isMobile value={instrumento?.pontos_de_calibracao?.map(({ nome }) => nome).join(", ")} />}
            </Box>
            <Box display="flex" gap={1} flexDirection={isMobile ? 'row' : "column"} justifyContent="flex-start">
              <Chip
                label={positionLabels[instrumento?.posicao]}
                color={colorPositionInstrument[instrumento?.posicao]}
                variant="filled"
                sx={{ color: theme.palette.common.white }}
              />
              <Chip
                label={instrumento?.instrumento?.tipo_de_servico === 'A' ? 'Acreditado' : 'Não acreditado'}
                variant="filled"
                color={instrumento?.instrumento?.tipo_de_servico === 'A' ? 'info' : 'primary'}
                sx={{ color: theme.palette.common.white }}
              />
            </Box>
          </Stack>
          {!!instrumento?.calibracoes?.length && (
            <>
              <Typography variant="h6" my={2}>
                Calibrações
              </Typography>
              <Box display="flex" gap={2} sx={{ overflowX: 'auto' }} width="100%">
                {instrumento?.calibracoes?.map(
                  (calibracao, i) => (
                    <CalibracaoCard
                      calibracao={calibracao}
                      mutateCriticalAnalisys={mutateCriticalAnalisys}
                      isLoadingCriticalAnalisys={isLoadingCriticalAnalisys}
                      isSuccessCriticalAnalisys={isSuccessCriticalAnalisys}
                      theme={theme}
                      isMobile={isMobile}
                      key={calibracao?.id + i}
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
