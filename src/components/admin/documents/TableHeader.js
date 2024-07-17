import React from 'react'
import { Checkbox, TableCell, TableHead, TableRow } from '@mui/material';

const headCells = [
    {
        id: 'codigo',
        label: 'Código',
    },
    {
        id: 'titulo',
        label: 'Título',
    },
    {
        id: 'status',
        label: 'Status',
    },
    {
        id: 'elaborador',
        label: 'Elaborador',
    },
    {
        id: 'validade',
        label: 'Data Validade',
    },
    {
        id: 'analise_critica',
        label: 'Análise Critica',
    },
];

function TableHeader(props) {
    const { onSelectAllClick, numSelected, rowCount } =
        props;

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                    />
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                    >
                        {headCell.label}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

export default TableHeader