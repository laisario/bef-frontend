import { Grid, IconButton, InputAdornment, TextField, Toolbar, Tooltip, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Search } from '@mui/icons-material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import useResponsive from '../../hooks/useResponsive';

function TableToolbar({ numSelected, form, selectedClients, deleteClients }) {
    const isDesktop = useResponsive('up', 'md');

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
            <Toolbar
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    p: isDesktop ? 1 : 2
                }}
            >
                {numSelected > 0 ? (
                    <Typography
                        sx={{ flex: '1 1 100%' }}
                        color="inherit"
                        variant="subtitle1"
                        component="div"
                    >
                        {numSelected.length > 1 ? `${numSelected} selecionados` : `${numSelected} selecionado`}
                    </Typography>
                ) : (
                    <Grid container display="flex" justifyContent="center" alignItems="center">
                        <Grid item sm={6} xs={12}>
                            <TextField
                                label='Busque'
                                placeholder='empresa...'
                                {...form.register("search")}
                                name="search"
                                id='search-bar'
                                fullWidth
                                size='small'
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Search />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                    </Grid>
                )}

                {numSelected > 0 && (
                    <Tooltip title="Delete">
                        <IconButton>
                            <DeleteIcon onClick={() => deleteClients(selectedClients)} />
                        </IconButton>
                    </Tooltip>
                )}
            </Toolbar>
        </LocalizationProvider>
    );
}

export default TableToolbar