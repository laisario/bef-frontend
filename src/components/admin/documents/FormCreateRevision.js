import { Alert, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormLabel, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import { useForm, useWatch } from 'react-hook-form';
import useUsers from '../../../hooks/useUsers';
import { axios, axiosForFiles } from '../../../api';
import useDocumentos from '../../../hooks/useDocumentos';

function FormCreateRevision({ open, setOpen, idCreator }) {
    const [isLoading, setIsLoading] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const form = useForm({
        defaultValues: {
            arquivo: null,
            alteracao: '',
            aprovadores: []
        }
    })
    const {
        arquivo,
        alteracao,
        aprovadores
    } = useWatch({ control: form.control })
    const { data: users } = useUsers();
    const { id } = useParams();
    const { refetch } = useDocumentos(id);
    const handleClose = () => {
        setOpen(false);
        form.reset();
    }

    const handleChange = (event) => {
        const { name, files } = event.target;
        if (name === 'arquivo') {
            form.setValue("arquivo", files[0]);
        }
    };

    const usersWithoutCreator = users?.filter((user) => user.id !== idCreator)

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
                            alteracao,
                            aprovadores,
                        });
                        if (response?.data?.revisao_id) {
                            const formData = new FormData()
                            formData.append("arquivo", arquivo)
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
            <DialogContent sx={{display: 'flex', justifyContent: 'center', alignItems: "center", flexDirection: "column"}}>
                {isLoading
                    ? <CircularProgress />
                    : (<Grid container display="flex" flexDirection="column" spacing={2}>
                        <Grid item>
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
                                {...form.register("alteracao")}
                            />
                        </Grid>
                        <Grid item>
                            <FormLabel id="upload-btn">Documento alterado: </FormLabel>
                            <Button component="label" size="small" variant="contained" startIcon={<CloudUploadIcon />}>
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
                                    component="a"
                                    size="small"
                                    href={
                                        !!arquivo && arquivo instanceof File
                                            ? URL.createObjectURL(arquivo)
                                            : arquivo
                                    }
                                    target="_blank"
                                    variant="outlined"
                                >
                                    Ver arquivo
                                </Button>
                            }
                        </Grid>
                        <Grid item>
                            <FormControl fullWidth>
                                <InputLabel id="aprovadores">Aprovadores</InputLabel>
                                <Select
                                    autoFocus
                                    required
                                    multiple
                                    {...form.register("aprovadores")}
                                    value={aprovadores}
                                    margin="dense"
                                    id="aprovadores"
                                    name="aprovadores"
                                    label="Aprovadores"
                                    fullWidth
                                >
                                    {usersWithoutCreator?.map(({ username, id }) => (
                                        <MenuItem key={id} value={id}>
                                            {username}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>)
                }
                {!!errMsg && <Alert severity="error">{errMsg}</Alert>}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancelar</Button>
                {!isLoading && <Button type="submit">Criar revisão</Button>}
            </DialogActions>
        </Dialog>
    );
}

export default FormCreateRevision;