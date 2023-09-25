import { useEffect, useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
// @mui
import { Link, Box, Stack, IconButton, InputAdornment, TextField, Checkbox, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

import Iconify from '../../../../components/iconify';
import { useAuth } from '../../../../context/Auth';
import useCNPJ, { validarCNPJ, formatCNPJ } from '../../../../hooks/useCNPJ'
import { validarCPF, formatCPF } from '../../../../hooks/useCPF'

// ----------------------------------------------------------------------

export default function AddressInformation() {
    const navigate = useNavigate();
    const [tipo, setTipo] = useState("E")
    const [CNPJ, setCNPJ] = useState("")
    const [razaoSocial, setRazaoSocial] = useState("")
    const [IE, setIE] = useState("")
    const [CPF, setCPF] = useState("")
    const [nome, setNome] = useState("")
    const [telefone, setTelefone] = useState("")
    const { login, loading } = useAuth()

    const [error, setError] = useState(null)
    const cnpjResult = useCNPJ(CNPJ)
    console.log(cnpjResult)

    const handleSubmit = async (e) => {
        e.preventDefault()

    };

    return (
        <form onSubmit={handleSubmit}>
            <FormControl sx={{ width: '100%', gap: 3, mb: 4 }}>
                <TextField fullWidth error={!!CNPJ?.length >= 14 && !validarCNPJ(CNPJ)} name="CNPJ" label="CNPJ" placeholder='Digite o CNPJ da empresa' value={CNPJ} onChange={(e) => { if (error) { setError(null) } setCNPJ(e.target.value) }} />
                {validarCNPJ(CNPJ) && <>
                    <TextField fullWidth name="razaoSocial" label="Razao Social" value={cnpjResult?.razaoSocial || razaoSocial} onChange={(e) => { if (error) { setError(null) } setRazaoSocial(e.target.value) }} />
                    <TextField fullWidth name="IE" label="Inscricao Estadual" value={cnpjResult?.inscricaoEstadual || IE} onChange={(e) => { if (error) { setError(null) } setIE(e.target.value) }} />
                </>}
            </FormControl>

            <Box display="flex" alignItems="center" justifyContent="space-between" mt={4}>
                <Typography variant="body2">
                    Ja tem uma conta? {''}
                    <Link to="/login" component={RouterLink} variant="subtitle2" sx={{ textDecoration: 'none', cursor: 'pointer' }}>Entrar</Link>
                </Typography>
                <LoadingButton endIcon={<Iconify icon={'eva:arrow-ios-forward-fill'} />} loading={loading} sx={{ maxWidth: '45%' }} type="submit" fullWidth size="large" variant="contained" onClick={handleSubmit}>
                    Continuar
                </LoadingButton>
            </Box>
        </form>
    );
}
