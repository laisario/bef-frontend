import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from 'react-query';

// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// auth
import AuthProvider from './context/Auth';
// components
import { StyledChart } from './components/chart';
import ScrollToTop from './components/scroll-to-top';

// ----------------------------------------------------------------------

const queryClient = new QueryClient();

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider>
            <QueryClientProvider client={queryClient}>
              <ScrollToTop />
              <StyledChart />
              <Router />
            </QueryClientProvider>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}
