import { Outlet } from 'react-router-dom';
// @mui
import { Container, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
// components
import Logo from '../../components/logo';

// ----------------------------------------------------------------------

const StyledRoot = styled(Container)(({ theme }) => ({
    display: 'flex',
    flex: 1,
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1
    }
  }));
  
  const LogoBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: theme.spacing(8),
    [theme.breakpoints.up('md')]: {
      marginBottom: 0,
    }
  }))
  
// ----------------------------------------------------------------------

export default function AuthLayout() {
    return (
        <>
            <StyledRoot maxWidth="lg">
                <LogoBox>
                    <Logo sx={{ maxWidth: 300 }} disabledLink />
                    <Typography color="grey.700" align="center" variant="h3">
                        Gestão Metrológica
                    </Typography>
                </LogoBox>
                <Outlet />
            </StyledRoot>
        </>
    );
}
