import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import React from 'react'

function CriticalAnalysisDialog({ open, handleClose, handleConfirmationAnalysis, analiseCliente, handleChange }) {
    return (
        <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
            <DialogTitle>Nos informe sua análise da calibração</DialogTitle>
            <DialogContent>
                <Box component="form" sx={{ display: 'flex', flexWrap: 'wrap', mt: 1}}>
                    <FormControl fullWidth size='small'>
                        <InputLabel id="analise-critica-select">Análise Crítica</InputLabel>
                        <Select
                            labelId="analise-critica-select"
                            id="analise-critica-field"
                            value={analiseCliente?.criticalAnalysis}
                            onChange={handleChange}
                            label="Análise Crítica"
                            name="criticalAnalysis"
                        >
                            <MenuItem value="A">Aprovada</MenuItem>
                            <MenuItem value="X">Reprovada</MenuItem>
                            <MenuItem value="R">Aprovada com restrições</MenuItem>
                        </Select>
                    </FormControl>
                    {analiseCliente?.criticalAnalysis === "R" && <TextField
                        id="restrictions"
                        label="Restrições"
                        multiline
                        fullWidth
                        onChange={handleChange}
                        value={analiseCliente?.restrictions}
                        name="restrictions"
                        helperText="Escreva quais foram as restrições"
                        sx={{mt: 1}}
                    />}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancelar</Button>
                <Button onClick={() => handleConfirmationAnalysis(analiseCliente)}>Confirmar</Button>
            </DialogActions>
        </Dialog>
    )
}

export default CriticalAnalysisDialog