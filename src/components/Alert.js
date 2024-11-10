import { Snackbar, Stack } from '@mui/material';
import React from 'react';

const vertical =  'top';
const horizontal = 'center';

function Alert({open, setOpen, texto, severity = 'success'}) {
  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false)
  };

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Snackbar
        open={open}
        anchorOrigin={{ vertical, horizontal }}
        key={vertical + horizontal}
        onClose={handleCloseAlert}
      >
        <Alert onClose={handleCloseAlert} severity={severity} sx={{ width: '100%' }}>
          {texto}
        </Alert>
      </Snackbar>
    </Stack>
  );
}

export default Alert;
