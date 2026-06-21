import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <main className="grid min-h-[60vh] place-items-center">
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-10 text-center shadow-soft">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">404</p>
        <h1 className="mt-3 text-3xl font-bold text-white">Admin route not found</h1>
        <p className="mt-3 text-slate-300">
          This screen is not connected yet. Head back to the dashboard and keep building.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-full bg-brand-gold px-5 py-2.5 text-sm font-semibold text-brand-navy"
        >
          Back to dashboard
        </Link>
      </div>
    </main>
  );
}
