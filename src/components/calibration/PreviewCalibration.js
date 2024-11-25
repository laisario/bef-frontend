import React from 'react'
import { Box, Typography } from '@mui/material'
import Calibration from './Calibration'

function PreviewCalibration(props) {
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
        refetch
    } = props;

    return (
        <Box sx={{
            width: isMobile ? '100%' : '68%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            maxHeight: '450px',
            borderRadius: 4,
        }}>
            {!calibration
                ? <Typography color='grey' fontWeight={400} textAlign="center">Selecione uma calibração para visualizá-la</Typography>
                : <Calibration
                    refetch={refetch}
                    isMobile={isMobile}
                    calibration={calibration}
                    mutateEdit={mutateEdit}
                    isLoadingEdit={isLoadingEdit}
                    isDeleting={isDeleting}
                    deleteCalibration={deleteCalibration}
                    mutateAddCertificate={mutateAddCertificate}
                    isLoadingAddCertificate={isLoadingAddCertificate}
                    mutateDeleteCertificate={mutateDeleteCertificate}
                    isLoadingDeleteCertificate={isLoadingDeleteCertificate}
                />
            }
        </Box>
    )
}

export default PreviewCalibration