import { Alert, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormLabel, Grid, TextField } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import { axios, axiosForFiles } from '../../api';
import useDocumentos from '../../hooks/useDocumentos';

function FormCreateRevision({ open, setOpen }) {
    const [form, setForm] = useState({
        arquivo: null,
        alteracao: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const { id } = useParams();
    const { refetch } = useDocumentos(id);
    const handleClose = () => setOpen(false);

    const handleChange = (event) => {
        const { name, value, files } = event.target;
        if (name === 'arquivo') {
            setForm((prevForm) => ({ ...prevForm, [name]: files[0] }));
        } else {
            setForm((prevForm) => ({ ...prevForm, [name]: value }));
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            PaperProps={{
                component: 'form',
                onSubmit: async (event) => {
                    event.preventDefault();
                    try {
                        setIsLoading(true);
                        const response = await axios.post(`/documentos/${id}/revisar/`, {
                            alteracao: form?.alteracao,
                        });
                        if (response?.data?.revisao_id) {
                            const formData = new FormData()
                            formData.append("arquivo", form?.arquivo)
                            await axiosForFiles.patch(`/documentos/${id}/alterar_anexo/`, formData)
                        }
                        setIsLoading(false);
                        handleClose()
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
            <DialogTitle>Revise o documento</DialogTitle>
            <DialogContent>
                <div>
                    <FormLabel id="alteracao">Alterações realizadas: </FormLabel>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="alteracao"
                        name="alteracao"
                        multiline
                        type="text"
                        fullWidth
                        variant="standard"
                        value={form.alteracao}
                        onChange={handleChange}
                    />
                </div>
                <Grid container spacing={2}>
                    <Grid item>
                        <FormLabel id="upload-btn">Documento alterado: </FormLabel>
                        <Button component="label" size="small" variant="contained" startIcon={<CloudUploadIcon />}>
                            Enviar arquivo
                            <input
                                style={{ display: 'none' }}
                                id="upload-btn"
                                name="arquivo"
                                type="file"
                                onChange={handleChange}
                            />
                        </Button>
                    </Grid>
                    {!!form.arquivo &&
                        <Grid item>
                            <Button
                                component="a"
                                size="small"
                                href={
                                    !!form?.arquivo && form?.arquivo instanceof File
                                        ? URL.createObjectURL(form?.arquivo)
                                        : form?.arquivo
                                }
                                target="_blank"
                                variant="outlined"
                            >
                                Ver arquivo
                            </Button>
                        </Grid>
                    }
                </Grid>
                {!!errMsg && <Alert severity="error">{errMsg}</Alert>}
                {isLoading && <CircularProgress />}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancelar</Button>
                <Button type="submit">Criar revisão</Button>
            </DialogActions>
        </Dialog>
    );
}

export default FormCreateRevision;