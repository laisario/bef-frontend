import { useState } from 'react';
import { Grid, IconButton, InputAdornment, TextField, Toolbar, Tooltip, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Search } from '@mui/icons-material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import useResponsive from '../../hooks/useResponsive';
import useOrders from '../../hooks/useOrders';
import OrderFilterSidebar from './OrderFilterSidebar';

function TableToolbar({ numSelected, form, selectedOrders, admin, setSelectedOrders }) {
    const [filter, setFilter] = useState(false)
    const { deleteOrder } = useOrders()
    const isDesktop = useResponsive('up', 'md');
    const resetFilters = () => {
        form.reset()
    }

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
                {admin && numSelected > 0 ? (
                    <Typography
                        sx={{ flex: '1 1 100%' }}
                        color="inherit"
                        variant="subtitle1"
                        component="div"
                    >
                        {numSelected.length > 1 ? `${numSelected} selecionados` : `${numSelected} selecionado`}
                    </Typography>
                ) : (
                    <Grid container display="flex" justifyContent="space-between" alignItems="center">
                        <Grid item sm={6} xs={9}>
                            <TextField
                                label={admin ? 'Busque cliente ou número' : 'Busque número'}
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
                        <OrderFilterSidebar
                            openFilter={filter}
                            onOpenFilter={() => setFilter(true)}
                            onCloseFilter={() => setFilter(false)}
                            form={form}
                            resetFilters={resetFilters}
                        />
                    </Grid>
                )}

                {admin && numSelected > 0 && (
                    <Tooltip title="Delete">
                        <IconButton>
                            <DeleteIcon onClick={() => {deleteOrder(selectedOrders); setSelectedOrders([])}} />
                        </IconButton>
                    </Tooltip>
                )}
            </Toolbar>
        </LocalizationProvider>
    );
}

export default TableToolbar