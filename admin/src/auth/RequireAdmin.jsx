import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';

export default function RequireAdmin({ children }) {
  const { loading, user, isAuthorized } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="grid min-h-screen place-items-center bg-slate-950 text-slate-300">Checking secure session…</div>;
  }

  if (!user) {
    return <Navigate to="/sign-in" replace state={{ from: location.pathname }} />;
  }

  if (!isAuthorized) {
    return <Navigate to="/access-denied" replace />;
  }

  return children;
}
