import { Grid, Typography } from '@mui/material';
import React from 'react';

function TitleCard({title}) {
  return (
    <Grid sx={{ padding: 2 }} md={2} item>
      <Typography variant='h6'>{title}</Typography>
    </Grid>
  );
}

export default TitleCard;
