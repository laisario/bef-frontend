import { Box, Stack, Typography, Paper, Chip, Divider } from '@mui/material'
import React from 'react'
import ContentRow from '../ContentRowCard'
import { positionLabels, colorPositionInstrument, localLabels } from '../../utils/instruments';
import { fDate } from '../../utils/formatTime';


function InstrumentInformation({instrument, isMobile}) {
    return (
        <>
            <Stack direction={isMobile ? "column" : "row"} divider={<Divider orientation={isMobile ? "horizontal" : "vertical"} flexItem />} justifyContent="space-between">
                <Box sx={{ minWidth: "35%" }}>
                    {instrument?.tag && (
                        <ContentRow title="Tag" value={instrument?.tag} />
                    )}
                    {instrument?.numero_de_serie && (
                        <ContentRow title="Número de série" value={instrument?.numero_de_serie} />
                    )}
                    {instrument?.instrumento?.tipo_de_instrumento?.resolucao && (
                        <ContentRow title="Resolução" value={instrument?.instrumento?.tipo_de_instrumento?.resolucao} />
                    )}
                    {!!instrument?.instrumento?.capacidade_de_medicao?.valor && (
                        <ContentRow title="Capacidade de medição" value={`${instrument?.instrumento?.capacidade_de_medicao?.valor} ${instrument?.instrumento?.capacidade_de_medicao?.unidade}`} />
                    )}
                    {instrument?.instrumento?.procedimento_relacionado?.codigo && (
                        <ContentRow title="Procedimento relacionado" value={instrument?.instrumento?.procedimento_relacionado?.codigo} />
                    )}
                    {instrument?.dias_uteis && (
                        <ContentRow title="Dias úteis" value={instrument?.dias_uteis} />
                    )}
                    {!!instrument?.frequencia && (
                        <ContentRow title="Frequência" value={instrument?.frequencia > 1 ? `${instrument?.frequencia} meses` : `${instrument?.frequencia} mês`} />
                    )}
                    {instrument?.laboratorio && (
                        <ContentRow title="Laboratório" value={instrument?.laboratorio} />
                    )}
                    {instrument?.local && (
                        <ContentRow title="Local" value={localLabels[instrument?.local]} />
                    )}

                    {!!instrument?.pontos_de_calibracao?.length && (
                        <ContentRow title="Pontos de calibração:" isMobile={isMobile} value={instrument?.pontos_de_calibracao?.map(({ nome }) => nome).join(", ")} />)}
                </Box>
                {(instrument?.instrumento?.preco_calibracao_no_cliente
                    || instrument?.instrumento?.preco_calibracao_no_laboratorio
                    || instrument?.preco_alternativo_calibracao
                    || instrument?.data_proxima_calibracao
                    || instrument?.data_proxima_checagem
                    || instrument?.data_ultima_calibracao) &&
                    <Box sx={{ minWidth: "35%" }}>
                        {(instrument?.instrumento?.preco_calibracao_no_cliente || instrument?.instrumento?.preco_calibracao_no_laboratorio || instrument?.preco_alternativo_calibracao)
                            && <Typography fontWeight={700} mb={0.5}>Preços calibração:</Typography>}
                        {instrument?.instrumento?.preco_calibracao_no_cliente && (
                            <ContentRow title="Cliente" value={`R$ ${instrument?.instrumento?.preco_calibracao_no_cliente}`} />
                        )}
                        {instrument?.instrumento?.preco_calibracao_no_laboratorio && (
                            <ContentRow title="Laborátorio" value={`R$ ${instrument?.instrumento?.preco_calibracao_no_laboratorio}`} />
                        )}
                        {instrument?.preco_alternativo_calibracao && (
                            <ContentRow title="Alternativo" value={`R$ ${instrument?.preco_alternativo_calibracao}`} />
                        )}
                        {(instrument?.data_proxima_calibracao || instrument?.data_proxima_checagem || instrument?.data_ultima_calibracao) && <Typography fontWeight={700} my={0.5}>Datas:</Typography>}
                        {instrument?.data_proxima_calibracao && (
                            <ContentRow title="Próxima calibração" value={fDate(instrument?.data_proxima_calibracao, "dd/MM/yyyy")} />
                        )}
                        {instrument?.data_proxima_checagem && (
                            <ContentRow title="Próxima checagem" value={fDate(instrument?.data_proxima_checagem, "dd/MM/yyyy")} />
                        )}
                        {instrument?.data_ultima_calibracao && (
                            <ContentRow title="Última calibração" value={fDate(instrument?.data_ultima_calibracao, "dd/MM/yyyy")} />
                        )}

                    </Box>
                }
                <Box display="flex" flexDirection="column" sx={{ minWidth: "20%" }}>
                    {instrument?.instrumento?.tipo_de_servico && (
                        <Chip color="secondary" sx={{ mt: isMobile ? 1 : 0 }} label={instrument?.instrumento?.tipo_de_servico === "A" ? "Acreditado" : "Não acreditado"} />
                    )}
                    {instrument?.posicao && (
                        <Chip color={colorPositionInstrument[instrument?.posicao]} sx={{ mt: 0.5, color: '#ffffff' }} label={positionLabels[instrument?.posicao]} />
                    )}
                </Box>
            </Stack>
            {instrument?.observacoes && (
                <Paper square={false} variant='elevation' sx={{ backgroundColor: '#e5e5e5', p: 1, mt: 2, }}>
                    <Typography variant='body2'>Observações: <strong>{instrument?.observacoes}</strong></Typography>
                </Paper>
            )}
        </>
    )
}

export default InstrumentInformation