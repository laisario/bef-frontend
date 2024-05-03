import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import React from 'react'


function AlertConfirmationCard({ open, handleCloseAlert, confirmacaoCliente, handleConfirmationAlert }) {
    return (
        <Dialog
            open={open}
            onClose={handleCloseAlert}
            aria-labelledby="read-confirmation"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="read-confirmation">
                Concorda com as informações da calibração?
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {confirmacaoCliente ? "Você concordou com os dados desta calibração. Em caso de engano entre em contato com a nossa equipe." : "Clique em concordar se estiver de acordo com os dados da calibração!"}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseAlert}> {confirmacaoCliente ? "Sair" : "Não concordo"}</Button>
                {
                    !confirmacaoCliente &&
                    <Button onClick={handleConfirmationAlert} autoFocus>
                        Concordo
                    </Button>
                }
            </DialogActions>
        </Dialog>

    )
}

export default AlertConfirmationCard