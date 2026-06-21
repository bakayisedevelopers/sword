import HomePage from './pages/HomePage';
import SiteFooter from './components/layout/SiteFooter';
import SiteHeader from './components/layout/SiteHeader';

export default function App() {
  return (
    <div className="min-h-screen bg-brand-light text-slate-900">
      <SiteHeader />
      <HomePage />
      <SiteFooter />
    </div>
  );
}
