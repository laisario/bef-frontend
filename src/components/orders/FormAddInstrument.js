import { Autocomplete, Button, Checkbox, Dialog, DialogContent, DialogTitle, TextField, Chip, Box } from '@mui/material'
import React, { useState } from 'react'
import { axios } from '../../api'

function FormAddInstrument({ open, handleClose, data, isLoading, proposalInstruments, idProposal, refetch, setLoading }) {
    const [instruments, setInstruments] = useState([])

    const submit = async () => {
        try {
            setLoading(true)
            await axios.patch(`/propostas/${idProposal}/`, { instrumentos: [...proposalInstruments, ...instruments?.map(instrument => instrument?.id)]});
            await refetch();
            return { error: false };
        } catch (err) {
            console.log(err)
            return { error: true };
        } finally {
            setLoading(false)
            setInstruments([])
            handleClose()
        }
    };

    const optionsAvailable = !!data?.instruments_available?.length && data?.instruments_available

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Adicionar outro instrumento:</DialogTitle>
            <DialogContent>
                <Autocomplete
                    multiple
                    autoHighlight
                    options={optionsAvailable || []}
                    isOptionEqualToValue={(option, value) => option?.id === value?.id}
                    getOptionLabel={(instrument) => `${instrument?.tag}: ${instrument?.numero_de_serie} - ${instrument?.instrumento?.tipo_de_instrumento?.descricao} - ${instrument.instrumento?.minimo} - ${instrument?.instrumento?.maximo}`}
                    disableCloseOnSelect
                    loading={isLoading}
                    renderTags={(value, getTagProps) => value?.map((tag, index) => <Chip {...getTagProps({ index })} key={tag?.tag} label={tag?.tag} />)}
                    name="instrumentos"
                    value={instruments || null}
                    loadingText="Carregando..."
                    noOptionsText="Sem resultados"
                    onChange={(event, newValue) => setInstruments(newValue)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label={"Instrumentos"}
                            placeholder="Pesquisar instrumento"
                        />
                    )}
                    renderOption={(props, instrument, { selected }) => {
                        const { ...optionProps } = props;
                        return (
                            <li key={instrument?.id} {...optionProps}>
                                <Checkbox
                                    style={{ marginRight: 8 }}
                                    checked={selected}
                                />
                                {instrument?.tag}: {instrument?.numero_de_serie} - {instrument?.instrumento?.tipo_de_instrumento?.descricao} - {instrument?.instrumento?.minimo} - {instrument?.instrumento?.maximo}
                            </li>
                        );
                    }}
                    sx={{ my: 2 }}
                />
                <Box display='flex' justifyContent='space-between'>
                    <Button onClick={() => { handleClose(); setInstruments([]) }}>Cancelar</Button>
                    <Button onClick={submit} variant="contained" >Salvar</Button>
                </Box>
            </DialogContent>
        </Dialog>
    )
}

export default FormAddInstrument