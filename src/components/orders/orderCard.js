import { Card, Grid, Typography } from '@mui/material';
import React from 'react';

function CardInformation({ title, content, colorText='grey' }) {
  console.log(colorText)
  return (
    <Grid item sx={{ padding: 2 }} md={2}>
      <Card sx={{ padding: 2 }}>
        <Typography sx={{ paddingBottom: 2 }} fontWeight="200" color={'grey'} variant="body2">
          {title}
        </Typography>
        <Typography color={colorText} fontWeight={colorText !== 'grey'? null:"900"}>
          {content}
        </Typography>
      </Card>
    </Grid>
  );
}

export default CardInformation;
