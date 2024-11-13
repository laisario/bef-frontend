import React, { useState } from 'react'
import {
    Box,
    Button,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    InputAdornment,
    InputLabel,
    List,
    MenuItem,
    Select,
    TextField,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import 'dayjs/locale/pt-br';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useForm, useWatch } from 'react-hook-form';
import Row from './Row'

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

function EditInstrument({ handleClose, open, instrument, isMobile, create, clientId, mutate, isLoading, }) {
    const form = useForm({
        defaultValues: {
            tag: instrument?.tag ? instrument?.tag : '',
            numeroDeSerie: instrument?.numero_de_serie ? instrument?.numero_de_serie : '',
            dataUltimaCalibracao: instrument?.data_ultima_calibracao ? instrument?.data_ultima_calibracao : null,
            dataProximaChecagem: instrument?.data_proxima_checagem ? instrument?.data_proxima_checagem : null,
            precoAlternativoCalibracao: instrument?.preco_alternativo_calibracao ? instrument?.preco_alternativo_calibracao : '',
            diasUteis: instrument?.dias_uteis ? instrument?.dias_uteis : null,
            capacidadeMedicao: instrument?.instrumento?.capacidade_de_medicao?.valor ? instrument?.instrumento?.capacidade_de_medicao?.valor : 0,
            unidadeMedicao: instrument?.instrumento?.capacidade_de_medicao?.unidade ? instrument?.instrumento?.capacidade_de_medicao?.unidade : '',
            local: instrument?.local ? instrument?.local : "P",
            precoCalibracaoLaboratorio: instrument?.instrumento?.preco_calibracao_no_laboratorio || null,
            precoCalibracaoCliente: instrument?.instrumento?.preco_calibracao_no_cliente || null,
            pontosCalibracao: instrument?.pontos_de_calibracao?.length ? instrument?.pontos_de_calibracao?.map(ponto => ponto?.nome) : [],
            minimo: instrument?.instrumento?.minimo ? instrument?.instrumento?.minimo : null,
            maximo: instrument?.instrumento?.maximo ? instrument?.instrumento?.maximo : null,
            unidade: instrument?.instrumento?.unidade ? instrument?.instrumento?.unidade : null,
            posicao: instrument?.posicao ? instrument?.posicao : 'U',
            laboratorio: instrument?.laboratorio ? instrument?.laboratorio : '',
            frequencia: instrument?.frequencia ? instrument.frequencia : 0,
            observacoes: instrument?.observacoes ? instrument?.observacoes : '',
            tipoDeServico: instrument?.instrumento?.tipo_de_servico ? instrument?.instrumento?.tipo_de_servico : 'A',
            procedimentoRelacionado: instrument?.instrumento?.procedimento_relacionado?.codigo ? instrument?.instrumento?.procedimento_relacionado?.codigo : null,
            descricao: instrument?.instrumento?.tipo_de_instrumento?.descricao ? instrument?.instrumento?.tipo_de_instrumento?.descricao : '',
            modelo: instrument?.instrumento?.tipo_de_instrumento?.modelo ? instrument?.instrumento?.tipo_de_instrumento?.modelo : '',
            fabricante: instrument?.instrumento?.tipo_de_instrumento?.fabricante ? instrument?.instrumento?.tipo_de_instrumento?.fabricante : '',
            resolucao: instrument?.instrumento?.tipo_de_instrumento?.resolucao ? instrument?.instrumento?.tipo_de_instrumento?.resolucao : 0,
        }
    })
    const {
        dataUltimaCalibracao,
        local,
        posicao,
        dataProximaChecagem,
        tipoDeServico,
    } = useWatch({ control: form.control })
    const { handleSubmit } = form;
    const saveChanges = () => {
        const formValues = form.watch()
        const data = { ...formValues }
        if (create) {
            data.client = clientId
        } else {
            data.instrumento = instrument?.id
        }
        mutate(data)
        form.reset()
        handleClose()
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
            <Dialog onClose={handleClose} open={open} fullScreen={isMobile}>
                <DialogTitle>{create ? 'Adicionar novo instrumento:' : 'Editar instrumento:'}</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column' }}>
                    <form onSubmit={handleSubmit(saveChanges)}>
                        <Row>
                            <TextField
                                id="descricao"
                                label="Descrição"
                                name="descricao"
                                variant="outlined"
                                sx={{ width: '60%' }}
                                {...form.register("descricao")}
                                size="small"
                                required
                            />

                            <TextField
                                id="modelo"
                                label="Modelo"
                                name="modelo"
                                variant="outlined"
                                sx={{ width: '40%' }}
                                {...form.register("modelo")}
                                size="small"
                            />
                        </Row>
                        <Row >
                            <TextField
                                id="fabricante"
                                label="Fabricante"
                                name="fabricante"
                                variant="outlined"
                                sx={{ width: '40%' }}
                                {...form.register("fabricante")}
                                size="small"
                            />
                            <TextField
                                id="resolucao"
                                label="Resolução"
                                name="resolucao"
                                variant="outlined"
                                sx={{ width: '30%' }}
                                {...form.register("resolucao")}
                                size="small"
                                type='number'
                            />
                            <TextField
                                id="tag"
                                label="Tag"
                                name="tag"
                                variant="outlined"
                                sx={{ width: '30%' }}
                                {...form.register("tag")}
                                size="small"
                                required
                            />
                        </Row>
                        <Row>
                            <TextField
                                id="numeroDeSerie"
                                label="Número de série"
                                name="numeroDeSerie"
                                variant="outlined"
                                sx={{ width: isMobile ? '45%' : '50%' }}
                                {...form.register("numeroDeSerie")}
                                size="small"
                            />
                            <TextField
                                label="Procedimento relacionado"
                                variant="outlined"
                                sx={{ width: isMobile ? '55%' : '50%' }}
                                {...form.register("procedimentoRelacionado")}
                                placeholder="Procedimento relacionado"
                                size="small"

                            />
                        </Row>
                        <Row>
                            <DatePicker
                                label="Próxima checagem"
                                {...form.register("dataProximaChecagem")}
                                value={dataProximaChecagem ? dayjs(dataProximaChecagem) : null}
                                onChange={newValue => form.setValue("dataProximaChecagem", newValue)}
                                sx={{ width: '50%' }}
                            />
                            <DatePicker
                                label="Última calibração"
                                {...form.register("dataUltimaCalibracao")}
                                value={dataUltimaCalibracao ? dayjs(dataUltimaCalibracao) : null}
                                onChange={newValue => form.setValue("dataUltimaCalibracao", newValue)}
                                sx={{ width: '50%' }}
                            />
                        </Row>
                        <Row>
                            <FormControl sx={{ width: local === "T" ? '40%' : '50%' }}>
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
                            {local === "T" && <TextField
                                id="diasUteis"
                                label="Dias Úteis"
                                type="number"
                                variant="outlined"
                                sx={{ width: isMobile ? '100%' : '20%' }}
                                {...form.register("diasUteis")}
                            />}
                            <TextField
                                label="Laboratorio"
                                variant="outlined"
                                sx={{ width: local === "T" ? '40%' : '50%' }}
                                {...form.register("laboratorio")}
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
                                required
                            />
                            <TextField
                                label="Unidade"
                                variant="outlined"
                                sx={{ width: isMobile ? '30%' : '50%' }}
                                {...form.register("unidadeMedicao")}
                                placeholder="Unidade de medição"
                                size="small"
                                required
                            />
                        </Row>
                        <Row>
                            <FormControl sx={{ width: posicao === 'U' ? '35%' : '50%' }}>
                                <InputLabel>Tipo de servico</InputLabel>
                                <Select
                                    {...form.register("tipoDeServico")}
                                    label="Tipo de servico"
                                    value={tipoDeServico}
                                >
                                    <MenuItem value="A">Acreditado</MenuItem>
                                    <MenuItem value="NA">Nao Acreditado</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl sx={{ width: posicao === 'U' ? '35%' : '50%' }}>
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
                            {posicao === 'U' && <TextField
                                autoFocus
                                id="frequencia"
                                name="frequencia"
                                label="Frequência"
                                type='number'
                                helperText="Em meses"
                                {...form.register("frequencia")}
                                sx={{ width: '30%' }}

                            />}
                        </Row>
                        <Row>
                            <AddArrayField label="Pontos de Calibração" fieldName="pontosCalibracao" form={form} field="nome" />
                        </Row>
                        <Row>
                            <DialogContentText>Faixa atendida:</DialogContentText>
                        </Row>
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
                        <Row>
                            <DialogContentText>Preços calibração:</DialogContentText>
                        </Row>
                        <Row>
                            <TextField
                                label="Laboratório"
                                variant="outlined"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">R$</InputAdornment>
                                    ),
                                }}
                                sx={{ width: isMobile ? '100%' : '40%' }}
                                {...form.register("precoCalibracaoLaboratorio")}
                                size="small"
                            />
                            <TextField
                                label="Cliente"
                                variant="outlined"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">R$</InputAdornment>
                                    ),
                                }}
                                sx={{ width: isMobile ? '100%' : '40%' }}
                                {...form.register("precoCalibracaoCliente")}
                                size="small"
                            />
                            <TextField
                                label="Alternativo"
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
                                label="Observações"
                                variant="outlined"
                                {...form.register("observacoes")}
                                placeholder="Observaçoes"
                                fullWidth
                                multiline
                                rows={3}
                            />
                        </Row>
                    </form>
                </DialogContent>
                <DialogActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button onClick={handleClose}>Cancelar</Button>
                    {isLoading ? <CircularProgress /> : <Button variant='contained' onClick={saveChanges}>{create ? 'Criar' : 'Salvar mudanças'}</Button>}
                </DialogActions>
            </Dialog>
        </LocalizationProvider>
    )
}

export default EditInstrument