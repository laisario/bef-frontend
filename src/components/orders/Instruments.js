import { Box, Button, CircularProgress, IconButton, Typography } from '@mui/material'
import React, { useState } from 'react'
import AddIcon from '@mui/icons-material/Add';
import CardInformation from './CardInformation'
import FormAddInstrument from './FormAddInstrument';

function Instruments({ data, isMobile, admin, refetch, isLoading, removeInstrumentProposal, isRemoving }) {
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const addInstrument = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <Box>
            <Box display="flex" justifyContent='space-between' alignItems='center'>
                <Typography variant="h6" my={2}>
                    {data?.instrumentos.length > 1 ? "Instrumentos" : "Instrumento"}
                </Typography>
                {admin && (isMobile
                    ? (<IconButton onClick={addInstrument}>
                        <AddIcon />
                    </IconButton>)
                    : (<Button variant="contained" onClick={addInstrument} color="secondary" startIcon={<AddIcon />}>instrumento</Button>))}
            </Box>

            <FormAddInstrument
                open={open}
                handleClose={handleClose}
                idClient={data?.cliente?.id}
                proposalInstruments={data?.instrumentos?.map(({ id }) => id)}
                idProposal={data?.id}
                data={data}
                isLoading={isLoading}
                refetch={refetch}
                setLoading={setLoading}
            />

            {data?.instrumentos.length ?
                <Box display="flex"  justifyContent={(loading || isRemoving) ? 'center' : 'flex-start'} gap={3} sx={{ overflowX: 'auto' }} width="100%" size={{ xs: 12, md: 4 }}>
                    {(loading || isRemoving) ? <CircularProgress /> : data?.instrumentos?.map(
                        (instrument, index) => (
                            <CardInformation
                                instrument={instrument}
                                key={index}
                                isMobile={isMobile}
                                admin={admin}
                                removeInstrumentProposal={removeInstrumentProposal}
                            />
                        )
                    )}
                </Box>
                : <Typography textAlign="center" variant='h6'>Proposta sem instrumento, adicione um!</Typography>}
        </Box>
    )
}

export default Instruments