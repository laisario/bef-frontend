import React from 'react'
import { Checkbox, TableCell, TableHead, TableRow } from '@mui/material';

const headCellsDocuments = [
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

const headCellsClients = [
    {
        id: 'empresa',
        label: 'Empresa',
    },
    {
        id: 'email',
        label: 'Email',
    },
    {
        id: 'filial',
        label: 'Filial',
    },
];

const headCellsOrdersAdmin = [
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

const headCellsOrders = [
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

function TableHeader({ onSelectAllClick, numSelected, rowCount, component, admin }) {
    const headCells = {
        'clients': headCellsClients,
        'documents': headCellsDocuments,
        'orders': admin ? headCellsOrdersAdmin : headCellsOrders
    }
    return (
        <TableHead>
            <TableRow>
                {admin && <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                    />
                </TableCell>}
                {headCells[component]?.map((headCell) => (
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