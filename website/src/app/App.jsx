import { RouterProvider } from 'react-router-dom';
import { router } from './routes.jsx';
import { AppProviders } from './providers.jsx';
import { CookieConsent } from '../components/common/CookieConsent.jsx';

export function App() {
  return (
    <AppProviders>
      <RouterProvider router={router} />
      <CookieConsent />
    </AppProviders>
  );
}
