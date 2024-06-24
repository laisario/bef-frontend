import { useState } from 'react';
import { Button, FormControl, FormControlLabel, FormLabel, Grid, IconButton, InputAdornment, Radio, RadioGroup, TextField, Toolbar, Tooltip, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import { Search } from '@mui/icons-material';
import { useWatch } from 'react-hook-form';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import useResponsive from '../../hooks/useResponsive';
import useOrders from '../../hooks/useOrders';

function TableToolbar({ numSelected, form, selectedOrders, admin }) {
    const [filter, setFilter] = useState(false)
    const {
        dateStart,
        dateStop,
        status,
    } = useWatch({ control: form.control })
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
                    <Grid container display="flex" justifyContent="space-between" alignItems="center">
                        <Grid item sm={filter ? 4 : 6} xs={filter ? 12 : 10}>
                            <TextField
                                label={admin ? 'Procure cliente ou número da proposta' : 'Procure pelo número da proposta'}
                                {...form.register("search")}
                                name="search"
                                id='search-bar'
                                fullWidth
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Search />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        {filter && (
                            <>
                                <Grid item sm={2} xs={12} marginY={isDesktop ? 0 : 1}>
                                    <FormControl>
                                        <FormLabel id="status-filter">Status</FormLabel>
                                        <RadioGroup
                                            row
                                            aria-labelledby="status-filter"
                                            name="status"
                                        >
                                            <FormControlLabel value="A" control={<Radio checked={status === "A"} {...form.register("status")} />} label="Aguardando análise B&F" />
                                            <FormControlLabel value="F" control={<Radio checked={status === "F"} {...form.register("status")} />} label={admin ? "Finalizada" : "Aguardando minha análise"} />
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                                <Grid container item sm={4} sx={12} spacing={1} alignItems="center" my={admin && isDesktop ? 0 : 1} >
                                    <Grid item sm={5} xs={4}>
                                        <DatePicker
                                            label="Ínicio"
                                            name="dateStart"
                                            {...form.register("dateStart")}
                                            value={dateStart}
                                            onChange={newValue => form.setValue("dateStart", newValue)}
                                        />
                                    </Grid>
                                    <Grid item sm={5} xs={4}>
                                        <DatePicker
                                            label="Fim"
                                            name="dateStop"
                                            {...form.register("dateStop")}
                                            value={dateStop}
                                            onChange={newValue => form.setValue("dateStop", newValue)}
                                        />
                                    </Grid>
                                    <Grid item sm={1} xs={1}>
                                        <Button variant="contained" onClick={() => form.setValue("filterByDate", true)} >Filtrar</Button>
                                    </Grid>
                                </Grid>
                            </>
                        )}
                        <Grid item sm={1} xs={filter ? 4 : 1} alignItems="flex-end">
                            {filter && (
                                <Tooltip title="Limpar filtros">
                                    <IconButton onClick={resetFilters}>
                                        <ClearAllIcon />
                                    </IconButton>
                                </Tooltip>
                            )}
                            <Tooltip title="Filtrar">
                                <IconButton onClick={() => setFilter((oldFilter) => !oldFilter)}>
                                    <FilterListIcon />
                                </IconButton>
                            </Tooltip>
                        </Grid>
                    </Grid>
                )}

                {numSelected > 0 && (
                    <Tooltip title="Delete">
                        <IconButton>
                            <DeleteIcon onClick={() => deleteOrder(selectedOrders)} />
                        </IconButton>
                    </Tooltip>
                )}
            </Toolbar>
        </LocalizationProvider>
    );
}

export default TableToolbar