import { Outlet } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
// components
import Logo from '../../components/logo';

// ----------------------------------------------------------------------

const StyledHeader = styled('header')(({ theme }) => ({
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(2, 2, 0),
  },
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  justifyContent: 'center',
}));

// ----------------------------------------------------------------------

export default function SimpleLayout() {
  return (
    <>
      <StyledHeader>
        <Logo />
      </StyledHeader>

      <Outlet />
    </>
  );
}
