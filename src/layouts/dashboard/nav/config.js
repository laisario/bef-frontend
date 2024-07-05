import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HomeIcon from '@mui/icons-material/Home';
import ScaleIcon from '@mui/icons-material/Scale';

// ----------------------------------------------------------------------

const navConfig = [
  {
    title: 'pagina inicial',
    path: '/dashboard/app',
    icon: <HomeIcon/>,
  },
  {
    title: 'meus instrumentos',
    path: '/dashboard/produtos',
    icon: <ScaleIcon/>,
  },
  {
    title: 'minhas propostas',
    path: '/dashboard/propostas',
    icon: <ShoppingCartIcon/>,
  },
];

export default navConfig;