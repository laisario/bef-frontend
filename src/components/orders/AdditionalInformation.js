import { Box, Card, Typography, useTheme } from '@mui/material'
import React from 'react'

function AdditionalInformation({data}) {
    const theme = useTheme();
    return (
        <Box>
            {!!data?.informacoes_adicionais && (
                <>
                    <Typography my={2} variant="h6">
                        Informações Adicionais
                    </Typography>
                    <Card sx={{ padding: 2, my: 2, backgroundColor: theme.palette.background.neutral }}>
                        <Typography>{data?.informacoes_adicionais}</Typography>
                    </Card>
                </>
            )}
        </Box>
    )
}

export default AdditionalInformation