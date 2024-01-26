// component
import DescriptionIcon from '@mui/icons-material/Description';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HomeIcon from '@mui/icons-material/Home';
import ScaleIcon from '@mui/icons-material/Scale';
import SvgColor from '../../../components/scrollbar/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'pagina inicial',
    path: '/admin/home',
    icon: <HomeIcon/>,
  },
  {
    title: 'Instrumentos',
    path: '/admin/produtos',
    icon: <ScaleIcon/>,
  },
  {
    title: 'Pedidos',
    path: '/admin/pedidos',
    icon: <ShoppingCartIcon/>,
  },
  {
    title: 'Documentos',
    path: '/admin/documentos',
    icon: <DescriptionIcon/>
  },
];

export default navConfig;