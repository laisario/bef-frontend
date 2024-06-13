import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { CircularProgress, FormControl, FormControlLabel, FormLabel, Grid, InputLabel, MenuItem, Radio, RadioGroup, Select } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { useWatch } from 'react-hook-form';
import useProcedimentos from '../../../hooks/useProcedimentos';
import useUsers from '../../../hooks/useUsers';
import useDocumentos from '../../../hooks/useDocumentos';
import { axios, axiosForFiles } from '../../../api';

export default function FormCreate({ open, setOpen, form }) {
    const [loading, setIsLoading] = useState(false);
    const { data: procedimentos } = useProcedimentos()
    const { data: users } = useUsers();
    const { refetch } = useDocumentos()


    const handleClose = () => {
        form.reset()
        setOpen(false);
    };

    const handleChange = (event) => {
        const { name, files } = event.target;
        if (name === 'arquivo') {
            form.setValue("arquivo", files[0]);
        }
    };

    const {
        status,
        codigo,
        identificador,
        titulo,
        dataRevisao,
        dataValidade,
        elaborador,
        frequencia,
        arquivo,
    } = useWatch({ control: form.control })

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
                                    codigo,
                                    identificador,
                                    titulo,
                                    status,
                                    data_revisao: dayjs(dataRevisao).format('YYYY-MM-DD'),
                                    data_validade: dayjs(dataValidade).format('YYYY-MM-DD'),
                                    criador: elaborador,
                                    frequencia,
                                });
                                if (response?.data?.id) {
                                    const formData = new FormData()
                                    formData.append("arquivo", arquivo)
                                    await axiosForFiles.patch(`/documentos/${response?.data?.id}/anexar/`, formData)
                                }
                                setIsLoading(false);
                                setOpen(false);
                                form.reset()
                                await refetch();
                                return { error: false };
                            } catch (err) {
                                setIsLoading(false);
                                return { error: err };
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
                                    {...form.register("codigo")}
                                    margin="dense"
                                    id="codigo"
                                    name="codigo"
                                    label="Código"
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
                                    {...form.register("identificador")}
                                    required
                                    margin="dense"
                                    id="identificador"
                                    name="identificador"
                                    label="Identificador"
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    autoFocus
                                    {...form.register("titulo")}
                                    required
                                    margin="dense"
                                    id="titulo"
                                    name="titulo"
                                    label="Título"
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <DatePicker
                                    {...form.register("dataRevisao")}
                                    label="Revisão"
                                    value={dataRevisao ? dayjs(dataRevisao) : null}
                                    onChange={newValue => form.setValue("dataRevisao", newValue)}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <DatePicker
                                    value={dataValidade ? dayjs(dataValidade) : null}
                                    {...form.register("dataValidade")}
                                    onChange={newValue => form.setValue("dataValidade", newValue)}
                                    label="Validade"
                                    fullWidth
                                />
                            </Grid>
                            <Grid item container alignItems="center" spacing={1}>
                                <Grid item xs={6} sm={8}>
                                    <FormControl fullWidth>
                                        <InputLabel id="elaborador">Elaborador</InputLabel>
                                        <Select
                                            autoFocus
                                            required
                                            {...form.register("elaborador")}
                                            value={elaborador}
                                            margin="dense"
                                            id="elaborador"
                                            name="elaborador"
                                            label="elaborador"
                                            fullWidth
                                        >
                                            {users?.map(({ username, id }) => (
                                                <MenuItem key={id} value={id}>
                                                    {username}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6} sm={4}>
                                    <TextField
                                        autoFocus
                                        id="frquencia"
                                        label="Frequencia (em anos)"
                                        name="frequencia"
                                        variant="outlined"
                                        type="number"
                                        {...form.register("frequencia")}
                                        fullWidth
                                        margin="dense"
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <FormControl sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2, mt: 2, mb: 2 }}>
                            <FormLabel id="status">Status: </FormLabel>
                            <RadioGroup row aria-labelledby="aprovacao">
                                <FormControlLabel
                                    value="V"
                                    control={
                                        <Radio
                                            checked={status === 'V'}
                                            {...form.register("status")}

                                        />
                                    }
                                    label="Vigente"
                                />
                                <FormControlLabel
                                    value="O"
                                    control={
                                        <Radio
                                            checked={status === 'O'}
                                            {...form.register("status")}
                                        />
                                    }
                                    label="Obsoleto"
                                />
                                <FormControlLabel
                                    value="C"
                                    control={
                                        <Radio
                                            checked={status === 'C'}
                                            {...form.register("status")}
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
                                {...form.register("arquivo")}
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
                                {loading ? <CircularProgress /> : <Button size="large" variant="contained" type="submit">Criar documento</Button>}
                            </Grid>
                        </Grid>
                    </DialogActions>
                </Dialog>
            </LocalizationProvider>
        </>
    );
}