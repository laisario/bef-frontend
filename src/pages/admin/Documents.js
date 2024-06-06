import { useState } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { useNavigate } from "react-router-dom";
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import { Container, Stack } from '@mui/system';
import { Helmet } from 'react-helmet-async';
import { Button } from '@mui/material';
import FormCreateDocument from '../../components/admin/FormCreateDocument';
import Iconify from '../../components/iconify/Iconify';
import titleCase from '../../utils/formatTitle';
import TableHeader from '../../components/admin/documents/TableHeader';
import { fDate } from '../../utils/formatTime';
import useDocumentos from '../../hooks/useDocumentos';
import TableToolbar from '../../components/admin/documents/TableToolbar';


export default function Documents() {
    const [open, setOpen] = useState(false);
    const [selectedDocuments, setSelectedDocuments] = useState([]);
    const { data, status, deleteDocumento, isDeleting, search, setSearch, page, rowsPerPage, handleChangePage, handleChangeRowsPerPage, isLoading } = useDocumentos(null);
    const navigate = useNavigate()

    const handleOpenForm = () => {
        setOpen(true);
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
                        <TableToolbar
                            numSelected={selectedDocuments.length}
                            deleteDocuments={() => { deleteDocumento(selectedDocuments); setSelectedDocuments([]) }}
                            isDeleting={isDeleting}
                            search={search}
                            setSearch={setSearch}
                            isLoading={isLoading}
                        />
                        <TableContainer>
                            <Table
                                aria-labelledby="tabelaDocumentos"
                            >
                                <TableHeader
                                    numSelected={selectedDocuments.length}
                                    onSelectAllClick={handleSelectAllClick}
                                    rowCount={data?.results?.length}
                                />
                                <TableBody>
                                    {!isLoading ? data?.results?.map((row, index) => {
                                        const isItemSelected = isSelected(row.id);

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
                                                            'aria-labelledby': index,
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell
                                                    component="th"
                                                    id={index}
                                                    scope="row"
                                                    padding="none"
                                                >
                                                    {row?.codigo?.codigo?.toUpperCase()}
                                                </TableCell>
                                                <TableCell>{titleCase(row?.titulo)}</TableCell>
                                                <TableCell>{status[row?.status]}</TableCell>
                                                <TableCell>{fDate(row?.data_revisao)}</TableCell>
                                                <TableCell>{fDate(row?.data_validade)}</TableCell>
                                                <TableCell>{row?.analise_critica} dias</TableCell>
                                            </TableRow>
                                        );
                                    }) : <CircularProgress />}
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