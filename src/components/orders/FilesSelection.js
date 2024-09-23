import { Button, Dialog, DialogContent, DialogTitle } from '@mui/material'
import React from 'react'

function FilesSelection({ handleClose, open, arr = [], title }) {
    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                {arr?.map((arr, i) => <Button key={title + i + 1} variant='contained' target='_blank' sx={{ mr: 1 }} href={arr?.url}>{title?.toLowerCase()?.includes('proposta') ? `Rev ${arr?.rev}` : (i + 1)}</Button>)}
            </DialogContent>
        </Dialog>
    )
}

export default FilesSelection