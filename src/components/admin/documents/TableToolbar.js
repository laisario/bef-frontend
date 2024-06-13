import { Search } from '@mui/icons-material';
import { Button, CircularProgress, FormControl, FormControlLabel, FormLabel, Grid, IconButton, InputAdornment, Radio, RadioGroup, TextField, Toolbar, Tooltip, Typography, alpha } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import React from 'react'
import useResponsive from '../../../hooks/useResponsive';

function TableToolbar(props) {
    const { numSelected, deleteDocuments, isDeleting, filter, setFilter, form } = props;
    const isDesktop = useResponsive('up', 'md');
    const clearFilters = () => {
        form.reset()
    }

    const status = form.watch("status")

    return (
        <Toolbar
            sx={{
                background: (theme) => theme.palette.grey[300],
                color: (theme) => theme.palette.grey[900],
                ...(numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                p: 2,
                borderRadius: "4px"
            }}
        >
            {numSelected > 0 && (
                <Typography
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected.length > 1 ? `${numSelected} selecionados` : `${numSelected} selecionado`}
                </Typography>
            )}
            {numSelected === 0 &&
                <Grid container justifyContent="space-between" alignItems="center">
                    <Grid item sm={6} xs={filter ? 12 : 10}>
                        <TextField
                            label='Busque título'
                            id='search-bar'
                            fullWidth
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Search />
                                    </InputAdornment>
                                ),
                            }}
                            {...form.register("search")}
                        />
                    </Grid>
                    {filter && (
                        <Grid item sm={4} xs={12} my={!isDesktop && 1}>
                            <FormControl>
                                <FormLabel id="status-filter">Status</FormLabel>
                                <RadioGroup
                                    row
                                    aria-labelledby="status-filter"
                                    name="status"
                                >
                                    <FormControlLabel value="V" control={<Radio checked={status === "V"} {...form.register("status")} />} label="Vigente" />
                                    <FormControlLabel value="O" control={<Radio checked={status === "O"} {...form.register("status")} />} label="Obsoleto" />
                                    <FormControlLabel value="C" control={<Radio checked={status === "C"} {...form.register("status")} />} label="Cancelado" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                    )}
                    <Grid item sm={1}>
                        {filter && (
                            <Tooltip title="Limpar filtros">
                                <IconButton onClick={clearFilters}>
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
            }


            {numSelected > 0 && (
                <Tooltip title="Deletar">
                    {isDeleting ? <CircularProgress /> : <IconButton onClick={deleteDocuments}>
                        <DeleteIcon />
                    </IconButton>}
                </Tooltip>
            )}
        </Toolbar>
    );
}

export default TableToolbar