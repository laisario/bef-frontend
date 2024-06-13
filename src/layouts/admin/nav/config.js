// component
import DescriptionIcon from '@mui/icons-material/Description';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HomeIcon from '@mui/icons-material/Home';
import ScaleIcon from '@mui/icons-material/Scale';

// ----------------------------------------------------------------------

const navConfig = [
  {
    title: 'pagina inicial',
    path: '/admin/app',
    icon: <HomeIcon/>,
  },
  {
    title: 'Instrumentos',
    path: '/admin/produtos',
    icon: <ScaleIcon/>,
  },
  {
    title: 'propostas',
    path: '/admin/propostas',
    icon: <ShoppingCartIcon/>,
  },
  {
    title: 'Documentos',
    path: '/admin/documentos',
    icon: <DescriptionIcon/>
  },
];

export default navConfig;