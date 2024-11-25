import { Stack, Box, Button, Divider, CircularProgress, Snackbar } from '@mui/material'
import React, { useEffect, useState } from 'react'
import AddIcon from '@mui/icons-material/Add';
import Calibrations from './Calibrations';
import PreviewCalibration from './PreviewCalibration';
import Form from './Form';
import useCalibrations from '../../hooks/useCalibration';
import Alert from '../Alert';


function CalibrationPanel({ isMobile, selectedCalibration, setSelectedCalibration, instrument }) {
    const {
        data: calibrations,
        mutateDeleteCalibration,
        isDeletingCalibration,
        mutateCriation,
        isLoadingCreation,
        mutateEdit,
        isLoadingEdit,
        mutateAddCertificate,
        isLoadingAddCertificate,
        mutateDeleteCertificate,
        isLoadingDeleteCertificate,
        isSuccessEdit,
        isSuccessCreate,
        isSuccessDelete,
        isSuccesAddCertificate,
        isSuccesDeleteCertificate,
        isErrorAddCertificate,
        isErrorDeleteCertificate,
        isErrorCreate,
        isErrorDelete,
        isErrorEdit,
        refetch
    } = useCalibrations(null, instrument)
    const [openAlert, setOpenAlert] = useState({ open: false, msg: '', color: 'success' })
    const [openForm, setOpenForm] = useState(false);
    const handleOpenForm = () => setOpenForm(true);
    const handleCloseForm = () => setOpenForm(false);
    const handleOpenAlert = (msg, color) => setOpenAlert({ open: true, msg, color, });
    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenAlert({ open: false, msg: '', color: 'success' })
    }
    useEffect(() => {
        const alerts = [
            { condition: isSuccessCreate, message: 'Calibração criada com sucesso!', type: 'success' },
            { condition: isSuccessEdit, message: 'Calibração editada com sucesso!', type: 'success' },
            { condition: isSuccessDelete, message: 'Calibração deletada com sucesso!', type: 'success' },
            { condition: isSuccesAddCertificate, message: 'Certificado adicionado com sucesso!', type: 'success' },
            { condition: isSuccesDeleteCertificate, message: 'Certificado removido com sucesso!', type: 'success' },
            { condition: isErrorCreate, message: 'Erro ao criar calibração, verifique se preencheu os campos necessários e tente novamente!', type: 'error' },
            { condition: isErrorEdit, message: 'Erro ao editar calibração, verifique se preencheu os campos necessários e tente novamente!', type: 'error' },
            { condition: isErrorAddCertificate, message: 'Erro ao adicionar certificado. Tente novamente.', type: 'error' },
            { condition: isErrorDeleteCertificate, message: 'Erro ao remover certificado. Tente novamente.', type: 'error' },
            { condition: isErrorDelete, message: 'Erro ao deletar calibração. Tente novamente.', type: 'error' }
        ];

        const alert = alerts.find(alert => alert.condition);
        if (alert) {
            handleOpenAlert(alert.message, alert.type);
        }
    }, [
        isSuccessCreate, isSuccessEdit, isSuccessDelete,
        isSuccesAddCertificate, isSuccesDeleteCertificate,
        isErrorCreate, isErrorEdit, isErrorAddCertificate,
        isErrorDeleteCertificate, isErrorDelete
    ]);

    const calibration = selectedCalibration !== null && calibrations?.length && calibrations[selectedCalibration]

    return (
        <Stack flexDirection={isMobile ? 'column' : 'row'} width="100%" gap={2} divider={<Divider orientation={isMobile ? "horizontal" : "vertical"} flexItem />} justifyContent='space-between'>
            <Box sx={{ display: 'flex', flexDirection: 'column', width: isMobile ? '100%' : '50%', gap: 2 }}>
                <Stack flexDirection='row' gap={1} >
                    {/* <TextField size='small' fullWidth={isMobile} value={search} onChange={(e) => setSearch(e?.target?.value)} placeholder='Pesquise uma OS' /> */}
                    <Button startIcon={<AddIcon />} variant='contained' onClick={handleOpenForm}>calibração</Button>
                    <Form
                        isMobile={isMobile}
                        open={openForm}
                        handleClose={handleCloseForm}
                        create
                        mutate={mutateCriation}
                        isErrorCreate={isErrorCreate}
                        isSuccessCreate={isSuccessCreate}
                        isSuccessEdit={isSuccessEdit}
                        isErrorEdit={isErrorEdit}
                    />
                </Stack>
                {isLoadingCreation ? <CircularProgress /> : <Calibrations calibrations={calibrations} isMobile={isMobile} selectedCalibration={selectedCalibration} setSelectedCalibration={setSelectedCalibration} />}
            </Box>
            <PreviewCalibration
                mutateEdit={mutateEdit}
                isLoadingEdit={isLoadingEdit}
                isMobile={isMobile}
                deleteCalibration={mutateDeleteCalibration}
                isDeleting={isDeletingCalibration}
                calibration={calibration}
                mutateAddCertificate={mutateAddCertificate}
                isLoadingAddCertificate={isLoadingAddCertificate}
                mutateDeleteCertificate={mutateDeleteCertificate}
                isLoadingDeleteCertificate={isLoadingDeleteCertificate}
                refetch={refetch}
            />
            <Snackbar
                open={openAlert?.open}
                autoHideDuration={2000}
                onClose={handleCloseAlert}
            >
                <div>
                    <Alert onClose={handleCloseAlert} severity={openAlert?.color}>{openAlert?.msg}</Alert>
                </div>
            </Snackbar>

        </Stack>
    )
}

export default CalibrationPanel