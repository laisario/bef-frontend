import { Checkbox, TableCell, TableHead, TableRow } from '@mui/material';
import React from 'react'

const headCells = [
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