import React from 'react'
import { Box, Divider, Paper, Typography } from '@mui/material'
import ApartmentIcon from '@mui/icons-material/Apartment';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import useResponsive from '../../hooks/useResponsive';


function ClientInformation({data}) {
    const isMobile = useResponsive('down', 'md');
    return (
        <Paper sx={{ padding: 4, display: "flex", justifyContent: "space-between", flexDirection: isMobile ? 'column' : 'row' }}>
            <Box>
                <Typography variant='h6' sx={{mb: 2}}>
                    <ApartmentIcon/> Informações empresa
                </Typography>
                <Typography variant='body1' fontWeight="500">
                    <strong>Razão social:</strong> {data?.empresa?.razao_social}
                </Typography>
                <Typography variant='body1' fontWeight="500">
                    <strong>CNPJ:</strong> {data?.empresa?.cnpj}
                </Typography>
                <Typography variant='body1' fontWeight="500">
                    <strong>Filial:</strong> {data?.empresa?.filial}
                </Typography>
                {!data?.empresa?.isento && (
                    <Typography variant='body1' fontWeight="500">
                        <strong>Inscrição estadual:</strong> {data?.empresa?.ie}
                    </Typography>
                )}
            </Box>
            {(!!data?.nome || !!data?.telefone || !!data?.cpf) && (
                <>
                    <Divider orientation={isMobile ? "horizontal" : "vertical"} flexItem />
                    <Box sx={{ my: isMobile ? 1.5 : 0 }}>
                        <Typography variant='h6' sx={{mb: 2}}>
                            <ContactPhoneIcon /> Informações contato
                        </Typography>
                        {!!data?.nome && (
                            <Typography variant='body1' fontWeight="500">
                                {data?.nome}
                            </Typography>
                        )}
                        {!!data?.telefone && (
                            <Typography variant='body1' fontWeight="500">
                                <strong>Telefone:</strong> {data?.telefone}
                            </Typography>
                        )}
                        {!!data?.cpf && (
                            <Typography variant='body1' fontWeight="500">
                                <strong>CPF:</strong> {data?.cpf}
                            </Typography>
                        )}
                    </Box>
                </>
            )}
            <Divider orientation={isMobile ? "horizontal" : "vertical"} flexItem />
            <Box>
                <Typography variant='h6' sx={{mb: 2}}>
                    <AlternateEmailIcon /> Informações usuário
                </Typography>
                <Typography variant='body1' fontWeight="500">
                    <strong>Username:</strong> {data?.usuario?.username}
                </Typography>
                <Typography variant='body1' fontWeight="500">
                    <strong>Email:</strong> {data?.usuario?.email}
                </Typography>
            </Box>
        </Paper>
    )
}

export default ClientInformation