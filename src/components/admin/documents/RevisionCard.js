import { Alert, Button, Card, CardActions, CardContent, Typography, CircularProgress, Box, Grid } from '@mui/material';
import React, { useState } from 'react';
import { useTheme } from '@emotion/react';
import { useParams } from 'react-router-dom';
import DateRangeIcon from '@mui/icons-material/DateRange';
import PersonIcon from '@mui/icons-material/Person';
import useDocumentos from '../../../hooks/useDocumentos';
import { fDate } from '../../../utils/formatTime';
import { axios } from '../../../api';
import { useAuth } from '../../../context/Auth';

function RevisionCard({ revisao }) {
    const [errMsg, setErrMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { id } = useParams();
    const { refetch } = useDocumentos(id);
    const theme = useTheme();
    const { user } = useAuth()
    const handleAprovel = async () => {
        try {
            setIsLoading(true);
            await axios.post(`/documentos/${id}/aprovar/`, {
                revisao_id: revisao?.id,
            });
            setIsLoading(false);
            await refetch();
            return { error: false };
        } catch (error) {
            setIsLoading(false);
            setErrMsg(error.response.data.error);
            return { error: true };
        }
    };
    return (
        <Card sx={{ my: 2, backgroundColor: theme.palette.grey[300], }}>
            <CardContent sx={{ backgroundColor: theme.palette.background.paper }}>
                <Typography variant="body1">
                    <strong>Revisado {fDate(revisao?.data_revisao)}</strong>
                </Typography>
                <Typography variant='body2' color="text.secondary">
                    Por: {revisao?.revisor.username}
                </Typography>
                <Typography variant='body2' sx={{ mt: 1 }}>
                    <strong>Alteração:</strong>
                    <br />
                    <p dangerouslySetInnerHTML={{ __html: revisao?.alteracao }} />
                </Typography>
            </CardContent>
            {!!revisao?.aprovacoes?.length && (
                <CardContent>
                    <Typography variant='body2'><strong>Aprovações:</strong></Typography>
                    <Grid container flexDirection="row">
                        {revisao?.aprovacoes.map((aprovacao) => (<Grid key={aprovacao.id} item sx={{ backgroundColor: theme.palette.grey[400], p: 1, borderRadius: 1, mr: 2, mt: 1 }}>
                            <Box display="flex" flexDirection="row">
                                <PersonIcon />
                                <Typography variant='body2'>{aprovacao.aprovador.username}</Typography>
                            </Box>
                            <Box display="flex" flexDirection="row">
                                <DateRangeIcon />
                                <Typography variant='body2'>
                                    {fDate(aprovacao.data_aprovacao, 'dd MM yyyy')}
                                </Typography>
                            </Box>
                        </Grid>))}
                    </Grid>
                </CardContent>
            )}
            {!!errMsg && <Alert severity="error">{errMsg}</Alert>}
            {isLoading && <CircularProgress />}
            <CardActions sx={{ display: 'flex', flexDirection: 'row', justifyContent: "flex-end" }}>
                {revisao?.aprovadores?.includes(user.id) &&
                    <Button size="small" onClick={handleAprovel}>Aprovar</Button>
                }
            </CardActions>
        </Card>
    )
}

export default RevisionCard