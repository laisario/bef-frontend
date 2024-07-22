import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
import AuthLayout from './layouts/auth';
// pages
import Documents from './pages/admin/Documents';
import DocumentsDetails from './pages/admin/DocumentsDetails';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import Instruments from './pages/Instruments';
import DashboardApp from './pages/DashboardApp';
import RegisterAuthPage from './pages/register/auth';
import RegisterBasicsPage from './pages/register/basics';
import RegisterLocationPage from './pages/register/location';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import InstrumentDetails from './pages/InstrumentDetails';
import DocumentRevisions from './pages/admin/DocumentRevisions';
import ClientDetails from './pages/admin/ClientDetails';
import Clients from './pages/admin/Clients';

export default function Router() {
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout admin={false} />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <DashboardApp /> },
        { path: 'propostas', element: <Orders /> },
        { path: 'proposta/:id', element: <OrderDetails /> },
        { path: 'instrumentos', element: <Instruments /> },
        { path: 'instrumento/:id', element: <InstrumentDetails /> },
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
      element: <DashboardLayout/>,
      children: [
        { element: <Navigate to="/admin/app" />, index: true },
        { path: 'app', element: <DashboardApp /> },
        { path: 'propostas', element: <Orders /> },
        { path: 'proposta/:id', element: <OrderDetails /> },
        { path: 'documentos', element: <Documents /> },
        { path: 'documento/:id/:idRevisao', element: <DocumentsDetails /> },
        { path: 'documento/:id/revisoes', element: <DocumentRevisions />},
        { path: 'clientes', element: <Clients />},
        { path: 'cliente/:id', element: <ClientDetails />},
      ],
    },
  ]);

  return routes;
}
