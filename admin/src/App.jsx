import { Route, Routes } from 'react-router-dom';
import AdminHeader from './components/layout/AdminHeader';
import AdminSidebar from './components/layout/AdminSidebar';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';
import SectionPage from './pages/SectionPage';
import { adminRouteEntries } from './routes/adminRoutes';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <AdminHeader />
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[280px_1fr]">
        <AdminSidebar />
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          {adminRouteEntries.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<SectionPage section={route.section} />}
            />
          ))}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </div>
  );
}
