import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import React, { useState } from 'react'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import 'dayjs/locale/pt-br';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useForm, useWatch } from 'react-hook-form';
import Row from '../Row';
import Alert from '../Alert';

function Form({ open, handleClose, create, isMobile, calibration, mutateCriation, errorCreating, isSuccessCreate, mutateEdit }) {
    const [alertOpen, setAlertOpen] = useState(false)
    const form = useForm({
        defaultValues: {
            local: calibration?.local ? calibration?.local : '',
            data: calibration?.data ? calibration?.data : null,
            ordemDeServico: calibration?.ordem_de_servico ? calibration?.ordem_de_servico : '',
            observacoes: calibration?.observacoes ? calibration?.observacoes : '',
            maiorErro: calibration?.maior_erro ? calibration?.maior_erro : null,
            incerteza: calibration?.incerteza ? calibration?.incerteza : null,
            criterioDeAceitacao: calibration?.criterio_de_aceitacao ? calibration?.criterio_de_aceitacao : null,
            referenciaDoCriterio: calibration?.referencia_do_criterio ? calibration?.referencia_do_criterio : null,
        }
    })
    const {
        data,
    } = useWatch({ control: form.control })

    const submitCreate = () => {
        mutateCriation(form?.watch())
        form?.reset()
        handleClose();
    }

    const submitEdit = () => {
        mutateEdit({form: form?.watch(), id: calibration?.id})
        form?.reset()
        handleClose();
    }
    const saveAndCreateAnother = () => {
        mutateCriation(form?.watch())
        setAlertOpen(true)
        form?.reset()
    }
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            PaperProps={{
                component: 'form',
                onSubmit: (event) => {
                    event.preventDefault();
                    if (create) {
                        submitCreate()
                    } else {
                        submitEdit()
                    }
                },
            }}
        >
            <DialogTitle>{create ? "Criar nova calibração" : "Editar calibração"}</DialogTitle>
            <DialogContent>
                <Row isMobile={isMobile}>
                    <TextField
                        id="ordemDeServico"
                        label="Ordem de serviço"
                        sx={{ width: isMobile ? '100%' : '50%' }}
                        {...form.register("ordemDeServico")}
                    />
                    <TextField
                        autoFocus
                        id="local"
                        label="Local"
                        sx={{ width: isMobile ? '100%' : '50%' }}
                        {...form.register("local")}
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                        <DatePicker
                            label="Última calibração"
                            {...form.register("data")}
                            value={data ? dayjs(data) : null}
                            onChange={newValue => form.setValue("data", newValue)}
                            sx={{ width: isMobile ? '100%' : '50%' }}
                        />
                    </LocalizationProvider>
                </Row>
                <Row>
                    <TextField
                        autoFocus
                        id="maiorErro"
                        label="Maior erro"
                        fullWidth
                        {...form.register("maiorErro")}
                        required
                    />
                    <TextField
                        autoFocus
                        id="incerteza"
                        label="Incerteza"
                        fullWidth
                        {...form.register("incerteza")}
                        required
                    />
                    {!isMobile && (
                        <TextField
                            autoFocus
                            id="criterioDeAceitacao"
                            label="Critério de aceitação"
                            fullWidth
                            type='number'
                            {...form.register("criterioDeAceitacao")}
                            required
                        />
                    )}
                </Row>
                <Row>
                    {isMobile && (
                        <TextField
                            autoFocus
                            id="criterioDeAceitacao"
                            label="Critério de aceitação"
                            fullWidth
                            {...form.register("criterioDeAceitacao")}
                            required
                        />
                    )}
                    <TextField
                        autoFocus
                        id="referenciaCriterioDeAceitacao"
                        label="Referência critério de aceitação"
                        fullWidth
                        {...form.register("referenciaDoCriterio")}
                    />
                </Row>
                <TextField
                    autoFocus
                    id="observacoes"
                    label="Observações"
                    fullWidth
                    multiline
                    rows={1}
                    {...form.register("observacoes")}
                />
                <Alert open={alertOpen} setOpen={setAlertOpen} severity={isSuccessCreate ? 'success' : 'error'} texto={isSuccessCreate ? `Calibração ${create ? 'criada' : 'editada'} com sucesso!` : `Falha ao ${create ? 'criar' : 'editar'} calibração.`} />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancelar</Button>
                {create && <Button onClick={saveAndCreateAnother} type="submit" variant="outlined" color="secondary">Salvar e adicionar outro</Button>}
                <Button variant="contained" type="submit">{create ? 'Salvar' : 'Editar'}</Button>
            </DialogActions>
        </Dialog>
    )
}

export default Form