import React, { useState } from 'react'
import {
    Box,
    Button,
    Chip,
    Grid,
    IconButton,
    Tooltip,
    Typography,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import PreviewIcon from '@mui/icons-material/Preview';
import dayjs from 'dayjs';
import { capitalizeFirstLetter as CFL } from '../../utils/formatString';
import titleCase from '../../utils/formatTitle';
import FilesSelection from './FilesSelection';


const formaPagamento = {
    CD: 'Débito',
    CC: 'Crédito',
    P: 'Pix',
    D: 'Dinheiro',
    B: 'Boleto',
};

const statusMessages = {
    "E": 'Aguardando a resposta da Kometro',
    "AA": 'Aguardando sua aprovação',
    "A": 'Você aprovou a proposta',
    "R": 'VocÊ reprovou a proposta',
}

function InformationProposol({ data, isMobile, admin, statusColor, statusString }) {
    const [openAnexos, setOpenAnexos] = useState(false)
    const [openProposals, setOpenProposals] = useState(false)

    const handleCloseAnexo = () => {
        setOpenAnexos(false)
    }

    const handleCloseProposal = () => {
        setOpenProposals(false)
    }

    const handleOpenAnexos = () => setOpenAnexos(true)


    const handleOpenProposals = () => setOpenProposals(true)

    const mappedAnexos = data?.anexos?.map(({ anexo }) => ({url: anexo}))
    const mappedProposals = data?.revisoes?.map((rev) => ({ url: rev?.pdf, rev: rev?.rev }))

    return (
        <Grid container justifyContent="space-between" flexDirection={isMobile ? 'column-reverse' : 'row'}>
            <Box>
                {+(data?.total) > 0 &&
                    <Typography variant="h6">Total: R${data?.total}</Typography>
                }
                {!!data?.data_criacao && admin &&
                    <Typography variant="subtitle1" fontWeight="500">
                        Proposta criada: {dayjs(data?.data_criacao).locale('pt-BR').format('D [de] MMMM [de] YYYY')}
                    </Typography>
                }
                {!!data?.condicao_de_pagamento &&
                    <Typography variant="subtitle1" fontWeight="500">
                        Forma de pagamento: {formaPagamento[data?.condicao_de_pagamento]}
                    </Typography>
                }
                {!!data?.prazo_de_pagamento &&
                    <Typography variant="subtitle1" fontWeight="500">
                        Prazo de pagamento: {dayjs(data?.prazo_de_pagamento).locale('pt-BR').format('D [de] MMMM [de] YYYY')}
                    </Typography>
                }
                {!!data?.dias_uteis &&
                    <Typography variant="subtitle1" fontWeight="500">
                        Dias úteis entrega: {data?.dias_uteis > 1 ? `Em ${data?.dias_uteis} dias` : `Em ${data?.dias_uteis} dia`}
                    </Typography>
                }
                {!!data?.transporte &&
                    <Typography variant="subtitle1" fontWeight="500">
                        Transporte: {CFL(data?.transporte)}
                    </Typography>
                }
                {!!data?.endereco_de_entrega &&
                    <Typography variant="subtitle1" fontWeight="500">
                        Endereço de entrega: {data?.endereco_de_entrega?.logradouro}, {data?.endereco_de_entrega?.numero}
                        {!!data?.endereco_de_entrega?.complemento && `- ${data?.endereco_de_entrega?.complemento}`} - {data?.endereco_de_entrega?.bairro?.nome} - {data?.endereco_de_entrega?.cep}
                    </Typography>
                }
                {!!data?.responsavel?.username && (<Typography variant="subtitle1" fontWeight="500">Funcionário responsável: {titleCase(data?.responsavel?.username)}</Typography>)}
            </Box>
            <Box display="flex" flexDirection={isMobile ? "row" : "column"} gap={1}>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Tooltip title={statusMessages[data?.status]}>
                        <Chip
                            label={statusString[data?.status]}
                            color={statusColor[data?.status]}
                            variant="filled"
                            sx={{ color: '#fff' }}
                        />
                    </Tooltip>
                    {data?.data_aprovacao && data?.status !== "AA" && data?.status !== "E" && (
                        <Typography variant='overline' fontSize={10} color="grey.400" >Em {dayjs(data?.data_aprovacao).locale('pt-BR').format('DD/MM/YYYY')}</Typography>
                    )}
                </Box>
                <FilesSelection open={openAnexos} handleClose={handleCloseAnexo} arr={mappedAnexos} title={data?.anexos?.length > 1 ? 'Anexos' : 'Anexo'} />
                <FilesSelection open={openProposals} handleClose={handleCloseProposal} arr={mappedProposals} title={data?.revisoes?.length > 1 ? 'Propostas' : 'Proposta'} />
                {!!data?.revisoes?.length && <Tooltip placement="right-end" title="Clique para abrir pdf da proposta">
                    {isMobile ? (
                        <IconButton
                            target="_blank"
                            size="small"
                            onClick={handleOpenProposals}
                            color='secondary'
                        >
                            <PreviewIcon />
                        </IconButton>
                    ) : (
                        <Button
                            startIcon={<PreviewIcon />}
                            target="_blank"
                            onClick={handleOpenProposals}
                            color='secondary'
                            variant="outlined"
                        >
                            {data?.revisoes?.length > 1 ? 'Propostas' : 'Proposta'}
                        </Button>
                    )
                    }
                </Tooltip>}
                {!!data?.anexos?.length && (
                    <Tooltip placement="right-end" title="Clique para ver documento anexado">
                        {isMobile ? (
                            <IconButton onClick={handleOpenAnexos} color='secondary' aria-label="anexo" variant="contained">
                                <DownloadIcon />
                            </IconButton>
                        ) : (
                            <Button startIcon={<DownloadIcon />} onClick={handleOpenAnexos} target="_blank" color='secondary' variant="outlined">
                                {data?.anexos?.length > 1 ? 'Anexos' : 'Anexo'}
                            </Button>
                        )}
                    </Tooltip>
                )}
            </Box>
        </Grid >
    )
}

export default InformationProposol