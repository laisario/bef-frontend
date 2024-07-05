import { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import GetAppIcon from '@mui/icons-material/GetApp';
import Typography from '@mui/material/Typography';
import { useNavigate } from "react-router-dom";
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import { Container, Stack } from '@mui/system';
import { Helmet } from 'react-helmet-async';
import { Button, Grid } from '@mui/material';
import FormCreate from '../../components/admin/documents/FormCreate';
import Iconify from '../../components/iconify/Iconify';
import titleCase from '../../utils/formatTitle';
import TableHeader from '../../components/admin/documents/TableHeader';
import { fDate } from '../../utils/formatTime';
import useDocumentos from '../../hooks/useDocumentos';
import TableToolbar from '../../components/admin/documents/TableToolbar';
import useResponsive from '../../hooks/useResponsive';
import { axios } from '../../api';
import CsvViewer from '../../components/instrumentos/CsvViewer';
import Label from '../../components/label';

export default function Documents() {
    const [open, setOpen] = useState(false);
    const [selectedDocuments, setSelectedDocuments] = useState([]);
    const [csvContent, setCsvContent] = useState(null)
    const [filter, setFilter] = useState(false)
    const { data,
        status,
        statusColor,
        deleteDocumento,
        isDeleting,
        page,
        rowsPerPage,
        handleChangePage,
        handleChangeRowsPerPage,
        isLoading,
        formFilter,
        formCreate,
        findCriticalAnalysisStage,
        criticalAnalysisMonths,
    } = useDocumentos(null);
    const navigate = useNavigate()
    const isMobile = useResponsive('down', 'md');

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

    const exportDocuments = async () => {
        try {
            const resposta = await axios.post('/documentos/exportar/', { documentos_selecionados: selectedDocuments });;
            if (resposta.status === 200) {
                console.log('Exportação realizada com sucesso!');
                setCsvContent(resposta?.data)
            } else {
                console.log('Xi status não foi 200')
            }
        } catch (error) {
            console.error('Erro ao enviar dados para o backend:', error);
        }
    };

    console.log(criticalAnalysisMonths(328))

    return (
        <>
            <Helmet>
                <title> Documentos | B&F </title>
            </Helmet>
            <Container>
                <Grid container display="flex" flexDirection={isMobile ? "column" : "row"} alignItems={isMobile ? "flex-start" : "center"} justifyContent="space-between" mb={5}>
                    <Grid item sm={6} xs={12}>
                        <Typography variant="h4" gutterBottom>
                            Documentos
                        </Typography>
                    </Grid>
                    <Grid item container spacing={2} sm={6} xs={12} justifyContent={isMobile ? "flex-start" : "flex-end"}>
                        <Grid item>
                            <Button variant="contained" startIcon={<GetAppIcon />} onClick={exportDocuments} disabled={selectedDocuments.length < 1} >
                                Exportar
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenForm}>
                                Novo documento
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>

                <FormCreate open={open} setOpen={setOpen} form={formCreate} />

                <TableToolbar
                    numSelected={selectedDocuments.length}
                    deleteDocuments={() => { deleteDocumento(selectedDocuments); setSelectedDocuments([]) }}
                    isDeleting={isDeleting}
                    form={formFilter}
                    isLoading={isLoading}
                    filter={filter}
                    setFilter={setFilter}
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
                                        <TableCell>{!!row?.titulo && titleCase(row?.titulo)}</TableCell>
                                        <TableCell>
                                            <Label color={statusColor[row?.status]}>
                                                {status[row?.status]}
                                            </Label>
                                        </TableCell>
                                        <TableCell>{!!row?.data_revisao && fDate(row?.data_revisao)}</TableCell>
                                        <TableCell> {!!row?.data_validade && fDate(row?.data_validade)}</TableCell>
                                        <TableCell>
                                            {!!row?.analise_critica && (
                                                <Label color={findCriticalAnalysisStage(row?.analise_critica)}>
                                                    {criticalAnalysisMonths(row?.analise_critica)}
                                                </Label>
                                            )}
                                        </TableCell>
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
            </Container>
            <CsvViewer csvContent={csvContent} fileName="documentos" />
        </>
    );
}