import { Search } from '@mui/icons-material';
import { CircularProgress, IconButton, InputAdornment, TextField, Toolbar, Tooltip, Typography, alpha } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import React from 'react'

function TableToolbar(props) {
    const { numSelected, deleteDocuments, isDeleting, search, setSearch } = props;
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
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            {numSelected > 0 && (
                <Typography
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    { numSelected.length > 1 ? `${numSelected} selecionados` :  `${numSelected} selecionado`}
                </Typography>
            )}
            {numSelected === 0 &&
                <TextField
                    label='Procure um documento'
                    id='search-bar'
                    value={search}
                    sx={{ width: '60%' }}
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