import { Route, Routes } from 'react-router-dom';
import SiteFooter from './components/layout/SiteFooter';
import SiteHeader from './components/layout/SiteHeader';
import ContentPage from './pages/ContentPage';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import { siteRouteEntries } from './routes/siteRoutes';

export default function App() {
  const contentRoutes = siteRouteEntries.filter((route) => route.path !== '/');

  return (
    <div className="min-h-screen bg-brand-light text-slate-900">
      <SiteHeader />
      <Routes>
        <Route path="/" element={<HomePage />} />
        {contentRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={<ContentPage route={route} />} />
        ))}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <SiteFooter />
    </div>
  );
}
