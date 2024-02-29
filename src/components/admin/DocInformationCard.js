import { Box, Button, Card, CardActions, CardContent, Chip, Typography } from '@mui/material'
import React from 'react'
import titleCase from '../../utils/formatTitle';

function DocInformationCard({data, status, statusColor, setOpenFormRevision}) {
    return (
        <Card variant="outlined">
            <CardContent sx={{ bgcolor: 'background.paper', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Box>
                    {data?.titulo &&
                        <Typography variant="h5" component="div">
                            {titleCase(data?.titulo)}
                        </Typography>
                    }
                    {data?.identificador &&
                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                            {data?.identificador}
                        </Typography>
                    }
                    {data?.elaborador &&
                        <Typography sx={{ mt: 1.5 }} variant="body2">
                            <strong>Elaborador:</strong> {titleCase(data?.elaborador)}
                        </Typography>
                    }
                    {data?.codigo?.codigo &&
                        <Typography sx={{ mt: 1 }} variant="body2">
                            <strong>Código: </strong>{data?.codigo?.codigo}
                        </Typography>
                    }
                    {!!data?.analise_critica &&
                        <Typography sx={{ mt: 1 }} variant="body2">
                            <strong>Análise Crítica: </strong>Em {data?.analise_critica} {+data?.analise_critica > 1 ? 'dias' : 'dia'}
                        </Typography>
                    }
                    {data?.data_revisao &&
                        <Typography sx={{ mt: 1 }} variant="body2">
                            <strong>Revisão:</strong>{data?.data_revisao}
                        </Typography>
                    }
                    {data?.validade &&
                        <Typography sx={{ mt: 1 }} variant="body2">
                            <strong>Validade: </strong>{data?.data_validade}
                        </Typography>
                    }
                    {!!data?.frequencia &&
                        <Typography sx={{ mt: 1 }} variant="body2">
                            <strong>Frequência: </strong>{data?.frequencia}
                        </Typography>
                    }
                    {!!data?.revisoes.length && <Typography sx={{ mt: 1 }} variant="body2">
                            <strong>Número revisões: </strong>{data?.revisoes?.length}
                        </Typography>}
                </Box>
                <Box>
                    {
                        data?.status &&
                        <Chip label={status[data?.status]} color={statusColor[data?.status]} />
                    }
                </Box>
            </CardContent>
            <CardActions sx={{ display: 'flex', flexDirection: 'row', justifyContent: "flex-end" }}>
                <Button variant="outlined" size="medium" onClick={() => setOpenFormRevision(true)}>Revisar</Button>
            </CardActions>
        </Card>
    )
}

export default DocInformationCard