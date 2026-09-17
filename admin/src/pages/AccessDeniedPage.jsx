import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';

export default function AccessDeniedPage() {
  const { user, isAuthorized, signOut } = useAuth();
  const navigate = useNavigate();
  const [signingOut, setSigningOut] = useState(false);

  if (isAuthorized) {
    return <Navigate to="/" replace />;
  }

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await signOut();
      navigate('/sign-in', { replace: true });
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 px-6 text-slate-100">
      <section className="w-full max-w-xl rounded-[2rem] border border-amber-300/20 bg-white/5 p-8 shadow-soft">
        <p className="text-xs uppercase tracking-[0.28em] text-brand-gold">Access restricted</p>
        <h1 className="mt-3 text-3xl font-bold">Your account is not an admin account</h1>
        <p className="mt-4 leading-7 text-slate-300">{user?.email || 'This account'} signed in successfully but has no SSMI admin role. Ask a super administrator to grant access, then sign in again.</p>
        <button type="button" onClick={handleSignOut} disabled={signingOut} className="mt-6 rounded-xl border border-white/15 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">{signingOut ? 'Signing out…' : 'Sign out'}</button>
      </section>
    </main>
  );
}
