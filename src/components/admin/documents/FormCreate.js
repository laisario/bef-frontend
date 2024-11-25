import { useEffect } from 'react';
import {
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Alert,
    CircularProgress,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid,
    InputLabel,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    Typography
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { useForm, useWatch } from 'react-hook-form';
import useProcedimentos from '../../../hooks/useProcedimentos';
import useUsers from '../../../hooks/useUsers';


const erroMessages = {
    "status": 'Selecione um status para o documento.',
    "data_revisao": "Preencha a data de revisão.",
    "data_validade": "Preencha a data de validade.",
    "arquivo": "Faça upload de um arquivo válido.",
}

export default function FormCreate({ open, setOpen, mutateCreate, isErrorCreate, errorCreate, isCreating, isSuccessCreate }) {
    const { data: procedimentos } = useProcedimentos();
    const { data: users } = useUsers();
    const form = useForm({
        defaultValues: {
            codigo: '',
            identificador: '',
            titulo: '',
            status: '',
            elaborador: '',
            frequencia: null,
            arquivo: null,
            dataValidade: '',
            dataRevisao: '',
        }
    })

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


    useEffect(() => {
        if (isSuccessCreate) {
            form.reset()
            setOpen(false);
        } 
    }, [isSuccessCreate])



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
                                mutateCreate({
                                    codigo,
                                    identificador,
                                    titulo,
                                    status,
                                    data_revisao: dayjs(dataRevisao).format('YYYY-MM-DD') || null,
                                    data_validade: dayjs(dataValidade).format('YYYY-MM-DD' || null),
                                    criador: elaborador,
                                    frequencia,
                                    arquivo,
                                });
                                return { error: false };

                            } catch (err) {
                                console.log(err)
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
                                        required
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
                        {!!arquivo &&
                            <Button
                                size="small"
                                href={
                                    !!arquivo && arquivo instanceof File
                                        ? URL.createObjectURL(arquivo)
                                        : arquivo
                                }
                                target="_blank"
                                component="a"
                                variant="outlined"
                                sx={{ marginLeft: 1 }}
                            >
                                Ver arquivo
                            </Button>
                        }
                        <Typography variant='body2' fontSize={12} color="primary">Formatos dísponiveis: PDF, XLSX, XLSM, DOCX, DOC, PPTX, PPT</Typography>
                        {isErrorCreate && Object.keys(errorCreate?.response?.data)?.map((errKeys, i) => <Alert severity="error" key={i}>{erroMessages[errKeys]}</Alert>)}
                    </DialogContent>

                    <DialogActions>
                        <Grid container justifyContent="space-between">
                            <Grid item>
                                <Button onClick={handleClose}>Cancelar</Button>
                            </Grid>
                            <Grid item>
                                {isCreating ? <CircularProgress /> : <Button size="large" variant="contained" type="submit">Criar documento</Button>}
                            </Grid>
                        </Grid>
                    </DialogActions>
                </Dialog>
            </LocalizationProvider>
        </>
    );
}