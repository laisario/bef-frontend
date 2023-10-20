import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
import AuthLayout from './layouts/auth';
//
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
        { path: 'products', element: <ProductsPage /> },
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
  ]);

  return routes;
}
