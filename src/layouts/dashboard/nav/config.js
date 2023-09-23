// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'pagina inicial',
    path: '/dashboard/app',
    icon: icon('ic_analytics'),
  },
  {
    title: 'meus instrumentos',
    path: '/dashboard/products',
    icon: icon('ic_user'),
  },
  {
    title: 'meus pedidos',
    path: '/dashboard/user',
    icon: icon('ic_cart'),
  },
];

export default navConfig;
