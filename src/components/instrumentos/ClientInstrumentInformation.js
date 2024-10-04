import React from 'react'
import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { fDate } from '../../utils/formatTime';

function ClientInstrumentInformation({ instrument, localLabels, positionLabels }) {
    return (
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${instrument?.id}-content`}
                id={`instrument-${instrument?.id}`}
            >
                <Box>
                    <Typography variant='body1'>
                        {`${instrument?.instrumento?.tipo_de_instrumento?.descricao} `}
                    </Typography>
                    {(instrument?.instrumento?.maximo || instrument?.instrumento?.minimo) && (
                        <Typography variant='body2' fontWeight="500">
                            {instrument?.instrumento?.maximo !== null ? `${instrument?.instrumento?.minimo} - ${instrument?.instrumento?.maximo}` : `${instrument?.instrumento?.minimo}`}
                            {'   '}
                            {instrument?.instrumento?.unidade}
                        </Typography>
                    )}
                </Box>
            </AccordionSummary>
            <AccordionDetails>
                {instrument?.tag && (
                    <Typography>Tag: {instrument?.tag} </Typography>
                )}
                {instrument?.instrumento?.tipo_de_instrumento?.fabricante && (
                    <Typography>Fabricante: {instrument?.instrumento?.tipo_de_instrumento?.fabricante}</Typography>
                )}
                {instrument?.instrumento?.tipo_de_instrumento?.modelo && (
                    <Typography>Modelo: {instrument?.instrumento?.tipo_de_instrumento?.modelo}</Typography>
                )}
                {instrument?.instrumento?.tipo_de_instrumento?.resolucao && (
                    <Typography>Resolução: {instrument?.instrumento?.tipo_de_instrumento?.resolucao}</Typography>
                )}
                {instrument?.numero_de_serie && (
                    <Typography>Número de série: {instrument?.numero_de_serie} </Typography>
                )}
                {instrument?.instrumento?.capacidade_de_medicao?.valor && (
                    <Typography>Capacidade de medição: {instrument?.instrumento?.capacidade_de_medicao?.valor} {instrument?.instrumento?.capacidade_de_medicao?.unidade} </Typography>
                )}
                {instrument?.instrumento?.preco_calibracao_no_cliente && (
                    <Typography>Preço calibração cliente: {instrument?.instrumento?.preco_calibracao_no_cliente} </Typography>
                )}
                {instrument?.instrumento?.preco_calibracao_no_laboratorio && (
                    <Typography>Preço calibração laborátorio: {instrument?.instrumento?.preco_calibracao_no_laboratorio} </Typography>
                )}
                {instrument?.instrumento?.procedimento_relacionado?.codigo && (
                    <Typography>Procedimento relacionado: {instrument?.instrumento?.procedimento_relacionado?.codigo} </Typography>
                )}
                {instrument?.preco_alternativo_calibracao && (
                    <Typography>Preço alternativo calibração: {instrument?.preco_alternativo_calibracao} </Typography>
                )}
                {instrument?.instrumento?.tipo_de_servico && (
                    <Typography>Tipo de serviço: {instrument?.instrumento?.tipo_de_servico === "A" ? "Acreditado" : "Não acreditado"} </Typography>
                )}
                {instrument?.data_proxima_calibracao && (
                    <Typography>Próxima calibração: {fDate(instrument?.data_proxima_calibracao)} </Typography>
                )}
                {instrument?.data_proxima_checagem && (
                    <Typography>Próxima checagem: {fDate(instrument?.data_proxima_checagem)} </Typography>
                )}
                {instrument?.data_ultima_calibracao && (
                    <Typography>Última calibração: {fDate(instrument?.data_ultima_calibracao)} </Typography>
                )}
                {instrument?.prazo_de_entrega && (
                    <Typography>Prazo de entrega: {fDate(instrument?.prazo_de_entrega)} </Typography>
                )}
                {instrument?.laboratorio && (
                    <Typography>Laboratório: {instrument?.laboratorio} </Typography>
                )}
                {instrument?.dias_uteis && (
                    <Typography>Dias úteis: {instrument?.dias_uteis} </Typography>
                )}
                {instrument?.frequencia && (
                    <Typography>Frequência: {instrument?.frequencia > 1 ? `${instrument?.frequencia} meses` : `${instrument?.frequencia} mês`} </Typography>
                )}
                {instrument?.laboratorio && (
                    <Typography>Laboratório: {instrument?.laboratorio} </Typography>
                )}
                {instrument?.local && (
                    <Typography>Local: {localLabels[instrument?.local]} </Typography>
                )}
                {instrument?.posicao && (
                    <Typography>Posição: {positionLabels[instrument?.posicao]} </Typography>
                )}
                {instrument?.observacoes && (
                    <Typography>Observações: {instrument?.observacoes} </Typography>
                )}
            </AccordionDetails>
        </Accordion>
    )
}

export default ClientInstrumentInformation