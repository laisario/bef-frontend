import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import AdminLayout from './layouts/admin';
import SimpleLayout from './layouts/simple';
import AuthLayout from './layouts/auth';
//
import DocumentosPage from './pages/admin/DocumentosPage';
import BlogPage from './pages/BlogPage';
import PedidosPage from './pages/Orders';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';
import OrderDetails from './pages/OrderDetails';
import RegisterAuthPage from './pages/register/auth';
import RegisterBasicsPage from './pages/register/basics';
import RegisterLocationPage from './pages/register/location';
import PedidosPageAdmin from './pages/admin/PedidosPageAdmin';
import DetalhesPedidoPageAdmin from './pages/admin/DetalhesPedidoPageAdmin';
import HomePageAdmin from './pages/admin/HomePageAdmin';
import ProductDetailPage from './pages/ProductDetailPage';
import ProductsPageAdmin from './pages/admin/ProductsPageAdmin';

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'pedidos', element: <PedidosPage /> },
        { path: 'pedido/:id', element: <OrderDetails /> },
        { path: 'produtos', element: <ProductsPage /> },
        { path: 'produto/:id', element: <ProductDetailPage /> },
        { path: 'blog', element: <BlogPage /> },
      ],
    },
    {
      path: '/',
      element: <AuthLayout />,
      children: [
        { element: <Navigate to="/login" />, index: true },
        { path: 'login', element: <LoginPage /> },
      ],
    },
    {
      path: '/register',
      element: <AuthLayout />,
      children: [
        { element: <Navigate to="/register/basics" />, index: true },
        { path: 'auth', element: <RegisterAuthPage /> },
        { path: 'basics', element: <RegisterBasicsPage /> },
        { path: 'location', element: <RegisterLocationPage /> },
      ],
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
    {
      path: '/admin',
      element: <AdminLayout />,
      children: [
        { element: <Navigate to="/admin/home" />, index: true },
        { path: 'home', element: <HomePageAdmin /> },
        { path: 'pedidos', element: <PedidosPageAdmin /> },
        { path: 'pedido/:id', element: <DetalhesPedidoPageAdmin /> },
        { path: 'produtos', element: <ProductsPageAdmin/> },
        { path: 'documentos', element: <DocumentosPage /> },
      ],
    },
  ]);

  return routes;
}
