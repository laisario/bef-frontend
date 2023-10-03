import { Grid, Typography } from '@mui/material'
import React from 'react'

function CardInformation({title, content}) {
  return (
    <Grid item sx={{padding: 2}} md={2}>
    <Typography fontWeight="200"color={'grey'} variant='body2'>
      {title}
    </Typography>
    <Typography color={'grey'}  fontWeight="900">
      {content}
    </Typography>
   </Grid>
  )
}

export default CardInformation;