import React, { useState } from 'react'
import {
    Card,
    CardContent,
    CardActions,
    Box,
    Divider,
    CircularProgress,
    IconButton,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AttachmentIcon from '@mui/icons-material/Attachment';
import { fDate } from '../../utils/formatTime';
import ContentRow from '../ContentRowCard';
import ButtonTooltip from '../ButtonTooltip';
import { statusLabel, statusColor, analiseCriticaColor, analiseCriticaLabel } from '../../utils/calibration';
import Label from '../label';
import Form from './Form';
import FormCertificate from './FormCertificate';
import Attachment from '../Attachment';

function Calibration(props) {
    const { calibration,
        isMobile,
        isDeleting,
        deleteCalibration,
        mutateEdit,
        isLoadingEdit,
        mutateAddCertificate,
        isLoadingAddCertificate,
        mutateDeleteCertificate,
        isLoadingDeleteCertificate,
        refetch,
    } = props;

    const [openEdit, setOpenEdit] = useState(false)
    const [openCreate, setOpenCreate] = useState(false)
    const handleClose = () => setOpenEdit(false)
    const handleOpen = () => setOpenEdit(true)
    const handleCloseCertificate = () => setOpenCreate(false)
    const handleOpenCertificate = () => setOpenCreate(true)
    const handleDelete = () => deleteCalibration(calibration?.id)

    const deleteCertificate = (idCertificado) => {
        mutateDeleteCertificate({ id: calibration?.id, idCertificado, })
    }

    return (
        <Card sx={{
            bgcolor: 'background.default',
            width: '100%',
            maxHeight: '350px',
            overflow: "auto"
        }}>
            <CardContent sx={{ display: 'flex', gap: 2, justifyContent: "space-between", flexDirection: isMobile ? 'column' : 'row' }}>
                <Box width={(!calibration?.certificados?.length || isMobile) ? "100%" : "60%"}>
                    <CardActions sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        {isLoadingAddCertificate ? <CircularProgress /> : <ButtonTooltip title="Adicionar certificado" variant='filled' icon={<AddIcon />} action={handleOpenCertificate} />}
                        <FormCertificate
                            mutateAddCertificate={mutateAddCertificate}
                            open={openCreate}
                            handleClose={handleCloseCertificate}
                            calibration={calibration}
                            refetch={refetch}
                        />
                        {isLoadingEdit ? <CircularProgress /> : <ButtonTooltip title="Editar calibração" action={handleOpen} icon={<EditIcon />} />}
                        <Form mutate={mutateEdit} calibration={calibration} open={openEdit} isMobile={isMobile} handleClose={handleClose} />
                        {isDeleting ? <CircularProgress /> : <ButtonTooltip title="Apagar calibração" variant='filled' icon={<DeleteIcon />} action={handleDelete} />}
                    </CardActions>
                    {calibration?.ordem_de_servico && (
                        <ContentRow colorTitle='black' colorValue='black' title={calibration?.ordem_de_servico?.toUpperCase()} value={fDate(calibration?.data, "dd/MM/yyyy")} />
                    )}
                    {calibration?.local && (
                        <ContentRow title="Local" value={calibration?.local} />
                    )}
                    {calibration?.observacoes && (
                        <ContentRow isMobile title="Observações:" value={calibration?.observacoes} />
                    )}
                    {(calibration?.status)
                        && <ContentRow title="Resultado" colorTitle='black' my={1} value={<Label color={statusColor[calibration?.status]}>{statusLabel[calibration?.status]}</Label>} />
                    }

                    <ContentRow title="Maior erro" value={calibration?.maior_erro ? calibration?.maior_erro : "Não faz parte do cálculo"} />

                    <ContentRow title="Incerteza" value={calibration?.incerteza ? calibration?.incerteza : "Não faz parte do cálculo"} />
                    {calibration?.criterio_de_aceitacao && (
                        <ContentRow title="Critério de aceitação" value={calibration?.criterio_de_aceitacao} />
                    )}
                    {calibration?.referencia_do_criterio && (
                        <ContentRow title="Referência do critério" value={calibration?.referencia_do_criterio} />
                    )}

                    {(calibration?.analise_critica)
                        && <ContentRow title="Análise critica" colorTitle='black' my={1} value={<Label color={analiseCriticaColor[calibration?.analise_critica]}>{analiseCriticaLabel[calibration?.analise_critica]}</Label>} />
                    }
                    {calibration?.restricao_analise_critica && (
                        <ContentRow isMobile title="Restrição análise crítica:" value={calibration?.restricao_analise_critica} />
                    )}
                </Box>
                {!!calibration?.certificados?.length && <Divider orientation={"vertical"} flexItem />}
                {!!calibration?.certificados?.length && (
                    <Box
                        width={isMobile ? "100%" : "30%"}
                        height="100%"
                        gap={2}
                        display="flex"
                        flexDirection="column"
                    >
                        {isLoadingDeleteCertificate ? <CircularProgress /> : calibration?.certificados?.map((certificado, i) => (
                            <Box key={certificado?.id + i} sx={{ bgcolor: 'background.neutral', p: 2, borderRadius: 2 }}>
                                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                    {certificado?.numero && <ContentRow colorTitle='black' title="Certificado:" isMobile value={<Attachment url={certificado?.arquivo} content={certificado?.numero} />} />}
                                    <IconButton size='small' onClick={() => deleteCertificate(certificado?.id)}>
                                        <ClearIcon />
                                    </IconButton>
                                </Box>
                                {(certificado?.anexos?.map(({ anexo, id }, index) => (
                                    <ContentRow my={0} key={id + index} title={`Anexo ${index + 1}`} value={<Attachment url={anexo} content={<AttachmentIcon fontSize='small' />} />} />
                                )))}
                            </Box>
                        ))}
                    </Box>)}
            </CardContent>
        </Card>
    )
}

export default Calibration