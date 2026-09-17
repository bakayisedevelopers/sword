import { RouterProvider } from 'react-router-dom';
import { router } from './routes.jsx';
import { AppProviders } from './providers.jsx';

export function App() {
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  );
}
