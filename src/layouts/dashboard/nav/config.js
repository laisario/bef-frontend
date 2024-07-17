import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HomeIcon from '@mui/icons-material/Home';
import ScaleIcon from '@mui/icons-material/Scale';
import DescriptionIcon from '@mui/icons-material/Description';
// ----------------------------------------------------------------------

export const navConfig = [
  {
    title: 'pagina inicial',
    path: '/dashboard/app',
    icon: <HomeIcon />,
  },
  {
    title: 'meus instrumentos',
    path: '/dashboard/instrumentos',
    icon: <ScaleIcon />,
  },
  {
    title: 'minhas propostas',
    path: '/dashboard/propostas',
    icon: <ShoppingCartIcon />,
  },
];

export const navConfigAdmin = [
  {
    title: 'pagina inicial',
    path: '/admin/app',
    icon: <HomeIcon />,
  },
  {
    title: 'Instrumentos',
    path: '/admin/instrumentos',
    icon: <ScaleIcon />,
  },
  {
    title: 'propostas',
    path: '/admin/propostas',
    icon: <ShoppingCartIcon />,
  },
  {
    title: 'Documentos',
    path: '/admin/documentos',
    icon: <DescriptionIcon />
  },
]

