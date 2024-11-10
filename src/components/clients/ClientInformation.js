import React from 'react'
import { Box, Divider, Paper, Stack, Typography } from '@mui/material'
import ApartmentIcon from '@mui/icons-material/Apartment';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import PhoneIcon from '@mui/icons-material/Phone';
import BadgeIcon from '@mui/icons-material/Badge';
import HomeIcon from '@mui/icons-material/Home';
import EmailIcon from '@mui/icons-material/Email';

const Information = ({ icon, value }) => (
        <Stack alignItems="center" direction="row" gap={1}>
            {icon}
            <Typography variant='body1' fontWeight="500">
                {value}
            </Typography>
        </Stack>
    )


function ClientInformation({ data, isMobile }) {
    return (
        <Paper sx={{ padding: 4, display: "flex", justifyContent: "space-around", flexDirection: isMobile ? 'column' : 'row' }}>
            <Box>
                {!!data?.empresa?.cnpj && <Information value={data?.empresa?.cnpj} icon={<ApartmentIcon fontSize='small' />} />}
                {!data?.empresa?.isento && !!data?.empresa?.ie && (<Information value={data?.empresa?.ie} icon={<strong>IE</strong>} />)}
                {!!data?.usuario?.username && <Information value={data?.usuario?.username} icon={<EmailIcon fontSize='small' />}/>}
                {!!data?.telefone && <Information value={data?.telefone} icon={<PhoneIcon fontSize='small' />} />}
            </Box>

            {!isMobile && <Divider orientation="vertical" flexItem />}

            <Box>
                {!!data?.empresa?.filial && <Information value={data?.empresa?.filial} icon={<LocationCityIcon fontSize='small'/>} />}
                {!!data?.empresa?.nome_fantasia && <Information value={data?.empresa?.nome_fantasia} icon={<DriveFileRenameOutlineIcon fontSize='small'/>} />}
                {!!data?.cpf && (
                   <Information icon={<BadgeIcon fontSize='small' />} value={data?.cpf} />
                )}
                {!!data?.endereco?.logradouro && (<Information value={`${data?.endereco?.logradouro}, ${data?.endereco?.numero} - ${data?.endereco?.bairro?.nome}, ${data?.endereco?.bairro?.cidade?.nome} - ${data?.endereco?.bairro?.cidade?.uf?.sigla}`} icon={<HomeIcon fontSize='small' />} />)}
            </Box>
        </Paper>
    )
}

export default ClientInformation