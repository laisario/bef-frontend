import React, { useState } from 'react'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import { Box, Checkbox, FormControlLabel, FormGroup, FormHelperText, FormLabel } from '@mui/material';
import { axios } from '../../api';
import CsvViewer from './CsvViewer';

function ExportFilter({ open, handleClose, selecionados, handleChangeCheckbox, valueCheckbox, error, setError }) {
    const [csvContent, setCsvContent] = useState(null)
    return (
        <Dialog
            open={open}
            onClose={() => { setCsvContent(null); handleClose() }}
            PaperProps={{
                component: 'form',
                onSubmit: async (event) => {
                    event.preventDefault();
                    if (!Object.values(valueCheckbox).includes(true)) {
                        setError(true);
                        return;
                    }

                    const dadosSelecionados = {
                        instrumentosSelecionados: selecionados,
                        camposSelecionados: Object.entries(valueCheckbox).filter(([,value]) => !!value).map(([key]) => key)
                    };

                    try {
                        const resposta = await axios.post('/instrumentos/exportar/', dadosSelecionados);
                        if (resposta.status === 200) {
                            console.log('Exportação realizada com sucesso!');
                            setCsvContent(resposta?.data)
                        } else {
                            setError(true)
                        }
                    } catch (error) {
                        console.error('Erro ao enviar dados para o backend:', error);
                        setError(true)
                    }

                    setError(false);
                },
            }}
        >

            <DialogTitle>Exporte informações dos instrumentos</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: "column" }}>
                    <FormControl sx={{ m: 2 }} component="fieldset" variant="standard">
                        <FormLabel component="legend">Escolha quais informações deseja incluir no relatório:</FormLabel>
                        <FormGroup>
                            <FormControlLabel
                                control={<Checkbox checked={valueCheckbox?.tag} onChange={handleChangeCheckbox} name="tag" />}
                                label="Tag"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={valueCheckbox?.numeroDeSerie} onChange={handleChangeCheckbox} name="numeroDeSerie" />}
                                label="Número de Série"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={valueCheckbox?.observacoes} onChange={handleChangeCheckbox} name="observacoes" />}
                                label="Observações"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={valueCheckbox?.laboratorio} onChange={handleChangeCheckbox} name="laboratorio" />}
                                label="Laboratório"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={valueCheckbox?.posicaoDoInstrumento} onChange={handleChangeCheckbox} name="posicaoDoInstrumento" />}
                                label="Posição do Instrumento"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={valueCheckbox?.dataUltimaCalibracao} onChange={handleChangeCheckbox} name="dataUltimaCalibracao" />}
                                label="Data Última Calibração"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={valueCheckbox?.frequenciaDeCalibracao} onChange={handleChangeCheckbox} name="frequenciaDeCalibracao" />}
                                label="Frequência de Calibração"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={valueCheckbox?.dataDaProximaCalibracao} onChange={handleChangeCheckbox} name="dataDaProximaCalibracao" />}
                                label="Data da Próxima Calibração"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={valueCheckbox?.dataDaProximaChecagem} onChange={handleChangeCheckbox} name="dataDaProximaChecagem" />}
                                label="Data da Próxima Checagem"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={valueCheckbox?.local} onChange={handleChangeCheckbox} name="local" />}
                                label="Local"
                            />
                        </FormGroup>
                        {error && !Object.values(valueCheckbox).includes(true) &&
                            <FormHelperText error={error && !Object.values(valueCheckbox).includes(true)}>
                                Por favor, marque pelo menos uma opção.
                            </FormHelperText>
                        }
                    </FormControl>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => { setCsvContent(null); handleClose() }}>Cancelar</Button>
                <Button type="submit">Exportar</Button>
            </DialogActions>
            <CsvViewer csvContent={csvContent} fileName="meus_instrumentos" />
        </Dialog >
    )
}

export default ExportFilter