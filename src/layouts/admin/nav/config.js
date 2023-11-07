// component
import SvgColor from '../../../components/svg-color';


// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'pagina inicial',
    path: '/admin/home',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Instrumentos',
    path: '/admin/produtos',
    icon: icon('ic_user'),
  },
  {
    title: 'Pedidos',
    path: '/admin/pedidos',
    icon: icon('ic_cart'),
  },
];

export default navConfig;