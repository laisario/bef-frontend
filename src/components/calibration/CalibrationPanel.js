import { Stack, Box, TextField, Button, Divider, CircularProgress } from '@mui/material'
import React, { useState } from 'react'
import AddIcon from '@mui/icons-material/Add';
import Calibrations from './Calibrations';
import PreviewCalibration from './PreviewCalibration';
import Form from './Form';
import useCalibrations from '../../hooks/useCalibration';


function CalibrationPanel({ isMobile, selectedCalibration, setSelectedCalibration, instrument }) {
    const {
        data: calibrations,
        search,
        setSearch,
        mutateDeleteCalibration,
        isDeletingCalibration,
        mutateCriation,
        isLoadingCreation,
        errorCreating,
        isSuccessCreate,
        mutateEdit,
        isLoadingEdit,
        mutateAddCertificate,
        isLoadingAddCertificate,
        mutateDeleteCertificate,
        isLoadingDeleteCertificate,
    } = useCalibrations(null, instrument)

    const [openForm, setOpenForm] = useState(false);
    const handleOpenForm = () => setOpenForm(true);
    const handleCloseForm = () => setOpenForm(false);

    const calibration = selectedCalibration !== null && calibrations?.length && calibrations[selectedCalibration]

    return (
        <Stack flexDirection={isMobile ? 'column' : 'row'} gap={2} divider={<Divider orientation={isMobile ? "horizontal" : "vertical"} flexItem />} justifyContent='space-between'>
            <Box sx={{ display: 'flex', flexDirection: 'column', width: isMobile ? '100%' : '30%', gap: 2, alignItems: 'center' }}>
                <Stack flexDirection='row' gap={1} alignItems="center">
                    <TextField size='small' fullWidth={isMobile} value={search} onChange={(e) => setSearch(e?.target?.value)} placeholder='Pesquise uma OS' />
                    <Button startIcon={<AddIcon />} variant='contained' onClick={handleOpenForm}>calibração</Button>
                    <Form
                        isMobile={isMobile}
                        open={openForm}
                        handleClose={handleCloseForm}
                        create
                        mutateCriation={mutateCriation}
                        errorCreating={errorCreating}
                        isSuccessCreate={isSuccessCreate}
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
            />
        </Stack>
    )
}

export default CalibrationPanel