import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <main className="mx-auto grid min-h-[60vh] w-full max-w-4xl place-items-center px-6 py-16 text-center">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-10 shadow-soft">
        <p className="text-xs uppercase tracking-[0.28em] text-slate-500">404</p>
        <h1 className="mt-3 text-3xl font-bold text-brand-navy">That route is not wired yet.</h1>
        <p className="mt-3 text-slate-600">
          Let’s send it back to the homepage and keep building the church site one route at a time.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-full bg-brand-navy px-5 py-2.5 text-sm font-semibold text-white"
        >
          Return home
        </Link>
      </div>
    </main>
  );
}
