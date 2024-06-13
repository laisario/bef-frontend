import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import AdminLayout from './layouts/admin';
import SimpleLayout from './layouts/simple';
import AuthLayout from './layouts/auth';
//
import Documents from './pages/admin/Documents';
import DocumentsDetails from './pages/admin/DocumentsDetails';
import Orders from './pages/Orders';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';
import OrderDetails from './pages/OrderDetails';
import RegisterAuthPage from './pages/register/auth';
import RegisterBasicsPage from './pages/register/basics';
import RegisterLocationPage from './pages/register/location';
import OrdersAdmin from './pages/admin/Orders';
import OrderDetailsAdmin from './pages/admin/OrderDetails';
import DashboardAppAdmin from './pages/admin/DashboardApp';
import ProductDetailPage from './pages/ProductDetailPage';
import ProductsPageAdmin from './pages/admin/ProductsPageAdmin';
import DocumentRevisions from './pages/admin/DocumentRevisions';

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'propostas', element: <Orders /> },
        { path: 'proposta/:id', element: <OrderDetails /> },
        { path: 'produtos', element: <ProductsPage /> },
        { path: 'produto/:id', element: <ProductDetailPage /> },
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
        { element: <Navigate to="/admin/app" />, index: true },
        { path: 'app', element: <DashboardAppAdmin /> },
        { path: 'propostas', element: <OrdersAdmin /> },
        { path: 'proposta/:id', element: <OrderDetailsAdmin /> },
        { path: 'produtos', element: <ProductsPageAdmin/> },
        { path: 'documentos', element: <Documents /> },
        { path: 'documento/:id', element: <DocumentsDetails /> },
        { path: 'documento/:id/revisoes', element: <DocumentRevisions />}
      ],
    },
  ]);

  return routes;
}
