import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

import { readString, useCSVDownloader } from "react-papaparse"
import { DialogActions, DialogContent } from '@mui/material';

export default function CsvViewer({ csvContent, fileName }) {
    const [parsedCsv, setParsedCsv] = React.useState(null)
    const { CSVDownloader } = useCSVDownloader()

    React.useEffect(() => {
        if (!csvContent) return
        readString(csvContent, {
            header: true,
            worker: true,
            skipEmptyLines: true,
            complete: (results) => {
                if (results?.errors?.length) console.log("deu ruim")
                setParsedCsv(results?.data)
            }
        })
    }, [csvContent])

    if (!parsedCsv) return null
    return (
        <Dialog fullScreen PaperProps={{ sx: { width: '100%' } }} onClose={() => setParsedCsv(null)} open={!!parsedCsv}>

            <DialogTitle>Pré visualização do seu arquivo</DialogTitle>
            <DialogContent>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 1200 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                {Object.keys(parsedCsv[0]).map(key => <TableCell key={key}>{key}</TableCell>)}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {parsedCsv.map((row, index) => {
                                const values = Object.values(row)
                                return (
                                    <TableRow
                                        key={index + 1}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        {values.map((value, i) => <TableCell key={value + i} align="left">{value}</TableCell>)}
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setParsedCsv(null)}>Cancelar</Button>
                <CSVDownloader style={{ background: 'transparent', border: 0 }} type="button" filename={fileName} bom data={parsedCsv}><Button>Download</Button></CSVDownloader>
            </DialogActions>
        </Dialog>
    );
}