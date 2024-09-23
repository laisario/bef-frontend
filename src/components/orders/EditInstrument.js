import React, { useState } from 'react'
import {
    Box,
    Button,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    FormControl,
    InputAdornment,
    InputLabel,
    List,
    MenuItem,
    Select,
    TextField
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import 'dayjs/locale/pt-br';
import dayjs from 'dayjs';
import { useForm, useWatch } from 'react-hook-form';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import useInstrumentos from '../../hooks/useInstrumentos';

function Row({ children, isMobile }) {
    return (
        <Box display="flex" flexDirection={isMobile ? 'column' : 'row'} my={1} gap={1} >
            {children}
        </Box>
    )
}

function AddArrayField({ label, fieldName, form }) {
    const [inputValue, setInputValue] = useState('');

    const handleAdd = () => {
        const currentValues = form.getValues(fieldName) || [];
        form.setValue(fieldName, [...currentValues, inputValue]);
        setInputValue('');
    };

    const handleRemove = (indexToRemove) => {
        const currentValues = form.getValues(fieldName);
        const newValues = currentValues?.filter((_, index) => index !== indexToRemove);
        form.setValue(fieldName, newValues);
    };

    const values = form.watch(fieldName) || [];

    return (
        <Box display="flex" flexDirection="column" width="100%">
            <Box display="flex" flexDirection="row" width="100%" gap={2}>
                <TextField
                    label={label}
                    variant="outlined"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    size="small"
                    sx={{ width: '80%' }}
                />
                <Button onClick={handleAdd} variant="contained" size="small" sx={{ width: '20%' }}>
                    Adicionar
                </Button>
            </Box>
            <List sx={{ mt: 1, overflowX: 'auto' }}>
                {values?.map((value, index) => (
                    <Chip
                        label={value}
                        sx={{ m: 0.5 }}
                        onDelete={() => handleRemove(index)}
                        key={index}
                    />
                ))}
            </List>
        </Box>
    );
}

function EditInstrument({ handleClose, open, instrument, isMobile, }) {
    const priceOptions = {
        "C": instrument?.instrumento?.preco_calibracao_no_cliente,
        "T": instrument?.instrumento?.preco_calibracao_no_cliente,
        "P": instrument?.instrumento?.preco_calibracao_no_laboratorio,
    }
    const form = useForm({
        defaultValues: {
            tag: instrument?.tag ? instrument?.tag : '',
            numeroDeSerie: instrument?.numero_de_serie ? instrument?.numero_de_serie : '',
            dataUltimaCalibracao: instrument?.data_ultima_calibracao ? instrument?.data_ultima_calibracao : null,
            precoAlternativoCalibracao: instrument?.preco_alternativo_calibracao ? instrument?.preco_alternativo_calibracao : '',
            diasUteis: instrument?.dias_uteis ? instrument?.dias_uteis : null,
            capacidadeMedicao: instrument?.instrumento?.capacidade_de_medicao?.valor ? instrument?.instrumento?.capacidade_de_medicao?.valor : 0,
            unidadeMedicao: instrument?.instrumento?.capacidade_de_medicao?.unidade ? instrument?.instrumento?.capacidade_de_medicao?.unidade : '',
            local: instrument?.local ? instrument?.local : "P",
            precoCalibracao: priceOptions[instrument?.local] || "",
            pontosCalibracao: instrument?.pontos_de_calibracao?.length ? instrument?.pontos_de_calibracao?.map(ponto => ponto?.nome) : [],
            minimo: instrument?.instrumento?.minimo ? instrument?.instrumento?.minimo : null,
            maximo: instrument?.instrumento?.maximo ? instrument?.instrumento?.maximo : null,
            unidade: instrument?.instrumento?.unidade ? instrument?.instrumento?.unidade : '',
            posicao: instrument?.posicao ? instrument?.posicao : 'U'
        }
    })
    const {
        dataUltimaCalibracao,
        local,
        posicao
    } = useWatch({ control: form.control })

    const { mutateInstrument, isUpdatingInstrument } = useInstrumentos(instrument.id)
    const saveChanges = async () => {
        const formValues = form.watch()
        mutateInstrument(formValues)
        form.reset()
        handleClose()
    }

    return (
        <Dialog onClose={handleClose} open={open} fullScreen={isMobile}>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column' }}>
                <Row >
                    <TextField
                        id="tag"
                        label="Tag"
                        name="tag"
                        variant="outlined"
                        sx={{ width: '50%' }}
                        {...form.register("tag")}
                        size="small"
                    />
                    <TextField
                        id="numeroDeSerie"
                        label="Número de série"
                        name="numeroDeSerie"
                        variant="outlined"
                        sx={{ width: '50%' }}
                        {...form.register("numeroDeSerie")}
                        size="small"
                    />
                </Row>
                <Row isMobile={isMobile}>
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                        <DatePicker
                            label="Última calibração"
                            {...form.register("dataUltimaCalibracao")}
                            value={dataUltimaCalibracao ? dayjs(dataUltimaCalibracao) : null}
                            onChange={newValue => form.setValue("dataUltimaCalibracao", newValue)}
                            sx={{ width: isMobile ? '100%' : '30%' }}
                        />
                    </LocalizationProvider>
                    <FormControl sx={{ width: isMobile ? '100%' : '30%' }}>
                        <InputLabel>Posição</InputLabel>
                        <Select
                            {...form.register("posicao")}
                            label="Posição"
                            value={posicao}
                        >
                            <MenuItem value="U">Em uso</MenuItem>
                            <MenuItem value="E">Em estoque</MenuItem>
                            <MenuItem value="I">Inativo</MenuItem>
                            <MenuItem value="F">Fora de uso</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl sx={{ width: isMobile ? '100%' : '40%' }}>
                        <InputLabel>Local</InputLabel>
                        <Select
                            {...form.register("local")}
                            label="Local"
                            value={local}
                        >
                            <MenuItem value="P">Instalações Permanente</MenuItem>
                            <MenuItem value="C">Instalações Clientes</MenuItem>
                            <MenuItem value="T">Terceirizada</MenuItem>
                        </Select>
                    </FormControl>
                </Row>

                <Row isMobile={isMobile}>
                    {local === "T" && <TextField
                        id="diasUteis"
                        label="Dias Úteis"
                        type="number"
                        variant="outlined"
                        sx={{ width: isMobile ? '100%' : '20%' }}
                        {...form.register("diasUteis")}
                        size="small"
                    />}
                    <TextField
                        label="Preço calibração"
                        variant="outlined"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">R$</InputAdornment>
                            ),
                        }}
                        sx={{ width: isMobile ? '100%' : '40%' }}
                        {...form.register("precoCalibracao")}
                        size="small"
                    />
                    <TextField
                        label="Preço alternativo calibração"
                        variant="outlined"
                        sx={{ width: isMobile ? '100%' : '40%' }}
                        {...form.register("precoAlternativoCalibracao")}
                        size="small"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">R$</InputAdornment>
                            ),
                        }}
                    />
                </Row>
                <Row>
                    <TextField
                        id="capacidadeMedicao"
                        label="Capacidade de medição"
                        name="capacidadeMedicao"
                        variant="outlined"
                        {...form.register("capacidadeMedicao")}
                        size="small"
                        sx={{ width: isMobile ? '70%' : '50%' }}
                    />
                    <TextField
                        label="Unidade"
                        variant="outlined"
                        sx={{ width: isMobile ? '30%' : '50%' }}
                        {...form.register("unidadeMedicao")}
                        placeholder="Unidade de medição"
                        size="small"
                    />
                </Row>
                <Row>
                    <AddArrayField label="Pontos de Calibração" fieldName="pontosCalibracao" form={form} field="nome" />
                </Row>
                <InputLabel sx={{ width: '40%' }}>Faixa atendida: </InputLabel>
                <Row>
                    <TextField
                        id="minimo"
                        label="Mínimo"
                        name="minimo"
                        variant="outlined"
                        {...form.register("minimo")}
                        size="small"
                        type="number"
                        sx={{ width: isMobile ? '30%' : '50%' }}
                    />
                    <TextField
                        id="maximo"
                        label="Máximo"
                        name="maximo"
                        variant="outlined"
                        type='number'
                        {...form.register("maximo")}
                        size="small"
                        sx={{ width: isMobile ? '30%' : '50%' }}
                    />
                    <TextField
                        label="Unidade"
                        variant="outlined"
                        sx={{ width: isMobile ? '30%' : '50%' }}
                        {...form.register("unidade")}
                        placeholder="Unidade"
                        size="small"
                    />
                </Row>
            </DialogContent>
            <DialogActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button onClick={handleClose}>Cancelar</Button>
                {isUpdatingInstrument ? <CircularProgress /> : <Button variant='contained' onClick={saveChanges}>Salvar mudanças</Button>}
            </DialogActions>
        </Dialog>
    )
}

export default EditInstrument