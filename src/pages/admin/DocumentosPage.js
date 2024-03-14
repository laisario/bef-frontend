import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useNavigate } from "react-router-dom";
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import RateReviewIcon from '@mui/icons-material/RateReview';
import { visuallyHidden } from '@mui/utils';
import { Container, Stack } from '@mui/system';
import { Helmet } from 'react-helmet-async';
import { Button, InputAdornment, TextField } from '@mui/material';
import { Search } from '@mui/icons-material';
import FormCreateDocument from '../../components/admin/FormCreateDocument';
import Iconify from '../../components/iconify/Iconify';
import titleCase from '../../utils/formatTitle';
import { fDate } from '../../utils/formatTime';
import useDocumentos from '../../hooks/useDocumentos';

const headCells = [
    {
        id: 'codigo',
        numeric: false,
        disablePadding: true,
        label: 'Código',
    },
    {
        id: 'titulo',
        numeric: false,
        disablePadding: false,
        label: 'Título',
    },
    {
        id: 'status',
        numeric: false,
        disablePadding: false,
        label: 'Status',
    },
    {
        id: 'revisao',
        numeric: false,
        disablePadding: false,
        label: 'Data Revisão',
    },
    {
        id: 'validade',
        numeric: false,
        disablePadding: false,
        label: 'Data Validade',
    },
    {
        id: 'analise_critica',
        numeric: true,
        disablePadding: false,
        label: 'Análise Critica',
    },
];

function EnhancedTableHead(props) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
        props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox" sx={{ background: (theme) => `${theme.palette.grey[200]}` }}>
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            'aria-label': 'select all desserts',
                        }}
                    />
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        sx={{ background: (theme) => `${theme.palette.grey[200]}` }}
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
    const { numSelected, deleteDocuments, isDeleting, isSearching, setIsSearching, search, setSearch } = props;
    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                background: (theme) => theme.palette.grey[300],
                color: (theme) => theme.palette.grey[700],
                ...(numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}
        >
            {numSelected > 0 ? (
                <Typography
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected} selecionados
                </Typography>
            ) : (
                <Typography
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    Lista Mestra
                </Typography>
            )}
            {numSelected === 0 &&
                <TextField
                    label='Procure um documento'
                    id='search-bar'
                    value={search}
                    sx={{ width: '60%'}}
                    onChange={(e) => setSearch(e.target.value)}
                    size="small"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <Search />
                            </InputAdornment>
                        ),
                    }}
                />
            }

            {numSelected === 1 && <Tooltip title="Revisar">
                <IconButton>
                    <RateReviewIcon />
                </IconButton>
            </Tooltip>}



            {numSelected > 0 ? (
                <Tooltip title="Deletar">
                    {isDeleting ? <CircularProgress /> : <IconButton onClick={deleteDocuments}>
                        <DeleteIcon />
                    </IconButton>}
                </Tooltip>
            ) : (
                <Tooltip title="Filter list">
                    <IconButton>
                        <FilterListIcon />
                    </IconButton>
                </Tooltip>
            )}
        </Toolbar>
    );
}

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
};

export default function DocumentosPage() {
    const [open, setOpen] = useState(false);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('calories');
    const [selectedDocuments, setSelectedDocuments] = useState([]);
    const { data, status, deleteDocumento, isDeleting, search, setSearch, page, rowsPerPage, handleChangePage, handleChangeRowsPerPage} = useDocumentos(null);
    const [isSearching, setIsSearching] = useState(false)
    const navigate = useNavigate()
    const handleOpenForm = () => {
        setOpen(true);
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = data?.results?.map((n) => n.id);
            setSelectedDocuments(newSelected);
            return;
        }
        setSelectedDocuments([]);
    };

    const handleClick = (event, id) => {
        event?.stopPropagation()
        setSelectedDocuments(selectedDocuments?.includes(id) ? selectedDocuments?.filter(documentId => documentId !== id) : [...selectedDocuments, id]);
    };

    const isSelected = (id) => selectedDocuments.indexOf(id) !== -1;

    return (
        <>
            <Helmet>
                <title> Documentos | B&F </title>
            </Helmet>
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Documentos
                    </Typography>
                    <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenForm}>
                        Novo documento
                    </Button>
                </Stack>

                <FormCreateDocument open={open} setOpen={setOpen} />

                <Box sx={{ width: '100%', borderRadius: '12px' }}>
                    <Paper sx={{ width: '100%', mb: 2, boxShadow: '0 0 2px 0 rgba(145, 158, 171, 0.2),0 12px 24px -4px rgba(145, 158, 171, 0.12)', borderRadius: "12px" }}>
                        <EnhancedTableToolbar
                            numSelected={selectedDocuments.length}
                            deleteDocuments={() => { deleteDocumento(selectedDocuments); setSelectedDocuments([]) }}
                            isDeleting={isDeleting}
                            isSearching={isSearching}
                            setIsSearching={setIsSearching}
                            search={search}
                            setSearch={setSearch}
                        />
                        <TableContainer>
                            <Table
                                aria-labelledby="tableTitle"
                            >
                                <EnhancedTableHead
                                    numSelected={selectedDocuments.length}
                                    order={order}
                                    orderBy={orderBy}
                                    onSelectAllClick={handleSelectAllClick}
                                    onRequestSort={handleRequestSort}
                                    rowCount={data?.results?.length}
                                />
                                <TableBody>
                                    {data?.results?.map((row, index) => {
                                        const isItemSelected = isSelected(row.id);
                                        const labelId = `enhanced-table-checkbox-${index}`;

                                        return (
                                            <TableRow
                                                hover
                                                role="checkbox"
                                                aria-checked={isItemSelected}
                                                tabIndex={-1}
                                                key={row.id}
                                                onClick={() => { navigate(`/admin/documento/${row?.id}`) }}
                                                sx={{ cursor: 'pointer' }}
                                            >
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        color="primary"
                                                        onClick={(event) => handleClick(event, row.id)}
                                                        checked={isItemSelected}
                                                        inputProps={{
                                                            'aria-labelledby': labelId,
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell
                                                    component="th"
                                                    id={labelId}
                                                    scope="row"
                                                    padding="none"
                                                >
                                                    {row?.codigo?.codigo?.toUpperCase()}
                                                </TableCell>
                                                <TableCell>{titleCase(row?.titulo)}</TableCell>
                                                <TableCell>{status[row?.status]}</TableCell>
                                                <TableCell>{fDate(row?.data_revisao)}</TableCell>
                                                <TableCell>{fDate(row?.data_validade)}</TableCell>
                                                <TableCell align="right">{row?.analise_critica} dias</TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, 50, 100]}
                            component="div"
                            count={data?.count}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            labelRowsPerPage="Linhas por páginas"
                        />
                    </Paper>
                </Box>
            </Container>
        </>
    );
}