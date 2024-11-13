import { Box, Typography, useTheme } from '@mui/material'
import React from 'react'

function EmptyYet({ content, isMobile }) {
    const theme = useTheme()
    return (
        <Box
            width="100%"
            bgcolor={theme?.palette?.primary?.translucent}
            mt={8}
            border={`solid 2px ${theme?.palette?.primary?.translucent}`}
            borderRadius={isMobile ? 3 : 4} >
            <Typography
                padding={isMobile ? 8 : 20}
                textAlign="center" variant='h5'
                color={theme?.palette?.grey[5]}
                fontWeight={600}
            >
                {content.endsWith('a') ? `Nenhuma ${content} cadastrada ainda!` : `Nenhum ${content} cadastrado ainda!`}
            </Typography>
        </Box>
    )
}

export default EmptyYet