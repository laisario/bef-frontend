import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { alpha } from '@mui/material/styles';
import { Button, FormControl, FormControlLabel, FormLabel, Grid, IconButton, InputAdornment, InputLabel, MenuItem, Radio, RadioGroup, Select, TextField, Toolbar, Tooltip, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Search } from '@mui/icons-material';
import { useWatch } from 'react-hook-form';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import useResponsive from '../../hooks/useResponsive';
import useOrders from '../../hooks/useOrders';

function TableToolbar(props) {
    const { numSelected, form, selectedOrders, admin } = props;
    const {
        dateStart,
        dateStop,
        status
    } = useWatch({ control: form.control })
    const { deleteOrder, refetch } = useOrders()
    const isDesktop = useResponsive('up', 'md');
    const resetFilters = () => {
        form.setValue("search", "")
        form.setValue("status", "")
        form.setValue("dateStart", "")
        form.setValue("dateStop", "")
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
                        {admin && (
                            <Grid item sm={4} xs={12}>
                                <TextField
                                    label='Procure cliente ou número da proposta'
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
                        )}
                        <Grid item sm={admin ? 1 : 6} xs={12} marginY={isDesktop ? 0 : 1}>
                            <FormControl>
                                <FormLabel id="status-filter">Status</FormLabel>
                                <RadioGroup
                                    row
                                    aria-labelledby="status-filter"
                                    name="status"
                                >
                                    <FormControlLabel value="A" control={<Radio {...form.register("status")} />} label="Aguardando análise B&F" />
                                    <FormControlLabel value="F" control={<Radio {...form.register("status")} />} label={admin ? "Finalizada" : "Aguardando minha análise"} />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        <Grid container item sm={admin ? 4 : 5} sx={12} spacing={1} alignItems="center" my={admin && isDesktop ? 0 : 1} >
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
                            <Grid item sm={2} xs={1}>
                                <Button variant="contained" onClick={() => refetch()} >Filtrar</Button>
                            </Grid>
                        </Grid>
                        <Grid item sm={admin ? 1 : 1 } xs={4} alignItems="flex-end">
                            <Button onClick={resetFilters}>
                                Apagar filtros
                            </Button>
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