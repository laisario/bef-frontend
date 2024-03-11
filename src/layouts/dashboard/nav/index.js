import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
// @mui
import { styled, alpha } from '@mui/material/styles';
import { Box, Link, Button, Drawer, Typography, Stack } from '@mui/material';
// mock
import account from '../../../_mock/account';
// hooks
import useResponsive from '../../../hooks/useResponsive';
// components
import Logo from '../../../components/logo';
import Scrollbar from '../../../components/scrollbar';
import NavSection from '../../../components/nav-section';
import { Avatar } from '../../../components/avatar'
import Iconify from '../../../components/iconify';
import { useAuth } from '../../../context/Auth';
//
import navConfig from './config';

// ----------------------------------------------------------------------

const NAV_WIDTH = 280;

const StyledAccount = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha(theme.palette.grey[500], 0.12),
}));

// ----------------------------------------------------------------------

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

export default function Nav({ openNav, onCloseNav }) {
  const { pathname } = useLocation();
  const { id } = useParams();
  const { user } = useAuth();

  const isDesktop = useResponsive('up', 'lg');
  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: '100%',
        flex: 1,
        '& .simplebar-content': { height: '100%', display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'space-between' },
        '& .simplebar-content::before': { display: 'none' },
        '& .simplebar-content::after': { display: 'none' },
        py: 5
      }}
    >
      <Box>
        <Box px={5} sx={{ display: 'inline-flex', justifyContent: 'center' }}>
          <Logo />
        </Box>

        <Box sx={{ my: 5, mx: 2.5 }}>
          <Link underline="none">
            <StyledAccount>
              <Avatar size={36} />

              <Box sx={{ ml: 2 }}>
                <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                  {user?.nome || ''} 
                </Typography>
              </Box>
            </StyledAccount>
          </Link>
        </Box>

        <NavSection data={navConfig} />
      </Box>

      <Box>
        <Stack alignItems="center" spacing={3} px={2}>
          <Box
            component="img"
            src="/assets/illustrations/illustration_avatar.png"
            sx={{ width: 100 }}
          />

          <Box sx={{ textAlign: 'center' }}>
            <Typography gutterBottom variant="h6">
              Precisando
               de uma calibração ai?
            </Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Calibre seus instrumentos a partir de R$ 35,00
            </Typography>
          </Box>

          <Button href="#/dashboard/pedidos" startIcon={<Iconify icon="eva:plus-fill" />} variant="contained">
            Novo pedido
          </Button>
        </Stack>
      </Box>
    </Scrollbar>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV_WIDTH },
      }}
    >
      {isDesktop ? (
        <Drawer
          open
          variant="permanent"
          PaperProps={{
            sx: {
              width: NAV_WIDTH,
              bgcolor: 'background.default',
              borderRightStyle: 'dashed',
            },
          }}
        >
          {renderContent}
        </Drawer>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            sx: { width: NAV_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}
