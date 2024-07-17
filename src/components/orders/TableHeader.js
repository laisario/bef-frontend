import { Checkbox, TableCell, TableHead, TableRow } from '@mui/material';
import React from 'react'

const headCellsAdmin = [
    {
        id: 'numero',
        label: 'Número',
    },
    {
        id: 'data',
        label: 'Data',
    },
    {
        id: 'cliente',
        label: 'Cliente',
    },
    {
        id: 'status',
        label: 'Status',
    },
];

const headCellsClient = [
    {
        id: 'numero',
        label: 'Número',
    },
    {
        id: 'data',
        label: 'Data',
    },
    {
        id: 'total',
        label: 'Total',
    },
    {
        id: 'status',
        label: 'Status',
    },
];

function TableHeader({ onSelectAllClick, numSelected, rowCount, admin }) {
    const headCells = admin ? headCellsAdmin : headCellsClient
    return (
        <TableHead>
            <TableRow>
                {admin &&
                    <TableCell padding="checkbox">
                        <Checkbox
                            color="primary"
                            indeterminate={numSelected > 0 && numSelected < rowCount}
                            checked={rowCount > 0 && numSelected === rowCount}
                            onChange={onSelectAllClick}
                        />
                    </TableCell>
                }
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