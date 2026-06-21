import AdminHeader from './components/layout/AdminHeader';
import DashboardPage from './pages/DashboardPage';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <AdminHeader />
      <DashboardPage />
    </div>
  );
}
