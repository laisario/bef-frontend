import React, { useState } from 'react'
import {
    Accordion,
    AccordionActions,
    AccordionDetails,
    AccordionSummary,
    Box,
    Typography,
    CircularProgress,
    Tab,
    Button,
} from '@mui/material'
import { TabContext, TabList, TabPanel } from '@mui/lab';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditInstrument from '../EditInstrument';
import InstrumentInformation from './InstrumentInformation'
import CalibrationPanel from '../calibration/CalibrationPanel';


function ClientInstrumentInformation({ instrument, isMobile, mutateDelete, isDeleting, handleOpenAlert, mutateUpdate, isUpdatingInstrument }) {
    const [openFormEdit, setOpenFormEdit] = useState(false);
    const [selectedCalibration, setSelectedCalibration] = useState(null);
    const [valueTab, setValueTab] = useState('information');
    const handleCloseFormEdit = () => setOpenFormEdit(false);
    const handleOpenFormEdit = () => setOpenFormEdit(true);
    const handleChangeTab = (event, newValue) => setValueTab(newValue);

    return (
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${instrument?.id}-content`}
                id={`instrument-${instrument?.id}`}
            >
                <Box>
                    <Typography variant='body1'>
                        {instrument?.instrumento?.tipo_de_instrumento?.descricao}{instrument?.instrumento?.tipo_de_instrumento?.modelo && `, ${instrument?.instrumento?.tipo_de_instrumento?.modelo}`} {instrument?.instrumento?.tipo_de_instrumento?.fabricante && `- ${instrument?.instrumento?.tipo_de_instrumento?.fabricante}`}
                    </Typography>

                    {(instrument?.instrumento?.maximo || instrument?.instrumento?.minimo) && (
                        <Typography variant='body2' fontWeight="500">
                            {instrument?.instrumento?.maximo !== null ? `${instrument?.instrumento?.minimo} - ${instrument?.instrumento?.maximo}` : `${instrument?.instrumento?.minimo}`} {instrument?.instrumento?.unidade}
                        </Typography>
                    )}
                </Box>
            </AccordionSummary>
            <AccordionDetails>
                <TabContext sx={{ width: '100%' }} value={valueTab}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList onChange={handleChangeTab}>
                            <Tab label="Informações" value="information" />
                            <Tab label="Calibrações" value="calibration" />
                        </TabList>
                    </Box>
                    <TabPanel value="information" label="Informacao" >
                        <InstrumentInformation instrument={instrument} isMobile={isMobile} />
                    </TabPanel>
                    <TabPanel value="calibration" label="Calibracoes">
                        <CalibrationPanel
                            isMobile={isMobile}
                            selectedCalibration={selectedCalibration}
                            setSelectedCalibration={setSelectedCalibration}
                            instrument={instrument?.id}
                        />
                    </TabPanel>
                </TabContext>
            </AccordionDetails>
            <AccordionActions>
                <Button variant="outlined" onClick={handleOpenFormEdit} size="small" startIcon={<EditIcon />}>Editar instrumento</Button>
                <EditInstrument
                    handleOpenAlert={handleOpenAlert}
                    handleClose={handleCloseFormEdit}
                    open={openFormEdit}
                    instrument={instrument}
                    isMobile={isMobile}
                    mutate={mutateUpdate}
                    isLoading={isUpdatingInstrument}
                />
                {isDeleting ? <CircularProgress /> : <Button variant="contained" size="small" onClick={() => mutateDelete(instrument?.id)} endIcon={<DeleteForeverIcon />}>Excluir instrumento</Button>}
            </AccordionActions>
        </Accordion>
    )
}

export default ClientInstrumentInformation 