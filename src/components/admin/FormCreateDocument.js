import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { CircularProgress, FormControl, FormControlLabel, FormLabel, Grid, MenuItem, Radio, RadioGroup } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import useProcedimentos from '../../hooks/useProcedimentos';
import useUsers from '../../hooks/useUsers';
import useDocumentos from '../../hooks/useDocumentos';
import {axios, axiosForFiles} from '../../api';

export default function FormCreateDocument({ open, setOpen }) {
    const [form, setForm] = useState({
        codigo: '',
        identificador: '',
        titulo: '',
        status: 'vigente',
        elaborador: '',
        frequencia: 0,
        analiseCritica: 0,
        arquivo: null,
    })
    const [errMsg, setErrMsg] = useState('');
    const [loading, setIsLoading] = useState(false);
    const [dataDeValidade, setDataDeValidade] = useState(null);
    const [dataDeRevisao, setDataDeRevisao] = useState(null);
    const { data: procedimentos } = useProcedimentos()
    const { data: users } = useUsers();
    const { refetch } = useDocumentos()


    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (event) => {
        const { name, value, files } = event.target;
        if (name === 'arquivo') {
            setForm((prevForm) => ({ ...prevForm, [name]: files[0] }));
        } else {
            setForm((prevForm) => ({ ...prevForm, [name]: value }));
        }
    }; 


    return (
        <>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                <Dialog
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                        component: 'form',
                        onSubmit: async (event) => {
                            event.preventDefault();
                            try {
                                setIsLoading(true);
                                const response = await axios.post('/documentos/', {
                                    codigo: form.codigo,
                                    identificador: form.identificador,
                                    titulo: form.titulo,
                                    status: form.status,
                                    data_revisao: dayjs(dataDeRevisao).format('YYYY-MM-DD'),
                                    data_validade: dayjs(dataDeValidade).format('YYYY-MM-DD'),
                                    elaborador: form.elaborador,
                                    frequencia: form.frequencia,
                                    analiseCritica: form.analiseCritica,
                                });
                                if (response?.data?.id) {
                                    const formData = new FormData()
                                    formData.append("arquivo", form?.arquivo)
                                    await axiosForFiles.patch(`/documentos/${response?.data?.id}/anexar/`, formData)
                                }
                                setIsLoading(false);
                                setOpen(false);
                                await refetch();
                                return { error: false };
                            } catch (err) {
                                setIsLoading(false);
                                setErrMsg(err.message);
                                return { error: true };
                            }
                        },
                    }}
                >
                    <DialogTitle>Criar novo documento</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2}>
                            <Grid item xs={4}>
                                <TextField
                                    autoFocus
                                    select
                                    required
                                    onChange={handleChange}
                                    margin="dense"
                                    id="codigo"
                                    value={form.codigo}
                                    name="codigo"
                                    label="Codigo"
                                    type="string"
                                    fullWidth
                                >
                                    {procedimentos?.map(({ codigo, id }) => (
                                        <MenuItem key={id} value={id}>
                                            {codigo}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={8}>
                                <TextField
                                    autoFocus
                                    value={form.identificador}
                                    required
                                    margin="dense"
                                    id="identificador"
                                    name="identificador"
                                    label="Identificador"
                                    type="string"
                                    onChange={handleChange}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    autoFocus
                                    value={form.titulo}
                                    required
                                    margin="dense"
                                    id="titulo"
                                    name="titulo"
                                    label="Titulo"
                                    type="string"
                                    fullWidth
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <DatePicker
                                    name="data_de_revisao"
                                    value={dataDeRevisao}
                                    label="Revisao"
                                    onChange={(data) => setDataDeRevisao(data)}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <DatePicker
                                    name="data_de_validade"
                                    value={dataDeValidade}
                                    label="Validade"
                                    onChange={(data) => setDataDeValidade(data)}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    autoFocus
                                    select
                                    required
                                    onChange={handleChange}
                                    margin="dense"
                                    id="elaborador"
                                    value={form.elaborador}
                                    name="elaborador"
                                    label="Elaborador"
                                    type="string"
                                    fullWidth
                                >
                                    {users?.map(({ username, id }) => (
                                        <MenuItem key={id} value={username}>
                                            {username}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    autoFocus
                                    id="frquencia"
                                    value={form.frequencia}
                                    label="Frequencia"
                                    name="frequencia"
                                    variant="outlined"
                                    type="number"
                                    onChange={handleChange}
                                    fullWidth
                                    margin="dense"
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    autoFocus
                                    required
                                    value={form.analiseCritica}
                                    margin="dense"
                                    id="analiseCritica"
                                    name="analiseCritica"
                                    label="Analise Critica"
                                    type="number"
                                    helperText="Em dias"
                                    onChange={handleChange}
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                        <FormControl sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2, mt: 2, mb: 2 }}>
                            <FormLabel id="status">Status: </FormLabel>
                            <RadioGroup row aria-labelledby="aprovacao">
                                <FormControlLabel
                                    value="V"
                                    control={
                                        <Radio
                                            checked={form.status === 'V'}
                                            onClick={() =>
                                                setForm((prevForm) => ({ ...prevForm, status: 'V' }))
                                            }
                                        />
                                    }
                                    label="Vigente"
                                />
                                <FormControlLabel
                                    value="O"
                                    control={
                                        <Radio
                                            checked={form.status === 'O'}
                                            onClick={() => setForm((prevForm) => ({ ...prevForm, status: 'O' }))}
                                        />
                                    }
                                    label="Obsoleto"
                                />
                                <FormControlLabel
                                    value="C"
                                    control={
                                        <Radio
                                            checked={form.status === 'C'}
                                            onClick={() => setForm((prevForm) => ({ ...prevForm, status: 'C' }))}
                                        />
                                    }
                                    label="Cancelado"
                                />
                            </RadioGroup>
                        </FormControl>
                        <FormLabel id="anexo" sx={{ mr: 2 }}>Anexo: </FormLabel>
                        <Button component="label" color="info" variant="contained" startIcon={<CloudUploadIcon />}>
                            Enviar arquivo
                            <input
                                style={{ display: 'none' }}
                                id="upload-btn"
                                name="arquivo"
                                type="file"
                                onChange={handleChange}
                            />
                        </Button>
                    </DialogContent>

                    <DialogActions>
                        <Grid container justifyContent="space-between">
                            <Grid item>
                                <Button onClick={handleClose}>Cancelar</Button>
                            </Grid>
                            <Grid item>
                               { loading ? <CircularProgress /> : <Button size="large" variant="contained" type="submit">Criar documento</Button>}
                            </Grid>
                        </Grid>
                    </DialogActions>
                </Dialog>
            </LocalizationProvider>
        </>
    );
}